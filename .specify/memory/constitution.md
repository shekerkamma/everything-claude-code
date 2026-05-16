<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Modified principles: N/A (initial)
Added sections:
  - Core Principles (5 principles)
  - Technology Constraints
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending (Constitution Check section will reference these principles)
  - .specify/templates/spec-template.md ✅ no changes required (no constitution-driven sections)
  - .specify/templates/tasks-template.md ⚠ pending (no a11y/manual-test task type yet)
Follow-up TODOs: none
-->

# Demo App Constitution

## Core Principles

### I. Simplicity First (NON-NEGOTIABLE)

The project MUST use vanilla HTML, CSS, and JavaScript only. Build tools, bundlers,
package managers, and frameworks are forbidden. Code MUST be readable end-to-end
without a transpilation step.

**Rationale**: A demo whose purpose is to validate a workflow must not introduce a
toolchain whose complexity exceeds the workflow being validated.

### II. Manual Testability (NON-NEGOTIABLE)

Every interactive feature MUST be exercisable in a browser without setup. Each
spec acceptance criterion MUST map to a click/keystroke sequence a reviewer can
perform in under one minute.

**Rationale**: With no test framework allowed (per Principle I), human-verifiable
criteria are the only correctness gate.

### III. Accessibility by Default

Markup MUST be semantic HTML5 (`<button>`, `<form>`, `<ul>`, etc., not styled
`<div>`s). All interactive elements MUST be keyboard-reachable and operable. ARIA
attributes MUST be added where semantic HTML is insufficient (e.g. live regions,
custom controls).

**Rationale**: Accessibility retrofits are expensive; building it in costs nothing.

### IV. Zero Dependencies

The app MUST run by opening `index.html` directly in any modern browser
(Chrome/Firefox/Safari current versions). No HTTP server, no npm install, no CDN
requests. All assets MUST be inlined or local.

**Rationale**: Removes every variable except the code itself when validating the
workflow output.

### V. Self-Contained Layout

All demo code MUST live under `demo-app/`. Nothing outside that directory may be
created or modified by the implementation phase, except spec/plan/tasks artifacts
under `.specify/`.

**Rationale**: Keeps the demo cleanly separable from the host repository and
makes "what did the workflow produce?" trivially answerable with `ls demo-app/`.

## Technology Constraints

- **Languages**: HTML5, CSS3, ES2020+ JavaScript (no TypeScript, no JSX).
- **State persistence**: `localStorage` only. No backend, no IndexedDB, no cookies.
- **File count**: Target ≤5 source files in `demo-app/` (e.g. `index.html`,
  `styles.css`, `app.js`, plus README and a screenshot if useful).
- **Browser support**: Latest two stable versions of Chrome, Firefox, and Safari.

## Development Workflow

- **Spec-driven**: All work flows through `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. Hand-coded changes outside this loop
  defeat the purpose of the demo.
- **Single feature branch**: The demo is built on one branch; no parallel work.
- **Manual smoke test**: After `/speckit-implement`, the reviewer MUST open
  `demo-app/index.html` and confirm each acceptance criterion before sign-off.

## Governance

This constitution supersedes ad-hoc decisions during the demo build. Any
violation surfaced during `/speckit-analyze` MUST be either fixed or explicitly
waived in the plan with a one-line justification. Amendments follow semantic
versioning: MAJOR for principle removal/redefinition, MINOR for added principles,
PATCH for clarifications. The constitution is consulted by every speckit phase
via the Constitution Check gate.

**Version**: 1.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
