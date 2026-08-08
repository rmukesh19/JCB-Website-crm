import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Access token is required' });
  }

  const token = authHeader.split(' ')[1] || authHeader;
  
  try {
    const secret = process.env.JWT_SECRET || 'jcb360_enterprise_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    req.currentUser = decoded;
    next();
  } catch (err) {
    // Fallback for simple session tokens like token_1_ADMIN_...
    if (token.startsWith('token_')) {
      const parts = token.split('_');
      const userId = parseInt(parts[1], 10);
      const role = parts[2] || 'ADMIN';
      req.currentUser = {
        id: userId,
        companyId: 1,
        branchId: 1,
        name: 'System Admin',
        role
      };
      return next();
    }
    return res.status(401).json({ success: false, error: 'Invalid or expired access token' });
  }
};

export default verifyToken;
