import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';
import logAudit from '../services/auditService.js';
import triggerWhatsAppAutomation from '../services/whatsappService.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

// Bug 1 Fix: Always merge DB invoices + memoryStore invoices so auto-generated
// invoices from booking completion (saved to DB) and in-memory ones are both visible.
export const getInvoices = async (req, res) => {
  try {
    const companyId = req.currentUser?.companyId || 1;
    let dbInvoices = [];
    if (isDbConnected()) {
      try {
        dbInvoices = await Invoice.find({ companyId });
      } catch (dbErr) {
        console.warn('getInvoices DB fallback:', dbErr.message);
      }
    }
    // Merge: DB invoices take priority, append memoryStore ones not already in DB
    const dbIds = new Set(dbInvoices.map(i => i.id));
    const memInvoices = memoryStore.invoices.filter(i => !dbIds.has(i.id));
    return res.json([...dbInvoices, ...memInvoices]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bug 2 Fix: Add standalone invoice creation endpoint (POST /api/invoices)
export const createInvoice = async (req, res) => {
  try {
    const companyId = req.currentUser?.companyId || 1;
    const branchId = req.currentUser?.branchId || 1;

    let newInvoice = null;

    if (isDbConnected()) {
      try {
        const count = await Invoice.countDocuments();
        const id = count + memoryStore.invoices.length + 1;
        const invoiceNumber = req.body.invoiceNumber ||
          `INV-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;

        newInvoice = new Invoice({
          id,
          companyId,
          branchId,
          invoiceNumber,
          invoiceDate: req.body.invoiceDate || new Date().toISOString().split('T')[0],
          ...req.body,
          companyId,
          branchId
        });
        await newInvoice.save();
      } catch (dbErr) {
        console.warn('createInvoice DB fallback:', dbErr.message);
      }
    }

    if (!newInvoice) {
      const id = memoryStore.invoices.length + 1;
      const invoiceNumber = req.body.invoiceNumber ||
        `INV-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
      newInvoice = {
        id,
        companyId,
        branchId,
        invoiceNumber,
        invoiceDate: req.body.invoiceDate || new Date().toISOString().split('T')[0],
        paidAmount: 0,
        outstandingAmount: req.body.grandTotal || req.body.totalAmount || 0,
        status: 'UNPAID',
        ...req.body,
        companyId,
        branchId
      };
      memoryStore.invoices.push(newInvoice);
    }

    // Update customer outstanding balance
    const customerId = req.body.customerId;
    if (customerId) {
      const grandTotal = req.body.grandTotal || req.body.totalAmount || 0;
      if (isDbConnected()) {
        try {
          await Customer.findOneAndUpdate(
            { id: customerId },
            { $inc: { outstandingBalance: grandTotal } }
          );
        } catch (_) {}
      } else {
        const c = memoryStore.customers.find(x => x.id === customerId);
        if (c) c.outstandingBalance = (c.outstandingBalance || 0) + grandTotal;
      }
    }

    await logAudit(
      companyId,
      req.currentUser?.id,
      req.currentUser?.name,
      'CREATE_INVOICE',
      `Invoice ${newInvoice.invoiceNumber || newInvoice.id} created`
    );
    return res.json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const receivePayment = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { amount, paymentMode } = req.body;
    const payAmt = parseFloat(amount || 0);

    let inv = null;
    let customer = null;

    if (isDbConnected()) {
      try {
        inv = await Invoice.findOne({ id });
        if (inv) {
          inv.paidAmount = (inv.paidAmount || 0) + payAmt;
          inv.outstandingAmount = Math.max(0, inv.grandTotal - inv.paidAmount);
          inv.status = inv.outstandingAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';
          await inv.save();

          customer = await Customer.findOne({ id: inv.customerId });
          if (customer) {
            customer.outstandingBalance = Math.max(0, (customer.outstandingBalance || 0) - payAmt);
            await customer.save();
          }
        }
      } catch (dbErr) {
        console.warn('receivePayment DB fallback:', dbErr.message);
      }
    }

    if (!inv) {
      inv = memoryStore.invoices.find(i => i.id === id);
      if (inv) {
        inv.paidAmount = (inv.paidAmount || 0) + payAmt;
        inv.outstandingAmount = Math.max(0, inv.grandTotal - inv.paidAmount);
        inv.status = inv.outstandingAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';

        customer = memoryStore.customers.find(c => c.id === inv.customerId);
        if (customer) {
          customer.outstandingBalance = Math.max(0, (customer.outstandingBalance || 0) - payAmt);
        }
      }
    }

    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    if (customer) {
      triggerWhatsAppAutomation(req.currentUser?.companyId, 'Payment Reminder', {
        customerName: customer.name,
        whatsAppNumber: customer.whatsApp || customer.mobile,
        invoiceNo: inv.invoiceNumber,
        amount: payAmt
      });
    }

    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'PAYMENT_RECEIVE', `Received payment ${payAmt} against ${inv.invoiceNumber}`);
    return res.json({ success: true, invoice: inv });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
