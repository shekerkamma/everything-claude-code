#!/usr/bin/env bash
# init.sh — Environment verification and initialization
#
# The agent runs this at the START of a session and before declaring any
# task as `done`. If it fails, the session must not advance.
#
# Expected output: clear exit codes and blocks tagged [OK]/[FAIL].

set -u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "── 1. Verifying environment ───────────────────────────"

# Python available
if ! command -v python3 >/dev/null 2>&1; then
  fail "python3 is not installed"
  exit 1
fi
ok "python3 -> $(python3 --version)"

# Minimum version 3.9 (dataclasses + modern typing)
PY_VERSION_OK=$(python3 -c 'import sys; print(int(sys.version_info >= (3, 9)))')
if [ "$PY_VERSION_OK" != "1" ]; then
  fail "Python >= 3.9 is required"
  exit 1
fi
ok "Python version is compatible"

echo ""
echo "── 2. Verifying harness base files ────────────────────"

for f in AGENTS.md feature_list.json progress/current.md docs/architecture.md docs/conventions.md docs/verification.md CHECKPOINTS.md; do
  if [ ! -f "$f" ]; then
    fail "Missing base file: $f"
    EXIT_CODE=1
  else
    ok "Exists $f"
  fi
done

echo ""
echo "── 3. Validating feature_list.json and specs ──────────"

python3 - <<'PY'
import json, os, sys
try:
    data = json.load(open("feature_list.json"))
    valid = {"pending", "spec_ready", "in_progress", "done", "blocked"}
    in_progress = [f for f in data["features"] if f["status"] == "in_progress"]
    if len(in_progress) > 1:
        print(f"[FAIL]  {len(in_progress)} features are in_progress (max 1)")
        sys.exit(1)
    requires_spec = {"spec_ready", "in_progress", "done"}
    spec_errors = []
    for f in data["features"]:
        if f["status"] not in valid:
            print(f"[FAIL]  Invalid status on feature {f['id']}: {f['status']}")
            sys.exit(1)
        if f.get("sdd") and f["status"] in requires_spec:
            spec_dir = os.path.join("specs", f["name"])
            for fname in ("requirements.md", "design.md", "tasks.md"):
                if not os.path.isfile(os.path.join(spec_dir, fname)):
                    spec_errors.append(
                        f"feature {f['id']} ({f['name']}) in {f['status']} "
                        f"missing {spec_dir}/{fname}"
                    )
    if spec_errors:
        for e in spec_errors:
            print(f"[FAIL]  {e}")
        sys.exit(1)
    print(f"[OK]    feature_list.json valid ({len(data['features'])} features)")
    print(f"[OK]    Specs present for sdd features in non-pending state")
except SystemExit:
    raise
except Exception as e:
    print(f"[FAIL]  feature_list.json or specs invalid: {e}")
    sys.exit(1)
PY

if [ $? -ne 0 ]; then EXIT_CODE=1; fi

echo ""
echo "── 4. Running tests ────────────────────────────────────"

if [ -d "tests" ]; then
  if python3 -m unittest discover -s tests -v 2>&1; then
    ok "All tests pass"
  else
    fail "There are failing tests"
    EXIT_CODE=1
  fi
else
  warn "tests/ folder does not exist yet"
fi

echo ""
echo "── 5. Summary ──────────────────────────────────────────"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Environment ready. You can start working."
else
  fail "Environment NOT ready. Resolve errors before advancing."
fi

exit $EXIT_CODE
