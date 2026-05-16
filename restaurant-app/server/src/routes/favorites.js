const express = require('express');
const prisma = require('../prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
      include: { dish: true }
    });
    res.json(favs.map(f => ({ id: f.id, dish: f.dish })));
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const dishId = parseInt(req.body && req.body.dishId, 10);
    if (!Number.isFinite(dishId)) return res.status(400).json({ error: 'dishId required' });
    const dish = await prisma.dish.findUnique({ where: { id: dishId } });
    if (!dish) return res.status(404).json({ error: 'Dish not found' });

    try {
      const fav = await prisma.favorite.create({
        data: { userId: req.user.sub, dishId },
        include: { dish: true }
      });
      return res.status(201).json({ id: fav.id, dish: fav.dish });
    } catch (e) {
      if (e.code === 'P2002') return res.status(409).json({ error: 'Already favorited' });
      throw e;
    }
  } catch (err) { next(err); }
});

router.delete('/:dishId', async (req, res, next) => {
  try {
    const dishId = parseInt(req.params.dishId, 10);
    if (!Number.isFinite(dishId)) return res.status(400).json({ error: 'Invalid dishId' });
    const result = await prisma.favorite.deleteMany({
      where: { userId: req.user.sub, dishId }
    });
    if (result.count === 0) return res.status(404).json({ error: 'Not in favorites' });
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
