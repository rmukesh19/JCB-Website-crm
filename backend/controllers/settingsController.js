import db from '../services/memoryStore.js';

// Companies
export const getCompanies = async (req, res) => res.json(db.companies);
export const updateCompany = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.companies.findIndex(c => c.id === id);
  if (idx !== -1) {
    db.companies[idx] = { ...db.companies[idx], ...req.body };
    return res.json(db.companies[idx]);
  }
  res.status(404).json({ error: 'Company not found' });
};

// Branches
export const getBranches = async (req, res) => res.json(db.branches);
export const createBranch = async (req, res) => {
  const b = { id: db.branches.length + 1, ...req.body };
  db.branches.push(b);
  res.status(201).json(b);
};
export const updateBranch = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.branches.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.branches[idx] = { ...db.branches[idx], ...req.body };
    return res.json(db.branches[idx]);
  }
  res.status(404).json({ error: 'Branch not found' });
};

// Users
export const getUsers = async (req, res) => res.json(db.users);
export const createUser = async (req, res) => {
  const user = { id: db.users.length + 1, active: true, ...req.body };
  db.users.push(user);
  res.status(201).json(user);
};
export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.users.findIndex(u => u.id === id);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...req.body };
    return res.json(db.users[idx]);
  }
  res.status(404).json({ error: 'User not found' });
};
export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.users = db.users.filter(u => String(u.id) !== String(req.params.id) && u.id !== id);
  res.json({ success: true, message: 'User deleted' });
};

// Audit Logs
export const getAuditLogs = async (req, res) => {
  const formatted = db.auditLogs.map(l => ({
    ...l,
    createdAt: l.createdAt || l.timestamp || new Date().toISOString(),
    userName: l.userName || l.username || 'admin',
    action: l.action || 'SYSTEM_EVENT',
    details: l.details || ''
  }));
  res.json(formatted);
};

// Operators
export const getOperators = async (req, res) => res.json(db.operators);
export const createOperator = async (req, res) => {
  const op = { id: db.operators.length + 1, status: 'ACTIVE', ...req.body };
  db.operators.push(op);
  res.status(201).json(op);
};
export const updateOperator = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.operators.findIndex(o => o.id === id);
  if (idx !== -1) {
    db.operators[idx] = { ...db.operators[idx], ...req.body };
    return res.json(db.operators[idx]);
  }
  res.status(404).json({ error: 'Operator not found' });
};
export const deleteOperator = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.operators = db.operators.filter(o => String(o.id) !== String(req.params.id) && o.id !== id);
  res.json({ success: true, message: 'Operator deleted' });
};

// Drivers
export const getDrivers = async (req, res) => res.json(db.drivers);
export const createDriver = async (req, res) => {
  const d = { id: db.drivers.length + 1, status: 'ACTIVE', ...req.body };
  db.drivers.push(d);
  res.status(201).json(d);
};
export const updateDriver = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.drivers.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.drivers[idx] = { ...db.drivers[idx], ...req.body };
    return res.json(db.drivers[idx]);
  }
  res.status(404).json({ error: 'Driver not found' });
};
export const deleteDriver = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.drivers = db.drivers.filter(d => String(d.id) !== String(req.params.id) && d.id !== id);
  res.json({ success: true, message: 'Driver deleted' });
};

// Spare Parts
export const getSpareParts = async (req, res) => res.json(db.spareParts);
export const createSparePart = async (req, res) => {
  const sp = { id: db.spareParts.length + 1, ...req.body };
  db.spareParts.push(sp);
  res.status(201).json(sp);
};
export const updateSparePart = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.spareParts.findIndex(sp => sp.id === id);
  if (idx !== -1) {
    db.spareParts[idx] = { ...db.spareParts[idx], ...req.body };
    return res.json(db.spareParts[idx]);
  }
  res.status(404).json({ error: 'Spare part not found' });
};
export const deleteSparePart = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.spareParts = db.spareParts.filter(sp => String(sp.id) !== String(req.params.id) && sp.id !== id);
  res.json({ success: true, message: 'Spare part deleted' });
};

// Suppliers
export const getSuppliers = async (req, res) => res.json(db.suppliers);
export const createSupplier = async (req, res) => {
  const s = { id: db.suppliers.length + 1, ...req.body };
  db.suppliers.push(s);
  res.status(201).json(s);
};
export const updateSupplier = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.suppliers.findIndex(s => s.id === id);
  if (idx !== -1) {
    db.suppliers[idx] = { ...db.suppliers[idx], ...req.body };
    return res.json(db.suppliers[idx]);
  }
  res.status(404).json({ error: 'Supplier not found' });
};
export const deleteSupplier = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.suppliers = db.suppliers.filter(s => String(s.id) !== String(req.params.id) && s.id !== id);
  res.json({ success: true, message: 'Supplier deleted' });
};

// Rates
export const getRates = async (req, res) => res.json(db.rates);
export const createRate = async (req, res) => {
  const r = { id: db.rates.length + 1, ...req.body };
  db.rates.push(r);
  res.status(201).json(r);
};
export const updateRate = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.rates.findIndex(r => r.id === id);
  if (idx !== -1) {
    db.rates[idx] = { ...db.rates[idx], ...req.body };
    return res.json(db.rates[idx]);
  }
  res.status(404).json({ error: 'Rate not found' });
};
export const deleteRate = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.rates = db.rates.filter(r => String(r.id) !== String(req.params.id) && r.id !== id);
  res.json({ success: true, message: 'Rate deleted' });
};

// Purchases
export const getPurchases = async (req, res) => res.json(db.purchases);
export const createPurchase = async (req, res) => {
  const p = { id: db.purchases.length + 1, date: new Date().toISOString().split('T')[0], status: 'PAID', ...req.body };
  db.purchases.push(p);
  res.status(201).json(p);
};

// Notifications
export const getNotifications = async (req, res) => {
  const formatted = db.notifications.map(n => ({
    ...n,
    createdAt: n.createdAt || n.timestamp || new Date().toISOString(),
    type: n.type || 'INFO',
    title: n.title || 'System Notification',
    message: n.message || ''
  }));
  res.json(formatted);
};
export const markAllNotificationsRead = async (req, res) => {
  db.notifications.forEach(n => { n.isRead = true; n.read = true; });
  res.json({ success: true, message: 'All notifications marked as read' });
};
