# 🖥️ Phase 7 — Frontend Core (Hours 16–30, runs in parallel with Phases 3–6)

**[← Phase 6 — RCA Agent](./phase-6-rca-agent.md) | [Phases Index](./README.md) | Next: [Phase 8 — Frontend Advanced →](./phase-8-frontend-advanced.md)**

---

## Objective

Build the first usable slice of the application: login, document upload with live status, and a working Copilot chat interface. This phase starts as soon as Phase 1's scaffold is up (hour ~16, once there's at least a `/health` endpoint and an auth pattern to build against) and runs **in parallel** with the backend team's work on Phases 3–6, not after it. Assign at least 2 people here from hour 16 onward — this parallelism is what makes the 48-hour window survivable.

Because this phase starts before Phases 3–6 are finished, build against **mocked API responses first**, then swap to real endpoints as each backend phase lands. Don't block frontend progress waiting for a real `/api/copilot/query` to exist.

## Features Covered

| Feature | Status |
|---|---|
| Firebase Auth (email/password, single role flag) | Core, simplified |
| Core layout (sidebar, header, main content area) | Core |
| Upload Center (drag-and-drop, status polling) | Core |
| Copilot Chat UI (streaming, citations, confidence) | Core |
| Document Explorer (list/filter view) | Core |

## Folder Structure Changes

```
onbrain/frontend/src/
├── lib/
│   ├── firebase.js              # Firebase Auth client config
│   └── api-client.js            # fetch/axios wrapper, attaches JWT to requests
├── hooks/
│   ├── useAuth.js
│   └── useDocumentStatus.js     # polling hook for upload status
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── FileDropzone.jsx
│   ├── ChatMessage.jsx          # renders one message, incl. citations + confidence badge
│   └── CitationPanel.jsx
├── views/
│   ├── Login.jsx
│   ├── UploadCenter.jsx
│   ├── CopilotChat.jsx
│   └── DocumentExplorer.jsx
└── App.jsx                       # routing, route protection
```

## Step-by-Step Instructions

1. **Firebase Auth integration** (`lib/firebase.js`, `views/Login.jsx`)
   - Initialize the Firebase Web SDK with your project config from Phase 1. Verify current Firebase JS SDK initialization syntax against the official docs — the modular v9+ API differs meaningfully from older versions.
   - Build a simple email/password login form. No Google SSO (cut, per architecture notes).
   - On successful login, store the Firebase ID token and attach it as an `Authorization: Bearer <token>` header on every API call via `api-client.js`.
   - Store a single `role` field (`engineer` or `technician`) on the user record (Firebase custom claims or a simple backend-side user table — pick whichever is faster for your team to wire up correctly in the time available).

2. **Core layout** (`components/Sidebar.jsx`, `components/Header.jsx`, `App.jsx`)
   - Sidebar with links to Upload Center, Copilot Chat, Document Explorer (Graph Explorer and RCA Workbench are added as links in Phase 8, don't build empty pages for them yet).
   - Route protection: unauthenticated users redirect to `/login`. Keep the role check simple — if the route/component itself doesn't need to differ by role, don't build role-gating you don't need yet.

3. **Upload Center** (`views/UploadCenter.jsx`, `components/FileDropzone.jsx`, `hooks/useDocumentStatus.js`)
   - Drag-and-drop file input, document type selector (or auto-detect display once Phase 3's format detection is wired in).
   - On upload, `POST` to `/api/documents/upload` (Phase 3 endpoint) and receive a job ID.
   - `useDocumentStatus.js`: polls `GET /api/documents/{id}/status` every few seconds, updates a status badge (`pending` / `processing` / `complete` / `failed`) until it resolves. Until Phase 3's real endpoint exists, mock this hook to return a canned sequence of statuses so the UI is demoable in isolation.

4. **Copilot Chat** (`views/CopilotChat.jsx`, `components/ChatMessage.jsx`, `components/CitationPanel.jsx`)
   - Chat-style message list with an input box.
   - Wire to `POST /api/copilot/query` with SSE streaming once Phase 5 lands. Verify current EventSource/SSE consumption syntax against MDN or your chosen library's docs rather than assuming remembered API shape.
   - Each assistant message renders: the answer text, a confidence badge (e.g. color-coded high/medium/low), and an expandable citation panel listing source documents with page numbers. If the backend confidence score or citation format changes shape during Phase 5, keep this component's prop contract simple and adjust the mapping, not the whole component.
   - Until Phase 5 is live, mock this against a hardcoded sample response matching the expected shape (agree on this JSON shape with whoever's building the Copilot agent, before either side writes code, so integration in Phase 9 is trivial).

5. **Document Explorer** (`views/DocumentExplorer.jsx`)
   - List/grid view of ingested documents from `GET /api/documents`.
   - Filter by document type and date.
   - Click a document to see its extracted entities (once Phase 3/4 expose this) — keep this simple, a read-only detail panel is enough.

## Manual Verification Checklist

- [ ] Log in with a real Firebase test account; confirm the session persists on page refresh and the JWT is attached to outgoing API calls (check the Network tab).
- [ ] Log out and confirm protected routes redirect to `/login`.
- [ ] Upload a file through the UI and confirm the status badge updates through its states (mocked or real, whichever is wired at the time you test).
- [ ] Send a message in Copilot Chat and confirm the response renders with a visible confidence indicator and an expandable citation list — even against mocked data, confirm the UI handles a "low confidence / insufficient sources" response gracefully, not just the happy path.
- [ ] Browse the Document Explorer and confirm filtering by type and date actually changes the visible list.
- [ ] Once Phase 3 and Phase 5 real endpoints exist, re-run all of the above against real data, not mocks, and confirm nothing broke in the swap.

## Dependencies

- Phase 1: FastAPI skeleton and `.env` pattern must exist so the frontend has something to point at (even mocked).
- Phase 3 (partial): real upload/status endpoint, swapped in once available.
- Phase 5 (partial): real Copilot endpoint, swapped in once available.

## Notes / Scope Cuts

- Google SSO and granular role-based access control are cut — one role flag is enough for the demo persona split (engineer vs. technician), full RBAC middleware is not built.
- Agree on the mocked-response JSON shapes with the backend team **before** writing either side's code — mismatched shapes discovered during Phase 9 integration cost far more time than a 10-minute shape-alignment conversation now.
