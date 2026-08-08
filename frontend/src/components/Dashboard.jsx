import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Play, CheckCircle, Calendar, IndianRupee, AlertTriangle, Fuel, ArrowUpRight, TrendingUp, Sparkles, TrendingDown, Eye
} from 'lucide-react';
import { getTranslation } from '../lib/translations.js';

export default function Dashboard({
  machines,
  bookings,
  invoices,
  dieselRecords,
  maintenanceRecords,
  expenses,
  language,
  onNavigate
}) {

  const handleCardClick = (moduleName) => {
    if (onNavigate) {
      onNavigate(moduleName);
    }
  };

  // 1. DYNAMIC DATA CALCULATIONS
  const runningMachinesCount = machines.filter(m => m.status === 'RUNNING').length;
  const availableMachinesCount = machines.filter(m => m.status === 'AVAILABLE').length;
  const maintenanceDueCount = machines.filter(m => m.nextServiceDueHours <= 50).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.startDate.startsWith(todayStr)).length;

  // Revenue totals
  const totalRevenue = invoices.reduce((sum, i) => sum + Number(i.grandTotal || 0), 0);
  const pendingPayments = invoices.reduce((sum, i) => sum + Number(i.outstandingAmount || 0), 0);
  
  const todayRevenue = invoices
    .filter(i => i.invoiceDate.startsWith(todayStr))
    .reduce((sum, i) => sum + Number(i.grandTotal || 0), 0);

  // Diesel Tracking
  const dieselConsumption = dieselRecords.reduce((sum, d) => sum + Number(d.quantityLiters || 0), 0);
  const dieselCost = dieselRecords.reduce((sum, d) => sum + Number(d.totalCost || 0), 0);

  // Maintenance Cost
  const maintenanceCost = maintenanceRecords.reduce((sum, m) => sum + Number(m.cost || 0), 0);

  // Direct Expenses (not including diesel & maintenance)
  const officeExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // Consolidated Expenses
  const totalExpense = dieselCost + maintenanceCost + officeExpenses;

  // Profit & Loss
  const monthlyProfit = totalRevenue - totalExpense;

  // 2. CHART PREPARATIONS
  
  // Chart A: Revenue & Expense Trend (Dynamic last 6 months)
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = [];
  const monthlyMap = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthNames[d.getMonth()];
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    last6Months.push({ label, key });
    monthlyMap[key] = { Revenue: 0, Expense: 0 };
  }

  invoices.forEach(inv => {
    if (inv.invoiceDate) {
      const key = inv.invoiceDate.substring(0, 7);
      if (monthlyMap[key]) {
        monthlyMap[key].Revenue += Number(inv.grandTotal || 0);
      }
    }
  });

  dieselRecords.forEach(d => {
    const dDate = d.fillDate || d.date || d.createdAt;
    if (dDate) {
      const key = String(dDate).substring(0, 7);
      if (monthlyMap[key]) monthlyMap[key].Expense += Number(d.totalCost || 0);
    }
  });

  maintenanceRecords.forEach(m => {
    const mDate = m.serviceDate || m.date || m.createdAt;
    if (mDate) {
      const key = String(mDate).substring(0, 7);
      if (monthlyMap[key]) monthlyMap[key].Expense += Number(m.cost || 0);
    }
  });

  expenses.forEach(e => {
    const eDate = e.expenseDate || e.date || e.createdAt;
    if (eDate) {
      const key = String(eDate).substring(0, 7);
      if (monthlyMap[key]) monthlyMap[key].Expense += Number(e.amount || 0);
    }
  });

  const monthlyPerformanceData = last6Months.map(m => ({
    name: m.label,
    Revenue: monthlyMap[m.key]?.Revenue || 0,
    Expense: monthlyMap[m.key]?.Expense || 0
  }));
  const hasMonthlyPerformanceData = monthlyPerformanceData.some(d => d.Revenue > 0 || d.Expense > 0);

  // Chart B: Machine Utilization
  const machineUtilizationData = machines.map(m => ({
    name: m.plateNumber.split('-').pop() || m.plateNumber,
    Hours: m.currentHours || 0,
    DueService: m.nextServiceDueHours || 0
  }));
  const hasMachineUtilizationData = machineUtilizationData.length > 0;

  // Chart C: Daily Booking Trend (Past 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayLabel = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const count = bookings.filter(b => b.startDate && b.startDate.startsWith(dateStr)).length;
    last7Days.push({ date: displayLabel, Bookings: count });
  }
  const bookingTrendData = last7Days;
  const hasBookingTrendData = bookingTrendData.some(b => b.Bookings > 0);

  // Chart D: Diesel Analysis
  const dieselAnalysisData = dieselRecords.slice(0, 10).map((d, index) => {
    const machine = machines.find(m => m.id === d.machineId);
    return {
      fill: `Fill ${index + 1} (${machine?.plateNumber.split('-')[2] || 'JCB'})`,
      Liters: Number(d.quantityLiters || 0),
      Cost: Number(d.totalCost || 0)
    };
  }).reverse();
  const hasDieselData = dieselAnalysisData.length > 0;

  // Color Constants (Enterprise Theme-Aware Palette)
  const colors = {
    revenue: '#a855f7', // purple
    expense: '#f97316', // orange/brown
    profit: '#10b981', // emerald
    amber: '#f59e0b', // yellow/amber
    slate: '#64748b' // slate
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Executive Welcome Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-500 text-xs px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase flex items-center gap-1">
                <Sparkles size={12} /> {getTranslation(language, 'enterprise_title', 'ENTERPRISE OPERATIONAL SUITE')}
              </span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white mt-2">
              {getTranslation(language, 'welcome_dashboard', 'JCB360 Operational Intelligence Dashboard')}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {getTranslation(language, 'welcome_description', 'Real-time heavy machinery logistics, dynamic rental rate calculation, automatic billing, diesel analytics, and enterprise general bookkeeping.')}
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-right">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{getTranslation(language, 'server_time', 'Server Operational Time')}</p>
            <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">2026-07-11 04:10:33 UTC</p>
          </div>
        </div>
      </div>

      {/* Premium KPI Cards Grid with custom requested colors & animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        
        {/* 1. Running Machines → Green */}
        <div 
          onClick={() => handleCardClick('bookings-active')}
          className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl p-5 shadow-sm hover:border-emerald-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-400 tracking-wider font-mono uppercase">{getTranslation(language, 'running_machines', 'RUNNING MACHINES')}</p>
              <h3 className="text-3xl font-black text-white font-sans tracking-tight mt-1">{runningMachinesCount}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 animate-pulse">
              <Play size={18} fill="currentColor" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-mono">
            ● {getTranslation(language, 'running_desc', 'Active on customer sites')}
          </p>
        </div>

        {/* 2. Available Machines → Blue */}
        <div 
          onClick={() => handleCardClick('machines')}
          className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 rounded-xl p-5 shadow-sm hover:border-blue-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-blue-400 tracking-wider font-mono uppercase">{getTranslation(language, 'available_machines', 'AVAILABLE MACHINES')}</p>
              <h3 className="text-3xl font-black text-white font-sans tracking-tight mt-1">{availableMachinesCount}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-mono">
            ● {getTranslation(language, 'available_desc', 'Ready for prompt dispatch')}
          </p>
        </div>

        {/* 3. Today's Booking → Orange */}
        <div 
          onClick={() => handleCardClick('bookings-new')}
          className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-xl p-5 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-amber-500 tracking-wider font-mono uppercase">{getTranslation(language, 'todays_bookings', "TODAY'S BOOKINGS")}</p>
              <h3 className="text-3xl font-black text-white font-sans tracking-tight mt-1">{todayBookingsCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <Calendar size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-mono">
            ● {getTranslation(language, 'bookings_desc', 'New orders logged today')}
          </p>
        </div>

        {/* 4. Today's Revenue → Purple */}
        <div 
          onClick={() => handleCardClick('billing-list')}
          className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 rounded-xl p-5 shadow-sm hover:border-purple-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-purple-400 tracking-wider font-mono uppercase">{getTranslation(language, 'todays_revenue', "TODAY'S REVENUE")}</p>
              <h3 className="text-2xl font-black text-white font-sans tracking-tight mt-1.5">₹ {todayRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <IndianRupee size={18} />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1 font-mono">
            <ArrowUpRight size={12} /> {getTranslation(language, 'live_gst', 'Live GST billing logs')}
          </p>
        </div>

        {/* 5. Pending Payment → Red */}
        <div 
          onClick={() => handleCardClick('billing-payments')}
          className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 rounded-xl p-5 shadow-sm hover:border-rose-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-rose-400 tracking-wider font-mono uppercase">{getTranslation(language, 'pending_payment', 'PENDING PAYMENT')}</p>
              <h3 className="text-2xl font-black text-white font-sans tracking-tight mt-1.5">₹ {pendingPayments.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
              <IndianRupee size={18} />
            </div>
          </div>
          <p className="text-xs text-rose-400 mt-3 flex items-center gap-1 font-mono">
            ● {getTranslation(language, 'debt_desc', 'Awaiting debtors collection')}
          </p>
        </div>

        {/* 6. Machine Under Service → Yellow */}
        <div 
          onClick={() => handleCardClick('maintenance-entry')}
          className="bg-gradient-to-br from-yellow-950/40 via-slate-900 to-slate-900 border border-yellow-500/20 rounded-xl p-5 shadow-sm hover:border-yellow-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-yellow-500 tracking-wider font-mono uppercase">{getTranslation(language, 'under_service', 'UNDER SERVICE')}</p>
              <h3 className="text-3xl font-black text-white font-sans tracking-tight mt-1">{maintenanceDueCount}</h3>
            </div>
            <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-xs text-amber-500 mt-3 flex items-center gap-1 font-mono">
            ● {getTranslation(language, 'service_desc', 'Machines due for run service')}
          </p>
        </div>

        {/* 7. Expenses → Brown/Orange */}
        <div 
          onClick={() => handleCardClick('expenses-other')}
          className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-orange-500/20 rounded-xl p-5 shadow-sm hover:border-orange-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-orange-400 tracking-wider font-mono uppercase">{getTranslation(language, 'expenses', 'TOTAL EXPENSES')}</p>
              <h3 className="text-2xl font-black text-white font-sans tracking-tight mt-1.5">₹ {totalExpense.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
              <Fuel size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-mono">
            ● {getTranslation(language, 'fuel_maintenance', 'Fuel, parts & branch bills')}
          </p>
        </div>

        {/* 8. Profit → Emerald */}
        <div 
          onClick={() => handleCardClick('reports-billing')}
          className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl p-5 shadow-sm hover:border-emerald-500/40 hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-400 tracking-wider font-mono uppercase">{getTranslation(language, 'profit', 'NET PROFIT')}</p>
              <h3 className={`text-2xl font-black font-sans tracking-tight mt-1.5 ${monthlyProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹ {monthlyProfit.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1 font-mono">
            <ArrowUpRight size={12} /> {getTranslation(language, 'revenue_minus_expense', 'Operational margin')}
          </p>
        </div>

      </div>

      {/* Charts Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts">
        
        {/* Chart 1: Revenue vs Expense Trend (Area Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">{getTranslation(language, 'rev_exp_analytics', 'Revenue & Expense Analytics')}</h4>
              <p className="text-xs text-slate-500 font-mono uppercase">{getTranslation(language, 'financial_log', 'FINANCIAL LOGS')}</p>
            </div>
            <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-1 rounded">
              {getTranslation(language, 'monthly_cumulative', 'Monthly Cumulative')}
            </span>
          </div>
          <div className="h-72 w-full relative">
            {!hasMonthlyPerformanceData && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[1px] rounded-lg border border-dashed border-slate-800 text-center p-4">
                <p className="text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider">No Transaction Data Available</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Chart automatically populates as you generate invoices and record operational expenses.</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={colors.revenue} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.expense} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={colors.expense} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: 12, marginTop: 10 }} />
                <Area type="monotone" dataKey="Revenue" stroke={colors.revenue} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Total Revenues (INR)" />
                <Area type="monotone" dataKey="Expense" stroke={colors.expense} fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} name="Total Expenses (INR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Machine Utilization Run Hours (Bar Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">{getTranslation(language, 'machinery_utilization', 'Machinery Hours Run (Utilization)')}</h4>
              <p className="text-xs text-slate-500 font-mono uppercase">{getTranslation(language, 'fleet_accumulation', 'FLEET ACCUMULATION HOURS')}</p>
            </div>
            <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-1 rounded">
              {getTranslation(language, 'actual_hours', 'Actual Hours')}
            </span>
          </div>
          <div className="h-72 w-full relative">
            {!hasMachineUtilizationData && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[1px] rounded-lg border border-dashed border-slate-800 text-center p-4">
                <p className="text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider">No Machines Registered</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Add JCB machines in Fleet Master to track running hours and service schedules.</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineUtilizationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: 12, marginTop: 10 }} />
                <Bar dataKey="Hours" fill="#eab308" name="Lifetime Run Hours" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DueService" fill="#ef4444" name="Hours Remaining for Next Service" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Booking Trend (Line Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">{getTranslation(language, 'weekly_booking_trend', 'Weekly Booking Trend')}</h4>
              <p className="text-xs text-slate-500 font-mono uppercase">{getTranslation(language, 'dispatch_schedule', 'DISPATCH SCHEDULE LOGS')}</p>
            </div>
            <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-1 rounded">
              {getTranslation(language, 'days_window', '7 Days Window')}
            </span>
          </div>
          <div className="h-72 w-full relative">
            {!hasBookingTrendData && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[1px] rounded-lg border border-dashed border-slate-800 text-center p-4">
                <p className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">No Active Bookings Logged</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">New machine bookings made in the current week will show up here.</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="Bookings" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="Count of Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Fuel Cost and Liters analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">{getTranslation(language, 'diesel_logs', 'Diesel Consumption Logs')}</h4>
              <p className="text-xs text-slate-500 font-mono uppercase">{getTranslation(language, 'efficiency_cost', 'LITERS & CORRESPONDING COST')}</p>
            </div>
            <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-1 rounded">
              {getTranslation(language, 'fuel_efficiency', 'Fuel Efficiency')}
            </span>
          </div>
          <div className="h-72 w-full relative">
            {!hasDieselData && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[1px] rounded-lg border border-dashed border-slate-800 text-center p-4">
                <p className="text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider">No Diesel Records Found</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Log refuel entries in Diesel Management to monitor consumption analytics.</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dieselAnalysisData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fill" stroke="#64748b" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: 12, marginTop: 10 }} />
                <Area type="monotone" dataKey="Liters" stroke="#f97316" fill="#f97316" fillOpacity={0.1} name="Fuel (Liters)" strokeWidth={2} />
                <Area type="monotone" dataKey="Cost" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Refuel Cost (₹)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
