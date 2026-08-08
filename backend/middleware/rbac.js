export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized user session' });
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(req.currentUser.role) || req.currentUser.role === 'ADMIN') {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Forbidden: Access requires one of the following roles: ${allowedRoles.join(', ')}`
    });
  };
};

export default checkRole;
