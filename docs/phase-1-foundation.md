# 🏗️ Phase 1 — Foundation & Environment Setup (Hours 0–3)

**[← Phases Index](./README.md) | Next: [Phase 2 — Data & Schema →](./phase-2-data-schema.md)**

---

## Objective

A working repo skeleton where every team member can pull, run `docker-compose up`, and get all five backing services (API, frontend, MongoDB, Neo4j, ChromaDB) healthy. No feature code yet — this phase is pure scaffolding, and it is the phase every other phase depends on, so it must not be rushed or skipped.

## Features Covered

| Feature | Status |
|---|---|
| Monorepo structure | Core |
| Docker Compose orchestration (5 services) | Core |
| Environment variable management | Core |
| FastAPI skeleton with health check | Core |
| Firebase Auth project setup (config only, no UI yet) | Core |

## Folder Structure Changes

This phase creates the entire skeleton. Everything below is new.

```
onbrain/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app entrypoint, /health route
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   └── __init__.py     # routes added in later phases
│   │   │   └── deps.py             # shared FastAPI dependencies (empty for now)
│   │   ├── agents/
│   │   │   └── __init__.py         # populated in Phase 5–6
│   │   ├── ingestion/
│   │   │   └── __init__.py         # populated in Phase 3
│   │   ├── knowledge/
│   │   │   └── __init__.py         # populated in Phase 4
│   │   ├── models/
│   │   │   └── __init__.py         # Pydantic schemas, populated in Phase 2
│   │   └── core/
│   │       ├── __init__.py
│   │       ├── config.py           # loads env vars via pydantic-settings
│   │       └── auth.py             # Firebase token verification (populated Phase 7)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                 # placeholder route, populated Phase 7
│   │   └── lib/
│   │       └── api.js              # empty axios/fetch wrapper, populated Phase 7
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── data/
│   └── samples/                    # populated in Phase 2
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Step-by-Step Instructions

1. **Initialize the repository**
   - Create the repo, set default branch to `main`.
   - Create a `dev` branch. Agree as a team: feature branches off `dev`, merge to `dev`, only merge to `main` right before the deadline for the final submission commit.
   - Add a `.gitignore` covering `node_modules/`, `__pycache__/`, `.env`, `data/samples/*` (keep a `.gitkeep` so the folder exists), and Docker volumes.

2. **Scaffold the backend**
   - Create the `backend/app/` structure exactly as shown above — every subfolder gets an `__init__.py` even if empty, so imports work later.
   - `backend/app/main.py`: a minimal FastAPI app with one route, `GET /health`, returning `{"status": "ok"}`.
   - `backend/app/core/config.py`: use `pydantic-settings` to load env vars (`MONGO_URI`, `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, `CHROMA_HOST`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `FIREBASE_PROJECT_ID`). Verify current `pydantic-settings` import syntax against its docs before writing this — the import path has changed across pydantic versions.
   - `backend/requirements.txt`: pin `fastapi`, `uvicorn`, `pydantic-settings`, `python-dotenv`, plus placeholders for `pymongo`, `neo4j`, `chromadb`, `google-generativeai`, `groq` (installed now, used starting Phase 3–5).
   - `backend/Dockerfile`: standard `python:3.11-slim` base, install requirements, run via `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` for dev.

3. **Scaffold the frontend**
   - `npm create vite@latest frontend -- --template react` (verify current Vite scaffold command against its docs — flags change between major versions).
   - Add Tailwind CSS following its current Vite integration guide (verify current setup steps against Tailwind's docs rather than assuming a remembered config).
   - `frontend/Dockerfile`: Node base image, install deps, run dev server on `0.0.0.0` so it's reachable from outside the container.

4. **Write `docker-compose.yml`** with five services:
   - `api` — builds `./backend`, exposes `8000:8000`, mounts source for hot reload, depends on `mongo`, `neo4j`, `chroma`.
   - `frontend` — builds `./frontend`, exposes `5173:5173`.
   - `mongo` — official `mongo` image, exposes `27017`, named volume for data persistence.
   - `neo4j` — official `neo4j` image, exposes `7474` (browser) and `7687` (bolt), set `NEO4J_AUTH` via env, named volume.
   - `chroma` — official `chromadb/chroma` image, exposes `8001:8000` (avoid clashing with the API's 8000).
   - Verify current official image names and exposed ports for Neo4j and ChromaDB against Docker Hub before finalizing — these occasionally change between major versions.

5. **Create `.env.example`** listing every variable referenced in `config.py`, with placeholder values and a one-line comment on where to get each real value (Groq console, Google AI Studio, Firebase console, etc.). Each teammate copies this to `.env` and fills in their own keys or shares team keys via a secure channel — never commit `.env`.

6. **Set up the Firebase Auth project**
   - Create a new Firebase project (or reuse an existing team one).
   - Enable the Email/Password sign-in provider only — do not enable Google SSO for this build (cut, see architecture notes).
   - Generate a Web App config and a service account key for backend token verification. Store the service account JSON path in `.env`, never commit it.

7. **Verify the full stack boots**
   - Run `docker-compose up --build`.
   - Confirm all five containers report healthy/running with `docker-compose ps`.

## Manual Verification Checklist

Do these by hand, on a real browser/terminal, before marking this phase ✅:

- [ ] `docker-compose up` brings up all 5 services with no crash-loops (`docker-compose ps` shows all "Up").
- [ ] `curl localhost:8000/health` returns `{"status": "ok"}` with a 200 status code.
- [ ] Open `http://localhost:7474` in a browser — the Neo4j Browser login page loads.
- [ ] Log into Neo4j Browser with the credentials from `.env` and confirm it connects (empty database is fine at this stage).
- [ ] From a terminal, run `mongosh "<your MONGO_URI>"` and confirm it connects without error.
- [ ] Open `http://localhost:5173` — the default Vite/React starter page loads with Tailwind applied (test by adding one Tailwind class to the starter component and confirming the style shows).
- [ ] A second team member, on a different machine, clones the repo fresh, copies `.env.example` to `.env`, fills in their own keys, and successfully runs `docker-compose up` with no undocumented manual steps. This catches "works on my machine" problems before they cost you hours later.

## Dependencies

None — this is the first phase.

## Notes / Scope Cuts

- Google SSO is intentionally excluded. If a judge asks about it, the honest answer is "cut for time, email/password covers the demo."
- No CI/CD pipeline is set up — not worth the hours for a 48-hour build. Local Docker Compose is the only deployment target unless Phase 10 adds a cloud host.
