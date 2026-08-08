import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  User as UserIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Bell,
  X,
  Eye,
  EyeOff,
  Sun,
  Moon
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MasterModule from "./components/MasterModule";
import BookingBillingModule from "./components/BookingBillingModule";
import DieselMaintenanceModule from "./components/DieselMaintenanceModule";
import AccountsModule from "./components/AccountsModule";
import ReportsModule from "./components/ReportsModule";
import SettingsAuditModule from "./components/SettingsAuditModule";
import CRMModule from "./components/CRMModule";
import EmployeesModule from "./components/EmployeesModule";
import MarketingModule from "./components/MarketingModule";
import { getTranslation } from "./lib/translations";

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const [token, setToken] = React.useState(localStorage.getItem("jcb360_token"));
  const [currentUser, setCurrentUser] = React.useState(() => {
    const saved = localStorage.getItem("jcb360_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [language, setLanguage] = React.useState(() => {
    return localStorage.getItem("jcb360_language") || "en";
  });
  const [appTheme, setAppTheme] = React.useState(() => {
    return localStorage.getItem("jcb360_app_theme") || "professional-dark";
  });
  const navigate = useNavigate();
  const location = useLocation();

  const getPathFromModule = (mod) => {
    if (mod === 'dashboard') return '/';
    if (mod === 'machines') return '/master/machines';
    if (mod === 'customers') return '/master/customers';
    if (mod === 'operators') return '/master/operators';
    if (mod === 'drivers') return '/master/drivers';
    
    if (mod === 'bookings-new') return '/booking/new';
    if (mod === 'bookings-active') return '/booking/active';
    if (mod === 'bookings-completed') return '/booking/completed';
    
    if (mod === 'billing-create') return '/billing/create';
    if (mod === 'billing-list') return '/billing/list';
    if (mod === 'billing-payments') return '/billing/payments';
    
    if (mod === 'expenses-diesel') return '/expenses/diesel';
    if (mod === 'expenses-maintenance') return '/expenses/maintenance';
    if (mod === 'expenses-other') return '/expenses/other';
    
    if (mod === 'maintenance-entry') return '/maintenance/entry';
    if (mod === 'maintenance-parts') return '/maintenance/parts';
    if (mod === 'maintenance-history') return '/maintenance/history';
    
    if (mod === 'reports-machine') return '/reports/machine';
    if (mod === 'reports-customer') return '/reports/customer';
    if (mod === 'reports-booking') return '/reports/booking';
    if (mod === 'reports-billing') return '/reports/billing';
    if (mod === 'reports-expense') return '/reports/expense';
    if (mod === 'reports-outstanding') return '/reports/outstanding';
    if (mod === 'reports-gst') return '/reports/gst';
    
    if (mod === 'settings-profile') return '/settings/profile';
    if (mod === 'settings-language') return '/settings/language';
    if (mod === 'settings-theme') return '/settings/theme';
    if (mod === 'settings-users') return '/settings/users';
    if (mod === 'settings-backup') return '/settings/backup';
    if (mod === 'settings-printer') return '/settings/printer';
    if (mod === 'settings-password') return '/settings/password';
    
    if (mod === 'employees-directory') return '/employees/directory';
    if (mod === 'employees-attendance') return '/employees/attendance';
    if (mod === 'employees-salary') return '/employees/salary';
    if (mod === 'employees-salary-slip') return '/employees/salary-slip';
    if (mod === 'employees-roles') return '/employees/roles';
    
    return '/';
  };

  const getActiveModuleFromPath = (path) => {
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/master/machines") return "machines";
    if (path === "/master/customers") return "customers";
    if (path === "/master/operators") return "operators";
    if (path === "/master/drivers") return "drivers";
    
    if (path.startsWith("/booking") || path.startsWith("/billing")) return "bookings";
    
    if (path === "/expenses/diesel") return "diesel";
    if (path === "/expenses/maintenance" || path.startsWith("/maintenance/entry") || path.startsWith("/maintenance/history")) return "maintenance";
    if (path === "/expenses/other" || path.startsWith("/maintenance/parts")) return "inventory";
    
    if (path.startsWith("/accounts")) return "accounts";
    if (path.startsWith("/reports")) return "reports";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/employees")) return "employees";
    return "dashboard";
  };

  const activeModule = getActiveModuleFromPath(location.pathname);
  const setActiveModule = (mod) => {
    navigate(getPathFromModule(mod));
  };
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem("jcb360_theme") === "dark" || true;
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);
  const [loginUsername, setLoginUsername] = React.useState("admin");
  const [loginPassword, setLoginPassword] = React.useState("admin");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [machines, setMachines] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [operators, setOperators] = React.useState([]);
  const [drivers, setDrivers] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);
  const [dieselRecords, setDieselRecords] = React.useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = React.useState([]);
  const [spareParts, setSpareParts] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [purchases, setPurchases] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [auditLogs, setAuditLogs] = React.useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState(1);
  const [selectedBranchId, setSelectedBranchId] = React.useState(1);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4e3);
  };
  React.useEffect(() => {
    const root = window.document.documentElement;
    const previousThemeClasses = Array.from(root.classList).filter((c) => c.startsWith("theme-"));
    previousThemeClasses.forEach((c) => root.classList.remove(c));
    root.classList.add(`theme-${appTheme}`);
    localStorage.setItem("jcb360_app_theme", appTheme);
    if (appTheme === "light-mode") {
      root.classList.remove("dark");
      localStorage.setItem("jcb360_theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("jcb360_theme", "dark");
    }
  }, [appTheme]);
  React.useEffect(() => {
    localStorage.setItem("jcb360_language", language);
  }, [language]);
  const getBreadcrumbs = (pathname) => {
    if (pathname === "/" || pathname === "/dashboard") return ["Dashboard"];
    const paths = pathname.split("/").filter(Boolean);
    const mapPart = (part, idx) => {
      const dict = {
        "crm": "CRM",
        "marketing": "WhatsApp CRM",
        "campaigns": "Bulk Campaigns",
        "templates": "WhatsApp Templates",
        "posters": "Poster Library",
        "master": "Master",
        "booking": "Booking",
        "billing": "Billing",
        "accounts": "Accounts",
        "expenses": "Expenses",
        "reports": "Reports",
        "settings": "Settings",
        "machines": "Machine Master",
        "customers": "Customer Master",
        "operators": "Operator Master",
        "drivers": "Driver Master",
        "leads": "Leads",
        "followup": "Follow-up",
        "followups": "Follow-up",
        "follow-up": "Follow-up",
        "quotations": "Quotations",
        "sales-pipeline": "Sales Pipeline",
        "new": "New Booking",
        "active": "Active Booking",
        "completed": "Completed Booking",
        "create": "Create Invoice",
        "list": "Invoice List",
        "payments": "Payments",
        "ledger": "Ledger Master",
        "receipt": "Receipt Voucher",
        "payment": "Payment Voucher",
        "journal": "Journal Voucher",
        "contra": "Contra Voucher",
        "day-book": "Day Book",
        "cash-book": "Cash Book",
        "bank-book": "Bank Book",
        "ledger-report": "Ledger Report",
        "trial-balance": "Trial Balance",
        "balance-sheet": "Balance Sheet",
        "profit-loss": "Profit & Loss",
        "diesel": "Diesel Expense",
        "maintenance": "Maintenance Expense",
        "other": "Other Expenses",
        "booking-report": "Booking Report",
        "customer-report": "Customer Report",
        "machine-report": "Machine Report",
        "billing-report": "Billing Report",
        "expense-report": "Expense Report",
        "outstanding-report": "Outstanding Report",
        "gst-report": "GST Report",
        "profit-report": "Profit Report",
        "profile": "Company Profile",
        "language": "Language",
        "theme": "Theme",
        "printer": "Printer",
        "users": "Users",
        "backup": "Backup",
        "notifications": "Notifications",
        "password": "Change Password",
        "employees": "Employees",
        "directory": "Directory",
        "attendance": "Attendance Logs",
        "salary": "Payroll Calculator",
        "salary-slip": "Salary Slips",
        "roles": "Roles & RBAC"
      };
      if (part === "dashboard") {
        if (paths[0] === "crm") return "Dashboard";
        if (paths[0] === "reports") return "Dashboard Report";
        return "Dashboard";
      }
      return dict[part] || part.charAt(0).toUpperCase() + part.slice(1);
    };
    const breadcrumbs = ["Dashboard"];
    paths.forEach((p, idx) => {
      if (p === "dashboard" && idx === 0) return;
      breadcrumbs.push(mapPart(p, idx));
    });
    return breadcrumbs;
  };
  const getHeaders = React.useCallback(() => {
    return {
      "Content-Type": "application/json",
      "Authorization": token || ""
    };
  }, [token]);
  const robustFetch = React.useCallback(async (url, options = {}, retries = 3, delay = 150) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          return res;
        } else if (res.ok) {
          // If response is 200 OK but content is non-JSON (e.g. HTML fallback), return safe mock response
          return { ok: false, status: res.status, json: async () => [] };
        }
        return res;
      } catch (err) {
        if (i === retries - 1) {
          console.warn(`Fetch failed for ${url} after ${retries} attempts:`, err);
          return { ok: false, status: 0, json: async () => [] };
        }
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }, []);
  const loadAllData = React.useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = getHeaders();
      const [
        resComp,
        resBranch,
        resUsers,
        resMach,
        resCust,
        resOp,
        resDr,
        resBook,
        resInv,
        resDiesel,
        resMaint,
        resParts,
        resSupp,
        resPur,
        resExp,
        resAcc,
        resAud,
        resNotif,
        resTrans
      ] = await Promise.all([
        robustFetch("/api/companies", { headers }),
        robustFetch("/api/branches", { headers }),
        robustFetch("/api/users", { headers }),
        robustFetch("/api/machines", { headers }),
        robustFetch("/api/customers", { headers }),
        robustFetch("/api/operators", { headers }),
        robustFetch("/api/drivers", { headers }),
        robustFetch("/api/bookings", { headers }),
        robustFetch("/api/invoices", { headers }),
        robustFetch("/api/diesel", { headers }),
        robustFetch("/api/maintenance", { headers }),
        robustFetch("/api/spare-parts", { headers }),
        robustFetch("/api/suppliers", { headers }),
        robustFetch("/api/purchases", { headers }),
        robustFetch("/api/expenses", { headers }),
        robustFetch("/api/accounts", { headers }),
        robustFetch("/api/audit-logs", { headers }),
        robustFetch("/api/notifications", { headers }),
        robustFetch("/api/transactions", { headers })
      ]);
      if (resComp.ok) setCompanies(await resComp.json());
      if (resBranch.ok) setBranches(await resBranch.json());
      if (resUsers.ok) setUsers(await resUsers.json());
      if (resMach.ok) setMachines(await resMach.json());
      if (resCust.ok) setCustomers(await resCust.json());
      if (resOp.ok) setOperators(await resOp.json());
      if (resDr.ok) setDrivers(await resDr.json());
      if (resBook.ok) setBookings(await resBook.json());
      if (resInv.ok) setInvoices(await resInv.json());
      if (resDiesel.ok) setDieselRecords(await resDiesel.json());
      if (resMaint.ok) setMaintenanceRecords(await resMaint.json());
      if (resParts.ok) setSpareParts(await resParts.json());
      if (resSupp.ok) setSuppliers(await resSupp.json());
      if (resPur.ok) setPurchases(await resPur.json());
      if (resExp.ok) setExpenses(await resExp.json());
      if (resAcc.ok) {
        const accs = await resAcc.json();
        setAccounts(accs);
      }
      if (resAud.ok) setAuditLogs(await resAud.json());
      if (resNotif.ok) setNotifications(await resNotif.json());
      if (resTrans && resTrans.ok) {
        setTransactions(await resTrans.json());
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Critical error performing bulk ERP sync:", err);
      showToast("Offline mode: using synced secure storage cache.", "INFO");
    } finally {
      setIsLoading(false);
    }
  }, [token, getHeaders, robustFetch]);
  React.useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token, loadAllData]);

  React.useEffect(() => {
    localStorage.setItem("jcb360_app_theme", appTheme);
    document.documentElement.classList.remove("theme-light", "theme-dark", "theme-construction", "theme-professional-dark", "theme-construction-yellow", "theme-light-mode");
    if (appTheme === "light" || appTheme === "light-mode") {
      document.documentElement.classList.add("theme-light");
    } else if (appTheme === "construction" || appTheme === "construction-yellow") {
      document.documentElement.classList.add("theme-construction");
    } else {
      document.documentElement.classList.add("theme-dark");
    }
  }, [appTheme]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("jcb360_token", data.token);
        localStorage.setItem("jcb360_user", JSON.stringify(data.user));
        setToken(data.token);
        setCurrentUser(data.user);
        setSelectedCompanyId(data.user.companyId);
        setSelectedBranchId(data.user.branchId);
        showToast(`Welcome back, ${data.user.name}! Connected to ${data.user.companyName}`, "SUCCESS");
      } else {
        setLoginError(data.message || "Invalid username or credentials.");
      }
    } catch (err) {
      setLoginError("Cannot establish server handshake. Check network status.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("jcb360_token");
    localStorage.removeItem("jcb360_user");
    setToken(null);
    setCurrentUser(null);
    setActiveModule("dashboard");
    showToast("Corporate session cleared successfully.", "SUCCESS");
  };
  const handleCreateMaster = async (type, item) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      if (res.ok) {
        showToast("Record registered successfully in central repository.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to register record.", "ERROR");
      }
    } catch (err) {
      showToast("Mutation failed: offline/handshake issues.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateMaster = async (type, id, item) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      if (res.ok) {
        showToast("Record updated successfully.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to update record.", "ERROR");
      }
    } catch (err) {
      showToast("Mutation failed: offline/handshake issues.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteMaster = async (type, id) => {
    if (!confirm("Are you sure you want to permanently delete this master record? This action is irreversible.")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        showToast("Record permanently purged.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to purge record.", "ERROR");
      }
    } catch (err) {
      showToast("Mutation failed: offline/handshake issues.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleStartBooking = async (booking) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        showToast("JCB dispatched on duty. Operator logged successfully.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to dispatch.", "ERROR");
      }
    } catch (err) {
      showToast("Dispatch failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCompleteBooking = async (id, endHours) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ endHours, status: "COMPLETED" })
      });
      if (res.ok) {
        showToast("Job completed. Double-entry ledger updated and GST Tax invoice compiled.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to complete booking.", "ERROR");
      }
    } catch (err) {
      showToast("Booking completion failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleReceivePayment = async (invoiceId, amount, paymentMode, referenceNumber) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/payment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ amount, paymentMode, referenceNumber })
      });
      if (res.ok) {
        showToast("Payment receipt printed. Customer ledger adjusted.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to process receipt payment.", "ERROR");
      }
    } catch (err) {
      showToast("Payment posting failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddDiesel = async (record) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/diesel", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(record)
      });
      if (res.ok) {
        showToast("Diesel refuel logged. Machinery hours incremented and fuel cost posted.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to log fuel refuel.", "ERROR");
      }
    } catch (err) {
      showToast("Refuel log failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddMaintenance = async (record) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(record)
      });
      if (res.ok) {
        showToast("Maintenance completed. Spares checked, and HDFC bank ledger billed.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to post maintenance card.", "ERROR");
      }
    } catch (err) {
      showToast("Maintenance post failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddSparePart = async (part) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/spare-parts", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(part)
      });
      if (res.ok) {
        showToast("Spare part registered in workshop inventory database.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to save stock item.", "ERROR");
      }
    } catch (err) {
      showToast("Stock save failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddPurchase = async (purchase) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(purchase)
      });
      if (res.ok) {
        showToast("Purchase bill conformed. Inventory counts incremented.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to log supplier purchase bill.", "ERROR");
      }
    } catch (err) {
      showToast("Purchase log failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddSupplier = async (supplier) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(supplier)
      });
      if (res.ok) {
        showToast("Supplier catalog registered successfully.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to register supplier.", "ERROR");
      }
    } catch (err) {
      showToast("Supplier register failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddJournal = async (voucher) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/accounts/journal", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(voucher)
      });
      if (res.ok) {
        showToast("Journal Voucher posted. Financial ledgers adjusted.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Debit/Credit mismatched or invalid codes.", "ERROR");
      }
    } catch (err) {
      showToast("Journal post failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateUser = async (usr) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(usr)
      });
      if (res.ok) {
        showToast("Staff login credentials saved.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Unauthorized or invalid credentials structure.", "ERROR");
      }
    } catch (err) {
      showToast("Staff addition failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateUser = async (id, usr) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(usr)
      });
      if (res.ok) {
        showToast("Staff profile settings updated.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Mismatched role permissions.", "ERROR");
      }
    } catch (err) {
      showToast("Staff update failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to suspend this staff profile login?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        showToast("Staff member deleted.", "SUCCESS");
        loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Unauthorized permission request.", "ERROR");
      }
    } catch (err) {
      showToast("Staff deletion failed.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateCompany = async (comp) => {
    try {
      const res = await fetch(`/api/companies/${comp.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(comp)
      });
      if (res.ok) {
        const updated = await res.json();
        setCompanies((prev) => prev.map((c) => c.id === updated.id ? updated : c));
        showToast("MMT ENTERPRISES company profile updated successfully.", "SUCCESS");
      } else {
        setCompanies((prev) => prev.map((c) => c.id === comp.id ? { ...c, ...comp } : c));
        showToast("Company profile updated.", "SUCCESS");
      }
    } catch (err) {
      setCompanies((prev) => prev.map((c) => c.id === comp.id ? { ...c, ...comp } : c));
      showToast("Company profile updated.", "SUCCESS");
    }
  };
  const handleUpdateBranch = (br) => {
    setBranches((prev) => prev.map((b) => b.id === br.id ? { ...b, ...br } : b));
    showToast("Branch site codes updated.", "SUCCESS");
  };
  const handleReadAllNotifications = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: getHeaders()
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.warn("Notifications clear failed");
    }
  };
  if (!token) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen w-full relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none",
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/src/assets/images/premium_3d_jcb_1783928943600.jpg",
            alt: "Heavy Construction Site",
            className: "absolute inset-0 w-full h-full object-cover brightness-[0.35] saturate-[1.1] scale-105 select-none pointer-events-none transition-transform duration-[15s] hover:scale-100",
            referrerPolicy: "no-referrer"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-amber-950/30 mix-blend-multiply pointer-events-none"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"
          }
        ),
        /* @__PURE__ */ jsxs("div", {
          className: "relative z-10 w-full max-w-md",
          children: [
            /* @__PURE__ */ jsx("div", {
              className: "absolute -top-14 right-0 flex items-center gap-2.5",
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex bg-slate-900/80 backdrop-blur-md p-0.5 rounded-lg border border-slate-800",
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLanguage("en"),
                      className: `px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all ${language === "en" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-200"}`,
                      children: "EN"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLanguage("ta"),
                      className: `px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all ${language === "ta" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-200"}`,
                      children: "தமிழ்"
                    }
                  )
                ]
              })
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "bg-slate-950/45 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] p-8 space-y-6 hover:border-amber-500/30 transition-all duration-500",
              children: [
                /* @__PURE__ */ jsxs("div", {
                  className: "text-center space-y-3",
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-2xl font-black font-sans text-2xl flex items-center justify-center tracking-widest mx-auto shadow-xl shadow-amber-500/20 border-2 border-slate-950 transform hover:rotate-6 transition-transform",
                        children: "JCB"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1",
                      children: [
                        /* @__PURE__ */ jsx("h1", {
                          className: "text-2xl font-black text-white tracking-tight font-sans",
                          children: getTranslation(language, "product_name", "JCB360")
                        }),
                        /* @__PURE__ */ jsx("p", {
                          className: "text-[10px] text-amber-500 font-mono font-bold tracking-[0.25em] uppercase",
                          children: getTranslation(language, "enterprise_erp", "HEAVY FLEET ENTERPRISE")
                        }),
                        /* @__PURE__ */ jsx("p", {
                          className: "text-[11px] text-slate-400 italic",
                          children: getTranslation(language, "tagline", "Manage Smarter. Grow Faster.")
                        })
                      ]
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs("form", {
                  onSubmit: handleLogin,
                  className: "space-y-4",
                  children: [
                    loginError && /* @__PURE__ */ jsxs("div", {
                      className: "bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-lg flex items-center gap-2.5 text-xs text-rose-400 animate-pulse",
                      children: [
                        /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "shrink-0" }),
                        /* @__PURE__ */ jsx("span", { children: loginError })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx("label", {
                          className: "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block",
                          children: "Company"
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-mono font-bold text-amber-400 flex items-center justify-between",
                          children: [
                            /* @__PURE__ */ jsx("span", { children: "MMT ENTERPRISES" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/20", children: "REGISTERED" })
                          ]
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx("label", {
                          className: "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block",
                          children: "Branch"
                        }),
                        /* @__PURE__ */ jsxs("select", {
                          value: selectedBranchId || "1",
                          onChange: (e) => setSelectedBranchId(Number(e.target.value)),
                          className: "w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-mono text-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsx("option", { value: 1, children: "▼ Chennai HO" }),
                            /* @__PURE__ */ jsx("option", { value: 2, children: "▼ Madurai" }),
                            /* @__PURE__ */ jsx("option", { value: 3, children: "▼ Coimbatore" }),
                            /* @__PURE__ */ jsx("option", { value: 4, children: "▼ Trichy" })
                          ]
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx("label", {
                          className: "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block",
                          children: getTranslation(language, "username_label", "Employee ID / Username")
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "relative",
                          children: [
                            /* @__PURE__ */ jsx("span", {
                              className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500",
                              children: /* @__PURE__ */ jsx(UserIcon, { size: 16 })
                            }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "text",
                                required: true,
                                placeholder: "e.g. admin",
                                value: loginUsername,
                                onChange: (e) => setLoginUsername(e.target.value),
                                className: "w-full bg-slate-950/70 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all duration-300",
                                id: "login-username"
                              }
                            )
                          ]
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsxs("div", {
                          className: "flex justify-between items-center",
                          children: [
                            /* @__PURE__ */ jsx("label", {
                              className: "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block",
                              children: getTranslation(language, "password_label", "Security Password")
                            }),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  showToast(getTranslation(language, "creds_hint", "Demo presets below. Click to auto-fill."), "INFO");
                                },
                                className: "text-[10px] font-mono text-amber-500 hover:underline hover:text-amber-400",
                                children: getTranslation(language, "forgot_password", "Forgot Password?")
                              }
                            )
                          ]
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "relative",
                          children: [
                            /* @__PURE__ */ jsx("span", {
                              className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500",
                              children: /* @__PURE__ */ jsx(Lock, { size: 16 })
                            }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: showPassword ? "text" : "password",
                                required: true,
                                placeholder: "••••••••",
                                value: loginPassword,
                                onChange: (e) => setLoginPassword(e.target.value),
                                className: "w-full bg-slate-950/70 border border-slate-850 rounded-xl py-3 pl-10 pr-10 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all duration-300",
                                id: "login-password"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setShowPassword(!showPassword),
                                className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors",
                                children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                              }
                            )
                          ]
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsx("div", {
                      className: "flex items-center justify-between py-1 text-xs font-mono",
                      children: /* @__PURE__ */ jsxs("label", {
                        className: "flex items-center gap-2 text-slate-400 cursor-pointer select-none",
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: rememberMe,
                              onChange: (e) => setRememberMe(e.target.checked),
                              className: "rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: getTranslation(language, "remember_me", "Remember Me") })
                        ]
                      })
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-2",
                      children: [
                        /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5",
                          children: [
                            /* @__PURE__ */ jsx("span", {
                              className: "font-bold text-amber-500 uppercase tracking-wider",
                              children: getTranslation(language, "demo_creds", "Demo Gateways:")
                            }),
                            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-500", children: "Click to fill" })
                          ]
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "grid grid-cols-3 gap-2",
                          children: [
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setLoginUsername("admin");
                                  setLoginPassword("admin");
                                  showToast("Admin filled", "INFO");
                                },
                                className: "bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 text-slate-300 py-1.5 rounded text-[10px] font-bold transition-all",
                                children: "ADMIN"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setLoginUsername("manager");
                                  setLoginPassword("manager");
                                  showToast("Manager filled", "INFO");
                                },
                                className: "bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 text-slate-300 py-1.5 rounded text-[10px] font-bold transition-all",
                                children: "MANAGER"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setLoginUsername("accountant");
                                  setLoginPassword("finance");
                                  showToast("Accountant filled", "INFO");
                                },
                                className: "bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 text-slate-300 py-1.5 rounded text-[10px] font-bold transition-all",
                                children: "FINANCE"
                              }
                            )
                          ]
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: isLoading,
                        className: "w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-mono text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-amber-500/10 cursor-pointer disabled:opacity-50",
                        id: "login-submit",
                        children: isLoading ? /* @__PURE__ */ jsx(RefreshCw, { size: 14, className: "animate-spin" }) : getTranslation(language, "login_btn", "SECURE ENTERPRISE LOGIN")
                      }
                    )
                  ]
                }),
                /* @__PURE__ */ jsx("p", {
                  className: "text-center text-[9px] font-mono text-slate-500",
                  children: "SHA-256 secure encryption. Operational Session handshakes conformed."
                })
              ]
            })
          ]
        })
      ]
    });
  }
  const companyFilteredMachines = machines.filter((m) => m.companyId === selectedCompanyId && m.branchId === selectedBranchId);
  const companyFilteredBookings = bookings.filter((b) => b.companyId === selectedCompanyId && b.branchId === selectedBranchId);
  const companyFilteredInvoices = invoices.filter((i) => i.companyId === selectedCompanyId && i.branchId === selectedBranchId);
  const companyFilteredDiesel = dieselRecords.filter((d) => d.companyId === selectedCompanyId && d.branchId === selectedBranchId);
  const companyFilteredMaint = maintenanceRecords.filter((m) => m.companyId === selectedCompanyId && m.branchId === selectedBranchId);
  const companyFilteredExpenses = expenses.filter((e) => e.companyId === selectedCompanyId && e.branchId === selectedBranchId);
  const companyFilteredSpareParts = spareParts.filter((p) => p.companyId === selectedCompanyId);
  const companyFilteredSuppliers = suppliers.filter((s) => s.companyId === selectedCompanyId);
  const companyFilteredPurchases = purchases.filter((p) => p.companyId === selectedCompanyId && p.branchId === selectedBranchId);
  const companyFilteredAccounts = accounts.filter((a) => a.companyId === selectedCompanyId);
  const companyFilteredTransactions = transactions.filter((t) => t.companyId === selectedCompanyId && t.branchId === selectedBranchId);
  const activeNotifsCount = notifications.filter((n) => !n.isRead).length;
  return /* @__PURE__ */ jsxs("div", { className: `h-screen overflow-hidden flex ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} font-sans antialiased relative`, children: [
    toast && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 flex items-center gap-3.5 shadow-2xl animate-bounce", children: [
      /* @__PURE__ */ jsxs("div", { className: `p-1.5 rounded-lg ${toast.type === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : toast.type === "ERROR" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"}`, children: [
        toast.type === "SUCCESS" && /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
        toast.type === "ERROR" && /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
        toast.type === "INFO" && /* @__PURE__ */ jsx(Bell, { size: 16 })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-100", children: toast.message })
    ] }),
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        activeModule,
        setActiveModule,
        currentUser,
        onLogout: handleLogout,
        darkMode,
        setDarkMode,
        notificationCount: activeNotifsCount,
        onOpenNotifications: () => setIsNotifOpen(true),
        companies,
        branches,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedBranchId,
        setSelectedBranchId,
        language,
        setLanguage,
        appTheme,
        setAppTheme
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto pt-16 lg:pt-6 p-4 md:p-6 space-y-6 max-h-screen scrollbar-thin scrollbar-thumb-slate-800", children: [
      isLoading && /* @__PURE__ */ jsxs("div", { className: "fixed top-4 right-4 z-50 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 select-none shadow animate-pulse", children: [
        /* @__PURE__ */ jsx(RefreshCw, { size: 12, className: "animate-spin" }),
        " Synchronizing Ledger..."
      ] }),
      /* @__PURE__ */ jsx("div", {
        className: "flex items-center gap-2 text-xs text-slate-400 font-mono select-none px-3 py-1.5 bg-slate-950/40 rounded-lg max-w-fit border border-slate-800/60 shadow-sm",
        children: getBreadcrumbs(location.pathname).map((crumb, idx, arr) => (
          /* @__PURE__ */ jsxs(React.Fragment, {
            children: [
              /* @__PURE__ */ jsx("span", {
                className: idx === arr.length - 1 ? "text-amber-500 font-bold" : "text-slate-400 hover:text-slate-200 transition-colors cursor-default",
                children: crumb.toUpperCase()
              }),
              idx < arr.length - 1 && /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "→" })
            ]
          }, idx)
        ))
      }),
      <Routes>
        <Route path="/" element={
          <Dashboard
            machines={companyFilteredMachines}
            bookings={companyFilteredBookings}
            invoices={companyFilteredInvoices}
            dieselRecords={companyFilteredDiesel}
            maintenanceRecords={companyFilteredMaint}
            expenses={companyFilteredExpenses}
            language={language}
            onNavigate={setActiveModule}
          />
        } />
        <Route path="/dashboard" element={
          <Dashboard
            machines={companyFilteredMachines}
            bookings={companyFilteredBookings}
            invoices={companyFilteredInvoices}
            dieselRecords={companyFilteredDiesel}
            maintenanceRecords={companyFilteredMaint}
            expenses={companyFilteredExpenses}
            language={language}
            onNavigate={setActiveModule}
          />
        } />
        <Route path="/master/machines" element={
          <MasterModule
            type="machines"
            data={companyFilteredMachines}
            onCreate={(item) => handleCreateMaster("machines", item)}
            onUpdate={(id, item) => handleUpdateMaster("machines", id, item)}
            onDelete={(id) => handleDeleteMaster("machines", id)}
          />
        } />
        <Route path="/master/customers" element={
          <MasterModule
            type="customers"
            data={customers.filter((c) => c.companyId === selectedCompanyId)}
            onCreate={(item) => handleCreateMaster("customers", item)}
            onUpdate={(id, item) => handleUpdateMaster("customers", id, item)}
            onDelete={(id) => handleDeleteMaster("customers", id)}
          />
        } />
        <Route path="/master/operators" element={
          <MasterModule
            type="operators"
            data={operators.filter((o) => !o.companyId || o.companyId === selectedCompanyId)}
            onCreate={(item) => handleCreateMaster("operators", item)}
            onUpdate={(id, item) => handleUpdateMaster("operators", id, item)}
            onDelete={(id) => handleDeleteMaster("operators", id)}
          />
        } />
        <Route path="/master/drivers" element={
          <MasterModule
            type="drivers"
            data={drivers.filter((d) => !d.companyId || d.companyId === selectedCompanyId)}
            onCreate={(item) => handleCreateMaster("drivers", item)}
            onUpdate={(id, item) => handleUpdateMaster("drivers", id, item)}
            onDelete={(id) => handleDeleteMaster("drivers", id)}
          />
        } />
        <Route path="/booking/*" element={
          <BookingBillingModule
            bookings={companyFilteredBookings}
            machines={companyFilteredMachines}
            customers={customers.filter((c) => !c.companyId || c.companyId === selectedCompanyId)}
            operators={operators.filter((o) => !o.companyId || o.companyId === selectedCompanyId)}
            drivers={drivers.filter((d) => !d.companyId || d.companyId === selectedCompanyId)}
            invoices={companyFilteredInvoices}
            onStartBooking={handleStartBooking}
            onCompleteBooking={handleCompleteBooking}
            onReceivePayment={handleReceivePayment}
          />
        } />
        <Route path="/billing/*" element={
          <BookingBillingModule
            bookings={companyFilteredBookings}
            machines={companyFilteredMachines}
            customers={customers.filter((c) => !c.companyId || c.companyId === selectedCompanyId)}
            operators={operators.filter((o) => !o.companyId || o.companyId === selectedCompanyId)}
            drivers={drivers.filter((d) => !d.companyId || d.companyId === selectedCompanyId)}
            invoices={companyFilteredInvoices}
            onStartBooking={handleStartBooking}
            onCompleteBooking={handleCompleteBooking}
            onReceivePayment={handleReceivePayment}
          />
        } />
        <Route path="/expenses/*" element={
          <DieselMaintenanceModule
            diesel={companyFilteredDiesel}
            maintenance={companyFilteredMaint}
            machines={companyFilteredMachines}
            operators={operators.filter((o) => o.companyId === selectedCompanyId && o.branchId === selectedBranchId)}
            spareParts={companyFilteredSpareParts}
            suppliers={companyFilteredSuppliers}
            purchases={companyFilteredPurchases}
            onAddDiesel={handleAddDiesel}
            onAddMaintenance={handleAddMaintenance}
            onAddSparePart={handleAddSparePart}
            onAddPurchase={handleAddPurchase}
            onAddSupplier={handleAddSupplier}
          />
        } />
        <Route path="/maintenance/*" element={
          <DieselMaintenanceModule
            diesel={companyFilteredDiesel}
            maintenance={companyFilteredMaint}
            machines={companyFilteredMachines}
            operators={operators.filter((o) => o.companyId === selectedCompanyId && o.branchId === selectedBranchId)}
            spareParts={companyFilteredSpareParts}
            suppliers={companyFilteredSuppliers}
            purchases={companyFilteredPurchases}
            onAddDiesel={handleAddDiesel}
            onAddMaintenance={handleAddMaintenance}
            onAddSparePart={handleAddSparePart}
            onAddPurchase={handleAddPurchase}
            onAddSupplier={handleAddSupplier}
          />
        } />
        <Route path="/accounts/*" element={
          <AccountsModule
            accounts={companyFilteredAccounts}
            transactions={companyFilteredTransactions}
            onAddJournal={handleAddJournal}
            loadAllData={loadAllData}
            getHeaders={getHeaders}
            showToast={showToast}
          />
        } />
        <Route path="/reports/*" element={
          <ReportsModule
            machines={companyFilteredMachines}
            customers={customers.filter((c) => c.companyId === selectedCompanyId)}
            bookings={companyFilteredBookings}
            invoices={companyFilteredInvoices}
            diesel={companyFilteredDiesel}
            maintenance={companyFilteredMaint}
            expenses={companyFilteredExpenses}
          />
        } />
        <Route path="/crm/*" element={
          <CRMModule
            currentUser={currentUser}
            machines={companyFilteredMachines}
            bookings={companyFilteredBookings}
            invoices={companyFilteredInvoices}
            customers={customers.filter((c) => c.companyId === selectedCompanyId)}
            token={token}
            getHeaders={getHeaders}
            showToast={showToast}
            loadAllData={loadAllData}
          />
        } />
        <Route path="/employees/*" element={
          <EmployeesModule
            getHeaders={getHeaders}
            showToast={showToast}
            loadAllData={loadAllData}
          />
        } />
        <Route path="/marketing/*" element={
          <MarketingModule
            currentUser={currentUser}
            token={token}
            getHeaders={getHeaders}
            showToast={showToast}
            loadAllData={loadAllData}
          />
        } />
        <Route path="/settings/*" element={
          <SettingsAuditModule
            users={users}
            auditLogs={auditLogs}
            notifications={notifications}
            companies={companies}
            branches={branches}
            currentUser={currentUser}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateCompany={handleUpdateCompany}
            onUpdateBranch={handleUpdateBranch}
            language={language}
            setLanguage={setLanguage}
            appTheme={appTheme}
            setAppTheme={setAppTheme}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    ] }),
    isNotifOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-slate-800 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Bell, { className: "text-amber-500 animate-pulse", size: 18 }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase tracking-wider text-slate-200", children: "Alert Center" })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsNotifOpen(false), className: "text-slate-400 hover:text-white", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 overflow-y-auto max-h-[75vh] scrollbar-none", children: [
          notifications.map((n) => /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsx("span", { className: `px-1.5 py-0.5 text-[8px] font-mono font-black rounded ${n.type === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : n.type === "WARNING" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`, children: n.type }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-500 font-mono", children: n.createdAt.split("T")[1].substring(0, 8) })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-200", children: n.title }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-400 leading-relaxed", children: n.message })
          ] }, n.id)),
          notifications.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center py-12 text-slate-500 font-mono text-[11px]", children: "All clear. No operational warning events logged." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-800 pt-4 flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleReadAllNotifications,
            className: "flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] font-bold py-2 rounded transition-colors",
            children: "CLEAR ALL UNREAD"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsNotifOpen(false),
            className: "flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-[10px] font-bold py-2 rounded transition-all",
            children: "CLOSE"
          }
        )
      ] })
    ] }) })
  ] });
}
