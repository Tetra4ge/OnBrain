# 🤖 Phase 4 — Agent Layer (Days 9–11)

> Copilot RAG agent, RCA agent, tool-calling between agents and stores.

**[← Phase 3 — Knowledge](./phase-3-knowledge.md) | [Phases Index](./README.md) | Next: [Phase 5 — Application →](./phase-5-application.md)**

---

## Objective

Build the two reasoning agents (Copilot and RCA) that query the [Knowledge Layer](../docs/knowledge-layer.md) via tool-calling and deliver answers to end users. This is where OnBrain becomes intelligent.

**Primary Documentation:** [Agent Layer](../docs/agents.md)

---

## Deliverables

### Day 9 — Copilot RAG Agent

- [ ] Set up Gemini API client for reasoning/synthesis
- [ ] Implement tool definitions for agent tool-calling:
  - `search_documents` → ChromaDB semantic search
  - `query_graph` → Neo4j Cypher execution
  - `get_document_metadata` → MongoDB lookup
  - `get_equipment_history` → Neo4j traversal
- [ ] Build query planning logic — agent decides which tools to call
- [ ] Implement answer synthesis with source citations
- [ ] Add confidence scoring to responses
- [ ] Create `POST /api/copilot/query` endpoint with SSE streaming
- [ ] Test with domain-specific questions against sample data

### Day 10 — RCA Agent

- [ ] Implement evidence gathering pipeline:
  - Failure history from Neo4j graph traversal
  - OEM specs from ChromaDB semantic search
  - Inspection logs from ChromaDB
  - Past RCA reports from Neo4j + ChromaDB
- [ ] Build multi-step reasoning chain:
  1. Pattern detection
  2. Hypothesis generation
  3. Evidence ranking
  4. Recommendation generation
- [ ] Link recommendations to procedures and regulations (graph references)
- [ ] Create `POST /api/rca/analyze` endpoint
- [ ] Test RCA output on sample equipment failure scenarios

### Day 11 — Integration & Refinement

- [ ] Implement conversation history for Copilot (`GET /api/copilot/history`)
- [ ] Add context filtering (by equipment, doc type, date range) to Copilot queries
- [ ] Build RCA report storage and retrieval (`GET /api/rca/reports`)
- [ ] Tune prompt templates for both agents:
  - Copilot: answer formatting, citation style, confidence calibration
  - RCA: hypothesis structure, evidence linking, recommendation actionability
- [ ] End-to-end test: user question → agent reasoning → knowledge queries → answer
- [ ] Performance profiling: measure query latency (target: < 5 seconds for copilot)

---

## Success Criteria

| Criteria | Target | Verification |
|----------|--------|-------------|
| Copilot answers questions | Relevant answers with citations | Test 10 domain questions |
| Copilot cites sources | Every answer includes ≥1 source document | Response format validation |
| Copilot confidence scores | Scores correlate with answer quality | Manual evaluation |
| RCA generates hypotheses | ≥2 ranked hypotheses per analysis | Test 3 failure scenarios |
| RCA links to procedures | Recommendations reference existing procedures | Cross-reference check |
| Streaming works | SSE tokens arrive incrementally | Browser DevTools SSE test |
| Query latency | < 5 seconds for typical copilot query | Timing measurement |
| Tool-calling works | Agents correctly select and use tools | Debug logging verification |

---

## Architecture Mapping

```
               Phase 3 stores (ready to query)
                    │          │
          ┌─────────┘          └─────────┐
          ▼                              ▼
     [ChromaDB]                      [Neo4j]
          │                              │
          └──────────┬───────────────────┘
                     │
    ┌────────────────┼────────────────────────────┐
    │         LAYER 3 — AGENTS                    │
    │                                             │
    │  Day 9:  [Copilot Agent] ─── RAG Q&A       │
    │  Day 10: [RCA Agent] ─── Root-cause analysis│
    │  Day 11: [Integration] ─── Refinement       │
    │                │                            │
    └────────────────┼────────────────────────────┘
                     │
                     ▼
              Phase 5 builds the UI on top
```

---

## Key Decisions

| Decision | Choice | Rationale | Reference |
|----------|--------|-----------|-----------|
| Reasoning LLM | Gemini | User-facing quality — judges will evaluate | [Tech Stack — LLM Split](../docs/tech-stack.md#llm-split-rationale) |
| Agent framework | LangChain + tool-calling | Mature, well-documented | [Agents](../docs/agents.md) |
| Streaming | SSE (Server-Sent Events) | Simple, browser-native support | [API Reference](../docs/api-reference.md) |
| RCA approach | Multi-step chain | Structured reasoning = higher quality | [Agents — RCA](../docs/agents.md#rca-agent) |

---

## Dependencies

| Depends On | From Phase | What's Needed |
|------------|-----------|---------------|
| ChromaDB populated with embeddings | [Phase 3](./phase-3-knowledge.md) | Semantic search returns results |
| Neo4j graph populated with entities | [Phase 3](./phase-3-knowledge.md) | Graph traversal returns results |
| MongoDB metadata stored | [Phase 3](./phase-3-knowledge.md) | Document metadata lookups work |
| FastAPI routing structure | [Phase 1](./phase-1-foundation.md) | Agent endpoints mountable |

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Agent Layer](../docs/agents.md) | Full technical specification |
| [Knowledge Layer](../docs/knowledge-layer.md) | Data source for agent queries |
| [Application Layer](../docs/application.md) | UI that consumes agent responses |
| [Data Flow](../docs/data-flow.md) | Query and RCA flow diagrams |
| [API Reference](../docs/api-reference.md) | Copilot + RCA endpoint specs |
| [Phase 5 — Application](./phase-5-application.md) | Next phase — builds UI on top |
