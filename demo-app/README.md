# Todo List Demo App

A minimal todo list built end-to-end via the spec-kit workflow
(`/speckit-constitution` → `/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement`) to validate that the workflow produces
runnable code from a natural-language prompt.

## Run

Open [`index.html`](index.html) directly in any modern browser.

```bash
xdg-open demo-app/index.html   # Linux
open demo-app/index.html       # macOS
start demo-app/index.html      # Windows
```

No install, no server, no build.

## Smoke test

Follow [`../specs/001-todo-list/quickstart.md`](../specs/001-todo-list/quickstart.md)
— a 60-second click-through that exercises every functional requirement.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Semantic markup (form, list, footer with filters + clear-completed). |
| `styles.css` | All styling. BEM-ish classes, focus rings, hover states. |
| `app.js`     | Single IIFE: state, persistence, render, event delegation. |

## Spec artifacts

- Spec: [`specs/001-todo-list/spec.md`](../specs/001-todo-list/spec.md)
- Plan: [`specs/001-todo-list/plan.md`](../specs/001-todo-list/plan.md)
- Tasks: [`specs/001-todo-list/tasks.md`](../specs/001-todo-list/tasks.md)
- Constitution: [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)
