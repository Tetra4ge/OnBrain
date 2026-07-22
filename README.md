<div align="center">

# OnBrain

**Industrial Knowledge Intelligence Engine - Turning fragmented engineering evidence into a connected operating memory using Graph RAG & Generative AI.**

[![React](https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TAILWIND_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/PYTHON-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FASTAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/GOOGLE_GEMINI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Neo4j Aura](https://img.shields.io/badge/NEO4J_AURA-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com/cloud/aura/)
[![ChromaDB](https://img.shields.io/badge/CHROMADB-FF6F61?style=for-the-badge&logo=database&logoColor=white)](https://www.trychroma.com/)

</div>

---

> **Built for the ET Gen AI 2.0 Hackathon**  
> *Problem Statement 8. AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain*

## Problem Statement

In complex industrial facilities, engineers and maintenance technicians spend **up to 35% of their working hours** manually searching across fragmented siloes — P&IDs, equipment manuals, incident logs, work orders, and ISO regulatory standards.

**OnBrain** bridges this gap by unifying unstructured engineering documents into a **Graph RAG (Retrieval-Augmented Generation)** knowledge system. By fusing **Neo4j Knowledge Graphs** (for equipment relationship mapping) with **ChromaDB Vector Stores** (for semantic chunk search) and **Google Gemini** (for reasoning & RCA synthesis), OnBrain delivers instant, verifiable, source-cited answers to frontline technicians.

---

## The Problem & Solution

| ❌ The Industrial Problem | ✅ The OnBrain Solution |
| :--- | :--- |
| **Fragmented Siloes**: Critical history is trapped across separate databases and PDF archives. | **Unified Operating Memory**: Ingests PDFs, CSVs, JSONs, and TXT files into a single graph + vector index. |
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
- **Triple Database Sync**: Stores metadata in Firestore, vector embeddings in ChromaDB, and entity lineages in Neo4j Aura.

### 3. Knowledge Explorer
- **High-Density Corpus Table**: Full visibility into indexed files, chunk counts, extracted entities, and synchronization status.
- **Taxonomy Filtering**: One-click filtering by document type (*Manual*, *Work Order*, *Inspection Report*, *Regulation*, *P&ID*).

### 4. Regulatory Evidence & Compliance Scan
- **Semantic Coverage Analysis**: Search risk scenarios or procedure requirements against indexed regulatory manuals.
- **Quick-Scan Prompts**: One-click assessment chips for pressure vessel inspection intervals, pump vibration limits, LOTO safety, and ISO 9001 compliance.

---

## Application Previews

<p align="center">
  <img src="images/1.png" width="100%" style="border-radius: 5px; margin-bottom: 20px;" />
  <img src="images/2.png" width="100%" style="border-radius: 5px; margin-bottom: 20px;" />
  <img src="images/3.png" width="100%" style="border-radius: 5px; margin-bottom: 20px;" />
  <img src="images/4.png" width="100%" style="border-radius: 5px; margin-bottom: 20px;" />
</p>

---

## 🏗 System Architecture (Production-Ready)

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#2d3748,stroke:#4fd1c5,stroke-width:2px,color:#fff
    classDef backend fill:#2c5282,stroke:#63b3ed,stroke-width:2px,color:#fff
    classDef cloud fill:#744210,stroke:#f6e05e,stroke-width:2px,color:#fff
    classDef ai fill:#553c9a,stroke:#b794f4,stroke-width:2px,color:#fff

    %% Nodes
    UI[<b>Frontline Technician / UI</b><br/>React 18 + Vite + Tailwind]:::frontend
    API[<b>FastAPI Backend</b><br/>Python 3.11 + Pydantic]:::backend
    
    subgraph Databases [Triple-Database Architecture]
        NEO[<b>Knowledge Graph</b><br/>Neo4j Aura Cloud<br/><i>Equipment Lineage & Events</i>]:::cloud
        FS[<b>Metadata Store</b><br/>Firestore Cloud<br/><i>Auth & Document State</i>]:::cloud
        VDB[<b>Vector Store</b><br/>ChromaDB Local<br/><i>Semantic Chunks & Retrieval</i>]:::cloud
    end

    LLM[<b>Reasoning & Agent Engine</b><br/>Google Gemini / Groq APIs<br/><i>RCA & Source Citation</i>]:::ai

    %% Relationships
    UI -- "REST / Streaming API" --> API
    API -- "Graph Traversal" --> NEO
    API -- "Doc State & Auth" --> FS
    API -- "Vector Search" --> VDB
    API -- "RAG Prompts" --> LLM
    
    LLM -. "Reasoning context" .-> Databases
```

---

## ⚡️ Getting Started (Local Development)

The architecture is fully migrated to managed cloud services for a lightweight local setup. Docker is **no longer required** for running the database services.

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Python** 3.11+
- **Firebase Project** (with Firestore and Authentication enabled)
- **Neo4j Aura** (Free Tier graph database instance)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/Tetra4ge/OnBrain.git
cd OnBrain
```

Create a `.env` file in the `backend/` directory with your cloud credentials:
```env
ENVIRONMENT=development
PORT=8000

# Cloud Graph DB
NEO4J_URI=neo4j+s://<your-aura-id>.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_secure_password

# Local Vector DB
CHROMA_DATABASE=Onbrain

# LLMs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# Cloud Metadata
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_MODE=development
VITE_API_DEV_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
```

### 2. Launch Backend API Server
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

### 3. Launch Frontend Web Dashboard
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