"""
ChromaDB Knowledge Client
Handles cloud ChromaDB connection (api.trychroma.com), Gemini text embeddings,
chunk upserts, and semantic search with relevance scoring for the OnBrain RAG layer.
"""

import hashlib
import logging
import math
import re
from typing import Any, Dict, List, Optional

import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# ChromaDB client — lazy singleton, auto-selects cloud vs local
# ---------------------------------------------------------------------------
_chroma_client = None
_collection = None
COLLECTION_NAME = "documents"
FALLBACK_EMBEDDING_DIMENSIONS = 384


def _get_chroma_client():
    global _chroma_client
    if _chroma_client is not None:
        return _chroma_client

    # Cloud client: if CHROMA_API_KEY + CHROMA_TENANT are set, use cloud
    if settings.CHROMA_API_KEY and settings.CHROMA_TENANT:
        try:
            import chromadb
            _chroma_client = chromadb.HttpClient(
                host=settings.CHROMA_HOST,
                headers={"x-chroma-token": settings.CHROMA_API_KEY},
                settings=chromadb.Settings(
                    chroma_client_auth_provider="chromadb.auth.token_authn.TokenAuthClientProvider",
                    chroma_client_auth_credentials=settings.CHROMA_API_KEY,
                    anonymized_telemetry=False,
                ),
            )
            logger.info(f"ChromaDB Cloud client initialized (host={settings.CHROMA_HOST})")
            return _chroma_client
        except Exception as e:
            logger.warning(f"ChromaDB Cloud init failed: {e}. Falling back to local client.")

    # Local Docker client fallback
    try:
        import chromadb
        _chroma_client = chromadb.HttpClient(
            host=settings.CHROMA_HOST,
            port=settings.CHROMA_PORT,
            settings=chromadb.Settings(anonymized_telemetry=False),
        )
        logger.info(f"ChromaDB local client initialized (host={settings.CHROMA_HOST}:{settings.CHROMA_PORT})")
        return _chroma_client
    except Exception as e:
        logger.error(f"ChromaDB local client also failed: {e}")
        raise


def get_collection():
    """Gets or creates the 'documents' collection. Uses cloud-aware embedding function."""
    global _collection
    if _collection is not None:
        return _collection

    client = _get_chroma_client()
    # Use manual embeddings (we call Gemini ourselves for full control)
    _collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},  # cosine similarity for relevance scoring
    )
    logger.info(f"ChromaDB collection '{COLLECTION_NAME}' ready.")
    return _collection


# ---------------------------------------------------------------------------
# Gemini Embedding — fallback chain (gemini-embedding-2 → gemini-embedding-001)
# ---------------------------------------------------------------------------

def _embed_text(text: str, task_type: str = "retrieval_document") -> List[float]:
    """Generate a Gemini embedding when available, otherwise a local stable vector."""
    api_key = settings.GEMINI_API_KEY
    if api_key and not api_key.startswith("your_"):
        try:
            genai.configure(api_key=api_key)
            try:
                result = genai.embed_content(model="models/gemini-embedding-2", content=text, task_type=task_type)
            except Exception:
                result = genai.embed_content(model="models/gemini-embedding-001", content=text, task_type=task_type)
            return result["embedding"]
        except Exception as exc:
            logger.warning("Gemini embeddings failed (%s); using local embeddings.", exc)
    return _fallback_embedding(text)


def _fallback_embedding(text: str) -> List[float]:
    """Dependency-free hashed bag-of-words embedding for local/demo reliability."""
    vector = [0.0] * FALLBACK_EMBEDDING_DIMENSIONS
    for token in re.findall(r"[a-z0-9][a-z0-9_-]*", text.lower()):
        digest = hashlib.blake2b(token.encode("utf-8"), digest_size=8).digest()
        index = int.from_bytes(digest[:4], "big") % FALLBACK_EMBEDDING_DIMENSIONS
        vector[index] += 1.0 if digest[4] & 1 else -1.0
    magnitude = math.sqrt(sum(value * value for value in vector))
    return [value / magnitude for value in vector] if magnitude else vector


# ---------------------------------------------------------------------------
# Chunk upsert — takes the normalizer's pre-chunked output
# ---------------------------------------------------------------------------

def upsert_document_chunks(normalized_doc: Dict[str, Any]) -> List[str]:
    """
    Embeds and upserts all pre-chunked text from a normalized document into ChromaDB.
    The normalizer already splits text into chunks — we just embed and store them.

    Returns list of chunk_ids successfully stored.
    """
    collection = get_collection()
    doc_id = normalized_doc["doc_id"]
    doc_type = normalized_doc["doc_type"]
    filename = normalized_doc["filename"]
    chunks = normalized_doc.get("chunks", [])

    if not chunks:
        logger.warning(f"No chunks found in normalized doc {doc_id} — skipping ChromaDB upsert.")
        return []

    stored_ids: List[str] = []

    for chunk in chunks:
        text = chunk.get("text", "").strip()
        if not text:
            continue

        chunk_id = chunk.get("chunk_id", f"{doc_id}_chunk_{chunk.get('chunk_index', 0)}")
        metadata = {
            "doc_id":          doc_id,
            "doc_type":        doc_type,
            "chunk_index":     chunk.get("chunk_index", 0),
            "page_number":     chunk.get("page_number", 1),
            "source_filename": filename,
        }

        # Generate embedding — skip chunk if embedding fails
        embedding = _embed_text(text, task_type="retrieval_document")
        if embedding is None:
            logger.warning(f"Skipping chunk {chunk_id} — embedding unavailable.")
            continue

        try:
            collection.upsert(
                ids=[chunk_id],
                documents=[text],
                embeddings=[embedding],
                metadatas=[metadata],
            )
            stored_ids.append(chunk_id)
        except Exception as e:
            logger.error(f"ChromaDB upsert failed for chunk {chunk_id}: {e}")

    logger.info(f"Upserted {len(stored_ids)}/{len(chunks)} chunks for doc {doc_id}")
    return stored_ids


# ---------------------------------------------------------------------------
# Semantic Search
# ---------------------------------------------------------------------------

def semantic_search(
    query: str,
    top_k: int = 5,
    doc_type_filter: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Embed query and find top_k most semantically similar chunks.
    Optionally filter by doc_type (e.g. 'manual', 'inspection_report').

    Returns ranked list of chunks with relevance scores (0–1, higher = more relevant).
    """
    query_embedding = _embed_text(query, task_type="retrieval_query")
    if query_embedding is None:
        logger.warning("Semantic search returning empty — no query embedding available.")
        return []

    collection = get_collection()
    where_filter = {"doc_type": doc_type_filter} if doc_type_filter else None

    try:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter,
            include=["documents", "metadatas", "distances"],
        )
    except Exception as e:
        logger.error(f"ChromaDB query failed: {e}")
        return []

    output: List[Dict[str, Any]] = []
    ids       = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for i, chunk_id in enumerate(ids):
        distance = distances[i] if i < len(distances) else 1.0
        # Cosine distance ∈ [0, 2] — convert to relevance score ∈ [0, 1]
        relevance_score = max(0.0, round(1.0 - (distance / 2.0), 4))
        meta = metadatas[i] if i < len(metadatas) else {}

        output.append({
            "chunk_id":        chunk_id,
            "text":            documents[i] if i < len(documents) else "",
            "doc_id":          meta.get("doc_id", ""),
            "doc_type":        meta.get("doc_type", ""),
            "page_number":     meta.get("page_number", 1),
            "source_filename": meta.get("source_filename", ""),
            "chunk_index":     meta.get("chunk_index", 0),
            "distance":        round(distance, 4),
            "relevance_score": relevance_score,
        })

    return output


# ---------------------------------------------------------------------------
# Deletion helper
# ---------------------------------------------------------------------------

def delete_document_chunks(doc_id: str) -> int:
    """Delete all chunks for a document from ChromaDB. Returns count deleted."""
    try:
        collection = get_collection()
        collection.delete(where={"doc_id": doc_id})
        logger.info(f"Deleted chunks for doc_id={doc_id}")
        return 1  # ChromaDB doesn't return delete count reliably
    except Exception as e:
        logger.error(f"ChromaDB delete failed for doc_id={doc_id}: {e}")
        return 0


# ---------------------------------------------------------------------------
# Module-level singleton wrapper
# ---------------------------------------------------------------------------

class _ChromaClient:
    def get_collection(self): return get_collection()
    def upsert_document_chunks(self, *a, **kw): return upsert_document_chunks(*a, **kw)
    def semantic_search(self, *a, **kw): return semantic_search(*a, **kw)
    def delete_document_chunks(self, *a, **kw): return delete_document_chunks(*a, **kw)


chroma_client = _ChromaClient()
