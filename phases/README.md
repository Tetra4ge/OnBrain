# 📅 OnBrain — Build Phases Index

> Two-week build plan broken into 6 phases, mapped to system layers and documentation.

**← Back to [Main README](../README.md) | [Architecture](../architecture.md) | [Docs Index](../docs/README.md)**

---

## Phase Overview

| Phase | Days | Focus | Primary Layer | Status |
|-------|------|-------|---------------|--------|
| [Phase 1 — Foundation](./phase-1-foundation.md) | 1–2 | Repo setup, data collection, schema design | Infrastructure | ⬜ Not Started |
| [Phase 2 — Ingestion](./phase-2-ingestion.md) | 3–5 | OCR, entity extraction, P&ID parsing | [Ingestion](../docs/ingestion.md) | ⬜ Not Started |
| [Phase 3 — Knowledge](./phase-3-knowledge.md) | 6–8 | Graph population, embedding pipeline, sync | [Knowledge](../docs/knowledge-layer.md) | ⬜ Not Started |
| [Phase 4 — Agents](./phase-4-agents.md) | 9–11 | Copilot RAG, RCA agent, tool-calling | [Agents](../docs/agents.md) | ⬜ Not Started |
| [Phase 5 — Application](./phase-5-application.md) | 12–13 | Dashboard, mobile chat, auth, API wiring | [Application](../docs/application.md) | ⬜ Not Started |
| [Phase 6 — Polish](./phase-6-polish.md) | 14 | Polish, deck, demo video, testing | All Layers | ⬜ Not Started |

---

## Timeline Visualization

```
Week 1                                    Week 2
┌─────┬─────┬─────┬─────┬─────┐  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ D1  │ D2  │ D3  │ D4  │ D5  │  │ D6  │ D7  │ D8  │ D9  │ D10 │ D11 │ D12 │ D13 │ D14 │
├─────┴─────┼─────┴─────┴─────┤  ├─────┴─────┴─────┼─────┴─────┴─────┼─────┴─────┼─────┤
│  Phase 1  │    Phase 2      │  │    Phase 3      │    Phase 4      │  Phase 5  │  P6 │
│Foundation │   Ingestion     │  │   Knowledge     │    Agents       │Application│Polsh│
└───────────┴─────────────────┘  └─────────────────┴─────────────────┴───────────┴─────┘
```

---

## Phase Dependencies

```
Phase 1 (Foundation)
    │
    ├── Schema design ───────────────────────────────────┐
    ├── Sample data ─────────────────┐                   │
    │                                │                   │
    ▼                                ▼                   ▼
Phase 2 (Ingestion)          Phase 3 (Knowledge)    Phase 5 (Application)
    │                                │                   ▲
    │  Normalized documents ──────▶  │                   │
    │                                │                   │
    └────────────────────────────────┼───────────────────┘
                                     │
                                     ▼
                              Phase 4 (Agents)
                                     │
                                     ▼
                              Phase 6 (Polish)
```

---

## Cross-Reference Map

Each phase directly maps to architectural layers and documentation:

| Phase | Architecture Section | Docs | Key Deliverables |
|-------|---------------------|------|------------------|
| [Phase 1](./phase-1-foundation.md) | [§3 System Architecture](../architecture.md) | [Tech Stack](../docs/tech-stack.md) | Repo, Docker Compose, schemas |
| [Phase 2](./phase-2-ingestion.md) | [§3 Layer 1 — Ingestion](../architecture.md) | [Ingestion](../docs/ingestion.md) | OCR, YOLO, entity extraction |
| [Phase 3](./phase-3-knowledge.md) | [§3 Layer 2 — Knowledge](../architecture.md) | [Knowledge](../docs/knowledge-layer.md) | Neo4j, ChromaDB, MongoDB sync |
| [Phase 4](./phase-4-agents.md) | [§3 Layer 3 — Agents](../architecture.md) | [Agents](../docs/agents.md) | Copilot, RCA agent |
| [Phase 5](./phase-5-application.md) | [§3 Layer 4 — Application](../architecture.md) | [Application](../docs/application.md) | React UI, Firebase Auth |
| [Phase 6](./phase-6-polish.md) | [§5 Demo Flow](../architecture.md) | [API Reference](../docs/api-reference.md) | Demo video, deck, benchmarks |

---

## Quick Links

- **Architecture** → [architecture.md](../architecture.md)
- **Full Docs** → [docs/README.md](../docs/README.md)
- **Tech Stack** → [docs/tech-stack.md](../docs/tech-stack.md)
- **Data Flow** → [docs/data-flow.md](../docs/data-flow.md)
