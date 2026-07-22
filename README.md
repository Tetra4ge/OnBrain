<div align="center">

# OnBrain

**Industrial Knowledge Intelligence Engine - Turning fragmented engineering evidence into a connected operating memory using Graph RAG & Generative AI.**

[![React](https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TAILWIND_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/PYTHON-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FASTAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/DOCKER-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Gemini](https://img.shields.io/badge/GOOGLE_GEMINI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Neo4j](https://img.shields.io/badge/NEO4J-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![ChromaDB](https://img.shields.io/badge/CHROMADB-FF6F61?style=for-the-badge&logo=database&logoColor=white)](https://www.trychroma.com/)
[![MongoDB](https://img.shields.io/badge/MONGODB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## Problem Statement

In complex industrial facilities, engineers and maintenance technicians spend **up to 35% of their working hours** manually searching across fragmented siloes — P&IDs, equipment manuals, incident logs, work orders, and ISO regulatory standards.

**OnBrain** bridges this gap by unifying unstructured engineering documents into a **Graph RAG (Retrieval-Augmented Generation)** knowledge system. By fusing **Neo4j Knowledge Graphs** (for equipment relationship mapping) with **ChromaDB Vector Stores** (for semantic chunk search) and **Google Gemini** (for reasoning & RCA synthesis), OnBrain delivers instant, verifiable, source-cited answers to frontline technicians.

---

## The Problem & Solution

| ❌ The Industrial Problem | ✅ The OnBrain Solution |
| :--- | :--- |
| **Fragmented Siloes**: Critical history is trapped across 7–12 separate databases and PDF archives. | **Unified Operating Memory**: Ingests PDFs, CSVs, JSONs, and TXT files into a single graph + vector index. |
| **LLM Hallucinations**: Standard RAG often invents non-existent equipment specs or maintenance steps. | **Graph-Backed Grounding**: Every AI response requires explicit document citations and confidence scoring. |
| **Lost Expertise**: Decades of tribal knowledge vanish when senior engineers retire. | **Self-Learning Knowledge Graph**: Automatically links equipment tags (e.g., `P-204`) with historical failure events. |
| **Downtime Losses**: Slow root-cause analysis causes millions in unplanned operational outages. | **Instant Root Cause Analysis**: Automated RCA agent synthesizes failure history, OEM manuals, and inspection logs. |

---

## ✨ Key Features

### 1. Evidence-Backed Copilot
- **Conversational Intelligence**: Ask complex queries like *"What compliance gaps exist in my documents?"* or *"Show failure history for pump P-204"*.
- **Source Citations & Confidence**: Every response lists exact source documents, page numbers, and confidence metrics (`High`, `Medium`, `Pending`).
- **Clean Responsive UX**: Optimized for field mobile viewports as well as widescreen engineering control panels.

### 2. Automated Document Ingestion Pipeline
- **Multi-Taxonomy Intake**: Auto-detects and indexes manuals, work orders, inspection reports, P&ID drawings, and regulatory standards.
- **Entity Extraction**: Automatically extracts equipment tags, operational parameters, dates, and personnel.
- **Dual Vector & Graph Indexing**: Generates 384-dimensional embeddings stored in ChromaDB while simultaneously linking nodes and relationships in Neo4j.

### 3. Knowledge Explorer
- **High-Density Corpus Table**: Full visibility into indexed files, chunk counts, extracted entities, and synchronization status.
- **Taxonomy Filtering**: One-click filtering by document type (*Manual*, *Work Order*, *Inspection Report*, *Regulation*, *P&ID*).

### 4. Regulatory Evidence & Compliance Scan
- **Semantic Coverage Analysis**: Search risk scenarios or procedure requirements against indexed regulatory manuals.
- **Quick-Scan Prompts**: One-click assessment chips for pressure vessel inspection intervals, pump vibration limits, LOTO safety, and ISO 9001 compliance.

---

## 🏗 System Architecture

```
                                  +------------------------------------+
                                  |     Frontline Technician / UI      |
                                  |    (React 18 + Vite + Tailwind)    |
                                  +-----------------+------------------+
                                                    | REST / Streaming API
                                                    v
                                  +------------------------------------+
                                  |          FastAPI Backend           |
                                  |      (Python 3.11 + Pydantic)      |
                                  +--------+------------------+--------+
                                           |                  |
                    +----------------------+                  +----------------------+
                    |                                                                |
                    v                                                                v
   +---------------------------------+                              +---------------------------------+
   |      Knowledge Graph (Neo4j)    |                              |    Vector Store (ChromaDB)      |
   | - Equipment Nodes (e.g., P-204)  |                              | - 384d MiniLM Chunks            |
   | - Failure Event Relationships   |                              | - Semantic Document Passages    |
   | - Work Order Lineage            |                              | - Metadata Filtering            |
   +----------------+----------------+                              +----------------+----------------+
                    |                                                                |
                    +----------------------+                  +----------------------+
                                           |                  |
                                           v                  v
                                  +------------------------------------+
                                  |      Reasoning & Agent Engine      |
                                  |        (Google Gemini API)         |
                                  | - Source Citation Verification     |
                                  | - Root Cause Analysis (RCA)        |
                                  | - Confidence Scoring Engine        |
                                  +------------------------------------+
---
---

## ⚡️ Getting Started

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Python** 3.11+
- **Docker & Docker Compose** (for database services)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/Tetra4ge/OnBrain.git
cd OnBrain
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=strongpassword
CHROMA_HOST=localhost
CHROMA_PORT=8001
MONGO_URI=mongodb://root:rootpassword@localhost:27017
```

### 2. Start Databases via Docker
```bash
docker-compose up -d
```

### 3. Launch Backend API Server
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*API interactive docs available at: `http://localhost:8000/docs`*

### 4. Launch Frontend Web Dashboard
```bash
cd ../frontend
npm install
npm run dev
```
*Web dashboard available at: `http://localhost:5173`*

---

## 🏆 Hackathon Evaluation Highlights

1. **Zero-Hallucination Grounding**: Unlike pure LLM chatbots, OnBrain cross-checks every generated response against both vector similarity search (ChromaDB) and graph lineage (Neo4j), providing source citations for complete auditability.
2. **True Industrial Value**: Tackles a multi-billion dollar operational problem (unplanned industrial downtime and lost engineering context).
3. **Production-Ready UX**: Responsive mobile & desktop interface designed with dark industrial aesthetics, responsive mobile navigation, and non-scrollable focus viewports.
4. **Hybrid Graph RAG Architecture**: Combines semantic embeddings with graph entity relationships for deep multi-hop reasoning.

---

<div align="center">

**Built Team TetraFourge**

© 2026 OnBrain. All rights reserved.

</div>