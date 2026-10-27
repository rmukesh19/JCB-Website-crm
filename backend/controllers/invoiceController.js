import Invoice from '../models/Invoice.js';
import Transaction from '../models/Transaction.js';

const getNextId = async (Model) => {
  const last = await Model.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const findInvoiceById = (id) => {
  if (id && String(id).length === 24) {
    return Invoice.findOne({ $or: [{ _id: id }, { id: Number(id) || -1 }] });
  }
  const num = Number(id);
  if (!isNaN(num)) {
    return Invoice.findOne({ $or: [{ id: num }, { _id: id }] });
  }
  return Invoice.findOne({ _id: id });
};

const formatInvoice = (inv) => {
  const obj = inv.toObject ? inv.toObject() : inv;
  const dateStr = obj.invoiceDate || obj.date || new Date().toISOString().split('T')[0];
  const sub = Number(obj.subtotal !== undefined ? obj.subtotal : (obj.subTotal || obj.amount || 0));
  const tot = Number(obj.grandTotal !== undefined ? obj.grandTotal : (obj.totalAmount || sub));
  const paid = Number(obj.paidAmount !== undefined ? obj.paidAmount : (obj.receivedAmount || 0));
  const balance = Number(obj.outstandingAmount !== undefined ? obj.outstandingAmount : (obj.balanceAmount !== undefined ? obj.balanceAmount : Math.max(0, tot - paid)));

  return {
    ...obj,
    id: obj.id || obj._id,
    date: dateStr,
    invoiceDate: dateStr,
    subtotal: sub,
    subTotal: sub,
    grandTotal: tot,
    totalAmount: tot,
    paidAmount: paid,
    receivedAmount: paid,
    outstandingAmount: balance,
    balanceAmount: balance,
    status: balance <= 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'ISSUED')
  };
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ id: -1 });
    res.json(invoices.map(formatInvoice));
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to fetch invoices', details: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const item = await findInvoiceById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Invoice not found' });
    res.json(formatInvoice(item));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoice', details: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const nextId = await getNextId(Invoice);
    const count = await Invoice.countDocuments();
    const subTotal = Number(req.body.subTotal || req.body.subtotal || req.body.amount || 0);
    const gstRate = Number(req.body.gstRate || 18);
    const gstAmount = Number(req.body.gstAmount || (subTotal * gstRate) / 100);
    const totalAmount = Number(req.body.totalAmount || req.body.grandTotal || (subTotal + gstAmount));
    const receivedAmount = Number(req.body.receivedAmount || req.body.paidAmount || 0);
    const balanceAmount = totalAmount - receivedAmount;
    const dateStr = req.body.invoiceDate || req.body.date || new Date().toISOString().split('T')[0];

    const newInv = formatInvoice({
      ...req.body,
      id: nextId,
      invoiceNumber: req.body.invoiceNumber || `INV-2026-${String(count + 43).padStart(4, '0')}`,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      branchId: req.body.branchId || req.currentUser?.branchId || 1,
      date: dateStr,
      invoiceDate: dateStr,
      subTotal,
      subtotal: subTotal,
      gstRate,
      gstAmount,
      totalAmount,
      grandTotal: totalAmount,
      receivedAmount,
      paidAmount: receivedAmount,
      balanceAmount,
      outstandingAmount: balanceAmount,
      status: balanceAmount <= 0 ? 'PAID' : (receivedAmount > 0 ? 'PARTIAL' : 'ISSUED')
    });

    const created = await Invoice.create(newInv);
    res.status(201).json(formatInvoice(created));
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: 'Failed to create invoice', details: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const item = await findInvoiceById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Invoice not found' });

    const formatted = formatInvoice({ ...item.toObject(), ...req.body });
    Object.assign(item, formatted);
    await item.save();

    res.json(formatInvoice(item));
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ error: 'Failed to update invoice', details: err.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const inv = await findInvoiceById(req.params.id);
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    const paymentAmount = Number(req.body.amount || 0);
    inv.receivedAmount = (Number(inv.receivedAmount) || 0) + paymentAmount;
    inv.paidAmount = inv.receivedAmount;
    inv.balanceAmount = Math.max(0, (Number(inv.totalAmount) || 0) - inv.receivedAmount);
    inv.outstandingAmount = inv.balanceAmount;
    inv.status = inv.balanceAmount === 0 ? 'PAID' : 'PARTIAL';
    await inv.save();

    // Record ledger transaction in Mongoose
    const txId = await getNextId(Transaction);
    const txCount = await Transaction.countDocuments();
    const newTx = await Transaction.create({
      id: txId,
      voucherNumber: `VCH-2026-${String(txCount + 131).padStart(4, '0')}`,
      companyId: inv.companyId,
      date: new Date().toISOString().split('T')[0],
      type: 'RECEIPT',
      accountId: 1,
      accountName: 'HDFC Current Account',
      amount: paymentAmount,
      party: inv.customerName || 'Customer',
      particulars: `Payment for Tax Invoice #${inv.invoiceNumber} (Ref: ${req.body.referenceNumber || 'Cash/UPI'})`,
      paymentMode: req.body.paymentMode || 'BANK'
    });

    res.json({ success: true, invoice: formatInvoice(inv), transaction: newTx });
  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ error: 'Failed to record payment', details: err.message });
  }
};
