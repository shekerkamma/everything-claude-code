---
description: "Task list for the Restaurant Demo App"
---

# Tasks: Restaurant Demo App

**Input**: Design documents from `specs/002-restaurant-app/`

**Prerequisites**: spec.md, plan.md, research.md, data-model.md, contracts/api-contract.md

**Tests**: Manual smoke per `quickstart.md` (constitution Principle II).

**Organization**: Grouped by user story so each priority slice is shippable.

## Path Conventions

All implementation paths under `restaurant-app/{server,client}/`.

---

## Phase 1: Setup

- [ ] **T001** Create `restaurant-app/` and `restaurant-app/{server,client}/` directories.
- [ ] **T002** [P] Create `restaurant-app/README.md` linking to `specs/002-restaurant-app/quickstart.md`.

## Phase 2: Foundational — Backend

- [ ] **T003** `server/package.json` with deps: express, cors, @prisma/client, bcryptjs, jsonwebtoken, dotenv; devDeps: prisma, nodemon. Scripts: `dev`, `start`, `db:setup` (= `prisma migrate dev --name init && node prisma/seed.js`), `db:reset`.
- [ ] **T004** `server/.env.example` with `DATABASE_URL="file:./prisma/dev.db"`, `JWT_SECRET="change-me-dev-only"`, `PORT=3001`. Also write `server/.env` with the same values for first-run convenience.
- [ ] **T005** `server/prisma/schema.prisma` — exact schema from `data-model.md`.
- [ ] **T006** `server/src/prisma.js` — singleton `PrismaClient`.
- [ ] **T007** `server/src/index.js` — Express app: cors, json body parser, health route, mount routers, error middleware. Listen on `PORT`.
- [ ] **T008** `server/src/auth.js` — JWT helpers (`signToken`, `verifyToken`), bcrypt helpers.
- [ ] **T009** `server/src/middleware/auth.js` — `requireAuth` (decode token, attach req.user) and `requireAdmin` (check role).
- [ ] **T010** `server/prisma/seed.js` — idempotent upsert of categories, dishes, admin user. Uses bcryptjs for the admin password.

## Phase 3: Foundational — Frontend

- [ ] **T011** `client/package.json` with deps: react, react-dom, react-router-dom; devDeps: vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer. Scripts: `dev`, `build`, `preview`.
- [ ] **T012** `client/vite.config.js` (react plugin, dev server proxy `/api → http://localhost:3001`).
- [ ] **T013** `client/index.html` — root with `<div id="root">` + `<script type="module" src="/src/main.jsx">`.
- [ ] **T014** `client/tailwind.config.js` (content globs) + `client/postcss.config.js` (tailwind + autoprefixer).
- [ ] **T015** `client/src/index.css` — `@tailwind base/components/utilities;` + base `:focus-visible` ring.
- [ ] **T016** `client/src/main.jsx` — React root, render `<App>`.
- [ ] **T017** `client/src/api.js` — `apiFetch(path, opts)` wrapper: prepends `/api`, attaches `Authorization: Bearer <token>` from localStorage, parses JSON, throws on non-2xx with `{ status, error }`.
- [ ] **T018** `client/src/auth.jsx` — `AuthContext` + `AuthProvider`: holds `{user, token}`, methods `login/register/logout`, on mount calls `GET /api/auth/me` if token present, exposes `useAuth()` hook.
- [ ] **T019** `client/src/components/ProtectedRoute.jsx` and `AdminRoute.jsx` — route guards using `useAuth()`.
- [ ] **T020** `client/src/components/Navbar.jsx` — links: Menu, Reservations, Favorites (auth), Admin (admin only), Login/Register OR "Hi, <name>" + Logout.
- [ ] **T021** `client/src/App.jsx` — `<BrowserRouter><AuthProvider>` wrapping routes for `/`, `/login`, `/register`, `/favorites` (protected), `/reservations` (protected), `/admin` (admin).

**Checkpoint**: backend boots, frontend boots, navbar renders. Foundation done.

---

## Phase 4: User Story 1 — Public menu (P1) 🎯 MVP

- [ ] **T022** [US1] `server/src/routes/menu.js` — `GET /categories` (with dishCount), `GET /dishes?categoryId`, `GET /dishes/:id`. Mount in `index.js`.
- [ ] **T023** [US1] `client/src/components/DishCard.jsx` — image, name, price, badges, click to open detail.
- [ ] **T024** [US1] `client/src/components/DishDetailModal.jsx` — modal with focus trap, Escape closes, restores focus on close.
- [ ] **T025** [US1] `client/src/pages/Menu.jsx` — fetch categories + dishes, render category tabs (`aria-pressed`), render filtered dish grid, manage selected dish for modal.

**Checkpoint US1**: public menu fully browsable with detail. MVP shipped.

---

## Phase 5: User Story 2 — Auth (P1)

- [ ] **T026** [US2] `server/src/auth.js` exports route handlers: `register`, `login`, `me`. Mount under `/api/auth/*` in `index.js`.
- [ ] **T027** [US2] `client/src/pages/Login.jsx` — form, error display, redirect to intended page on success (default `/`).
- [ ] **T028** [US2] `client/src/pages/Register.jsx` — form (email/password/name), client-side validation (password ≥8), server-error display.

**Checkpoint US2**: register, login, logout, persist across reload all working.

---

## Phase 6: User Story 3 — Favorites (P2)

- [ ] **T029** [US3] `server/src/routes/favorites.js` — `GET`, `POST {dishId}`, `DELETE /:dishId`. requireAuth.
- [ ] **T030** [US3] `client/src/pages/Favorites.jsx` — fetch + render list of favorited dishes (reuse DishCard), allow unfavorite.
- [ ] **T031** [US3] `client/src/components/DishCard.jsx` — add heart button. If `useAuth().user`, call POST/DELETE; if anonymous, navigate to `/login` with state `{from, message}`.

**Checkpoint US3**: favorites add/remove/list/persist.

---

## Phase 7: User Story 4 — Reservations (P2)

- [ ] **T032** [US4] `server/src/routes/reservations.js` — `GET` own list, `POST` create. Server-side validation (date today/future, party 1-12, time HH:MM, note ≤500). requireAuth.
- [ ] **T033** [US4] `client/src/pages/Reservations.jsx` — form (date input min=today, time input, party number 1-12, note textarea) + list of past reservations.

**Checkpoint US4**: reservation submit + list working.

---

## Phase 8: User Story 5 — Admin (P2)

- [ ] **T034** [US5] `server/src/routes/admin.js` — `GET /stats`, `POST /dishes`, `PATCH /dishes/:id`, `DELETE /dishes/:id`, `GET /reservations`, `PATCH /reservations/:id`. requireAuth + requireAdmin.
- [ ] **T035** [US5] `client/src/pages/Admin.jsx` — tabs (Overview / Dishes / Reservations), each tab renders its own panel. Edit modals for dishes; status dropdown for reservations.

**Checkpoint US5**: admin can see stats, CRUD dishes, change reservation statuses.

---

## Phase 9: Polish

- [ ] **T036** Run `quickstart.md` smoke test steps 1–28. Capture screenshots.
- [ ] **T037** Verify `localStorage` token clears on logout. Verify expired token (manually edit DB to test? skip — covered by error handler in `api.js`).
- [ ] **T038** Inspect console for errors during full test run; fix any.

---

## Dependency graph

```text
T001 ─▶ T002, T003, T011
              ▼
   Backend foundation: T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
   Frontend foundation: T011 → T012 → T013 → T014 → T015 → T016 → T017 → T018 → T019 → T020 → T021
                                                  ▼
                                       Foundation Checkpoint
                                                  ▼
                  ┌───────────────┬──────────────┼───────────────┬─────────────┐
                  ▼               ▼              ▼               ▼             ▼
              US1 (T022-T025)  US2 (T026-T028)  US3 (T029-T031) US4 (T032-T033) US5 (T034-T035)
                                                  ▼
                                            Polish (T036-T038)
```

User stories are independent once foundation is done. We will execute them
sequentially since one developer is building.
