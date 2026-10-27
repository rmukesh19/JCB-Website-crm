import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader === 'null' || authHeader === 'undefined') {
    return res.status(401).json({ success: false, error: 'Access token is required' });
  }

  const token = authHeader.split(' ')[1] || authHeader;
  if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
    return res.status(401).json({ success: false, error: 'Access token is required' });
  }
  
  try {
    const secret = process.env.JWT_SECRET || 'jcb360_enterprise_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    req.currentUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired access token' });
  }
};

export const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader === 'null' || authHeader === 'undefined') {
    return next();
  }
  return verifyToken(req, res, next);
};

export default verifyToken;

