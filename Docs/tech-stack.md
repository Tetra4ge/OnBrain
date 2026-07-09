# 🛠️ Tech Stack — Full Inventory

> Every technology used in OnBrain, with version targets, rationale, and layer mapping.

**[← Docs Index](./README.md) | [Architecture](../architecture.md) | [Data Flow →](./data-flow.md)**

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│   React 19  ·  Tailwind CSS  ·  Firebase Auth            │
├─────────────────────────────────────────────────────────┤
│                     AGENT LAYER                          │
│   Gemini (reasoning)  ·  LangChain  ·  Tool-calling     │
├─────────────────────────────────────────────────────────┤
│                   KNOWLEDGE LAYER                        │
│   ChromaDB  ·  Neo4j  ·  MongoDB                        │
├─────────────────────────────────────────────────────────┤
│                   INGESTION LAYER                        │
│   Tesseract  ·  PaddleOCR  ·  YOLOv8  ·  Groq (Llama)  │
├─────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE                         │
│   FastAPI  ·  Docker Compose  ·  Render  ·  Vercel       │
└─────────────────────────────────────────────────────────┘
```

---

## Detailed Inventory

### Frontend

| Technology | Purpose | Layer | Docs Link |
|------------|---------|-------|-----------|
| React 19 | UI framework — web dashboard + mobile chat | [Application](./application.md) | [react.dev](https://react.dev) |
| Tailwind CSS | Utility-first CSS framework | [Application](./application.md) | [tailwindcss.com](https://tailwindcss.com) |

### Backend

| Technology | Purpose | Layer | Docs Link |
|------------|---------|-------|-----------|
| FastAPI | REST API framework connecting all layers | All | [fastapi.tiangolo.com](https://fastapi.tiangolo.com) |
| Python 3.11+ | Backend runtime | All | — |

### LLMs

| Technology | Purpose | Layer | Usage Pattern |
|------------|---------|-------|---------------|
| Gemini | User-facing reasoning — copilot answers, RCA chains | [Agents](./agents.md) | Low-volume, high-quality |
| Groq (Llama) | Bulk entity extraction from documents | [Ingestion](./ingestion.md) | High-volume, speed-optimized |

### Databases

| Technology | Purpose | Layer | Hosting |
|------------|---------|-------|---------|
| ChromaDB | Vector embeddings for semantic search (RAG) | [Knowledge](./knowledge-layer.md) | Self-hosted (Render) |
| Neo4j | Knowledge graph — entities + relationships | [Knowledge](./knowledge-layer.md) | Neo4j Aura (managed) |
| MongoDB | Document metadata, versions, audit trail | [Knowledge](./knowledge-layer.md) | MongoDB Atlas (managed) |

### AI / ML Models

| Technology | Purpose | Layer |
|------------|---------|-------|
| Gemini Embedding Model | Text → vector embeddings for ChromaDB | [Knowledge](./knowledge-layer.md) |
| YOLOv8 | P&ID symbol detection (object detection) | [Ingestion](./ingestion.md) |
| Tesseract OCR | Text extraction from scanned documents | [Ingestion](./ingestion.md) |
| PaddleOCR | Fallback OCR for complex layouts | [Ingestion](./ingestion.md) |

### Auth & Security

| Technology | Purpose | Layer |
|------------|---------|-------|
| Firebase Auth | Authentication — email/password, Google SSO | [Application](./application.md) |
| Firebase JWT | Token-based API protection | [Application](./application.md) |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker Compose | Local multi-service orchestration |
| Render | Backend + ChromaDB hosting |
| Vercel | Frontend hosting + CDN |

---

## LLM Split Rationale

OnBrain uses **two LLM providers** for different workloads:

| Workload | Provider | Why |
|----------|----------|-----|
| Copilot Q&A, RCA reasoning | **Gemini** | User-facing — answer quality, citation accuracy, and reasoning depth matter most |
| Entity extraction (bulk) | **Groq (Llama)** | Background jobs across hundreds of documents — speed and cost matter more than eloquence |

This split ensures:
- **Quality where it counts:** Judges and users see Gemini-quality answers.
- **Speed where it counts:** Ingestion doesn't bottleneck on slow API calls.
- **Cost efficiency:** Bulk extraction at Groq pricing, not premium reasoning-model pricing.

**Referenced by:** [Ingestion Layer](./ingestion.md) | [Agent Layer](./agents.md)

---

## Related Documentation

| Link | Relationship |
|------|-------------|
| [Architecture](../architecture.md) | High-level system blueprint |
| [Ingestion Layer](./ingestion.md) | Uses OCR, YOLOv8, Groq |
| [Knowledge Layer](./knowledge-layer.md) | Uses ChromaDB, Neo4j, MongoDB |
| [Agent Layer](./agents.md) | Uses Gemini, LangChain |
| [Application Layer](./application.md) | Uses React, Tailwind, Firebase |
| [Data Flow](./data-flow.md) | Shows how tech connects end-to-end |
