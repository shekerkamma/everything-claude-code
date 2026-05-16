# Verification — How to prove the work works

> Golden rule: **the agent doesn't say "it works", it proves it**.
> Every feature ends with executable evidence, not assertions.

## Verification levels

### Level 1 — Unit tests (mandatory)

Every public function in `src/` has at least one test in `tests/` that:

1. Covers the happy path.
2. Covers at least one error path if the function can fail.

Command:
```bash
python3 -m unittest discover -s tests -v
```

### Level 2 — CLI integration test (mandatory for UI features)

Features that add commands to the CLI are verified by running the real
CLI against a temp file:

```python
import subprocess, tempfile, os
with tempfile.TemporaryDirectory() as d:
    env = {**os.environ, "NOTES_FILE": os.path.join(d, "notes.json")}
    out = subprocess.check_output(
        ["python3", "-m", "src.cli", "add", "hello", "--body", "world"],
        env=env, text=True,
    )
    assert "id=" in out
```

### Level 3 — Manual smoke test (optional but recommended)

Before closing the session, run an end-to-end flow against a temp file
in `/tmp`:

```bash
NOTES_FILE=/tmp/notes_demo.json python3 -m src.cli add "test" --body "x"
NOTES_FILE=/tmp/notes_demo.json python3 -m src.cli list
rm /tmp/notes_demo.json
```

### Level 4 — Requirements traceability (mandatory for `"sdd": true` features)

Every `R<n>` in `specs/<name>/requirements.md` must be mappable to at
least one concrete test in `tests/`. The reviewer rejects if coverage
is missing.

The implementer documents the map in `progress/impl_<name>.md`:

```markdown
## Traceability
- R1 → `test_recent_default_limit`
- R2 → `test_recent_invalid_limit`
- R3 → `test_recent_custom_limit`
```

## Anti-patterns (don't do)

- ❌ "I added the command, it should work." → missing executable test.
- ❌ A test that only verifies a function doesn't throw. → it has to
  check the concrete result.
- ❌ `mock`ing the filesystem. → use a real `tempfile.TemporaryDirectory()`.
- ❌ Marking the feature `done` without passing `./init.sh`.

## Final verification before closing

```bash
./init.sh           # must end with [OK] Environment ready
```

If `./init.sh` is red, **don't** mark anything as `done`. Note the
blocker in `progress/current.md` with `blocked` status in
`feature_list.json`.
