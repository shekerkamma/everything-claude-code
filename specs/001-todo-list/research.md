# Phase 0 Research: Todo List Demo App

The user prompt for `/speckit-plan` resolved every Technical Context field
explicitly, so there are no [NEEDS CLARIFICATION] items to chase. This file
records the small number of best-practice decisions made for the chosen stack.

## Decisions

### D1 — Module pattern

**Decision**: Single IIFE in `app.js` that closes over `state` and exposes
nothing on `window`.

**Rationale**: Avoids polluting global scope while still allowing a single
`<script src="app.js">` tag (no `type="module"`, which would force CORS and
break `file://` loading per Constitution Principle IV).

**Alternatives considered**:

- ES modules (`<script type="module">`) — REJECTED. Browsers refuse to load
  modules over `file://` due to CORS, violating Principle IV.
- Bare global functions — REJECTED. Pollutes `window`; harder to reason about.

### D2 — ID generation

**Decision**: `crypto.randomUUID()` with a fallback that concatenates
`Date.now()` and `Math.random().toString(36).slice(2)`.

**Rationale**: `crypto.randomUUID()` is supported in Chrome ≥92, Firefox ≥95,
Safari ≥15.4. The fallback covers older Safari and any sandboxed `file://`
context where `crypto` may be undefined.

**Alternatives considered**:

- Auto-increment counter — REJECTED. ID collisions after `localStorage` clears
  and the user re-adds an item could surprise the renderer's keyed updates.

### D3 — Storage schema versioning

**Decision**: Use storage key `speckit-todo-list:v1`. Bump the suffix on any
breaking schema change.

**Rationale**: A single-key versioned namespace lets a future reader detect a
schema mismatch and recover by treating storage as empty (per spec edge case).

**Alternatives considered**:

- Unversioned `todos` key — REJECTED. Future migrations couldn't distinguish
  shape changes from corrupted payloads.

### D4 — Render strategy

**Decision**: Full DOM rebuild of the `<ul>` on every state change, using
`textContent` (never `innerHTML`) to assign user-supplied text.

**Rationale**: At ≤500 items the rebuild cost is negligible (<10ms in a desktop
browser) and the simpler code path eliminates every reconciliation bug.
`textContent` neutralizes XSS from arbitrary todo text without a sanitizer
dependency.

**Alternatives considered**:

- Diff/patch updates — REJECTED. Implementation complexity exceeds the
  performance benefit at this scale.
- Template strings into `innerHTML` — REJECTED. Introduces XSS risk.

### D5 — Filter as state, not URL

**Decision**: Active filter (`all` | `active` | `completed`) lives in the same
in-memory state object as the todos. Not persisted; resets to `all` on reload.

**Rationale**: Persisting the filter would surprise users on reload (their
todos appear "missing" because of a Completed filter from a prior session).
Spec doesn't require persistence of UI mode.

**Alternatives considered**:

- URL hash routing (`#/active`) — REJECTED. Adds complexity for a feature the
  spec doesn't demand; doesn't survive `file://` cleanly across browsers.

### D6 — Defensive `localStorage` access

**Decision**: Wrap every `getItem`/`setItem` in try/catch. On read failure,
treat as empty list. On write failure, log to console and continue (state is
still correct in memory).

**Rationale**: Some browser private modes throw `QuotaExceededError` or block
storage outright. Spec accepts session-only behavior in that case.

## All NEEDS CLARIFICATION resolved

None outstanding. Proceed to Phase 1.
