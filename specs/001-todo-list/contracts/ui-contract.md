# UI Contract: Todo List Demo App

The app exposes no programmatic API. Its "contract" is the keyboard/mouse
surface and the ARIA semantics it commits to.

## DOM contract

| Selector | Element | Purpose |
|----------|---------|---------|
| `.todo-app` | `<main>` | App root. |
| `.todo-form` | `<form>` | Add-todo form. Submit handler intercepts Enter + Add button. |
| `.todo-form__input` | `<input type="text">` | New-todo text. `aria-label="New todo"`. |
| `.todo-form__submit` | `<button type="submit">` | Add button. Visible label "Add". |
| `.todo-list` | `<ul>` | Container for items. |
| `.todo-item` | `<li>` | One item. Has `data-id="<uuid>"`. |
| `.todo-item__checkbox` | `<input type="checkbox">` | Completion toggle. `aria-label` = todo text. |
| `.todo-item__text` | `<span>` | Visible text. Gets `.todo-item__text--completed` when checked. |
| `.todo-item__delete` | `<button>` | Delete (×). `aria-label="Delete: <todo text>"`. |
| `.todo-footer` | `<footer>` | Hidden when list is empty. |
| `.todo-footer__count` | `<span>` | "N items left". `aria-live="polite"`. |
| `.todo-footer__filters` | `<div role="group" aria-label="Filter todos">` | Filter button group. |
| `.todo-footer__filter` | `<button>` × 3 | All / Active / Completed. The current one has `aria-pressed="true"`. |
| `.todo-footer__clear` | `<button>` | Clear completed. Hidden when no completed todos exist. |

## Keyboard contract

| Action | Key | Where focus must be |
|--------|-----|---------------------|
| Add todo | `Enter` | New-todo input |
| Submit Add button | `Enter` or `Space` | Add button |
| Toggle completion | `Space` | Item checkbox |
| Delete item | `Enter` or `Space` | Item delete button |
| Switch filter | `Enter` or `Space` | Filter button |
| Clear completed | `Enter` or `Space` | Clear-completed button |
| Move focus forward | `Tab` | (any) — order: input → submit → first item checkbox → first item delete → next item … → filters → clear |
| Move focus back | `Shift+Tab` | (any) |

Every focusable element MUST display a visible focus ring (per FR-012). The
form MUST NOT trap focus.

## Persistence contract

- Storage key: `speckit-todo-list:v1`
- Value: `JSON.stringify(Todo[])` (see `data-model.md` for shape)
- Filter state is NOT persisted.
- Read failure (corrupt or unparseable) is silently treated as empty list.
- Write failure (quota / disabled) is logged to console; in-memory state is
  authoritative for the rest of the session.

## Visible-state mapping (for smoke tests)

| Spec FR | Visible signal |
|---------|----------------|
| FR-001 | Item appears in `<ul>` after Enter or Add click |
| FR-002 | No item appears, no error shown |
| FR-004 | `.todo-item__text--completed` class applied (CSS strikethrough) |
| FR-007 | `.todo-footer__count` text equals "N items left" / "1 item left" |
| FR-008 | Selected filter button has `aria-pressed="true"` and a visual indicator |
| FR-009 | `.todo-footer__clear` is `hidden` (or `display: none`) when no completed |
| FR-014 | `.todo-footer` is `hidden` when list is empty |
