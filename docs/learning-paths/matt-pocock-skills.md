# Learning Path: Matt Pocock Skills

A progressive learning path for the 15 skills integrated from [shekerkamma/skills](https://github.com/shekerkamma/skills), ordered by the workflow shown in [Matt Pocock's walkthrough video](https://www.youtube.com/watch?v=M-8lv5TXUYkr).

> **Who this is for**: Engineers who build with AI daily and want a systematic workflow — not vibe coding, not a decade of CS theory. The skills chain together into a repeatable loop for designing, refining, and implementing features.

---

## The Core Loop (start here)

The video demonstrates a 5-skill loop that covers the full arc of an AI-assisted feature cycle. Learn these five first.

### Stage 1 — Surface architectural friction

**Skill: `/improve-codebase-architecture`**

Use at the start of any significant feature work, or whenever the codebase starts feeling tangled. It dispatches an exploration agent to find *deepening opportunities* — places where shallow, scattered modules can be consolidated into a single well-tested interface.

**What you get:** A ranked list of candidates with files, problem description, proposed solution, and benefits expressed in terms of *locality* (where change concentrates) and *leverage* (what callers get).

**When to use it:** Before writing new features; after a period of rapid iteration; when tests are becoming brittle.

**Key concept:** The skill uses your project's domain vocabulary (from `CONTEXT.md` if present). This is intentional — it prevents the model from using generic terms like "service" or "component" instead of your actual entities.

---

### Stage 2 — Stress-test the chosen change

**Skill: `/grill-me`**

Once you've picked a candidate from Stage 1, run `/grill-me` to walk the full design tree. Unlike tools that ask 3–5 top-level questions and then go implement, this skill keeps branching: each answer generates the next question, spiralling down until every decision node in the design tree is resolved.

**What you get:** A complete design where every hidden assumption has been made explicit — before any code is written.

**When to use it:** After picking a deepening candidate; when you're about to make an architectural change; when a plan feels "mostly right" but you want to stress-test it.

**The tree analogy (from the video):**
```
Most tools:        grill-me:
Q1                 Q1
Q2                 Q1a → Q1a-i → Q1a-i-α
Q3                 Q1b → Q1b-i
Q4                 Q2 → Q2a → Q2a-i
Q5                 ...every branch resolved
```

---

### Stage 3 — Reduce token cost

**Skill: `/caveman`**

Activate after Stage 2 when you're going into a long implementation session. Drops ~30–75% of tokens by removing articles, filler, and pleasantries while preserving exact technical language.

**What you get:** Terse, accurate responses. Code blocks and error messages are unchanged.

**Auto-exits for:** Security warnings, irreversible actions, multi-step sequences where brevity risks misreading, or when you ask it to explain something fully.

**Turn off with:** "stop caveman" or "normal mode".

**Token reality check (from video):** Same prompt, same question — 768 tokens without caveman, 502 with. That's a ~35% cut. In a long session with compounding context, this compounds significantly.

---

### Stage 4 — Understand unfamiliar code

**Skill: `/zoom-out`**

Use whenever a proposed change references code you don't recognise, or when you're not sure whether an issue the architecture skill surfaced is actually real. It maps all relevant modules, their callers, and what they read/write — grounded in your project's domain vocabulary.

**What you get:** A mental-model map of the area, not a code dump. Explains *where a claim sits* in the context of the full system.

**Typical flow:** Architecture skill flags an issue → grill-me produces a design → zoom-out lets you verify the premise before accepting the design.

**From the video:** Zoom-out revealed that the "duplicated threshold logic" flagged in Stage 1 was actually two different things (apply threshold vs log prior value) — the initial premise was wrong. Saved a refactor that wasn't needed.

---

### Stage 5 — Carry the decision forward

**Skill: `/handoff`**

Use when you've reached a clear decision and want to either (a) start a fresh context window for implementation, or (b) hand off to a different tool (spec-driven dev, a separate planning session, etc.).

**What you get:** A markdown file with everything relevant from the session — problem framing, solution chosen, key decisions, specific details resolved. References other artifacts (PRDs, diffs, ADRs) by path instead of duplicating them.

**Two main use cases:**
1. **Planning → implementation**: Distill the design conversation into a brief for the next session.
2. **Context isolation**: Go down a tangent in a separate window without polluting the main session's context.

**Usage:** `/handoff what the next session will focus on`

---

## Extended Skills (learn next)

These skills extend the core loop for specific situations.

### Design grilling with live documentation

**Skill: `/grill-with-docs`**

Like `/grill-me` but domain-aware. Challenges your plan against `CONTEXT.md` (domain glossary) and `docs/adr/` (architecture decisions), updating both files inline as decisions crystallise. Use when the project already has a glossary or ADRs — the grilling happens *against that existing context*.

**Pair with:** `/improve-codebase-architecture` (which references the same docs).

---

### Debug a hard bug

**Skill: `/diagnose`**

Six-phase debugging discipline: build a feedback loop → reproduce → hypothesise (3–5 ranked) → instrument (one variable at a time) → fix + regression test → cleanup + post-mortem.

**The core idea:** "Build a feedback loop" is Phase 1 and the most important phase. Ten strategies for constructing a fast, deterministic pass/fail signal are listed in priority order, including a HITL bash template (`scripts/hitl-loop.template.sh`) for bugs that require human clicks.

**Activates:** When user says "diagnose this", "debug this", reports a bug, or describes a performance regression.

---

### Throwaway prototypes

**Skill: `/prototype`**

Routes to one of two sub-skills depending on the question:
- **Logic question** ("does this state machine work?") → interactive terminal TUI that lets you drive state by hand
- **UI question** ("what should this look like?") → 3+ radically different variants on one route, switchable via `?variant=` URL param and a floating bottom bar

Use before committing to an implementation. Delete after the question is answered.

---

### TDD workflow

**Skill: `/tdd`**

Red-green-refactor with one critical anti-pattern called out explicitly: **no horizontal slicing** (writing all tests first, then all code). Forces vertical tracer bullets: one test → one implementation → repeat. Tests verify observable behavior through public interfaces only.

**Pair with:** `/grill-me` (design the interface first) → `/tdd` (implement it test-first).

---

### Break work into issues

**Skill: `/to-issues`** and **`/to-prd`**

- `/to-prd`: Synthesise the current conversation into a PRD and publish it to the issue tracker.
- `/to-issues`: Break a PRD/plan into independently-grabbable vertical-slice issues, each with acceptance criteria and dependency ordering.

**Natural workflow:** Grill-me session → `/to-prd` → `/to-issues` → individual issues for AFK agents.

---

### Triage and issue management

**Skill: `/triage`**

State-machine for moving issues through: `needs-triage` → `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`. Includes:
- Agent-brief format for `ready-for-agent` issues (behavioral, not procedural; durable, not file-path-based)
- `.out-of-scope/` knowledge base for tracking rejected features so they don't get re-suggested

---

### Setup skills (one-time)

| Skill | When |
|-------|------|
| `/setup-pre-commit` | New JS/TS project — Husky + lint-staged + Prettier |
| `/git-guardrails-claude-code` | Block destructive git ops from Claude (push, reset --hard, etc.) |
| `/write-a-skill` | When you want to add a custom skill to this library |

---

## Recommended Learning Order

```
Week 1 — Core loop on a real project
  /improve-codebase-architecture  ← find one thing to fix
  /grill-me                       ← design the fix
  /zoom-out                       ← verify the premise
  /handoff                        ← pass to implementation

Week 2 — Reduce cost, extend reach
  /caveman                        ← activate at session start
  /grill-with-docs                ← add domain-awareness to grilling
  /diagnose                       ← use on the next real bug

Week 3 — Full feature lifecycle
  /to-prd                         ← synthesise decisions into a PRD
  /to-issues                      ← break PRD into grabbable issues
  /tdd                            ← implement one issue test-first
  /prototype                      ← spike the uncertain parts first

Week 4 — Ops and setup
  /triage                         ← manage your issue backlog
  /setup-pre-commit               ← harden a new project
  /git-guardrails-claude-code     ← protect against destructive ops
  /write-a-skill                  ← extend the library for your domain
```

---

## Workflow Map

```
New feature or refactor
        │
        ▼
/improve-codebase-architecture
  (find deepening opportunities)
        │
        ▼ pick one candidate
/grill-me  (or /grill-with-docs if CONTEXT.md exists)
  (resolve every design decision)
        │
        ▼ use throughout
/caveman   ← activate to reduce token cost
/zoom-out  ← use when premise needs verification
        │
        ▼ decision reached
/handoff → /to-prd → /to-issues
  (carry context forward, break into work)
        │
        ▼ implement
/tdd  (one issue at a time, tracer bullets)
/prototype  (spike uncertain parts)
        │
        ▼ if a bug surfaces
/diagnose  (build feedback loop first)
        │
        ▼ manage the queue
/triage  (state-machine for issues)
```

---

## Globally Available (all projects)

`scaffold-exercises` is installed at `~/.claude/skills/imported/scaffold-exercises/` — available in any project. Use it when scaffolding course exercise directories for `ai-hero-cli` projects.
