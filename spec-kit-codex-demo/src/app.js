const storageKey = "specflow-control-room:v1";

const phases = [
  {
    id: "constitution",
    name: "Constitution",
    command: "$speckit-constitution",
    title: "Governance before generation",
    description:
      "The project starts by turning non-negotiable engineering standards into durable rules that every later artifact must satisfy.",
    artifactTitle: ".specify/memory/constitution.md",
    artifact: `# SpecFlow Constitution

## Core Principles

1. Specifications are source-of-truth artifacts.
2. Every user story must be independently testable.
3. Security, privacy, and accessibility gates are mandatory.
4. Implementation tasks must map back to requirements.

## Governance

Amendments require an impact note, template sync, and a dated version bump.`,
    gates: [
      ["pass", "Principles are testable", "Each rule uses enforceable MUST language."],
      ["pass", "Templates synced", "Plan and task templates include constitution checks."],
      ["warn", "Review cadence", "Monthly governance review needs an owner."]
    ]
  },
  {
    id: "specify",
    name: "Specify",
    command: "$speckit-specify",
    title: "Intent becomes a structured feature spec",
    description:
      "The agent captures what to build and why, with user journeys, measurable outcomes, assumptions, and bounded scope.",
    artifactTitle: "specs/001-specflow-control-room/spec.md",
    artifact: `# Feature Specification: SpecFlow Control Room

## User Stories

US1: As a developer, I can inspect the active Spec Kit stage and artifact.
US2: As a lead, I can review readiness gates before implementation starts.
US3: As a maintainer, I can preview tasks as GitHub issues.

## Functional Requirements

FR-001: Show all workflow stages in order.
FR-002: Persist task completion locally.
FR-003: Surface quality gates and analysis findings.
FR-004: Provide a local development path without external services.

## Success Criteria

SC-001: A first-time user understands the pipeline in under 3 minutes.
SC-002: The app runs locally with a single command.`,
    gates: [
      ["pass", "No stack leakage", "The spec stays focused on outcomes."],
      ["pass", "User stories present", "Primary, reviewer, and maintainer flows exist."],
      ["pass", "Success is measurable", "Time-to-understand and local run criteria are explicit."]
    ]
  },
  {
    id: "clarify",
    name: "Clarify",
    command: "$speckit-clarify",
    title: "Ambiguity gets resolved before planning",
    description:
      "Clarification asks only high-impact questions. Answers are written back into the spec so future phases inherit the decision.",
    artifactTitle: "Clarifications",
    artifact: `## Clarifications

### Session 2026-05-16

- Q: Should the demo require a backend?
  A: No, local browser runtime only.

- Q: What should persistence cover?
  A: Task completion and active stage.

- Q: Is GitHub issue creation live?
  A: Preview only for local demo safety.`,
    gates: [
      ["pass", "Backend scope resolved", "No server dependency is required."],
      ["pass", "Persistence boundary set", "Only user-visible demo state is stored."],
      ["pass", "External side effects avoided", "Issues are previewed, not created."]
    ]
  },
  {
    id: "plan",
    name: "Plan",
    command: "$speckit-plan",
    title: "Technical plan translates the spec into a build shape",
    description:
      "Planning chooses a conservative static web app architecture, defines the data model, and records tradeoffs for future review.",
    artifactTitle: "plan.md",
    artifact: `# Implementation Plan

## Technical Context

Runtime: Browser + static file server
Language: HTML, CSS, JavaScript
Persistence: localStorage
Dependencies: none

## Architecture

index.html loads src/styles.css and src/app.js.
State updates are immutable and persisted after each interaction.

## Constitution Check

PASS: Requirement traceability is represented in tasks and gates.
PASS: No credentials or network side effects are required.`,
    gates: [
      ["pass", "Local-first architecture", "Runs without installing packages."],
      ["pass", "Security posture", "No secrets, auth, or remote writes."],
      ["pass", "Maintenance fit", "Small files and direct browser APIs."]
    ]
  },
  {
    id: "tasks",
    name: "Tasks",
    command: "$speckit-tasks",
    title: "Plan becomes an executable queue",
    description:
      "Tasks are dependency ordered, independently useful, and tagged by user story so implementation can move in small verified increments.",
    artifactTitle: "tasks.md",
    artifact: `# Tasks: SpecFlow Control Room

- [X] T001 Create static application shell in index.html
- [X] T002 [P] Add responsive visual system in src/styles.css
- [X] T003 [US1] Render workflow stage navigation
- [ ] T004 [US1] Add artifact inspection panel
- [ ] T005 [US2] Add quality gate summary
- [ ] T006 [US2] Persist readiness state locally
- [ ] T007 [US3] Render GitHub issue preview payloads
- [ ] T008 Run local smoke test`,
    gates: [
      ["pass", "Task format valid", "Every task uses checkbox + ID + path or clear action."],
      ["pass", "MVP identified", "US1 can be delivered before issue preview."],
      ["warn", "Parallelism limited", "Most tasks touch shared app state."]
    ]
  },
  {
    id: "analyze",
    name: "Analyze",
    command: "$speckit-analyze",
    title: "Consistency check before code runs",
    description:
      "Analysis compares requirements, plan, and tasks to catch missed coverage, contradictions, and implementation drift early.",
    artifactTitle: "Specification Analysis Report",
    artifact: `| ID | Category | Severity | Summary | Recommendation |
|----|----------|----------|---------|----------------|
| C1 | Coverage | LOW | FR-003 needs visible findings panel | Covered by T005 |
| A1 | Ambiguity | LOW | "understands pipeline" needs demo copy quality | Keep concise labels |
| T1 | Traceability | PASS | Tasks map to US1-US3 | Proceed |

Coverage: 100%
Critical Issues: 0
Recommendation: Proceed to implementation.`,
    gates: [
      ["pass", "Requirement coverage", "All functional requirements have tasks."],
      ["pass", "No critical conflicts", "Plan and spec agree on local-only scope."],
      ["pass", "Implementation ready", "Remaining findings are low risk."]
    ]
  },
  {
    id: "implement",
    name: "Implement",
    command: "$speckit-implement",
    title: "Tasks execute with visible progress",
    description:
      "Implementation follows the task file, checks gates, updates task status, and verifies the result against the spec.",
    artifactTitle: "Implementation Log",
    artifact: `Completed:
- T001 application shell
- T002 visual system
- T003 workflow navigation

In progress:
- T004 artifact inspection panel
- T005 quality gate summary

Validation:
- Local server responds
- No package install required
- State persists across refresh`,
    gates: [
      ["pass", "Checklists clear", "No incomplete blocking checklist items."],
      ["pass", "Tasks tracked", "Completion state is visible in the board."],
      ["warn", "Manual review", "Run the demo in a browser before presenting."]
    ]
  }
];

const baseTasks = [
  { id: "T001", story: "Setup", text: "Create static application shell in index.html", done: true },
  { id: "T002", story: "Setup", text: "Add responsive visual system in src/styles.css", done: true },
  { id: "T003", story: "US1", text: "Render workflow stage navigation in src/app.js", done: true },
  { id: "T004", story: "US1", text: "Add artifact inspection panel in src/app.js", done: false },
  { id: "T005", story: "US2", text: "Add quality gate summary in src/app.js", done: false },
  { id: "T006", story: "US2", text: "Persist readiness state with localStorage", done: false },
  { id: "T007", story: "US3", text: "Render GitHub issue preview payloads", done: false },
  { id: "T008", story: "Polish", text: "Run local smoke test and fix layout issues", done: false }
];

const findings = [
  {
    severity: "low",
    title: "FR-003 coverage verified",
    text: "Quality gates and analysis findings are both represented in the first viewport."
  },
  {
    severity: "high",
    title: "Issue creation is intentionally preview-only",
    text: "The local demo avoids GitHub writes unless the real Spec Kit taskstoissues skill is invoked."
  },
  {
    severity: "low",
    title: "No dependency risk",
    text: "The app uses browser APIs only, keeping local setup predictable."
  }
];

const loadState = () => {
  const fallback = { activePhase: "constitution", filter: "all", tasks: baseTasks };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved ? { ...fallback, ...saved } : fallback;
  } catch {
    return fallback;
  }
};

let state = loadState();

const saveState = (nextState) => {
  localStorage.setItem(storageKey, JSON.stringify(nextState));
  state = nextState;
  render();
};

const phaseById = (id) => phases.find((phase) => phase.id === id) || phases[0];

const renderNav = () => {
  const nav = document.querySelector("#phase-nav");
  nav.innerHTML = phases
    .map((phase, index) => {
      const active = phase.id === state.activePhase ? " active" : "";
      return `<button class="phase-button${active}" data-phase="${phase.id}" type="button">
        <span class="phase-index">${index + 1}</span>
        <span>
          <span class="phase-name">${phase.name}</span>
          <span class="phase-command">${phase.command}</span>
        </span>
      </button>`;
    })
    .join("");
};

const renderStage = () => {
  const phase = phaseById(state.activePhase);
  const index = phases.findIndex((item) => item.id === phase.id);
  const progress = Math.round(((index + 1) / phases.length) * 100);
  document.querySelector("#stage-command").textContent = phase.command;
  document.querySelector("#stage-title").textContent = phase.title;
  document.querySelector("#stage-description").textContent = phase.description;
  document.querySelector("#stage-progress").textContent = `${progress}%`;
  document.querySelector(".meter-ring").style.setProperty("--progress", `${progress * 3.6}deg`);
  document.querySelector("#artifact-title").textContent = phase.artifactTitle;
  document.querySelector("#artifact-body").textContent = phase.artifact;
};

const renderGates = () => {
  const phase = phaseById(state.activePhase);
  document.querySelector("#gate-list").innerHTML = phase.gates
    .map(([status, title, text]) => `<article class="gate ${status}">
      <span class="gate-status">${status === "pass" ? "✓" : status === "warn" ? "!" : "×"}</span>
      <div>
        <strong>${title}</strong>
        <p>${text}</p>
      </div>
    </article>`)
    .join("");
};

const renderTasks = () => {
  const tasks = state.tasks.filter((task) => {
    if (state.filter === "open") return !task.done;
    if (state.filter === "done") return task.done;
    return true;
  });

  document.querySelector("#task-board").innerHTML = tasks
    .map((task) => `<label class="task">
      <input type="checkbox" data-task="${task.id}" ${task.done ? "checked" : ""}>
      <span>
        <span class="task-id">${task.id}</span>
        <p>${task.text}</p>
      </span>
      <span class="task-chip">${task.story}</span>
    </label>`)
    .join("");

  document.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
};

const renderFindings = () => {
  document.querySelector("#findings").innerHTML = findings
    .map((finding) => `<article class="finding ${finding.severity}">
      <strong>${finding.title}</strong>
      <p>${finding.text}</p>
    </article>`)
    .join("");
};

const renderScores = () => {
  const completed = state.tasks.filter((task) => task.done).length;
  const coverage = Math.round((completed / state.tasks.length) * 100);
  const openRisks = phaseById(state.activePhase).gates.filter(([status]) => status !== "pass").length;
  document.querySelector("#coverage-score").textContent = `${coverage}%`;
  document.querySelector("#risk-score").textContent = String(openRisks);
  document.querySelector("#done-score").textContent = `${completed}/${state.tasks.length}`;
};

const render = () => {
  renderNav();
  renderStage();
  renderGates();
  renderTasks();
  renderFindings();
  renderScores();
};

document.addEventListener("click", (event) => {
  const phaseButton = event.target.closest("[data-phase]");
  if (phaseButton) {
    saveState({ ...state, activePhase: phaseButton.dataset.phase });
  }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    saveState({ ...state, filter: filterButton.dataset.filter });
  }

  if (event.target.closest("#advance-phase")) {
    const currentIndex = phases.findIndex((phase) => phase.id === state.activePhase);
    const nextPhase = phases[(currentIndex + 1) % phases.length];
    saveState({ ...state, activePhase: nextPhase.id });
  }

  if (event.target.closest("#reset-demo")) {
    localStorage.removeItem(storageKey);
    state = loadState();
    render();
  }
});

document.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-task]");
  if (!checkbox) return;

  const nextTasks = state.tasks.map((task) =>
    task.id === checkbox.dataset.task ? { ...task, done: checkbox.checked } : task
  );
  saveState({ ...state, tasks: nextTasks });
});

render();
