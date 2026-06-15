---
description: "Tasks for Email ingestion and trade reconciliation feature"
---

# Tasks: Email ingestion and trade reconciliation

**Input**: Design documents from `/specs/001-email-ingestion/`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize `frontend/` with Vite vanilla template and create `frontend/index.html` and `frontend/src/main.js`
- [ ] T002 Add dev dependencies and scripts in `package.json` (`dev`, `start:mock`, `test`) and configure `vitest` and minimal `eslint` rules
- [ ] T003 Create `mock-api/server.js` to serve `spec-inputs/api-trade-search-db.json` and implement `/api/trades`, `/api/classify`, `/api/ingest`
- [ ] T004 Add prompt-driven model client and templates: `mock-api/modelClient.js`, `mock-api/prompt_templates/classification.txt`, `mock-api/prompt_templates/extraction.txt`
- [ ] T005 Add project README and quickstart: `README.md`, `specs/001-email-ingestion/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T006 Implement ingestion pipeline `mock-api/ingest.js` (parse `.eml`, call `modelClient.classify()` and `modelClient.extract()`, quarantine policy)
- [ ] T007 Implement trade-search client (mock) `mock-api/tradeSearchClient.js` and contract `specs/001-email-ingestion/contracts/trade-search.json`
- [ ] T008 Implement reconciliation engine `mock-api/reconciliation.js` (attribute-level comparisons and overall status)
- [ ] T009 Add unit tests for parser and reconciliation `tests/test_ingest.spec.js`, `tests/test_reconciliation.spec.js`
- [ ] T010 Add structured logging for critical flows (`mock-api/*.js` emit JSON logs)

---

## Phase 3: User Story 1 - Ingest and parse client emails (Priority: P1) 🎯 MVP

**Goal**: Ingest `.eml` samples, classify intent, extract trade entities, retrieve candidate trades, and display reconciliation results.

**Independent Test**: Use sample emails in `spec-inputs/client-emails/` and verify `mock-api/ingest.js` returns `ReconciliationResult` JSON for each sample.

- [ ] T011 [US1] Implement email loader UI to list sample emails and render raw email content (`frontend/index.html`, `frontend/src/main.js`, `frontend/src/components/emailList.js`)
- [ ] T012 [P] [US1] Display classification result and confidence (`frontend/src/components/classificationPanel.js`) calling `/api/classify`
- [ ] T013 [US1] Display extracted trade entities (`frontend/src/components/extractionPanel.js`) using `/api/ingest` output
- [ ] T014 [US1] Display retrieved trades from mock API and source system metadata (`frontend/src/components/tradePanel.js`)
- [ ] T015 [US1] Implement reconciliation UI: per-attribute comparison table with highlights for matched/mismatch/missing (`frontend/src/components/reconciliationPanel.js`)
- [ ] T016 [US1] Add integration test for the end-to-end US1 flow `tests/integration/test_us1.spec.js`

---

## Phase 4: User Story 2 - Human review and response editing (Priority: P2)

**Goal**: Allow operators to review AI outputs, edit generated responses, approve or escalate.

**Independent Test**: Simulate review actions and verify state changes and logs.

- [ ] T017 [US2] Implement AI-generated response draft UI (editable) (`frontend/src/components/responseEditor.js`) and call `/api/generate-response` (mock)
- [ ] T018 [US2] Implement approve / escalate actions and endpoints (`frontend/src/components/reviewControls.js`, update `mock-api/server.js` for review actions)
- [ ] T019 [US2] Add tests for response edit/approve/escalate flows `tests/test_response.spec.js`

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T020 [P] Add model evaluation scripts and fixtures `specs/001-email-ingestion/eval/run_eval.js`, `specs/001-email-ingestion/eval/fixtures/`
- [ ] T021 Add CI workflow to run unit tests and evaluation scripts `.github/workflows/ci.yml`
- [ ] T022 [P] Add performance and load smoke tests `specs/001-email-ingestion/bench/run_benchmark.js`
- [ ] T023 [P] Document prompts, prompt examples, and reproducibility steps `specs/001-email-ingestion/prompt_examples.md`
- [ ] T024 Polish docs and finalize quickstart `specs/001-email-ingestion/quickstart.md`, `README.md`

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Blocks user stories — must complete before US1/US2 implementation
- **User Stories (Phase 3+)**: Depend on Foundational phase completion

## User Story Dependencies

- **User Story 1 (P1)**: Requires Phase 2 complete
- **User Story 2 (P2)**: Requires Phase 2 complete and US1 components (display APIs) available

## Parallel Opportunities

- Tasks marked `[P]` can run in parallel by different engineers (model evaluation, prompt examples, classification display implementation, etc.)
- After Foundation completes, UI components for different stories (extractionPanel, tradePanel, responseEditor) can be developed in parallel.

## Implementation Strategy

1. MVP First: Complete Phase 1 and Phase 2 (T001–T010). Deliver US1 (T011–T016) as the MVP slice.
2. Validate US1 with integration tests and sample emails. Iterate on prompts and extraction until extraction field F1 >= 0.80 for critical fields.
3. Implement US2 and polish cross-cutting concerns (testing, CI, documentation).

## Parallel Example: Implementing US1

- Developer A: `frontend/src/components/emailList.js`, `frontend/src/components/classificationPanel.js`
- Developer B: `mock-api/ingest.js`, `mock-api/modelClient.js`, `mock-api/prompt_templates/`
- Developer C: `frontend/src/components/reconciliationPanel.js`, integration tests

## Format Validation

- All tasks follow the required checklist format: checkbox, sequential TaskID, optional `[P]`, Story labels for user story tasks, and explicit file paths.
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
