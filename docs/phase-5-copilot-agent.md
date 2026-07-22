# 💬 Phase 5 — Copilot Agent (Hours 20–26)

**[← Phase 4 — Knowledge Layer](./phase-4-knowledge.md) | [Phases Index](./README.md) | Next: [Phase 6 — RCA Agent →](./phase-6-rca-agent.md)**

---

## Objective

Build the RAG agent that turns a user's natural-language question into a cited, confidence-scored answer by combining vector search and graph traversal. This is the single most important phase for the demo — allocate your strongest people here and protect their time from interruptions.

## Features Covered

| Feature | Status |
|---|---|
| Hybrid retrieval (vector + graph) | Core |
| Tool-calling (search_documents, query_graph, get_document_metadata) | Core |
| Citations linking to exact source page | Core |
| Confidence scoring + "not enough source coverage" fallback | Core |
| SSE streaming responses | Core |
| Conversation history | Core, minimal |
| Cross-document contradiction detection | **Stretch** |

## Folder Structure Changes

```
onbrain/backend/app/
├── agents/
│   ├── __init__.py
│   ├── tools.py               # tool definitions: search_documents, query_graph, get_document_metadata
│   ├── copilot_agent.py       # query planning, answer synthesis, citations, confidence
│   └── contradiction.py       # STRETCH ONLY — cross-document disagreement detection
├── api/routes/
│   └── copilot.py              # POST /api/copilot/query (SSE), GET /api/copilot/history
```

## Step-by-Step Instructions

1. **Set up the Gemini client for reasoning** (`copilot_agent.py`)
   - Verify current Gemini API client initialization and function-calling/tool syntax against Google's docs before writing this — do not rely on remembered method names, this API has changed across SDK versions.

2. **Define tools** (`tools.py`)
   - `search_documents(query)` → calls Phase 4's `semantic_search`.
   - `query_graph(equipment_tag)` → calls Phase 4's graph endpoint logic directly (as a function, not an HTTP round-trip, since it's in-process).
   - `get_document_metadata(doc_id)` → calls Phase 4's Firestore client.
   - Each tool must return data with enough structure that the agent can cite it (doc_id, page_number, source_filename attached to every result).

3. **Build query planning** — the agent decides which tool(s) to call based on the question. Keep this simple for 48 hours: a single-pass "call search_documents and query_graph if an equipment tag is mentioned, then synthesize" is enough — don't build a complex multi-step planning loop unless time allows after the checkpoint below passes.

4. **Build answer synthesis with citations**
   - Prompt the model to produce an answer plus a structured citation list (`[{doc_id, page_number, source_filename, quoted_snippet}]`) for every claim.
   - Format citations in the API response so the frontend (Phase 7) can render them as clickable links back to the source.

5. **Build confidence scoring**
   - Base it on: retrieval similarity scores from ChromaDB + number of corroborating sources (does more than one document support the answer?).
   - If confidence falls below a threshold you set through testing (start around a similarity score of 0.5 as a rough baseline, then adjust based on what you observe on your actual sample data — don't hardcode a threshold you haven't tested), return an explicit "I don't have enough source coverage to answer this confidently" response instead of guessing.

6. **Build the endpoint** (`api/routes/copilot.py`)
   - `POST /api/copilot/query` — implement as Server-Sent Events so the frontend can show streaming tokens. Verify current FastAPI SSE implementation syntax against FastAPI's docs — there are a few different patterns and you want the one that's current.
   - `GET /api/copilot/history` — store the last N exchanges per user session in Firestore, no separate store required.

7. **[Stretch] Contradiction detection** (`contradiction.py`) — attempt only after the checkpoint below passes with time to spare
   - When retrieval returns multiple chunks relevant to the same entity, add a check: do they agree? A simple approach is asking the LLM directly, as part of synthesis, "do these sources agree or conflict?" and surfacing a flag in the response rather than building a separate detection pipeline.

## Manual Verification Checklist

- [ ] Ask a question whose answer requires combining information from two different uploaded documents — confirm the answer is correct and both source documents appear in the citation list.
- [ ] Click a citation link and confirm it opens/highlights the correct source page, not just the filename.
- [ ] Ask a question with no supporting documents in the corpus — confirm the system returns the "not enough source coverage" fallback rather than a confidently wrong answer. This is a required test, not optional — RAG systems that never say "I don't know" are a known credibility problem with judges.
- [ ] Time 5 representative questions end-to-end and confirm typical latency is under 5 seconds; if consistently slower, this needs attention before Phase 9, not after.
- [ ] Watch the response arrive via SSE in a browser (Network tab) and confirm tokens stream incrementally rather than arriving all at once.
- [ ] If contradiction detection was attempted: manually feed two intentionally conflicting sample sentences through the pipeline and confirm the system flags the disagreement rather than silently picking one.

## Dependencies

- Phase 4: `semantic_search` and graph query functions working and tested.
- Phase 1: API skeleton with routing structure.

## Notes / Scope Cuts

- Multi-step agentic planning (the agent deciding to make several sequential tool calls and reasoning between them) is cut in favor of a single-pass plan. This is a reasonable, explainable simplification for a hackathon — mention it if asked, and note it as a "next step" in your pitch deck's scalability section.
