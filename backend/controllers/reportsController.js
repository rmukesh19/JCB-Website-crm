import db from '../services/memoryStore.js';

export const getFinancialReport = async (req, res) => {
  res.json({
    success: true,
    data: {
      revenue: db.invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0),
      expenses: db.expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
      profit: db.invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0) - db.expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
      monthlyTrends: [
        { month: 'Jan', revenue: 240000, expenses: 140000 },
        { month: 'Feb', revenue: 310000, expenses: 165000 },
        { month: 'Mar', revenue: 195000, expenses: 95000 }
      ]
    }
  });
};

export const getMachineUtilizationReport = async (req, res) => {
  const data = db.machines.map(m => ({
    machineName: m.name,
    registration: m.regNumber,
    totalHours: m.currentMeterReading,
    utilizationRate: '88%'
  }));
  res.json({ success: true, data });
};
