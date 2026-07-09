# 🔄 Phase 2 — Ingestion Pipeline (Days 3–5)

> OCR, Groq-based entity extraction, YOLOv8 symbol detection on P&IDs.

**[← Phase 1 — Foundation](./phase-1-foundation.md) | [Phases Index](./README.md) | Next: [Phase 3 — Knowledge →](./phase-3-knowledge.md)**

---

## Objective

Build the complete ingestion pipeline that takes raw documents and produces normalized, structured output ready for the [Knowledge Layer](../docs/knowledge-layer.md). This is the data entry point for the entire system.

**Primary Documentation:** [Ingestion Layer](../docs/ingestion.md)

---

## Deliverables

### Day 3 — OCR & Document Processing

- [ ] Implement Tesseract OCR integration for scanned PDFs and images
- [ ] Add PaddleOCR as fallback for complex layouts
- [ ] Build PDF-to-image conversion pipeline
- [ ] Create format detection logic (text PDF vs. scanned PDF vs. image vs. P&ID)
- [ ] Test OCR accuracy on sample inspection forms and work orders
- [ ] Store raw OCR output with bounding-box metadata

### Day 4 — Entity Extraction

- [ ] Set up Groq API client for Llama-based extraction
- [ ] Design structured JSON extraction prompts for each document type:
  - Work orders → equipment tags, dates, personnel, descriptions
  - Inspection reports → findings, measurements, recommendations
  - Manuals → equipment specs, procedures, part numbers
  - Regulatory docs → codes, requirements, effective dates
- [ ] Implement retry logic and error handling for Groq API calls
- [ ] Build entity validation and confidence scoring
- [ ] Test extraction accuracy across sample documents

### Day 5 — P&ID Parsing & Normalizer

- [ ] Set up YOLOv8 inference pipeline for P&ID symbol detection
- [ ] Prepare/label small training set (if fine-tuning) or validate pretrained model
- [ ] Implement symbol class mapping (pumps, valves, heat exchangers, etc.)
- [ ] Build the Normalizer — unified document schema output
- [ ] Create `POST /api/documents/upload` endpoint (see [API Reference](../docs/api-reference.md))
- [ ] Integration test: upload → OCR → extraction → normalized output
- [ ] Verify output schema matches what [Phase 3](./phase-3-knowledge.md) expects

---

## Success Criteria

| Criteria | Target | Verification |
|----------|--------|-------------|
| OCR accuracy on clean scans | ≥ 90% character accuracy | Manual review on 5 test documents |
| Entity extraction accuracy | ≥ 85% F1 on key fields | Compare extracted JSON vs. ground truth |
| P&ID symbol detection | ≥ 80% mAP on test set | YOLOv8 evaluation metrics |
| Normalizer output | Valid unified schema | Schema validation tests |
| Upload endpoint | 200 OK with job ID | API integration test |
| End-to-end pipeline | Upload → normalized JSON | Full pipeline test with 3 doc types |

---

## Architecture Mapping

```
This phase builds:
┌──────────────────────────────────────────┐
│         LAYER 1 — INGESTION              │
│                                          │
│  Day 3: [OCR Engine] ──────────────┐     │
│  Day 5: [P&ID Parser] ────────────┤     │
│  Day 4: [Entity Extraction] ──────┤     │
│  Day 5: [Normalizer] ◄────────────┘     │
│              │                           │
└──────────────┼───────────────────────────┘
               │
               ▼
        Phase 3 consumes this output
```

---

## Key Decisions

| Decision | Choice | Rationale | Reference |
|----------|--------|-----------|-----------|
| OCR engine | Tesseract (primary) + PaddleOCR (fallback) | Speed + accuracy balance | [Ingestion — OCR](../docs/ingestion.md#1-ocr-engine) |
| Extraction LLM | Groq (Llama) | Bulk processing — speed/cost optimized | [Tech Stack — LLM Split](../docs/tech-stack.md#llm-split-rationale) |
| NER approach | LLM-based (no trained model) | Time constraint — 2-week build | [Architecture § 4](../architecture.md) |
| P&ID model | YOLOv8 pretrained + optional fine-tune | Best accuracy/effort tradeoff | [Ingestion — P&ID](../docs/ingestion.md#2-pid--cv-parsing) |

---

## Dependencies

| Depends On | From Phase | What's Needed |
|------------|-----------|---------------|
| Docker Compose running | [Phase 1](./phase-1-foundation.md) | All services healthy |
| Sample documents collected | [Phase 1](./phase-1-foundation.md) | Test data for pipeline validation |
| FastAPI skeleton | [Phase 1](./phase-1-foundation.md) | Route structure for upload endpoint |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Ingestion Layer](../docs/ingestion.md) | Full technical specification |
| [Data Flow](../docs/data-flow.md) | Pipeline position in overall flow |
| [Tech Stack](../docs/tech-stack.md) | Technology choices |
| [API Reference](../docs/api-reference.md) | Upload endpoint spec |
| [Phase 3 — Knowledge](./phase-3-knowledge.md) | Consumes ingestion output |
