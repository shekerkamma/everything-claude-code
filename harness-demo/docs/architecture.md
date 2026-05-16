# Architecture — What "good work" means

> This document defines the quality bar. Reviewer agents evaluate code
> against this file. If it isn't here, it isn't a requirement.

## Principles

1. **Clear layers.** The project has three layers and only three:
   - `storage.py` — persistence (JSON on disk).
   - `notes.py` — domain model (`Note`).
   - `cli.py` — user interface (argparse).
   Do not introduce additional layers (services, repositories, ORMs)
   until there's a concrete reason documented in `feature_list.json`.

2. **No external dependencies.** Python stdlib only. If a feature
   requires a dependency, it's discussed first (status `blocked`).

3. **Explicit errors.** Functions that can fail (missing id, corrupt
   file) raise named exceptions, not `None`.

4. **Immutability by default.** `Note` is a `@dataclass(frozen=True)`.
   Modifying = creating a new instance.

5. **Atomicity on disk.** Every write to `notes.json` goes first to a
   temp file then `os.replace()`. Never leave the file half-written.

## Data flow

```
user  ─→  cli.py (argparse)
              │
              ├─ builds Note with notes.Note.new(...)
              │
              └─→  storage.load() / storage.save()
                       │
                       └─→  .notes.json (in CWD)
```

## What NOT to do

- Don't use `print()` for errors. Use `sys.stderr` and exit code != 0.
- Don't mix IO with domain logic inside `notes.py`.
- Don't read/write the file in every iteration of a loop. Load at
  startup, modify in memory, save at the end.
- Don't add a configuration system. The file path is passed explicitly
  or uses the default constant.
