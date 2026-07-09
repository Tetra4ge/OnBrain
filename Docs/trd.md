# TRD — PlantIQ

## 1. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 19 + Tailwind | Dashboard, graph explorer, RCA generator, chat — reuses patterns from prior projects |
| Graph visualization | react-force-graph or vis-network | Lightweight, no separate graph DB server needed for the viewer |
| Backend | FastAPI | Single service, async endpoints |
| Vector store | ChromaDB | Local/embedded — no separate infra to stand up |
| Knowledge graph | NetworkX (in-memory, persisted to JSON) for MVP; Neo4j noted as production path | Avoids standing up a graph DB server under hackathon time pressure |
| LLM | Groq (Llama 3.3 70B or equivalent) | Used for extraction, gap reasoning, RCA generation, and copilot answers — low latency matters live |
| Document metadata store | MongoDB | Document records, extraction status, gap findings |
| Scheduler | Manual trigger endpoint for demo; APScheduler stubbed in for the documented production path | Framed explicitly as "designed for scheduled execution" |
| Auth | Skipped for MVP (single demo tenant); Firebase Auth noted as roadmap item | Saves build time without touching the core pitch |
| Deployment | Docker Compose locally; Render/Vercel for a shareable demo link | |

## 2. Data model

**Node types**
- `Equipment` — tag, type, location, install date
- `Procedure` — id, title, applicable equipment, regulatory basis
- `WorkOrder` — id, equipment ref, date, description, technician
- `InspectionRecord` — id, equipment ref, date, result, inspector
- `Incident` — id, date, equipment refs, description, severity
- `Regulation` — id, source (OISD/Factory Act/PESO), clause, requirement text
- `Person` — id, role, name

**Edge types**
- `Equipment -[HAS_WORK_ORDER]-> WorkOrder`
- `Equipment -[HAS_INSPECTION]-> InspectionRecord`
- `Equipment -[GOVERNED_BY]-> Regulation`
- `Procedure -[APPLIES_TO]-> Equipment`
- `Incident -[INVOLVES]-> Equipment`
- `Incident -[REFERENCES]-> Procedure`
- `WorkOrder -[PERFORMED_BY]-> Person`

Every node carries a `source_doc_id` and `source_span` (page/line reference) so any graph fact
traces back to the exact document it came from — required for the citation trail.

## 3. Pipeline

1. **Ingest** — document dropped into `/ingest` endpoint → format detected (PDF text extraction
   for MVP; OCR out of scope) → raw text stored in MongoDB with status `pending`.
2. **Extract** — LLM call with a structured JSON schema prompt returns entities + relationships
   for the document. Validate against the schema before writing to the graph; reject/flag
   malformed extractions rather than silently dropping them.
3. **Graph update** — new/updated nodes and edges merged into the in-memory graph (keyed by
   entity id, not overwritten wholesale) and persisted to JSON on each write.
4. **Embed** — document chunks embedded and written to ChromaDB in parallel with step 3.
5. **Gap scan** (on trigger) — a fixed rule set walks the graph:
   - equipment nodes with no `HAS_INSPECTION` edge in N days
   - `Regulation` nodes with no inbound `GOVERNED_BY` edge from any equipment with a
     matching document
   - `Procedure`/`WorkOrder` nodes referencing an equipment tag with no corresponding
     `Equipment` node at all
   Findings written to MongoDB with type, entities involved, rule triggered, source doc links.
6. **Query time (RCA + copilot)** — hybrid retrieval: vector similarity search over chunks +
   graph traversal from any entities mentioned in the query → both contexts passed to the LLM
   → response generated with inline citations back to `source_doc_id`s.

## 4. API surface (indicative)

```
POST /ingest                  — upload a document, kicks off extract + embed
GET  /graph                   — full graph (or filtered by entity type) for the explorer
GET  /graph/node/{id}         — node detail + linked documents
POST /gap-scan/run            — trigger a gap scan
GET  /gap-scan/findings       — current findings for the dashboard
POST /rca/generate            — incident description in, structured RCA report out
POST /copilot/query           — free-text question in, cited answer out
```

## 5. Non-functional requirements

- **Latency:** copilot/RCA responses should return within ~5-8s for a live demo — favor Groq
  for this reason.
- **Traceability:** every generated claim (gap finding, RCA factor, copilot answer) must carry a
  pointer to source document(s); untraceable claims are not acceptable output.
- **Incremental updates:** re-ingesting or adding documents must not require rebuilding the
  entire graph or vector store from scratch.
- **Explicit synthetic-data disclosure:** the demo dataset is clearly labeled as synthetic in the
  UI footer/about section, to preempt judge questions about data provenance.

## 6. Production path (documented, not built)

- Swap NetworkX for Neo4j once entity volume exceeds what fits comfortably in memory.
- Replace manual scan trigger with APScheduler/cron worker for continuous scanning.
- Add OCR (Tesseract/PaddleOCR) and a CV-based P&ID parser for scanned/legacy drawings.
- Add Firebase Auth + role-based access for compliance officer vs. engineer vs. admin views.
- Integrate directly with plant CMMS/SCADA/DMS systems instead of manual document upload.
