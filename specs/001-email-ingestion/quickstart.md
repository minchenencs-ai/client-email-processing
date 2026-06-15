# Quickstart — Email Ingestion Prototype

Prerequisites
- Node.js 18+ and npm

Install dev dependencies (root):

```bash
# from repo root
npm install
```

Start the mock API (serves `spec-inputs/api-trade-search-db.json`):

```bash
# from repo root
npm run start:mock
```

Run the frontend (Vite dev server):

```bash
# from repo root
npm run dev
```

Open `http://localhost:5173` and the app will load the prototype frontend and query the mock API at `http://localhost:3000/api/trades`.

Notes
- The mock API is intentionally simple for local development. Replace with real integrations when available.
- Run tests with Vitest:

```bash
npm test
```
