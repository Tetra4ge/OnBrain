import uuid
from datetime import datetime
from typing import Dict, Any, List
from app.models.schemas import DocType, SyncStatus

def normalize_document(
    filename: str,
    raw_text: str,
    extracted_data: Dict[str, Any],
    format_info: Dict[str, Any],
    doc_id: str = None
) -> Dict[str, Any]:
    """
    Consolidates raw text, extracted entities, graph edges, and metadata into a unified
    NormalizedDocument payload ready for MongoDB, Neo4j, and ChromaDB ingestion.
    """
    if not doc_id:
        doc_id = f"doc_{uuid.uuid4().hex[:12]}"

    doc_type = format_info.get("doc_type", DocType.MANUAL)
    if isinstance(doc_type, DocType):
        doc_type_val = doc_type.value
    else:
        doc_type_val = str(doc_type)

    # Extract list of equipment tags present in document
    equipment_tags = [eq.get("tag") for eq in extracted_data.get("equipment", []) if eq.get("tag")]

    # Build text chunks for ChromaDB vector indexing (approx 500 chars per chunk with overlap)
    chunks = []
    chunk_size = 500
    chunk_overlap = 50
    text_length = len(raw_text)
    
    if text_length <= chunk_size:
        chunks.append({
            "chunk_id": f"{doc_id}_chunk_0",
            "chunk_index": 0,
            "page_number": 1,
            "text": raw_text,
            "equipment_tags": equipment_tags
        })
    else:
        start = 0
        idx = 0
        while start < text_length:
            end = min(start + chunk_size, text_length)
            chunk_text = raw_text[start:end]
            chunks.append({
                "chunk_id": f"{doc_id}_chunk_{idx}",
                "chunk_index": idx,
                "page_number": 1,
                "text": chunk_text,
                "equipment_tags": equipment_tags
            })
            idx += 1
            start += (chunk_size - chunk_overlap)

    # Calculate overall confidence score
    confidence_info = extracted_data.get("confidence", {})
    confidence_avg = confidence_info.get("overall_avg", 0.90)

    total_entities = extracted_data.get("total_extracted", 0)

    return {
        "doc_id": doc_id,
        "filename": filename,
        "doc_type": doc_type_val,
        "upload_date": datetime.utcnow().isoformat(),
        "sync_status": SyncStatus.PENDING.value,
        "raw_text": raw_text,
        "extracted_entities": {
            "equipment": extracted_data.get("equipment", []),
            "work_orders": extracted_data.get("work_orders", []),
            "failures": extracted_data.get("failures", []),
            "procedures": extracted_data.get("procedures", []),
            "regulations": extracted_data.get("regulations", []),
            "personnel": extracted_data.get("personnel", [])
        },
        "relationships": extracted_data.get("relationships", []),
        "chunks": chunks,
        "chunk_count": len(chunks),
        "equipment_tags": equipment_tags,
        "extracted_entity_count": total_entities,
        "confidence_avg": confidence_avg,
        "error_log": []
    }
