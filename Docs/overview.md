# PlantIQ — Industrial Knowledge Intelligence Platform

**Track:** AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain
**ET AI Hackathon 2026**

## The one-line pitch

PlantIQ turns a plant's fragmented documents — drawings, work orders, procedures, inspection
reports — into a knowledge graph that **finds its own gaps and writes its own reports**, with a
chat interface as a secondary way to query it, not the product itself.

## The problem, in one sentence

Indian industrial plants operate across 7–12 disconnected document systems, engineers spend
roughly a third of their working hours hunting for information that already exists somewhere,
and the people who hold the undocumented tribal knowledge are retiring — taking it with them.

## Why this isn't "another RAG chatbot"

Reviewers will see a lot of "upload your PDFs, ask questions" submissions on this track. A pure
Q&A chatbot is a thin layer over a vector store — it only produces value when someone thinks to
ask it something. PlantIQ is built the other way round: the system watches the knowledge graph
continuously and surfaces problems before anyone asks a question.

Three things carry the demo, in this order of importance:

1. **An autonomous compliance/gap agent** that scans the graph on its own schedule and
   populates a dashboard with findings — missing inspection records, orphaned equipment tags,
   regulatory clauses with no linked evidence — with zero user input required.
2. **A knowledge graph explorer** that makes the entity-relationship structure visible and
   inspectable, not just a hidden retrieval mechanism.
3. **An RCA report generator** that takes an incident description and produces a structured,
   cited root-cause document — a generated artifact, not a chat reply.

Chat-based Q&A over the same graph is included, but it is the fourth surface, built last, and
gets the least demo time. If a judge only remembers one thing, it should be the dashboard
lighting up with something the system found on its own.

## Target users

- **Plant engineers / maintenance leads** — need fast, cited answers plus early warning on
  compliance and documentation gaps.
- **Safety & compliance officers** — need continuous gap-scanning against OISD / Factory Act /
  PESO requirements without manually cross-referencing spreadsheets.
- **New/junior engineers** — need access to institutional knowledge that used to live only in a
  senior engineer's head.

## MVP scope (hackathon-realistic)

In scope:
- Document ingestion for text-based PDFs and synthetic structured records (work orders,
  procedures, inspection reports) — a synthetic dataset standing in for real plant documents.
- Entity + relationship extraction into a lightweight knowledge graph.
- Autonomous gap-detection agent with a findings dashboard.
- Graph explorer UI.
- RCA report generator.
- Copilot chat as a fourth, secondary surface.

Out of scope for MVP (roadmap items, mentioned in the pitch but not built):
- OCR / scanned document and P&ID drawing parsing.
- Multi-tenant auth and role-based access control.
- Production-grade scheduler (cron-based scans) — demo uses a manual "run scan" trigger,
  explicitly framed as designed for scheduled execution in production.
- Integration with live plant systems (SCADA, CMMS, DMS).

## Deliverables

Working prototype, architecture diagram, presentation deck, demo video — per hackathon
requirements. This document set (`prd.md`, `trd.md`, `skills.md`) is the internal build reference.
