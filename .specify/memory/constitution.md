
# Project: Client Email Processing Constitution

<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.0.1
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Library-First
	- [PRINCIPLE_2_NAME] -> II. CLI-First
	- [PRINCIPLE_3_NAME] -> III. Test-First (Non-negotiable)
	- [PRINCIPLE_4_NAME] -> IV. Observability
	- [PRINCIPLE_5_NAME] -> V. Simplicity & Security
- Added sections:
	- Technology Constraints (prototype allowance)
	- Development Workflow
- Removed sections: none
- Templates checked:
	- .specify/templates/spec-template.md: ✅
	- .specify/templates/plan-template.md: ✅
	- .specify/templates/tasks-template.md: ✅
	- .specify/templates/checklist-template.md: ✅
	- .specify/templates/constitution-template.md: ✅
- Follow-up TODOs: none
-->

## Core Principles

### I. Library-First
- Projects MUST model domain concerns as small, well-defined libraries.
- Libraries MUST be independently testable, documented, and have clear public APIs.

### II. CLI-First
- Tools and utilities SHOULD expose deterministic CLI entrypoints.
- CLIs MUST accept arguments and stdin, and provide machine-readable JSON output when requested.

### III. Test-First (Non-negotiable)
- Tests MUST be written before or alongside implementation: unit tests for libraries and
	integration tests for cross-library behavior.
- Pull requests that add behavior without tests MUST be rejected.

### IV. Observability
- Services and libraries MUST emit structured logs and include correlation IDs for
	end-to-end traceability. Critical flows MUST expose metrics and traces.

### V. Simplicity & Security
- Design choices MUST prefer simplicity and minimal surface area.
- Sensitive data MUST be handled under least-privilege principles and sanitized on input.

## Technology Constraints

- Language: Python 3.11 (primary runtime). For prototypes and frontend developer tooling,
	Node.js 18+ (Vite) is permitted; production backend services are expected to use
	Python where feasible.
- Packaging: libraries SHOULD be pip-installable and use `pyproject.toml` for
	Python components; frontend artifacts use standard npm tooling.
- CI: every PR MUST run tests, linting, and type checks before merging

## Development Workflow

- Branching: use feature branches named `feature/<short-description>`
- Reviews: require at least one approving review and successful CI before merging
- Tests: run `pytest`; unit tests MUST cover critical logic paths

## Governance

Amendments to this constitution REQUIRE a written rationale and a migration plan.
All amendments MUST be proposed in a PR, reviewed, and ratified before they take effect.

**Version**: 1.0.1 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15

