# Historical log (append-only)

> Each time a session is closed, its summary is appended here.
> Do not edit previous entries. Only append at the end.

---

## 2026-04-20 — Project bootstrap
- **Agent:** human (Martín, original repo author)
- **Changes:** initial harness structure (AGENTS.md, init.sh, feature_list.json, docs/).
- **Result:** environment ready. `./init.sh` green.

## 2026-04-22 — Feature 1: storage_layer
- **Agent:** implementer #1
- **Plan:** create `src/storage.py` with atomic `load()` / `save()` and tests.
- **Changes:** `src/storage.py`, `tests/test_storage.py`.
- **Verification:** `./init.sh` green, 3 tests pass.
- **Close:** feature 1 marked `done`.

## 2026-04-23 — Feature 2: note_model
- **Agent:** implementer #2
- **Plan:** `Note` dataclass with `Note.new(title, body)` and dict serialization.
- **Changes:** `src/notes.py`, `tests/test_notes.py`.
- **Verification:** `./init.sh` green.
- **Close:** feature 2 marked `done`.

## 2026-04-25 — Feature 3: cli_add_list
- **Agent:** implementer #3, reviewed by reviewer-agent.
- **Plan:** `src/cli.py` with argparse, `add` and `list` commands.
- **Changes:** `src/cli.py`, `tests/test_cli.py`.
- **Verification:** `./init.sh` green, 7 tests pass.
- **Close:** feature 3 marked `done`. Next: feature 4 (show/delete).

## 2026-04-27 — Feature 4: cli_show_delete
- **Agent:** Claude Opus 4.7
- **Plan:** add `cmd_show` and `cmd_delete` in `src/cli.py` with `NoteNotFound` handling (stderr + exit 1).
- **Changes:** `src/cli.py` (subcommands `show`/`delete` and `NoteError` catch in `main`), `tests/test_cli.py` (4 new tests).
- **Verification:** `./init.sh` green, 14 tests pass.
- **Close:** feature 4 marked `done`. Next: feature 5 (search).

## 2026-04-27 — Feature 5: cli_search
- **Agent:** Claude Opus 4.6
- **Plan:** add `cmd_search` in `src/cli.py` with case-insensitive substring search across title and body.
- **Changes:** `src/cli.py` (`search` subcommand with `cmd_search`), `tests/test_cli.py` (3 new tests).
- **Verification:** `./init.sh` green, 17 tests pass.
- **Close:** feature 5 marked `done`.

## 2026-04-29 — Feature 6: cli_edit
- **Agent:** Claude Opus 4.7 (leader) → implementer → reviewer.
- **Plan:** add `cmd_edit` in `src/cli.py` with optional `--title` and `--body`; no flags → `NoteError`; missing id → `NoteNotFound`.
- **Changes:** `src/cli.py` (`edit` subcommand and `cmd_edit` that builds a new `Note` instance preserving `id`/`created_at`), `tests/test_cli.py` (5 tests).
- **Verification:** `./init.sh` green, 22 tests pass. Reviewer APPROVED.
- **Close:** feature 6 marked `done`.

## 2026-05-13 — Feature 7: cli_recent
- **Agent:** Claude Opus 4.7 (leader) → spec_author → implementer → reviewer.
- **Plan:** execute the 8 tasks of `specs/cli_recent/tasks.md`: add `cmd_recent` and `recent` subparser in `src/cli.py`, cover R1–R7 with tests, validate traceability and `./init.sh`.
- **Changes:** `src/cli.py` (`cmd_recent` + subparser with `--limit`), `tests/test_cli.py` (5 new tests).
- **Verification:** `./init.sh` green, 27 tests pass. Reviewer APPROVED; traceability in `progress/impl_cli_recent.md`.
- **Close:** feature 7 marked `done`. Next: feature 8 (cli_count).

## 2026-05-16 — Port to harness-demo/ in everything-claude-code
- **Agent:** Claude Opus 4.7
- **Plan:** copy betta-tech/harness-sdd into `harness-demo/`, translate to English, preserve structure and semantics.
- **Changes:** entire `harness-demo/` directory created at the repo root.
- **Verification:** `./init.sh` from `harness-demo/` ends green; 27 tests pass.
- **Close:** demo ready. Feature 8 (cli_count) left `pending` so a user can run the full SDD flow themselves.
