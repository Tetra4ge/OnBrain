# 🧠 OnBrain — Unified Industrial Knowledge & Operations Intelligence

> ET AI Hackathon 2026 — Problem Statement 8: AI for Industrial Knowledge Intelligence
> **48-hour compressed build plan** (adapted from a 14-day team outline — see [architecture.md § 2](./architecture.md#2-what-changed-from-the-14-day-plan-read-this-first) for exactly what changed and why)

---

## What This Is

OnBrain ingests heterogeneous industrial documents (P&IDs, work orders, inspection reports, manuals, regulatory filings), extracts structured entities, builds a live knowledge graph, and exposes it through a cited RAG copilot and a root-cause-analysis (RCA) agent — usable from both a desktop dashboard and a mobile-responsive view.

Full system design: [architecture.md](./architecture.md). This file is the phase index and folder structure reference.

---

## Phase Index

| Phase | Hours | Focus | Depends On |
|---|---|---|---|
| [Phase 1 — Foundation](./phases/phase-1-foundation.md) | 0–3 | Repo, Docker Compose, all services healthy | — |
| [Phase 2 — Data & Schema](./phases/phase-2-data-schema.md) | 3–5 | Sample documents collected, all DB schemas frozen | Phase 1 |
| [Phase 3 — Ingestion](./phases/phase-3-ingestion.md) | 5–12 | OCR, format detection, entity extraction, normalizer, P&ID (stretch) | Phase 2 |
| [Phase 4 — Knowledge Layer](./phases/phase-4-knowledge.md) | 12–20 | Neo4j graph, ChromaDB vectors, MongoDB metadata, sync | Phase 3 |
| [Phase 5 — Copilot Agent](./phases/phase-5-copilot-agent.md) | 20–26 | RAG Q&A, citations, confidence, contradiction detection (stretch) | Phase 4 |
| [Phase 6 — RCA Agent](./phases/phase-6-rca-agent.md) | 26–30 | Root-cause hypotheses, evidence chain, recommendations | Phase 4 |
| [Phase 7 — Frontend Core](./phases/phase-7-frontend-core.md) | 16–30 (parallel) | Auth, upload center, Copilot chat UI | Phase 1 (starts early) |
| [Phase 8 — Frontend Advanced](./phases/phase-8-frontend-advanced.md) | 30–38 | Graph explorer, RCA workbench, mobile layout | Phase 7, Phases 5–6 |
| [Phase 9 — Integration & Testing](./phases/phase-9-integration-testing.md) | 38–44 | End-to-end tests, bug fixes, feature freeze | Phases 1–8 |
| [Phase 10 — Polish & Delivery](./phases/phase-10-polish-delivery.md) | 44–48 | Benchmarks, deck, demo video, rehearsal | Phase 9 |

---

## Timeline Visualization

```
Hour:  0   3   5            12                 20        26   30            38      44   48
       ├───┼───┼─────────────┼──────────────────┼─────────┼────┼─────────────┼───────┼────┤
       │ P1│ P2│     P3      │        P4         │   P5    │ P6 │             │  P9   │ P10│
       │Fnd│Dat│  Ingestion  │  Knowledge Layer  │Copilot  │RCA │             │ Integ │Polsh
       └───┴───┴─────────────┴──────────────────┴─────────┴────┴─────────────┴───────┴────┘
               ├──────── Phase 7 — Frontend Core (parallel, hrs 16–30) ────────┤
                                                                  ├─ Phase 8 — Frontend Advanced (30–38) ─┤
```

At least two people should be on Phase 7 from hour 16 onward while the rest of the team continues the backend chain (Phases 3–6) — this parallelism is what makes the 48-hour window survivable. Phase 8 needs Phases 5 and 6 to be far enough along to wire real data into the Graph Explorer and RCA Workbench, so it starts once Copilot/RCA are functionally returning data, even if not fully polished.

---

## Folder Structure

```
onbrain/
├── backend/                        # FastAPI application
│   ├── app/
│   │   ├── api/                    # Route handlers
│   │   │   ├── documents.py        # upload, status, list
│   │   │   ├── search.py           # semantic search
│   │   │   ├── graph.py            # graph queries
│   │   │   ├── copilot.py          # Copilot chat endpoint (SSE)
│   │   │   └── rca.py              # RCA analyze + reports
│   │   ├── agents/
│   │   │   ├── copilot_agent.py
│   │   │   ├── rca_agent.py
│   │   │   └── tools.py            # shared tool-calling definitions
│   │   ├── ingestion/
│   │   │   ├── format_detect.py
│   │   │   ├── ocr.py
│   │   │   ├── extraction.py
│   │   │   ├── pid_parser.py       # stretch — see Phase 3
│   │   │   └── normalizer.py
│   │   ├── knowledge/
│   │   │   ├── neo4j_client.py
│   │   │   ├── chroma_client.py
│   │   │   ├── mongo_client.py
│   │   │   └── sync.py
│   │   ├── models/                 # Pydantic schemas
│   │   ├── core/                   # config.py, auth.py, logging.py
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                       # React 19 application
│   ├── src/
│   │   ├── views/
│   │   │   ├── UploadCenter.jsx
│   │   │   ├── CopilotChat.jsx
│   │   │   ├── DocumentExplorer.jsx
│   │   │   ├── GraphExplorer.jsx
│   │   │   └── RcaWorkbench.jsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/                    # api-client.js, firebase.js
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── data/
│   └── samples/                    # Collected demo documents (Phase 2)
├── phases/                         # This build plan
│   ├── phase-1-foundation.md
│   ├── phase-2-data-schema.md
│   ├── phase-3-ingestion.md
│   ├── phase-4-knowledge.md
│   ├── phase-5-copilot-agent.md
│   ├── phase-6-rca-agent.md
│   ├── phase-7-frontend-core.md
│   ├── phase-8-frontend-advanced.md
│   ├── phase-9-integration-testing.md
│   └── phase-10-polish-delivery.md
├── architecture.md
├── docker-compose.yml
├── .env.example
└── README.md                       # This file
```

---

## Feature Checklist (nothing from either the original plan or the earlier discussion is silently dropped)

| Feature | Phase | Status |
|---|---|---|
| Docker Compose multi-service orchestration | 1 | Core |
| Sample document collection (real + supplementary) | 2 | Core |
| Entity / DB schema design (Mongo, Neo4j, Chroma) | 2 | Core |
| OCR (Tesseract, PaddleOCR fallback) | 3 | Core |
| Format detection | 3 | Core |
| Groq-based entity extraction | 3 | Core |
| Normalizer (unified document schema) | 3 | Core |
| P&ID / CV symbol detection (YOLOv8) | 3 | **Stretch** |
| Neo4j knowledge graph | 4 | Core |
| ChromaDB vector store | 4 | Core |
| MongoDB metadata store | 4 | Core |
| Cross-store sync (simplified, status-field based) | 4 | Core, simplified |
| Copilot RAG agent with citations | 5 | Core |
| Confidence scoring + "insufficient coverage" fallback | 5 | Core |
| Cross-document contradiction detection | 5 | **Stretch** |
| RCA agent (evidence chain + ranked hypotheses) | 6 | Core |
| Firebase Auth (email/password, single role flag) | 7 | Core, simplified |
| Upload Center | 7 | Core |
| Copilot Chat UI (streaming) | 7 | Core |
| Knowledge graph visualization (force-directed) | 8 | Core |
| RCA Workbench UI | 8 | Core |
| Mobile-responsive layout | 8 | Core |
| Knowledge Cliff Capture (voice intake) | 6 or later, if ahead of schedule | **Stretch** |
| End-to-end integration tests | 9 | Core |
| Benchmark metrics collection | 10 | Core |
| Presentation deck + demo video | 10 | Core |

---

## Related Documentation

| Link | Purpose |
|---|---|
| [architecture.md](./architecture.md) | Full system design, tech stack, what changed from the 14-day plan, judging-criteria mapping |
| [phases/](./phases/) | Detailed phase-by-phase instructions with manual verification checklists |
