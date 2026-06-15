# Feature Specification: Email ingestion and structured parsing

**Feature Branch**: `001-email-ingestion`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Develop AI-Powered Client Email Processing and Trade Reconciliation Application"


Source: spec-inputs/specify-requirement.txt

## Clarifications

### Session 2026-06-15

- Q: Access control model for human-in-the-loop review → A: Option B — Shared ops account: single shared account for operations (no per-user auditing).
 - Q: Automation thresholds for auto-suggestion vs review vs manual for classification and extraction → A: Option C — Aggressive automation: classification auto-suggest at >= 0.75; review band 0.60–0.75; manual below 0.60. Extraction field-level auto-suggest at F1 >= 0.80.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ingest and parse client emails (Priority: P1)

- As an Operations user, I want incoming client emails to be ingested and parsed so the system can extract relevant metadata and trade-related entities for downstream processing.

**Why this priority**: Core capability enabling all downstream steps (classification, trade retrieval, reconciliation, response generation).

**Independent Test**: Provide sample `.eml` files (see `spec-inputs/client-emails/`) and verify the parser outputs structured JSON with required fields.

**Acceptance Scenarios**:

1. **Given** a valid client email, **When** the ingestion runs, **Then** produce a JSON record containing `subject`, `sender`, `sent_timestamp`, `email_body`, and extracted entities (security ids, dates, quantity, price, account, counterparty).
2. **Given** an email with unparseable content, **When** ingestion runs, **Then** quarantine the email and emit a structured failure record.

---

### User Story 2 - Provide human review and response editing (Priority: P2)

- As an Operations user, I want to review AI-extracted results and edit generated responses before sending to clients.

**Independent Test**: Verify UI allows editing generated response, approving or escalating.

**FR-008**: Access control MAY use a shared operations account without per-user auditing, unless the project later requires role-based auditing.

## Edge Cases

- Emails with multiple trade records (process each trade separately).
- Partial matches from trade retrieval systems (flag as partial mismatch).
- Missing identifiers (attempt best-effort fuzzy match, otherwise mark missing).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST ingest raw client emails (.eml) and persist raw metadata (subject, sender, sent timestamp) and body.
- **FR-002**: System MUST extract trade-related entities: security identifiers (CUSIP/ISIN/SEDOL), trade date, settlement date, quantity, price, counterparty, account, currency.
- **FR-003**: System MUST classify email intent into one of: Booking, Settlement, General.
- **FR-004**: System MUST query external trading systems (Quest, Vista FID, Vista Equity) to retrieve matching trades using extracted identifiers and dates.
- **FR-005**: System MUST compute attribute-level reconciliation results (match / partial / missing) for each trade attribute listed in the spec.
- **FR-006**: System MUST generate a draft response email summarizing findings, discrepancies, and recommended actions; users MUST be able to edit before sending.
- **FR-007**: Unparseable emails or failures in extraction MUST be quarantined; failures MUST be logged as structured events.

- **FR-009**: All client-intent classification and trade-extraction implementations MUST be prompt-based and model-driven; rule- or heuristic-based approaches are not permitted. The spec MUST document the chosen model(s), prompt templates, and evaluation criteria.

### Key Entities

- **EmailRecord**: `id`, `subject`, `sender`, `sent_timestamp`, `body`, `raw_payload`
- **ExtractedTrade**: `security_id`, `trade_date`, `settlement_date`, `quantity`, `price`, `account`, `counterparty`, `currency`
- **ReconciliationResult**: `email_trade_id`, `retrieved_trade_id`, `attribute_results` (map attribute→status), `overall_status`

## Operational Rules

- **Matching rules**: Prefer exact `security_id` matches. If no exact match, attempt normalized/fuzzy matching (normalize to digits/uppercase; allow Levenshtein distance ≤ 2 for identifiers). For numeric fields: `price` tolerance default 0.5% relative; `quantity` requires exact match unless otherwise specified.
- **Trade system precedence**: When multiple systems return matches, prefer Quest, then Vista FID, then Vista Equity, unless a stronger confidence score is available from another source.
- **Classification confidence**: Default thresholds — `<0.60` require manual review; `0.60–0.85` show warning and require operator confirmation; `>=0.85` allow auto-suggested responses but still editable.
- **Quarantine policy**: Emails failing parsing or producing ambiguous extracted entities MUST be moved to the quarantine queue and a structured failure record emitted for operator review.

These defaults can be refined during Phase 0 research; record any deviations in `research.md`.

## Modeling & Prompting (mandatory)

- Model selection and prompts: For classification and extraction, the spec MUST list the model(s) considered, the chosen model, and include canonical prompt templates used for inference and testing.
- Evaluation: The spec MUST provide evaluation datasets and measurable metrics (precision, recall, F1, calibration) and define thresholds that determine auto-suggestion vs manual review.
- Reproducibility: Prompt examples, input fixtures, and evaluation scripts MUST be checked into the feature docs (e.g., `research.md` or `data-model.md`) so CI can reproduce evaluation runs.

- Automation thresholds (chosen): This feature will follow the selected "Aggressive automation" posture:
	- Classification: auto-suggest when model confidence >= 0.75; show reviewer warning and require operator confirmation for confidence in [0.60, 0.75); require manual review for confidence < 0.60.
	- Extraction: field-level auto-suggestion allowed when evaluated field F1 >= 0.80. Fields below this threshold must be surfaced for human review (implementation may define a review band, e.g., 0.70–0.80).

	The evaluation section MUST include scripts and datasets to compute these metrics per-field so CI can flag regressions.

## Success Criteria *(mandatory)*

- **SC-001**: Parser extracts `client_name` and primary trade identifiers in ≥80% of provided sample emails.
- **SC-002**: Reconciliation produces attribute-level comparisons for ≥90% of ingested trades in test dataset.
- **SC-003**: Users can review and edit generated responses in the UI; 95% of reviewed responses are editable and sendable without system errors.

## Assumptions

- Sample inputs live under `spec-inputs/client-emails/` for development and testing.
- Access to trade systems (Quest, Vista FID, Vista Equity) will be provided via integration stubs or test APIs during development.
