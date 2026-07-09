# OnBrain
**An always-on Industrial AI Brain fusing P&IDs and maintenance logs into a unified, predictive knowledge graph to drive zero downtime.**

## The Problem: Industrial Knowledge Fragmentation
In asset-intensive industries, professionals spend up to 35% of their working hours simply searching for information. Vital data is scattered across 7 to 12 disconnected systems:
- P&IDs and engineering drawings in one place
- Maintenance work orders in another
- Operating procedures in a third
- Inspection records and regulatory submissions buried in email archives

This fragmentation causes **18-22% of unplanned downtime events**, as maintenance teams are forced to make critical decisions without complete equipment history or context. Furthermore, as experienced engineers retire, decades of undocumented knowledge are lost forever.

## What is OnBrain?
**OnBrain** is a unified Asset & Operations Brain designed to defeat knowledge fragmentation. It acts as an overarching intelligence layer that ingests heterogeneous documents (like PDFs, P&IDs, forms, and manuals) and connects them into a queryable, living knowledge base.

It turns scattered operational data into actionable insights, ensuring that the right information reaches the right technician at the exact point of need, keeping operations **Always On**.

## How We Are Solving It
Our solution brings together modern NLP, Knowledge Graphs, and Agentic AI into a seamless platform:

1. **Document Ingestion Pipeline:** 
   We process unstructured and structured data (PDFs, P&IDs, logs) using OCR and document intelligence to extract entities (equipment tags, parameters, dates, personnel).
2. **Unified Knowledge Graph (Neo4j):** 
   Extracted entities are mapped into a unified knowledge graph. We establish relationships across document types (e.g., linking a specific pump in a P&ID to its failure history and its maintenance manual).
3. **Expert RAG Copilot (FastAPI + LangChain):** 
   A conversational AI assistant that technicians can talk to. By using Retrieval-Augmented Generation (RAG) over our Knowledge Graph and vector database (ChromaDB), it answers operational queries instantly with **source citations and confidence scores**.
4. **Maintenance Intelligence:** 
   By connecting the dots between failure records and operating conditions, the system supports Root Cause Analysis (RCA) and predictive maintenance recommendations.

## Tech Stack
- **Frontend:** React
- **Backend:** FastAPI
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **VectorDB:** Pinecone
- **GraphRAG:** Neo4j
- **AI / Embeddings:** Gemini (Embedding Model), OpenRouter (LLM APIs)
