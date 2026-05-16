# Requirements — cli_recent

> Feature #7 from `feature_list.json`. The `recent` command lists the N
> most recent notes ordered by `created_at` descending.
>
> Each requirement is written in strict EARS and is verifiable by at
> least one concrete test in `tests/test_cli.py`.

## R1
WHEN the user runs `python -m src.cli recent` without passing `--limit`,
the system MUST print at most 5 notes on stdout.

## R2
WHEN the user runs `python -m src.cli recent --limit <N>` with an
integer `N > 0`, the system MUST print at most `N` notes on stdout.

## R3
WHEN the `recent` command prints notes, the system MUST order them by
the `created_at` field from most recent to oldest.

## R4
WHEN the `recent` command prints a note, the system MUST emit a single
line with the format `<id>\t<created_at>\t<title>` (the same three
fields and the same tab separator as the `list` command).

## R5
WHEN the user runs `python -m src.cli recent` and no notes are stored,
the system MUST exit with code `0` without writing anything to stdout.

## R6
IF the user runs `python -m src.cli recent --limit <N>` with `N <= 0`
THEN the system MUST exit with a non-zero exit code and write an error
message to stderr.

## R7
IF the user runs `python -m src.cli recent --limit <N>` with `N <= 0`
THEN the system MUST NOT modify the notes file.

## Traceability with `acceptance` from feature_list.json

| Acceptance criterion (feature #7)                                                       | Covered by   |
|-----------------------------------------------------------------------------------------|--------------|
| `python -m src.cli recent` lists the 5 most recent notes by default                     | R1, R3       |
| `python -m src.cli recent --limit 10` lets you change the number                        | R2           |
| Order is by `created_at` from most recent to oldest                                     | R3           |
| Each line follows the format `<id>\t<created_at>\t<title>` (same as `list`)             | R4           |
| If there are no notes, exit code 0 and prints nothing (consistent with `list`)          | R5           |
| If `--limit` is <= 0, exit code != 0 and a clear message on stderr                      | R6, R7       |
| Tests cover default order, custom limit, empty file, invalid limit                      | R1–R7 (via tests) |
