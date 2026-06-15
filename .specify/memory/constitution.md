
# Project: Client Email Processing Constitution

<!--
Sync Impact Report
- Version change: 1.0.1 -> 1.1.0
- Modified principles: none renamed
- Added principles:
	- VI. Quality, Testing, UX & Performance (Non-negotiable)
- Added sections:
	- Technology Constraint: Model-driven classification & trade-extraction (prompt-based only)
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/spec-template.md: ✅ updated
	- .specify/templates/plan-template.md: ✅ updated
	- .specify/templates/tasks-template.md: ✅ updated
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

### VI. Quality, Testing, UX & Performance (Non-negotiable)
- Code quality & maintainability: All code MUST pass project linters and static analysis before merge. Pull requests MUST include a brief description of the change, a link to relevant tests, and at least one approving review.
- Testing standards: Critical business logic and library public APIs MUST have unit tests. Integration tests MUST validate end-to-end behavior for P1 user stories. Tests associated with a change MUST be included in the same PR and MUST pass in CI.
- User experience consistency: User-facing messages, UI components, and API ergonomics MUST follow documented project patterns. UX changes MUST include acceptance criteria and quickstart or demo steps in the feature docs.
- Performance requirements: Each plan MUST declare measurable performance goals (latency, throughput, memory) and include a verification plan. Features that affect critical paths MUST include benchmarks or load tests.
## Technology Constraints

- Language: Python 3.11 (primary runtime). For prototypes and frontend developer tooling,
	Node.js 18+ (Vite) is permitted; production backend services are expected to use
	Python where feasible.
- Packaging: libraries SHOULD be pip-installable and use `pyproject.toml` for
	Python components; frontend artifacts use standard npm tooling.
- CI: every PR MUST run tests, linting, and type checks before merging

- Model-driven processing: For any feature involving client-intent classification or trade-extraction,
  implementations MUST use prompt-based, model-driven approaches; rule- or heuristic-based
  approaches are not permitted.

## Development Workflow

- Branching: use feature branches named `feature/<short-description>`
- Reviews: require at least one approving review and successful CI before merging
- Tests: run `pytest`; unit tests MUST cover critical logic paths

## Governance

Amendments to this constitution REQUIRE a written rationale and a migration plan.
All amendments MUST be proposed in a PR, reviewed, and ratified before they take effect.

**Version**: 1.1.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15

