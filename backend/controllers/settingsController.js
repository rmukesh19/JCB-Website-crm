import Company from '../models/Company.js';
import Branch from '../models/Branch.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getCompanies = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const companies = await Company.find();
        return res.json(companies);
      } catch (dbErr) {
        console.warn('getCompanies DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBranches = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const branches = await Branch.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(branches);
      } catch (dbErr) {
        console.warn('getBranches DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const users = await User.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(users);
      } catch (dbErr) {
        console.warn('getUsers DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const logs = await AuditLog.find({ companyId: req.currentUser?.companyId || 1 }).sort({ createdAt: -1 });
        return res.json(logs);
      } catch (dbErr) {
        console.warn('getAuditLogs DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.auditLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let updated = null;
    if (isDbConnected()) {
      try {
        updated = await Company.findOneAndUpdate({ id }, req.body, { new: true });
      } catch (dbErr) {
        console.warn('updateCompany DB fallback:', dbErr.message);
      }
    }
    if (!updated) {
      const idx = memoryStore.companies.findIndex(c => c.id === id);
      if (idx !== -1) {
        memoryStore.companies[idx] = { ...memoryStore.companies[idx], ...req.body };
        updated = memoryStore.companies[idx];
      }
    }
    return res.json(updated || { id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    let newUser = null;
    if (isDbConnected()) {
      try {
        const count = await User.countDocuments();
        const id = count + 1;
        newUser = new User({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          ...req.body
        });
        await newUser.save();
      } catch (dbErr) {
        console.warn('createUser DB fallback:', dbErr.message);
      }
    }
    if (!newUser) {
      const id = memoryStore.users.length + 1;
      newUser = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        ...req.body
      };
      memoryStore.users.push(newUser);
    }
    return res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let updated = null;
    if (isDbConnected()) {
      try {
        updated = await User.findOneAndUpdate({ id }, req.body, { new: true });
      } catch (dbErr) {
        console.warn('updateUser DB fallback:', dbErr.message);
      }
    }
    if (!updated) {
      const idx = memoryStore.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        memoryStore.users[idx] = { ...memoryStore.users[idx], ...req.body };
        updated = memoryStore.users[idx];
      }
    }
    return res.json(updated || { id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isDbConnected()) {
      try {
        await User.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('deleteUser DB fallback:', dbErr.message);
      }
    }
    const idx = memoryStore.users.findIndex(u => u.id === id);
    if (idx !== -1) memoryStore.users.splice(idx, 1);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOperators = async (req, res) => {
  try {
    return res.json(memoryStore.operators || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOperator = async (req, res) => {
  try {
    const id = (memoryStore.operators?.length || 0) + 1;
    const op = { id, ...req.body };
    memoryStore.operators = memoryStore.operators || [];
    memoryStore.operators.push(op);
    return res.json(op);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOperator = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const idx = (memoryStore.operators || []).findIndex(o => o.id === id);
    if (idx !== -1) {
      memoryStore.operators[idx] = { ...memoryStore.operators[idx], ...req.body };
      return res.json(memoryStore.operators[idx]);
    }
    return res.status(404).json({ error: 'Operator not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOperator = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const idx = (memoryStore.operators || []).findIndex(o => o.id === id);
    if (idx !== -1) memoryStore.operators.splice(idx, 1);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDrivers = async (req, res) => {
  try {
    return res.json(memoryStore.drivers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const id = (memoryStore.drivers?.length || 0) + 1;
    const dr = { id, ...req.body };
    memoryStore.drivers = memoryStore.drivers || [];
    memoryStore.drivers.push(dr);
    return res.json(dr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const idx = (memoryStore.drivers || []).findIndex(d => d.id === id);
    if (idx !== -1) {
      memoryStore.drivers[idx] = { ...memoryStore.drivers[idx], ...req.body };
      return res.json(memoryStore.drivers[idx]);
    }
    return res.status(404).json({ error: 'Driver not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const idx = (memoryStore.drivers || []).findIndex(d => d.id === id);
    if (idx !== -1) memoryStore.drivers.splice(idx, 1);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSpareParts = async (req, res) => {
  try {
    return res.json(memoryStore.spareParts || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSparePart = async (req, res) => {
  try {
    const id = (memoryStore.spareParts?.length || 0) + 1;
    const item = { id, ...req.body };
    memoryStore.spareParts = memoryStore.spareParts || [];
    memoryStore.spareParts.push(item);
    return res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    return res.json(memoryStore.suppliers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const id = (memoryStore.suppliers?.length || 0) + 1;
    const item = { id, ...req.body };
    memoryStore.suppliers = memoryStore.suppliers || [];
    memoryStore.suppliers.push(item);
    return res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    return res.json(memoryStore.purchases || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const id = (memoryStore.purchases?.length || 0) + 1;
    const item = { id, ...req.body };
    memoryStore.purchases = memoryStore.purchases || [];
    memoryStore.purchases.push(item);
    return res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    return res.json(memoryStore.notifications || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    (memoryStore.notifications || []).forEach(n => { n.isRead = true; });
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
