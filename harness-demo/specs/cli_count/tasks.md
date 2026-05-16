# Tasks — cli_count

> Discrete steps in order. The `implementer` marks `[x]` upon
> completing each one. Each task references the `R<n>` it covers.

## Implementation

- [x] T1 — Add the `cmd_count(args)` function in `src/cli.py` that
  loads notes with `storage.load()`, computes `len(notes)`, prints the
  integer on stdout with `print(total)`, and returns `0`.
  Covers: R1, R2, R3, R4.

- [x] T2 — Register the `count` subparser in `build_parser()` of
  `src/cli.py` with no arguments and `set_defaults(func=cmd_count)`.
  Covers: R1.

## Tests

- [x] T3 — Add `test_count_empty_prints_zero` in `tests/test_cli.py`:
  with no prior notes (and no `.notes.json` on disk), run `count`,
  verify exit code `0`, stdout equals `"0\n"`, and the notes file is
  not created on disk. Covers: R2, R3, R4.

- [x] T4 — Add `test_count_with_several_notes` in `tests/test_cli.py`:
  add N notes (e.g. 3) via the `add` command or by writing a fixture
  through `storage.save`, capture the file's mtime/contents, run
  `count`, verify exit code `0`, stdout equals `f"{N}\n"`, and verify
  the notes file's contents are unchanged after the command runs.
  Covers: R1, R3, R4.

## Closing

- [x] T5 — Document `R<n>` ↔ test traceability in
  `progress/impl_cli_count.md` following the example in
  `docs/specs.md`.

- [x] T6 — Run `./init.sh` and verify all tests pass (including the
  new ones). Covers: final verification before review.
