import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { useLocation } from "react-router-dom";
import {
  TrendingUp,
  Printer
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
export default function ReportsModule({
  machines,
  customers,
  bookings,
  invoices,
  diesel,
  maintenance,
  expenses
}) {
  const [selectedReport, setSelectedReport] = React.useState("machine");
  const [dateFilter, setDateFilter] = React.useState("2026-07");

  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/reports/machine") {
      setSelectedReport("machine");
    } else if (path === "/reports/customer") {
      setSelectedReport("aging");
    } else if (path === "/reports/booking") {
      setSelectedReport("machine");
    } else if (path === "/reports/billing") {
      setSelectedReport("profit");
    } else if (path === "/reports/expense") {
      setSelectedReport("diesel");
    } else if (path === "/reports/outstanding") {
      setSelectedReport("aging");
    } else if (path === "/reports/gst") {
      setSelectedReport("profit");
    }
  }, [location.pathname]);
  const handleExportReportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (selectedReport === "machine") {
      csvContent += "JCB360 - Fleet Utility Yields Report\r\n";
      csvContent += "Machine,Plate,Hours Run,Hours Billed,Diesel Expense,Maintenance Expense,Total Yield\r\n";
      machineReportData.forEach((r) => {
        const row = [r.name, r.plate, String(r.hoursRun), String(r.hoursBilled), String(r.dieselExpense), String(r.maintExpense), String(r.yieldTotal)];
        csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
      });
    } else if (selectedReport === "aging") {
      csvContent += "JCB360 - Debtors Aging Directory\r\n";
      csvContent += "Customer,Phone,GSTIN,Outstanding Debt,Paid Amount,Bills Count\r\n";
      debtorReportData.forEach((r) => {
        const row = [r.name, r.phone, r.gstin || "N/A", String(r.outstanding), String(r.paid), String(r.bills)];
        csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
      });
    } else if (selectedReport === "diesel") {
      csvContent += "JCB360 - Diesel Efficiency Logs Report\r\n";
      csvContent += "Date,Machine Plate,Liters,Cost,Hours Meter\r\n";
      dieselReportData.forEach((r) => {
        const row = [r.date, r.plate, String(r.liters), String(r.cost), String(r.hoursMeter)];
        csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
      });
    } else {
      csvContent += "JCB360 - Operating Income & Expenses Breakdown\r\n";
      csvContent += "Category Name,Total Cost / Yield (\u20B9)\r\n";
      profitPieData.forEach((r) => {
        const row = [r.name, String(r.value)];
        csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_${selectedReport}_Report_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const machineReportData = React.useMemo(() => {
    return machines.map((m) => {
      const machBookings = bookings.filter((b) => b.machineId === m.id);
      const totalHoursBilled = machBookings.reduce((sum, b) => {
        if (b.status === "COMPLETED") {
          return sum + ((b.endHours || b.startHours) - b.startHours);
        }
        return sum;
      }, 0);
      const totalDieselCost = diesel.filter((d) => d.machineId === m.id).reduce((sum, d) => sum + d.totalCost, 0);
      const totalMaintCost = maintenance.filter((mt) => mt.machineId === m.id).reduce((sum, mt) => sum + mt.cost, 0);
      const totalYield = invoices.filter((inv) => {
        const b = bookings.find((bk) => bk.id === inv.bookingId);
        return b && b.machineId === m.id;
      }).reduce((sum, inv) => sum + Number(inv.grandTotal), 0);
      return {
        id: m.id,
        name: m.modelName,
        plate: m.plateNumber,
        hoursRun: m.currentHours,
        hoursBilled: totalHoursBilled,
        dieselExpense: totalDieselCost,
        maintExpense: totalMaintCost,
        yieldTotal: totalYield
      };
    });
  }, [machines, bookings, diesel, maintenance, invoices]);
  const debtorReportData = React.useMemo(() => {
    return customers.map((c) => {
      const clientInvoices = invoices.filter((inv) => inv.customerId === c.id);
      const totalDebt = clientInvoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);
      const paidTotal = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      return {
        name: c.name,
        phone: c.phone,
        gstin: c.gstin,
        outstanding: totalDebt,
        paid: paidTotal,
        bills: clientInvoices.length
      };
    }).filter((d) => d.outstanding > 0 || d.bills > 0);
  }, [customers, invoices]);
  const dieselReportData = React.useMemo(() => {
    return diesel.map((d) => {
      const mach = machines.find((m) => m.id === d.machineId);
      return {
        date: d.fillDate.split("T")[0],
        plate: mach?.plateNumber || "JCB",
        liters: d.quantityLiters,
        cost: d.totalCost,
        hoursMeter: d.currentHours
      };
    });
  }, [diesel, machines]);
  const totalLeaseRevenue = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal), 0);
  const totalDieselOpExpense = diesel.reduce((sum, d) => sum + Number(d.totalCost), 0);
  const totalMaintOpExpense = maintenance.reduce((sum, m) => sum + Number(m.cost), 0);
  const totalOfficeExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const profitPieData = [
    { name: "Fuel Exp", value: totalDieselOpExpense, color: "#f59e0b" },
    { name: "Workshop Repairs", value: totalMaintOpExpense, color: "#f43f5e" },
    { name: "Office Overheads", value: totalOfficeExpense, color: "#6366f1" },
    { name: "Net Capital Surplus", value: Math.max(0, totalLeaseRevenue - (totalDieselOpExpense + totalMaintOpExpense + totalOfficeExpense)), color: "#10b981" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "reports-module", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit", children: "CORPORATE ANALYTICS SHEET" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white font-sans mt-2 tracking-tight", children: "Enterprise Intelligence & Audit Reports" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-0.5", children: "COMPREHENSIVE FLEET YIELDS, AGING DEBTLIST, FUEL SLIPS, AND INCOME ANALYSIS" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 w-full md:w-auto shrink-0 font-mono", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => window.print(),
          className: "bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Printer, { size: 15 }),
            " PRINT AUDIT"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-5 border-b border-slate-800 pb-3", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { size: 14, className: "text-amber-500" }),
            selectedReport === "machine" && "Visual Mach Yield Comparison",
            selectedReport === "aging" && "Active Debts vs Receipts Distribution",
            selectedReport === "diesel" && "Fuel Burn Slip Logs Timeline",
            selectedReport === "profit" && "Operating Income & Expense Allocation"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 font-mono", children: "LIVE INTELLIGENCE" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: selectedReport === "machine" ? /* @__PURE__ */ jsxs(BarChart, { data: machineReportData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e293b" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "plate", stroke: "#64748b", fontSize: 11, fontClassName: "font-mono" }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff", fontFamily: "monospace", fontSize: "11px" } }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "11px", fontFamily: "monospace" } }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "yieldTotal", name: "Rental Billings Yield (\u20B9)", fill: "#f59e0b", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "dieselExpense", name: "Fuel Expense (\u20B9)", fill: "#6366f1", radius: [4, 4, 0, 0] })
        ] }) : selectedReport === "aging" ? /* @__PURE__ */ jsxs(BarChart, { data: debtorReportData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e293b" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff", fontFamily: "monospace", fontSize: "11px" } }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "11px", fontFamily: "monospace" } }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "outstanding", name: "Outstanding Balance (\u20B9)", fill: "#f43f5e", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "paid", name: "Paid Settled (\u20B9)", fill: "#10b981", radius: [4, 4, 0, 0] })
        ] }) : selectedReport === "diesel" ? /* @__PURE__ */ jsxs(AreaChart, { data: dieselReportData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e293b" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", stroke: "#64748b", fontSize: 10 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff", fontFamily: "monospace", fontSize: "11px" } }),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "cost", name: "Diesel Cost (\u20B9)", stroke: "#f59e0b", fill: "#f59e0b", fillOpacity: 0.08 })
        ] }) : /* @__PURE__ */ jsxs(RePieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: profitPieData,
              cx: "50%",
              cy: "50%",
              innerRadius: 50,
              outerRadius: 80,
              paddingAngle: 3,
              dataKey: "value",
              children: profitPieData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff", fontFamily: "monospace", fontSize: "11px" } }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "11px", fontFamily: "monospace" } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "border-b border-slate-800 pb-3 mb-4", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "Executive Summary" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-mono text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 p-3 rounded border border-slate-800", children: [
              /* @__PURE__ */ jsx("p", { className: "text-slate-500 uppercase text-[9px]", children: "TOTAL BILLING REVENUE" }),
              /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-slate-100 mt-1", children: [
                "\u20B9 ",
                totalLeaseRevenue.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 p-3 rounded border border-slate-800", children: [
              /* @__PURE__ */ jsx("p", { className: "text-slate-500 uppercase text-[9px]", children: "DIESEL EXPENDITURE" }),
              /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-slate-100 mt-1", children: [
                "\u20B9 ",
                totalDieselOpExpense.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 p-3 rounded border border-slate-800", children: [
              /* @__PURE__ */ jsx("p", { className: "text-slate-500 uppercase text-[9px]", children: "REPAIRS & SERVICES COST" }),
              /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-slate-100 mt-1", children: [
                "\u20B9 ",
                totalMaintOpExpense.toLocaleString()
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono mt-6", children: "Generated on: 2026-07-11 11:25 UTC" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", id: "tabular-report-sheet", children: [
      selectedReport === "machine" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3 border-b border-slate-800", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "Detailed Machinery Yield Breakdown Ledger" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/40 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-800", children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Model & Plate Number" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Odometer Run Hours" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Billed Lease Hours" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Diesel Expense (\u20B9)" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Service Repair Cost (\u20B9)" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-right", children: "Revenue Yield Earned (\u20B9)" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-slate-300 font-mono", children: machineReportData.map((m) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/10 transition-colors", children: [
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 font-sans font-bold text-slate-200", children: [
              m.name,
              " ",
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-amber-500 ml-1.5 font-bold", children: [
                "[",
                m.plate,
                "]"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right", children: [
              m.hoursRun,
              " hrs"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right text-slate-400", children: [
              m.hoursBilled,
              " hrs"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right text-rose-400", children: [
              "\u20B9 ",
              m.dieselExpense.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right text-indigo-400", children: [
              "\u20B9 ",
              m.maintExpense.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right text-emerald-400 font-bold", children: [
              "\u20B9 ",
              m.yieldTotal.toLocaleString()
            ] })
          ] }, m.id)) })
        ] }) })
      ] }),
      selectedReport === "aging" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3 border-b border-slate-800", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "Debtors Outstanding & Settle Accounts List" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/40 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-800", children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Client Representative Name" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "Contact Details" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "Buyer GSTIN" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Registered Invoices" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Total Settled Receipts (\u20B9)" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-right", children: "Total Outstanding Balance (\u20B9)" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-slate-300 font-mono", children: debtorReportData.map((d, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/10 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-sans font-bold text-slate-200", children: d.name }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-3 text-slate-400", children: d.phone }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-3", children: d.gstin || "N/A" }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right", children: [
              d.bills,
              " billing jobs"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right text-emerald-400", children: [
              "\u20B9 ",
              d.paid.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right text-rose-400 font-bold", children: [
              "\u20B9 ",
              d.outstanding.toLocaleString()
            ] })
          ] }, i)) })
        ] }) })
      ] }),
      selectedReport === "diesel" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3 border-b border-slate-800", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "Detailed Fuel Requisition Slip Audit Trail" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/40 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-800", children: [
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Log Date" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "Machinery Plate" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Quantity Fill (Liters)" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-3 text-right", children: "Average Price (\u20B9/L)" }),
            /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-right", children: "Consolidated Cost Amount (\u20B9)" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-slate-300 font-mono", children: dieselReportData.map((d, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/10 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: d.date }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-3 text-slate-200 font-bold", children: d.plate }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right text-amber-500 font-bold", children: [
              d.liters,
              " L"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 text-right", children: [
              "\u20B9 ",
              d.cost / d.liters
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right font-bold text-slate-100", children: [
              "\u20B9 ",
              d.cost.toLocaleString()
            ] })
          ] }, i)) })
        ] }) })
      ] }),
      selectedReport === "profit" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3 border-b border-slate-800", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "Consolidated Operating Margin Ledger" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3 font-sans text-xs text-slate-300", children: [
          /* @__PURE__ */ jsx("p", { children: "Revenues minus operating expenses calculated directly across HDFC corporate ledger transactions:" }),
          /* @__PURE__ */ jsxs("div", { className: "border border-slate-800 rounded-lg overflow-hidden font-mono text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 bg-slate-950 p-2.5 font-bold text-slate-400", children: [
              /* @__PURE__ */ jsx("span", { children: "OPERATIONAL LINE CATEGORY" }),
              /* @__PURE__ */ jsx("span", { className: "text-right", children: "NET VALUE AMOUNT" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "divide-y divide-slate-800", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 p-2.5", children: [
                /* @__PURE__ */ jsx("span", { children: "Active Lease General Billings (Revenues)" }),
                /* @__PURE__ */ jsxs("span", { className: "text-right text-emerald-400", children: [
                  "+ \u20B9 ",
                  totalLeaseRevenue.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 p-2.5", children: [
                /* @__PURE__ */ jsx("span", { children: "Refuel Slip Disbursals (Fuel cost)" }),
                /* @__PURE__ */ jsxs("span", { className: "text-right text-rose-400", children: [
                  "- \u20B9 ",
                  totalDieselOpExpense.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 p-2.5", children: [
                /* @__PURE__ */ jsx("span", { children: "Machinery Maintenance Servicing (Workshop cost)" }),
                /* @__PURE__ */ jsxs("span", { className: "text-right text-rose-400", children: [
                  "- \u20B9 ",
                  totalMaintOpExpense.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 p-2.5", children: [
                /* @__PURE__ */ jsx("span", { children: "Office Overheads, Salaries & Petty cash (Expenses)" }),
                /* @__PURE__ */ jsxs("span", { className: "text-right text-rose-400", children: [
                  "- \u20B9 ",
                  totalOfficeExpense.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 bg-slate-950 p-2.5 font-bold text-slate-200 border-t border-slate-700", children: [
                /* @__PURE__ */ jsx("span", { children: "NET CAPITAL SURPLUS" }),
                /* @__PURE__ */ jsxs("span", { className: "text-right text-amber-400", children: [
                  "\u20B9 ",
                  (totalLeaseRevenue - (totalDieselOpExpense + totalMaintOpExpense + totalOfficeExpense)).toLocaleString()
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
