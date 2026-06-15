# Data Model: Email ingestion and trade reconciliation

## EmailRecord
- **id**: string (UUID or opaque id)
- **subject**: string
- **sender**: string (email address)
- **sent_timestamp**: string (ISO 8601)
- **body**: string (plain text)
- **raw_payload**: string (raw .eml content, optional)

Validation:
- `sender` must be a valid email format
- `sent_timestamp` must be ISO 8601

## ExtractedTrade
- **security_id**: string (normalized uppercase; pattern: ^[A-Z0-9]{3,12}$)
- **trade_date**: string (ISO 8601 date)
- **settlement_date**: string (ISO 8601 date, optional)
- **quantity**: number (positive)
- **price**: number (non-negative)
- **account**: string
- **counterparty**: string
- **currency**: string (ISO 4217, 3 letters)

Validation/Normalization:
- `security_id` should be normalized to uppercase and stripped of punctuation.
- Numeric fields parsed from strings must remove thousands separators and be
  converted to numbers.

## ReconciliationResult
- **email_trade_id**: string (link to `ExtractedTrade`)
- **retrieved_trade_id**: string (id from trade system)
- **attribute_results**: object mapping attribute name -> one of
  `match`, `partial`, `mismatch`, `unknown` (e.g., `{"quantity":"match"}`)
- **overall_status**: `matched` | `partial` | `unmatched` | `quarantined`
- **confidence**: number (aggregate confidence from model/extraction)
- **created_at**: string (ISO 8601)

State transitions:
- New -> quarantined (if classification confidence < 0.60 or missing critical fields)
- New -> unmatched/partial/matched based on attribute-level comparisons

Notes:
- Store canonical forms for comparable fields (uppercase ids, normalized
  dates) to ensure deterministic reconciliation logic.
- The system should include an audit trail of prompt inputs/outputs for
  reproducibility and debugging.
