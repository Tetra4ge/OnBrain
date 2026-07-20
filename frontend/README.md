# OnBrain Dashboard Frontend

The web dashboard interface for **OnBrain**, an industrial knowledge intelligence platform built with React 19, Vite, and Tailwind CSS.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   The dashboard will run at `http://localhost:5173`.

### Environment Variables

Configure backend API target in `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Containerized Deployment

Run via Docker Compose from the root workspace directory:
```bash
docker-compose up frontend
```

## Features & Workflows

- **Health Status Monitor:** Real-time connectivity check with the FastAPI backend endpoint.
- **Document Ingestion Workflow:** UI interface for uploading industrial documents and executing multi-format ingestion pipelines.
- **Knowledge Explorer:** Dashboard view connecting document metadata, vector embeddings, and Neo4j graph relationships.
