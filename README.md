# OnBrain
**An always-on Industrial AI Brain fusing P&IDs and maintenance logs into a unified, predictive knowledge graph to drive zero downtime.**

> 📐 **[Architecture](./architecture.md)** · 📅 **[Build Phases](./phases/README.md)** · 🧪 **[Testing Guide](./phases/testing.md)**

---

## The Problem: Industrial Knowledge Fragmentation

In asset-intensive industries, professionals spend up to **35% of their working hours** simply searching for information. Vital data is scattered across 7 to 12 disconnected systems:

- P&IDs and engineering drawings in one place
- Maintenance work orders in another
- Operating procedures in a third
- Inspection records and regulatory submissions buried in email archives

This fragmentation causes **18–22% of unplanned downtime events**, as maintenance teams are forced to make critical decisions without complete equipment history or context. Furthermore, as experienced engineers retire, decades of undocumented knowledge are lost forever.

---

## What is OnBrain?

**OnBrain** is a unified Asset & Operations Brain designed to defeat knowledge fragmentation. It acts as an overarching intelligence layer that ingests heterogeneous documents (like PDFs, P&IDs, forms, and manuals) and connects them into a queryable, living knowledge base.

It turns scattered operational data into actionable insights, ensuring that the right information reaches the right technician at the exact point of need, keeping operations **Always On**.

---

## How We Are Solving It

Our solution brings together modern NLP, Knowledge Graphs, and Agentic AI into a seamless four-layer platform:

### 1. [Document Ingestion Pipeline](./docs/ingestion.md)
We process unstructured and structured data (PDFs, P&IDs, logs) using OCR ([Tesseract / PaddleOCR](./docs/ingestion.md#1-ocr-engine)), computer vision ([YOLOv8 for P&ID symbol detection](./docs/ingestion.md#2-pid--cv-parsing)), and [LLM-based entity extraction](./docs/ingestion.md#3-entity-extraction) to extract equipment tags, parameters, dates, and personnel.

### 2. [Unified Knowledge Layer](./docs/knowledge-layer.md)
Extracted entities are mapped into a [unified knowledge graph (Neo4j)](./docs/knowledge-layer.md#knowledge-graph) with relationships across document types — linking a specific pump in a P&ID to its failure history and its maintenance manual. A [vector store (ChromaDB)](./docs/knowledge-layer.md#vector-store) enables semantic search, while [MongoDB](./docs/knowledge-layer.md#document-metadata-store) tracks all document metadata.

### 3. [Expert AI Agents](./docs/agents.md)
A [Copilot Agent](./docs/agents.md#copilot-agent) provides conversational Q&A using Retrieval-Augmented Generation (RAG) over the knowledge graph and vector database, answering operational queries instantly with **source citations and confidence scores**. An [RCA Agent](./docs/agents.md#rca-agent) performs root-cause analysis by fusing failure history, OEM manuals, and inspection logs.

### 4. [Application Layer](./docs/application.md)
A full-featured [web dashboard](./docs/application.md#web-dashboard) for engineers and a [mobile-responsive chat](./docs/application.md#mobile-responsive-chat) for field technicians — both backed by the same FastAPI backend, secured with [Firebase Auth](./docs/application.md#authentication).

> **See the full data pipeline:** [Data Flow →](./docs/data-flow.md)

---

## System Architecture

```
Sources → Ingestion Layer → Knowledge Layer → Agent Layer → Application Layer
```

| Layer | Components | Documentation |
|-------|-----------|---------------|
| **Ingestion** | OCR, P&ID parser, entity extraction, normalizer | [docs/ingestion.md](./docs/ingestion.md) |
| **Knowledge** | ChromaDB, Neo4j, MongoDB | [docs/knowledge-layer.md](./docs/knowledge-layer.md) |
| **Agents** | Copilot (RAG Q&A), RCA (root-cause analysis) | [docs/agents.md](./docs/agents.md) |
| **Application** | React dashboard, mobile chat, Firebase Auth | [docs/application.md](./docs/application.md) |

> **Full architecture details:** [architecture.md →](./architecture.md)

---

## Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | React 19 + Tailwind CSS | [Application docs](./docs/application.md) |
| **Backend** | FastAPI | [API Reference](./docs/api-reference.md) |
| **Vector DB** | ChromaDB | [Knowledge — Vector Store](./docs/knowledge-layer.md#vector-store) |
| **Graph DB** | Neo4j | [Knowledge — Knowledge Graph](./docs/knowledge-layer.md#knowledge-graph) |
| **Document DB** | MongoDB | [Knowledge — Metadata Store](./docs/knowledge-layer.md#document-metadata-store) |
| **LLM — Reasoning** | Gemini | [Agents docs](./docs/agents.md) |
| **LLM — Extraction** | Groq (Llama) | [Ingestion docs](./docs/ingestion.md#3-entity-extraction) |
| **CV / P&ID** | YOLOv8 | [Ingestion docs](./docs/ingestion.md#2-pid--cv-parsing) |
| **OCR** | Tesseract / PaddleOCR | [Ingestion docs](./docs/ingestion.md#1-ocr-engine) |
| **Auth** | Firebase Auth | [Application — Auth](./docs/application.md#authentication) |
| **Deployment** | Docker + Render / Vercel | [Application — Deployment](./docs/application.md#deployment) |

> **Full tech inventory with rationale:** [docs/tech-stack.md →](./docs/tech-stack.md)

---

## Build Phases

| Phase | Focus | Details | Link |
|-------|-------|---------|------|
| **Phase 1 — Foundation** | Repo setup, Docker, services health | Environment & backend scaffolding | [phase-1-foundation.md](./phases/phase-1-foundation.md) |
| **Phase 2 — Data & Schema** | Demo documents & schema lock | MongoDB, Neo4j, ChromaDB schemas | [phase-2-data-schema.md](./phases/phase-2-data-schema.md) |
| **Phase 3 — Ingestion** | OCR, extraction, normalizer | Full ingestion pipeline | [phase-3-ingestion.md](./phases/phase-3-ingestion.md) |
| **Phase 4 — Knowledge Layer** | Graph & vector store population | Neo4j + ChromaDB + MongoDB sync | [phase-4-knowledge.md](./phases/phase-4-knowledge.md) |
| **Phase 5 — Copilot Agent** | RAG Q&A, citations, confidence | Reasoning agent layer | [phase-5-copilot-agent.md](./phases/phase-5-copilot-agent.md) |
| **Phase 6 — RCA Agent** | Failure cause analysis | Root-cause workbench | [phase-6-rca-agent.md](./phases/phase-6-rca-agent.md) |
| **Phase 7 — Frontend Core** | Auth, document upload, chat UI | Web dashboard & mobile | [phase-7-frontend-core.md](./phases/phase-7-frontend-core.md) |
| **Phase 8 — Frontend Advanced** | Graph explorer, RCA UI | Advanced visualization | [phase-8-frontend-advanced.md](./phases/phase-8-frontend-advanced.md) |
| **Testing** | E2E integration & verification | Checklist & triage protocol | [testing.md](./phases/testing.md) |

> **Full phase details:** [phases/README.md →](./phases/README.md)

---

## Documentation Map

```
README.md (you are here)
├── architecture.md ──────── High-level system blueprint
└── phases/
    ├── README.md ────────── Build timeline index
    ├── phase-1-foundation.md
    ├── phase-2-data-schema.md
    ├── phase-3-ingestion.md
    ├── phase-4-knowledge.md
    ├── phase-5-copilot-agent.md
    ├── phase-6-rca-agent.md
    ├── phase-7-frontend-core.md
    ├── phase-8-frontend-advanced.md
    └── testing.md
```

---

## License

See [LICENSE](./LICENSE) for details.
