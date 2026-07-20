# 🧪 OnBrain Testing & Quality Verification Guide

This document is the single authoritative testing specification and manual verification checklist for the OnBrain platform. It covers end-to-end integration flows, API contract checks, triage procedures, and verification protocols.

---

## 1. Active Integration Flow (Phases 1–4)

Active verification gates covering Foundation, Data Schemas, Document Ingestion Pipeline, and Knowledge Layer.

### Active Pipeline Sequence
1. **Document Upload & Format Detection**:
   - Upload sample industrial documents (Work Orders, Inspection Reports, Manuals, Regulatory standards, P&IDs) through the web UI or REST API.
   - Verify document format detection (Text PDF, Scanned PDF, Image, P&ID) and initial ingestion status.

2. **Knowledge Extraction & Graph Normalization**:
   - Ingestion extracts entities (Equipment tags, Failures, Work Orders, Procedures, Personnel, Regulations) and P&ID symbols.
   - Entities populate **Neo4j** (knowledge graph relationships), **ChromaDB** (500-char vector embeddings), and **MongoDB** (document metadata).
   - Verify extraction confidence scoring (`confidence_avg`).

---

## 2. Planned Feature Gates (Phases 5–8)

Gates for planned downstream agentic and interface components.

1. **Copilot RAG Q&A (Phase 5)**:
   - Query the Copilot agent via search or mobile/desktop chat interface.
   - Verify returned answers include precise source citations (document ID, page/section, confidence score).

2. **Root Cause Analysis (RCA) (Phase 6)**:
   - Select an equipment failure scenario in the RCA Workbench.
   - Verify hypothesis generation, evidence chain synthesis across graph + vector stores, and maintenance recommendations.

---

## 3. API & Component Verification Checklist

### Active Infrastructure (Phases 1–4)
- [x] `FastAPI Health Check`: `GET http://localhost:8000/health` returns `{"status": "ok"}` with 200 status code.
- [x] `MongoDB Connection`: Confirm connection to `MONGO_URI` and `documents` metadata store is operational.
- [x] `Neo4j Graph Connection`: Connect to `http://localhost:7474`, verify credentials, and query entity nodes.
- [x] `ChromaDB Vector Store`: Confirm `documents` collection is reachable on configured host/port.

### Planned Capabilities (Phases 5–8)
- [ ] `Auth Verification`: Backend validates Firebase JWT tokens on protected `/api/*` endpoints in non-dev mode.
- [ ] `Streaming / SSE`: Copilot query endpoint streams response tokens correctly without timeout or CORS errors.
- [ ] `Interactive Graph Explorer`: Visual rendering of multi-hop Neo4j entity relationships in frontend.

---

## 4. Triage & Bug Resolution Protocol

During integration testing, sort any discovered issues into three priority tiers:

| Tier | Classification | Action |
|---|---|---|
| **P0 — Blocker** | Prevents core ingestion/graph flow (upload failure, API crash, database connection error) | **Must fix immediately** before proceeding |
| **P1 — High** | Visual glitch, slow extraction response, missing citation detail | Fix if time permits before final freeze |
| **P2 — Low** | Cosmetic alignment, non-critical logging tweak | Defer / document as future work |

### Common Failure Points & Fixes
- **Mock vs. Real API Mismatch**: Ensure frontend TypeScript/JavaScript interfaces match backend Pydantic models in `backend/app/models/schemas.py`.
- **CORS Errors**: Confirm `fastapi.middleware.cors.CORSMiddleware` in `backend/app/main.py` explicitly allows `http://localhost:5173`.
- **Query Timeouts**: Ensure Neo4j relationship queries specify maximum hop depth (e.g., `[*1..3]`) to avoid infinite graph traversal.

---

## 5. Final System Sign-off Criteria

Before declaring an active build candidate ready:

- [x] The full document ingestion and normalization flow completes **twice in a row** without container restarts.
- [x] Deliberately complex documents (scanned PDFs, P&IDs) return accurate entities and non-null confidence scores.
- [ ] incognito browser session can log in, execute an upload, and receive an AI Copilot response (upon Phase 5/7 completion).
