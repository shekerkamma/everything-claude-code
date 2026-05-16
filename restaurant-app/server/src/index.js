require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { register, login, me } = require('./auth');
const { requireAuth } = require('./middleware/auth');

const menuRouter = require('./routes/menu');
const favoritesRouter = require('./routes/favorites');
const reservationsRouter = require('./routes/reservations');
const adminRouter = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

// Auth
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', requireAuth, me);

// Public menu
app.use('/api', menuRouter); // /api/categories, /api/dishes, /api/dishes/:id

// Protected
app.use('/api/favorites', favoritesRouter);
app.use('/api/reservations', reservationsRouter);

// Admin
app.use('/api/admin', adminRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[server]', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = parseInt(process.env.PORT, 10) || 3001;
app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
