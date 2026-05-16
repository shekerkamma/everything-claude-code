# Feature Specification: Restaurant Demo App

**Feature Branch**: `002-restaurant-app`

**Created**: 2026-05-16

**Status**: Draft

**Input**: User description: "Build a restaurant website end-to-end through the spec-kit workflow, mirroring the YouTube transcript demo: a public menu (categories + dishes + dish detail with image, description, vegetarian/spicy/popular flags), customer registration + login, per-customer favorites, reservation submission, and an admin dashboard for managing dishes, categories, and reservations. Match the transcript's feature set; substitute SQLite for Postgres so it runs without external credentials."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse the menu (Priority: P1)

A first-time visitor lands on the site, sees menu categories (Starters,
Mains, Desserts, Drinks), browses dishes within a category, and clicks a
dish to read its full description, see its image, and check its dietary
flags. No account required.

**Why this priority**: A restaurant site that doesn't show its menu has no
value. Auth-gating menu browsing kills conversion. This is the MVP slice.

**Independent Test**: Open the site, click "Mains", click "Spicy Paneer
Tikka", confirm the modal shows: image, description, price, vegetarian
badge, spicy badge.

**Acceptance Scenarios**:

1. **Given** the site loaded with seed data, **When** the visitor lands on `/`, **Then** the menu shows at least 4 categories and at least 8 dishes total.
2. **Given** the menu is visible, **When** the visitor clicks a category tab, **Then** only dishes in that category are shown.
3. **Given** a dish card, **When** the visitor clicks it, **Then** a detail view (modal or page) opens with image, description, price, and badges (vegetarian / spicy / popular as applicable).
4. **Given** the dish detail view is open, **When** the visitor closes it, **Then** they return to the menu in the same scroll position.

---

### User Story 2 — Register and log in (Priority: P1)

A visitor creates an account with email + password, then logs in and sees
their identity reflected in the navbar (e.g. "Hi, Maya" + Logout button).
The session persists across page reloads until logout or token expiry.

**Why this priority**: Favorites and reservations both require auth.
Without working auth, the only thing the demo proves is the public menu.

**Independent Test**: Click "Register", fill email/password/name, submit.
Land on the menu logged in. Reload — still logged in. Click Logout — back
to anonymous state.

**Acceptance Scenarios**:

1. **Given** the visitor is on `/register`, **When** they submit a valid email + password (≥8 chars) + name, **Then** they are logged in and redirected to the menu.
2. **Given** an existing account, **When** the visitor logs in with correct credentials, **Then** they land on the menu logged in.
3. **Given** a logged-in user, **When** they reload the page, **Then** they remain logged in.
4. **Given** a logged-in user, **When** they click Logout, **Then** they are logged out and the navbar reverts to "Login / Register".
5. **Given** any auth form, **When** invalid credentials or duplicate email is submitted, **Then** a clear error message shows and no session is created.

---

### User Story 3 — Add favorites (Priority: P2)

A logged-in customer marks dishes as favorites and views their favorites
list. Anonymous visitors trying to favorite get prompted to log in.

**Why this priority**: A delight feature, not core to a restaurant
discovery flow. Still common enough to ship in the demo.

**Independent Test**: Log in, click the heart icon on "Spicy Paneer Tikka",
confirm filled state. Navigate to `/favorites`, confirm dish appears.
Reload — still there. Click heart again on the menu — removed from
favorites.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the menu, **When** they click the heart on a dish, **Then** the heart fills and the dish appears under `/favorites`.
2. **Given** a favorited dish, **When** the user clicks the heart again, **Then** it un-favorites (heart unfills, dish removed from `/favorites`).
3. **Given** an anonymous visitor, **When** they click a heart icon, **Then** they are redirected to `/login` with a message ("Log in to save favorites").
4. **Given** favorites exist, **When** the user logs out and back in (different session), **Then** their favorites are still there.

---

### User Story 4 — Submit a reservation (Priority: P2)

A logged-in customer fills a reservation form (date, time, party size,
optional notes) and submits. They see a confirmation and can view their
past reservations.

**Why this priority**: Reservations are the second pillar of a restaurant
site (after menu browsing). Important but not blocking the MVP.

**Independent Test**: Log in, go to `/reservations`, submit a reservation
for tomorrow at 7pm party of 4, confirm it appears in "Your reservations"
with status "pending".

**Acceptance Scenarios**:

1. **Given** a logged-in customer on `/reservations`, **When** they submit valid date (today or future) + time + party size (1–12) + optional note, **Then** the reservation is saved with status "pending" and appears in their reservation list.
2. **Given** a past date is entered, **When** the form is submitted, **Then** an inline validation error shows and no reservation is created.
3. **Given** an anonymous visitor visits `/reservations`, **When** the page loads, **Then** they are redirected to `/login`.

---

### User Story 5 — Admin dashboard (Priority: P2)

An admin user logs in, navigates to `/admin`, sees totals (number of
dishes, reservations, customers), can list all dishes with edit/delete
controls, can add a new dish, can list all reservations and update their
status (pending → confirmed/cancelled).

**Why this priority**: The transcript's restaurant demo is incomplete
without it. Showcases role-based auth.

**Independent Test**: Log in as the seeded admin (`admin@example.com` /
`admin12345`), click Admin in navbar, confirm dashboard renders with
counts; click Dishes tab, edit one dish's price, confirm change persists
on the public menu. Click Reservations, change a reservation's status to
"confirmed".

**Acceptance Scenarios**:

1. **Given** an admin user is logged in, **When** they visit `/admin`, **Then** the dashboard shows counts for dishes, categories, customers, and reservations.
2. **Given** a non-admin user is logged in, **When** they visit `/admin`, **Then** they get a 403 page (or redirect to `/`).
3. **Given** an anonymous visitor visits `/admin`, **When** the page loads, **Then** they are redirected to `/login`.
4. **Given** an admin on the Dishes tab, **When** they edit a dish (name/price/description/badges) and save, **Then** the change is persisted and visible on the public menu.
5. **Given** an admin on the Dishes tab, **When** they add a new dish (name + category + price + image URL), **Then** it appears on the public menu under its category.
6. **Given** an admin on the Reservations tab, **When** they change a reservation's status, **Then** the new status is persisted.

---

### Edge Cases

- **Duplicate registration email**: rejected with "An account with this email already exists."
- **Wrong password**: rejected with "Invalid email or password" (no leak of which is wrong).
- **Expired JWT**: API returns 401, frontend logs the user out and redirects to `/login`.
- **Deleted dish in someone's favorites**: `/favorites` simply omits it (no broken card, no crash).
- **Reservation in the past**: blocked at form validation AND at API.
- **SQLite locked / db file missing**: backend returns 500 with a clear log; frontend shows a generic "Something went wrong" toast.
- **Dish image URL 404s**: `<img>` `onerror` falls back to a placeholder.
- **Admin tries to delete the category that has dishes**: blocked with "Move or delete dishes first."

## Requirements *(mandatory)*

### Functional Requirements

**Public menu (US1)**

- **FR-001**: Public site MUST list categories and dishes without requiring authentication.
- **FR-002**: System MUST allow filtering the menu by category via tabs/buttons.
- **FR-003**: System MUST present per-dish detail (image, description, price, vegetarian/spicy/popular flags) on click.

**Auth (US2)**

- **FR-004**: System MUST allow customer registration with email, password (≥8 chars), and name.
- **FR-005**: System MUST allow login with email + password and issue a session token (JWT).
- **FR-006**: System MUST persist the session across reloads until token expiry or explicit logout.
- **FR-007**: System MUST hash passwords (bcrypt or equivalent); plaintext storage is forbidden.
- **FR-008**: System MUST reject duplicate-email registration with a clear message.
- **FR-009**: System MUST surface a clear error on invalid login without disclosing which field was wrong.

**Favorites (US3)**

- **FR-010**: Logged-in users MUST be able to mark/unmark a dish as favorite.
- **FR-011**: Each user's favorites MUST be private to that user.
- **FR-012**: Anonymous users clicking favorite MUST be redirected to login with context.

**Reservations (US4)**

- **FR-013**: Logged-in users MUST be able to submit a reservation (date, time, party size 1–12, optional note).
- **FR-014**: Past dates MUST be rejected at form and API.
- **FR-015**: Users MUST be able to view their own reservations (with status).

**Admin (US5)**

- **FR-016**: System MUST distinguish between `customer` and `admin` roles.
- **FR-017**: Admin-only routes MUST return 403 for non-admin authenticated users and 401 for anonymous.
- **FR-018**: Admins MUST be able to CRUD dishes (name, category, description, price, image URL, badges).
- **FR-019**: Admins MUST be able to view all reservations and update their status (`pending`, `confirmed`, `cancelled`).
- **FR-020**: Admins MUST be able to view counts of dishes, categories, customers, and reservations on the dashboard.

**Cross-cutting**

- **FR-021**: All interactive controls MUST be keyboard-operable with visible focus.
- **FR-022**: All API endpoints MUST validate input and return JSON error bodies of shape `{"error": "<message>"}` with appropriate HTTP status codes (400/401/403/404/409/500).
- **FR-023**: System MUST seed a demo dataset on first run: 4+ categories, 8+ dishes, 1 admin user (`admin@example.com` / `admin12345`).

### Key Entities

- **User**: id, email (unique), passwordHash, name, role (`customer` | `admin`), createdAt.
- **Category**: id, name (unique), displayOrder.
- **Dish**: id, categoryId, name, description, price (cents), imageUrl, isVegetarian, isSpicy, isPopular, createdAt.
- **Favorite**: id, userId, dishId, createdAt. (Unique on (userId, dishId).)
- **Reservation**: id, userId, date, time, partySize, note, status (`pending` | `confirmed` | `cancelled`), createdAt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can browse the menu and open a dish detail within 10 seconds of landing on the page.
- **SC-002**: An anonymous visitor can register and reach a logged-in state in under 30 seconds.
- **SC-003**: API responses for menu reads return in under 200ms on the local SQLite DB with seed data (≤8 dishes).
- **SC-004**: 100% of FR-001 through FR-023 acceptance scenarios pass on a manual smoke test in the latest stable Chrome (recorded in `quickstart.md`).
- **SC-005**: The full app starts from a fresh clone with at most: `npm install` (×2 — server + client), `npm run db:setup`, two `npm run dev` processes.

## Assumptions

- Single restaurant — no multi-tenant.
- English-only UI; no i18n.
- No payment processing, no order placement, no delivery — explicit non-goals from the transcript.
- No social/federated login — explicit non-goal.
- SQLite is acceptable as the demo database; production deployment is out of scope.
- Seed data is the source of truth for first-run demo; no migration tooling beyond Prisma's built-ins.
- A single bundled admin account is acceptable for the demo. Real-world apps would invite admins separately.
