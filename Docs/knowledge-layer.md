# 🧠 Layer 2 — Knowledge Layer

> Two complementary stores kept in sync on every new document, plus a metadata store.

**[← Ingestion Layer](./ingestion.md) | [Docs Index](./README.md) | Next: [Agent Layer →](./agents.md)**

---

## Overview

The Knowledge Layer is the persistent memory of OnBrain. Every document processed by the [Ingestion Pipeline](./ingestion.md) populates three synchronized stores:

1. **Vector Store (ChromaDB)** — for semantic similarity search (RAG retrieval)
2. **Knowledge Graph (Neo4j)** — for relational queries and RCA traversal
3. **Document Metadata Store (MongoDB)** — for raw metadata, versions, and audit trail

**Architecture Reference:** [architecture.md § Layer 2 — Knowledge](../architecture.md)  
**Build Phase:** [Phase 3 — Knowledge Layer](../phases/phase-3-knowledge.md)

---

## Components

### Vector Store

| Property | Detail |
|----------|--------|
| **Technology** | ChromaDB |
| **Purpose** | Chunk embeddings for semantic search (RAG retrieval) |
| **Embedding Model** | Gemini Embedding Model |
| **Chunk Strategy** | Overlapping chunks (512 tokens, 64-token overlap) |

**How It Works:**
```
Normalized Document → Text Chunking → Embedding Generation → ChromaDB Upsert
```

**Key Design Decisions:**
- ChromaDB chosen for speed of setup and sufficiency at demo scale.
- Overlapping chunks prevent context loss at chunk boundaries.
- Each chunk stores metadata linking back to the source document and entities.

**Query Interface:**
```python
# Semantic similarity search
results = chroma_collection.query(
    query_texts=["What is the failure history of pump P-101A?"],
    n_results=5,
    include=["documents", "metadatas", "distances"]
)
```

**Consumers:**
- [Copilot Agent](./agents.md#copilot-agent) — RAG retrieval for Q&A
- [RCA Agent](./agents.md#rca-agent) — contextual evidence retrieval

---

### Knowledge Graph

| Property | Detail |
|----------|--------|
| **Technology** | Neo4j |
| **Purpose** | Entity-relationship graph for structured queries and traversal |
| **Schema** | Equipment → WorkOrder → Failure → Procedure → Regulation |

**Node Types:**
| Node Label | Properties | Source |
|------------|-----------|--------|
| `Equipment` | tag, type, location, specs | P&ID parsing + entity extraction |
| `WorkOrder` | id, date, status, description | Work order documents |
| `Failure` | type, severity, date, root_cause | Inspection / maintenance logs |
| `Procedure` | id, title, version, steps | SOP documents |
| `Regulation` | code, title, agency, version | Regulatory filings |
| `Personnel` | name, role, certifications | Extracted from multiple doc types |
| `Document` | doc_id, type, upload_date | All ingested documents |

**Relationship Types:**
```
(Equipment)-[:HAS_WORK_ORDER]->(WorkOrder)
(Equipment)-[:EXPERIENCED]->(Failure)
(Failure)-[:RESOLVED_BY]->(Procedure)
(Procedure)-[:COMPLIES_WITH]->(Regulation)
(WorkOrder)-[:PERFORMED_BY]->(Personnel)
(Document)-[:MENTIONS]->(Equipment)
(Document)-[:CONTAINS]->(Failure)
```

**Example Query — Equipment Failure History:**
```cypher
MATCH (e:Equipment {tag: 'P-101A'})-[:EXPERIENCED]->(f:Failure)
OPTIONAL MATCH (f)-[:RESOLVED_BY]->(p:Procedure)
RETURN e.tag, f.type, f.date, f.severity, p.title
ORDER BY f.date DESC
```

**Consumers:**
- [RCA Agent](./agents.md#rca-agent) — graph traversal for root-cause analysis
- [Copilot Agent](./agents.md#copilot-agent) — structured lookups
- [Web Dashboard](./application.md#web-dashboard) — graph exploration UI

---

### Document Metadata Store

| Property | Detail |
|----------|--------|
| **Technology** | MongoDB |
| **Purpose** | Raw document metadata, versions, upload info, processing status |

**Document Schema:**
```json
{
  "_id": "ObjectId",
  "doc_id": "uuid",
  "filename": "WO-2024-0891.pdf",
  "doc_type": "work_order",
  "upload_timestamp": "2024-12-01T14:30:00Z",
  "uploaded_by": "user_id",
  "processing_status": "complete",
  "version": 1,
  "file_hash": "sha256:...",
  "file_size_bytes": 245760,
  "page_count": 3,
  "extraction_confidence": 0.94,
  "entity_count": 12,
  "chroma_chunk_ids": ["chunk_001", "chunk_002", "chunk_003"],
  "neo4j_node_ids": ["node_101", "node_102"]
}
```

**Purpose:**
- Audit trail for all uploaded documents
- Versioning and deduplication (via `file_hash`)
- Status tracking for the ingestion pipeline
- Cross-referencing chunk IDs (ChromaDB) and node IDs (Neo4j)

---

## Synchronization Logic

All three stores are updated atomically on every new document ingestion:

```
                     Normalized Document
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         ┌─────────┐  ┌─────────┐  ┌──────────┐
         │ ChromaDB│  │  Neo4j  │  │ MongoDB  │
         │ (embed) │  │ (graph) │  │ (meta)   │
         └─────────┘  └─────────┘  └──────────┘
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                   Sync Confirmation
                   (all three updated)
```

**Failure Handling:**
- If any store fails, the document is marked as `processing_status: "partial"` in MongoDB.
- A retry queue processes partial documents on a configurable interval.

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Ingestion Layer](./ingestion.md) | Produces data consumed by this layer |
| [Agent Layer](./agents.md) | Queries this layer for answers |
| [Tech Stack](./tech-stack.md) | Technology choices for stores |
| [Data Flow](./data-flow.md) | Full pipeline context |
| [Phase 3 — Knowledge](../phases/phase-3-knowledge.md) | Build timeline for this layer |
| [API Reference](./api-reference.md) | Search / graph query endpoints |
