import db from '../services/memoryStore.js';

export const getFinancialReport = async (req, res) => {
  const invoices = db.invoices || [];
  const expenses = db.expenses || [];
  const rev = invoices.reduce((sum, i) => sum + (i.totalAmount || i.grandTotal || 0), 0);
  const exp = expenses.reduce((sum, e) => sum + (e.amount || e.totalCost || 0), 0);

  res.json({
    success: true,
    data: {
      revenue: rev,
      expenses: exp,
      profit: rev - exp,
      monthlyTrends: []
    }
  });
};

export const getMachineUtilizationReport = async (req, res) => {
  const machines = db.machines || [];
  const data = machines.map(m => ({
    machineName: m.name,
    registration: m.regNumber || m.plateNumber || '',
    totalHours: m.currentMeterReading || m.currentHours || 0,
    utilizationRate: m.currentHours > 0 ? `${Math.min(100, Math.round((m.currentHours / 1000) * 100))}%` : '0%'
  }));
  res.json({ success: true, data });
};
