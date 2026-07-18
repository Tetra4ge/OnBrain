# 🧠 Phase 4 — Knowledge Layer (Hours 12–20)

**[← Phase 3 — Ingestion](./phase-3-ingestion.md) | [Phases Index](./README.md) | Next: [Phase 5 — Copilot Agent →](./phase-5-copilot-agent.md)**

---

## Objective

Take the normalized output from Phase 3 and populate all three stores — Neo4j (graph), ChromaDB (vectors), MongoDB (metadata) — with a simplified but honest sync mechanism. By the end of this phase, the system has a real, queryable knowledge base, not just cleaned text sitting in memory.

## Features Covered

| Feature | Status |
|---|---|
| Neo4j graph population + dedup | Core |
| ChromaDB chunking + embedding | Core |
| MongoDB metadata storage | Core |
| Simplified sync (status field, not full atomic transaction) | Core, simplified — see architecture notes |
| Search + graph query endpoints | Core |

## Folder Structure Changes

```
onbrain/backend/app/
├── knowledge/
│   ├── __init__.py
│   ├── neo4j_client.py       # connection pooling, node/relationship writes, dedup logic
│   ├── chroma_client.py       # chunking, embedding, upsert, semantic search
│   ├── mongo_client.py        # metadata CRUD, sync status updates
│   └── sync.py                 # orchestrates writes across all three stores per document
├── api/routes/
│   └── knowledge.py            # POST /api/search, GET /api/graph/equipment/{tag}
```

## Step-by-Step Instructions

1. **Neo4j client** (`neo4j_client.py`)
   - Set up connection pooling using the official Neo4j Python driver. Verify current session/transaction method names against the driver's docs before writing queries — these have changed across major driver versions.
   - Create uniqueness constraints on `Equipment.tag`, `WorkOrder.id`, `Document.id` — these are what dedup depends on.
   - Write a function `upsert_entity(entity)` that uses `MERGE` (not `CREATE`) so re-ingesting a document that mentions the same equipment tag updates rather than duplicates the node.
   - Write a function `write_relationships(relationships)` for the relationship types locked in Phase 2.
   - Manually run 2–3 test Cypher queries in Neo4j Browser to confirm the graph shape is actually useful, not just populated — e.g. "find all failures for equipment tag X" should return a sensible path, not an empty result.

2. **ChromaDB client** (`chroma_client.py`)
   - Create one collection, `documents`.
   - Chunk text at roughly 512 tokens with 64-token overlap — verify current recommended chunking approach and the exact `ultralytics`/embedding-library token counting method you use, since off-by-a-lot chunk sizes hurt retrieval quality.
   - Generate embeddings via the Gemini embedding model. Verify the current embedding API call syntax against Google's docs before writing this — endpoint and function names change between SDK versions.
   - Upsert each chunk with the metadata fields locked in Phase 2 (`doc_id`, `doc_type`, `chunk_index`, `page_number`, `source_filename`).
   - Write a `semantic_search(query, top_k)` function returning chunks with relevance scores.

3. **MongoDB client** (`mongo_client.py`)
   - Implement the metadata schema from Phase 2. Create an index on `doc_id` and `sync_status`.
   - Write `create_document_record()`, `update_sync_status()`, `append_error()`.

4. **Sync orchestration** (`sync.py`) — this replaces the original full atomic-transaction design with a simpler, honest approach:
   - For each normalized document from Phase 3: write to Neo4j → on success, write to ChromaDB → on success, write to MongoDB with `sync_status: "complete"` and both stores' generated IDs cross-referenced.
   - If any step fails, catch the error, log it into the MongoDB record's `error_log`, set `sync_status: "partial"` or `"failed"` accordingly, and continue rather than crashing the whole ingestion call.
   - This is not a true distributed transaction — say so plainly if asked. The status field gives visibility into exactly what happened per document, which is what actually matters for a demo and for debugging under time pressure.

5. **Query endpoints** (`api/routes/knowledge.py`)
   - `POST /api/search` — takes a query string, calls `semantic_search`, returns ranked chunks with source metadata.
   - `GET /api/graph/equipment/{tag}` — returns the equipment node plus its connected work orders, failures, and procedures (a bounded-depth graph traversal, e.g. 2 hops, not an unbounded query).

## Manual Verification Checklist

- [ ] Ingest all documents in `data/samples/` through the Phase 3 → Phase 4 pipeline in one batch run.
- [ ] Open Neo4j Browser and visually inspect the graph — confirm equipment nodes, work order nodes, and their relationships are present and look sensible (not one giant disconnected blob, not thousands of orphan nodes).
- [ ] Re-ingest the same document a second time and confirm the equipment node count in Neo4j does not double — dedup is working.
- [ ] Run `POST /api/search` with a paraphrased question (wording different from the source document) and confirm it returns the correct chunk — this validates semantic search, not just keyword matching.
- [ ] Run `GET /api/graph/equipment/{tag}` for a tag you know exists and manually confirm the returned work orders/failures match what's actually in the source documents.
- [ ] Check the MongoDB `documents` collection — every ingested file has a record, and `sync_status` is `"complete"` for documents that should have succeeded. Deliberately break one write (e.g. temporarily stop the Neo4j container) and confirm the sync logic correctly logs `"failed"` rather than crashing silently.

## Dependencies

- Phase 1: all three databases running via Docker Compose.
- Phase 2: schemas locked.
- Phase 3: normalizer producing consistent output.

## Notes / Scope Cuts

- The original plan's "retry queue" for failed syncs is cut. If a write fails, it's logged and left in `"failed"` status for manual re-ingestion rather than automatically retried in the background. This is a known, acceptable limitation for a 48-hour build — mention it plainly if asked about production-readiness.
