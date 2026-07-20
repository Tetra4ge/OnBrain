import os
import re
import io
import mimetypes
from typing import Dict, Any
from app.models.schemas import DocType

def detect_format(filename: str, file_bytes: bytes = None) -> Dict[str, Any]:
    """
    Detects document file type, MIME type, and processing strategy.
    
    Returns a dict with format, strategy, extension, and suggested DocType.
    """
    ext = os.path.splitext(filename)[1].lower()
    fname_lower = filename.lower()
    
    # Check for P&ID pattern in filename using word boundary matching
    is_pid = bool(re.search(r'\b(pid|drawing|dwg)\b', fname_lower))
    
    mime_map = {
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml"
    }
    
    if is_pid and ext in mime_map:
        return {
            "format": "pid",
            "strategy": "pid_parser",
            "extension": ext,
            "doc_type": DocType.PID,
            "mime_type": mime_map[ext]
        }
        
    if ext == ".pdf":
        # Check if PDF has extractable text using pypdf
        has_text_layer = False
        if file_bytes:
            try:
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(file_bytes))
                extracted_text = "".join([page.extract_text() or "" for page in reader.pages]).strip()
                if extracted_text:
                    has_text_layer = True
            except Exception:
                has_text_layer = False

        strategy = "pdf_text" if has_text_layer else "ocr"
        return {
            "format": "pdf",
            "strategy": strategy,
            "extension": ext,
            "doc_type": DocType.MANUAL, # default fallback unless specified
            "mime_type": "application/pdf"
        }

    elif ext in [".png", ".jpg", ".jpeg", ".webp", ".tiff", ".bmp"]:
        return {
            "format": "image",
            "strategy": "ocr",
            "extension": ext,
            "doc_type": DocType.MANUAL,
            "mime_type": f"image/{ext.lstrip('.')}"
        }

    elif ext == ".json":
        # Infer doc_type from JSON structure or filename
        suggested_doc_type = DocType.MANUAL
        if "wo" in fname_lower or "work_order" in fname_lower or "work-order" in fname_lower:
            suggested_doc_type = DocType.WORK_ORDER
        elif "insp" in fname_lower or "inspection" in fname_lower:
            suggested_doc_type = DocType.INSPECTION_REPORT
        elif "reg" in fname_lower or "osha" in fname_lower or "api" in fname_lower:
            suggested_doc_type = DocType.REGULATION
        elif "pid" in fname_lower:
            suggested_doc_type = DocType.PID

        return {
            "format": "json",
            "strategy": "structured_json",
            "extension": ext,
            "doc_type": suggested_doc_type,
            "mime_type": "application/json"
        }

    elif ext in [".md", ".txt", ".csv", ".log"]:
        suggested_doc_type = DocType.MANUAL
        if "sop" in fname_lower or "manual" in fname_lower:
            suggested_doc_type = DocType.MANUAL
        elif "wo" in fname_lower or "work" in fname_lower:
            suggested_doc_type = DocType.WORK_ORDER

        return {
            "format": "text",
            "strategy": "plain_text",
            "extension": ext,
            "doc_type": suggested_doc_type,
            "mime_type": "text/plain"
        }

    else:
        return {
            "format": "unknown",
            "strategy": "plain_text",
            "extension": ext,
            "doc_type": DocType.MANUAL,
            "mime_type": "application/octet-stream"
        }
