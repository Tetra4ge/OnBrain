# AI for Industrial Knowledge Intelligence — Unified Asset & Operations Brain

> 📚 **[Full Documentation](./docs/README.md)** · 🏠 **[Main README](./README.md)** · 📅 **[Build Phases](./phases/README.md)**

## 1. Problem Summary

Industrial plants run on 7–12 disconnected document systems (P&IDs, work orders, procedures, inspection records, regulatory filings). This fragmentation causes:
- 35% of working hours lost searching for/recreating information
- 18–22% of unplanned downtime tied to incomplete equipment history
- An impending "knowledge cliff" as 25% of experienced engineers retire within a decade

**Goal:** Build an AI platform that ingests all this heterogeneous data, unifies it into a queryable knowledge base, and delivers answers/actions at the point of need — on any device.

---

## 2. Solution Strategy

Build one strong core pipeline (ingestion → knowledge graph → RAG copilot) and add **one** differentiator on top rather than spreading thin across all five suggested tracks. Chosen differentiator: **Maintenance Intelligence & RCA Agent** (highest business-impact story, clean demo).

With a two-week build window, P&ID/CV parsing is included as a real differentiator (not just a roadmap slide) rather than skipped.

---

## 3. System Architecture

Four layers, data flows top to bottom:

```
Sources → Ingestion Layer → Knowledge Layer → Agent Layer → Application Layer
```

> **End-to-end data flow diagram:** [docs/data-flow.md →](./docs/data-flow.md)

### Layer 1 — Ingestion
Handles heterogeneous inputs and turns them into structured, linkable data.

> **Full documentation:** [docs/ingestion.md →](./docs/ingestion.md)  
> **Build phase:** [Phase 2 — Ingestion (Days 3–5) →](./phases/phase-2-ingestion.md)

| Component | Function |
|---|---|
| [OCR](./docs/ingestion.md#1-ocr-engine) | Extracts text from scans and forms (Tesseract / PaddleOCR) |
| [P&ID / CV parsing](./docs/ingestion.md#2-pid--cv-parsing) | Detects equipment symbols in engineering drawings (YOLOv8, pretrained/fine-tuned on a small labeled set) |
| [Entity extraction](./docs/ingestion.md#3-entity-extraction) | LLM-based structured JSON extraction — equipment tags, dates, personnel, parameters, regulatory refs (no trained NER model needed) |
| [Normalizer](./docs/ingestion.md#4-normalizer) | Converts everything into a unified document schema with metadata |

### Layer 2 — Knowledge
Two complementary stores, kept in sync on every new document, plus a metadata store.

> **Full documentation:** [docs/knowledge-layer.md →](./docs/knowledge-layer.md)  
> **Build phase:** [Phase 3 — Knowledge (Days 6–8) →](./phases/phase-3-knowledge.md)

| Component | Function |
|---|---|
| [Vector store](./docs/knowledge-layer.md#vector-store) | Chunk embeddings for semantic search (RAG retrieval) — ChromaDB |
| [Knowledge graph](./docs/knowledge-layer.md#knowledge-graph) | Entities + relationships: Equipment → WorkOrder → Failure → Procedure → Regulation — Neo4j |
| [Document metadata store](./docs/knowledge-layer.md#document-metadata-store) | Raw document metadata, versions, upload info — MongoDB |

### Layer 3 — Agents
Reasoning layer that queries the vector store and graph via tool-calling.

> **Full documentation:** [docs/agents.md →](./docs/agents.md)  
> **Build phase:** [Phase 4 — Agents (Days 9–11) →](./phases/phase-4-agents.md)

| Agent | Function |
|---|---|
| [Copilot agent](./docs/agents.md#copilot-agent) | RAG-powered Q&A across the full corpus, with citations + confidence scores |
| [RCA agent](./docs/agents.md#rca-agent) | Fuses failure history, OEM manuals, inspection logs → root-cause hypotheses and maintenance recommendations |

### Layer 4 — Application

> **Full documentation:** [docs/application.md →](./docs/application.md)  
> **Build phase:** [Phase 5 — Application (Days 12–13) →](./phases/phase-5-application.md)

| Component | Function |
|---|---|
| [Web dashboard](./docs/application.md#web-dashboard) | For engineers — full document/graph exploration (React 19 + Tailwind) |
| [Mobile-responsive chat](./docs/application.md#mobile-responsive-chat) | For field technicians — same backend, lightweight UI |
| [Auth](./docs/application.md#authentication) | Firebase Auth |

A [FastAPI backend](./docs/api-reference.md) connects all layers; Docker Compose + Render/Vercel for [deployment](./docs/application.md#deployment).

---

## 4. Tech Stack (Merged & Final)

> **Full tech inventory with rationale:** [docs/tech-stack.md →](./docs/tech-stack.md)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Tailwind | [Application docs](./docs/application.md) |
| Backend | FastAPI | [API Reference](./docs/api-reference.md) |
| Vector database | ChromaDB | Fast to set up, sufficient for demo scale — [details](./docs/knowledge-layer.md#vector-store) |
| Graph database | Neo4j | Real graph queries for RCA agent traversal — [details](./docs/knowledge-layer.md#knowledge-graph) |
| LLM — reasoning / RAG synthesis | Gemini | Used for copilot answers and RCA reasoning chains — [details](./docs/agents.md) |
| LLM — bulk / extraction calls | Groq (Llama) | Used for high-volume entity extraction — [details](./docs/ingestion.md#3-entity-extraction) |
| Entity extraction | LLM-based structured JSON extraction | No trained NER model — [details](./docs/ingestion.md#3-entity-extraction) |
| OCR | Tesseract / PaddleOCR | For scanned forms and text-heavy docs — [details](./docs/ingestion.md#1-ocr-engine) |
| P&ID / CV parsing | YOLOv8 (pretrained/fine-tuned) | Symbol detection on engineering drawings — [details](./docs/ingestion.md#2-pid--cv-parsing) |
| Document metadata | MongoDB | Keeps raw metadata separate — [details](./docs/knowledge-layer.md#document-metadata-store) |
| Auth | Firebase Auth | [details](./docs/application.md#authentication) |
| Deployment | Docker + Render/Vercel | [details](./docs/application.md#deployment) |

**LLM split rationale:** Gemini handles anything user-facing where answer quality matters (copilot, RCA reasoning). Groq handles background/bulk jobs (entity extraction across hundreds of documents) where speed and cost matter more than eloquence. See [Tech Stack — LLM Split Rationale](./docs/tech-stack.md#llm-split-rationale) for full details.

---

## 5. Demo Flow

> **Build phase:** [Phase 6 — Polish (Day 14) →](./phases/phase-6-polish.md)

1. Upload mixed documents live (PDF manual, scanned inspection form, P&ID) → [Ingestion Pipeline](./docs/ingestion.md)
2. Show OCR + symbol detection + entity extraction populating the knowledge graph in real time → [Knowledge Layer](./docs/knowledge-layer.md)
3. Ask the copilot a cross-document question → answer with source citations → [Copilot Agent](./docs/agents.md#copilot-agent)
4. Trigger the RCA agent on a sample equipment failure → show its reasoning chain → [RCA Agent](./docs/agents.md#rca-agent)
5. Present architecture diagram + metrics: query latency, extraction accuracy on a test set

---

## 6. Deliverables

- Working prototype — [All Build Phases](./phases/README.md)
- Architecture diagram — this document
- Presentation deck (problem → architecture → demo → impact metrics → scalability plan) — [Phase 6](./phases/phase-6-polish.md)
- 2–3 minute demo video — [Phase 6](./phases/phase-6-polish.md)

---

## 7. Judging Criteria Weighting

> **Alignment details:** [Phase 6 — Judging Criteria Alignment](./phases/phase-6-polish.md)

| Criteria | Weight |
|---|---|
| Business Impact | 25% |
| Technical Excellence | 25% |
| Scalability | 20% |
| Innovation | 15% |
| User Experience | 15% |

---

## 8. Evaluation Benchmarks to Prepare For

> **Benchmark execution:** [Phase 6 — Evaluation Benchmarks](./phases/phase-6-polish.md)

- Entity extraction accuracy across document types — [Ingestion Layer](./docs/ingestion.md)
- Query answer quality on domain-expert benchmark questions — [Copilot Agent](./docs/agents.md#copilot-agent)
- Knowledge graph linkage completeness — [Knowledge Graph](./docs/knowledge-layer.md#knowledge-graph)
- Time-to-answer vs. traditional search — [Data Flow](./docs/data-flow.md)
- Compliance gap detection accuracy (if compliance track is added)
- Demonstrated improvement in cross-functional knowledge discovery — ideally validated with real industrial document samples

---

## 9. Two-Week Build Plan (Suggested)

> **Full phase breakdowns with deliverables:** [phases/README.md →](./phases/README.md)

| Days | Focus | Phase Details |
|---|---|---|
| 1–2 | Repo setup, data collection, schema design for Mongo/Neo4j/Chroma | [Phase 1 — Foundation](./phases/phase-1-foundation.md) |
| 3–5 | Ingestion pipeline: OCR, Groq-based entity extraction, YOLOv8 symbol detection on P&IDs | [Phase 2 — Ingestion](./phases/phase-2-ingestion.md) |
| 6–8 | Knowledge layer: Neo4j graph population, Chroma embedding pipeline, sync logic | [Phase 3 — Knowledge](./phases/phase-3-knowledge.md) |
| 9–11 | Agent layer: Copilot RAG agent (Gemini), RCA agent, tool-calling between agents and stores | [Phase 4 — Agents](./phases/phase-4-agents.md) |
| 12–13 | Frontend: dashboard + mobile chat UI, Firebase Auth, wire up to FastAPI | [Phase 5 — Application](./phases/phase-5-application.md) |
| 14 | Polish, deck, demo video, test on real document samples | [Phase 6 — Polish](./phases/phase-6-polish.md) |

---

## Documentation Map

```
README.md ────────── Project overview & navigation
architecture.md ──── This file — system blueprint
├── docs/
│   ├── README.md ────────── Documentation index
│   ├── ingestion.md ─────── Layer 1 deep-dive
│   ├── knowledge-layer.md ─ Layer 2 deep-dive
│   ├── agents.md ────────── Layer 3 deep-dive
│   ├── application.md ───── Layer 4 deep-dive
│   ├── tech-stack.md ────── Full tech inventory
│   ├── data-flow.md ─────── End-to-end pipeline
│   └── api-reference.md ─── FastAPI endpoints
└── phases/
    ├── README.md ────────── Build timeline index
    ├── phase-1-foundation.md
    ├── phase-2-ingestion.md
    ├── phase-3-knowledge.md
    ├── phase-4-agents.md
    ├── phase-5-application.md
    └── phase-6-polish.md
```
