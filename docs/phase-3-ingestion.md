# 🔄 Phase 3 — Ingestion Pipeline (Hours 5–12)

**[← Phase 2 — Data & Schema](./phase-2-data-schema.md) | [Phases Index](./README.md) | Next: [Phase 4 — Knowledge Layer →](./phase-4-knowledge.md)**

---

## Objective

Turn any raw uploaded document into cleaned text plus a structured entity list, matching the schema locked in Phase 2. This is the data entry point for the whole system — nothing downstream can be better than what this phase produces.

## Features Covered

| Feature | Status |
|---|---|
| OCR (Tesseract) | Core |
| PaddleOCR fallback | Stretch — only if Tesseract accuracy is visibly poor on your sample set |
| Format detection (text PDF vs scanned vs image) | Core |
| Groq-based entity extraction | Core |
| Extraction confidence scoring | Core |
| Normalizer (unified output schema) | Core |
| YOLOv8 P&ID symbol detection | **Stretch — attempt only if hours 5–10 finish early** |

## Folder Structure Changes

```
onbrain/backend/app/
├── ingestion/
│   ├── __init__.py
│   ├── format_detector.py     # decides: text PDF / scanned PDF / image / P&ID
│   ├── ocr.py                  # Tesseract wrapper, PaddleOCR fallback
│   ├── extractor.py            # Groq-based entity extraction per doc type
│   ├── normalizer.py           # combines OCR + extraction into unified schema
│   └── pid_parser.py           # STRETCH ONLY — YOLOv8 symbol detection
├── api/routes/
│   └── documents.py            # POST /api/documents/upload
```

## Step-by-Step Instructions

1. **Build format detection** (`format_detector.py`)
   - Given a file, determine: text-based PDF (has extractable text layer), scanned PDF/image (no text layer, needs OCR), or P&ID (filename/user-tagged, or simple heuristic — high line/shape density if you get to the CV stretch).
   - For text PDFs, extract text directly (e.g. via `pypdf` or `pdfplumber` — verify current extraction API against the library's docs, method names shift between versions).

2. **Build OCR** (`ocr.py`)
   - Wire up Tesseract via its Python binding for scanned PDFs/images. Convert PDF pages to images first if needed.
   - Store raw OCR output with page number and (if available) bounding box metadata — this is what citation deep-links point to later.
   - Only add PaddleOCR as a fallback if, after testing on your actual sample scans, Tesseract's output is visibly bad. Don't build the fallback speculatively — it costs hours you may not have.

3. **Build entity extraction** (`extractor.py`)
   - Set up the Groq client. Verify current SDK initialization syntax and model name strings against Groq's docs before writing this — do not guess a model string from memory.
   - Write one structured-JSON extraction prompt per document type (work order, inspection report, manual, regulation), each instructed to output fields matching the Phase 2 schema exactly, and nothing else.
   - Every extraction call must return a `confidence` field per entity (ask the model to self-report, or derive a simple heuristic from response consistency across a couple of sample re-runs).
   - Add basic retry logic (2 retries with backoff) for API failures — do not build a queueing system, a simple in-process retry loop is enough for 48 hours.

4. **Build the normalizer** (`normalizer.py`)
   - Combine OCR output + extracted entities into one unified JSON object per document: `{doc_id, doc_type, raw_text, entities: [...], relationships: [...], confidence_avg}`.
   - This unified object is exactly what Phase 4 consumes — do not let its shape drift from the Firestore/Neo4j schema notes in Phase 2.

5. **Build the upload endpoint** (`api/routes/documents.py`)
   - `POST /api/documents/upload` — accepts a file, runs format detection → OCR (if needed) → extraction → normalizer, returns a `doc_id` and job status immediately (don't block the HTTP response on the full pipeline if it's slow; return a `doc_id` and let the client poll, or just run it synchronously if the pipeline is fast enough in testing — decide based on actual measured latency, not a guess).

6. **[Stretch] YOLOv8 P&ID parsing** (`pid_parser.py`) — attempt only if hours 5–10 are done early
   - Use a pretrained YOLOv8 model, do not attempt fine-tuning in this window.
   - Verify current YOLOv8 inference API syntax (`ultralytics` package) against its docs before writing code — the API has changed across versions.
   - Map detected symbol classes to a small fixed vocabulary (pump, valve, heat exchanger) — don't attempt full industry-standard P&ID symbol coverage.
   - If this task is not finished by hour 12, cut it and move on — P&IDs still get ingested as plain images with OCR-extracted text labels, which is an acceptable fallback.

## Manual Verification Checklist

- [ ] Upload one text-based PDF, one scanned image, and one spreadsheet or plain-text file through the endpoint — confirm each produces a normalized JSON output with no unhandled exceptions.
- [ ] Manually read the extracted entities against the ground truth you wrote by hand in Phase 2, step 6 — confirm extraction correctly finds at least the equipment tag and date on both test documents.
- [ ] Check that every extracted entity has a non-null confidence value.
- [ ] Confirm OCR output includes page numbers (open the raw OCR output for a multi-page scanned document and check page metadata is present and correct).
- [ ] If the P&ID stretch task was attempted: open one P&ID image, run detection, and manually count how many symbols were correctly identified vs. missed — report this honestly in Phase 10's benchmarks rather than only showing a cherry-picked success case.
- [ ] If the P&ID stretch task was cut: confirm the fallback path (P&ID treated as image + OCR) still runs without crashing.

## Dependencies

- Phase 1: API skeleton and Docker services running.
- Phase 2: entity schema locked, sample documents present in `data/samples/`.

## Notes / Scope Cuts

- PaddleOCR fallback and YOLOv8 P&ID parsing are the two most likely tasks to get cut under time pressure — that's intentional, they're the least essential to the core demo loop (a cited, cross-document answer). If you have to choose which one to cut first, cut P&ID parsing before PaddleOCR.
