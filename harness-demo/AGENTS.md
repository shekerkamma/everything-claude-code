# AGENTS.md — Navigation map for AI agents

> This file is the **entry point** for any agent working in this
> directory. It is NOT a rulebook: it is a **map**. Read only what you
> need, when you need it (progressive disclosure).

---

## 1. Before you start (mandatory)

1. Run `./init.sh` and verify it ends without errors. If it fails,
   **stop** and resolve the environment before touching any code.
2. Read `progress/current.md` to understand what state the last session
   left things in.
3. Read `feature_list.json`. Every new feature (`"sdd": true`) flows
   through **Spec-Driven Development** — see `docs/specs.md` and §4 of
   this file.
4. Read `docs/specs.md` before touching any spec or any `sdd: true`
   feature.

## 2. Repository map

| File / folder                | What it contains                                                              | When to read it |
|------------------------------|-------------------------------------------------------------------------------|-----------------|
| `feature_list.json`          | Task list with state (`pending` / `spec_ready` / `in_progress` / `done` / `blocked`) | Always, on startup |
| `progress/current.md`        | State of the current session                                                  | Always, on startup |
| `progress/history.md`        | Append-only log of previous sessions                                          | If you need historical context |
| `specs/<feature>/`           | `requirements.md` + `design.md` + `tasks.md` (Kiro-style)                     | Before implementing any feature with `"sdd": true` |
| `docs/architecture.md`       | What "good work" means in this project                                        | Before implementing |
| `docs/conventions.md`        | Style, naming, structure rules                                                | Before writing code |
| `docs/specs.md`              | SDD process: EARS notation, the 3 files, human approval gate                  | Before writing or reading any spec |
| `docs/verification.md`       | How to verify your work (includes requirements traceability)                  | Before marking a task `done` |
| `CHECKPOINTS.md`             | Objective "final-state correct" criteria                                      | For self-evaluation |
| `.claude/agents/`            | Sub-agent definitions (`leader`, `spec_author`, `implementer`, `reviewer`)    | If you orchestrate work |
| `src/`                       | Application code                                                              | For implementing |
| `tests/`                     | Automated tests                                                               | For verifying |

## 3. Hard rules (non-negotiable)

- **One feature at a time.** Don't mix changes from multiple tasks in one session.
- **Don't declare a task `done` without green tests.** Run `./init.sh` and
  make sure the test block passes 100%.
- **Don't skip the spec phase.** Every feature with `"sdd": true` must
  pass through `spec_author` and receive human approval before code is
  touched.
- **Don't skip the human approval gate.** The leader pauses the flow at
  `spec_ready` and waits.
- **Document what you're doing** in `progress/current.md` while you
  work, not after.
- **Leave the repo clean** before closing the session (see §5).
- **If you don't know something, look in `docs/`** before making it up.

## 4. Workflow (SDD)

```
pending → [spec_author] → spec_ready → ⏸ HUMAN → in_progress → [implementer → reviewer] → done
```

1. The leader picks the first feature that is neither `done` nor
   `blocked` from `feature_list.json`.
2. The leader launches `spec_author`, which creates
   `specs/<name>/{requirements,design,tasks}.md` and flips status to
   `spec_ready`.
3. **Pause.** The human reads the spec in `specs/<name>/` and approves
   (or asks for changes).
4. Once approved, the leader changes status to `in_progress` and
   launches `implementer`.
5. The implementer runs `tasks.md` one by one, marking each `[x]`.
6. The reviewer verifies traceability `R<n>` ↔ test and that all tasks
   are complete; approves or rejects.
7. If approved, the implementer marks `done` and moves the summary to
   `progress/history.md`.

## 5. Session close (lifecycle)

Before ending:

1. Run `./init.sh` — must be all green.
2. If the task is finished: set `status: "done"` in `feature_list.json`.
3. Move the summary from `progress/current.md` to the end of
   `progress/history.md`.
4. Empty `progress/current.md` leaving only the template.
5. Don't leave temp files, no debug `print()`s, no TODOs without
   context.

## 6. If you're stuck

- Re-read the relevant section of `docs/`.
- If a tool doesn't do what you expect, **don't invent a workaround**:
  document the block in `progress/current.md` and end the session.
