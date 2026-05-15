# Learning Path: Matt Pocock Skills

A progressive learning path for the 15 skills integrated from [shekerkamma/skills](https://github.com/shekerkamma/skills), built from two walkthrough videos:
- [Video 1](https://www.youtube.com/watch?v=M-8lv5TXUYkr) — the core 5-skill loop
- [Video 2](https://www.youtube.com/watch?v=6BB6exR8Zd8) — why `/grill-with-docs` replaced `/grill-me`, and how `CONTEXT.md` works

> **Who this is for**: Engineers who build with AI daily and want a systematic workflow — not vibe coding, not a decade of CS theory. The skills chain together into a repeatable loop for designing, refining, and implementing features.

---

## The Most Important Concept: Ubiquitous Language

Before the skills, understand the foundational idea they're built on.

**Ubiquitous language** (from Eric Evans' *Domain-Driven Design*) means: the code, the developers, and the domain experts all use *exactly the same words* to describe the same things. When that alignment exists, you stop wasting tokens re-explaining what "standalone video" or "pitch" means every session. The AI picks up context from your `CONTEXT.md` automatically.

Without it: every session starts with 10 minutes of re-explaining non-obvious terms.  
With it: the AI already knows, and uses fewer tokens both responding *and thinking* internally.

### What `CONTEXT.md` looks like

```md
# My App

A tool for managing video content and pitches.

## Language

**Pitch**: The packaging for a video — title, description, and framing.
Created before the video itself. _Avoid_: idea, concept, proposal.

**Standalone video**: A video with lesson_id = null (not connected to a course).
_Avoid_: solo video, independent video.

## Relationships

- A **Pitch** corresponds to one or more **Standalone videos**
- A **Standalone video** may be unpitched (pitch_id = null)
```

This file compounds in value over sessions. By session 4 or 5, the AI starts completing your thoughts using your exact vocabulary before the words come out.

### What ADRs look like

`docs/adr/0001-on-delete-restrict.md`:
```md
# Restrict cascade on pitch deletion

Pitches use ON DELETE RESTRICT rather than CASCADE. Deleting a pitched
standalone video is almost always a mistake; archiving is preferred.
We chose RESTRICT so deletions require an explicit unlink first.
```

Only create an ADR when the decision is: (1) hard to reverse, (2) surprising without context, and (3) a real trade-off between alternatives. Most decisions don't qualify.

---

## The Grilling Skills: Which to Use

This is the most important decision in the whole skill library.

| Situation | Use |
|-----------|-----|
| You have a codebase | `/grill-with-docs` |
| You don't have a codebase | `/grill-me` |
| Early in a new project | `/grill-with-docs` (to *establish* the shared language) |
| Personal use, writing, non-engineering | `/grill-me` |

**Why the distinction matters:** `/grill-me` interviews you effectively but doesn't capture the vocabulary you agree on anywhere. You'll re-explain the same terms next session. `/grill-with-docs` reads your existing `CONTEXT.md`, challenges you against it, and updates it inline as new terms are resolved.

> From the creator: *"Someone used /grill-me to interview themselves about their mom while writing a eulogy. It surfaced amazing stories. /grill-me has incredible use cases outside of engineering."*

---

## The Core Loop

The five-skill workflow that covers the full arc of an AI-assisted feature cycle.

### Stage 0 — Establish shared language (do this once per project)

**Skill: `/grill-with-docs`** (first-session mode)

Even at project start, use `/grill-with-docs` rather than `/grill-me`. The first session creates your `CONTEXT.md`. Every subsequent session builds on it.

**What happens:**
1. Skill looks for `CONTEXT.md` at repo root (or `CONTEXT-MAP.md` for multi-context monorepos)
2. Surfaces any terms in your prompt that are undefined or ambiguous
3. Proposes precise canonical terms; challenges fuzzy language
4. Updates `CONTEXT.md` inline as each term is resolved
5. Offers ADRs when a decision is hard to reverse, surprising, and a real trade-off

**The compound effect:** By session 4–5, the AI "magically aligns with the thoughts I had before the words came out of my brain" — because it has read 4 sessions of resolved vocabulary.

---

### Stage 1 — Surface architectural friction

**Skill: `/improve-codebase-architecture`**

Use at the start of significant feature work, or when the codebase starts feeling tangled. Dispatches an exploration agent to find *deepening opportunities* — places where shallow, scattered modules can be consolidated into a single well-tested interface.

**Key concept:** The skill reads your `CONTEXT.md` and uses your project's domain vocabulary in its output. This is intentional — it prevents the model from using generic terms like "service" or "component" instead of your actual entities.

**What you get:** A ranked list of candidates with files, problem description, proposed solution, and benefits expressed in terms of *locality* (where change concentrates) and *leverage* (what callers get).

---

### Stage 2 — Stress-test the chosen change

**Skill: `/grill-with-docs`** (or `/grill-me` if no codebase)

Once you've picked a candidate from Stage 1, grill the design. Unlike tools that ask 3–5 top-level questions then implement, this skill keeps branching: each answer generates the next question, spiralling down every branch until every decision node is resolved.

**The tree analogy:**
```
Most tools:        grill-with-docs:
Q1                 Q1
Q2                 Q1a → Q1a-i → Q1a-i-α
Q3                 Q1b → Q1b-i
Q4                 Q2 → Q2a → Q2a-i
Q5                 ...every branch resolved
```

**What else it does during the session:**
- Challenges every term against the existing `CONTEXT.md` glossary ("your glossary defines 'cancellation' as X, but you seem to mean Y")
- Cross-references claims against the actual code ("your code cancels entire Orders, but you just said partial cancellation is possible — which is right?")
- Updates `CONTEXT.md` immediately when a term is resolved (not batched)
- Offers to create an ADR when a decision meets the three criteria

---

### Stage 3 — Reduce token cost

**Skill: `/caveman`**

Activate at the start of a long design or implementation session. Drops ~35–75% of tokens by removing articles, filler, and pleasantries — preserving exact technical language and code blocks unchanged.

**Token reality check (from video):** Same prompt — 768 tokens without caveman, 502 with (~35% cut). In a compounding long session this is significant. Also reduces tokens in the model's *thinking traces*, which you don't see but pay for.

**Auto-exits for:** Security warnings, irreversible actions, multi-step sequences where brevity risks misreading.

**Turn off with:** "stop caveman" or "normal mode".

---

### Stage 4 — Verify a premise before acting on it

**Skill: `/zoom-out`**

Use whenever a proposed change references code you don't recognise, or when you're not sure whether an issue the architecture skill flagged is actually real.

**What you get:** A mental-model map — all relevant modules, callers, what's read and written — grounded in your `CONTEXT.md` vocabulary.

**From the video:** Zoom-out revealed that a "duplicated threshold logic" was actually two different things (apply threshold vs log prior value). The initial premise was wrong. A refactor was avoided entirely.

---

### Stage 5 — Carry the decision forward

**Skill: `/handoff`**

Use when you've reached a clear decision and want to: (a) start a fresh context window for implementation, or (b) hand off to a spec-driven or implementation tool.

**What you get:** A markdown file with everything relevant — problem framing, solution chosen, key decisions resolved, specific details. References other artifacts (PRDs, diffs, ADRs, `CONTEXT.md`) by path rather than duplicating them.

**Usage:** `/handoff description of what the next session will focus on`

---

## Extended Skills

### Debug a hard bug

**Skill: `/diagnose`**

Six-phase discipline: build a feedback loop → reproduce → hypothesise (3–5 ranked, falsifiable) → instrument (one variable at a time) → fix + regression test → cleanup + post-mortem.

**The core phase is Phase 1.** Ten strategies for building a fast, deterministic pass/fail signal are listed in priority order. A HITL bash template (`scripts/hitl-loop.template.sh`) is included for bugs that require human interaction.

---

### Throwaway prototypes

**Skill: `/prototype`**

Routes based on the question being answered:
- **Logic question** ("does this state machine work?") → interactive terminal TUI, pure reducer/state-machine isolated from the UI shell
- **UI question** ("what should this look like?") → 3+ structurally different variants on one route, switchable via `?variant=` param and a floating bottom bar

Delete after the question is answered. The logic module behind a logic prototype is worth keeping; the TUI shell is not.

---

### TDD workflow

**Skill: `/tdd`**

Red-green-refactor with one critical anti-pattern called out explicitly: **no horizontal slicing** (all tests first, then all code). Forces vertical tracer bullets: one test → one implementation → repeat. Tests verify observable behavior through public interfaces only.

**Pair with:** `/grill-with-docs` (design the public interface) → `/tdd` (implement test-first).

---

### Full feature lifecycle

**Skills: `/to-prd` → `/to-issues`**

- `/to-prd`: Synthesise the current conversation into a PRD (problem, user stories, implementation decisions, testing decisions, out of scope). Publishes to the issue tracker.
- `/to-issues`: Break a PRD into vertical-slice issues — each a thin end-to-end path through all layers, independently demoable, with acceptance criteria and dependency ordering.

**Natural workflow:** Grill session → `/to-prd` → `/to-issues` → individual issues ready for implementation.

---

### Issue management

**Skill: `/triage`**

State-machine for moving issues through `needs-triage` → `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`. Includes the agent-brief format (behavioral, not procedural; durable, no file paths) and `.out-of-scope/` knowledge base for tracking rejected features.

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
Week 1 — Foundation: shared language
  Create CONTEXT.md with /grill-with-docs on your current project
  (even if it's messy — the point is to start the vocabulary file)
  Try /zoom-out on any unfamiliar area
  End session with /handoff

Week 2 — Architecture + token efficiency
  /improve-codebase-architecture  ← find one real candidate
  /grill-with-docs                ← design the change, update CONTEXT.md
  /caveman                        ← activate at the start of sessions
  Compare: 3 sessions with CONTEXT.md vs 3 sessions without

Week 3 — Full feature lifecycle
  /to-prd                         ← synthesise a grill session into a PRD
  /to-issues                      ← break it into vertical-slice issues
  /tdd                            ← implement one issue test-first
  /prototype                      ← spike the uncertain design decision

Week 4 — Debugging and ops
  /diagnose                       ← apply to the next real bug
  /triage                         ← work through your issue backlog
  /setup-pre-commit               ← harden a new project
  /git-guardrails-claude-code     ← protect against destructive ops
  /write-a-skill                  ← extend the library for your domain
```

---

## Workflow Map

```
New project or new feature
        │
        ▼ once per project (or first session)
Create / update CONTEXT.md
  via /grill-with-docs
        │
        ▼ start of significant feature work
/improve-codebase-architecture
  (reads CONTEXT.md, finds deepening candidates)
        │
        ▼ pick one candidate
/grill-with-docs
  (reads CONTEXT.md + ADRs, resolves every branch,
   updates CONTEXT.md inline, offers ADRs for hard decisions)
        │
        ▼ use throughout long sessions
/caveman   ← activate to reduce token cost
/zoom-out  ← verify a premise before accepting it
        │
        ▼ decision reached
/handoff → /to-prd → /to-issues
  (carry context forward, break into work)
        │
        ▼ implement
/tdd       (one issue at a time, tracer bullets)
/prototype (spike uncertain design questions)
        │
        ▼ if a bug surfaces
/diagnose  (build feedback loop first)
        │
        ▼ manage the queue
/triage    (state-machine for issues)
```

---

## The `grill-me` vs `grill-with-docs` Decision (summary)

| | `/grill-me` | `/grill-with-docs` |
|--|-------------|-------------------|
| Has codebase | No | Yes |
| Reads CONTEXT.md | No | Yes |
| Updates CONTEXT.md | No | Yes (inline) |
| Offers ADRs | No | Yes (sparingly) |
| Cross-references code | No | Yes |
| Best for | Personal use, writing, no-codebase brainstorming | Any engineering session |

> `/grill-me` is not dead — it's excellent for non-engineering contexts. Writing a eulogy, planning a project from scratch, thinking through any complex decision without an existing codebase. It was moved to the "productivity" bucket precisely because it has more general use cases.

---

## Globally Available (all projects)

`scaffold-exercises` is installed at `~/.claude/skills/imported/scaffold-exercises/` — available in any project. Use it when scaffolding course exercise directories for `ai-hero-cli` projects.
