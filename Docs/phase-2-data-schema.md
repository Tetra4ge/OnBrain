# 📋 Phase 2 — Data Collection & Schema Lock (Hours 3–5)

**[← Phase 1 — Foundation](./phase-1-foundation.md) | [Phases Index](./README.md) | Next: [Phase 3 — Ingestion →](./phase-3-ingestion.md)**

---

## Objective

Lock the demo document set and the entity/relationship schema before any ingestion code is written. Every hour spent redesigning the schema after Phase 3 starts is an hour taken from somewhere else — this phase exists specifically to prevent that.

## Features Covered

| Feature | Status |
|---|---|
| Real demo documents (Vision Pavers / Index Industries) | Core |
| Supplementary public documents | Core |
| MongoDB metadata schema | Core |
| Neo4j node/relationship schema | Core |
| ChromaDB collection schema | Core |

## Folder Structure Changes

```
onbrain/
├── data/
│   └── samples/
│       ├── work-orders/           # 5-10 PDFs/text files
│       ├── inspection-reports/    # 3-5 PDFs
│       ├── manuals/                # 2-3 PDFs
│       ├── regulatory/             # 1-2 PDFs
│       └── pids/                   # 2-3 images, only if attempting the P&ID stretch task in Phase 3
├── backend/app/models/
│   └── schemas.py                  # Pydantic models for the locked entity schema
```

## Step-by-Step Instructions

1. **Finalize the demo document set**
   - Confirm access to real Vision Pavers / Index Industries documents (production logs, ERP extracts, process/safety notes). This is your single biggest differentiator — do not substitute generic data if real data is available.
   - Supplement to reach a working set of roughly 12–18 documents total: publicly available industrial safety/incident report PDFs, and 2–3 sample P&ID images if attempting the CV stretch task.
   - Drop everything into `data/samples/` in the subfolders shown above. Keep a plain-text `data/samples/MANIFEST.md` listing each file, its source (real / public / synthetic), and one line on what it's useful for demoing.

2. **Lock the entity schema.** As a team, agree on exactly these entity types and do not add more mid-build:
   - `Equipment` — `tag` (unique id), `name`, `type`, `location`
   - `WorkOrder` — `id`, `date`, `description`, `status`
   - `Failure` — `id`, `date`, `description`, `severity`
   - `Procedure` — `id`, `title`, `version`
   - `Regulation` — `code`, `title`, `authority`
   - `Personnel` — `name`, `role`
   - `Document` — `id`, `filename`, `doc_type`, `upload_date`, `source_path`

3. **Lock the relationship schema** (these become Neo4j relationship types in Phase 4):
   - `(Equipment)-[:HAS_WORK_ORDER]->(WorkOrder)`
   - `(Equipment)-[:EXPERIENCED]->(Failure)`
   - `(Failure)-[:RESOLVED_BY]->(WorkOrder)`
   - `(Equipment)-[:COMPLIES_WITH]->(Regulation)`
   - `(WorkOrder)-[:PERFORMED_BY]->(Personnel)`
   - `(Document)-[:MENTIONS]->(Equipment | Failure | Procedure | Regulation)`
   - `(Document)-[:CONTAINS]->(Procedure)`

4. **Write the Pydantic schema file** at `backend/app/models/schemas.py` — one class per entity type above, matching field names exactly. This file is the single source of truth every later phase imports from; do not redefine these fields elsewhere.

5. **Design the MongoDB metadata document shape** (used in Phase 4). One document per uploaded file:
   ```json
   {
     "_id": "doc_uuid",
     "filename": "string",
     "doc_type": "work_order | inspection_report | manual | regulation | pid",
     "upload_date": "ISO timestamp",
     "uploaded_by": "user id",
     "source_path": "path in object storage",
     "sync_status": "pending | partial | complete | failed",
     "chroma_chunk_ids": ["list of ids written to ChromaDB"],
     "neo4j_node_ids": ["list of node ids written to Neo4j"],
     "extracted_entity_count": "int",
     "error_log": ["list of any errors during processing"]
   }
   ```

6. **Design the ChromaDB collection schema** — one collection, `documents`, where every chunk carries this metadata: `doc_id`, `doc_type`, `chunk_index`, `page_number`, `source_filename`. This metadata is what makes citations possible in Phase 5, so don't skip any field.

## Manual Verification Checklist

- [ ] `data/samples/MANIFEST.md` lists every file with an accurate source label (real / public / synthetic) — read through it and confirm no file is mislabeled, since this is what you'll tell judges.
- [ ] At least 12 documents are present across at least 4 of the 5 subfolders.
- [ ] Every team member has read the locked entity/relationship list and confirms no one is planning to add fields mid-build.
- [ ] `backend/app/models/schemas.py` imports cleanly with no errors (`python -c "from app.models import schemas"` inside the API container).
- [ ] Open one sample work order and one sample inspection report and manually identify, on paper, which entities/relationships from the locked schema you'd expect extraction to find in each — this becomes your ground truth for the Phase 3 accuracy check.

## Dependencies

- Phase 1 complete: repo and backend skeleton exist so `schemas.py` has somewhere to live.

## Notes / Scope Cuts

- If Vision Pavers / Index Industries access falls through at this point, do not wait — fall back immediately to the public + synthetic supplementary set and note the change to the team. Losing more than 30 minutes here is not worth it.
