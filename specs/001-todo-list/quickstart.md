# Quickstart: Todo List Demo App

## Run it

```bash
# From the repo root:
xdg-open demo-app/index.html   # Linux
open demo-app/index.html       # macOS
start demo-app/index.html      # Windows

# Or just double-click demo-app/index.html in your file manager.
```

No install, no server, no build.

## Smoke-test script (60 seconds)

Open the page, then:

1. Type **"Buy milk"** and press **Enter** → appears in list.
2. Type **"Walk dog"** and click **Add** → appears below "Buy milk".
3. Type **"   "** (spaces only) and press **Enter** → nothing happens (FR-002).
4. Click the checkbox on **"Buy milk"** → text gets strikethrough (FR-004).
5. Footer shows **"1 item left"** (FR-007).
6. Click **Active** filter → only "Walk dog" visible.
7. Click **Completed** filter → only "Buy milk" visible.
8. Click **All** filter → both visible.
9. Click **Clear completed** → "Buy milk" gone, footer reads "1 item left".
10. **Reload the page** → "Walk dog" still there, filter back to All (FR-010).
11. Click the **×** on "Walk dog" → list empty, footer hidden (FR-014).

## Keyboard-only run-through (30 seconds)

Tab from page load through every control. Verify each shows a visible focus
ring. Use Enter/Space to activate. Repeat the smoke test above without touching
the mouse. This validates FR-011 and FR-012.

## Reset state

```js
// In DevTools console:
localStorage.removeItem('speckit-todo-list:v1');
location.reload();
```
