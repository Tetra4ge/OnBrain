import os
import glob
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.ingestion import (
    detect_format,
    extract_document_text,
    extract_entities_and_relationships,
    normalize_document
)

router = APIRouter(prefix="/documents", tags=["Documents & Ingestion"])

SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..", "data", "samples"))

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_type_override: str = Form(None)
) -> Dict[str, Any]:
    """
    Accepts an uploaded document file, runs the format detector, text extractor/OCR,
    entity/relationship extractor, and document normalizer.
    Returns normalized document payload ready for storage.
    """
    try:
        content = await file.read()
        filename = file.filename
        
        format_info = detect_format(filename, content)
        if doc_type_override:
            format_info["doc_type"] = doc_type_override

        text_result = extract_document_text(content, filename, format_info)
        raw_text = text_result["raw_text"]

        extracted = extract_entities_and_relationships(raw_text, format_info["doc_type"], filename)
        normalized = normalize_document(filename, raw_text, extracted, format_info)

        return {
            "status": "success",
            "message": f"Successfully processed '{filename}'",
            "document": normalized
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")


@router.get("/samples")
def list_sample_documents() -> Dict[str, Any]:
    """
    Returns a list of all sample industrial documents available in data/samples/.
    """
    if not os.path.exists(SAMPLES_DIR):
        return {"samples": []}

    sample_files = []
    for root, _, files in os.walk(SAMPLES_DIR):
        for f in files:
            if f == ".gitkeep" or f == "MANIFEST.md":
                continue
            rel_path = os.path.relpath(os.path.join(root, f), SAMPLES_DIR)
            category = os.path.dirname(rel_path) or "root"
            sample_files.append({
                "filename": f,
                "relative_path": rel_path.replace("\\", "/"),
                "category": category
            })

    return {
        "count": len(sample_files),
        "samples": sample_files
    }


@router.post("/process-sample")
def process_sample_document(relative_path: str) -> Dict[str, Any]:
    """
    Runs the full ingestion pipeline on a sample document located in data/samples/.
    """
    target_path = os.path.normpath(os.path.join(SAMPLES_DIR, relative_path))
    if not target_path.startswith(SAMPLES_DIR) or not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail=f"Sample file '{relative_path}' not found.")

    try:
        with open(target_path, "rb") as f:
            content = f.read()

        filename = os.path.basename(target_path)
        format_info = detect_format(filename, content)
        text_result = extract_document_text(content, filename, format_info)
        raw_text = text_result["raw_text"]

        extracted = extract_entities_and_relationships(raw_text, format_info["doc_type"], filename)
        normalized = normalize_document(filename, raw_text, extracted, format_info)

        return {
            "status": "success",
            "message": f"Successfully processed sample '{relative_path}'",
            "document": normalized
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sample processing failed: {str(e)}")
