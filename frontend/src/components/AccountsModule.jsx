import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Plus, CheckCircle, X, Sparkles, AlertCircle, Printer, FileSpreadsheet, 
  Trash2, Edit, ArrowLeft, Search, Calendar, Filter, FileText, Check, 
  UploadCloud, ChevronLeft, ChevronRight, Eye, RefreshCw, Landmark, ArrowUpRight, ArrowDownLeft
} from "lucide-react";

export default function AccountsModule({ 
  accounts = [], 
  transactions = [], 
  onAddJournal, 
  loadAllData, 
  getHeaders, 
  showToast 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  // Derive the active tab based on path
  const currentTab = React.useMemo(() => {
    if (activePath.includes("/accounts/ledger-report")) return "ledger-report";
    if (activePath.includes("/accounts/ledger")) return "ledger";
    if (activePath.includes("/accounts/receipt")) return "receipt";
    if (activePath.includes("/accounts/payment")) return "payment";
    if (activePath.includes("/accounts/journal")) return "journal";
    if (activePath.includes("/accounts/contra")) return "contra";
    if (activePath.includes("/accounts/day-book")) return "day-book";
    if (activePath.includes("/accounts/cash-book")) return "cash-book";
    if (activePath.includes("/accounts/bank-book")) return "bank-book";
    if (activePath.includes("/accounts/trial-balance")) return "trial-balance";
    if (activePath.includes("/accounts/balance-sheet")) return "balance-sheet";
    if (activePath.includes("/accounts/profit-loss")) return "profit-loss";
    return "ledger";
  }, [activePath]);

  // Group Type Map for Ledger Creation
  const groupTypeMap = {
    "Cash/Bank": "ASSET",
    "Sundry Debtors": "ASSET",
    "Sundry Creditors": "LIABILITY",
    "Direct Income": "REVENUE",
    "Direct Expense": "EXPENSE",
    "Indirect Expense": "EXPENSE",
    "Capital Account": "EQUITY",
    "Fixed Assets": "ASSET"
  };

  // State for Ledger Master CRUD
  const [isLedgerModalOpen, setIsLedgerModalOpen] = React.useState(false);
  const [ledgerEditingId, setLedgerEditingId] = React.useState(null);
  const [ledgerForm, setLedgerForm] = React.useState({
    name: "",
    group: "Cash/Bank",
    openingBalance: 0,
    openingType: "DEBIT", // DEBIT / CREDIT
    gstApplicable: "NO",
    status: "ACTIVE"
  });

  // Filters state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [voucherTypeFilter, setVoucherTypeFilter] = React.useState("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate, voucherTypeFilter]);

  // Cash / Bank book IDs
  const [selectedLedgerId, setSelectedLedgerId] = React.useState("");

  // Auto Voucher Number Calculation
  const getAutoVoucherNumber = React.useCallback((type) => {
    const prefix = {
      "RECEIPT": "RV",
      "PAYMENT": "PV",
      "JOURNAL": "JV",
      "CONTRA": "CV"
    }[type] || "TX";
    const year = new Date().getFullYear();
    const count = transactions.filter((t) => t.type === type).length + 1;
    return `${prefix}-${year}-${String(count).padStart(4, "0")}`;
  }, [transactions]);

  // Voucher Form State
  const [voucherForm, setVoucherForm] = React.useState({
    date: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    description: "",
    lines: [
      { accountId: "", debit: 0, credit: 0 },
      { accountId: "", debit: 0, credit: 0 }
    ]
  });

  // Attachment state (file drag & drop)
  const [attachedFile, setAttachedFile] = React.useState(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  React.useEffect(() => {
    // Sync voucher form auto reference number on tab load
    if (["receipt", "payment", "journal", "contra"].includes(currentTab)) {
      const typeMap = {
        "receipt": "RECEIPT",
        "payment": "PAYMENT",
        "journal": "JOURNAL",
        "contra": "CONTRA"
      };
      setVoucherForm({
        date: new Date().toISOString().split("T")[0],
        referenceNumber: getAutoVoucherNumber(typeMap[currentTab]),
        description: "",
        lines: [
          { accountId: "", debit: 0, credit: 0 },
          { accountId: "", debit: 0, credit: 0 }
        ]
      });
      setAttachedFile(null);
    }
  }, [currentTab, getAutoVoucherNumber]);

  // File drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0]);
    }
  };

  // Helper selectors
  const activeAccounts = React.useMemo(() => {
    return accounts.filter(a => a.status !== "INACTIVE");
  }, [accounts]);

  // Ledger Master Submission
  const handleLedgerSubmit = async (e) => {
    e.preventDefault();
    if (!ledgerForm.name.trim()) return;

    try {
      const headers = getHeaders();
      const resolvedType = groupTypeMap[ledgerForm.group] || "ASSET";
      const actualOpeningBalance = Number(ledgerForm.openingBalance) * (ledgerForm.openingType === "CREDIT" && ["ASSET", "EXPENSE"].includes(resolvedType) || ledgerForm.openingType === "DEBIT" && !["ASSET", "EXPENSE"].includes(resolvedType) ? -1 : 1);
      
      const payload = {
        name: ledgerForm.name,
        type: resolvedType,
        group: ledgerForm.group,
        openingBalance: Number(ledgerForm.openingBalance),
        gstApplicable: ledgerForm.gstApplicable,
        status: ledgerForm.status
      };

      let response;
      if (ledgerEditingId) {
        response = await fetch(`/api/accounts/${ledgerEditingId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch("/api/accounts", {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        showToast(ledgerEditingId ? "Ledger updated successfully." : "New Ledger Master registered.", "SUCCESS");
        setIsLedgerModalOpen(false);
        setLedgerEditingId(null);
        setLedgerForm({
          name: "",
          group: "Cash/Bank",
          openingBalance: 0,
          openingType: "DEBIT",
          gstApplicable: "NO",
          status: "ACTIVE"
        });
        if (loadAllData) loadAllData();
      } else {
        const err = await response.json();
        showToast(err.error || "Failed to process ledger.", "ERROR");
      }
    } catch (err) {
      console.error(err);
      showToast("Connection failure saving ledger.", "ERROR");
    }
  };

  // Delete ledger action
  const handleDeleteLedger = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ledger?")) return;
    try {
      const headers = getHeaders();
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
        headers
      });
      if (response.ok) {
        showToast("Ledger deleted successfully.", "SUCCESS");
        if (loadAllData) loadAllData();
      } else {
        const err = await response.json();
        showToast(err.error || "Cannot delete account ledger.", "ERROR");
      }
    } catch (err) {
      console.error(err);
      showToast("Connection failure deleting ledger.", "ERROR");
    }
  };

  // Set form for edit
  const handleEditLedgerClick = (acc) => {
    const resolvedOpeningType = acc.openingBalance >= 0 ? "DEBIT" : "CREDIT";
    setLedgerEditingId(acc.id);
    setLedgerForm({
      name: acc.name,
      group: acc.group || "Cash/Bank",
      openingBalance: Math.abs(acc.openingBalance || acc.balance || 0),
      openingType: resolvedOpeningType,
      gstApplicable: acc.gstApplicable || "NO",
      status: acc.status || "ACTIVE"
    });
    setIsLedgerModalOpen(true);
  };

  // Add Voucher Line
  const addVoucherLine = () => {
    setVoucherForm(prev => ({
      ...prev,
      lines: [...prev.lines, { accountId: "", debit: 0, credit: 0 }]
    }));
  };

  // Remove Voucher Line
  const removeVoucherLine = (idx) => {
    if (voucherForm.lines.length <= 2) {
      showToast("Voucher entries require at least 2 account lines.", "WARNING");
      return;
    }
    setVoucherForm(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== idx)
    }));
  };

  // Voucher Submission
  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    const typeMap = {
      "receipt": "RECEIPT",
      "payment": "PAYMENT",
      "journal": "JOURNAL",
      "contra": "CONTRA"
    };
    const vType = typeMap[currentTab] || "JOURNAL";

    // Validate entries
    const invalidLine = voucherForm.lines.some(l => !l.accountId || (Number(l.debit) <= 0 && Number(l.credit) <= 0));
    if (invalidLine) {
      showToast("All entry lines must have a valid selected ledger and an amount greater than zero.", "ERROR");
      return;
    }

    const sumDebits = voucherForm.lines.reduce((s, l) => s + Number(l.debit || 0), 0);
    const sumCredits = voucherForm.lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    
    if (Math.abs(sumDebits - sumCredits) > 0.01) {
      showToast(`Unbalanced Entry! Debits (₹${sumDebits.toLocaleString()}) and Credits (₹${sumCredits.toLocaleString()}) must match exactly. Difference: ₹${Math.abs(sumDebits - sumCredits).toLocaleString()}`, "ERROR");
      return;
    }

    try {
      const headers = getHeaders();
      const payload = {
        date: voucherForm.date,
        referenceNumber: voucherForm.referenceNumber || getAutoVoucherNumber(vType),
        description: voucherForm.description || `${vType} Posted Ledger Transaction`,
        type: vType,
        lines: voucherForm.lines.map(l => ({
          accountId: parseInt(l.accountId, 10),
          debit: Number(l.debit || 0),
          credit: Number(l.credit || 0)
        }))
      };

      const response = await fetch("/api/accounts/journal", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast(`${vType} Voucher Posted and Ledger accounts adjusted!`, "SUCCESS");
        if (loadAllData) loadAllData();
        navigate("/accounts/day-book");
      } else {
        const err = await response.json();
        showToast(err.error || "Failed to post voucher.", "ERROR");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to communicate with bookkeeping server.", "ERROR");
    }
  };

  // Running balance calculator helper
  const getAccountName = (id) => accounts.find((a) => a.id === id)?.name || "Unknown Ledger";
  const getAccountCode = (id) => accounts.find((a) => a.id === id)?.code || "N/A";

  // Filter accounts list for Ledger Master
  const filteredLedgers = React.useMemo(() => {
    return accounts.filter(acc => {
      const matchSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.code.includes(searchTerm) || 
                          (acc.group && acc.group.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [accounts, searchTerm]);

  // Ledger Master lists pagination
  const paginatedLedgers = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLedgers.slice(start, start + itemsPerPage);
  }, [filteredLedgers, currentPage]);

  const ledgerPages = Math.ceil(filteredLedgers.length / itemsPerPage);

  // Day Book items filtered
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      const dateVal = t.transactionDate || t.createdAt?.split("T")[0];
      const matchFrom = fromDate ? dateVal >= fromDate : true;
      const matchTo = toDate ? dateVal <= toDate : true;
      const matchType = voucherTypeFilter === "ALL" ? true : t.type === voucherTypeFilter;
      const matchSearch = searchTerm ? (
        t.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.lines.some(l => getAccountName(l.accountId).toLowerCase().includes(searchTerm.toLowerCase()))
      ) : true;
      return matchFrom && matchTo && matchType && matchSearch;
    });
  }, [transactions, fromDate, toDate, voucherTypeFilter, searchTerm]);

  const paginatedTransactions = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const transactionPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Cash Ledger ID resolution (defaults to cash account or name with "cash")
  const cashAccount = React.useMemo(() => {
    return accounts.find(a => a.name.toLowerCase().includes("cash") || a.id === 1) || accounts[0];
  }, [accounts]);

  // Bank Ledger ID resolution
  const bankAccount = React.useMemo(() => {
    return accounts.find(a => a.name.toLowerCase().includes("bank") || a.name.toLowerCase().includes("hdfc") || a.id === 2) || accounts[1];
  }, [accounts]);

  // Compute Book / Ledger statement rows with running balances
  const getBookStatement = React.useCallback((ledgerId) => {
    if (!ledgerId) return { initial: 0, rows: [] };
    const targetAcc = accounts.find(a => a.id === Number(ledgerId));
    if (!targetAcc) return { initial: 0, rows: [] };

    const opBal = targetAcc.openingBalance || 0;
    const isDebitType = ["ASSET", "EXPENSE"].includes(targetAcc.type);

    // Collect matching transaction entries sorted chronologically
    const ledgerLines = [];
    transactions.forEach(t => {
      const dateVal = t.transactionDate || t.createdAt?.split("T")[0];
      t.lines.forEach(line => {
        if (line.accountId === Number(ledgerId)) {
          ledgerLines.push({
            id: t.id,
            date: dateVal,
            ref: t.referenceNumber || `TX-${t.id}`,
            desc: t.description,
            type: t.type,
            debit: line.debit || 0,
            credit: line.credit || 0
          });
        }
      });
    });

    // Sort ascending by date for chronological balance tracking
    ledgerLines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter by dates
    const filteredRows = [];
    let runningBal = opBal;

    ledgerLines.forEach(row => {
      if (isDebitType) {
        runningBal += (row.debit - row.credit);
      } else {
        runningBal += (row.credit - row.debit);
      }

      // Filter check
      const matchFrom = fromDate ? row.date >= fromDate : true;
      const matchTo = toDate ? row.date <= toDate : true;
      const matchSearch = searchTerm ? (
        row.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.desc.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;

      if (matchFrom && matchTo && matchSearch) {
        filteredRows.push({
          ...row,
          bal: runningBal
        });
      }
    });

    return {
      initial: opBal,
      rows: filteredRows
    };
  }, [accounts, transactions, fromDate, toDate, searchTerm]);

  // Cash / Bank book rows
  const cashBookData = React.useMemo(() => {
    return cashAccount ? getBookStatement(cashAccount.id) : { initial: 0, rows: [] };
  }, [cashAccount, getBookStatement]);

  const bankBookData = React.useMemo(() => {
    return bankAccount ? getBookStatement(bankAccount.id) : { initial: 0, rows: [] };
  }, [bankAccount, getBookStatement]);

  const activeLedgerData = React.useMemo(() => {
    return selectedLedgerId ? getBookStatement(selectedLedgerId) : { initial: 0, rows: [] };
  }, [selectedLedgerId, getBookStatement]);

  // Trial Balance calculation
  const trialBalanceList = React.useMemo(() => {
    let totDeb = 0;
    let totCred = 0;

    const list = accounts.map(a => {
      const isDebitType = ["ASSET", "EXPENSE"].includes(a.type);
      const debitBal = isDebitType ? Math.max(0, a.balance) : Math.max(0, -a.balance);
      const creditBal = !isDebitType ? Math.max(0, a.balance) : Math.max(0, -a.balance);

      totDeb += debitBal;
      totCred += creditBal;

      return {
        ...a,
        debit: debitBal,
        credit: creditBal
      };
    });

    return { list, totDeb, totCred };
  }, [accounts]);

  // Trading & Profit & Loss Statement (Real-time calculation)
  const profitLossData = React.useMemo(() => {
    const revItems = accounts.filter(a => a.type === "REVENUE");
    const expItems = accounts.filter(a => a.type === "EXPENSE");

    const totalRev = revItems.reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalExp = expItems.reduce((sum, a) => sum + (a.balance || 0), 0);
    const netProf = totalRev - totalExp;

    return { revItems, expItems, totalRev, totalExp, netProf };
  }, [accounts]);

  // Balance Sheet Calculation
  const balanceSheetData = React.useMemo(() => {
    const assetItems = accounts.filter(a => a.type === "ASSET");
    const liabItems = accounts.filter(a => a.type === "LIABILITY");
    const equityItems = accounts.filter(a => a.type === "EQUITY");

    const totalAssets = assetItems.reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalLiabs = liabItems.reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalEquityRaw = equityItems.reduce((sum, a) => sum + (a.balance || 0), 0);
    
    const netProf = profitLossData.netProf;
    const totalEquityAndLiabs = totalLiabs + totalEquityRaw + netProf;

    return { assetItems, liabItems, equityItems, totalAssets, totalLiabs, totalEquityRaw, netProf, totalEquityAndLiabs };
  }, [accounts, profitLossData]);

  // CSV export function for current visible table
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let title = "Accounts_Statement";
    
    if (currentTab === "ledger") {
      title = "Ledger_Master";
      csvContent += "Code,Ledger Name,Ledger Group,Type,GST Applicable,Status,Current Balance\r\n";
      filteredLedgers.forEach(a => {
        csvContent += `"${a.code}","${a.name}","${a.group || "General"}","${a.type}","${a.gstApplicable}","${a.status}",${a.balance}\r\n`;
      });
    } else if (currentTab === "day-book") {
      title = "Day_Book";
      csvContent += "Date,Voucher No,Type,Description,Account,Debit,Credit\r\n";
      filteredTransactions.forEach(t => {
        t.lines.forEach(l => {
          csvContent += `"${t.transactionDate}","${t.referenceNumber}","${t.type}","${t.description}","${getAccountName(l.accountId)}",${l.debit},${l.credit}\r\n`;
        });
      });
    } else if (["cash-book", "bank-book", "ledger-report"].includes(currentTab)) {
      const activeData = currentTab === "cash-book" ? cashBookData : currentTab === "bank-book" ? bankBookData : activeLedgerData;
      const activeName = currentTab === "cash-book" ? "Cash_Book" : currentTab === "bank-book" ? "Bank_Book" : (getAccountName(selectedLedgerId) || "Ledger_Report");
      title = activeName.replace(/\s+/g, "_");
      csvContent += `Date,Voucher No,Type,Description,Debit,Credit,Running Balance\r\n`;
      csvContent += `,"Opening Balance",,,,${activeData.initial}\r\n`;
      activeData.rows.forEach(r => {
        csvContent += `"${r.date}","${r.ref}","${r.type}","${r.desc}",${r.debit},${r.credit},${r.bal}\r.bal\n`;
      });
    } else if (currentTab === "trial-balance") {
      title = "Trial_Balance";
      csvContent += "Code,Account Name,Debit (₹),Credit (₹)\r\n";
      trialBalanceList.list.forEach(a => {
        csvContent += `"${a.code}","${a.name}",${a.debit},${a.credit}\r\n`;
      });
      csvContent += `Total Debit/Credit,,${trialBalanceList.totDeb},${trialBalanceList.totCred}\r\n`;
    } else if (currentTab === "profit-loss") {
      title = "Profit_and_Loss";
      csvContent += "Trading and Profit & Loss Statement\r\n\r\nRevenue / Direct Income\r\n";
      profitLossData.revItems.forEach(r => {
        csvContent += `"${r.name}",${r.balance}\r\n`;
      });
      csvContent += `Total Revenues,,${profitLossData.totalRev}\r\n\r\nOperating Expenses\r\n`;
      profitLossData.expItems.forEach(e => {
        csvContent += `"${e.name}",${e.balance}\r\n`;
      });
      csvContent += `Total Expenses,,${profitLossData.totalExp}\r\n\r\nNet Profit,,${profitLossData.netProf}\r\n`;
    } else if (currentTab === "balance-sheet") {
      title = "Balance_Sheet";
      csvContent += "ASSETS,,LIABILITIES & EQUITY\r\n";
      const maxLen = Math.max(balanceSheetData.assetItems.length, balanceSheetData.liabItems.length + balanceSheetData.equityItems.length + 2);
      for (let i = 0; i < maxLen; i++) {
        const asset = balanceSheetData.assetItems[i];
        let assetStr = asset ? `"${asset.name}",${asset.balance}` : ",";
        
        let rightStr = ",";
        const eqIdx = i - balanceSheetData.liabItems.length;
        if (i < balanceSheetData.liabItems.length) {
          const l = balanceSheetData.liabItems[i];
          rightStr = `"${l.name}",${l.balance}`;
        } else if (eqIdx === 0) {
          rightStr = `"Retained Profit (P&L)",${balanceSheetData.netProf}`;
        } else if (eqIdx > 0 && eqIdx <= balanceSheetData.equityItems.length) {
          const eq = balanceSheetData.equityItems[eqIdx - 1];
          rightStr = `"${eq.name}",${eq.balance}`;
        }
        csvContent += `${assetStr},${rightStr}\r\n`;
      }
      csvContent += `Total Assets,${balanceSheetData.totalAssets},Total Capital & Liabilities,${balanceSheetData.totalEquityAndLiabs}\r\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_${title}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="accounts-module">
      
      {/* Title Segment */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit">
            BOOKKEEPING & GST SYSTEM
          </span>
          <h2 className="text-xl font-bold text-white font-sans mt-2 tracking-tight flex items-center gap-2">
            <Landmark className="text-amber-500" size={20} />
            {currentTab === "ledger" && "Chart of Accounts / Ledger Master"}
            {currentTab === "receipt" && "Voucher Post: Receipt Voucher"}
            {currentTab === "payment" && "Voucher Post: Payment Voucher"}
            {currentTab === "journal" && "Voucher Post: Journal Voucher"}
            {currentTab === "contra" && "Voucher Post: Contra Voucher"}
            {currentTab === "day-book" && "Operational General Ledger / Day Book"}
            {currentTab === "cash-book" && "Operational Ledger: Cash Book"}
            {currentTab === "bank-book" && "Operational Ledger: Bank Book"}
            {currentTab === "ledger-report" && "Sub-Ledger Audit Statement"}
            {currentTab === "trial-balance" && "Real-Time Balance Sheet Audit: Trial Balance"}
            {currentTab === "profit-loss" && "Year-To-Date Statement of Profit & Loss"}
            {currentTab === "balance-sheet" && "Year-To-Date General Balance Sheet"}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {currentTab === "ledger" && "REGISTER, CATEGORISE, AND CONTROL DEBIT/CREDIT OUTSTANDING VALUE PARAMETERS"}
            {["receipt", "payment", "journal", "contra"].includes(currentTab) && "SUBMIT REAL-TIME DOUBLE ENTRY JOURNAL DEBITS AND CREDITS WITH DOCUMENT ATTACHMENTS"}
            {currentTab === "day-book" && "AUDIT DAILY BUSINESS DISPATCH SALES AND COMPLETED INCOME AND EXPENSE OPERATIONS"}
            {currentTab === "cash-book" && "REAL-TIME TRACKING OF PHYSICAL CASH INFLOW, OUTFLOW, AND HANDOVER BALANCES"}
            {currentTab === "bank-book" && "MONITOR HDFC & BANK LEDGER SETTLEMENTS, DEPOSITS, AND TRANSFER RECORDS"}
            {currentTab === "ledger-report" && "SELECT INDIVIDUAL CUSTOMERS, OPERATORS, OR VENDORS TO VIEW CHRONOLOGICAL LEDGERS"}
            {currentTab === "trial-balance" && "AUDIT ACCOUNT BALANCES TO ENSURE ABSOLUTE DEBIT-CREDIT FINANCIAL EQUALITY"}
            {currentTab === "profit-loss" && "CALCULATE DIRECT TAXABLE JON REVENUE MINUS DISK AND DIESEL EXPENSES"}
            {currentTab === "balance-sheet" && "SUMMARISE FIXED ASSETS, BANK LIQUIDITY, CREDIT OUTSTANDING, AND CAPITAL NET WORTH"}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          {currentTab === "ledger" && (
            <button
              onClick={() => {
                setLedgerEditingId(null);
                setLedgerForm({
                  name: "",
                  group: "Cash/Bank",
                  openingBalance: 0,
                  openingType: "DEBIT",
                  gstApplicable: "NO",
                  status: "ACTIVE"
                });
                setIsLedgerModalOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow shadow-amber-500/10 cursor-pointer"
            >
              <Plus size={14} />
              NEW LEDGER MASTER
            </button>
          )}

          {["ledger", "day-book", "cash-book", "bank-book", "ledger-report", "trial-balance", "profit-loss", "balance-sheet"].includes(currentTab) && (
            <>
              <button
                onClick={handleExportCSV}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                title="Export list to Excel CSV format"
              >
                <FileSpreadsheet size={15} className="text-emerald-500" />
                <span>EXPORT EXCEL</span>
              </button>

              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                title="Print current sheet"
              >
                <Printer size={15} className="text-slate-400" />
                <span>PRINT</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Global Filter Toolbar */}
      {["ledger", "day-book", "cash-book", "bank-book", "ledger-report"].includes(currentTab) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search Ledger Name / Reference Code / Particulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          {currentTab === "ledger-report" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-mono">Select Account:</label>
              <select
                value={selectedLedgerId}
                onChange={(e) => setSelectedLedgerId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/50 font-mono font-bold"
              >
                <option value="">-- Choose Ledger --</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.code} - {a.name.toUpperCase()} (₹{(a.balance || 0).toLocaleString()})</option>
                ))}
              </select>
            </div>
          )}

          {currentTab === "day-book" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-mono">Voucher Type:</label>
              <select
                value={voucherTypeFilter}
                onChange={(e) => setVoucherTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/50 font-mono"
              >
                <option value="ALL">ALL VOUCHERS</option>
                <option value="RECEIPT">RECEIPTS (RV)</option>
                <option value="PAYMENT">PAYMENTS (PV)</option>
                <option value="JOURNAL">JOURNALS (JV)</option>
                <option value="CONTRA">CONTRAS (CV)</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          {(searchTerm || fromDate || toDate || voucherTypeFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFromDate("");
                setToDate("");
                setVoucherTypeFilter("ALL");
              }}
              className="text-[10px] text-amber-500 hover:text-amber-400 font-mono uppercase font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* RENDER VIEW: 1. LEDGER MASTER */}
      {currentTab === "ledger" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] tracking-wider font-mono text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">Ledger Code</th>
                  <th className="py-3 px-4">Ledger Name</th>
                  <th className="py-3 px-4">Group Category</th>
                  <th className="py-3 px-4">Under Type</th>
                  <th className="py-3 px-4">GST Enabled</th>
                  <th className="py-3 px-4 text-right">Opening Bal.</th>
                  <th className="py-3 px-4 text-right">Current Ledger Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                {paginatedLedgers.map((acc) => {
                  const isDebit = ["ASSET", "EXPENSE"].includes(acc.type);
                  return (
                    <tr key={acc.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-amber-400">{acc.code}</td>
                      <td className="py-3 px-4 font-bold text-white uppercase">{acc.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{acc.group || "Other Assets"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                          acc.type === "ASSET" ? "bg-blue-500/10 text-blue-400" :
                          acc.type === "EXPENSE" ? "bg-rose-500/10 text-rose-400" :
                          acc.type === "REVENUE" ? "bg-emerald-500/10 text-emerald-400" :
                          acc.type === "LIABILITY" ? "bg-amber-500/10 text-amber-400" :
                          "bg-purple-500/10 text-purple-400"
                        }`}>
                          {acc.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{acc.gstApplicable || "NO"}</td>
                      <td className="py-3 px-4 font-mono text-right text-slate-400">
                        ₹{Math.abs(acc.openingBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="text-[9px] font-bold ml-1 text-slate-500">{(acc.openingBalance || 0) >= 0 ? "Dr" : "Cr"}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold text-white">
                        ₹{Math.abs(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="text-[9px] font-bold ml-1 text-amber-500">{isDebit ? "Dr" : "Cr"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          acc.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                        }`}>
                          {acc.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditLedgerClick(acc)}
                            className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors hover:bg-slate-800 rounded-lg"
                            title="Edit Ledger Settings"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteLedger(acc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors hover:bg-slate-800 rounded-lg"
                            title="Delete Ledger"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedLedgers.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-12 text-center font-mono text-slate-500 bg-slate-900/40">
                      No matching Ledger Masters discovered. Click "NEW LEDGER MASTER" to record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {ledgerPages > 1 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                Showing page {currentPage} of {ledgerPages} ({filteredLedgers.length} ledgers)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-50 text-xs font-mono"
                >
                  PREV
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(ledgerPages, prev + 1))}
                  disabled={currentPage === ledgerPages}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-50 text-xs font-mono"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW: 2. VOUCHER POSTING (RECEIPT, PAYMENT, JOURNAL, CONTRA) */}
      {["receipt", "payment", "journal", "contra"].includes(currentTab) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Voucher form */}
          <form onSubmit={handleVoucherSubmit} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 text-white">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                Double-Entry Ledger Post Matrix
              </h3>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Auto-Number</span>
                <span className="text-xs font-mono font-bold text-amber-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {voucherForm.referenceNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider block">VOUCHER DATE</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-slate-500" size={15} />
                  <input
                    type="date"
                    required
                    value={voucherForm.date}
                    onChange={(e) => setVoucherForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider block">MANUAL REFERENCE (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Slips, Chq Number, Bill Code"
                  value={voucherForm.referenceNumber}
                  onChange={(e) => setVoucherForm(prev => ({ ...prev, referenceNumber: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            </div>

            {/* Matrix Lines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider block">TRANSACTION DEBITS & CREDITS</label>
                <button
                  type="button"
                  onClick={addVoucherLine}
                  className="text-[10px] text-amber-500 hover:text-amber-400 font-mono font-bold flex items-center gap-1"
                >
                  <Plus size={11} /> ADD LINE ENTRY
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {voucherForm.lines.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-mono w-5 text-right">#{idx + 1}</span>
                    
                    <select
                      required
                      value={line.accountId}
                      onChange={(e) => {
                        const updatedLines = [...voucherForm.lines];
                        updatedLines[idx].accountId = e.target.value;
                        setVoucherForm(prev => ({ ...prev, lines: updatedLines }));
                      }}
                      className="flex-1 min-w-[120px] bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-amber-500/50 font-mono uppercase"
                    >
                      <option value="">-- CHOOSE LEDGER --</option>
                      {activeAccounts.map(a => (
                        <option key={a.id} value={a.id}>{a.code} - {a.name.toUpperCase()} (₹{(a.balance || 0).toLocaleString()})</option>
                      ))}
                    </select>

                    <div className="w-28 flex items-center bg-slate-950 border border-slate-800 rounded px-2">
                      <span className="text-[10px] text-slate-600 font-mono mr-1">Dr</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.debit || ""}
                        disabled={line.credit > 0}
                        onChange={(e) => {
                          const updatedLines = [...voucherForm.lines];
                          updatedLines[idx].debit = parseFloat(e.target.value) || 0;
                          updatedLines[idx].credit = 0; // mutually exclusive
                          setVoucherForm(prev => ({ ...prev, lines: updatedLines }));
                        }}
                        className="w-full bg-transparent border-none text-slate-200 text-xs py-1 text-right focus:outline-none font-mono disabled:opacity-30"
                      />
                    </div>

                    <div className="w-28 flex items-center bg-slate-950 border border-slate-800 rounded px-2">
                      <span className="text-[10px] text-slate-600 font-mono mr-1">Cr</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.credit || ""}
                        disabled={line.debit > 0}
                        onChange={(e) => {
                          const updatedLines = [...voucherForm.lines];
                          updatedLines[idx].credit = parseFloat(e.target.value) || 0;
                          updatedLines[idx].debit = 0; // mutually exclusive
                          setVoucherForm(prev => ({ ...prev, lines: updatedLines }));
                        }}
                        className="w-full bg-transparent border-none text-slate-200 text-xs py-1 text-right focus:outline-none font-mono disabled:opacity-30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVoucherLine(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-slate-900 rounded transition-colors"
                      title="Remove Entry Row"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Balancing Audit Footer */}
            {(() => {
              const totDeb = voucherForm.lines.reduce((s, l) => s + Number(l.debit || 0), 0);
              const totCred = voucherForm.lines.reduce((s, l) => s + Number(l.credit || 0), 0);
              const isBalanced = Math.abs(totDeb - totCred) < 0.01;
              const diff = Math.abs(totDeb - totCred);

              return (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Debit Total</span>
                      <span className="text-emerald-400">₹{totDeb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Credit Total</span>
                      <span className="text-amber-500">₹{totCred.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isBalanced && totDeb > 0 ? (
                      <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded flex items-center gap-1.5 text-[10px] uppercase">
                        <CheckCircle size={12} /> Matrix Balanced
                      </div>
                    ) : (
                      <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded flex items-center gap-1.5 text-[10px] uppercase">
                        <AlertCircle size={12} /> Out of Balance {diff > 0 && `(₹${diff.toLocaleString()})`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-mono tracking-wider block">NARRATION / DESCRIPTION</label>
              <textarea
                required
                rows="2"
                placeholder="Detailed explanation of voucher settlement, machine hours, or customer receipts..."
                value={voucherForm.description}
                onChange={(e) => setVoucherForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-sans"
              />
            </div>

            <div className="flex items-center justify-end border-t border-slate-800 pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-black rounded-lg transition-all shadow cursor-pointer uppercase tracking-wider"
              >
                POST VOUCHER & UPDATE BALANCE
              </button>
            </div>
          </form>

          {/* Right sidebar for drag & drop file upload attachments */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800 pb-2">
                Document / Bill Attachments
              </h4>
              <p className="text-[11px] text-slate-500">
                Attach digital scanned invoice copies, bank clearance PDFs, or cash slips directly to this double-entry ledger entry.
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("hidden-file-input").click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                  isDragOver ? "border-amber-500 bg-amber-500/5" : "border-slate-800 hover:border-slate-700 hover:bg-slate-950/20"
                }`}
              >
                <input
                  type="file"
                  id="hidden-file-input"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachedFile(e.target.files[0]);
                    }
                  }}
                />
                
                {attachedFile ? (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h5 className="text-xs font-mono font-bold text-emerald-400 truncate max-w-[180px]">
                        {attachedFile.name}
                      </h5>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {(attachedFile.size / 1024).toFixed(1)} KB (Attached)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachedFile(null);
                      }}
                      className="text-[10px] text-rose-500 font-mono font-bold hover:underline"
                    >
                      REMOVE FILE
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-slate-950 text-slate-500 flex items-center justify-center border border-slate-800">
                      <UploadCloud size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-sans font-bold text-slate-300">
                        Drag & Drop document
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        or click to browse filesystem
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Context audit alerts */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1">
                <AlertCircle size={13} className="text-amber-500" />
                Accounting Rules
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400 list-disc pl-4">
                <li>Receipt Vouchers credit Sundry Debtors and debit Cash/Bank accounts.</li>
                <li>Payment Vouchers debit Expenses or Sundry Creditors and credit Cash/Bank accounts.</li>
                <li>Journal Vouchers record non-cash corrections, depreciation, and closing adjustments.</li>
                <li>Contra Vouchers adjust physical cash-in-hand directly with Bank accounts.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW: 3. DAY BOOK */}
      {currentTab === "day-book" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] tracking-wider font-mono text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">Tx Date</th>
                  <th className="py-3 px-4">Voucher No.</th>
                  <th className="py-3 px-4">Voucher Type</th>
                  <th className="py-3 px-4">Journal Narration / Description</th>
                  <th className="py-3 px-4">Particulars (Account Lines Involved)</th>
                  <th className="py-3 px-4 text-right">Debit Total (₹)</th>
                  <th className="py-3 px-4 text-right">Credit Total (₹)</th>
                  <th className="py-3 px-4 text-center">Receipt Doc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                {paginatedTransactions.map((t) => {
                  const dateVal = t.transactionDate || t.createdAt?.split("T")[0];
                  const debTotal = t.lines.reduce((s, l) => s + (l.debit || 0), 0);
                  const credTotal = t.lines.reduce((s, l) => s + (l.credit || 0), 0);
                  
                  return (
                    <tr key={t.id} className="hover:bg-slate-850/40 transition-colors align-top">
                      <td className="py-3 px-4 font-mono">{dateVal}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-amber-500">{t.referenceNumber || `TX-${t.id}`}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          t.type === "RECEIPT" ? "bg-emerald-500/10 text-emerald-400" :
                          t.type === "PAYMENT" ? "bg-rose-500/10 text-rose-400" :
                          t.type === "CONTRA" ? "bg-amber-500/10 text-amber-400" :
                          "bg-blue-500/10 text-blue-400"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-[200px] break-words">{t.description}</td>
                      <td className="py-3 px-4 font-mono space-y-1">
                        {t.lines.map((l, lIdx) => (
                          <div key={lIdx} className="flex justify-between gap-4 text-[11px] leading-tight text-slate-300">
                            <span className="uppercase">{getAccountName(l.accountId)}</span>
                            <span className="text-slate-500">
                              {l.debit > 0 ? `(Dr ₹${l.debit.toLocaleString()})` : `(Cr ₹${l.credit.toLocaleString()})`}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold text-white">
                        ₹{debTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold text-slate-400">
                        ₹{credTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            showToast(`Opening receipt print file for ${t.referenceNumber}`, "INFO");
                            window.print();
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded transition-colors"
                          title="Generate PDF Receipt Slip"
                        >
                          <Printer size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-12 text-center font-mono text-slate-500 bg-slate-900/40">
                      No transactional records discovered matching the active search parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactionPages > 1 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                Showing page {currentPage} of {transactionPages} ({filteredTransactions.length} transactions)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-50 text-xs font-mono"
                >
                  PREV
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(transactionPages, prev + 1))}
                  disabled={currentPage === transactionPages}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-50 text-xs font-mono"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW: 4/5/6. RUNNING LEDGERS (CASH BOOK, BANK BOOK, LEDGER REPORT) */}
      {["cash-book", "bank-book", "ledger-report"].includes(currentTab) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {(() => {
            const activeData = currentTab === "cash-book" ? cashBookData : currentTab === "bank-book" ? bankBookData : activeLedgerData;
            const isReportSelected = currentTab !== "ledger-report" || selectedLedgerId;

            if (!isReportSelected) {
              return (
                <div className="py-20 text-center font-mono text-slate-500">
                  Please select an active sub-ledger master from the dropdown above to view historical transactions.
                </div>
              );
            }

            return (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] tracking-wider font-mono text-slate-400 font-semibold uppercase">
                      <th className="py-3 px-4">Transaction Date</th>
                      <th className="py-3 px-4">Voucher No / Ref</th>
                      <th className="py-3 px-4">Voucher Type</th>
                      <th className="py-3 px-4">Narration / Description</th>
                      <th className="py-3 px-4 text-right">Debit (Receipts) (₹)</th>
                      <th className="py-3 px-4 text-right">Credit (Payments) (₹)</th>
                      <th className="py-3 px-4 text-right">Running Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300 font-mono">
                    
                    {/* Opening Balance Row */}
                    <tr className="bg-slate-950/30 text-slate-400 italic">
                      <td className="py-3 px-4 font-mono font-bold">-</td>
                      <td className="py-3 px-4 font-mono font-bold">OP-BAL</td>
                      <td className="py-3 px-4">OPENING</td>
                      <td className="py-3 px-4 text-slate-400">Balance brought forward</td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right font-bold text-amber-500">
                        ₹{activeData.initial.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* Historical Entries */}
                    {activeData.rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="py-3 px-4">{row.date}</td>
                        <td className="py-3 px-4 text-amber-500 font-semibold">{row.ref}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            row.type === "RECEIPT" ? "bg-emerald-500/10 text-emerald-400" :
                            row.type === "PAYMENT" ? "bg-rose-500/10 text-rose-400" :
                            "bg-slate-800 text-slate-400"
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 max-w-[250px] truncate">{row.desc}</td>
                        <td className="py-3 px-4 text-right text-emerald-400">
                          {row.debit > 0 ? `₹${row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-right text-rose-400">
                          {row.credit > 0 ? `₹${row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-right text-white font-bold">
                          ₹{Math.abs(row.bal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          <span className="text-[9px] text-slate-500 ml-1">{row.bal >= 0 ? "Dr" : "Cr"}</span>
                        </td>
                      </tr>
                    ))}

                    {activeData.rows.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-500">
                          No transactional entries posted for this sub-ledger within specified filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* RENDER VIEW: 7. TRIAL BALANCE */}
      {currentTab === "trial-balance" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] tracking-wider font-mono text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">Ledger Code</th>
                  <th className="py-3 px-4">Account Ledger Name</th>
                  <th className="py-3 px-4">Group Classification</th>
                  <th className="py-3 px-4 text-right">Debit Balance (Dr) (₹)</th>
                  <th className="py-3 px-4 text-right">Credit Balance (Cr) (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300 font-mono">
                {trialBalanceList.list.map(a => (
                  <tr key={a.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400">{a.code}</td>
                    <td className="py-3 px-4 text-white font-bold uppercase">{a.name}</td>
                    <td className="py-3 px-4 text-slate-400">{a.group || a.type}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">
                      {a.debit > 0 ? `₹${a.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-500">
                      {a.credit > 0 ? `₹${a.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                    </td>
                  </tr>
                ))}
                
                {/* Trial balance total footer */}
                <tr className="bg-slate-950 font-bold border-t-2 border-slate-800 text-sm">
                  <td colSpan="3" className="py-4 px-4 text-slate-300 font-sans text-right uppercase">
                    Audit Totals Summary
                  </td>
                  <td className="py-4 px-4 text-right text-emerald-400">
                    ₹{trialBalanceList.totDeb.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-right text-amber-400">
                    ₹{trialBalanceList.totCred.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs font-mono text-slate-500 flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" />
            <span>Double-entry matrix checked. Total Debits exactly balance Total Credits under accounting ledger principles.</span>
          </div>
        </div>
      )}

      {/* RENDER VIEW: 8. PROFIT & LOSS STATEMENT */}
      {currentTab === "profit-loss" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Revenue column */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Operating Revenues (Income)</span>
              <ArrowUpRight className="text-emerald-500" size={16} />
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              {profitLossData.revItems.map(r => (
                <div key={r.id} className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <span className="text-slate-300 uppercase">{r.name}</span>
                  <span className="text-emerald-400 font-bold">₹{(r.balance || 0).toLocaleString()}</span>
                </div>
              ))}
              {profitLossData.revItems.length === 0 && (
                <div className="py-6 text-slate-500 text-center italic">No revenue entries recorded.</div>
              )}
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-mono font-bold">
              <span className="text-slate-400">TOTAL INCOME:</span>
              <span className="text-emerald-400">₹{profitLossData.totalRev.toLocaleString()}</span>
            </div>
          </div>

          {/* Expenses column */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Operating Expenditures (Losses)</span>
              <ArrowDownLeft className="text-rose-500" size={16} />
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              {profitLossData.expItems.map(e => (
                <div key={e.id} className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <span className="text-slate-300 uppercase">{e.name}</span>
                  <span className="text-rose-400 font-bold">₹{(e.balance || 0).toLocaleString()}</span>
                </div>
              ))}
              {profitLossData.expItems.length === 0 && (
                <div className="py-6 text-slate-500 text-center italic">No expenses recorded.</div>
              )}
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-mono font-bold">
              <span className="text-slate-400">TOTAL EXPENDITURES:</span>
              <span className="text-rose-400">₹{profitLossData.totalExp.toLocaleString()}</span>
            </div>
          </div>

          {/* Combined Net Profit Display */}
          <div className="md:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-base font-bold text-white font-sans">Net Operating Yield Statement</h4>
              <p className="text-xs text-slate-500">Subject to standard enterprise corporate GST taxes and operational write-offs.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block uppercase">Net Profit Margin</span>
              <span className={`text-2xl font-black font-mono tracking-tight ${
                profitLossData.netProf >= 0 ? "text-emerald-400 animate-pulse" : "text-rose-400"
              }`}>
                ₹{profitLossData.netProf.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW: 9. BALANCE SHEET */}
      {currentTab === "balance-sheet" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Side: Asset Ledgers */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800 pb-2">
              Assets & Liquidity Resources
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              {balanceSheetData.assetItems.map(a => (
                <div key={a.id} className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <div>
                    <span className="text-slate-300 uppercase block">{a.name}</span>
                    <span className="text-[10px] text-slate-500">{a.group || "Assets"}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">₹{(a.balance || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-mono font-bold">
              <span className="text-slate-400">TOTAL ASSETS VALUE:</span>
              <span className="text-emerald-400">₹{balanceSheetData.totalAssets.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Side: Liabilities, Capital, Retained Yield */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800 pb-2">
              Equity & Capital Obligations
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              {/* Liability items */}
              {balanceSheetData.liabItems.map(l => (
                <div key={l.id} className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <div>
                    <span className="text-slate-300 uppercase block">{l.name}</span>
                    <span className="text-[10px] text-slate-500">Liability</span>
                  </div>
                  <span className="text-amber-500 font-bold">₹{(l.balance || 0).toLocaleString()}</span>
                </div>
              ))}

              {/* Equity items */}
              {balanceSheetData.equityItems.map(e => (
                <div key={e.id} className="flex justify-between items-center py-2 border-b border-slate-800/40">
                  <div>
                    <span className="text-slate-300 uppercase block">{e.name}</span>
                    <span className="text-[10px] text-slate-500">Equity</span>
                  </div>
                  <span className="text-purple-400 font-bold">₹{(e.balance || 0).toLocaleString()}</span>
                </div>
              ))}

              {/* Retained profit from P&L */}
              <div className="flex justify-between items-center py-2 border-b border-slate-800/40">
                <div>
                  <span className="text-slate-300 uppercase block">Retained Yield (Current P&L)</span>
                  <span className="text-[10px] text-slate-500">Net earnings from operations</span>
                </div>
                <span className={`font-bold ${balanceSheetData.netProf >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  ₹{balanceSheetData.netProf.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-mono font-bold">
              <span className="text-slate-400">TOTAL CAP & LIABS:</span>
              <span className="text-amber-400">₹{balanceSheetData.totalEquityAndLiabs.toLocaleString()}</span>
            </div>
          </div>

          {/* Balanced Check Banner */}
          {Math.abs(balanceSheetData.totalAssets - balanceSheetData.totalEquityAndLiabs) < 0.1 ? (
            <div className="lg:col-span-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-xs font-mono text-emerald-400">
              <CheckCircle size={16} />
              <span>Balance Sheet Balanced. Total Assets match combined Liabilities and Owner Equity exactly.</span>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-xs font-mono text-rose-400 animate-pulse">
              <AlertCircle size={16} />
              <span>Balance Sheet Unbalanced! Difference: ₹{Math.abs(balanceSheetData.totalAssets - balanceSheetData.totalEquityAndLiabs).toLocaleString()}. Verify double-entry ledger postings.</span>
            </div>
          )}
        </div>
      )}

      {/* LEDGER MASTER: ADD/EDIT OVERLAY MODAL */}
      {isLedgerModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                {ledgerEditingId ? "Configure Account Ledger" : "Register Account Ledger"}
              </h3>
              <button
                onClick={() => setIsLedgerModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleLedgerSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider block">LEDGER MASTER NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TN-01-AX Diesel Purchase A/c, Ramesh Kumar"
                  value={ledgerForm.name}
                  onChange={(e) => setLedgerForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider block">LEDGER GROUP</label>
                  <select
                    value={ledgerForm.group}
                    onChange={(e) => setLedgerForm(prev => ({ ...prev, group: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                  >
                    <option value="Cash/Bank">Cash/Bank</option>
                    <option value="Sundry Debtors">Sundry Debtors</option>
                    <option value="Sundry Creditors">Sundry Creditors</option>
                    <option value="Direct Income">Direct Income</option>
                    <option value="Direct Expense">Direct Expense</option>
                    <option value="Indirect Expense">Indirect Expense</option>
                    <option value="Capital Account">Capital Account</option>
                    <option value="Fixed Assets">Fixed Assets</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider block">GST APPLICABLE</label>
                  <select
                    value={ledgerForm.gstApplicable}
                    onChange={(e) => setLedgerForm(prev => ({ ...prev, gstApplicable: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                  >
                    <option value="NO">NO / EXEMPT</option>
                    <option value="YES">YES (18% GST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider block">OPENING BALANCE</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={ledgerForm.openingBalance || ""}
                    onChange={(e) => setLedgerForm(prev => ({ ...prev, openingBalance: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider block">BALANCE TYPE</label>
                  <select
                    value={ledgerForm.openingType}
                    onChange={(e) => setLedgerForm(prev => ({ ...prev, openingType: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                  >
                    <option value="DEBIT">DEBIT (DR)</option>
                    <option value="CREDIT">CREDIT (CR)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider block">ACCOUNT LEDGER STATUS</label>
                <select
                  value={ledgerForm.status}
                  onChange={(e) => setLedgerForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-amber-500/50 font-mono"
                >
                  <option value="ACTIVE">ACTIVE OPERATING</option>
                  <option value="INACTIVE">INACTIVE / BLOCK</option>
                </select>
              </div>

              <div className="flex items-center justify-end border-t border-slate-800 pt-4 gap-2">
                <button
                  type="button"
                  onClick={() => setIsLedgerModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-black rounded-lg transition-colors shadow cursor-pointer uppercase"
                >
                  COMMIT MASTER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
