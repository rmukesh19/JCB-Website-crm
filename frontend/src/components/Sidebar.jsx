import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Wrench, Fuel, FileText, Settings, 
  UserCheck, LogOut, Building, Layers, CreditCard, ChevronLeft, 
  ChevronRight, Sun, Moon, Bell, ClipboardList, Package, BookOpen,
  ChevronDown, ChevronUp, MessageSquare, Menu, X
} from 'lucide-react';
import { getTranslation } from '../lib/translations.js';

export default function Sidebar({
  currentUser,
  onLogout,
  notificationCount,
  onOpenNotifications,
  companies = [],
  branches = [],
  selectedCompanyId,
  setSelectedCompanyId,
  selectedBranchId,
  setSelectedBranchId,
  language,
  setLanguage,
  appTheme,
  setAppTheme
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const [openGroups, setOpenGroups] = React.useState({
    master: false,
    booking: false,
    billing: false,
    crm: false,
    marketing: false,
    accounts: false,
    maintenance: false,
    expenses: false,
    reports: false,
    employees: false,
    settings: false,
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

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

    if (mod === 'crm-dashboard') return '/crm/dashboard';
    if (mod === 'crm-leads') return '/crm/leads';
    if (mod === 'crm-followups') return '/crm/followups';
    if (mod === 'crm-quotations') return '/crm/quotations';
    if (mod === 'crm-executive') return '/crm/executive';
    if (mod === 'crm-reports') return '/crm/reports';

    if (mod === 'marketing-dashboard') return '/marketing/dashboard';
    if (mod === 'marketing-contacts') return '/marketing/contacts';
    if (mod === 'marketing-templates') return '/marketing/templates';
    if (mod === 'marketing-campaigns') return '/marketing/campaigns';
    if (mod === 'marketing-reports') return '/marketing/reports';
    if (mod === 'marketing-posters') return '/marketing/posters';
    if (mod === 'marketing-settings') return '/marketing/settings';
    
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

    if (mod === 'accounts-ledger') return '/accounts/ledger';
    if (mod === 'accounts-receipt') return '/accounts/receipt';
    if (mod === 'accounts-payment') return '/accounts/payment';
    if (mod === 'accounts-journal') return '/accounts/journal';
    if (mod === 'accounts-contra') return '/accounts/contra';
    if (mod === 'accounts-day-book') return '/accounts/day-book';
    if (mod === 'accounts-cash-book') return '/accounts/cash-book';
    if (mod === 'accounts-bank-book') return '/accounts/bank-book';
    if (mod === 'accounts-ledger-report') return '/accounts/ledger-report';
    if (mod === 'accounts-trial-balance') return '/accounts/trial-balance';
    if (mod === 'accounts-balance-sheet') return '/accounts/balance-sheet';
    if (mod === 'accounts-profit-loss') return '/accounts/profit-loss';
    
    return '/';
  };

  const navGroups = [
    {
      id: 'master',
      name: 'Master',
      icon: Truck,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'],
      subItems: [
        { id: 'machines', name: 'Machine Master', targetModule: 'machines' },
        { id: 'customers', name: 'Customer Master', targetModule: 'customers' },
        { id: 'operators', name: 'Operator Master', targetModule: 'operators' },
        { id: 'drivers', name: 'Driver Master', targetModule: 'drivers' },
      ]
    },
    {
      id: 'booking',
      name: 'Booking',
      icon: ClipboardList,
      roles: ['ADMIN', 'MANAGER', 'OPERATOR'],
      subItems: [
        { id: 'new_booking', name: 'New Booking', targetModule: 'bookings-new' },
        { id: 'active_booking', name: 'Active Booking', targetModule: 'bookings-active' },
        { id: 'completed_booking', name: 'Completed Booking', targetModule: 'bookings-completed' },
      ]
    },
    {
      id: 'billing',
      name: 'Billing',
      icon: CreditCard,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'],
      subItems: [
        { id: 'create_invoice', name: 'Create Invoice', targetModule: 'billing-create' },
        { id: 'invoice_list', name: 'Invoice List', targetModule: 'billing-list' },
        { id: 'payment_collection', name: 'Payments', targetModule: 'billing-payments' },
      ]
    },
    {
      id: 'crm',
      name: 'CRM (Sales)',
      icon: Users,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'OPERATOR'],
      subItems: [
        { id: 'crm_dash', name: 'CRM Dashboard', targetModule: 'crm-dashboard' },
        { id: 'crm_leads', name: 'Leads Management', targetModule: 'crm-leads' },
        { id: 'crm_followups', name: 'Follow-ups & Alerts', targetModule: 'crm-followups' },
        { id: 'crm_quotes', name: 'Quotation Module', targetModule: 'crm-quotations' },
        { id: 'crm_exec', name: 'Executive Dashboard', targetModule: 'crm-executive' },
        { id: 'crm_reports', name: 'CRM Reports', targetModule: 'crm-reports' },
      ]
    },
    {
      id: 'marketing',
      name: 'WhatsApp CRM',
      icon: MessageSquare,
      roles: ['ADMIN', 'MANAGER', 'MARKETING', 'OPERATOR'],
      subItems: [
        { id: 'marketing_dash', name: 'Dashboard', targetModule: 'marketing-dashboard' },
        { id: 'marketing_contacts', name: 'Contacts', targetModule: 'marketing-contacts' },
        { id: 'marketing_temp', name: 'Templates', targetModule: 'marketing-templates' },
        { id: 'marketing_camp', name: 'Bulk Campaign', targetModule: 'marketing-campaigns' },
        { id: 'marketing_reports', name: 'Campaign Reports', targetModule: 'marketing-reports' },
      ]
    },
    {
      id: 'accounts',
      name: 'Accounts',
      icon: BookOpen,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'],
      subItems: [
        { id: 'ledger_master', name: 'Ledger Master', targetModule: 'accounts-ledger' },
        { id: 'receipt_voucher', name: 'Receipt Voucher', targetModule: 'accounts-receipt' },
        { id: 'payment_voucher', name: 'Payment Voucher', targetModule: 'accounts-payment' },
        { id: 'journal_voucher', name: 'Journal Voucher', targetModule: 'accounts-journal' },
        { id: 'contra_voucher', name: 'Contra Voucher', targetModule: 'accounts-contra' },
        { id: 'day_book', name: 'Day Book', targetModule: 'accounts-day-book' },
        { id: 'cash_book', name: 'Cash Book', targetModule: 'accounts-cash-book' },
        { id: 'bank_book', name: 'Bank Book', targetModule: 'accounts-bank-book' },
        { id: 'ledger_report', name: 'Ledger Report', targetModule: 'accounts-ledger-report' },
        { id: 'trial_balance', name: 'Trial Balance', targetModule: 'accounts-trial-balance' },
        { id: 'balance_sheet', name: 'Balance Sheet', targetModule: 'accounts-balance-sheet' },
        { id: 'profit_loss', name: 'Profit & Loss', targetModule: 'accounts-profit-loss' },
      ]
    },
    {
      id: 'expenses',
      name: 'Expenses',
      icon: Fuel,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'OPERATOR'],
      subItems: [
        { id: 'diesel', name: 'Diesel Expense', targetModule: 'expenses-diesel' },
        { id: 'maint_expense', name: 'Maintenance Expense', targetModule: 'expenses-maintenance' },
        { id: 'other_expenses', name: 'Other Expenses', targetModule: 'expenses-other' },
      ]
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: Wrench,
      roles: ['ADMIN', 'MANAGER'],
      subItems: [
        { id: 'service_entry', name: 'Service Entry', targetModule: 'maintenance-entry' },
        { id: 'spare_parts', name: 'Spare Parts', targetModule: 'maintenance-parts' },
        { id: 'service_history', name: 'Service History', targetModule: 'maintenance-history' },
      ]
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: FileText,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'],
      subItems: [
        { id: 'mach_rep', name: 'Machine Report', targetModule: 'reports-machine' },
        { id: 'cust_rep', name: 'Customer Report', targetModule: 'reports-customer' },
        { id: 'book_rep', name: 'Booking Report', targetModule: 'reports-booking' },
        { id: 'bill_rep', name: 'Billing Report', targetModule: 'reports-billing' },
        { id: 'exp_rep', name: 'Expense Report', targetModule: 'reports-expense' },
        { id: 'out_rep', name: 'Outstanding Report', targetModule: 'reports-outstanding' },
        { id: 'gst_rep', name: 'GST Report', targetModule: 'reports-gst' },
      ]
    },
    {
      id: 'employees',
      name: 'Employees & HR',
      icon: UserCheck,
      roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'],
      subItems: [
        { id: 'emp_dir', name: 'Employee Directory', targetModule: 'employees-directory' },
        { id: 'emp_att', name: 'Attendance Logs', targetModule: 'employees-attendance' },
        { id: 'emp_sal', name: 'Calculate Payroll', targetModule: 'employees-salary' },
        { id: 'emp_slp', name: 'Salary Slips', targetModule: 'employees-salary-slip' },
        { id: 'emp_rol', name: 'Roles & RBAC', targetModule: 'employees-roles' },
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      roles: ['ADMIN', 'MANAGER'],
      subItems: [
        { id: 'company_profile', name: 'Company Profile', targetModule: 'settings-profile' },
        { id: 'language_opt', name: 'Language', targetModule: 'settings-language' },
        { id: 'whatsapp_opt', name: 'WhatsApp Integration', targetModule: 'marketing-settings' },
      ]
    }
  ];

  const allowedGroups = navGroups.filter(g => g.roles.includes(currentUser?.role || 'ADMIN'));
  const filteredBranches = branches.filter(b => b.companyId === selectedCompanyId);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-slate-800 z-40 flex items-center justify-between px-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 focus:outline-none"
            id="btn-mobile-menu-open"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-black text-slate-950 text-[10px] tracking-wider shadow-sm shadow-amber-500/20 border border-amber-300/40">
              JCB
            </div>
            <span className="font-bold text-sm text-amber-400 font-sans tracking-tight">JCB 360</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg text-slate-300 hover:text-amber-400"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex no-print">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-10 h-full max-w-xs shadow-2xl">
            <aside 
              className="w-72 bg-[#0c0c0e] text-slate-100 flex flex-col h-full border-r border-slate-800 shrink-0 select-none overflow-y-auto"
              id="mobile-drawer-sidebar"
            >
              {/* Brand Header with Close Button */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0c0c0e]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xs tracking-wider shadow-sm shadow-amber-500/20 border border-amber-300/40">
                    JCB
                  </div>
                  <div>
                    <h1 className="font-sans font-bold text-base leading-none text-amber-400 tracking-tight">JCB 360</h1>
                    <span className="text-[10px] text-slate-400 tracking-widest font-mono uppercase">ERP BILLING v3.6</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Multi-Company / Multi-Branch switcher */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider block mb-1">COMPANY</label>
                    <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200">
                      <Building size={14} className="text-amber-500 shrink-0" />
                      <select 
                        value={selectedCompanyId} 
                        onChange={(e) => {
                          const compId = parseInt(e.target.value, 10);
                          setSelectedCompanyId(compId);
                          const firstB = branches.find(b => b.companyId === compId);
                          if (firstB) setSelectedBranchId(firstB.id);
                        }}
                        className="bg-transparent border-none text-slate-200 focus:outline-none w-full font-medium cursor-pointer"
                      >
                        {companies.map(c => (
                          <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider block mb-1">OPERATIONAL BRANCH</label>
                    <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200">
                      <Layers size={14} className="text-amber-500 shrink-0" />
                      <select 
                        value={selectedBranchId} 
                        onChange={(e) => setSelectedBranchId(parseInt(e.target.value, 10))}
                        className="bg-transparent border-none text-slate-200 focus:outline-none w-full font-medium cursor-pointer"
                      >
                        {filteredBranches.map(b => (
                          <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">{b.name} ({b.code})</option>
                        ))}
                        {filteredBranches.length === 0 && (
                          <option value={0} className="bg-slate-900 text-slate-200">No Branch</option>
                        )}
                      </select>
                    </div>
                  </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                <button
                  onClick={() => {
                    navigate('/');
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activePath === '/' 
                      ? 'bg-amber-500 text-slate-950 font-semibold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard size={18} className="shrink-0" />
                  <span className="truncate">{getTranslation(language, 'dashboard', 'Dashboard')}</span>
                </button>

                {allowedGroups.map(group => {
                  const GroupIcon = group.icon;
                  const isOpen = openGroups[group.id];
                  const isAnyChildActive = group.subItems.some(sub => activePath === getPathFromModule(sub.targetModule));

                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          isAnyChildActive 
                            ? 'bg-slate-800 text-amber-400 border border-slate-700' 
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <GroupIcon size={18} className={isAnyChildActive ? "text-amber-400" : "text-slate-400"} />
                          <span className="truncate">{group.name}</span>
                        </div>
                        {isOpen ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="pl-8 pr-1 space-y-1 pt-0.5 pb-1">
                          {group.subItems.map(sub => {
                            const subPath = getPathFromModule(sub.targetModule);
                            const isSubActive = activePath === subPath;

                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  navigate(subPath);
                                  setMobileDrawerOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors block truncate ${
                                  isSubActive
                                    ? 'bg-amber-500/20 text-amber-400 font-bold border-l-2 border-amber-500'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                }`}
                              >
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* User profile */}
              <div className="p-3 border-t border-slate-800 bg-[#0c0c0e]">
                <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0 border border-slate-600">
                    {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-amber-500 font-mono uppercase tracking-wider">{currentUser?.role || 'ADMIN'}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 shrink-0"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Desktop Static Sidebar */}
      <aside 
        className="hidden lg:flex w-72 bg-[#0c0c0e] text-slate-100 flex-col transition-all duration-300 border-r border-slate-800 shrink-0 select-none no-print h-screen overflow-y-auto"
        id="main-sidebar"
      >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0c0c0e]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xs tracking-wider shadow-sm shadow-amber-500/20 border border-amber-300/40">
            JCB
          </div>
          <div>
            <h1 className="font-sans font-bold text-base leading-none text-amber-400 tracking-tight">JCB 360</h1>
            <span className="text-[10px] text-slate-400 tracking-widest font-mono uppercase">ERP BILLING v3.6</span>
          </div>
        </div>
      </div>

      {/* Multi-Company / Multi-Branch switcher */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-2.5">
          <div>
            <label className="text-[10px] text-slate-400 font-mono tracking-wider block mb-1">COMPANY</label>
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200">
              <Building size={14} className="text-amber-500 shrink-0" />
              <select 
                value={selectedCompanyId} 
                onChange={(e) => {
                  const compId = parseInt(e.target.value, 10);
                  setSelectedCompanyId(compId);
                  const firstB = branches.find(b => b.companyId === compId);
                  if (firstB) setSelectedBranchId(firstB.id);
                }}
                className="bg-transparent border-none text-slate-200 focus:outline-none w-full font-medium cursor-pointer"
                id="select-company-switch"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-mono tracking-wider block mb-1">OPERATIONAL BRANCH</label>
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200">
              <Layers size={14} className="text-amber-500 shrink-0" />
              <select 
                value={selectedBranchId} 
                onChange={(e) => setSelectedBranchId(parseInt(e.target.value, 10))}
                className="bg-transparent border-none text-slate-200 focus:outline-none w-full font-medium cursor-pointer"
                id="select-branch-switch"
              >
                {filteredBranches.map(b => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">{b.name} ({b.code})</option>
                ))}
                {filteredBranches.length === 0 && (
                  <option value={0} className="bg-slate-900 text-slate-200">No Branch</option>
                )}
              </select>
            </div>
          </div>
        </div>

      {/* Navigation Links with Expandable Submenus */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* STANDALONE DASHBOARD LINK */}
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
            activePath === '/' 
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/15' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          }`}
          id="nav-item-dashboard"
        >
          <LayoutDashboard size={18} className={`${activePath === '/' ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'} transition-colors shrink-0`} />
          <span>Dashboard</span>
        </button>

        {/* EXPANDABLE CATEGORIES */}
        {allowedGroups.map((group) => {
          const GroupIcon = group.icon;
          const isGroupOpen = !!openGroups[group.id];
          const hasActiveSub = group.subItems.some(sub => activePath === getPathFromModule(sub.targetModule));
          const translatedGroupName = getTranslation(language, group.id, group.name);

          return (
            <div key={group.id} className="space-y-0.5">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  hasActiveSub && !isGroupOpen
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
                id={`group-header-${group.id}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <GroupIcon size={18} className={`${hasActiveSub ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-400'} transition-colors shrink-0`} />
                  <span className="truncate">{translatedGroupName}</span>
                </div>
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  {isGroupOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>

              {/* Sub-items list */}
              {isGroupOpen && (
                <div className="pl-6 ml-2.5 border-l border-slate-800/80 space-y-0.5 py-1">
                  {group.subItems.map((sub) => {
                    const subPath = getPathFromModule(sub.targetModule);
                    const isSubActive = activePath === subPath;
                    const translatedSubName = getTranslation(language, sub.id, sub.name);

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => navigate(subPath)}
                        className={`w-full text-left px-3.5 py-1.5 rounded-md text-xs transition-all ${
                          isSubActive
                            ? 'text-amber-500 font-bold bg-amber-500/10 border-l-2 border-amber-500 rounded-l-none'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                        }`}
                        id={`sub-item-${sub.id}`}
                      >
                        {translatedSubName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User Panel */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
        <div className="space-y-2 px-1 py-1 bg-slate-900/50 rounded-lg p-2 border border-slate-800/60">
            {/* Language Quick Switch */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase tracking-widest">{getTranslation(language, 'language', 'Language')}</span>
              <div className="flex gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${language === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${language === 'ta' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            {/* Theme Dropdown Selector */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 uppercase tracking-widest">{getTranslation(language, 'theme', 'Theme')}</span>
              <select
                value={appTheme}
                onChange={(e) => setAppTheme(e.target.value)}
                className="bg-slate-950 text-slate-200 text-[10px] py-0.5 px-1 rounded border border-slate-800 focus:outline-none focus:border-amber-500 font-mono max-w-[100px]"
              >
                <option value="default-blue">Blue</option>
                <option value="professional-dark">Dark Gold</option>
                <option value="construction-yellow">JCB Yellow</option>
                <option value="green">Forest Green</option>
                <option value="purple">Royal Purple</option>
                <option value="red">Crimson Fleet</option>
                <option value="light-mode">Light Mode</option>
                <option value="dark-mode">Classic Dark</option>
                <option value="high-contrast">Hi-Contrast</option>
              </select>
            </div>
          </div>

        <div className="flex items-center justify-between px-1">
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Notification log"
            id="btn-sidebar-notif"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-sans font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setAppTheme(appTheme === 'light-mode' ? 'professional-dark' : 'light-mode')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Toggle Light/Dark Theme Quick"
            id="btn-sidebar-theme"
          >
            {appTheme === 'light-mode' ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
          </button>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0 select-none border border-slate-600">
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'Administrator'}</p>
            <p className="text-[10px] text-amber-500 font-mono uppercase tracking-wider">{currentUser?.role || 'ADMIN'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
            title={getTranslation(language, 'logout', 'Sign Out')}
            id="btn-sidebar-logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
