# spec-inputs — sample inputs and dummy data

This directory contains example inputs to drive the specification and implementation workflow:

- `constitution-requirement.txt` — proposed constitution / governance requirements.
- `specify-requirement.txt` — a feature-level requirements text file used as input to `/speckit.specify`.
- `client-emails/` — sample `.eml` files for parser development and tests.
- `api-trades.json` — small dummy JSON database useful for integration tests or API search mocking.

Usage
- To start a spec from the `specify-requirement.txt` contents, copy/paste or reference the file when invoking `/speckit.specify`.
- Use the `client-emails/` examples to validate the email parser and extraction logic.
