import Invoice from '../models/Invoice.js';
import Expense from '../models/Expense.js';
import DieselRecord from '../models/DieselRecord.js';
import Machine from '../models/Machine.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getFinancialReport = async (req, res) => {
  try {
    let invoices = [];
    let expenses = [];
    let diesel = [];

    if (isDbConnected()) {
      try {
        invoices = await Invoice.find({ companyId: req.currentUser?.companyId || 1 });
        expenses = await Expense.find({ companyId: req.currentUser?.companyId || 1 });
        diesel = await DieselRecord.find({ companyId: req.currentUser?.companyId || 1 });
      } catch (dbErr) {
        console.warn('getFinancialReport DB fallback:', dbErr.message);
        invoices = memoryStore.invoices;
        expenses = memoryStore.expenses;
        diesel = memoryStore.dieselRecords;
      }
    } else {
      invoices = memoryStore.invoices;
      expenses = memoryStore.expenses;
      diesel = memoryStore.dieselRecords;
    }

    const totalIncome = invoices.reduce((acc, inv) => acc + (inv.subtotal || 0), 0);
    const totalTaxCollected = invoices.reduce((acc, inv) => acc + (inv.totalTax || 0), 0);
    const totalExpense = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
    const totalDieselCost = diesel.reduce((acc, dsl) => acc + (dsl.totalCost || 0), 0);

    return res.json({
      totalIncome,
      totalTaxCollected,
      totalExpense,
      totalDieselCost,
      netProfit: totalIncome - (totalExpense + totalDieselCost)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMachineUtilizationReport = async (req, res) => {
  try {
    let machines = [];
    if (isDbConnected()) {
      try {
        machines = await Machine.find({ companyId: req.currentUser?.companyId || 1 });
      } catch (dbErr) {
        console.warn('getMachineUtilizationReport DB fallback:', dbErr.message);
        machines = memoryStore.machines;
      }
    } else {
      machines = memoryStore.machines;
    }

    return res.json(machines.map(m => ({
      machineId: m.id,
      plateNumber: m.plateNumber,
      modelName: m.modelName,
      totalHours: m.currentHours,
      status: m.status
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
