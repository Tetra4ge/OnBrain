import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def extract_document_text(file_bytes: bytes, filename: str, format_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extracts text content and page-level chunks from document file bytes based on format strategy.
    
    Returns a dict containing:
    - raw_text: full concatenated text
    - pages: list of dicts with page_number and text
    - metadata: format specific extra metadata
    """
    strategy = format_info.get("strategy", "plain_text")
    extension = format_info.get("extension", "").lower()
    
    pages: List[Dict[str, Any]] = []
    full_text = ""

    try:
        if strategy == "structured_json" or extension == ".json":
            content_str = file_bytes.decode("utf-8", errors="ignore")
            try:
                json_obj = json.loads(content_str)
                # Formatter for structured JSON
                formatted_lines = []
                for k, v in json_obj.items():
                    if isinstance(v, list):
                        formatted_lines.append(f"{k.upper()}: {', '.join(map(str, v))}")
                    elif isinstance(v, dict):
                        formatted_lines.append(f"{k.upper()}: {json.dumps(v)}")
                    else:
                        formatted_lines.append(f"{k.upper()}: {v}")
                
                full_text = "\n".join(formatted_lines)
                pages.append({"page_number": 1, "text": full_text})
            except Exception:
                full_text = content_str
                pages.append({"page_number": 1, "text": full_text})

        elif extension in [".md", ".txt", ".csv", ".log"]:
            full_text = file_bytes.decode("utf-8", errors="ignore")
            pages.append({"page_number": 1, "text": full_text})

        elif extension == ".pdf":
            # Attempt pypdf text extraction if installed, otherwise fallback to text decoder
            try:
                import io
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(file_bytes))
                pdf_pages = []
                for idx, page in enumerate(reader.pages):
                    page_text = page.extract_text() or ""
                    pdf_pages.append({"page_number": idx + 1, "text": page_text})
                
                pages = pdf_pages
                full_text = "\n\n".join([p["text"] for p in pdf_pages])
            except Exception as e:
                logger.warning(f"pypdf extraction failed for {filename}, using fallback: {e}")
                full_text = file_bytes.decode("utf-8", errors="ignore")
                pages.append({"page_number": 1, "text": full_text})

        else:
            # Fallback text decoder for images/other formats
            full_text = file_bytes.decode("utf-8", errors="ignore")
            if not full_text.strip():
                full_text = f"[Document content for {filename}]"
            pages.append({"page_number": 1, "text": full_text})

    except Exception as e:
        logger.error(f"Error extracting text from {filename}: {e}")
        full_text = f"[Extraction Error: {e}]"
        pages.append({"page_number": 1, "text": full_text})

    return {
        "raw_text": full_text,
        "pages": pages,
        "filename": filename,
        "page_count": len(pages)
    }
