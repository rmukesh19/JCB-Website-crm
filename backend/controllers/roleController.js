import db from '../services/memoryStore.js';

export const getRolesPermissions = async (req, res) => {
  res.json(db.rolesPermissions);
};

export const updateRolePermissions = async (req, res) => {
  const { roleName, permissions } = req.body;
  let item = db.rolesPermissions.find(r => r.roleName === roleName);
  if (item) {
    item.permissions = permissions;
  } else {
    item = { roleName, permissions };
    db.rolesPermissions.push(item);
  }
  res.json({ success: true, role: item });
};
