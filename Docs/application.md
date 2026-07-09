# 🖥️ Layer 4 — Application Layer

> User-facing interfaces: web dashboard, mobile chat, auth, and deployment.

**[← Agent Layer](./agents.md) | [Docs Index](./README.md) | [Architecture](../architecture.md)**

---

## Overview

The Application Layer is where OnBrain meets its users. It provides two interfaces — a full-featured web dashboard for engineers and a lightweight mobile-responsive chat for field technicians — both backed by the same FastAPI backend and agent infrastructure.

**Architecture Reference:** [architecture.md § Layer 4 — Application](../architecture.md)  
**Build Phase:** [Phase 5 — Application](../phases/phase-5-application.md)

---

## Components

### Web Dashboard

| Property | Detail |
|----------|--------|
| **Technology** | React 19 + Tailwind CSS |
| **Target Users** | Engineers, reliability analysts, plant managers |
| **Purpose** | Full document/graph exploration, copilot Q&A, RCA analysis |

**Key Views:**

| View | Description | Data Source |
|------|-------------|-------------|
| **Document Explorer** | Browse, search, and filter all ingested documents | [MongoDB](./knowledge-layer.md#document-metadata-store) |
| **Graph Explorer** | Interactive knowledge graph visualization | [Neo4j](./knowledge-layer.md#knowledge-graph) |
| **Copilot Chat** | Conversational Q&A with citation panel | [Copilot Agent](./agents.md#copilot-agent) |
| **RCA Workbench** | Trigger and review root-cause analyses | [RCA Agent](./agents.md#rca-agent) |
| **Upload Center** | Drag-and-drop document ingestion with progress tracking | [Ingestion Pipeline](./ingestion.md) |
| **Equipment Profile** | Single-equipment view: history, failures, procedures, compliance | [Neo4j](./knowledge-layer.md#knowledge-graph) |

**Design Principles:**
- Industrial-grade clarity — data-dense but scannable
- Real-time feedback during document ingestion
- Graph visualizations use force-directed layouts for intuitive exploration
- Citation panels show source documents inline with answers

---

### Mobile-Responsive Chat

| Property | Detail |
|----------|--------|
| **Technology** | Same React app, responsive layout |
| **Target Users** | Field technicians, maintenance crews |
| **Purpose** | Quick Q&A at the point of need — on the shop floor |

**Design Principles:**
- Optimized for one-handed use on mobile devices
- Voice-to-text input support (browser native)
- Answers are concise with expandable detail sections
- Offline-capable for basic cached queries (PWA stretch goal)

---

### Authentication

| Property | Detail |
|----------|--------|
| **Technology** | Firebase Auth |
| **Methods** | Email/password, Google SSO |
| **Authorization** | Role-based: `admin`, `engineer`, `technician` |

**Role Permissions:**

| Role | Upload | Query Copilot | RCA Analysis | Graph Explorer | User Management |
|------|--------|---------------|--------------|----------------|-----------------|
| `admin` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `engineer` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `technician` | ❌ | ✅ | View only | ❌ | ❌ |

**Integration:**
- Firebase JWT tokens are validated by FastAPI middleware on every request.
- User roles stored in Firebase custom claims.
- See [API Reference — Auth](./api-reference.md) for endpoint protection details.

---

### Deployment

| Property | Detail |
|----------|--------|
| **Containerization** | Docker Compose (multi-service) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **Database Hosting** | Neo4j Aura (managed), MongoDB Atlas (managed), ChromaDB (self-hosted on Render) |

**Docker Compose Services:**
```yaml
services:
  api:         # FastAPI backend
  frontend:    # React 19 app (dev only, Vercel in prod)
  chroma:      # ChromaDB vector store
  neo4j:       # Neo4j graph database
  mongo:       # MongoDB metadata store
```

---

## Backend — FastAPI

The FastAPI backend is the central hub connecting all layers:

```
┌──────────────┐     ┌──────────────┐
│  React App   │     │  Mobile Chat │
└──────┬───────┘     └──────┬───────┘
       │                    │
       └────────┬───────────┘
                │
         ┌──────▼──────┐
         │   FastAPI    │
         │   Backend    │
         │              │
         │  ┌────────┐  │
         │  │ Auth   │  │ ← Firebase JWT validation
         │  │Middleware│ │
         │  └────────┘  │
         │              │
         │  ┌────────┐  │
         │  │ Routes │  │ ← /api/upload, /api/copilot, /api/rca, ...
         │  └────────┘  │
         └──────┬───────┘
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
   Ingestion  Agents  Knowledge
    Layer     Layer     Layer
```

**Full endpoint catalog:** [API Reference](./api-reference.md)

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Agent Layer](./agents.md) | Provides reasoning for copilot and RCA |
| [Ingestion Layer](./ingestion.md) | Upload center triggers ingestion |
| [Knowledge Layer](./knowledge-layer.md) | Data source for graph explorer and search |
| [Tech Stack](./tech-stack.md) | Frontend and deployment tech choices |
| [Phase 5 — Application](../phases/phase-5-application.md) | Build timeline for this layer |
| [API Reference](./api-reference.md) | Full endpoint documentation |
