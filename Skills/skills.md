# Agent skills registry — PlantIQ

PlantIQ is built as a small set of agents, each with a defined set of skills (callable
capabilities), rather than one general-purpose chatbot with a system prompt. This registry
defines what each agent can do, what triggers it, and what it produces — useful both as a build
reference and as a judge-facing artifact showing this is a multi-agent system, not a single LLM
wrapper.

## Ingestion agent

**Trigger:** document uploaded via `/ingest`
**Runs autonomously:** yes, on every upload — no user action needed beyond upload

| Skill | Input | Output |
|---|---|---|
| `detect_format` | raw file | document type (work order / procedure / inspection / regulation / incident) |
| `extract_text` | raw file | plain text |
| `extract_entities` | plain text | structured JSON: entities + relationships + source spans |
| `update_graph` | extracted JSON | graph nodes/edges created or merged |
| `embed_chunks` | plain text | vector store entries |

## Compliance / gap agent

**Trigger:** manual "run scan" button for demo; designed for scheduled execution (cron/worker)
in production
**Runs autonomously:** yes — does not require a user question, only a trigger to start

| Skill | Input | Output |
|---|---|---|
| `scan_missing_inspections` | graph | list of equipment with no recent inspection edge |
| `scan_uncovered_regulations` | graph | list of regulation nodes with no linked compliance evidence |
| `scan_orphaned_references` | graph | list of procedure/work-order entities referencing equipment absent from the graph |
| `write_findings` | scan results | findings written to the dashboard data store with rule + source-doc references |

This is the agent that carries the "not just a chatbot" argument — its output exists on a
dashboard before anyone asks it anything.

## RCA agent

**Trigger:** user submits an incident description
**Runs autonomously:** no — user-initiated, but produces a standalone document, not a chat
reply

| Skill | Input | Output |
|---|---|---|
| `retrieve_related_context` | incident text | relevant equipment history, past incidents, procedures (hybrid vector + graph retrieval) |
| `identify_contributing_factors` | retrieved context | ranked list of likely contributing factors with citations |
| `generate_rca_report` | contributing factors + context | structured document: summary, factors, historical patterns, recommended actions, citations |

## Copilot agent

**Trigger:** user asks a free-text question
**Runs autonomously:** no — the one on-demand, user-initiated surface in the system

| Skill | Input | Output |
|---|---|---|
| `hybrid_retrieve` | question | vector matches + graph traversal results |
| `answer_with_citations` | question + retrieved context | answer with inline source citations and a confidence indicator |
| `explain_graph_path` | answer | (optional, on click) the graph path/edges used to support a multi-hop answer |

## Design principle behind this split

The compliance/gap agent and the ingestion agent run without being asked — that's what
separates this from a chatbot. The RCA and copilot agents are user-triggered, but even then the
RCA agent's output is framed as a generated document, not a conversational reply, to keep the
system's center of gravity away from "chat" as the primary interaction model.

## Build/demo priority order

1. Ingestion agent — foundation, everything depends on it
2. Compliance/gap agent — the differentiator, gets the most demo time
3. RCA agent — second most demo time, shows generative depth beyond retrieval
4. Copilot agent — built last, cut first if time runs short
