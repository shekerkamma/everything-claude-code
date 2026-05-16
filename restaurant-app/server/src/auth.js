const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-do-not-use';
const TOKEN_TTL = '7d';

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}

function isValidEmail(s) {
  return typeof s === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body || {};
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name.trim(), role: 'customer' }
    });
    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!isValidEmail(email) || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    return res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
}

module.exports = { register, login, me, signToken, verifyToken, publicUser };
