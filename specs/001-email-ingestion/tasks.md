---
description: "Task list for Email ingestion and reconciliation"
---

# Tasks: Email ingestion and trade reconciliation

**Input**: Implementation plan `specs/001-email-ingestion/plan.md`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize Vite frontend scaffold in `frontend/`
- [ ] T002 Add root and frontend `package.json` scripts and install `vite` (files: `package.json`, `frontend/package.json`)
- [ ] T003 [P] Add dev tooling: `vitest`, `eslint`, and minimal configs (`frontend/vitest.config.js`, `.eslintrc.json`)
- [ ] T004 Create mock API server to serve `spec-inputs/api-trade-search-db.json` (`mock-api/server.js`)
- [ ] T005 [P] Add npm scripts: `dev`, `mock-api`, `test` in root `package.json`

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T006 [P] Implement email loader UI to list sample emails (frontend/src/components/emailList.js)
- [ ] T007 Implement parser module on the mock API (`mock-api/parser.js`) to extract entities from `.eml` samples
- [ ] T008 [P] Implement trade-search client (`frontend/src/services/tradeSearchClient.js`) that queries `mock-api` `/api/trades`
- [ ] T009 Implement reconciliation engine (`frontend/src/services/reconciliation.js`) that compares extracted attributes to retrieved trades
- [ ] T010 [P] Add unit tests for parser and reconciliation (`tests/unit/test_parser.spec.js`, `tests/unit/test_reconciliation.spec.js`)

- [ ] T021 Implement intent-classifier service (mock/LLM wrapper) (`mock-api/intentClassifier.js`)
- [ ] T022 Add unit tests for intent classifier (`tests/unit/test_classifier.spec.js`)
- [ ] T023 Implement quarantine pipeline and failure record storage (`mock-api/quarantine.js`) and quarantine review UI (`frontend/src/components/quarantinePanel.js`)
- [ ] T024 Document access control decision and add audit-log hooks (`specs/001-email-ingestion/access-control.md`, `frontend/src/actions/auditLog.js`)

## Phase 3: User Story 1 - Ingest and parse client emails (Priority: P1)

- [ ] T011 [P] [US1] Create `EmailRecord` model in `frontend/src/models/emailRecord.js`
- [ ] T012 [US1] Integrate parser with mock API endpoint in `mock-api/server.js` (accept sample email input → return extracted entities)
- [ ] T013 [US1] Implement Email Details UI showing extracted entities and raw body (`frontend/src/components/emailDetails.js`)
- [ ] T014 [US1] Add integration test for ingestion and parsing (`tests/integration/test_ingestion.spec.js`)

## Phase 4: User Story 2 - Human review and response editing (Priority: P2)

- [ ] T015 [US2] Implement response generator (mocked) `frontend/src/services/responseGenerator.js`
- [ ] T016 [US2] Implement review panel UI with edit/approve/escalate controls (`frontend/src/components/reviewPanel.js`)
- [ ] T017 [US2] Implement review actions and structured logging (`frontend/src/actions/reviewActions.js`)
- [ ] T018 [US2] Add integration test for review workflow (`tests/integration/test_review.spec.js`)

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Add CI workflow `.github/workflows/ci.yml` to run tests and lint on PRs
- [ ] T020 Update `specs/001-email-ingestion/quickstart.md` and root `README.md` with run instructions and developer notes

## Dependencies & Execution Order

- Setup (Phase 1) must complete before Foundational (Phase 2).
- Foundational must complete before User Story implementation (Phase 3+).
- Unit tests for parser and reconciliation (T010) SHOULD be written and pass before integration tests (T014, T018).

## Parallel Opportunities

- Tasks marked `[P]` can be worked on in parallel by different engineers: T003, T005, T006, T008, T010, T011, T019.

***

Total tasks: 20
