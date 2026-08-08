import Customer from '../models/Customer.js';
import logAudit from '../services/auditService.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getCustomers = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const customers = await Customer.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(customers);
      } catch (dbErr) {
        console.warn('getCustomers DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    let newCustomer = null;
    if (isDbConnected()) {
      try {
        const count = await Customer.countDocuments();
        const id = count + 1;
        newCustomer = new Customer({
          id,
          companyId: req.currentUser?.companyId || 1,
          outstandingBalance: 0,
          creditLimit: 100000,
          mobile: req.body.mobile || req.body.phone,
          phone: req.body.phone || req.body.mobile,
          address: req.body.address || req.body.billingAddress,
          billingAddress: req.body.billingAddress || req.body.address,
          ...req.body
        });
        await newCustomer.save();
      } catch (dbErr) {
        console.warn('createCustomer DB fallback:', dbErr.message);
      }
    }

    if (!newCustomer) {
      const id = memoryStore.customers.length + 1;
      newCustomer = {
        id,
        companyId: req.currentUser?.companyId || 1,
        outstandingBalance: 0,
        creditLimit: 100000,
        ...req.body
      };
      memoryStore.customers.push(newCustomer);
    }

    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'CREATE_CUSTOMER', `Registered customer ${newCustomer.name}`);
    return res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let updated = null;
    if (isDbConnected()) {
      try {
        updated = await Customer.findOneAndUpdate({ id }, req.body, { new: true });
      } catch (dbErr) {
        console.warn('updateCustomer DB fallback:', dbErr.message);
      }
    }

    if (!updated) {
      const idx = memoryStore.customers.findIndex(c => c.id === id);
      if (idx !== -1) {
        memoryStore.customers[idx] = { ...memoryStore.customers[idx], ...req.body };
        updated = memoryStore.customers[idx];
      }
    }

    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'UPDATE_CUSTOMER', `Updated customer ${updated.name}`);
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let deleted = null;
    if (isDbConnected()) {
      try {
        deleted = await Customer.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('deleteCustomer DB fallback:', dbErr.message);
      }
    }

    if (!deleted) {
      const idx = memoryStore.customers.findIndex(c => c.id === id);
      if (idx !== -1) {
        deleted = memoryStore.customers[idx];
        memoryStore.customers.splice(idx, 1);
      }
    }

    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'DELETE_CUSTOMER', `Deleted customer ${deleted.name}`);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
