# Spec-Driven Development (SDD)

> This project follows a Kiro-style flow: requirements → design → tasks
> → code. Code is not written until the spec is approved by a human.

## Structure

Every new feature (`"sdd": true` in `feature_list.json`) gets a
dedicated folder as soon as it leaves `pending`:

```
specs/<feature-name>/
├── requirements.md   # WHAT is needed (EARS notation)
├── design.md         # HOW it will be built (technical decisions)
└── tasks.md          # Concrete STEPS to implement
```

The `feature-name` matches the `name` field in `feature_list.json`.

## Feature states

| State          | Meaning                                                        |
|----------------|----------------------------------------------------------------|
| `pending`      | No spec. The `spec_author` is first to act.                    |
| `spec_ready`   | Spec drafted. Awaiting human approval. NO code is touched.     |
| `in_progress`  | Spec approved. `implementer` working.                          |
| `done`         | Code green, `reviewer` approved, session closed.               |
| `blocked`      | Stuck. Reason in `progress/current.md`.                        |

## The human approval gate

The automated flow stops **once**: when the `spec_author` finishes its
three files, marks the feature as `spec_ready`, and stops. The human
reads `specs/<feature>/` and says "approved" (or asks for changes).

Only then does the `leader` transition `spec_ready → in_progress` and
launch the `implementer`.

```
pending → [spec_author] → spec_ready → ⏸ HUMAN → in_progress → [implementer → reviewer] → done
```

## requirements.md — strict EARS

Requirements are written in **EARS** (Easy Approach to Requirements
Syntax). Each requirement is a numbered paragraph using one of these
five patterns:

| Pattern        | Template                                                    |
|----------------|-------------------------------------------------------------|
| **Ubiquitous** | `The system MUST <action>.`                                 |
| **Event**      | `WHEN <trigger>, the system MUST <action>.`                 |
| **State**      | `WHILE <state>, the system MUST <action>.`                  |
| **Optional**   | `WHERE <optional feature>, the system MUST <action>.`       |
| **Unwanted**   | `IF <unwanted event> THEN the system MUST <action>.`        |

Hard rules:

- Each requirement gets a stable id: `R1`, `R2`, ...
- Each requirement MUST be verifiable by at least one concrete test.
- Don't combine multiple `MUST`s in one requirement. Split if needed.
- Don't use soft verbs ("might", "may", "supports"). Only `MUST` /
  `MUST NOT`.

Example:

```markdown
## R1
WHEN the user runs `python -m src.cli recent`, the system MUST print up
to 5 notes ordered by `created_at` descending.

## R2
IF the `--limit` flag receives a value <= 0 THEN the system MUST print
an error message on stderr and exit with code != 0.
```

## design.md — technical decisions

Capture **before** touching code:

- Which files are created / modified.
- Which new signatures appear (functions, classes, commands).
- Which exceptions are reused or added.
- Which alternative was rejected and why (at least one).

It is NOT engineering from first principles — lean on
`docs/architecture.md` and `docs/conventions.md`. The `design.md`
documents the places where your feature pushes against the edges of
those rules.

## tasks.md — executable checklist

Discrete steps in order, each with a checkbox. Each task references at
least one `R<n>` it covers.

Example:

```markdown
- [ ] T1 — Add `cmd_recent` in `src/cli.py`. Covers: R1, R3.
- [ ] T2 — Register `recent` subparser with `--limit` flag. Covers: R1, R2.
- [ ] T3 — Add `test_recent_default_limit` in `tests/test_cli.py`. Covers: R1.
- [ ] T4 — Add `test_recent_invalid_limit` in `tests/test_cli.py`. Covers: R2.
```

The `implementer` marks `[x]` each task as it completes. The `reviewer`
rejects if any `[ ]` remains without documented justification.

## Traceability (hard rule)

- Each test in `tests/` must be mappable to an `R<n>` from its spec.
- Each `R<n>` must have at least one concrete test.
- The `reviewer` checks this correspondence explicitly and rejects if
  it's missing.

The `implementer` documents the map in `progress/impl_<name>.md`:

```markdown
## Traceability
- R1 → `test_recent_default_limit`
- R2 → `test_recent_invalid_limit`
- R3 → `test_recent_custom_limit`
```

## When SDD does NOT apply

Features with `"sdd": false` or without the `sdd` field (the legacy
1–6) have NO spec. SDD only applies going forward.
