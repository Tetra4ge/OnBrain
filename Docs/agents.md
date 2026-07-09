# 🤖 Layer 3 — Agent Layer

> Reasoning layer that queries the vector store and graph via tool-calling.

**[← Knowledge Layer](./knowledge-layer.md) | [Docs Index](./README.md) | Next: [Application Layer →](./application.md)**

---

## Overview

The Agent Layer is OnBrain's reasoning engine. It sits between the [Knowledge Layer](./knowledge-layer.md) and the [Application Layer](./application.md), using tool-calling to query both the vector store and knowledge graph, then synthesizing answers for end users.

Two specialized agents handle different use cases:

| Agent | Purpose | LLM | Why This LLM |
|-------|---------|-----|--------------|
| **Copilot Agent** | RAG-powered Q&A across the full corpus | Gemini | User-facing — answer quality matters |
| **RCA Agent** | Root-cause analysis and maintenance recommendations | Gemini | Reasoning chain quality is critical |

**Architecture Reference:** [architecture.md § Layer 3 — Agents](../architecture.md)  
**Build Phase:** [Phase 4 — Agent Layer](../phases/phase-4-agents.md)  
**LLM Split Rationale:** [Tech Stack — LLM Split](./tech-stack.md#llm-split-rationale)

---

## Copilot Agent

### Purpose
RAG-powered Q&A across the full document corpus, with citations and confidence scores. This is the primary interface for engineers and technicians to query OnBrain.

### How It Works

```
User Question
      │
      ▼
┌─────────────────┐     ┌─────────────┐
│  Query Planner   │────▶│  ChromaDB   │  (semantic search)
│  (Gemini)        │     │  retrieval  │
│                  │────▶│  Neo4j      │  (structured lookup)
└────────┬────────┘     └─────────────┘
         │
         ▼
┌─────────────────┐
│  Answer Synthesis │
│  (Gemini)         │
│  + Citations      │
│  + Confidence     │
└────────┬──────────┘
         │
         ▼
   Answer + Sources
```

### Tool-Calling Interface

The Copilot Agent has access to the following tools:

| Tool | Description | Backed By |
|------|-------------|-----------|
| `search_documents` | Semantic similarity search across all chunks | [ChromaDB](./knowledge-layer.md#vector-store) |
| `query_graph` | Cypher query execution on the knowledge graph | [Neo4j](./knowledge-layer.md#knowledge-graph) |
| `get_document_metadata` | Retrieve full metadata for a document | [MongoDB](./knowledge-layer.md#document-metadata-store) |
| `get_equipment_history` | Full history for an equipment tag (graph traversal) | [Neo4j](./knowledge-layer.md#knowledge-graph) |

### Response Format
```json
{
  "answer": "Pump P-101A has experienced 3 bearing failures in the past 18 months...",
  "confidence": 0.89,
  "sources": [
    {
      "doc_id": "uuid-1",
      "doc_type": "inspection_report",
      "title": "INSP-2024-0234",
      "relevance_score": 0.94
    },
    {
      "doc_id": "uuid-2",
      "doc_type": "work_order",
      "title": "WO-2024-0891",
      "relevance_score": 0.87
    }
  ],
  "graph_context": {
    "equipment": "P-101A",
    "related_failures": 3,
    "related_procedures": 2
  }
}
```

---

## RCA Agent

### Purpose
Fuses failure history, OEM manuals, inspection logs to generate root-cause hypotheses and maintenance recommendations. This is the key **differentiator** for OnBrain — the highest business-impact feature.

### How It Works

```
Failure Event / Query
        │
        ▼
┌───────────────────┐
│   Evidence Gather  │
│   (Graph + Vector) │
│                    │
│  • Failure history │────▶ Neo4j traversal
│  • OEM specs       │────▶ ChromaDB search
│  • Inspection logs  │────▶ ChromaDB search
│  • Past RCA reports │────▶ Neo4j + ChromaDB
└────────┬───────────┘
         │
         ▼
┌───────────────────┐
│   RCA Reasoning    │
│   (Gemini)         │
│                    │
│  Multi-step chain: │
│  1. Pattern detect │
│  2. Hypothesis gen │
│  3. Evidence rank  │
│  4. Recommendation │
└────────┬───────────┘
         │
         ▼
   RCA Report + Actions
```

### Reasoning Chain

The RCA Agent follows a structured multi-step reasoning process:

1. **Evidence Collection** — Gather all related failures, inspections, and procedures for the target equipment via graph traversal and semantic search.
2. **Pattern Detection** — Identify recurring failure modes, temporal patterns, and correlated conditions.
3. **Hypothesis Generation** — Propose root-cause hypotheses ranked by likelihood, citing specific evidence.
4. **Recommendation** — Suggest corrective and preventive actions tied to procedures and regulations.

### Output Format
```json
{
  "equipment_tag": "P-101A",
  "failure_event": "Bearing failure — 2024-12-01",
  "hypotheses": [
    {
      "rank": 1,
      "root_cause": "Misalignment due to foundation settling",
      "confidence": 0.82,
      "supporting_evidence": [
        "Vibration readings trending upward (INSP-2024-0190)",
        "Similar failure on P-101B in 2023 (WO-2023-0445)",
        "Foundation survey overdue (last: 2022-03)"
      ]
    },
    {
      "rank": 2,
      "root_cause": "Lubrication degradation — extended interval",
      "confidence": 0.65,
      "supporting_evidence": [
        "Lube oil analysis shows elevated metal particles (LAB-2024-0088)",
        "PM interval extended from 3 to 6 months in 2024-Q1"
      ]
    }
  ],
  "recommendations": [
    {
      "action": "Perform laser alignment check",
      "priority": "HIGH",
      "procedure_ref": "PROC-ALIGN-001",
      "regulation_ref": "API 686"
    },
    {
      "action": "Revert lubrication PM interval to 3 months",
      "priority": "MEDIUM",
      "procedure_ref": "PROC-LUBE-003"
    }
  ]
}
```

---

## Agent ↔ Backend Integration

Both agents are exposed via the [FastAPI backend](./api-reference.md):

| Endpoint | Agent | Method |
|----------|-------|--------|
| `POST /api/copilot/query` | Copilot | Streaming SSE response |
| `POST /api/rca/analyze` | RCA | JSON response |
| `GET /api/copilot/history` | Copilot | Conversation history |

**Integration detail:** [API Reference](./api-reference.md)

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Knowledge Layer](./knowledge-layer.md) | Data source for agent queries |
| [Application Layer](./application.md) | Frontend that consumes agent responses |
| [Tech Stack](./tech-stack.md) | LLM and framework choices |
| [Data Flow](./data-flow.md) | Agent's position in the full pipeline |
| [Phase 4 — Agents](../phases/phase-4-agents.md) | Build timeline for this layer |
| [API Reference](./api-reference.md) | Agent endpoint specifications |
