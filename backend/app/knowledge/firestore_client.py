"""Firestore persistence for document metadata and application state."""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from app.core.auth import firebase_app, firebase_init_error
from app.core.config import settings

logger = logging.getLogger(__name__)

DOCUMENTS_COLLECTION = settings.FIRESTORE_DOCUMENTS_COLLECTION


def _get_db():
    """Return the initialized Firestore client or a useful configuration error."""
    if firebase_app is None:
        raise RuntimeError(
            "Firestore is unavailable. Configure FIREBASE_SERVICE_ACCOUNT_PATH, "
            "FIREBASE_SERVICE_ACCOUNT_JSON, or Application Default Credentials. "
            f"Firebase initialization error: {firebase_init_error}"
        )
    return firestore.client(app=firebase_app)


def get_collection(name: str):
    """Return a named top-level Firestore collection."""
    return _get_db().collection(name)


def _documents():
    return get_collection(DOCUMENTS_COLLECTION)


def _record_from_snapshot(snapshot) -> Optional[Dict[str, Any]]:
    if not snapshot.exists:
        return None
    return {"doc_id": snapshot.id, **snapshot.to_dict()}


def create_document_record(normalized_doc: Dict[str, Any]) -> str:
    """Create or reset the Firestore metadata document for an ingestion run."""
    doc_id = normalized_doc["doc_id"]
    record = {
        "filename": normalized_doc.get("filename", ""),
        "doc_type": normalized_doc.get("doc_type", "manual"),
        "upload_date": normalized_doc.get("upload_date", datetime.now(timezone.utc).isoformat()),
        "uploaded_by": normalized_doc.get("uploaded_by", "system"),
        "sync_status": "pending",
        "chroma_chunk_ids": [],
        "neo4j_node_ids": [],
        "extracted_entity_count": normalized_doc.get("extracted_entity_count", 0),
        "confidence_avg": normalized_doc.get("confidence_avg", 0.0),
        "chunk_count": normalized_doc.get("chunk_count", 0),
        "error_log": [],
    }
    _documents().document(doc_id).set(record)
    logger.info("Firestore document record reset for doc_id=%s", doc_id)
    return doc_id


def update_sync_status(doc_id: str, status: str) -> None:
    _documents().document(doc_id).set({"sync_status": status}, merge=True)
    logger.debug("sync_status=%s for doc_id=%s", status, doc_id)


def update_store_ids(doc_id: str, chroma_chunk_ids: List[str], neo4j_node_ids: List[str]) -> None:
    _documents().document(doc_id).set(
        {"chroma_chunk_ids": chroma_chunk_ids, "neo4j_node_ids": neo4j_node_ids},
        merge=True,
    )


def append_error(doc_id: str, error_msg: str) -> None:
    _documents().document(doc_id).set(
        {"error_log": firestore.ArrayUnion([error_msg])}, merge=True
    )
    logger.warning("Error logged for doc_id=%s: %s", doc_id, error_msg)


def get_document(doc_id: str) -> Optional[Dict[str, Any]]:
    return _record_from_snapshot(_documents().document(doc_id).get())


def list_documents(doc_type: Optional[str] = None, limit: int = 50, skip: int = 0) -> List[Dict[str, Any]]:
    query = _documents().order_by("upload_date", direction=firestore.Query.DESCENDING)
    if doc_type:
        query = query.where(filter=FieldFilter("doc_type", "==", doc_type))
    snapshots = query.offset(skip).limit(limit).stream()
    return [_record_from_snapshot(snapshot) for snapshot in snapshots]


def get_document_count(doc_type: Optional[str] = None) -> int:
    query = _documents()
    if doc_type:
        query = query.where(filter=FieldFilter("doc_type", "==", doc_type))
    aggregation = query.count(alias="total").get()
    return aggregation[0][0].value if aggregation else 0


class _FirestoreClient:
    def create_document_record(self, *args, **kwargs): return create_document_record(*args, **kwargs)
    def update_sync_status(self, *args, **kwargs): return update_sync_status(*args, **kwargs)
    def update_store_ids(self, *args, **kwargs): return update_store_ids(*args, **kwargs)
    def append_error(self, *args, **kwargs): return append_error(*args, **kwargs)
    def get_document(self, *args, **kwargs): return get_document(*args, **kwargs)
    def list_documents(self, *args, **kwargs): return list_documents(*args, **kwargs)
    def get_document_count(self, *args, **kwargs): return get_document_count(*args, **kwargs)


firestore_client = _FirestoreClient()
