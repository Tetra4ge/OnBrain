# 📡 API Reference — FastAPI Endpoints

> Complete endpoint catalog for the OnBrain backend.

**[← Data Flow](./data-flow.md) | [Docs Index](./README.md) | [Architecture](../architecture.md)**

---

## Overview

The FastAPI backend serves as the central hub connecting the [Application Layer](./application.md) to the [Ingestion](./ingestion.md), [Knowledge](./knowledge-layer.md), and [Agent](./agents.md) layers. All endpoints require Firebase Auth JWT tokens (except health checks).

**Base URL:** `https://api.onbrain.app` (production) | `http://localhost:8000` (development)

---

## Authentication

All protected endpoints require a valid Firebase JWT in the `Authorization` header:

```
Authorization: Bearer <firebase_jwt_token>
```

**Middleware:** Firebase token verification runs on every request. Role-based access is enforced via custom claims. See [Application — Auth](./application.md#authentication) for role definitions.

---

## Endpoints

### Health & Status

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Service health check |
| `GET` | `/api/status` | ✅ | System status (store connectivity, queue depth) |

---

### Document Ingestion

**Layer:** [Ingestion Pipeline](./ingestion.md)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/documents/upload` | ✅ | `admin`, `engineer` | Upload one or more documents for processing |
| `GET` | `/api/documents` | ✅ | All | List all documents with filters |
| `GET` | `/api/documents/{doc_id}` | ✅ | All | Get document detail + metadata |
| `GET` | `/api/documents/{doc_id}/status` | ✅ | All | Check ingestion processing status |
| `DELETE` | `/api/documents/{doc_id}` | ✅ | `admin` | Delete document from all stores |

**Upload Request:**
```bash
POST /api/documents/upload
Content-Type: multipart/form-data

file: <binary>
doc_type: "work_order" | "inspection" | "manual" | "pid" | "procedure" | "regulation"
```

**Upload Response:**
```json
{
  "doc_id": "uuid",
  "filename": "WO-2024-0891.pdf",
  "status": "processing",
  "job_id": "uuid"
}
```

---

### Copilot Agent

**Layer:** [Agent Layer — Copilot](./agents.md#copilot-agent)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/copilot/query` | ✅ | All | Ask a question — streaming SSE response |
| `GET` | `/api/copilot/history` | ✅ | All | Get conversation history for current user |
| `DELETE` | `/api/copilot/history` | ✅ | All | Clear conversation history |

**Query Request:**
```json
{
  "question": "What is the failure history of pump P-101A?",
  "context_filters": {
    "equipment_tags": ["P-101A"],
    "doc_types": ["inspection", "work_order"],
    "date_range": { "from": "2024-01-01", "to": "2024-12-31" }
  }
}
```

**Query Response (SSE stream):**
```
event: token
data: {"text": "Pump P-101A has experienced..."}

event: token
data: {"text": " 3 bearing failures..."}

event: sources
data: {"sources": [{"doc_id": "...", "title": "...", "relevance": 0.94}]}

event: done
data: {"confidence": 0.89}
```

---

### RCA Agent

**Layer:** [Agent Layer — RCA](./agents.md#rca-agent)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/rca/analyze` | ✅ | `admin`, `engineer` | Trigger RCA for equipment + failure |
| `GET` | `/api/rca/reports` | ✅ | All | List past RCA reports |
| `GET` | `/api/rca/reports/{report_id}` | ✅ | All | Get specific RCA report |

**Analyze Request:**
```json
{
  "equipment_tag": "P-101A",
  "failure_description": "Bearing failure detected during routine inspection",
  "failure_date": "2024-12-01"
}
```

**Analyze Response:** See [RCA Agent — Output Format](./agents.md#output-format)

---

### Knowledge Graph

**Layer:** [Knowledge Layer — Neo4j](./knowledge-layer.md#knowledge-graph)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/graph/equipment` | ✅ | `admin`, `engineer` | List all equipment nodes |
| `GET` | `/api/graph/equipment/{tag}` | ✅ | All | Get equipment node + relationships |
| `GET` | `/api/graph/equipment/{tag}/history` | ✅ | All | Full timeline: failures, work orders, inspections |
| `POST` | `/api/graph/query` | ✅ | `admin`, `engineer` | Execute custom Cypher query |

---

### Search

**Layer:** [Knowledge Layer — ChromaDB](./knowledge-layer.md#vector-store)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/search` | ✅ | All | Semantic search across all documents |
| `POST` | `/api/search/hybrid` | ✅ | All | Combined semantic + graph search |

---

## Error Responses

All endpoints return consistent error objects:

```json
{
  "detail": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Document with ID 'uuid' not found",
    "timestamp": "2024-12-01T14:30:00Z"
  }
}
```

| HTTP Code | Meaning |
|-----------|---------|
| `400` | Bad request — invalid input |
| `401` | Unauthorized — missing/invalid JWT |
| `403` | Forbidden — insufficient role permissions |
| `404` | Not found |
| `422` | Validation error — schema mismatch |
| `500` | Internal server error |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Application Layer](./application.md) | Frontend consuming these endpoints |
| [Agent Layer](./agents.md) | Copilot + RCA agents behind `/api/copilot` and `/api/rca` |
| [Knowledge Layer](./knowledge-layer.md) | Stores behind `/api/graph` and `/api/search` |
| [Ingestion Layer](./ingestion.md) | Pipeline behind `/api/documents/upload` |
| [Data Flow](./data-flow.md) | How requests flow through the system |
