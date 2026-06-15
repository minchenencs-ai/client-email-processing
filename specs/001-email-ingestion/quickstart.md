# Quickstart — Email Ingestion Prototype

Prerequisites
- Node.js 18+ and npm

Start the mock API (serves `spec-inputs/api-trade-search-db.json`)

```bash
# from repo root
node mock-api/server.js
```

Run the frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and the app will load sample emails from `spec-inputs/client-emails/` and query the mock API at `http://localhost:3000/api/trades`.

Notes
- The mock API is intentionally simple for local development. Replace with real integrations when available.
- Tests: run `npm test` from `frontend/` once `vitest` is configured.
