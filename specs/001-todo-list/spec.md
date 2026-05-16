# Feature Specification: Todo List Demo App

**Feature Branch**: `001-todo-list`

**Created**: 2026-05-16

**Status**: Draft

**Input**: User description: "Build a single-page todo list web app. Users can add a new todo by typing in an input box and pressing Enter or clicking an 'Add' button. Each todo displays its text with a checkbox to mark it complete (strikethrough when checked) and a delete button (×) to remove it. A footer shows 'N items left' (count of unchecked todos) and three filter buttons: All, Active, Completed — clicking a filter shows only matching todos. A 'Clear completed' button removes all checked todos when at least one is checked. Todos persist in localStorage across page reloads. Empty input cannot be added. Visual feedback: hover states on buttons, focus ring on inputs."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture and view a todo (Priority: P1)

A user opens the app, types a task into the input field, and submits it. The
task appears in the list and survives a page reload.

**Why this priority**: Without capture + persistence, the app has no value. This
is the minimum viable slice.

**Independent Test**: Open `index.html`, type "Buy milk", press Enter, see it
appear in the list. Reload the page; "Buy milk" is still there.

**Acceptance Scenarios**:

1. **Given** an empty list, **When** the user types "Buy milk" and presses Enter, **Then** "Buy milk" appears as a new item in the list and the input clears.
2. **Given** an empty list, **When** the user types "Buy milk" and clicks the Add button, **Then** the same outcome occurs as pressing Enter.
3. **Given** a list with one todo, **When** the user reloads the page, **Then** the todo is still visible.
4. **Given** an empty input field, **When** the user presses Enter, **Then** no item is added and the list is unchanged.
5. **Given** an input containing only whitespace, **When** the user submits, **Then** no item is added.

---

### User Story 2 - Mark complete and remove (Priority: P1)

A user can mark a todo as complete (visually struck through) and remove a todo
they no longer need.

**Why this priority**: Without these, the list grows unbounded and stale. Equal
to P1 because completion + deletion are the core lifecycle.

**Independent Test**: Add two todos, click the checkbox on the first, observe
strikethrough; click × on the second, observe it disappears.

**Acceptance Scenarios**:

1. **Given** a todo "Walk dog" in the list, **When** the user clicks its checkbox, **Then** the text shows strikethrough styling and the checkbox is shown as checked.
2. **Given** a checked todo, **When** the user clicks its checkbox again, **Then** strikethrough is removed and the checkbox is unchecked.
3. **Given** a todo in the list, **When** the user clicks its × delete button, **Then** the todo is removed from the list immediately.
4. **Given** any list state change (add/check/delete), **When** the change occurs, **Then** the new state is persisted so a reload preserves it.

---

### User Story 3 - Filter and clear (Priority: P2)

A user can filter the visible list to All, Active (unchecked), or Completed
(checked) todos, see how many active items remain, and bulk-remove completed
items.

**Why this priority**: Quality-of-life features once a list grows past a few
items. Not strictly required for a one-item demo but expected of a real todo app.

**Independent Test**: Add three todos, check one, click "Active" → see two;
click "Completed" → see one; click "Clear completed" → completed list empties.

**Acceptance Scenarios**:

1. **Given** a list with 3 todos (1 checked, 2 unchecked), **When** no filter has been clicked, **Then** the footer shows "2 items left" and all 3 are visible.
2. **Given** the same list, **When** the user clicks the "Active" filter, **Then** only the 2 unchecked todos are visible and the Active button shows a selected/active visual state.
3. **Given** the same list, **When** the user clicks the "Completed" filter, **Then** only the 1 checked todo is visible.
4. **Given** the same list, **When** the user clicks the "Clear completed" button, **Then** the 1 checked todo is removed and the footer updates to show "2 items left".
5. **Given** a list with zero completed todos, **When** the list is rendered, **Then** the "Clear completed" button is hidden or disabled.
6. **Given** an empty list, **When** the list is rendered, **Then** the footer (item count, filters, clear button) is hidden.

---

### Edge Cases

- **Whitespace-only input**: Trim before validating; reject if empty after trim.
- **Very long todo text**: Wrap or truncate visually so the layout doesn't break (no horizontal scroll).
- **localStorage unavailable** (private mode in some browsers): App still functions in-memory for the session; reload loses data silently.
- **Corrupted localStorage payload**: App recovers by treating the stored value as empty rather than crashing.
- **Many todos** (e.g., 100+): List renders without noticeable lag; no virtualization required at this scale.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow adding a new todo via Enter key in the input field or via clicking an explicitly-labeled Add button.
- **FR-002**: System MUST reject empty or whitespace-only input without adding an item or showing an error.
- **FR-003**: System MUST display each todo with its text, a checkbox indicating completion, and a delete control.
- **FR-004**: System MUST visually strike through the text of any completed todo.
- **FR-005**: System MUST allow toggling a todo's completion state by clicking the checkbox.
- **FR-006**: System MUST allow removing a todo by clicking its delete control.
- **FR-007**: System MUST display a count of currently active (unchecked) todos in the form "N items left" (or "1 item left" when N=1).
- **FR-008**: System MUST provide three filters — All, Active, Completed — with the currently selected filter visually distinguished.
- **FR-009**: System MUST provide a "Clear completed" control that removes every completed todo when invoked, and is hidden/disabled when no completed todos exist.
- **FR-010**: System MUST persist the full todo list (text + completion state) across page reloads using browser local storage.
- **FR-011**: System MUST be operable using only the keyboard (tab to reach controls, Enter/Space to activate).
- **FR-012**: System MUST provide a visible focus indicator on every focusable control.
- **FR-013**: System MUST provide a visible hover indicator on every clickable control.
- **FR-014**: System MUST hide the footer (item count, filters, clear button) when the list is empty.

### Key Entities

- **Todo**: Represents a single task. Attributes: a unique identifier, the text the user entered, a boolean indicating whether it is completed, and a creation timestamp (used for stable ordering, oldest-first).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can add their first todo within 5 seconds of opening the page (no setup, no instructions).
- **SC-002**: Adding, toggling, deleting, or filtering a todo updates the visible list in under 100 milliseconds (no perceptible lag).
- **SC-003**: 100% of todos persist correctly across a page reload in any of the supported browsers.
- **SC-004**: Every interactive control is reachable and operable using keyboard alone (verified by tab/Enter/Space-only run-through of all acceptance scenarios).
- **SC-005**: All FR-001 through FR-014 acceptance scenarios pass on a manual smoke test in the latest stable Chrome.

## Assumptions

- Single-user, single-device usage. No syncing across devices.
- Modern browser with `localStorage` support (graceful degradation in private mode is best-effort, not a hard requirement).
- English-only UI; no i18n.
- No editing of an existing todo's text in v1 (delete + re-add is the workflow). This trades feature scope for shipping the demo quickly.
- Visual design is minimal/utilitarian; no theme system, no dark mode.
- Run by opening `index.html` directly via `file://` — no local server required.
