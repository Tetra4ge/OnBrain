# OnBrain — AI for Industrial Knowledge Intelligence
### 48-Hour Hackathon Build — System Architecture

> This is a compressed version of the original 14-day / 6-phase plan, scoped down to fit a real 48-hour window. Nothing essential was dropped — some components were simplified or moved to optional/stretch status. All cuts are flagged explicitly below and in the relevant phase files.

---

## 1. Problem Summary

Industrial plants run on 7–12 disconnected document systems (P&IDs, work orders, procedures, inspection records, regulatory filings). This causes lost search time, incomplete equipment history at the point of maintenance decisions, and an impending "knowledge cliff" as experienced engineers retire.

**Goal:** ingest heterogeneous plant documents, unify them into a queryable knowledge base (graph + vector), and deliver cited, trustworthy answers and root-cause analysis at the point of need — desktop and mobile.

---

## 2. What Changed From the 14-Day Plan (Read This First)

| Component | 14-day plan | 48-hour plan | Why |
|---|---|---|---|
| P&ID / YOLOv8 symbol detection | Full pipeline, pretrained + optional fine-tune, mAP benchmarking | **Optional stretch task**, only attempted in Phase 3 if the team is ahead of schedule. If skipped, P&IDs are still ingestable as images via OCR + manual tagging. | Training/validating a CV model reliably in a few hours is high-risk for a live demo. |
| Firebase Auth | Email/password + Google SSO + full role-based access control middleware | Email/password only, single role flag (`engineer` / `technician`) stored on the user record, no SSO | RBAC and SSO add real hours for something judges rarely test deeply. |
| Three-store sync (Firestore + Neo4j + Chroma) | Full atomic transaction logic with a retry queue | Sequential write with a per-document `status` field (`pending` / `partial` / `complete`) and logged errors — not a true distributed transaction | A true atomic multi-DB transaction is a multi-day problem on its own; a status field gives you 90% of the visibility for a fraction of the effort. |
| Equipment Profile (dedicated page) | Separate page from Graph Explorer | Folded into Graph Explorer as a node-click detail panel | One less page to build and wire; same information, one UI. |
| RCA agent's "past RCA reports" source | Own store + retrieval path | Cut for 48 hours — RCA uses failure history, OEM specs, and inspection logs only | Reduces the RCA agent from 4 evidence sources to 3 without weakening the demo. |

**Added on top of the original plan** (from earlier solution-design discussion), all flagged **optional / stretch**, attempted only after core checkpoints pass:
- Knowledge Graph visualization in the UI (kept as **core**, not stretch — high demo impact for low effort)
- Confidence scoring + explicit "not enough source coverage" fallback on Copilot answers (kept as **core**)
- Citation deep-links to exact source page (kept as **core**)
- **Knowledge Cliff Capture** — voice-note interview mode for tacit knowledge, reusing your Sarvam TTS / Groq Whisper pipeline (stretch)
- **Cross-document contradiction detection** — flag when two sources disagree (stretch)

---

## 3. System Architecture

```
Sources → Ingestion Layer → Knowledge Layer → Agent Layer → Application Layer
```

### Layer 1 — Ingestion
| Component | Function | Status |
|---|---|---|
| OCR (Tesseract, PaddleOCR fallback) | Extract text from scans/forms | Core |
| Entity extraction (Groq / Llama) | Structured JSON extraction per doc type | Core |
| Normalizer | Unified document schema output | Core |
| P&ID / CV parsing (YOLOv8) | Symbol detection on drawings | **Stretch** |

### Layer 2 — Knowledge
| Component | Function | Status |
|---|---|---|
| Neo4j (graph) | Equipment → WorkOrder → Failure → Procedure → Regulation | Core |
| ChromaDB (vector) | Chunk embeddings for semantic search | Core |
| Firestore (metadata) | Raw document metadata, cross-refs, sync status | Core |
| Sync logic | Sequential write + status field (simplified from full atomic transaction) | Core, simplified |

### Layer 3 — Agents
| Agent | Function | Status |
|---|---|---|
| Copilot (RAG, Gemini) | Cross-document Q&A with citations + confidence | Core |
| RCA Agent (Gemini) | Failure history + OEM specs + inspection logs → ranked hypotheses | Core |
| Contradiction Detector | Flags disagreeing sources | Stretch |
| Knowledge Cliff Capture | Voice interview → transcription → entity extraction → graph | Stretch |

### Layer 4 — Application
| Component | Function | Status |
|---|---|---|
| React 19 + Tailwind dashboard | Upload, Copilot chat, Document Explorer, Graph Explorer, RCA Workbench | Core |
| Mobile-responsive layout | Same backend, lightweight chat-first UI | Core |
| Firebase Auth (simplified) | Email/password login, single role flag | Core |

A FastAPI backend connects all layers. Docker Compose runs the local services (`api`, `frontend`, `neo4j`, `chroma`); Firestore is provided by the configured Firebase project.

---

## 4. Tech Stack (Final, 48-Hour Scope)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Tailwind | |
| Backend | FastAPI | |
| Vector database | ChromaDB (self-hosted, Docker) | |
| Graph database | Neo4j (local Docker, not AuraDB — avoids external quota risk on demo day) | |
| Document metadata | Firestore | |
| LLM — reasoning / synthesis | Gemini | Copilot answers, RCA reasoning |
| LLM — bulk extraction | Groq (Llama) | Entity extraction across documents |
| OCR | Tesseract (primary), PaddleOCR (fallback only if time allows) | |
| Auth | Firebase Auth (email/password only) | |
| Deployment | Docker Compose, single host | |

---

## 5. Demo Flow (Target ~2.5 minutes)

| # | Action | Shows | Time |
|---|---|---|---|
| 1 | Upload 2–3 real documents live | Ingestion pipeline in real time | 30s |
| 2 | Show knowledge graph populating | OCR + extraction + graph sync | 20s |
| 3 | Ask Copilot a cross-document question | RAG + citations + confidence score | 30s |
| 4 | Trigger RCA on a sample equipment failure | Multi-step reasoning chain | 40s |
| 5 | Show architecture diagram + benchmark numbers | Technical excellence | 20s |

---

## 6. Deliverables

- Working prototype (all 10 phases)
- Architecture diagram (this document, visualized)
- Presentation deck
- 2–3 minute demo video (recorded as a backup, not only live)

---

## 7. Judging Criteria Weighting

| Criteria | Weight |
|---|---|
| Business Impact | 25% |
| Technical Excellence | 25% |
| Scalability | 20% |
| Innovation | 15% |
| User Experience | 15% |

---

## 8. Build Timeline — 10 Phases Across 48 Hours

| Phase | Hours | Focus |
|---|---|---|
| [Phase 1 — Foundation](./phases/phase-1-foundation.md) | 0–3 | Repo, Docker Compose, environment |
| [Phase 2 — Data & Schema](./phases/phase-2-data-schema.md) | 3–5 | Sample documents, locked schemas |
| [Phase 3 — Ingestion](./phases/phase-3-ingestion.md) | 5–12 | OCR, entity extraction, normalizer |
| [Phase 4 — Knowledge Layer](./phases/phase-4-knowledge.md) | 12–20 | Neo4j, ChromaDB, Firestore sync |
| [Phase 5 — Copilot Agent](./phases/phase-5-copilot-agent.md) | 20–26 | RAG Q&A with citations |
| [Phase 6 — RCA Agent](./phases/phase-6-rca-agent.md) | 26–30 | Root-cause reasoning |
| [Phase 7 — Frontend Core](./phases/phase-7-frontend-core.md) | 16–30 (parallel) | Auth, upload, chat |
| [Phase 8 — Frontend Advanced](./phases/phase-8-frontend-advanced.md) | 30–38 | Graph explorer, RCA workbench, mobile |
| [Phase 9 — Integration & Testing](./phases/phase-9-integration-testing.md) | 38–44 | End-to-end, feature freeze |
| [Phase 10 — Polish & Delivery](./phases/phase-10-polish-delivery.md) | 44–48 | Benchmarks, deck, demo video |

See [phases/README.md](./phases/README.md) for the full index with dependencies.
