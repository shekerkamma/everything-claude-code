# Tasks — cli_recent

> Discrete steps in order. The `implementer` marks `[x]` upon
> completing each one. Each task references the `R<n>` it covers.

## Implementation

- [x] T1 — Add the `cmd_recent(args)` function in `src/cli.py` that:
  validates `args.limit > 0` (raising `NoteError` if not), loads notes
  with `storage.load()`, sorts them by `created_at` descending,
  applies the slice `[: args.limit]`, and prints each one with the
  format `f"{n['id']}\t{n['created_at']}\t{n['title']}"`.
  Covers: R1, R2, R3, R4, R5, R6, R7.

- [x] T2 — Register the `recent` subparser in `build_parser()` of
  `src/cli.py` with `--limit` (type=int, default=5) and
  `set_defaults(func=cmd_recent)`. Covers: R1, R2.

## Tests

- [x] T3 — Add `test_recent_default_limit_orders_by_created_at_desc` in
  `tests/test_cli.py`: create > 5 notes (by patching `Note.new` or the
  clock to produce distinct `created_at`), run `recent` without flags,
  and verify that exactly 5 lines are printed in descending order by
  `created_at`. Covers: R1, R3.

- [x] T4 — Add `test_recent_custom_limit` in `tests/test_cli.py`:
  create N notes, run `recent --limit K` with `K < N`, verify that
  exactly `K` lines are printed and that each line respects the format
  `<id>\t<created_at>\t<title>`. Covers: R2, R4.

- [x] T5 — Add `test_recent_empty_outputs_nothing` in
  `tests/test_cli.py`: with no prior notes, run `recent`, verify exit
  code `0` and empty stdout. Covers: R5.

- [x] T6 — Add `test_recent_invalid_limit_zero` and
  `test_recent_invalid_limit_negative` in `tests/test_cli.py`: with
  notes present, run `recent --limit 0` and `recent --limit -3`
  respectively; verify that exit code is `!= 0`, stdout is empty,
  stderr is non-empty, and the notes file on disk hasn't changed.
  Covers: R6, R7.

## Closing

- [x] T7 — Document `R<n>` ↔ test traceability in
  `progress/impl_cli_recent.md` following the example in
  `docs/specs.md`.

- [x] T8 — Run `./init.sh` and verify all tests pass (including the
  new ones). Covers: final verification before review.
