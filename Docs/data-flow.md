# 🔀 Data Flow — End-to-End Pipeline

> Traces data from document upload to answer delivery across all four layers.

**[← Tech Stack](./tech-stack.md) | [Docs Index](./README.md) | [API Reference →](./api-reference.md)**

---

## High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DOCUMENT UPLOAD                              │
│                    (PDF, P&ID, scan, form)                          │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 1 — INGESTION                               │
│                                                                     │
│  ┌─────────┐    ┌─────────┐    ┌───────────┐    ┌──────────┐       │
│  │   OCR   │    │  P&ID   │    │  Entity   │    │ Normal-  │       │
│  │Tesseract│───▶│  YOLOv8 │───▶│  Extract  │───▶│  izer    │       │
│  └─────────┘    └─────────┘    │  (Groq)   │    └────┬─────┘       │
│                                └───────────┘         │             │
└──────────────────────────────────────────────────────┼─────────────┘
                                                       │
                              ┌─────────────────────────┤
                              │                         │
                              ▼                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 2 — KNOWLEDGE                               │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   ChromaDB   │  │    Neo4j     │  │   MongoDB    │              │
│  │  (vectors)   │  │   (graph)    │  │  (metadata)  │              │
│  │              │  │              │  │              │              │
│  │ Chunk embeds │  │ Entities +   │  │ Doc versions │              │
│  │ for semantic │  │ relationships│  │ + audit      │              │
│  │ search       │  │ for traversal│  │              │              │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘              │
│         │                 │                                        │
└─────────┼─────────────────┼────────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 3 — AGENTS                                  │
│                                                                     │
│  ┌────────────────────┐     ┌────────────────────┐                 │
│  │   Copilot Agent    │     │    RCA Agent        │                 │
│  │   (Gemini)         │     │    (Gemini)          │                 │
│  │                    │     │                      │                 │
│  │  Semantic search + │     │  Graph traversal +   │                 │
│  │  graph lookups →   │     │  semantic search →   │                 │
│  │  synthesized answer│     │  root-cause report   │                 │
│  └────────┬───────────┘     └──────────┬───────────┘                │
│           │                            │                           │
└───────────┼────────────────────────────┼───────────────────────────┘
            │                            │
            ▼                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYER 4 — APPLICATION                             │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐                       │
│  │  Web Dashboard   │     │  Mobile Chat    │                       │
│  │  (React 19)      │     │  (Responsive)   │                       │
│  └─────────────────┘     └─────────────────┘                       │
│                                                                     │
│  Auth: Firebase  │  Backend: FastAPI  │  Deploy: Docker/Render/Vercel│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 1: Document Upload → Knowledge Base

This is the **write path** — data entering the system.

| Step | Action | Component | Output |
|------|--------|-----------|--------|
| 1 | User uploads document via dashboard | [Upload Center](./application.md#web-dashboard) | Raw file + metadata |
| 2 | FastAPI receives file, stores in temp storage | [API](./api-reference.md) | Job ID |
| 3 | OCR extracts text (if scanned) | [OCR Engine](./ingestion.md#1-ocr-engine) | Raw text + bounding boxes |
| 4 | YOLOv8 detects symbols (if P&ID) | [P&ID Parser](./ingestion.md#2-pid--cv-parsing) | Symbol detections |
| 5 | Groq extracts structured entities | [Entity Extraction](./ingestion.md#3-entity-extraction) | Structured JSON |
| 6 | Normalizer produces unified schema | [Normalizer](./ingestion.md#4-normalizer) | Normalized document |
| 7a | Text chunks → embeddings → ChromaDB | [Vector Store](./knowledge-layer.md#vector-store) | Searchable chunks |
| 7b | Entities → nodes + relationships → Neo4j | [Knowledge Graph](./knowledge-layer.md#knowledge-graph) | Graph nodes/edges |
| 7c | Metadata → MongoDB | [Metadata Store](./knowledge-layer.md#document-metadata-store) | Audit record |
| 8 | Dashboard shows real-time progress | [Web Dashboard](./application.md#web-dashboard) | Visual confirmation |

---

## Flow 2: User Query → Copilot Answer

This is the **read path** — knowledge retrieval.

| Step | Action | Component | Output |
|------|--------|-----------|--------|
| 1 | User types question in chat | [Copilot Chat](./application.md#web-dashboard) | Query text |
| 2 | FastAPI routes to Copilot Agent | [API](./api-reference.md) | Agent invocation |
| 3 | Agent plans query strategy | [Copilot Agent](./agents.md#copilot-agent) | Tool calls |
| 4a | Semantic search on ChromaDB | [Vector Store](./knowledge-layer.md#vector-store) | Relevant chunks |
| 4b | Structured lookup on Neo4j | [Knowledge Graph](./knowledge-layer.md#knowledge-graph) | Entity data |
| 5 | Gemini synthesizes answer with citations | [Copilot Agent](./agents.md#copilot-agent) | Answer + sources |
| 6 | Response streamed to UI | [Copilot Chat](./application.md#web-dashboard) | Rendered answer |

---

## Flow 3: RCA Analysis → Root-Cause Report

This is the **analysis path** — deep reasoning.

| Step | Action | Component | Output |
|------|--------|-----------|--------|
| 1 | User triggers RCA for equipment | [RCA Workbench](./application.md#web-dashboard) | Equipment tag + failure |
| 2 | FastAPI routes to RCA Agent | [API](./api-reference.md) | Agent invocation |
| 3 | Agent gathers evidence from graph + vectors | [RCA Agent](./agents.md#rca-agent) | Evidence set |
| 4 | Multi-step reasoning chain (Gemini) | [RCA Agent](./agents.md#rca-agent) | Hypotheses |
| 5 | Recommendations generated with procedure refs | [RCA Agent](./agents.md#rca-agent) | Action plan |
| 6 | Full RCA report rendered in workbench | [RCA Workbench](./application.md#web-dashboard) | Interactive report |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Ingestion Layer](./ingestion.md) | Write path — Layer 1 |
| [Knowledge Layer](./knowledge-layer.md) | Storage — Layer 2 |
| [Agent Layer](./agents.md) | Reasoning — Layer 3 |
| [Application Layer](./application.md) | Presentation — Layer 4 |
| [API Reference](./api-reference.md) | Endpoint contracts for all flows |
| [Tech Stack](./tech-stack.md) | Technologies powering each step |
