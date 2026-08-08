import Booking from '../models/Booking.js';
import Machine from '../models/Machine.js';
import Operator from '../models/Operator.js';
import Driver from '../models/Driver.js';
import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import logAudit from '../services/auditService.js';
import triggerWhatsAppAutomation from '../services/whatsappService.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getBookings = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const bookings = await Booking.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(bookings);
      } catch (dbErr) {
        console.warn('getBookings DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    let booking = null;
    if (isDbConnected()) {
      try {
        const count = await Booking.countDocuments();
        const id = count + 1;
        booking = new Booking({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          status: req.body.status || 'PENDING',
          startDate: new Date().toISOString(),
          ...req.body
        });

        await booking.save();

        if (booking.status === 'ACTIVE') {
          await Machine.findOneAndUpdate({ id: booking.machineId }, { status: 'RUNNING' });
          await Operator.findOneAndUpdate({ id: booking.operatorId }, { status: 'ON_DUTY' });
          if (booking.driverId) {
            await Driver.findOneAndUpdate({ id: booking.driverId }, { status: 'ON_DUTY' });
          }
        }
      } catch (dbErr) {
        console.warn('createBooking DB fallback:', dbErr.message);
      }
    }

    if (!booking) {
      const id = memoryStore.bookings.length + 1;
      booking = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        status: req.body.status || 'PENDING',
        startDate: new Date().toISOString(),
        ...req.body
      };
      memoryStore.bookings.push(booking);

      const m = memoryStore.machines.find(x => x.id === booking.machineId);
      if (m && booking.status === 'ACTIVE') m.status = 'RUNNING';
    }

    const customer = memoryStore.customers.find(c => c.id === booking.customerId);
    if (customer) {
      triggerWhatsAppAutomation(req.currentUser?.companyId, 'Booking Confirmation', {
        customerName: customer.name,
        whatsAppNumber: customer.whatsApp || customer.mobile,
        bookingDate: booking.startDate,
        amount: booking.billingRate
      });
    }

    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'CREATE_BOOKING', `Booked machine ID ${booking.machineId}`);
    return res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let oldBooking = null;
    let updatedBooking = null;

    if (isDbConnected()) {
      try {
        oldBooking = await Booking.findOne({ id });
        if (oldBooking) {
          updatedBooking = await Booking.findOneAndUpdate({ id }, req.body, { new: true });
          if (oldBooking.status === 'ACTIVE' && updatedBooking.status === 'COMPLETED') {
            const endHours = parseInt(req.body.endHours || updatedBooking.startHours + 8, 10);
            updatedBooking.endHours = endHours;
            updatedBooking.endDate = new Date().toISOString();
            await updatedBooking.save();

            const diffHours = Math.max(1, endHours - updatedBooking.startHours);
            let subtotal = diffHours * parseFloat(updatedBooking.billingRate);

            const cgstAmount = Math.round(subtotal * 0.09);
            const sgstAmount = Math.round(subtotal * 0.09);
            const grandTotal = subtotal + cgstAmount + sgstAmount;

            const invCount = await Invoice.countDocuments();
            const invId = invCount + 1;
            const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invId).padStart(4, '0')}`;

            const newInvoice = new Invoice({
              id: invId,
              companyId: req.currentUser?.companyId || 1,
              branchId: req.currentUser?.branchId || 1,
              bookingId: updatedBooking.id,
              customerId: updatedBooking.customerId,
              invoiceNumber,
              invoiceDate: new Date().toISOString().split('T')[0],
              subtotal,
              cgstAmount,
              sgstAmount,
              totalTax: cgstAmount + sgstAmount,
              grandTotal,
              paidAmount: 0,
              outstandingAmount: grandTotal,
              status: 'UNPAID'
            });
            await newInvoice.save();

            await Machine.findOneAndUpdate({ id: updatedBooking.machineId }, { status: 'AVAILABLE', currentHours: endHours });
            await Operator.findOneAndUpdate({ id: updatedBooking.operatorId }, { status: 'AVAILABLE' });
            if (updatedBooking.driverId) {
              await Driver.findOneAndUpdate({ id: updatedBooking.driverId }, { status: 'AVAILABLE' });
            }
            await Customer.findOneAndUpdate({ id: updatedBooking.customerId }, { $inc: { outstandingBalance: grandTotal } });
          }
        }
      } catch (dbErr) {
        console.warn('updateBooking DB fallback:', dbErr.message);
      }
    }

    if (!updatedBooking) {
      const idx = memoryStore.bookings.findIndex(b => b.id === id);
      if (idx !== -1) {
        oldBooking = { ...memoryStore.bookings[idx] };
        memoryStore.bookings[idx] = { ...memoryStore.bookings[idx], ...req.body };
        updatedBooking = memoryStore.bookings[idx];

        if (oldBooking.status === 'ACTIVE' && updatedBooking.status === 'COMPLETED') {
          const endHours = parseInt(req.body.endHours || updatedBooking.startHours + 8, 10);
          updatedBooking.endHours = endHours;
          updatedBooking.endDate = new Date().toISOString();

          const diffHours = Math.max(1, endHours - updatedBooking.startHours);
          let subtotal = diffHours * parseFloat(updatedBooking.billingRate);
          const cgstAmount = Math.round(subtotal * 0.09);
          const sgstAmount = Math.round(subtotal * 0.09);
          const grandTotal = subtotal + cgstAmount + sgstAmount;

          const invId = memoryStore.invoices.length + 1;
          const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invId).padStart(4, '0')}`;
          const newInvoice = {
            id: invId,
            companyId: req.currentUser?.companyId || 1,
            branchId: req.currentUser?.branchId || 1,
            bookingId: updatedBooking.id,
            customerId: updatedBooking.customerId,
            invoiceNumber,
            invoiceDate: new Date().toISOString().split('T')[0],
            subtotal,
            cgstAmount,
            sgstAmount,
            totalTax: cgstAmount + sgstAmount,
            grandTotal,
            paidAmount: 0,
            outstandingAmount: grandTotal,
            status: 'UNPAID'
          };
          memoryStore.invoices.push(newInvoice);

          const m = memoryStore.machines.find(x => x.id === updatedBooking.machineId);
          if (m) {
            m.status = 'AVAILABLE';
            m.currentHours = endHours;
          }
          const c = memoryStore.customers.find(x => x.id === updatedBooking.customerId);
          if (c) c.outstandingBalance = (c.outstandingBalance || 0) + grandTotal;
        }
      }
    }

    if (!updatedBooking) return res.status(404).json({ error: 'Booking not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'UPDATE_BOOKING', `Updated booking ID ${id}`);
    return res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
