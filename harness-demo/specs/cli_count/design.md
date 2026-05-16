# Design — cli_count

> Technical decisions for implementing the `count` command. Relies on
> `docs/architecture.md` and `docs/conventions.md`. Only documents the
> points where the feature pushes against the edges of those rules.

## Scope and files to touch

| File                     | Change                                                                  |
|--------------------------|-------------------------------------------------------------------------|
| `src/cli.py`             | Add `cmd_count` and register the `count` subparser in `build_parser`   |
| `tests/test_cli.py`      | Add 2 new tests (empty file, file with several notes)                  |

`src/notes.py` and `src/storage.py` are not touched. The feature is
purely read-only: it loads notes with `storage.load()`, takes the
length, and prints it.

## Signature of the new subcommand

```python
def cmd_count(args: argparse.Namespace) -> int:
    ...
```

Receives a `Namespace` with no extra attributes (the `count` subcommand
takes no flags or positional arguments).

Subparser registered in `build_parser()`:

```python
p_count = sub.add_parser("count", help="Print the total number of notes.")
p_count.set_defaults(func=cmd_count)
```

## Algorithm

1. Load notes with `storage.load()`. `storage.load()` already returns
   `[]` if the notes file does not exist (feature #1 contract), so the
   empty case is handled implicitly.
2. Compute `total = len(notes)`.
3. Print `total` on stdout via `print(total)` (which appends a single
   newline). Covers R1, R2.
4. Return `0`. Covers R3.

`cmd_count` never calls `storage.save()`, so R4 (no file modification)
is structurally guaranteed.

## Error handling

This command should not fail under any expected runtime condition:

- It takes no user-supplied arguments to validate (no flags, no
  positional ids), so there is no input that can be rejected.
- `storage.load()` returns `[]` for a missing file, so an absent notes
  file is not an error.
- A corrupt notes file would raise from `storage.load()`; that error is
  outside this feature's scope and is handled the same way as in every
  other read command (it propagates up). No new exception type is
  introduced.

No new exceptions are added. `NoteError` from `src/notes.py` is not
needed here.

## Output format

A single line containing the decimal integer, followed by a newline
(the default behavior of `print`). Examples:

```
0
```

```
42
```

This is deliberately minimal — no prefix, no label — so the output is
trivially consumable by shell pipelines (`notes count | xargs ...`).

## Rejected alternative

**Alternative A: print a human-friendly message such as
`"<n> notes"` or `"total: <n>"`.**

Rejected because:

- The acceptance criterion in `feature_list.json` explicitly says
  "prints a single integer". A label would violate it literally.
- Plain-integer output composes cleanly with shell tooling (`if [ "$(notes count)" -gt 0 ]`),
  which is the natural use case for a `count` command.
- The `stats` command (feature #10) is the place for labeled,
  human-friendly aggregate output. Keeping `count` minimal preserves a
  clear separation between the two.

## Risks / notes

- **Concurrent writers.** If another process writes to the notes file
  between `storage.load()` and `print`, the reported count may be
  stale. This is true of every read command in this CLI and is out of
  scope for this feature (no concurrency model exists in the project).
- **Very large notes files.** `storage.load()` reads the entire file
  into memory; `len()` is O(1) on the resulting list. No performance
  concern at the scale this project targets (personal notes).
