# Client Email Processing (prototype)

This workspace contains a prototype mock API and frontend for the Client Email
Processing and Trade Reconciliation application.

Key points:
- Classification and extraction are implemented via a pluggable `modelClient` to
  enforce a prompt-based, model-driven approach (see `mock-api/modelClient.js`).
- By default the model client runs a deterministic simulator for local development
  and tests. You can hook a real provider by setting `OPENAI_API_KEY` or
  `MODEL_PROVIDER` and extending `modelClient.js`.

Run the mock API and frontend (requires Node 18+):

```bash
npm install
npm run start:mock
# open http://localhost:3000
```

Run tests:

```bash
npm test
```

Files of interest:
- `mock-api/modelClient.js` — prompt-based classify/extract interface
- `mock-api/intentClassifier.js` — delegates to `modelClient`
- `mock-api/ingest.js` — uses `modelClient.extract` and performs reconciliation
- `specs/001-email-ingestion/spec.md` — updated spec including modeling & prompts
