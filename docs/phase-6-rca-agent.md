# 🔧 Phase 6 — RCA Agent (Hours 26–30)

**[← Phase 5 — Copilot Agent](./phase-5-copilot-agent.md) | [Phases Index](./README.md) | Next: [Phase 7 — Frontend Core →](./phase-7-frontend-core.md)**

---

## Objective

Build the root-cause-analysis agent: given an equipment tag and a failure description, gather evidence from the knowledge layer and produce ranked hypotheses with actionable recommendations linked to real procedures. This is your primary differentiator over a plain RAG chatbot — treat it as a first-class feature, not an afterthought.

## Features Covered

| Feature | Status |
|---|---|
| Evidence gathering (failure history, OEM specs, inspection logs) | Core |
| Multi-step reasoning chain (pattern detection → hypotheses → evidence ranking → recommendations) | Core |
| Recommendations linked to procedures/regulations via the graph | Core |
| RCA report storage and retrieval | Core, minimal |

## Folder Structure Changes

```
onbrain/backend/app/
├── agents/
│   └── rca_agent.py            # evidence gathering + reasoning chain
├── api/routes/
│   └── rca.py                   # POST /api/rca/analyze, GET /api/rca/reports
```

## Step-by-Step Instructions

1. **Build evidence gathering** (`rca_agent.py`)
   - Given an `equipment_tag`, pull three evidence sources using functions already built in Phase 4/5:
     - Failure history — Neo4j graph traversal from the equipment node.
     - OEM specs and relevant manual sections — ChromaDB semantic search scoped to `doc_type: manual`.
     - Inspection logs — ChromaDB semantic search scoped to `doc_type: inspection_report`.
   - (The original plan's fourth source, "past RCA reports," is cut for time — see notes below.)

2. **Build the reasoning chain** — implement as four explicit steps, each a separate prompt/function so you can debug and demo each stage independently rather than one opaque call:
   - **Pattern detection** — given the evidence, summarize any recurring failure pattern for this equipment.
   - **Hypothesis generation** — produce at least 2 ranked candidate root causes.
   - **Evidence ranking** — for each hypothesis, list which pieces of evidence support or weaken it.
   - **Recommendation generation** — for the top hypothesis, generate a concrete next action, and link it to a real `Procedure` or `Regulation` node from the graph if one exists (don't fabricate a procedure reference — if none exists in the corpus, say so).

3. **Build the endpoint** (`api/routes/rca.py`)
   - `POST /api/rca/analyze` — takes `{equipment_tag, failure_description}`, runs the four-step chain, returns the full structured output (pattern, hypotheses, evidence, recommendation).
   - `GET /api/rca/reports` — save each RCA result to Firestore with a timestamp and equipment tag, retrievable by tag.

## Manual Verification Checklist

- [ ] Run RCA analysis on 2–3 different sample equipment/failure scenarios drawn from your actual sample documents (not hypothetical ones) — confirm each returns at least 2 distinct, sensible hypotheses.
- [ ] For each result, manually check: does the "supporting evidence" for each hypothesis actually trace back to something present in the source documents, or did the model invent it? This is the most important check in this phase — an RCA agent that fabricates plausible-sounding evidence is worse than one that admits it lacks data.
- [ ] Confirm the top recommendation links to a real procedure/regulation node when one exists in the graph, and explicitly says "no matching procedure found" when one doesn't — it should never silently omit this or invent a reference.
- [ ] Retrieve a saved report via `GET /api/rca/reports` and confirm the stored version matches what was originally returned.
- [ ] Time the full analyze call — if it's taking more than ~10-15 seconds, flag this now so Phase 9 has time to address it rather than discovering it during demo rehearsal.

## Dependencies

- Phase 4: Neo4j graph traversal and ChromaDB semantic search working.
- Phase 5: reuses the same Gemini client setup pattern — build this after Copilot so you're not solving the same SDK-syntax questions twice.

## Notes / Scope Cuts

- "Past RCA reports" as a fourth evidence source is cut — with only 3 sources (failure history, OEM specs, inspection logs) the reasoning chain is still substantive and demoable. Re-add this only if Phase 6 finishes with meaningful time to spare before Phase 7/8 need help.
