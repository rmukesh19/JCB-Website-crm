import Customer from '../models/Customer.js';

const getNextId = async () => {
  const last = await Customer.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const findCustomerById = (id) => {
  if (id && String(id).length === 24) {
    return Customer.findOne({ $or: [{ _id: id }, { id: Number(id) || -1 }] });
  }
  const num = Number(id);
  if (!isNaN(num)) {
    return Customer.findOne({ $or: [{ id: num }, { _id: id }] });
  }
  return Customer.findOne({ _id: id });
};

const formatCustomer = (c) => {
  const obj = c.toObject ? c.toObject() : c;
  return {
    ...obj,
    id: obj.id || obj._id,
    name: obj.name || obj.company || 'Customer',
    company: obj.company || obj.name || 'Customer',
    customerType: obj.customerType || 'Individual / Home Owner',
    phone: obj.phone || obj.mobile || '',
    mobile: obj.mobile || obj.phone || '',
    outstanding: Number(obj.outstanding !== undefined ? obj.outstanding : (obj.currentBalance || 0)),
    currentBalance: Number(obj.currentBalance !== undefined ? obj.currentBalance : (obj.outstanding || 0)),
    creditLimit: Number(obj.creditLimit || 100000),
    status: obj.status || 'ACTIVE'
  };
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ id: 1 });
    res.json(customers.map(formatCustomer));
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers', details: err.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const rawMobile = req.body.mobile || req.body.phone || '';
    const rawName = (req.body.name || req.body.company || '').trim();

    const cleanPhone = (p) => {
      const d = String(p || '').replace(/\D/g, '');
      return d.length >= 10 ? d.slice(-10) : d;
    };
    const targetPhone = cleanPhone(rawMobile);
    const targetName = rawName.toLowerCase();

    if (targetPhone || targetName) {
      const existing = await Customer.find();
      const duplicate = existing.find(c => {
        const cPhone = cleanPhone(c.mobile || c.phone);
        if (targetPhone && cPhone && targetPhone === cPhone) return true;
        if (targetName && (c.name || '').trim().toLowerCase() === targetName && (c.company || '').trim().toLowerCase() === (req.body.company || '').trim().toLowerCase()) return true;
        return false;
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Duplicate Entry! A customer with phone "${rawMobile || duplicate.mobile}" or name "${rawName}" already exists (${duplicate.name}).`,
          duplicate: true
        });
      }
    }

    const nextId = await getNextId();
    const formatted = formatCustomer({
      ...req.body,
      id: nextId,
      companyId: req.body.companyId || req.currentUser?.companyId || 1
    });

    const created = await Customer.create(formatted);
    res.status(201).json(formatCustomer(created));
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Failed to create customer', details: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await findCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const formatted = formatCustomer({ ...customer.toObject(), ...req.body });
    Object.assign(customer, formatted);
    await customer.save();

    res.json(formatCustomer(customer));
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Failed to update customer', details: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await findCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    await Customer.deleteOne({ _id: customer._id });
    res.json({ success: true, message: 'Customer removed' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: 'Failed to delete customer', details: err.message });
  }
};
