# Review — feature 8 (cli_count)

**Verdict:** APPROVED

## Requirements ↔ tests traceability

- R1: [x] covered by `test_count_with_several_notes`
  (`tests/test_cli.py:236-252`, asserts `out == "3\n"` after three `add`
  calls — a single decimal integer printed on stdout).
- R2: [x] covered by `test_count_empty_prints_zero`
  (`tests/test_cli.py:228-234`, asserts `out == "0\n"` when no notes
  file exists).
- R3: [x] covered by both `test_count_empty_prints_zero`
  (`tests/test_cli.py:231`, `assertEqual(code, 0)`) and
  `test_count_with_several_notes` (`tests/test_cli.py:245`,
  `assertEqual(code, 0)`).
- R4: [x] covered by `test_count_empty_prints_zero`
  (`tests/test_cli.py:229, 234`, asserts the notes file does not exist
  before and after the command) and `test_count_with_several_notes`
  (`tests/test_cli.py:241-243, 250-252`, captures bytes and mtime
  before the command and asserts identical bytes and identical mtime
  after).

## Tasks complete

- T1: [x]  (`specs/cli_count/tasks.md:8-10` checked; `cmd_count` lives at
  `src/cli.py:71-75`)
- T2: [x]  (`specs/cli_count/tasks.md:12-14` checked; `p_count`
  registered at `src/cli.py:131-132` with `set_defaults(func=cmd_count)`)
- T3: [x]  (`specs/cli_count/tasks.md:19-22` checked; test at
  `tests/test_cli.py:228-234`)
- T4: [x]  (`specs/cli_count/tasks.md:24-29` checked; test at
  `tests/test_cli.py:236-252`)
- T5: [x]  (`specs/cli_count/tasks.md:33-35` checked; traceability table
  written to `progress/impl_cli_count.md:28-35`)
- T6: [x]  (`specs/cli_count/tasks.md:37-38` checked; reviewer re-ran
  `./init.sh`, exit code 0, 29 tests OK)

## Checkpoints

- C1: [x]  (`AGENTS.md`, `init.sh`, `feature_list.json`,
  `progress/current.md`, `docs/architecture.md`, `docs/conventions.md`,
  `docs/verification.md` all present; `./init.sh` exits 0.)
- C2: [x]  (Only feature 8 is `in_progress`; previously `done`
  features still green under `./init.sh`; `progress/current.md`
  describes the active session.)
- C3: [x]  (`src/` contains only `cli.py`, `notes.py`, `storage.py`,
  plus `__init__.py`; no `requirements.txt` added; no stray
  `print()` debug or undocumented TODO in the diff.)
- C4: [x]  (One test file per `src/` module; new tests use the
  existing `TemporaryDirectory` setUp; `python3 -m unittest discover`
  reports 29 tests, all green.)
- C5: [x]  (No `*.tmp` or stray `__pycache__` outside `.gitignore`;
  `progress/history.md` carries the prior-session entry; feature 8
  remains `in_progress` pending leader's flip to `done` after this
  approval, which matches `.claude/agents/implementer.md`.)
- C6: [x]  (`specs/cli_count/` contains `requirements.md`,
  `design.md`, `tasks.md`; requirements are strict EARS — every R<n>
  uses `MUST` / `MUST NOT`; every R<n> mapped to at least one
  concrete test as shown above; all tasks `[x]`.)

## Scope check

Files changed by the implementer:

- `src/cli.py` (additions only: `cmd_count` at lines 71-75 and
  `p_count` subparser at lines 131-132).
- `tests/test_cli.py` (two new tests, lines 228-252).
- `specs/cli_count/tasks.md` (T1–T6 flipped to `[x]`).
- `progress/impl_cli_count.md` (new).

`src/notes.py` and `src/storage.py` are untouched (verified with
`git diff --stat HEAD -- src/notes.py src/storage.py` → empty). No
architectural violation.

## Conventions spot-check

- Double-quoted strings throughout the new code
  (`src/cli.py:74, 131`; `tests/test_cli.py:230, 232, 246`). [x]
- `snake_case` names (`cmd_count`, `p_count`,
  `test_count_empty_prints_zero`,
  `test_count_with_several_notes`). [x]
- No soft comments in `cmd_count` or in the new tests. [x]
- Error handling: `cmd_count` cannot fail under expected runtime
  conditions (no user input to validate, `storage.load()` returns
  `[]` for a missing file). Matches the design doc's "no new
  exceptions" decision and is consistent with the rest of
  `src/cli.py`. [x]
- Max line length respected; PEP 8 spacing matches surrounding
  functions. [x]

## Required changes (if any)

None. Approved.
