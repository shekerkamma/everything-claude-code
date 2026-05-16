# Phase 1 Data Model: Todo List Demo App

## Entity: Todo

| Field      | Type    | Required | Notes |
|------------|---------|----------|-------|
| `id`       | string  | yes      | UUID (or fallback timestamp+random). Stable for the life of the item. |
| `text`     | string  | yes      | Trimmed user input. Non-empty. Stored verbatim (no HTML escaping at write — escaping is the renderer's job via `textContent`). |
| `completed`| boolean | yes      | `false` on creation. Toggled by checkbox. |
| `createdAt`| number  | yes      | `Date.now()` at creation. Used for stable oldest-first ordering. |

### Validation rules

- `text` MUST be non-empty after `String.prototype.trim()`. Empty input is
  rejected silently at the form layer (no error toast — per spec FR-002).
- `id` MUST be unique within the in-memory list. UUIDs satisfy this; the
  fallback path uses `Date.now() + '-' + Math.random().toString(36).slice(2)`
  which has effectively zero collision probability for a single-user list.

### State transitions

```text
(no item)
   │
   │ addTodo(text)
   ▼
{completed: false}
   │
   │ toggleTodo(id)
   ▼
{completed: true}  ──── toggleTodo(id) ───▶  {completed: false}
   │
   │ deleteTodo(id)  OR  clearCompleted()
   ▼
(removed)
```

## Aggregate: AppState

The single in-memory state object held by the IIFE in `app.js`:

```js
{
  todos: Todo[],          // ordered oldest-first by createdAt
  filter: 'all'           // | 'active' | 'completed' — UI-only, not persisted
}
```

### Derived values (recomputed by `render()`)

- `visibleTodos` = `todos` filtered by `filter`.
- `activeCount` = number of `todos` where `completed === false`.
- `hasCompleted` = `todos.some(t => t.completed)`.

### Invariants

1. `todos` is always sorted oldest-first by `createdAt`.
2. After any mutation, the persisted JSON in `localStorage[speckit-todo-list:v1]`
   equals `JSON.stringify(state.todos)` (filter is NOT persisted).
3. `filter` is always one of the three string literals; defensive code coerces
   anything else to `'all'`.

## Persistence shape

Stored at key `speckit-todo-list:v1`:

```json
[
  {"id": "...", "text": "Buy milk", "completed": false, "createdAt": 1763251200000},
  {"id": "...", "text": "Walk dog", "completed": true,  "createdAt": 1763251260000}
]
```
