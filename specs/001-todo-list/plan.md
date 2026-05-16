# Implementation Plan: Todo List Demo App

**Branch**: `001-todo-list` | **Date**: 2026-05-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-todo-list/spec.md`

## Summary

A single-page client-only todo list. Users add, complete, delete, filter, and
bulk-clear todos; state persists in `localStorage`. The app is a static
HTML/CSS/JS triple, runnable by opening `index.html` from disk. State is held
in one in-memory array; a single `render()` rebuilds the visible list after
every mutation, then writes the array to `localStorage`.

## Technical Context

**Language/Version**: HTML5, CSS3, ECMAScript 2020 (ES2020) JavaScript

**Primary Dependencies**: None. The browser's built-in DOM, `localStorage`, and
`crypto.randomUUID()` (with `Date.now()` + `Math.random()` fallback) are the
only platform APIs used.

**Storage**: Browser `localStorage`. Single key (`speckit-todo-list:v1`) holding
a JSON-serialized array of `Todo` records.

**Testing**: Manual smoke test in browser per spec acceptance scenarios. No
automated test framework (precluded by Constitution Principle I — no build
tooling).

**Target Platform**: Latest two stable versions of Chrome, Firefox, and Safari.
Loaded via `file://` (no HTTP server required).

**Project Type**: Single-page web application, frontend-only.

**Performance Goals**: <100ms perceived latency for any user interaction (per
SC-002). Comfortable rendering of ≥100 todos without virtualization.

**Constraints**: No build step. No bundler. No npm. No CDN. No backend. All
assets local. Total source ≤5 files in `demo-app/`.

**Scale/Scope**: Single user, single device. ≤500 todos comfortably (above this,
revisit virtualization).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|-----------|-------|--------|
| I. Simplicity First | No build tools / frameworks? | ✅ Vanilla HTML/CSS/JS. Zero deps. |
| II. Manual Testability | Each FR maps to a click/keystroke? | ✅ All 14 FRs verifiable from spec acceptance scenarios. |
| III. Accessibility | Semantic HTML, keyboard-reachable, ARIA where needed? | ✅ `<form>`, `<input>`, `<button>`, `<ul>`, `<li>`. Filter buttons get `aria-pressed`. Item count uses `aria-live="polite"`. |
| IV. Zero Dependencies | Runs from `file://`? | ✅ No external requests; `crypto.randomUUID()` is built-in. |
| V. Self-Contained | All code under `demo-app/`? | ✅ See Project Structure below. |

**Initial gate**: PASS. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output: keyboard map + ARIA contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
demo-app/
├── index.html           # Semantic markup, single page
├── styles.css           # BEM-ish class names; focus + hover styles
├── app.js               # State + render IIFE module; localStorage persistence
└── README.md            # Run instructions ("open index.html")
```

**Structure Decision**: Single-project, frontend-only layout under `demo-app/`.
No `tests/` directory — Constitution Principle II routes verification through
manual smoke testing per spec acceptance scenarios. No `src/` subdirectory
because the file count is small enough that nested folders add navigation cost
without organization gain.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No violations. Section intentionally empty.
