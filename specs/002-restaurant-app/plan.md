# Implementation Plan: Restaurant Demo App

**Branch**: `002-restaurant-app` | **Date**: 2026-05-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-restaurant-app/spec.md`

## Summary

A full-stack restaurant demo: React/Vite/Tailwind frontend talking to a small
Express + Prisma + SQLite backend. JWT-based auth distinguishes customers
from admins. Public menu browsing requires no auth; favorites, reservations,
and admin operations do. Seed script populates 4 categories, 8 dishes, and a
default admin account so the demo runs end-to-end on a fresh clone.

## Technical Context

**Language/Version**:
- Frontend: TypeScript? **No** — plain JavaScript (ES2020 modules) per the
  constitution's "right-sized stack" principle. Lower onboarding cost for a
  demo; `propTypes` not used.
- Backend: Node.js 18+, JavaScript (CommonJS) for tooling parity with
  Prisma's defaults.

**Primary Dependencies**:
- Frontend: `react`, `react-dom`, `react-router-dom`, `vite`,
  `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`.
- Backend: `express`, `cors`, `@prisma/client`, `prisma` (dev),
  `bcryptjs`, `jsonwebtoken`, `dotenv`, `nodemon` (dev).

**Storage**: SQLite via Prisma. DB file at `restaurant-app/server/prisma/dev.db`.

**Testing**: Manual smoke test from `quickstart.md`. No automated test
framework (per constitution: manual passes are required regardless;
automated would be additive scope outside the demo's value).

**Target Platform**: Modern desktop browsers (Chrome/Firefox/Safari latest).
Backend runs on `localhost:3001`, frontend on `localhost:5173` (Vite default).

**Project Type**: Full-stack web app, two processes (Node API + Vite dev
server), monorepo-ish layout under `restaurant-app/`.

**Performance Goals**: <200ms API response for menu reads on local SQLite
(SC-003). React renders in well under one frame at 8-dish scale.

**Constraints**: No external services (no Postgres, no SMTP, no S3). Image
URLs are external HTTPS links (Unsplash etc.) so seeded data renders
without bundling assets.

**Scale/Scope**: Single restaurant, dozens of dishes, dozens of customers,
hundreds of reservations comfortably.

## Constitution Check

| Principle | Profile applied | Result |
|-----------|-----------------|--------|
| I. Right-Sized Stack | Profile B — Full-Stack | ✅ Auth + multi-user data + admin require it. Vanilla profile cannot satisfy the spec. |
| II. Manual Testability | Manual smoke per quickstart.md | ✅ Every FR maps to a step in quickstart. |
| III. Accessibility by Default | semantic HTML, focus styles, ARIA on modals/tabs | ✅ Tailwind doesn't preclude semantics; we use `<button>`, `<form>`, `<nav>`, `<dialog>`-like modal with focus trap, `aria-pressed` on tabs. |
| IV. Local-First Runnability | SQLite, no hosted services, seed on setup | ✅ `npm run db:setup` migrates + seeds; no creds needed. |
| V. Per-Feature Self-Containment | All code under `restaurant-app/` | ✅ Two subdirs (`client/`, `server/`); no imports from `demo-app/` or elsewhere. |

**Initial gate**: PASS. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-restaurant-app/
├── plan.md              # This file
├── spec.md              # Feature spec
├── research.md          # Phase 0 — stack decisions
├── data-model.md        # Phase 1 — entities + Prisma schema
├── contracts/
│   └── api-contract.md  # Phase 1 — REST endpoint contract
├── quickstart.md        # Phase 1 — run + smoke test steps
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 (created by /speckit-tasks)
```

### Source Code (repository root)

```text
restaurant-app/
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── index.js               # Express bootstrap
│   │   ├── auth.js                # register/login/me handlers + JWT helpers
│   │   ├── middleware/auth.js     # requireAuth + requireAdmin
│   │   ├── routes/
│   │   │   ├── menu.js            # GET /api/categories, /api/dishes, /api/dishes/:id
│   │   │   ├── favorites.js       # GET/POST/DELETE /api/favorites
│   │   │   ├── reservations.js    # GET/POST /api/reservations (own only)
│   │   │   └── admin.js           # admin-only CRUD for dishes + reservation status + stats
│   │   └── prisma.js              # Prisma client singleton
│   └── prisma/
│       ├── schema.prisma
│       └── seed.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                # router + AuthProvider
        ├── index.css              # tailwind entrypoint
        ├── api.js                 # fetch wrapper with token + JSON
        ├── auth.jsx               # AuthContext + useAuth hook
        ├── components/
        │   ├── Navbar.jsx
        │   ├── DishCard.jsx
        │   ├── DishDetailModal.jsx
        │   ├── ProtectedRoute.jsx
        │   └── AdminRoute.jsx
        └── pages/
            ├── Menu.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Favorites.jsx
            ├── Reservations.jsx
            └── Admin.jsx          # tabs: Overview, Dishes, Reservations
```

**Structure Decision**: Two-process monorepo under `restaurant-app/`.
`client/` and `server/` each have their own `package.json` and `node_modules`.
Avoids the complexity of workspaces or shared dependencies for a demo.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No violations. Section intentionally empty.
