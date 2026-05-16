# Requirements — cli_count

> Feature #8 from `feature_list.json`. The `count` command prints the
> total number of stored notes as a single integer.
>
> Each requirement is written in strict EARS and is verifiable by at
> least one concrete test in `tests/test_cli.py`.

## R1
WHEN the user runs `python -m src.cli count`, the system MUST print a
single line to stdout containing exactly one decimal integer: the total
number of notes currently stored.

## R2
WHEN the user runs `python -m src.cli count` and no notes are stored,
the system MUST print exactly `0` on stdout.

## R3
WHEN the user runs `python -m src.cli count`, the system MUST exit with
code `0`.

## R4
WHEN the user runs `python -m src.cli count`, the system MUST NOT
modify the notes file on disk.

## Traceability with `acceptance` from feature_list.json

| Acceptance criterion (feature #8)                                                       | Covered by   |
|-----------------------------------------------------------------------------------------|--------------|
| `python -m src.cli count` prints a single integer: the total number of notes            | R1, R3       |
| If there are no notes, prints `0`                                                       | R2, R3       |
| The command does not modify the notes file                                              | R4           |
| tests/test_cli.py covers: empty file and file with several notes                        | R1–R4 (via tests) |
