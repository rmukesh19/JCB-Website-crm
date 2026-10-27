import Booking from '../models/Booking.js';
import Machine from '../models/Machine.js';
import Operator from '../models/Operator.js';
import Invoice from '../models/Invoice.js';

const getNextId = async (Model) => {
  const last = await Model.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const findBookingById = (id) => {
  if (!id) return null;
  const strId = String(id);
  const numId = Number(id);
  if (!isNaN(numId)) {
    return Booking.findOne({ $or: [{ id: numId }, { id: strId }, { _id: strId }, { _id: id }] });
  }
  return Booking.findOne({ $or: [{ _id: strId }, { id: strId }] });
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ id: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const nextId = await getNextId(Booking);
    const count = await Booking.countDocuments();
    const totalAmount = Number(req.body.totalAmount || 0);
    const advanceReceived = Number(req.body.advanceReceived || 0);

    const bookingData = {
      ...req.body,
      id: nextId,
      bookingNumber: req.body.bookingNumber || `BKG-2026-${String(count + 91).padStart(4, '0')}`,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      branchId: req.body.branchId || req.currentUser?.branchId || 1,
      status: req.body.status || 'ACTIVE',
      startDate: req.body.startDate || new Date().toISOString().split('T')[0],
      startTime: req.body.startTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      startHours: Number(req.body.startHours || 0),
      totalHours: Number(req.body.totalHours || 0),
      totalAmount,
      advanceReceived,
      balanceDue: totalAmount - advanceReceived
    };

    const newBooking = await Booking.create(bookingData);

    if (newBooking.status === 'COMPLETED') {
      try {
        const invNextId = await getNextId(Invoice);
        const invCount = await Invoice.countDocuments();
        
        let calcSubtotal = newBooking.totalAmount || 0;
        const gstAmount = (calcSubtotal * 18) / 100;
        const grandTotal = calcSubtotal + gstAmount;
        const outDue = Math.max(0, grandTotal - (newBooking.advanceReceived || 0));

        await Invoice.create({
          id: invNextId,
          bookingId: newBooking.id,
          invoiceNumber: `INV-2026-${String(invCount + 43).padStart(4, '0')}`,
          companyId: newBooking.companyId || 1,
          branchId: newBooking.branchId || 1,
          customerId: newBooking.customerId,
          customerName: newBooking.customerName || 'Contract Client',
          date: new Date().toISOString().split('T')[0],
          invoiceDate: new Date().toISOString().split('T')[0],
          subtotal: calcSubtotal,
          subTotal: calcSubtotal,
          gstRate: 18,
          gstAmount,
          grandTotal,
          totalAmount: grandTotal,
          paidAmount: newBooking.advanceReceived || 0,
          receivedAmount: newBooking.advanceReceived || 0,
          outstandingAmount: outDue,
          balanceAmount: outDue,
          status: outDue <= 0 ? 'PAID' : ((newBooking.advanceReceived || 0) > 0 ? 'PARTIAL' : 'ISSUED')
        });
      } catch (invErr) {
        console.warn('Auto invoice generation notice on create:', invErr.message);
      }
    } else {
      // Update machine status to RUNNING only if not completed
      if (req.body.machineId) {
        const machine = await Machine.findOne({ $or: [{ id: req.body.machineId }, { id: Number(req.body.machineId) }, { _id: req.body.machineId }] });
        if (machine) {
          machine.status = 'RUNNING';
          await machine.save();
        }
      }

      // Update operator status to ON_DUTY
      if (req.body.operatorId) {
        const operator = await Operator.findOne({ $or: [{ id: req.body.operatorId }, { id: Number(req.body.operatorId) }, { _id: req.body.operatorId }] });
        if (operator) {
          operator.status = 'ON_DUTY';
          await operator.save();
        }
      }
    }

    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await findBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    Object.assign(booking, req.body);

    const isCompleted = (req.body.status || '').toUpperCase() === 'COMPLETED';

    if (isCompleted) {
      booking.status = 'COMPLETED';
      const startH = Number(booking.startHours || 0);
      const endH = Number(req.body.endHours !== undefined ? req.body.endHours : (booking.endHours || startH + 8));
      booking.endHours = endH;
      const hoursDiff = Math.max(1, endH - startH);
      booking.totalHours = hoursDiff;

      const rate = Number(booking.billingRate || booking.ratePerHour || 2800);
      const billingType = String(booking.billingType || 'HOURLY').toUpperCase();
      let calcSubtotal = rate * hoursDiff;
      if (billingType === 'DAILY') calcSubtotal = rate;
      if (billingType === 'WEEKLY') calcSubtotal = rate;
      if (billingType === 'MONTHLY') calcSubtotal = rate;
      if (billingType === 'CONTRACT') calcSubtotal = rate;

      booking.totalAmount = booking.totalAmount || calcSubtotal;
      const adv = Number(booking.advanceReceived || 0);
      booking.balanceDue = Math.max(0, booking.totalAmount - adv);

      // Release Machine
      if (booking.machineId) {
        const machine = await Machine.findOne({ $or: [{ id: booking.machineId }, { id: Number(booking.machineId) }, { _id: booking.machineId }] });
        if (machine) {
          machine.status = 'AVAILABLE';
          machine.currentHours = Math.max(Number(machine.currentHours || 0), endH);
          await machine.save();
        }
      }

      // Release Operator
      if (booking.operatorId) {
        const operator = await Operator.findOne({ $or: [{ id: booking.operatorId }, { id: Number(booking.operatorId) }, { _id: booking.operatorId }] });
        if (operator) {
          operator.status = 'AVAILABLE';
          await operator.save();
        }
      }

      // Auto-generate invoice if not exists
      try {
        const existingInv = await Invoice.findOne({ bookingId: booking.id });
        if (!existingInv) {
          const invNextId = await getNextId(Invoice);
          const invCount = await Invoice.countDocuments();
          const gstAmount = (calcSubtotal * 18) / 100;
          const grandTotal = calcSubtotal + gstAmount;
          const outDue = Math.max(0, grandTotal - adv);

          await Invoice.create({
            id: invNextId,
            bookingId: booking.id,
            invoiceNumber: `INV-2026-${String(invCount + 43).padStart(4, '0')}`,
            companyId: booking.companyId || 1,
            branchId: booking.branchId || 1,
            customerId: booking.customerId,
            customerName: booking.customerName || 'Contract Client',
            date: new Date().toISOString().split('T')[0],
            invoiceDate: new Date().toISOString().split('T')[0],
            subtotal: calcSubtotal,
            subTotal: calcSubtotal,
            gstRate: 18,
            gstAmount,
            grandTotal,
            totalAmount: grandTotal,
            paidAmount: adv,
            receivedAmount: adv,
            outstandingAmount: outDue,
            balanceAmount: outDue,
            status: outDue <= 0 ? 'PAID' : (adv > 0 ? 'PARTIAL' : 'ISSUED')
          });
        }
      } catch (invErr) {
        console.warn('Auto invoice generation notice:', invErr.message);
      }
    } else {
      if (req.body.totalAmount !== undefined || req.body.advanceReceived !== undefined) {
        const tot = Number(booking.totalAmount || 0);
        const adv = Number(booking.advanceReceived || 0);
        booking.balanceDue = tot - adv;
      }
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking', details: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await findBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await Booking.deleteOne({ _id: booking._id });
    res.json({ success: true, message: 'Booking removed' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking', details: err.message });
  }
};

