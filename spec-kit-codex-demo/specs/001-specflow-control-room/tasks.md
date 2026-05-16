# Tasks: SpecFlow Control Room

**Input**: `specs/001-specflow-control-room/spec.md` and `plan.md`

## Phase 1: Setup

- [X] T001 Create static application shell in `index.html`
- [X] T002 [P] Create local run script in `package.json`
- [X] T003 [P] Add project README with Codex Spec Kit commands in `README.md`

## Phase 2: Foundation

- [X] T004 Create responsive visual system in `src/styles.css`
- [X] T005 Create immutable local state and persistence in `src/app.js`

## Phase 3: User Story 1 - Inspect Workflow

- [X] T006 [US1] Render workflow command navigation in `src/app.js`
- [X] T007 [US1] Render selected stage details and artifact preview in `src/app.js`

## Phase 4: User Story 2 - Review Gates

- [X] T008 [US2] Render quality gates and analysis findings in `src/app.js`
- [X] T009 [US2] Render summary metrics in `src/app.js`

## Phase 5: User Story 3 - Track Tasks

- [X] T010 [US3] Render filterable implementation task board in `src/app.js`
- [X] T011 [US3] Persist task completion after refresh in `src/app.js`

## Phase 6: Polish

- [X] T012 Run local server smoke test and verify responsive layout

## Dependencies

Setup and Foundation must complete before user stories. US1 is the MVP. US2 and
US3 can be refined independently after the shared state model exists.
