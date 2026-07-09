# 🔄 Layer 1 — Ingestion Pipeline

> Turns heterogeneous industrial documents into structured, linkable data objects.

**[← Docs Index](./README.md) | [Architecture](../architecture.md) | Next: [Knowledge Layer →](./knowledge-layer.md)**

---

## Overview

The ingestion layer is the entry point for all data into OnBrain. It accepts raw documents — PDFs, scanned forms, engineering drawings (P&IDs), maintenance logs — and transforms them into a unified schema that the Knowledge Layer can index, link, and query.

**Architecture Reference:** [architecture.md § Layer 1 — Ingestion](../architecture.md)  
**Build Phase:** [Phase 2 — Ingestion Pipeline](../phases/phase-2-ingestion.md)

---

## Components

### 1. OCR Engine

| Property | Detail |
|----------|--------|
| **Purpose** | Extract text from scanned documents and forms |
| **Primary** | Tesseract OCR |
| **Fallback** | PaddleOCR (for complex layouts / non-Latin scripts) |
| **Input** | Scanned PDFs, images (PNG/JPEG/TIFF) |
| **Output** | Raw extracted text with bounding-box metadata |

**Processing Flow:**
```
Uploaded File → Format Detection → PDF-to-Image (if needed) → OCR → Raw Text + Bounding Boxes
```

**Key Design Decisions:**
- Tesseract is used by default for English industrial documents (fast, good accuracy on clean scans).
- PaddleOCR is available as a fallback for forms with mixed layouts or non-standard fonts.
- Bounding-box metadata is preserved to enable spatial reasoning on P&IDs.

---

### 2. P&ID / CV Parsing

| Property | Detail |
|----------|--------|
| **Purpose** | Detect equipment symbols in engineering drawings |
| **Model** | YOLOv8 (pretrained, fine-tuned on a small labeled set) |
| **Input** | P&ID images / PDFs |
| **Output** | Detected symbols with class labels, confidence scores, bounding boxes |

**Processing Flow:**
```
P&ID Image → YOLOv8 Inference → Symbol Detections (class, bbox, confidence) → Symbol Registry
```

**Symbol Classes (Target):**
- Pumps, Valves, Heat Exchangers, Tanks/Vessels, Compressors, Instruments, Piping connections

**Integration Points:**
- Detected symbols feed into the [Entity Extraction](#3-entity-extraction) step for tag resolution.
- Symbols are registered as nodes in the [Knowledge Graph](./knowledge-layer.md#knowledge-graph).

---

### 3. Entity Extraction

| Property | Detail |
|----------|--------|
| **Purpose** | Extract structured data from raw text |
| **Method** | LLM-based structured JSON extraction (no trained NER model) |
| **LLM** | Groq (Llama) — optimized for high-volume bulk extraction |
| **Input** | Raw text from OCR + symbol detections from CV parsing |
| **Output** | Structured JSON: equipment tags, dates, personnel, parameters, regulatory refs |

**Why Groq for Extraction:**
Extraction runs against potentially hundreds of documents. Groq provides the speed and cost efficiency needed for bulk processing, while [Gemini handles user-facing reasoning](./agents.md). See [Tech Stack — LLM Split Rationale](./tech-stack.md#llm-split-rationale) for details.

**Output Schema (Example):**
```json
{
  "equipment_tag": "P-101A",
  "equipment_type": "Centrifugal Pump",
  "location": "Unit 3 — Cooling Water System",
  "parameters": {
    "flow_rate": "150 GPM",
    "pressure": "45 PSI"
  },
  "related_documents": ["WO-2024-0891", "INSP-2024-0234"],
  "regulatory_refs": ["API 610", "ASME B73.1"],
  "personnel": ["J. Martinez", "K. Patel"],
  "dates": {
    "last_inspection": "2024-11-15",
    "next_scheduled": "2025-05-15"
  }
}
```

---

### 4. Normalizer

| Property | Detail |
|----------|--------|
| **Purpose** | Convert all extracted data into a unified document schema |
| **Input** | Raw text + extracted entities + symbol detections |
| **Output** | Normalized document objects with consistent metadata |

**Unified Document Schema:**
```json
{
  "doc_id": "uuid",
  "doc_type": "work_order | inspection | manual | pid | procedure | regulation",
  "source_file": "original_filename.pdf",
  "upload_timestamp": "ISO 8601",
  "raw_text": "...",
  "entities": [ ... ],
  "symbols": [ ... ],
  "metadata": {
    "version": 1,
    "processing_status": "complete",
    "confidence": 0.92
  }
}
```

**Downstream Consumers:**
- [Vector Store](./knowledge-layer.md#vector-store) — receives chunked text + embeddings
- [Knowledge Graph](./knowledge-layer.md#knowledge-graph) — receives entities + relationships
- [Document Metadata Store](./knowledge-layer.md#document-metadata-store) — receives raw document metadata

---

## Data Flow Summary

```
┌──────────────┐
│  Raw Upload  │ (PDF, scan, P&ID, form)
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   OCR Engine │     │  P&ID / CV   │
│  (Tesseract) │     │  (YOLOv8)    │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌─────────────────────────────────────┐
│       Entity Extraction (Groq)      │
│   Structured JSON from raw text     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           Normalizer                │
│   Unified document schema output    │
└──────────────┬──────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
   ChromaDB  Neo4j  MongoDB
```

**Full pipeline trace:** [Data Flow](./data-flow.md)

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Knowledge Layer](./knowledge-layer.md) | Consumes ingestion output |
| [Tech Stack](./tech-stack.md) | Technology choices for this layer |
| [Data Flow](./data-flow.md) | End-to-end pipeline diagram |
| [Phase 2 — Ingestion](../phases/phase-2-ingestion.md) | Build timeline for this layer |
| [API Reference](./api-reference.md) | Upload / ingestion endpoints |
