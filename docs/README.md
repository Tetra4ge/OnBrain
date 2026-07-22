# 🧠 OnBrain — Build Phases & Engineering Guide

This directory contains the detailed phase specifications for the OnBrain Industrial Knowledge Intelligence platform.

---

## Active Build Phases Index

| Phase | Focus | Status | File Reference |
|---|---|---|---|
| **Phase 1** | Foundation & Environment Setup | ✅ Completed | [phase-1-foundation.md](./phase-1-foundation.md) |
| **Phase 2** | Data Collection & Schema Lock | ✅ Completed | [phase-2-data-schema.md](./phase-2-data-schema.md) |
| **Phase 3** | Document Ingestion Pipeline | ✅ Completed | [phase-3-ingestion.md](./phase-3-ingestion.md) |
| **Phase 4** | Knowledge Layer (Neo4j, ChromaDB, Firestore) | 🔄 Active | [phase-4-knowledge.md](./phase-4-knowledge.md) |
| **Phase 5** | Copilot RAG Agent | 📋 Planned | [phase-5-copilot-agent.md](./phase-5-copilot-agent.md) |
| **Phase 6** | Root Cause Analysis (RCA) Agent | 📋 Planned | [phase-6-rca-agent.md](./phase-6-rca-agent.md) |
| **Phase 7** | Frontend Core (Auth, Upload, Chat UI) | 📋 Planned | [phase-7-frontend-core.md](./phase-7-frontend-core.md) |
| **Phase 8** | Frontend Advanced (Graph Explorer, RCA Workbench) | 📋 Planned | [phase-8-frontend-advanced.md](./phase-8-frontend-advanced.md) |
| **Testing** | End-to-End Testing & Verification | 🧪 Active | [testing.md](./testing.md) |

---

## Core Architecture Overview

- **Backend**: FastAPI (`backend/app/`)
- **Frontend**: React + Vite + Tailwind CSS (`frontend/`)
- **Data Stores**:
  - **Firestore**: Document metadata, upload status, chunk mappings
  - **Neo4j**: Industrial knowledge graph (Equipment, Failures, Work Orders, Procedures, Regulations)
  - **ChromaDB**: Semantic vector embeddings with metadata filtering
- **Testing**: Complete testing strategy and manual verification checklist documented in [testing.md](./testing.md).
