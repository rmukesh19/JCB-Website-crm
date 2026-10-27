import Expense from '../models/Expense.js';

const getNextId = async () => {
  const last = await Expense.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ id: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses', details: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const nextId = await getNextId();
    const expData = {
      ...req.body,
      id: nextId,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      branchId: req.body.branchId || req.currentUser?.branchId || 1,
      date: req.body.date || new Date().toISOString().split('T')[0],
      amount: Number(req.body.amount || 0)
    };

    const newExpense = await Expense.create(expData);
    res.status(201).json(newExpense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense', details: err.message });
  }
};
