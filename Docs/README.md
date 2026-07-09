# 📚 OnBrain — Documentation Index

> Comprehensive technical documentation for the OnBrain Industrial Knowledge Intelligence platform.

**← Back to [Main README](../README.md) | [Architecture](../architecture.md) | [Build Phases →](../phases/README.md)**

---

## Documentation Map

This directory contains detailed technical documentation for every layer, component, and subsystem of OnBrain. Each document covers design rationale, implementation details, API contracts, and integration points.

### System Layers

| # | Document | Covers | Key Technologies |
|---|----------|--------|------------------|
| 1 | [Ingestion Layer](./ingestion.md) | OCR, P&ID parsing, entity extraction, normalization | Tesseract, PaddleOCR, YOLOv8, Groq (Llama) |
| 2 | [Knowledge Layer](./knowledge-layer.md) | Vector store, knowledge graph, document metadata | ChromaDB, Neo4j, MongoDB |
| 3 | [Agent Layer](./agents.md) | Copilot RAG agent, RCA agent, tool-calling | Gemini, LangChain, FastAPI |
| 4 | [Application Layer](./application.md) | Web dashboard, mobile chat, auth, deployment | React 19, Tailwind, Firebase Auth |

### Cross-Cutting Concerns

| Document | Covers |
|----------|--------|
| [Tech Stack](./tech-stack.md) | Full technology inventory with version pins and rationale |
| [Data Flow](./data-flow.md) | End-to-end data pipeline from upload to answer delivery |
| [API Reference](./api-reference.md) | FastAPI endpoint catalog with request/response schemas |

---

## How the Docs Connect

```
architecture.md (high-level blueprint)
    │
    ├── docs/ingestion.md ─────────┐
    ├── docs/knowledge-layer.md ───┤── docs/data-flow.md (traces data across all layers)
    ├── docs/agents.md ────────────┤
    └── docs/application.md ───────┘
                                   │
                          docs/tech-stack.md (shared tech inventory)
                                   │
                          docs/api-reference.md (backend contract)
                                   │
                     phases/README.md (build timeline, links back to each doc)
```

---

## Quick Links

- **Getting Started** → [Main README](../README.md)
- **Architecture Overview** → [architecture.md](../architecture.md)
- **Build Timeline** → [Phases Index](../phases/README.md)
- **Phase 1 — Foundation** → [phases/phase-1-foundation.md](../phases/phase-1-foundation.md)
- **Phase 2 — Ingestion** → [phases/phase-2-ingestion.md](../phases/phase-2-ingestion.md)
- **Phase 3 — Knowledge** → [phases/phase-3-knowledge.md](../phases/phase-3-knowledge.md)
- **Phase 4 — Agents** → [phases/phase-4-agents.md](../phases/phase-4-agents.md)
- **Phase 5 — Application** → [phases/phase-5-application.md](../phases/phase-5-application.md)
- **Phase 6 — Polish** → [phases/phase-6-polish.md](../phases/phase-6-polish.md)
