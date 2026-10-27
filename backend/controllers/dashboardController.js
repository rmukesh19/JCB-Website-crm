import db from '../services/memoryStore.js';

export const getDashboardMetrics = async (req, res) => {
  const companyId = req.currentUser?.companyId || 1;
  const machines = db.machines.filter(m => m.companyId === companyId);
  const activeBookings = db.bookings.filter(b => b.companyId === companyId && b.status === 'IN_PROGRESS');
  const invoices = db.invoices.filter(i => i.companyId === companyId);
  const expenses = db.expenses.filter(e => e.companyId === companyId);
  const customers = db.customers.filter(c => c.companyId === companyId);

  const totalRevenue = invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const outstandingBalance = invoices.reduce((sum, i) => sum + (i.balanceAmount || 0), 0);

  res.json({
    success: true,
    data: {
      activeFleet: machines.filter(m => m.status === 'ACTIVE').length,
      totalFleet: machines.length,
      activeJobs: activeBookings.length,
      totalCustomers: customers.length,
      monthlyRevenue: totalRevenue,
      totalExpenses,
      outstandingBalance,
      netProfit: totalRevenue - totalExpenses,
      recentBookings: db.bookings.slice(-5),
      recentExpenses: db.expenses.slice(-5)
    }
  });
};
