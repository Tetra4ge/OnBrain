"""
Knowledge Layer API Routes — Phase 4
Exposes semantic search, graph traversal, and document listing endpoints.
"""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.knowledge.chroma_client import chroma_client
from app.knowledge.neo4j_client import neo4j_client
from app.knowledge.mongo_client import mongo_client

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Knowledge Layer"])


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    doc_type_filter: Optional[str] = None  # e.g. "manual", "inspection_report"


# ---------------------------------------------------------------------------
# POST /api/search — semantic vector search
# ---------------------------------------------------------------------------

@router.post("/search")
async def semantic_search(request: SearchRequest) -> Dict[str, Any]:
    """
    Runs a semantic (embedding-based) search over all ingested document chunks.
    Returns ranked results with relevance scores and source citations.
    Optionally scoped to a specific doc_type (e.g. 'manual' for OEM specs).
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")

    try:
        results = chroma_client.semantic_search(
            query=request.query,
            top_k=request.top_k,
            doc_type_filter=request.doc_type_filter,
        )
    except Exception as e:
        logger.error(f"Semantic search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    return {
        "query":   request.query,
        "count":   len(results),
        "results": results,
    }


# ---------------------------------------------------------------------------
# GET /api/graph/equipment/{tag} — graph traversal
# ---------------------------------------------------------------------------

@router.get("/graph/equipment/{tag}")
async def get_equipment_graph(tag: str) -> Dict[str, Any]:
    """
    Returns the equipment node for the given tag plus all directly connected
    nodes up to 2 hops (work orders, failures, procedures, regulations).
    Used by the Graph Explorer UI and the RCA agent.
    """
    if not tag.strip():
        raise HTTPException(status_code=400, detail="Equipment tag cannot be empty.")

    try:
        graph = neo4j_client.get_equipment_graph(tag.upper())
    except Exception as e:
        logger.error(f"Graph traversal error for tag={tag}: {e}")
        raise HTTPException(status_code=500, detail=f"Graph query failed: {str(e)}")

    if not graph:
        raise HTTPException(
            status_code=404,
            detail=f"Equipment tag '{tag}' not found in the knowledge graph.",
        )

    return graph


# ---------------------------------------------------------------------------
# GET /api/graph/equipment — list all equipment tags (for RCA dropdown)
# ---------------------------------------------------------------------------

@router.get("/graph/equipment")
async def list_equipment_tags() -> Dict[str, Any]:
    """Returns all equipment tags currently in the Neo4j knowledge graph."""
    try:
        tags = neo4j_client.get_all_equipment_tags()
    except Exception as e:
        logger.error(f"Failed to list equipment tags: {e}")
        raise HTTPException(status_code=500, detail=f"Graph query failed: {str(e)}")

    return {"tags": tags, "count": len(tags)}


# ---------------------------------------------------------------------------
# GET /api/documents — list ingested documents (used by Document Explorer UI)
# ---------------------------------------------------------------------------

@router.get("/documents")
async def list_documents(
    doc_type: Optional[str] = Query(None, description="Filter by doc type: work_order | inspection_report | manual | regulation | pid"),
    limit:    int           = Query(50, ge=1, le=200),
    skip:     int           = Query(0, ge=0),
) -> Dict[str, Any]:
    """
    Lists all documents stored in MongoDB metadata store.
    Supports optional doc_type filtering and pagination.
    """
    try:
        docs  = mongo_client.list_documents(doc_type=doc_type, limit=limit, skip=skip)
        total = mongo_client.get_document_count(doc_type=doc_type)
    except Exception as e:
        logger.error(f"Document list failed: {e}")
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

    return {
        "total":     total,
        "count":     len(docs),
        "documents": docs,
    }


# ---------------------------------------------------------------------------
# GET /api/documents/{doc_id}/status — status polling (used by Upload Center UI)
# ---------------------------------------------------------------------------

@router.get("/documents/{doc_id}/status")
async def get_document_status(doc_id: str) -> Dict[str, Any]:
    """
    Returns the current ingestion sync status for a document.
    Polled by the frontend Upload Center after upload to show live progress.
    """
    try:
        doc = mongo_client.get_document(doc_id)
    except Exception as e:
        logger.error(f"Status check failed for doc_id={doc_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if not doc:
        raise HTTPException(
            status_code=404,
            detail=f"Document '{doc_id}' not found in metadata store.",
        )

    return {
        "doc_id":                 doc.get("doc_id"),
        "filename":               doc.get("filename"),
        "doc_type":               doc.get("doc_type"),
        "sync_status":            doc.get("sync_status"),
        "extracted_entity_count": doc.get("extracted_entity_count", 0),
        "chunk_count":            doc.get("chunk_count", 0),
        "confidence_avg":         doc.get("confidence_avg", 0.0),
        "neo4j_nodes":            len(doc.get("neo4j_node_ids", [])),
        "chroma_chunks":          len(doc.get("chroma_chunk_ids", [])),
        "error_log":              doc.get("error_log", []),
        "upload_date":            doc.get("upload_date"),
    }
