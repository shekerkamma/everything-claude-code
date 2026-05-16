const express = require('express');
const prisma = require('../prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

function isFutureOrToday(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(dateStr + 'T00:00:00');
  return candidate.getTime() >= today.getTime();
}

router.get('/', async (req, res, next) => {
  try {
    const list = await prisma.reservation.findMany({
      where: { userId: req.user.sub },
      orderBy: [{ date: 'desc' }, { time: 'desc' }]
    });
    res.json(list);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { date, time, partySize, note } = req.body || {};
    if (!isFutureOrToday(date)) return res.status(400).json({ error: 'Date must be today or in the future' });
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || '')) return res.status(400).json({ error: 'Invalid time (use HH:MM 24h)' });
    const ps = parseInt(partySize, 10);
    if (!Number.isFinite(ps) || ps < 1 || ps > 12) return res.status(400).json({ error: 'Party size must be 1–12' });
    if (note && (typeof note !== 'string' || note.length > 500)) return res.status(400).json({ error: 'Note too long (max 500)' });

    const r = await prisma.reservation.create({
      data: {
        userId: req.user.sub,
        date, time, partySize: ps,
        note: note ? note.trim() : null,
        status: 'pending'
      }
    });
    res.status(201).json(r);
  } catch (err) { next(err); }
});

module.exports = router;
