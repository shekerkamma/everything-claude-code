const { verifyToken } = require('../auth');

function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/);
  if (!match) return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  try {
    req.user = verifyToken(match[1]);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };
