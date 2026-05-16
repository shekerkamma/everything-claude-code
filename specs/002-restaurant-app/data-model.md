# Phase 1 Data Model: Restaurant Demo App

## Prisma schema (authoritative)

```prisma
datasource db { provider = "sqlite"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  passwordHash String
  name         String
  role         String        @default("customer")  // "customer" | "admin"
  createdAt    DateTime      @default(now())
  favorites    Favorite[]
  reservations Reservation[]
}

model Category {
  id           Int     @id @default(autoincrement())
  name         String  @unique
  displayOrder Int     @default(0)
  dishes       Dish[]
}

model Dish {
  id            Int        @id @default(autoincrement())
  categoryId    Int
  category      Category   @relation(fields: [categoryId], references: [id])
  name          String
  description   String
  priceCents    Int
  imageUrl      String
  isVegetarian  Boolean    @default(false)
  isSpicy       Boolean    @default(false)
  isPopular     Boolean    @default(false)
  createdAt     DateTime   @default(now())
  favorites     Favorite[]

  @@unique([categoryId, name])
}

model Favorite {
  id        Int      @id @default(autoincrement())
  userId    Int
  dishId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dish      Dish     @relation(fields: [dishId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, dishId])
}

model Reservation {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      String   // ISO yyyy-mm-dd; SQLite has no DATE type so we store text
  time      String   // HH:MM (24h)
  partySize Int
  note      String?
  status    String   @default("pending")  // "pending" | "confirmed" | "cancelled"
  createdAt DateTime @default(now())
}
```

## Entity rules

### User

- `email` must match a basic regex (`/^[^@\s]+@[^@\s]+\.[^@\s]+$/`).
- `passwordHash` is `bcryptjs.hashSync(password, 10)`. Plaintext password
  is never persisted.
- `role` is enforced at write time to be one of `customer` | `admin`.
  Customer registration ALWAYS creates `customer`; admin role is set only
  by the seed script.

### Category

- `name` is unique, case-sensitive. UI displays as-is.
- `displayOrder` controls left-to-right tab order on the menu (smaller =
  earlier). Ties broken by name ascending.

### Dish

- `priceCents` is an integer in cents (e.g. `1299` = $12.99). Render with
  `(priceCents / 100).toFixed(2)` and a `$` prefix.
- `imageUrl` MUST be HTTPS. The seed uses Unsplash CDN URLs.
- `(categoryId, name)` is unique to prevent duplicates within a category.
- `isVegetarian`, `isSpicy`, `isPopular` are independent flags rendered as
  badges.

### Favorite

- `(userId, dishId)` unique — toggling re-uses the row by deletion + create
  rather than upsert (cleaner audit).

### Reservation

- `date` MUST be today or future (server validates against UTC midnight in
  the server's timezone).
- `time` MUST match `^([01]\d|2[0-3]):[0-5]\d$`.
- `partySize` MUST be 1–12 (inclusive).
- `note` is optional, max 500 chars (validated at API).
- `status` transitions: any → any (admin), customer cannot change status.

## Seed dataset

| Category | Dishes (8 total) |
|----------|------------------|
| Starters | Spicy Paneer Tikka 🌶️🌱, Crispy Calamari |
| Mains    | Butter Chicken 🌶️⭐, Margherita Pizza 🌱⭐, Mushroom Risotto 🌱 |
| Desserts | Chocolate Lava Cake ⭐, Mango Kulfi 🌱 |
| Drinks   | Mint Lemonade 🌱 |

Plus one admin user: `admin@example.com` / `admin12345`.

(Badges: 🌱 vegetarian, 🌶️ spicy, ⭐ popular.)
