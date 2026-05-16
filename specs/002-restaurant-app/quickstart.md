# Quickstart: Restaurant Demo App

## First-run setup (≈90 seconds)

```bash
# 1. Backend deps + DB migrate + seed
cd restaurant-app/server
npm install
npm run db:setup        # runs prisma migrate + seed (idempotent)

# 2. Frontend deps
cd ../client
npm install

# 3. Start both processes (in two terminals)
# Terminal A:
cd restaurant-app/server && npm run dev    # http://localhost:3001
# Terminal B:
cd restaurant-app/client && npm run dev    # http://localhost:5173
```

Open http://localhost:5173 in a browser.

## Default seeded admin

- **Email**: `admin@example.com`
- **Password**: `admin12345`

Use this to access `/admin`. Change the password (or remove the account)
before any non-demo deployment.

## Smoke-test script

The numbered steps below cover every functional requirement (FR-001 to
FR-023) and every acceptance scenario across all five user stories.

### Public menu (US1)

1. Land on `/` → see at least 4 category tabs and 8 dish cards.
2. Click "Mains" tab → only Mains dishes visible.
3. Click "Spicy Paneer Tikka" card → modal opens with image, description,
   price, badges.
4. Close modal → return to menu, scroll position preserved.

### Auth (US2)

5. Click "Register" → fill `maya@example.com`, `pass1234`, `Maya` → submit
   → land on menu logged in.
6. Reload → still logged in.
7. Click "Logout" → back to anonymous.
8. Click "Login" → submit same credentials → logged in.
9. Try logging in with wrong password → see "Invalid email or password"
   error, no session created.
10. Try registering same email again → "An account with this email already
    exists."

### Favorites (US3)

11. While logged in as Maya, click the heart on "Butter Chicken" → fills.
12. Navigate to `/favorites` → "Butter Chicken" listed.
13. Click heart again on the menu → unfavorited; `/favorites` is empty.
14. Re-favorite, log out, log back in → favorite still there.
15. Log out, click any heart → redirected to `/login` with "Log in to save
    favorites" message.

### Reservations (US4)

16. Log in as Maya, go to `/reservations`, submit date=tomorrow, time=19:00,
    party=4, note="Anniversary" → see "Booking received" confirmation.
17. Reservation appears in "Your reservations" list with status "pending".
18. Try submitting a past date → inline error, no API call.
19. Log out, visit `/reservations` → redirected to `/login`.

### Admin (US5)

20. Log in as `admin@example.com` / `admin12345`.
21. Click "Admin" in navbar → dashboard shows counts (categories ≥4,
    dishes ≥8, customers ≥1, reservations ≥1).
22. Click "Dishes" tab → list shows all 8 seed dishes with edit/delete.
23. Edit "Mint Lemonade" price to $5.00 → save → navigate to public menu →
    confirm new price renders.
24. Add new dish: category=Drinks, name="Espresso", price=$3.50, image=any
    HTTPS URL → save → confirm appears under Drinks on public menu.
25. Click "Reservations" tab → see Maya's reservation → change status to
    "confirmed" → reload Maya's `/reservations` page (after re-login) →
    status reflects "confirmed".
26. Log in as Maya (non-admin), navigate to `/admin` → 403 page or redirect
    to `/`.

### Cross-cutting

27. Tab through the app from page load → every focusable control shows a
    visible focus ring.
28. Open DevTools → Application → Local Storage → see `restaurant_jwt` key
    (or similar). Clear it → reload → logged out.

## Reset state

```bash
# Wipe DB and re-seed
cd restaurant-app/server
rm -f prisma/dev.db
npm run db:setup
```
