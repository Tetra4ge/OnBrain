# 🧪 OnBrain Testing & Quality Verification Guide

This document is the single authoritative testing specification and manual verification checklist for the OnBrain platform. It covers end-to-end integration flows, API contract checks, triage procedures, and verification protocols.

---

## 1. End-to-End Integration Flow

All core components (Ingestion, Knowledge Graph, Vector Store, Copilot Agent, RCA Agent, and Frontend UI) must operate together seamlessly without developer intervention.

### Full Pipeline Sequence
1. **Document Upload**:
   - Upload sample industrial documents (Work Orders, Inspection Reports, Manuals, Regulatory standards, P&IDs) through the web UI.
   - Verify document status updates from `pending` -> `processing` -> `complete` without infinite spinners.

2. **Knowledge Extraction & Graph Sync**:
   - Ingestion extracts entities (Equipment tags, Failures, Work Orders, Procedures, Personnel, Regulations).
   - Entities populate **Neo4j** (knowledge graph relationships) and **ChromaDB** (vector embeddings).
   - Document metadata and status populate **MongoDB**.

3. **Copilot RAG Q&A**:
   - Query the Copilot agent via search or mobile/desktop chat.
   - Verify returned answers include precise source citations (document ID, page/section, confidence score).

4. **Root Cause Analysis (RCA)**:
   - Select an equipment failure scenario in the RCA Workbench.
   - Verify hypothesis generation, evidence chain synthesis across graph + vector stores, and actionable maintenance recommendations.

---

## 2. API & Component Verification Checklist

### Backend & Database Services
- [ ] `FastAPI Health Check`: `GET http://localhost:8000/health` returns `{"status": "ok"}` with 200 status code.
- [ ] `MongoDB Connection`: Confirm connection to `MONGO_URI` and `documents` collection is writeable.
- [ ] `Neo4j Graph Connection`: Connect to `http://localhost:7474`, verify credentials, and query node count.
- [ ] `ChromaDB Vector Store`: Confirm `documents` collection is reachable on configured host/port.
- [ ] `Auth Verification`: Backend validates Firebase JWT tokens on protected `/api/*` endpoints.

### Application & Frontend
- [ ] `Frontend Scaffold`: Web app runs on `http://localhost:5173`.
- [ ] `DevTools Console`: Zero uncaught JavaScript errors during full upload -> search -> RCA flow.
- [ ] `Streaming / SSE`: Copilot query endpoint streams response tokens correctly without timeout or CORS errors.

---

## 3. Triage & Bug Resolution Protocol

During integration testing, sort any discovered issues into three priority tiers:

| Tier | Classification | Action |
|---|---|---|
| **P0 — Blocker** | Prevents core demo flow (upload failure, API crash, graph query error, auth failure) | **Must fix immediately** before proceeding |
| **P1 — High** | Visual glitch, slow streaming response, missing citation link detail | Fix if time permits before final freeze |
| **P2 — Low** | Cosmetic alignment, non-critical logging tweak | Defer / document as future work |

### Common Failure Points & Fixes
- **Mock vs. Real API mismatch**: Ensure frontend TypeScript/JavaScript interfaces match backend Pydantic models in `backend/app/models/schemas.py`.
- **CORS Errors**: Confirm `fastapi.middleware.cors.CORSMiddleware` in `backend/app/main.py` explicitly allows `http://localhost:5173`.
- **Query Timeouts**: Ensure Neo4j relationship queries specify maximum hop depth (e.g., `[*1..3]`) to avoid infinite graph traversal.

---

## 4. Final System Sign-off Criteria

Before declaring a build candidate ready:

- [ ] The full end-to-end user flow completes **twice in a row** without container restarts or manual DB cleanup.
- [ ] Deliberately complex queries (spanning 3+ document types) return accurate citations or honest low-confidence warnings.
- [ ] Fresh incognito browser session can log in, execute an upload, and receive an AI Copilot response.
