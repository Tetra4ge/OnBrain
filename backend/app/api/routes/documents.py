import os
from pathlib import Path
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.concurrency import run_in_threadpool
from app.ingestion import (
    detect_format,
    extract_document_text,
    extract_entities_and_relationships,
    normalize_document,
    parse_pid_image
)
from app.knowledge.sync import sync_document

router = APIRouter(prefix="/documents", tags=["Documents & Ingestion"])

SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..", "data", "samples"))
SAMPLES_DIR_PATH = Path(SAMPLES_DIR).resolve()

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_type_override: str = Form(None)
) -> Dict[str, Any]:
    """
    Accepts an uploaded document file, runs the format detector, text extractor/OCR,
    entity/relationship extractor, P&ID symbol parser (if applicable), and document normalizer.
    """
    try:
        content = await file.read(MAX_UPLOAD_SIZE + 1)
        if len(content) > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed limit of {MAX_UPLOAD_SIZE // (1024 * 1024)}MB"
            )
        if not file.filename or not file.filename.strip():
            raise HTTPException(
                status_code=400,
                detail="Filename is missing or empty in upload request."
            )
        filename = file.filename
        
        format_info = await run_in_threadpool(detect_format, filename, content)
        if doc_type_override:
            format_info["doc_type"] = doc_type_override

        text_result = await run_in_threadpool(extract_document_text, content, filename, format_info)
        raw_text = text_result["raw_text"]

        extracted = await run_in_threadpool(
            extract_entities_and_relationships, raw_text, format_info["doc_type"], filename
        )
        
        # P&ID Symbol detection run
        pid_result = None
        if format_info.get("format") == "pid" or format_info.get("strategy") == "pid_parser":
            pid_result = await run_in_threadpool(parse_pid_image, content, filename)

        normalized = await run_in_threadpool(
            normalize_document, filename, raw_text, extracted, format_info
        )
        if pid_result:
            normalized["pid_symbols"] = pid_result

        # ── Phase 4: Sync to knowledge stores ──
        sync_result = await sync_document(normalized)

        return {
            "status": "success",
            "message": f"Successfully processed '{filename}'",
            "document": normalized,
            "sync": sync_result,
        }
    except HTTPException:
        raise
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
async def process_sample_document(relative_path: str) -> Dict[str, Any]:
    """
    Runs the full ingestion pipeline on a sample document located in data/samples/.
    Validates candidate path using Path.relative_to() to prevent traversal attacks.
    """
    try:
        candidate_path = (SAMPLES_DIR_PATH / relative_path).resolve()
        candidate_path.relative_to(SAMPLES_DIR_PATH)
    except Exception:
        raise HTTPException(status_code=404, detail=f"Sample file '{relative_path}' not found.")

    if not candidate_path.is_file():
        raise HTTPException(status_code=404, detail=f"Sample file '{relative_path}' not found.")

    try:
        content = candidate_path.read_bytes()
        filename = candidate_path.name
        format_info = await run_in_threadpool(detect_format, filename, content)
        text_result = await run_in_threadpool(extract_document_text, content, filename, format_info)
        raw_text = text_result["raw_text"]

        extracted = await run_in_threadpool(
            extract_entities_and_relationships, raw_text, format_info["doc_type"], filename
        )

        # P&ID Symbol detection run
        pid_result = None
        if format_info.get("format") == "pid" or format_info.get("strategy") == "pid_parser":
            pid_result = await run_in_threadpool(parse_pid_image, content, filename)

        normalized = await run_in_threadpool(
            normalize_document, filename, raw_text, extracted, format_info
        )
        if pid_result:
            normalized["pid_symbols"] = pid_result

        # ── Phase 4: Sync to knowledge stores ──
        sync_result = await sync_document(normalized)

        return {
            "status": "success",
            "message": f"Successfully processed sample '{relative_path}'",
            "document": normalized,
            "sync": sync_result,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sample processing failed: {str(e)}")
