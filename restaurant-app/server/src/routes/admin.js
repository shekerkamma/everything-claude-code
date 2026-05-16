const express = require('express');
const prisma = require('../prisma');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', async (_req, res, next) => {
  try {
    const [categories, dishes, customers, reservations] = await Promise.all([
      prisma.category.count(),
      prisma.dish.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.reservation.count()
    ]);
    res.json({ categories, dishes, customers, reservations });
  } catch (err) { next(err); }
});

// Dishes CRUD ----------------------------------------------------------------

function validateDishBody(body, partial) {
  const errs = [];
  const out = {};
  if (!partial || 'categoryId' in body) {
    const c = parseInt(body.categoryId, 10);
    if (!Number.isFinite(c)) errs.push('categoryId required');
    else out.categoryId = c;
  }
  if (!partial || 'name' in body) {
    if (typeof body.name !== 'string' || !body.name.trim()) errs.push('name required');
    else out.name = body.name.trim();
  }
  if (!partial || 'description' in body) {
    if (typeof body.description !== 'string') errs.push('description required');
    else out.description = body.description;
  }
  if (!partial || 'priceCents' in body) {
    const p = parseInt(body.priceCents, 10);
    if (!Number.isFinite(p) || p < 0) errs.push('priceCents must be a non-negative integer');
    else out.priceCents = p;
  }
  if (!partial || 'imageUrl' in body) {
    if (typeof body.imageUrl !== 'string' || !/^https?:\/\//.test(body.imageUrl)) errs.push('imageUrl must be http(s)');
    else out.imageUrl = body.imageUrl;
  }
  for (const k of ['isVegetarian', 'isSpicy', 'isPopular']) {
    if (k in body) out[k] = !!body[k];
  }
  return { errs, out };
}

router.post('/dishes', async (req, res, next) => {
  try {
    const { errs, out } = validateDishBody(req.body || {}, false);
    if (errs.length) return res.status(400).json({ error: errs.join('; ') });
    try {
      const d = await prisma.dish.create({ data: out });
      res.status(201).json(d);
    } catch (e) {
      if (e.code === 'P2002') return res.status(409).json({ error: 'A dish with that name already exists in this category' });
      throw e;
    }
  } catch (err) { next(err); }
});

router.patch('/dishes/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    const { errs, out } = validateDishBody(req.body || {}, true);
    if (errs.length) return res.status(400).json({ error: errs.join('; ') });
    try {
      const d = await prisma.dish.update({ where: { id }, data: out });
      res.json(d);
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Dish not found' });
      if (e.code === 'P2002') return res.status(409).json({ error: 'A dish with that name already exists in this category' });
      throw e;
    }
  } catch (err) { next(err); }
});

router.delete('/dishes/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    try {
      await prisma.dish.delete({ where: { id } });
      res.status(204).end();
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Dish not found' });
      throw e;
    }
  } catch (err) { next(err); }
});

// Reservations admin ---------------------------------------------------------

router.get('/reservations', async (_req, res, next) => {
  try {
    const list = await prisma.reservation.findMany({
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.json(list);
  } catch (err) { next(err); }
});

router.patch('/reservations/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    const status = req.body && req.body.status;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'status must be pending/confirmed/cancelled' });
    }
    try {
      const r = await prisma.reservation.update({ where: { id }, data: { status } });
      res.json(r);
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Reservation not found' });
      throw e;
    }
  } catch (err) { next(err); }
});

module.exports = router;
