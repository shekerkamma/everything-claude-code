# harness-demo — Notes CLI

A small Python CLI for notes, built to demonstrate **Harness Engineering**
applied to the **Spec-Driven Development** workflow.

> Ported (with permission per MIT license) and translated to English from
> [betta-tech/harness-sdd](https://github.com/betta-tech/harness-sdd), the
> companion repo for the YouTube video
> ["Harness Engineering: Spec-Driven Development with sub-agents"](https://www.youtube.com/watch?v=ElGlTv2A_bM).
>
> The application code is intentionally tiny. What matters here isn't
> **what** the app does — it's **how** the repo is structured so an AI
> agent can work on it autonomously and verifiably.

## How the harness is organized

| Pillar                                | Where it lives in this repo                                                       |
|---------------------------------------|-----------------------------------------------------------------------------------|
| **1. The repo IS the system**         | `AGENTS.md`, `init.sh`, `feature_list.json`, `specs/`, `progress/`, `docs/`       |
| **2. Multi-agent orchestration**      | `.claude/agents/leader.md`, `spec_author.md`, `implementer.md`, `reviewer.md`     |
| **3. Spec-Driven Development**        | `docs/specs.md`, EARS notation, human approval gate at `spec_ready`               |
| **4. Supervision & feedback**         | `CHECKPOINTS.md`, hooks in `.claude/settings.json`, `tests/`                      |

## Get started

```bash
./init.sh
```

If everything is green, open `AGENTS.md` and follow from there.

## Use the app as a human

```bash
python3 -m src.cli add "buy bread" --body "and milk"
python3 -m src.cli list
```

## Try it yourself with Claude Code

If you clone the repo and open Claude Code in this directory, you're
already inside the harness: `CLAUDE.md` forces the model to act as
`leader` (orchestrates, doesn't edit code) and `docs/specs.md` enforces
the Spec-Driven Development flow.

Quick recipe:

1. `./init.sh` — must end green.
2. Open `feature_list.json` and leave at least one feature with
   `status: "pending"` and `"sdd": true`. Feature #8 `cli_count` is
   already set up that way.
3. Launch Claude Code in this directory: `claude`.
4. Tell it: **"implement the next pending feature"**.

What happens, in two phases:

**Phase 1 — Spec.** The `leader` launches a `spec_author` which writes
`specs/<feature>/{requirements.md, design.md, tasks.md}` and moves the
feature to `spec_ready`. Then it **stops and asks for your approval**.

You read the three files in your editor:

- `requirements.md` — what the feature must do, in strict EARS.
- `design.md` — technical decisions before any code is written.
- `tasks.md` — checklist of discrete steps to execute.

When you're satisfied, you say "approved" in chat (or request changes).

**Phase 2 — Code.** The `leader` transitions the feature to `in_progress`
and launches `implementer` (which follows the tasks one by one,
checking them off `[x]`) and then `reviewer` (which verifies the
`R<n>` ↔ test traceability and that all tasks are complete).

Where each sub-agent's trace lands:

| File                                  | Who writes it      | What it contains                                              |
|---------------------------------------|--------------------|---------------------------------------------------------------|
| `specs/<feature>/requirements.md`     | spec_author        | EARS requirements numbered `R1`, `R2`, ...                    |
| `specs/<feature>/design.md`           | spec_author        | Technical decisions + one rejected alternative                |
| `specs/<feature>/tasks.md`            | spec_author        | Checklist; implementer marks `[x]` as each is done            |
| `progress/current.md`                 | leader             | Live session plan                                             |
| `progress/impl_<feature>.md`          | implementer        | Files touched + map `R<n> → test` + test output               |
| `progress/review_<feature>.md`        | reviewer           | Checklist against `docs/`, `specs/<feature>/`, `CHECKPOINTS.md` |
| `feature_list.json`                   | leader/implementer | `pending` → `spec_ready` → `in_progress` → `done`             |
| `progress/history.md`                 | leader             | Append-only summary at session close                          |

Keep `specs/` and `progress/` open in your editor while Claude works:
each report appears as soon as its sub-agent finishes. That's the
no-broken-telephone rule in action — content doesn't flow through chat,
it lives on disk and gets versioned.

## Structure

```
.
├── AGENTS.md              # Map for agents (progressive disclosure)
├── CHECKPOINTS.md         # Final-state correctness criteria
├── CLAUDE.md              # Forces the leader role
├── feature_list.json      # Scope: one feature at a time
├── init.sh                # Verification & initialization
├── specs/<feature>/       # Kiro-style spec per feature
│   ├── requirements.md    # EARS notation
│   ├── design.md          # Technical decisions
│   └── tasks.md           # Implementation checklist
├── progress/
│   ├── current.md         # Active session (live state)
│   └── history.md         # Append-only log
├── docs/
│   ├── architecture.md    # What "good work" means
│   ├── conventions.md     # Style, names, errors
│   ├── specs.md           # SDD process: EARS, 3 files, human approval
│   └── verification.md    # How to prove it works
├── .claude/
│   ├── agents/            # leader, spec_author, implementer, reviewer
│   └── settings.json      # Hooks that automate verification
├── src/
│   ├── storage.py         # Atomic JSON persistence
│   ├── notes.py           # Domain model
│   └── cli.py             # argparse interface
└── tests/
    ├── test_storage.py
    ├── test_notes.py
    └── test_cli.py
```

## Lessons this project illustrates

- **Progressive disclosure** in `AGENTS.md`: the agent doesn't get every
  rule up front, it gets a map and pulls rules on demand.
- **One feature at a time**, validated by `init.sh` (rejects more than
  one `in_progress` in `feature_list.json`).
- **Spec-Driven Development**, Kiro-style: requirements (EARS) → design →
  tasks → code, with a human approval gate before any code is touched.
- **State on disk**, not in chat: `specs/`, `progress/current.md` and
  `history.md` survive restarts and blown context windows.
- **Executable verification**: `init.sh` runs the real tests and validates
  spec presence for every SDD feature.
- **Mandatory traceability**: each `R<n>` maps to a concrete test; the
  reviewer rejects if it doesn't.
- **Leader-SpecAuthor-Implementer-Reviewer pattern**: the leader doesn't
  implement, the spec_author doesn't code, the implementer doesn't
  self-approve, the reviewer doesn't edit code.
- **No broken telephone**: sub-agents write results to files and return
  only a lightweight reference.

## How this fits the rest of this repo

`everything-claude-code` already ships a Spec Kit integration via the
`/speckit-*` skills. That integration is one *style* of harness —
slash-command-driven, run by the human. This `harness-demo/` is a
different style — agent-driven, where a Leader subagent fans out to
specialized subagents and the human is the approval gate. Both are
spec-driven; they trade off control vs. ceremony differently.

## License & credits

This port preserves the spirit and structure of betta-tech/harness-sdd.
See https://github.com/betta-tech/harness-sdd for the original Spanish
version. Modifications: English translation, minor naming consistency
adjustments. The application code (`src/`, `tests/`) is functionally
identical.
