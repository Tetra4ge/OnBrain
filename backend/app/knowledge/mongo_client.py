"""
MongoDB Metadata Client
Stores document metadata records, sync statuses, and error logs.
Single collection 'documents' in the 'onbrain' database.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import DuplicateKeyError
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Singleton MongoClient — lazy init
# ---------------------------------------------------------------------------
_mongo_client = None
_db = None
_collection = None

DB_NAME         = "onbrain"
COLLECTION_NAME = "documents"


def _get_collection():
    global _mongo_client, _db, _collection
    if _collection is not None:
        return _collection

    _mongo_client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
    # Verify connection on first use
    _mongo_client.admin.command("ping")
    logger.info(f"MongoDB connected: {settings.MONGO_URI}")

    _db = _mongo_client[DB_NAME]
    _collection = _db[COLLECTION_NAME]

    # Create indexes — idempotent
    _collection.create_index("doc_id", unique=True)
    _collection.create_index("sync_status")
    _collection.create_index("doc_type")
    _collection.create_index([("upload_date", DESCENDING)])
    logger.info(f"MongoDB collection '{COLLECTION_NAME}' indexes ensured.")

    return _collection


# ---------------------------------------------------------------------------
# CRUD operations
# ---------------------------------------------------------------------------

def create_document_record(normalized_doc: Dict[str, Any]) -> str:
    """
    Insert a new document metadata record with sync_status='pending'.
    If a record with the same doc_id exists (re-ingest), update instead.
    Returns the doc_id.
    """
    col = _get_collection()
    doc_id = normalized_doc["doc_id"]

    record = {
        "doc_id":                  doc_id,
        "filename":                normalized_doc.get("filename", ""),
        "doc_type":                normalized_doc.get("doc_type", "manual"),
        "upload_date":             normalized_doc.get("upload_date",
                                       datetime.now(timezone.utc).isoformat()),
        "uploaded_by":             normalized_doc.get("uploaded_by", "system"),
        "sync_status":             "pending",
        "chroma_chunk_ids":        [],
        "neo4j_node_ids":          [],
        "extracted_entity_count":  normalized_doc.get("extracted_entity_count", 0),
        "confidence_avg":          normalized_doc.get("confidence_avg", 0.0),
        "chunk_count":             normalized_doc.get("chunk_count", 0),
        "error_log":               [],
    }

    try:
        col.insert_one({"_id": doc_id, **record})
        logger.info(f"MongoDB record created for doc_id={doc_id}")
    except DuplicateKeyError:
        # Re-ingestion — reset record to pending
        col.replace_one({"_id": doc_id}, {"_id": doc_id, **record})
        logger.info(f"MongoDB record reset (re-ingest) for doc_id={doc_id}")

    return doc_id


def update_sync_status(doc_id: str, status: str) -> None:
    """Update the sync_status field for a document record."""
    col = _get_collection()
    col.update_one(
        {"_id": doc_id},
        {"$set": {"sync_status": status}},
    )
    logger.debug(f"sync_status={status} for doc_id={doc_id}")


def update_store_ids(
    doc_id: str,
    chroma_chunk_ids: List[str],
    neo4j_node_ids: List[str],
) -> None:
    """Update the list of IDs written to ChromaDB and Neo4j for a document."""
    col = _get_collection()
    col.update_one(
        {"_id": doc_id},
        {"$set": {
            "chroma_chunk_ids": chroma_chunk_ids,
            "neo4j_node_ids":   neo4j_node_ids,
        }},
    )


def append_error(doc_id: str, error_msg: str) -> None:
    """Append an error string to the document's error_log array."""
    col = _get_collection()
    col.update_one(
        {"_id": doc_id},
        {"$push": {"error_log": error_msg}},
    )
    logger.warning(f"Error logged for doc_id={doc_id}: {error_msg}")


def get_document(doc_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single document metadata record by doc_id."""
    col = _get_collection()
    record = col.find_one({"_id": doc_id})
    if record:
        record["doc_id"] = record.pop("_id")
    return record


def list_documents(
    doc_type: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
) -> List[Dict[str, Any]]:
    """
    List document metadata records. Optionally filter by doc_type.
    Returns records sorted newest-first.
    """
    col = _get_collection()
    query = {}
    if doc_type:
        query["doc_type"] = doc_type

    cursor = (
        col.find(query)
        .sort("upload_date", DESCENDING)
        .skip(skip)
        .limit(limit)
    )
    results = []
    for record in cursor:
        record["doc_id"] = record.pop("_id")
        results.append(record)
    return results


def get_document_count(doc_type: Optional[str] = None) -> int:
    """Return total count of documents, optionally filtered by doc_type."""
    col = _get_collection()
    query = {"doc_type": doc_type} if doc_type else {}
    return col.count_documents(query)


# ---------------------------------------------------------------------------
# Module-level singleton wrapper
# ---------------------------------------------------------------------------

class _MongoClient:
    def create_document_record(self, *a, **kw): return create_document_record(*a, **kw)
    def update_sync_status(self, *a, **kw): return update_sync_status(*a, **kw)
    def update_store_ids(self, *a, **kw): return update_store_ids(*a, **kw)
    def append_error(self, *a, **kw): return append_error(*a, **kw)
    def get_document(self, *a, **kw): return get_document(*a, **kw)
    def list_documents(self, *a, **kw): return list_documents(*a, **kw)
    def get_document_count(self, *a, **kw): return get_document_count(*a, **kw)


mongo_client = _MongoClient()
