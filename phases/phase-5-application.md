# 🖥️ Phase 5 — Application Layer (Days 12–13)

> Dashboard, mobile chat UI, Firebase Auth, wire up to FastAPI.

**[← Phase 4 — Agents](./phase-4-agents.md) | [Phases Index](./README.md) | Next: [Phase 6 — Polish →](./phase-6-polish.md)**

---

## Objective

Build the user-facing application: a React 19 web dashboard for engineers, a mobile-responsive chat for technicians, Firebase Auth integration, and full wiring to the FastAPI backend.

**Primary Documentation:** [Application Layer](../docs/application.md)

---

## Deliverables

### Day 12 — Dashboard & Auth

- [ ] Initialize React 19 project with Tailwind CSS
- [ ] Set up Firebase Auth integration:
  - Email/password login
  - Google SSO
  - Role-based access (admin, engineer, technician)
  - JWT token handling for API calls
- [ ] Build core layout: sidebar navigation, header, main content area
- [ ] Implement **Upload Center**:
  - Drag-and-drop file upload
  - Document type selection
  - Real-time processing status (polling `/api/documents/{id}/status`)
- [ ] Implement **Copilot Chat** view:
  - Chat message interface
  - SSE streaming token display
  - Citation panel with source document links
  - Confidence score indicator
- [ ] Implement **Document Explorer**:
  - List/grid view of all ingested documents
  - Filter by type, date, equipment tag
  - Document detail view with extracted entities

### Day 13 — Graph Explorer, RCA & Mobile

- [ ] Implement **Graph Explorer**:
  - Interactive knowledge graph visualization (force-directed layout)
  - Click-to-explore: node selection → detail panel
  - Filter by entity type and relationship
- [ ] Implement **Equipment Profile** view:
  - Single-equipment dashboard
  - Timeline of failures, work orders, inspections
  - Linked procedures and regulations
- [ ] Implement **RCA Workbench**:
  - Trigger RCA analysis form (equipment + failure description)
  - Results display: hypotheses, evidence, recommendations
  - Link to source documents and procedures
- [ ] Build **mobile-responsive layout**:
  - Responsive breakpoints for chat-first mobile experience
  - Simplified navigation for one-handed use
  - Same backend, lightweight UI
- [ ] Wire all views to FastAPI endpoints (see [API Reference](../docs/api-reference.md))
- [ ] Implement route protection based on user roles

---

## Success Criteria

| Criteria | Target | Verification |
|----------|--------|-------------|
| Login works | Email + Google SSO | Manual auth flow test |
| Role-based access | Technicians can't access admin features | Test with different roles |
| Upload works | File upload → processing status shown | Upload 3 test documents |
| Copilot chat works | Question → streaming answer with citations | Ask 5 test questions |
| Document explorer works | Browse, filter, view document details | Navigate through sample docs |
| Graph explorer works | Interactive graph visualization loads | Explore equipment relationships |
| RCA workbench works | Trigger analysis → report displayed | Run 2 test analyses |
| Mobile responsive | Chat usable on mobile viewport | Chrome DevTools mobile emulation |
| All API calls authenticated | Protected endpoints reject unauthenticated requests | Test without JWT |

---

## Architecture Mapping

```
    Phase 4 agents (ready to query)
              │
    ┌─────────┼──────────────────────────────────────┐
    │         LAYER 4 — APPLICATION                   │
    │                                                 │
    │  Day 12:                                       │
    │    [Firebase Auth] ── Login, roles, JWT         │
    │    [Upload Center] ── Drag-drop → ingestion     │
    │    [Copilot Chat] ── SSE streaming Q&A          │
    │    [Document Explorer] ── Browse + filter       │
    │                                                 │
    │  Day 13:                                       │
    │    [Graph Explorer] ── Interactive graph viz     │
    │    [Equipment Profile] ── Single-asset view     │
    │    [RCA Workbench] ── Analysis trigger + report  │
    │    [Mobile Layout] ── Responsive chat            │
    │                                                 │
    └─────────────────────────────────────────────────┘
```

---

## UI Views → API Endpoints → Layers

| UI View | API Endpoint | Backend Layer |
|---------|-------------|---------------|
| Upload Center | `POST /api/documents/upload` | [Ingestion](../docs/ingestion.md) |
| Document Explorer | `GET /api/documents` | [Knowledge — MongoDB](../docs/knowledge-layer.md#document-metadata-store) |
| Copilot Chat | `POST /api/copilot/query` | [Copilot Agent](../docs/agents.md#copilot-agent) |
| Graph Explorer | `GET /api/graph/equipment` | [Knowledge — Neo4j](../docs/knowledge-layer.md#knowledge-graph) |
| Equipment Profile | `GET /api/graph/equipment/{tag}/history` | [Knowledge — Neo4j](../docs/knowledge-layer.md#knowledge-graph) |
| RCA Workbench | `POST /api/rca/analyze` | [RCA Agent](../docs/agents.md#rca-agent) |

---

## Dependencies

| Depends On | From Phase | What's Needed |
|------------|-----------|---------------|
| All API endpoints functional | [Phase 1–4](./README.md) | Backend ready for frontend wiring |
| Copilot streaming | [Phase 4](./phase-4-agents.md) | SSE endpoint working |
| RCA analysis | [Phase 4](./phase-4-agents.md) | RCA endpoint returning reports |
| Firebase Auth project | [Phase 1](./phase-1-foundation.md) | API keys configured |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Application Layer](../docs/application.md) | Full technical specification |
| [Agent Layer](../docs/agents.md) | Backend agents powering chat + RCA |
| [API Reference](../docs/api-reference.md) | All endpoints consumed by frontend |
| [Tech Stack](../docs/tech-stack.md) | React 19, Tailwind, Firebase choices |
| [Phase 6 — Polish](./phase-6-polish.md) | Final phase — polish everything |
