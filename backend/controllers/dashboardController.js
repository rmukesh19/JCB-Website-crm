import Machine from '../models/Machine.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

// Bug 3 Fix: When DB is connected, COUNT from DB then ADD memoryStore counts
// so that both persisted and in-memory records are reflected on the dashboard.
export const getDashboardMetrics = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const [
          dbMachines, dbActiveMachines,
          dbBookings, dbActiveBookings,
          dbCustomers, dbActiveLeads,
          dbInvoices
        ] = await Promise.all([
          Machine.countDocuments(),
          Machine.countDocuments({ status: 'RUNNING' }),
          Booking.countDocuments(),
          Booking.countDocuments({ status: 'ACTIVE' }),
          Customer.countDocuments(),
          Lead.countDocuments({ status: { $ne: 'LOST' } }),
          Invoice.find()
        ]);

        // Add memoryStore counts for records not yet persisted to DB
        const memMachines = memoryStore.machines.length;
        const memActiveMachines = memoryStore.machines.filter(m => m.status === 'RUNNING').length;
        const memBookings = memoryStore.bookings.length;
        const memActiveBookings = memoryStore.bookings.filter(b => b.status === 'ACTIVE').length;
        const memCustomers = memoryStore.customers.length;
        const memLeads = memoryStore.leads.filter(l => l.status !== 'LOST').length;

        const allInvoices = [
          ...dbInvoices,
          ...memoryStore.invoices.filter(mi => !dbInvoices.find(di => di.id === mi.id))
        ];

        const totalRevenue = allInvoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
        const totalOutstanding = allInvoices.reduce((acc, inv) => acc + (inv.outstandingAmount || 0), 0);

        return res.json({
          totalMachines: dbMachines + memMachines,
          activeMachines: dbActiveMachines + memActiveMachines,
          totalBookings: dbBookings + memBookings,
          activeBookings: dbActiveBookings + memActiveBookings,
          totalCustomers: dbCustomers + memCustomers,
          activeLeads: dbActiveLeads + memLeads,
          totalRevenue,
          totalOutstanding
        });
      } catch (dbErr) {
        console.warn('Dashboard DB fallback:', dbErr.message);
      }
    }

    // Pure memoryStore fallback (when DB is offline)
    const totalMachines = memoryStore.machines.length;
    const activeMachines = memoryStore.machines.filter(m => m.status === 'RUNNING').length;
    const totalBookings = memoryStore.bookings.length;
    const activeBookings = memoryStore.bookings.filter(b => b.status === 'ACTIVE').length;
    const totalCustomers = memoryStore.customers.length;
    const activeLeads = memoryStore.leads.filter(l => l.status !== 'LOST').length;

    const totalRevenue = memoryStore.invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
    const totalOutstanding = memoryStore.invoices.reduce((acc, inv) => acc + (inv.outstandingAmount || 0), 0);

    return res.json({
      totalMachines,
      activeMachines,
      totalBookings,
      activeBookings,
      totalCustomers,
      activeLeads,
      totalRevenue,
      totalOutstanding
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
