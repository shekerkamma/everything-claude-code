# Design — cli_recent

> Technical decisions for implementing the `recent` command. Relies on
> `docs/architecture.md` and `docs/conventions.md`. Only documents the
> points where the feature pushes against the edges of those rules.

## Scope and files to touch

| File                     | Change                                                                  |
|--------------------------|-------------------------------------------------------------------------|
| `src/cli.py`             | Add `cmd_recent` and register the `recent` subparser in `build_parser` |
| `tests/test_cli.py`      | Add 4 new tests (default order, custom limit, empty file, invalid limit) |

`src/notes.py` and `src/storage.py` are not touched. The feature is
purely presentation: reads notes with `storage.load()`, sorts and
filters in memory, prints with the existing format.

## Signature of the new subcommand

```python
def cmd_recent(args: argparse.Namespace) -> int:
    ...
```

Receives a `Namespace` with an attribute `limit: int` (default `5`).

Subparser registered in `build_parser()`:

```python
p_recent = sub.add_parser("recent", help="List the N most recent notes.")
p_recent.add_argument("--limit", type=int, default=5)
p_recent.set_defaults(func=cmd_recent)
```

## Algorithm

1. **Early validation of the limit.** If `args.limit <= 0`, raise
   `NoteError("--limit must be a positive integer")`. This covers R6
   and R7 (raised before `storage.load()`, so nothing is modified — and
   `cmd_recent` never calls `storage.save()`, so R7 is structurally
   guaranteed).
2. Load notes with `storage.load()`.
3. If the list is empty, return `0` without printing (covers R5).
4. Sort the list in memory by `created_at` descending:
   `sorted(notes, key=lambda n: n["created_at"], reverse=True)`.
5. Slice `[: args.limit]`.
6. For each note in the slice, print
   `f"{n['id']}\t{n['created_at']}\t{n['title']}"` (identical to
   `cmd_list`).
7. Return `0`.

## Error handling

- Reuse `NoteError` already defined in `src/notes.py`. No new
  exceptions are introduced.
- The global `main()` handler catches `NoteError`, prints to `stderr`,
  and exits with code `1`. Same pattern as `cmd_edit` when flags are
  missing.

## Output format

Identical to `cmd_list`:

```
<id>\t<created_at>\t<title>
```

The string `f"{n['id']}\t{n['created_at']}\t{n['title']}"` is
deliberately duplicated between `cmd_list` and `cmd_recent` to avoid
introducing a shared helper without justification
(`docs/architecture.md` advises against premature abstraction). If a
third command needs the same format in the future, a private
`_format_row(note: dict) -> str` will be extracted.

## Sorting: why `created_at` and not `id`

`created_at` is in ISO 8601 with `timespec="seconds"` (see
`src/notes.py::Note.new`). Lexicographic ordering of ISO 8601 matches
chronological ordering, so `sorted(..., key=lambda n: n["created_at"])`
is correct without parsing.

`id` is also monotonically increasing, but the acceptance criterion
explicitly demands "ordered by `created_at`", so we follow it
literally. (If two notes share `created_at` because they were created
in the same second, their relative order is defined by Python's
`sorted` stability — sufficient for this feature.)

## Rejected alternative

**Alternative A: use `heapq.nlargest(limit, notes, key=...)`.**
More efficient at O(n log k) vs. O(n log n) for the full `sorted`.
Rejected because:

- The expected dataset is small (personal notes in a local JSON).
- `sorted(...)[:limit]` is more readable and maintains stylistic parity
  with the rest of `cli.py`, which uses list comprehensions and simple
  `sorted`.
- `docs/architecture.md` prioritizes clarity over premature
  optimization.

## Risks / notes

- **Limit larger than total number of notes.** Python allows slicing
  past the end of a list without error; returns everything. Behavior
  accepted with no explicit requirement (not in the original
  acceptance).
- **`argparse` and negative integers.** `type=int` accepts negative
  values. The `<= 0` validation is done by `cmd_recent`, not by
  `argparse`, so we can return a message via `NoteError` (consistent
  with the rest of the CLI, which avoids argparse's automatic messages
  for domain errors).
