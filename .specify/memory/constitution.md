<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0 (MAJOR — generalized from todo-list-only to
                                project-wide with feature stack profiles)
Modified principles:
  - I. "Simplicity First" → "Right-Sized Stack" (stack chosen per feature, not
       global; vanilla allowed and preferred when sufficient)
  - II. "Manual Testability (NON-NEGOTIABLE)" → kept verbatim
  - III. "Accessibility by Default" → kept verbatim
  - IV. "Zero Dependencies" → "Local-First Runnability" (allow deps when the
        feature stack profile requires them; the bar is "must run on a fresh
        clone with documented setup")
  - V. "Self-Contained Layout" → kept, generalized: each demo feature lives in
       its own top-level directory
Added sections:
  - Feature Stack Profiles (Static Frontend, Full-Stack)
  - Per-feature override mechanism
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ Constitution Check section already
    keys off principle list; no change needed
  - .specify/templates/spec-template.md ✅ no constitution-driven sections
  - .specify/templates/tasks-template.md ✅ no a11y/manual-test task type yet
Existing features re-evaluated:
  - specs/001-todo-list/ ✅ Static Frontend profile applies; passes all
    principles unchanged
Follow-up TODOs: none
-->

# Everything-Claude-Code Demo Constitution

This constitution governs every demo feature built in this repository under
the spec-kit workflow. Constraints that vary by stack are captured in
**Feature Stack Profiles** below — a feature picks one profile in its plan
and inherits its rules.

## Core Principles

### I. Right-Sized Stack (NON-NEGOTIABLE)

The stack a feature picks MUST be the simplest one that satisfies the spec.
Vanilla HTML/CSS/JS beats a framework when the feature has no dynamic state
beyond a single page; a backend is added only when the feature genuinely
requires server-held state, multi-user data, or auth. The plan MUST name the
chosen profile and justify any deviation in the Constitution Check.

**Rationale**: Demos exist to make the workflow legible. Stack overhead that
isn't earned by the feature obscures what the workflow actually produced.

### II. Manual Testability (NON-NEGOTIABLE)

Every interactive feature MUST be exercisable end-to-end without specialized
setup. Each spec acceptance criterion MUST map to a click/keystroke sequence
a reviewer can perform from `quickstart.md`. Features MAY add automated
tests, but a passing automated suite does NOT replace a passing manual smoke
test.

**Rationale**: A demo whose value can't be confirmed by clicking through it
isn't a demo.

### III. Accessibility by Default

Markup MUST be semantic (`<button>`, `<form>`, `<ul>` — not styled `<div>`s).
All interactive elements MUST be keyboard-reachable and operable. ARIA
attributes are added where semantic HTML is insufficient (live regions,
custom controls). This applies equally to vanilla pages and React
components.

**Rationale**: Accessibility retrofits are expensive; building it in costs
nothing.

### IV. Local-First Runnability

A fresh clone of this repo MUST run any demo feature with at most: (a) a
documented `npm install` (or equivalent) per directory, (b) a documented
`migrate + seed` step for features with a database, and (c) a single
documented `start` command per process. No hosted services, no paid APIs, no
secrets the user has to provision themselves. SQLite is the default database;
file-based, zero-config.

**Rationale**: Demos that need credentials nobody has aren't demos.

### V. Per-Feature Self-Containment

Each demo feature MUST live in its own top-level directory at the repository
root (`demo-app/`, `restaurant-app/`, etc.). Cross-feature imports are
forbidden. Spec/plan/tasks artifacts live under `specs/<NNN>-<slug>/`.
Shared `.specify/` scaffolding is the only inter-feature surface.

**Rationale**: A reviewer can `rm -rf` a single demo directory to clean up
or replace it without affecting the others.

## Feature Stack Profiles

A feature picks exactly one profile in its plan's Technical Context section.

### Profile A — Static Frontend

- **Stack**: HTML5, CSS3, ES2020+ JavaScript. No build step, no bundler, no
  npm install.
- **Storage**: `localStorage` only.
- **Run**: `open <feature>/index.html` (or via local HTTP server for testing
  if `file://` is blocked, but the file must be openable directly).
- **File budget**: ≤8 source files in the feature directory.
- **Used by**: features whose spec has no auth, no multi-user state, no
  server-side persistence.
- **Currently in use by**: `demo-app/` (Todo List, spec 001).

### Profile B — Full-Stack

- **Frontend**: React 18+ with Vite, Tailwind CSS via PostCSS. ES modules.
- **Backend**: Node.js 18+, Express, Prisma ORM, SQLite database.
- **Auth**: JWT (access tokens only — no refresh complexity for demo scope),
  bcrypt for password hashing.
- **Run**: `npm install && npm run db:setup && npm run dev` per side
  (frontend, backend), documented in the feature's README.
- **File budget**: not capped, but every file must be reachable from a route
  or imported by something that is. No dead code.
- **Used by**: features that require auth, admin dashboards, or persisted
  multi-user data.
- **Currently in use by**: `restaurant-app/` (Restaurant Demo, spec 002).

## Development Workflow

- **Spec-driven**: All features flow through `/speckit-specify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Hand-coded
  changes outside this loop are confined to typo fixes and dependency bumps.
- **One feature per branch**: spec NNN ↔ implementation under
  `<feature>/`.
- **Manual smoke test before commit**: After `/speckit-implement`, the
  reviewer MUST run the feature's `quickstart.md` and confirm every
  acceptance criterion. The smoke-test result is recorded in the commit
  message.
- **Constitution Check is a gate**: The plan's Constitution Check section
  MUST list every principle and mark it ✅ or document the waiver in the
  Complexity Tracking table.

## Governance

This constitution supersedes ad-hoc decisions during a build. Violations
surfaced during `/speckit-analyze` MUST be fixed or explicitly waived in the
plan with a one-line justification. Amendments follow semantic versioning:
MAJOR for principle removal/redefinition or profile changes that break
existing features, MINOR for added principles or profiles, PATCH for
clarifications.

**Version**: 2.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
