import db from '../services/memoryStore.js';

export const formatTransaction = (t) => {
  const amount = Number(t.amount || 0);
  const type = t.type || 'PAYMENT';
  const accId = Number(t.accountId || 1);
  const defaultLines = [
    {
      accountId: accId,
      debit: (type === 'RECEIPT' || type === 'JOURNAL') ? amount : 0,
      credit: (type === 'PAYMENT' || type === 'CONTRA') ? amount : 0
    },
    {
      accountId: 3, // Counter account (e.g. Accounts Receivable / Payable)
      debit: (type === 'PAYMENT' || type === 'CONTRA') ? amount : 0,
      credit: (type === 'RECEIPT' || type === 'JOURNAL') ? amount : 0
    }
  ];

  const lines = Array.isArray(t.lines) && t.lines.length > 0
    ? t.lines.map(l => ({
        accountId: Number(l.accountId || accId),
        debit: Number(l.debit || 0),
        credit: Number(l.credit || 0)
      }))
    : defaultLines;

  return {
    ...t,
    id: Number(t.id) || (typeof t._id === 'string' ? t._id : 1),
    voucherNumber: t.voucherNumber || t.referenceNumber || `VCH-2026-${String(t.id || 100).padStart(4, '0')}`,
    referenceNumber: t.referenceNumber || t.voucherNumber || `VCH-2026-${String(t.id || 100).padStart(4, '0')}`,
    date: t.date || t.transactionDate || new Date().toISOString().split('T')[0],
    transactionDate: t.transactionDate || t.date || new Date().toISOString().split('T')[0],
    amount: amount,
    type: type,
    lines: lines
  };
};

export const getAccounts = async (req, res) => {
  res.json(db.accounts);
};

export const createAccount = async (req, res) => {
  const newAcc = {
    id: db.accounts.length > 0 ? Math.max(...db.accounts.map(a => a.id)) + 1 : 1,
    companyId: req.body.companyId || req.currentUser?.companyId || 1,
    balance: Number(req.body.balance || 0),
    status: req.body.status || 'ACTIVE',
    ...req.body
  };
  db.accounts.push(newAcc);
  res.status(201).json(newAcc);
};

export const updateAccount = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.accounts.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Account not found' });
  db.accounts[idx] = { ...db.accounts[idx], ...req.body };
  res.json(db.accounts[idx]);
};

export const deleteAccount = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.accounts = db.accounts.filter(a => a.id !== id);
  res.json({ success: true, message: 'Account removed' });
};

export const getTransactions = async (req, res) => {
  res.json(db.transactions.map(formatTransaction));
};

export const createTransaction = async (req, res) => {
  const nextId = db.transactions.length > 0 ? Math.max(...db.transactions.map(t => Number(t.id) || 0)) + 1 : 1;
  const type = req.body.type || 'PAYMENT';
  const amount = Number(req.body.amount || 0);
  const accId = Number(req.body.accountId || 1);
  const dateStr = req.body.date || req.body.transactionDate || new Date().toISOString().split('T')[0];

  const lines = Array.isArray(req.body.lines) && req.body.lines.length > 0
    ? req.body.lines.map(l => ({ accountId: Number(l.accountId), debit: Number(l.debit || 0), credit: Number(l.credit || 0) }))
    : [
        { accountId: accId, debit: type === 'RECEIPT' ? amount : 0, credit: type === 'PAYMENT' ? amount : 0 },
        { accountId: 3, debit: type === 'PAYMENT' ? amount : 0, credit: type === 'RECEIPT' ? amount : 0 }
      ];

  const newTx = {
    id: nextId,
    voucherNumber: req.body.voucherNumber || req.body.referenceNumber || `VCH-2026-${String(nextId + 130).padStart(4, '0')}`,
    referenceNumber: req.body.referenceNumber || req.body.voucherNumber || `VCH-2026-${String(nextId + 130).padStart(4, '0')}`,
    companyId: req.body.companyId || req.currentUser?.companyId || 1,
    date: dateStr,
    transactionDate: dateStr,
    type: type,
    amount: amount,
    accountId: accId,
    party: req.body.party || '',
    particulars: req.body.particulars || req.body.description || `${type} Voucher`,
    description: req.body.description || req.body.particulars || `${type} Voucher`,
    paymentMode: req.body.paymentMode || 'BANK',
    lines: lines
  };

  // Adjust account balance
  const targetAcc = db.accounts.find(a => a.id === accId);
  if (targetAcc) {
    if (type === 'RECEIPT') targetAcc.balance = (Number(targetAcc.balance) || 0) + amount;
    if (type === 'PAYMENT') targetAcc.balance = (Number(targetAcc.balance) || 0) - amount;
  }

  db.transactions.unshift(newTx);
  res.status(201).json(formatTransaction(newTx));
};

export const updateTransaction = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = db.transactions.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });

  db.transactions[idx] = { ...db.transactions[idx], ...req.body };
  res.json(formatTransaction(db.transactions[idx]));
};

export const deleteTransaction = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.transactions = db.transactions.filter(t => t.id !== id);
  res.json({ success: true, message: 'Transaction removed' });
};

export const createJournalVoucher = async (req, res) => {
  try {
    const nextId = db.transactions.length > 0 ? Math.max(...db.transactions.map(t => Number(t.id) || 0)) + 1 : 1;
    const type = req.body.type || 'JOURNAL';
    const lines = Array.isArray(req.body.lines) && req.body.lines.length > 0
      ? req.body.lines.map(l => ({
          accountId: Number(l.accountId),
          debit: Number(l.debit || 0),
          credit: Number(l.credit || 0)
        }))
      : [{ accountId: Number(req.body.accountId || 1), debit: type === 'RECEIPT' ? Number(req.body.amount || 0) : 0, credit: type === 'PAYMENT' ? Number(req.body.amount || 0) : 0 }];

    const calcAmount = Number(req.body.amount || 0) || lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const dateStr = req.body.date || new Date().toISOString().split('T')[0];
    const prefix = type === 'RECEIPT' ? 'RCT' : type === 'PAYMENT' ? 'PAY' : type === 'CONTRA' ? 'CTR' : 'JV';
    const refNo = req.body.referenceNumber || `${prefix}-2026-${String(nextId + 100).padStart(4, '0')}`;

    const newTx = {
      id: nextId,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      voucherNumber: refNo,
      referenceNumber: refNo,
      date: dateStr,
      transactionDate: dateStr,
      type: type,
      amount: calcAmount,
      party: req.body.party || req.body.description || `${type} Voucher`,
      particulars: req.body.particulars || req.body.description || `${type} Posted Ledger Transaction`,
      description: req.body.description || req.body.particulars || `${type} Posted Ledger Transaction`,
      paymentMode: req.body.paymentMode || 'BANK',
      accountId: lines[0]?.accountId || 1,
      lines: lines
    };

    // Update account balances in db.accounts
    lines.forEach(l => {
      const acc = db.accounts.find(a => a.id === l.accountId);
      if (acc) {
        const isAssetOrExp = ['ASSET', 'EXPENSE', 'BANK', 'CASH'].includes(acc.type);
        if (isAssetOrExp) {
          acc.balance = (Number(acc.balance) || 0) + (l.debit - l.credit);
        } else {
          acc.balance = (Number(acc.balance) || 0) + (l.credit - l.debit);
        }
      }
    });

    db.transactions.unshift(newTx);

    res.status(201).json({
      success: true,
      voucher: formatTransaction(newTx),
      transaction: formatTransaction(newTx),
      accounts: db.accounts
    });
  } catch (err) {
    console.error('Error creating journal voucher:', err);
    res.status(500).json({ error: 'Failed to post voucher', details: err.message });
  }
};

export const getDayBook = async (req, res) => {
  res.json(db.transactions.map(formatTransaction));
};

export const getTrialBalance = async (req, res) => {
  const list = db.accounts.map(a => ({
    accountName: a.name,
    type: a.type,
    debit: a.type === 'ASSET' || a.type === 'EXPENSE' ? Number(a.balance || 0) : 0,
    credit: a.type === 'LIABILITY' || a.type === 'INCOME' ? Number(a.balance || 0) : 0
  }));
  res.json(list);
};

export const getLedgerStatement = async (req, res) => {
  res.json(db.transactions.map(formatTransaction));
};
