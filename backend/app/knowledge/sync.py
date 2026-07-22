"""
Sync Orchestration — Phase 4 Knowledge Layer
Sequential write: Neo4j → ChromaDB → Firestore status update.
Per-document error isolation: any store failure is logged and surfaced as 
sync_status='partial'|'failed' — never crashes the entire ingestion call.
"""

import logging
from typing import Any, Dict

from app.knowledge.neo4j_client import neo4j_client
from app.knowledge.chroma_client import chroma_client
from app.knowledge.firestore_client import firestore_client

logger = logging.getLogger(__name__)


async def sync_document(normalized_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Orchestrates the 3-store write sequence for a single normalized document.

    Write order:
      1. Firestore — create pending record (tracking visible immediately)
      2. Neo4j     — upsert all entity nodes + relationships
      3. ChromaDB  — embed + upsert all text chunks
      4. Firestore — update with store IDs and final sync_status

    Returns a result dict with doc_id, sync_status, store counts, and any errors.
    """
    doc_id = normalized_doc.get("doc_id", "unknown")
    neo4j_ids: list = []
    chroma_ids: list = []
    errors: list = []

    # ── Step 1: Create a pending Firestore record FIRST so the document is always visible ──
    try:
        firestore_client.create_document_record(normalized_doc)
        logger.info(f"[sync] Firestore pending record created for {doc_id}")
    except Exception as e:
        err = f"Firestore initial record creation failed: {e}"
        logger.error(f"[sync] {err}")
        errors.append(err)
        # If Firestore is down we can't track anything — return early
        return {
            "doc_id":      doc_id,
            "sync_status": "failed",
            "neo4j_nodes": 0,
            "chroma_chunks": 0,
            "errors":      errors,
        }

    # ── Step 2: Write to Neo4j ──
    try:
        neo4j_ids = neo4j_client.write_all_entities(normalized_doc)
        expected_nodes = 1 + sum(
            len(values) for values in normalized_doc.get("extracted_entities", {}).values()
            if isinstance(values, list)
        )
        if len(neo4j_ids) < expected_nodes:
            raise RuntimeError(f"Knowledge graph wrote {len(neo4j_ids)}/{expected_nodes} expected nodes")
        rel_count = neo4j_client.write_relationships(
            _with_document_relationships(normalized_doc)
        )
        logger.info(
            f"[sync] Neo4j: {len(neo4j_ids)} nodes, {rel_count} relationships for {doc_id}"
        )
    except Exception as e:
        err = f"Neo4j write failed: {e}"
        logger.error(f"[sync] {err}")
        errors.append(err)
        firestore_client.append_error(doc_id, err)

    # ── Step 3: Write to ChromaDB ──
    try:
        chroma_ids = chroma_client.upsert_document_chunks(normalized_doc)
        if normalized_doc.get("chunks") and not chroma_ids:
            raise RuntimeError("No vector chunks were indexed")
        logger.info(f"[sync] ChromaDB: {len(chroma_ids)} chunks for {doc_id}")
    except Exception as e:
        err = f"ChromaDB write failed: {e}"
        logger.error(f"[sync] {err}")
        errors.append(err)
        firestore_client.append_error(doc_id, err)

    # ── Step 4: Determine final status and update Firestore ──
    if not errors:
        final_status = "complete"
    elif neo4j_ids or chroma_ids:
        final_status = "partial"   # at least one store succeeded
    else:
        final_status = "failed"    # both stores failed

    try:
        firestore_client.update_sync_status(doc_id, final_status)
        firestore_client.update_store_ids(doc_id, chroma_ids, neo4j_ids)
    except Exception as e:
        logger.error(f"[sync] Final Firestore status update failed for {doc_id}: {e}")

    logger.info(f"[sync] {doc_id} → status={final_status} | errors={len(errors)}")

    return {
        "doc_id":        doc_id,
        "sync_status":   final_status,
        "neo4j_nodes":   len(neo4j_ids),
        "chroma_chunks": len(chroma_ids),
        "errors":        errors,
    }


def _with_document_relationships(normalized_doc: Dict[str, Any]) -> list:
    """Attach source-document edges so graph records remain traceable to evidence."""
    relationships = list(normalized_doc.get("relationships", []))
    entities = normalized_doc.get("extracted_entities", {})
    doc_id = normalized_doc.get("doc_id", "")
    for equipment in entities.get("equipment", []):
        relationships.append({"source_id": doc_id, "relation": "MENTIONS", "target_id": equipment.get("tag", "")})
    for failure in entities.get("failures", []):
        relationships.append({"source_id": doc_id, "relation": "MENTIONS", "target_id": failure.get("id", "")})
    for regulation in entities.get("regulations", []):
        relationships.append({"source_id": doc_id, "relation": "MENTIONS", "target_id": regulation.get("code", "")})
    for procedure in entities.get("procedures", []):
        relationships.append({"source_id": doc_id, "relation": "CONTAINS", "target_id": procedure.get("id", "")})
    return [relationship for relationship in relationships if relationship.get("source_id") and relationship.get("target_id")]
