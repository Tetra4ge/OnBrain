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

For Firebase Authentication, set the `VITE_FIREBASE_*` values in `frontend/.env` (copy `frontend/.env.example`). Vite loads this directory's file, and `src/lib/firebase.js` exports `auth` and `googleProvider` for the sign-in flow.

### Vercel deployment

For [onbrain.vercel.app](https://onbrain.vercel.app/), add the same `VITE_FIREBASE_*` values in the Vercel project environment settings (Production and Preview as appropriate). In Firebase Console, add `onbrain.vercel.app` under Authentication → Settings → Authorized domains before enabling OAuth-based sign-in.

### Containerized Deployment

Run via Docker Compose from the root workspace directory:
```bash
docker-compose up frontend
```

## Features & Workflows

- **Health Status Monitor:** Real-time connectivity check with the FastAPI backend endpoint.
- **Document Ingestion Workflow:** UI interface for uploading industrial documents and executing multi-format ingestion pipelines.
- **Knowledge Explorer:** Dashboard view connecting document metadata, vector embeddings, and Neo4j graph relationships.
