# 🏗️ Phase 1 — Foundation (Days 1–2)

> Repo setup, data collection, schema design for all stores.

**[← Phases Index](./README.md) | Next: [Phase 2 — Ingestion →](./phase-2-ingestion.md)**

---

## Objective

Establish the project foundation: repository structure, development environment, Docker Compose orchestration, sample data collection, and database schema design for MongoDB, Neo4j, and ChromaDB.

---

## Deliverables

### Day 1 — Repository & Environment

- [ ] Initialize Git repository with branching strategy (`main` / `dev` / feature branches)
- [ ] Set up monorepo structure:
  ```
  onbrain/
  ├── backend/          # FastAPI application
  │   ├── app/
  │   │   ├── api/      # Route handlers
  │   │   ├── agents/   # Copilot + RCA agent logic
  │   │   ├── ingestion/# OCR, YOLO, extraction pipeline
  │   │   ├── knowledge/# ChromaDB, Neo4j, MongoDB clients
  │   │   ├── models/   # Pydantic schemas
  │   │   └── core/     # Config, auth middleware, utils
  │   ├── requirements.txt
  │   └── Dockerfile
  ├── frontend/         # React 19 application
  │   ├── src/
  │   ├── package.json
  │   └── Dockerfile
  ├── docker-compose.yml
  ├── docs/             # This documentation
  ├── phases/           # Build phase tracking
  └── README.md
  ```
- [ ] Create `docker-compose.yml` with services: `api`, `frontend`, `chroma`, `neo4j`, `mongo`
- [ ] Configure environment variables (`.env.example`)
- [ ] Verify all services start and connect

### Day 2 — Data & Schemas

- [ ] Collect sample documents:
  - 3–5 P&ID drawings (for YOLOv8 testing)
  - 5–10 work orders (PDF / text)
  - 3–5 inspection reports
  - 2–3 equipment manuals
  - 1–2 regulatory documents
- [ ] Design MongoDB document schema (see [Knowledge Layer — Metadata Store](../docs/knowledge-layer.md#document-metadata-store))
- [ ] Design Neo4j node/relationship schema (see [Knowledge Layer — Knowledge Graph](../docs/knowledge-layer.md#knowledge-graph))
- [ ] Design ChromaDB collection schema (see [Knowledge Layer — Vector Store](../docs/knowledge-layer.md#vector-store))
- [ ] Create FastAPI skeleton with health check endpoint
- [ ] Set up Firebase Auth project and configure API keys

---

## Success Criteria

| Criteria | Verification |
|----------|-------------|
| Docker Compose starts all 5 services | `docker-compose up` — all healthy |
| FastAPI responds on `/health` | `curl localhost:8000/health` → 200 |
| Neo4j browser accessible | `http://localhost:7474` loads |
| MongoDB connectable | `mongosh` connects successfully |
| ChromaDB operational | Python client can create collection |
| Sample documents collected | ≥15 diverse documents in `data/samples/` |

---

## Technologies Set Up

| Technology | Action | Reference |
|------------|--------|-----------|
| Docker Compose | Configure multi-service orchestration | [Tech Stack](../docs/tech-stack.md) |
| FastAPI | Skeleton app with routing | [API Reference](../docs/api-reference.md) |
| Neo4j | Schema design, constraints | [Knowledge Layer](../docs/knowledge-layer.md#knowledge-graph) |
| MongoDB | Collection + index design | [Knowledge Layer](../docs/knowledge-layer.md#document-metadata-store) |
| ChromaDB | Collection creation | [Knowledge Layer](../docs/knowledge-layer.md#vector-store) |
| Firebase Auth | Project setup, API key config | [Application Layer](../docs/application.md#authentication) |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Architecture](../architecture.md) | Overall blueprint being implemented |
| [Tech Stack](../docs/tech-stack.md) | Technology choices guiding setup |
| [Knowledge Layer](../docs/knowledge-layer.md) | Schema targets for all three stores |
| [Phase 2 — Ingestion](./phase-2-ingestion.md) | Next phase — depends on this foundation |
