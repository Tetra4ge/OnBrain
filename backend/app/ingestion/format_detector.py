import os
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
    
    # Check for P&ID pattern in filename
    is_pid = "pid" in fname_lower or "drawing" in fname_lower or "dwg" in fname_lower
    
    if is_pid and ext in [".json", ".png", ".jpg", ".jpeg", ".svg"]:
        return {
            "format": "pid",
            "strategy": "pid_parser",
            "extension": ext,
            "doc_type": DocType.PID,
            "mime_type": "application/json" if ext == ".json" else "image/png"
        }
        
    if ext == ".pdf":
        # Check if PDF has extractable text or requires OCR
        has_text_layer = False
        if file_bytes:
            try:
                # Basic check for PDF text stream keywords
                text_sample = file_bytes[:4096].decode('utf-8', errors='ignore')
                if "/Text" in text_sample or "/Font" in text_sample or "stream" in text_sample:
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
