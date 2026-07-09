# 🧠 Phase 3 — Knowledge Layer (Days 6–8)

> Neo4j graph population, ChromaDB embedding pipeline, MongoDB metadata sync.

**[← Phase 2 — Ingestion](./phase-2-ingestion.md) | [Phases Index](./README.md) | Next: [Phase 4 — Agents →](./phase-4-agents.md)**

---

## Objective

Build the persistent knowledge stores and synchronization logic that transforms normalized ingestion output into a queryable knowledge base. All three stores (ChromaDB, Neo4j, MongoDB) must be populated atomically on every document ingestion.

**Primary Documentation:** [Knowledge Layer](../docs/knowledge-layer.md)

---

## Deliverables

### Day 6 — Neo4j Knowledge Graph

- [ ] Implement Neo4j client with connection pooling
- [ ] Create node types: `Equipment`, `WorkOrder`, `Failure`, `Procedure`, `Regulation`, `Personnel`, `Document`
- [ ] Create relationship types: `HAS_WORK_ORDER`, `EXPERIENCED`, `RESOLVED_BY`, `COMPLIES_WITH`, `PERFORMED_BY`, `MENTIONS`, `CONTAINS`
- [ ] Set up uniqueness constraints and indexes on key properties
- [ ] Build entity-to-node mapping from normalized ingestion output
- [ ] Implement graph population logic from extracted entities
- [ ] Test with sample data: verify graph structure in Neo4j Browser

### Day 7 — ChromaDB Embedding Pipeline

- [ ] Set up ChromaDB client and create document collection
- [ ] Implement text chunking (512 tokens, 64-token overlap)
- [ ] Integrate Gemini Embedding Model for vector generation
- [ ] Build chunk → embedding → upsert pipeline
- [ ] Store metadata with each chunk (doc_id, doc_type, entity refs)
- [ ] Implement semantic search function with relevance scoring
- [ ] Test retrieval quality on sample queries

### Day 8 — MongoDB Metadata & Sync Logic

- [ ] Set up MongoDB client and create collections + indexes
- [ ] Implement document metadata schema (see [Knowledge Layer — Metadata Store](../docs/knowledge-layer.md#document-metadata-store))
- [ ] Build cross-reference storage (chunk IDs → ChromaDB, node IDs → Neo4j)
- [ ] Implement **atomic sync logic** — all three stores updated together
- [ ] Build failure handling: partial processing status + retry queue
- [ ] Create search and graph query API endpoints:
  - `POST /api/search` (semantic search)
  - `GET /api/graph/equipment/{tag}` (graph lookup)
  - See [API Reference](../docs/api-reference.md)
- [ ] Integration test: ingestion output → all three stores populated + queryable

---

## Success Criteria

| Criteria | Target | Verification |
|----------|--------|-------------|
| Neo4j graph populated | All entity types + relationships created | Neo4j Browser visual inspection |
| Graph query works | Equipment history query returns results | Cypher query test |
| ChromaDB chunks stored | All documents chunked + embedded | Collection count matches expected |
| Semantic search works | Relevant results for domain queries | Top-5 retrieval relevance check |
| MongoDB metadata complete | All docs tracked with cross-refs | Document count + field validation |
| Sync atomicity | All 3 stores updated or none | Simulate failure, check consistency |
| API endpoints respond | Search + graph endpoints return data | API integration tests |

---

## Architecture Mapping

```
Phase 2 output ──────────────────────────────────────────────────┐
(Normalized documents)                                           │
                                                                 │
               ┌─────────────────────────────────────────────────┼──┐
               │         LAYER 2 — KNOWLEDGE                     │  │
               │                                                 ▼  │
               │  Day 6: [Neo4j] ◄──── Entity/relationship mapping  │
               │  Day 7: [ChromaDB] ◄── Chunk embedding pipeline    │
               │  Day 8: [MongoDB] ◄── Metadata + sync logic       │
               │              │                                     │
               └──────────────┼─────────────────────────────────────┘
                              │
                              ▼
                       Phase 4 queries these stores
```

---

## Key Decisions

| Decision | Choice | Rationale | Reference |
|----------|--------|-----------|-----------|
| Graph DB | Neo4j | Real graph queries for RCA traversal | [Knowledge — Graph](../docs/knowledge-layer.md#knowledge-graph) |
| Vector DB | ChromaDB | Fast setup, sufficient at demo scale | [Knowledge — Vector](../docs/knowledge-layer.md#vector-store) |
| Embedding model | Gemini Embedding | Consistency with Gemini reasoning LLM | [Tech Stack](../docs/tech-stack.md) |
| Chunk strategy | 512 tokens, 64 overlap | Balance between context and precision | [Knowledge — Vector](../docs/knowledge-layer.md#vector-store) |
| Sync approach | Atomic with retry queue | Data consistency across stores | [Knowledge — Sync](../docs/knowledge-layer.md#synchronization-logic) |

---

## Dependencies

| Depends On | From Phase | What's Needed |
|------------|-----------|---------------|
| Normalized document output | [Phase 2](./phase-2-ingestion.md) | Structured data to populate stores |
| Neo4j, ChromaDB, MongoDB running | [Phase 1](./phase-1-foundation.md) | Docker services healthy |
| Schema designs | [Phase 1](./phase-1-foundation.md) | Node types, collection schemas |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Knowledge Layer](../docs/knowledge-layer.md) | Full technical specification |
| [Ingestion Layer](../docs/ingestion.md) | Produces data consumed here |
| [Agent Layer](../docs/agents.md) | Queries stores built here |
| [Data Flow](../docs/data-flow.md) | Pipeline context |
| [Phase 4 — Agents](./phase-4-agents.md) | Next phase — queries these stores |
