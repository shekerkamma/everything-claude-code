# CHECKPOINTS — Final-state evaluation

> In multi-agent systems you don't evaluate the path, you evaluate the
> destination. These are the objective checkpoints a judge (human or AI)
> can use to decide whether the project is healthy.

## C1 — The harness is complete

- [ ] The 4 base files exist: `AGENTS.md`, `init.sh`, `feature_list.json`,
      `progress/current.md`.
- [ ] The 3 docs exist: `docs/architecture.md`, `docs/conventions.md`,
      `docs/verification.md`.
- [ ] `./init.sh` ends with exit code 0.

## C2 — State is coherent

- [ ] At most one feature in `in_progress` in `feature_list.json`.
- [ ] Every `done` feature has associated tests that pass.
- [ ] `progress/current.md` is empty or describes the active session
      (no leftover trash from previous sessions).

## C3 — Code respects the architecture

- [ ] `src/` only contains the modules listed in `docs/architecture.md`.
- [ ] No external dependencies in `requirements.txt` (must be empty or
      not exist).
- [ ] No stray debug `print()`s, no TODOs without context.

## C4 — Verification is real

- [ ] `tests/` has at least one test per module in `src/`.
- [ ] Tests use `tempfile.TemporaryDirectory()`, not filesystem mocks.
- [ ] `python3 -m unittest discover -s tests -v` reports > 0 tests and
      all green.

## C5 — Session closed cleanly

- [ ] No suspicious untracked files (`*.tmp`, `__pycache__` outside
      `.gitignore`).
- [ ] `progress/history.md` has one entry for the last session.
- [ ] The most recently worked feature is reflected in its correct state.

## C6 — Spec-Driven Development

- [ ] Every feature with `"sdd": true` in state `spec_ready`,
      `in_progress`, or `done` has its `specs/<name>/` folder with the 3
      files: `requirements.md`, `design.md`, `tasks.md`.
- [ ] `requirements.md` uses strict EARS (see `docs/specs.md`).
- [ ] Every `done` feature with `"sdd": true` has all its tasks marked
      `[x]` in `tasks.md`.
- [ ] Each `R<n>` in `requirements.md` is covered by at least one
      concrete test in `tests/`.

---

**How to use this file:** a reviewer agent
(`.claude/agents/reviewer.md`) walks each checkbox, marks `[x]` or
`[ ]`, and rejects the session close if any boxes in C1–C6 are empty.
