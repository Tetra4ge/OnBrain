# PRD — PlantIQ

## 1. Problem statement

Industrial plants generate documentation across 7–12 disconnected systems (per the problem
brief). No system today watches all of them together and tells you what's missing, contradictory,
or overdue — you only find out when an audit fails or an incident happens. Separately, a large
share of experienced engineers are retiring within the decade, and their undocumented
operational judgment leaves with them.

## 2. Goals

| Goal | Metric |
|---|---|
| Detect knowledge/compliance gaps without being asked | Number of valid gaps surfaced per scan, false positive rate |
| Make the knowledge graph inspectable, not a black box | Graph linkage completeness (% entities with ≥1 relationship) |
| Generate usable RCA documentation from raw incident text | Judged report quality vs. domain-expert baseline |
| Answer specific queries with traceable citations | Answer accuracy + citation correctness on a benchmark question set |

## 3. Non-goals (MVP)

- Not a replacement for a full document management system (DMS).
- Not a real-time SCADA/CMMS integration in this version.
- Not attempting OCR of scanned/legacy drawings — synthetic text-based documents only.
- Not multi-tenant; single demo "plant" dataset.

## 4. Personas & user stories

**Compliance officer**
- As a compliance officer, I want a dashboard that already lists documentation gaps when I log
  in, so I don't have to manually cross-reference records against regulations.
- As a compliance officer, I want each flagged gap to show which regulation and which missing
  document/relationship triggered it, so I can act on it directly.

**Maintenance engineer**
- As a maintenance engineer, I want to type an incident description and get a structured RCA
  draft with citations to relevant past records, so I don't start from a blank page.
- As a maintenance engineer, I want to explore the equipment/procedure/incident graph visually,
  so I can see connections I wouldn't think to search for.

**Junior engineer / field technician**
- As a junior engineer, I want to ask a question in plain language and get a cited answer, so I
  don't have to know which of 10 systems holds the answer.

## 5. Functional requirements by surface

### 5.1 Ingestion & knowledge graph (foundation — build first)
- FR1: Accept a batch of documents (synthetic dataset: work orders, procedures, inspection
  reports, regulatory excerpts) and extract structured entities: equipment tags, dates, personnel,
  regulatory references, parameters.
- FR2: Build a knowledge graph incrementally — new documents add or update nodes/edges
  without a full rebuild.
- FR3: Chunk and embed document text into a vector store in parallel with graph construction.
- FR4: Every extracted entity/relationship must retain a pointer back to its source document.

### 5.2 Autonomous compliance/gap agent (primary demo surface)
- FR5: On trigger (manual button for demo; designed for scheduled execution in production), scan
  the graph for defined gap patterns:
  - Equipment tag referenced in a work order with no linked inspection record within a
    configurable interval.
  - Regulatory clause with no linked compliance evidence document.
  - Permit/procedure referencing equipment not present anywhere else in the graph.
- FR6: Populate a dashboard with findings — no user query required to see them.
- FR7: Each finding must show: the gap type, the entities involved, the rule that was violated,
  and a link to the underlying documents.
- FR8: Allow marking a finding as resolved/acknowledged (for demo realism).

### 5.3 Knowledge graph explorer
- FR9: Visual, interactive graph view of entities and relationships.
- FR10: Clicking a node shows its linked documents and relationships.
- FR11: Search/filter by entity type (equipment, procedure, incident, regulation, person).

### 5.4 RCA report generator
- FR12: Accept a free-text incident description as input.
- FR13: Retrieve related equipment history, past incidents, and procedures via hybrid
  (vector + graph) search.
- FR14: Generate a structured RCA document: incident summary, contributing factors, related
  historical patterns, cited sources, recommended corrective actions.
- FR15: Output must be exportable/copyable as a standalone document, not just a chat reply.

### 5.5 Copilot chat (secondary surface, build last)
- FR16: Free-text Q&A over the same hybrid retrieval stack used by the RCA generator.
- FR17: Every answer shows its source documents and, where relevant, the graph path used.
- FR18: Confidence indicator on answers (e.g., high/medium/low based on retrieval overlap).

## 6. Success metrics (mapped to hackathon judging criteria)

| Judging criterion | Weight | How PlantIQ demonstrates it |
|---|---|---|
| Innovation | 25% | Autonomous gap-detection agent, not query-triggered Q&A |
| Business impact | 25% | Direct ties to audit-readiness, downtime reduction, knowledge-cliff narrative |
| Technical excellence | 20% | Hybrid graph + vector retrieval, structured extraction pipeline |
| Scalability | 15% | Incremental graph updates, documented path to Neo4j/production scheduler |
| User experience | 15% | Dashboard-first UX, visual graph explorer, generated reports over raw chat |

## 7. Risks & mitigations

- **Risk:** Synthetic dataset looks fabricated to judges. **Mitigation:** ground it in realistic
  Indian regulatory references (OISD, Factory Act, PESO) and plausible equipment naming
  conventions; state clearly in the pitch that it's a synthetic demo dataset standing in for
  real plant records.
- **Risk:** Gap-detection agent produces noisy false positives. **Mitigation:** keep the rule set
  small and precise (3 gap patterns) rather than broad and noisy.
- **Risk:** Running out of build time. **Mitigation:** ingestion + graph + gap agent is the
  non-negotiable core; copilot chat is cut first if time runs short, not last.

## 8. Post-hackathon roadmap (mention in pitch, not built)

- OCR and P&ID drawing parsing.
- Live SCADA/CMMS/DMS integration.
- Neo4j in place of in-memory graph, scheduled scans via cron/worker.
- Role-based access and multi-plant tenancy.
