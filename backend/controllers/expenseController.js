import Expense from '../models/Expense.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getExpenses = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const expenses = await Expense.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(expenses);
      } catch (dbErr) {
        console.warn('getExpenses DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    let expense = null;
    if (isDbConnected()) {
      try {
        const count = await Expense.countDocuments();
        const id = count + 1;
        expense = new Expense({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          expenseDate: new Date().toISOString().split('T')[0],
          ...req.body
        });
        await expense.save();
      } catch (dbErr) {
        console.warn('createExpense DB fallback:', dbErr.message);
      }
    }

    if (!expense) {
      const id = memoryStore.expenses.length + 1;
      expense = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        expenseDate: new Date().toISOString().split('T')[0],
        ...req.body
      };
      memoryStore.expenses.push(expense);
    }

    return res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
