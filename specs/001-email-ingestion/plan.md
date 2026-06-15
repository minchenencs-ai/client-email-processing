# Implementation Plan: Email ingestion and trade reconciliation

**Branch**: `001-email-ingestion` | **Date**: 2026-06-15 | **Spec**: specs/001-email-ingestion/spec.md

**Input**: Feature specification from `/specs/001-email-ingestion/spec.md`

**Note**: This plan targets a minimal-dependency Vite web app using vanilla
HTML/CSS/JavaScript and a tiny Node-based mock API that serves
`spec-inputs/api-trade-search-db.json` during development.

## Summary

Build an end-to-end prototype that ingests sample client emails, extracts
trade-related attributes, queries a local mock trade DB, performs
attribute-level reconciliation, and surfaces results in a simple UI where
operators can review and edit AI-generated responses. The MVP will avoid
frameworks in the frontend and keep runtime dependencies minimal.

## Technical Context

**Language/Version**: Frontend — JavaScript (ES2022) running in modern
browsers; Dev environment — Node.js 18+ (Vite)

**Primary Dependencies**: `vite` (dev/build), `vitest` (dev tests). No
frontend framework; use plain DOM APIs. Optional: `mailparser` (server-side)
only if robust .eml parsing is required.

**Storage**: Development data uses `spec-inputs/api-trade-search-db.json`.
Production persistence is out of scope for MVP.

**Testing**: Unit tests with `vitest`; simple DOM tests with
`@testing-library/dom` (optional). E2E tests via Playwright (optional).

**Target Platform**: Modern desktop browsers; local dev server via Vite.

**Project Type**: Web application (static frontend + small mock API).

**Performance Goals**: Prototype-level responsiveness; p95 page loads < 200ms
for local datasets.

**Constraints**: Minimize third-party libraries; implement mock API using
Node's builtin `http` to avoid extra server frameworks.

## Constitution Check

Gates determined from project constitution (must pass before Phase 0):

- Test-First: All feature-level units (parser, reconciliation) MUST have
  unit tests before implementation merges.
- Observability: Mock API and critical client flows MUST emit structured
  logs (JSON) to aid debugging.
- CI: PRs MUST run tests and linting; include a minimal GitHub Actions
  workflow.

Checkpoint: Phase 0 research must validate sample email parsing and mock
API connectivity; otherwise address gaps before progressing.

## Project Structure

```
specs/001-email-ingestion/
├── spec.md
├── plan.md          # this file
├── checklists/
│   └── requirements.md
├── data-model.md    # Phase 1 output
├── quickstart.md    # Phase 1 output
└── tasks.md         # Phase 2 output (created by /speckit.tasks)

frontend/
├── index.html
├── src/
│   ├── main.js
+│   ├── components/
│   └── styles/
└── public/

mock-api/
└── server.js        # small Node http server reading spec-inputs/api-trade-search-db.json

spec-inputs/
└── api-trade-search-db.json

tests/
└── unit/
```

**Structure Decision**: Keep frontend and mock-api as separate lightweight
folders to allow independent development and simple deployment during
validation.

## Phase 0: Outline & Research

1. Validate sample emails in `spec-inputs/client-emails/` to enumerate the
   extraction targets and common formats (CUSIP/ISIN/SEDOL patterns, date
   formats, quantity/price formats).
2. Decide parser approach: start with a lightweight regex-based extractor
   for MVP; if coverage is insufficient, add `mailparser` server-side.
3. Define a minimal trade-search contract (GET `/api/trades?securityId=...&tradeDate=...`).
4. Produce `research.md` summarizing extractor decisions and sample-to-field mapping.

## Phase 1: Design & Contracts

Deliverables: `data-model.md`, `/contracts/trade-search.json`, `quickstart.md`.

Tasks:
- D001: Create `data-model.md` capturing `EmailRecord`, `ExtractedTrade`,
  `ReconciliationResult` (fields and validation rules).
- D002: Define `contracts/trade-search.json` (request/response examples).
- D003: Draft `quickstart.md` with run steps and dev notes.

## Phase 2: Implementation (Priority order)

### Phase 2.1 — Setup (Blocking prerequisites)

- T001: Initialize project with Vite (vanilla template):

  ```bash
  npm init vite@latest frontend -- --template vanilla
  cd frontend
  npm install
  ```

- T002: Add dev dependencies: `vitest`, `eslint` (minimal lint rules).
- T003: Create `mock-api/server.js` — Node http server serving
  `spec-inputs/api-trade-search-db.json` and implementing `/api/trades`.
- T004: Add npm scripts in repo root (`dev`, `mock-api`, `test`).

### Phase 2.2 — Foundational (Core capabilities)

- T005 [P]: Implement email loader UI to list sample emails and render raw
  body (use `spec-inputs/client-emails/` for sample data).
- T006: Build a lightweight extractor module (`mock-api/parser.js` or
  `frontend/src/parser.js`) that returns extracted fields for a given email.
- T007: Implement trade-search client that queries `mock-api`.
- T008: Implement reconciliation engine that compares extracted attributes
  to retrieved trade records and returns attribute-level statuses.
- T009: Add unit tests for parser and reconciliation (vitest).

### Phase 2.3 — User Stories (UI + review flows)

- T010 [US1]: Display email details, classification, extracted entities,
  and retrieved trades in the UI (steps 1–4).
- T011 [US1]: Show reconciliation comparison tables with per-attribute
  highlights (matched/mismatch/missing).
- T012 [US2]: Implement AI response mock generator (template-based) and
  provide edit/approve/escalate controls in UI.
- T013: Add structured logging (console JSON logs) for each completed
  reconciliation and for review actions.

### Phase 2.4 — Polish & Cross-Cutting

- T014: Add unit tests to achieve coverage on critical modules (parser,
  reconciliation).
- T015: Add a simple GitHub Actions workflow to run `npm test` on PRs.
- T016: Document run steps in `quickstart.md`.

## Quickstart (dev)

Requirements: Node 18+, npm

```bash
# from repo root
cd frontend
npm install
npm run dev        # starts Vite on :5173

# in a separate terminal
node mock-api/server.js   # starts mock API on :3000

# open http://localhost:5173
```

## Artifacts to produce

- `specs/001-email-ingestion/research.md`
- `specs/001-email-ingestion/data-model.md`
- `/contracts/trade-search.json`
- `specs/001-email-ingestion/quickstart.md`
- `frontend/` skeleton and `mock-api/server.js`

## Next steps

1. Complete Phase 0 research (validate sample emails and confirm parser
   approach).
2. If everything validates, implement Setup tasks (T001–T004) and run
   initial unit tests.
3. Return for Phase 1 design review.

