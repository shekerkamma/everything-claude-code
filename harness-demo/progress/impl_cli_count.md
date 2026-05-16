# Implementation report — cli_count (feature #8)

> Implementer agent output for feature 8 (`count` command). Spec lives in
> `specs/cli_count/`. The reviewer should read this file plus the spec
> before approving.

## Files touched

| File                          | Lines (approx) | Change                                                                 |
|-------------------------------|----------------|------------------------------------------------------------------------|
| `src/cli.py`                  | +7 / 0         | Added `cmd_count(args)` (new function) and registered `count` subparser in `build_parser()`. |
| `tests/test_cli.py`           | +28 / 0        | Added `test_count_empty_prints_zero` and `test_count_with_several_notes`. |
| `specs/cli_count/tasks.md`    | 6 boxes        | Marked T1–T6 as `[x]`.                                                 |

Out of scope (untouched, per `specs/cli_count/design.md`):
`src/notes.py`, `src/storage.py`, `feature_list.json`,
`progress/current.md`, `progress/history.md`.

## Implementation summary

- `cmd_count(args)` calls `storage.load()`, computes `len(notes)`, prints
  the integer with `print(total)` (adds a single newline), and returns
  `0`. Read-only: never calls `storage.save()`, so R4 is structurally
  guaranteed.
- Subparser `p_count` registered after `p_recent` with no arguments and
  `set_defaults(func=cmd_count)`. Help text matches the design doc.

## Traceability — `R<n>` → test

| Requirement | Test(s) in `tests/test_cli.py`                                  |
|-------------|------------------------------------------------------------------|
| R1 — `count` prints a single integer (the total) on stdout | `test_count_with_several_notes` (asserts `out == "3\n"`) |
| R2 — With no notes, prints exactly `0`                     | `test_count_empty_prints_zero` (asserts `out == "0\n"`)  |
| R3 — Exits with code `0`                                   | `test_count_empty_prints_zero` and `test_count_with_several_notes` (both assert `code == 0`) |
| R4 — Does not modify the notes file                        | `test_count_empty_prints_zero` (asserts file does not exist before and after) and `test_count_with_several_notes` (asserts identical bytes + mtime before/after) |

Every `R<n>` is covered by at least one concrete test. Every new test
maps back to at least one `R<n>`.

## Verification

Ran `./init.sh` from the repo root. Final block:

```
Ran 29 tests in 0.105s

OK
[OK]    All tests pass
[OK]    Environment ready. You can start working.
```

Exit code: `0`. 29 tests total — 27 prior + 2 new (`test_count_empty_prints_zero`,
`test_count_with_several_notes`).

## Notes for the reviewer

- Status of feature 8 in `feature_list.json` is left as `in_progress` —
  the implementer does not flip it to `done`; the reviewer/leader does
  after approval (per `.claude/agents/implementer.md`).
- All 6 tasks in `specs/cli_count/tasks.md` are checked `[x]`.
- No new exceptions introduced; no changes to `src/notes.py` or
  `src/storage.py`; no new dependencies.
