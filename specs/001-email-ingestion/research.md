# Research: Email ingestion & structured parsing

**Feature**: Email ingestion and trade reconciliation
**Date**: 2026-06-15

Decision: Use a prompt-based, model-driven approach for both intent classification
and trade information extraction. Implement a lightweight `.eml` parser to
extract headers and plain text, then run prompt-based inference (via
`mock-api/modelClient.js`) against canonical prompt templates in
`mock-api/prompt_templates/`.

Rationale:
- Aligns with the project constitution (model-driven requirement).
- Prompt engineering provides flexibility for varied email formats without
  introducing brittle, hard-coded rules.
- Keeps business logic and extraction semantics in the model/prompt layer,
  simplifying maintenance and iteration.

Alternatives considered:
- Regex-based extraction (rejected): fragile across formats and violates the
  project constraint against rule-based solutions for classification/extraction.
- Off-the-shelf NER (spaCy) (rejected for MVP): heavier infra and larger
  operational footprint; consider later if model approach proves insufficient.

Input data and fixtures:
- Sample emails: `spec-inputs/client-emails/` (use these as annotated test
  fixtures for evaluation).
- Trade lookup DB: `spec-inputs/api-trade-search-db.json` (mock responses).

Prompt templates:
- Classification template: `mock-api/prompt_templates/classification.txt`
- Extraction template: `mock-api/prompt_templates/extraction.txt`

Evaluation and metrics:
- Classification: report precision, recall, F1, and calibration (confidence
  reliability). Selected automation thresholds (Option C): auto-suggest when
  confidence >= 0.75; review band 0.60–0.75; manual review < 0.60.
- Extraction: compute field-level precision/recall/F1 using annotated fixtures.
  Auto-suggest allowed when field F1 >= 0.80; otherwise surface fields for
  human review.

Reproducibility / CI:
- Provide evaluation scripts that load annotated samples from
  `specs/001-email-ingestion/eval/` and compute per-field metrics. Add a CI
  job that runs these evaluations and fails the PR when F1 for critical fields
  (security_id, quantity) drops below a guarded threshold.

Action items:
1. Create annotated test fixtures from `spec-inputs/client-emails/`.
2. Implement evaluation scripts (classification + extraction) under
   `specs/001-email-ingestion/eval/` and wire into CI.
3. Iterate on prompt templates and example prompts in `mock-api/prompt_templates/`.
