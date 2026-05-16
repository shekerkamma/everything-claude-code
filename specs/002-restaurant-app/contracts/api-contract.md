# API Contract: Restaurant Demo App

Base URL: `http://localhost:3001/api`

All requests/responses are `application/json`. Error bodies always have shape
`{"error": "<message>"}` with one of these statuses:
`400` validation, `401` unauthenticated, `403` forbidden,
`404` not found, `409` conflict (e.g. duplicate email), `500` server error.

Auth: send `Authorization: Bearer <jwt>` on every protected endpoint.

## Auth

### `POST /api/auth/register`
- **Body**: `{ "email": string, "password": string (≥8), "name": string }`
- **201**: `{ "token": "<jwt>", "user": { "id", "email", "name", "role" } }`
- **400** invalid input · **409** email already exists.

### `POST /api/auth/login`
- **Body**: `{ "email", "password" }`
- **200**: `{ "token": "<jwt>", "user": {...} }`
- **400** invalid input · **401** invalid credentials.

### `GET /api/auth/me`  *(auth required)*
- **200**: `{ "user": {...} }`
- **401** missing/expired token.

## Menu (public)

### `GET /api/categories`
- **200**: `[ { "id", "name", "displayOrder", "dishCount": int } ]`

### `GET /api/dishes?categoryId=<id>`
- **200**: `[ { "id", "categoryId", "name", "description", "priceCents", "imageUrl", "isVegetarian", "isSpicy", "isPopular" } ]`
- `categoryId` query param is optional; omitted = all dishes.

### `GET /api/dishes/:id`
- **200**: single dish object.
- **404** not found.

## Favorites *(auth required)*

### `GET /api/favorites`
- **200**: `[ { "id", "dish": { ...dish object } } ]`

### `POST /api/favorites`
- **Body**: `{ "dishId": int }`
- **201**: `{ "id", "dish": {...} }`
- **404** dish not found · **409** already favorited.

### `DELETE /api/favorites/:dishId`
- **204** no content
- **404** not in favorites.

## Reservations *(auth required)*

### `GET /api/reservations`
- **200**: `[ { "id", "date", "time", "partySize", "note", "status", "createdAt" } ]` — only the caller's own.

### `POST /api/reservations`
- **Body**: `{ "date": "YYYY-MM-DD", "time": "HH:MM", "partySize": int 1-12, "note": string? }`
- **201**: `{ "id", "date", "time", "partySize", "note", "status": "pending" }`
- **400** validation (past date, bad time, party out of range, note > 500).

## Admin *(role=admin required)*

### `GET /api/admin/stats`
- **200**: `{ "categories": int, "dishes": int, "customers": int, "reservations": int }`

### `POST /api/admin/dishes`
- **Body**: `{ "categoryId", "name", "description", "priceCents", "imageUrl", "isVegetarian", "isSpicy", "isPopular" }`
- **201**: dish object · **400** validation · **409** name dup within category.

### `PATCH /api/admin/dishes/:id`
- **Body**: any subset of dish fields.
- **200**: updated dish object.

### `DELETE /api/admin/dishes/:id`
- **204** no content.

### `GET /api/admin/reservations`
- **200**: `[ { "id", "date", "time", "partySize", "note", "status", "user": { "id", "name", "email" } } ]`

### `PATCH /api/admin/reservations/:id`
- **Body**: `{ "status": "pending" | "confirmed" | "cancelled" }`
- **200**: updated reservation.
- **400** invalid status.

## Frontend → backend mapping

| Page                | Calls |
|---------------------|-------|
| `/` (Menu)          | `GET /api/categories`, `GET /api/dishes` |
| Dish detail (modal) | (data already in cache from menu list) |
| `/login`            | `POST /api/auth/login` |
| `/register`         | `POST /api/auth/register` |
| `/favorites`        | `GET /api/favorites`, `POST /api/favorites`, `DELETE /api/favorites/:id` |
| `/reservations`     | `GET /api/reservations`, `POST /api/reservations` |
| `/admin` (tabs)     | `GET /api/admin/stats`, `GET /api/admin/reservations`, full CRUD on dishes |
| any auth-protected  | `GET /api/auth/me` on app load to rehydrate |
