# Restaurant Demo App

Full-stack restaurant demo built end-to-end via the spec-kit workflow.
Mirrors the [YouTube spec-driven development walkthrough](https://www.youtube.com/watch?v=l3jmvWZ6t3o)
but substitutes SQLite for Postgres so it runs from a fresh clone with no
external credentials.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS, plain JavaScript.
- **Backend**: Node.js + Express + Prisma + SQLite + JWT (bcryptjs).

## Run

See [`../specs/002-restaurant-app/quickstart.md`](../specs/002-restaurant-app/quickstart.md)
for the full walkthrough. TL;DR:

```bash
# Backend
cd server && npm install && npm run db:setup && npm run dev   # :3001

# Frontend (separate terminal)
cd client && npm install && npm run dev                       # :5173
```

Then open http://localhost:5173.

**Default admin**: `admin@example.com` / `admin12345`

## Spec artifacts

- Spec: [`specs/002-restaurant-app/spec.md`](../specs/002-restaurant-app/spec.md)
- Plan: [`specs/002-restaurant-app/plan.md`](../specs/002-restaurant-app/plan.md)
- API contract: [`specs/002-restaurant-app/contracts/api-contract.md`](../specs/002-restaurant-app/contracts/api-contract.md)
- Tasks: [`specs/002-restaurant-app/tasks.md`](../specs/002-restaurant-app/tasks.md)

## Layout

```
restaurant-app/
├── server/          # Express + Prisma + SQLite
└── client/          # React + Vite + Tailwind
```
