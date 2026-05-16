const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

router.get('/categories', async (_req, res, next) => {
  try {
    const cats = await prisma.category.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { dishes: true } } }
    });
    res.json(cats.map(c => ({
      id: c.id,
      name: c.name,
      displayOrder: c.displayOrder,
      dishCount: c._count.dishes
    })));
  } catch (err) { next(err); }
});

router.get('/dishes', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.categoryId) {
      const id = parseInt(req.query.categoryId, 10);
      if (Number.isFinite(id)) where.categoryId = id;
    }
    const dishes = await prisma.dish.findMany({ where, orderBy: { id: 'asc' } });
    res.json(dishes);
  } catch (err) { next(err); }
});

router.get('/dishes/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    const dish = await prisma.dish.findUnique({ where: { id } });
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.json(dish);
  } catch (err) { next(err); }
});

module.exports = router;
