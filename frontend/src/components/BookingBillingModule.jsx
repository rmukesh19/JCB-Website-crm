import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Play,
  StopCircle,
  Eye,
  Printer,
  X,
  MapPin,
  Sparkles,
  User,
  Truck,
  QrCode,
  CreditCard,
  FileSpreadsheet
} from "lucide-react";
export default function BookingBillingModule({
  bookings,
  machines,
  customers,
  operators,
  drivers,
  invoices,
  onStartBooking,
  onCompleteBooking,
  onReceivePayment
}) {
  const [activeTab, setActiveTab] = React.useState("active");
  const [isNewBookingOpen, setIsNewBookingOpen] = React.useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [selectedBookingForCompletion, setSelectedBookingForCompletion] = React.useState(null);
  const [completionHours, setCompletionHours] = React.useState(0);

  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/booking/new") {
      setActiveTab("active");
      setIsNewBookingOpen(true);
    } else if (path === "/booking/active") {
      setActiveTab("active");
      setIsNewBookingOpen(false);
    } else if (path === "/booking/completed") {
      setActiveTab("active");
      setIsNewBookingOpen(false);
    } else if (path === "/billing/create") {
      setActiveTab("invoices");
    } else if (path === "/billing/list") {
      setActiveTab("invoices");
    } else if (path === "/billing/payments") {
      setActiveTab("invoices");
    }
  }, [location.pathname]);
  const [newBooking, setNewBooking] = React.useState({
    customerId: "",
    machineId: "",
    operatorId: "",
    driverId: "",
    startHours: 0,
    billingType: "HOURLY",
    billingRate: 0,
    siteLocation: "",
    status: "ACTIVE"
    // starts immediately by default
  });
  const [paymentForm, setPaymentForm] = React.useState({
    amount: 0,
    mode: "BANK",
    ref: ""
  });
  const handleExportInvoicesCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice Number,Date,Customer,Subtotal,Grand Total,Paid Amount,Outstanding Amount,Status\r\n";
    invoices.forEach((inv) => {
      const clientName = customers.find((c) => c.id === inv.customerId)?.name || "Contract client";
      const row = [
        inv.invoiceNumber,
        inv.invoiceDate,
        clientName,
        String(inv.subtotal),
        String(inv.grandTotal),
        String(inv.paidAmount),
        String(inv.outstandingAmount),
        inv.status
      ];
      csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_Tax_Invoices_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  React.useEffect(() => {
    if (newBooking.machineId) {
      const mach = machines.find((m) => m.id === parseInt(newBooking.machineId, 10));
      if (mach) {
        let rate = mach.hourlyRate;
        if (newBooking.billingType === "DAILY") rate = mach.dailyRate;
        else if (newBooking.billingType === "WEEKLY") rate = mach.weeklyRate;
        else if (newBooking.billingType === "MONTHLY") rate = mach.monthlyRate;
        setNewBooking((prev) => ({
          ...prev,
          startHours: mach.currentHours,
          billingRate: rate
        }));
      }
    }
  }, [newBooking.machineId, newBooking.billingType, machines]);

  React.useEffect(() => {
    if (location.state?.prefillCustomerId) {
      setNewBooking((prev) => ({
        ...prev,
        customerId: String(location.state.prefillCustomerId),
        machineId: location.state.prefillMachineId ? String(location.state.prefillMachineId) : prev.machineId,
        siteLocation: location.state.prefillLocation || ""
      }));
      setActiveTab("active");
      setIsNewBookingOpen(true);
    }
  }, [location.state]);
  const handleCreateBookingSubmit = (e) => {
    e.preventDefault();
    onStartBooking({
      customerId: parseInt(newBooking.customerId, 10),
      machineId: parseInt(newBooking.machineId, 10),
      operatorId: parseInt(newBooking.operatorId, 10),
      driverId: newBooking.driverId ? parseInt(newBooking.driverId, 10) : null,
      startHours: Number(newBooking.startHours),
      billingType: newBooking.billingType,
      billingRate: Number(newBooking.billingRate),
      siteLocation: newBooking.siteLocation,
      status: "ACTIVE"
    });
    setIsNewBookingOpen(false);
  };
  const handleCompleteClick = (booking) => {
    const mach = machines.find((m) => m.id === booking.machineId);
    setSelectedBookingForCompletion(booking);
    setCompletionHours(mach ? mach.currentHours + 8 : booking.startHours + 8);
  };
  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (selectedBookingForCompletion) {
      onCompleteBooking(selectedBookingForCompletion.id, completionHours);
      setSelectedBookingForCompletion(null);
    }
  };
  const handleViewInvoice = (inv) => {
    setSelectedInvoice(inv);
    setIsInvoiceOpen(true);
  };
  const handleCollectPaymentClick = (inv) => {
    setSelectedInvoice(inv);
    setPaymentForm({
      amount: inv.outstandingAmount,
      mode: "BANK",
      ref: ""
    });
    setIsPaymentOpen(true);
  };
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (selectedInvoice) {
      onReceivePayment(
        selectedInvoice.id,
        paymentForm.amount,
        paymentForm.mode,
        paymentForm.ref
      );
      setIsPaymentOpen(false);
    }
  };
  const getCustomerName = (id) => customers.find((c) => c.id === id)?.name || "Unknown Customer";
  const getMachinePlate = (id) => machines.find((m) => m.id === id)?.plateNumber || "Unknown Machine";
  const getOperatorName = (id) => operators.find((o) => o.id === id)?.name || "Unknown Operator";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "booking-billing-module", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit", children: "LOGISTICS & CONTRACT BILLING" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white font-sans mt-2 tracking-tight", children: "Booking & Rental Billing Manager" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-0.5", children: "DISPATCH HEAVY MACHINERY, CALCULATE LIVE RENTALS, AND GENERATE GST TAX INVOICES" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full md:w-auto shrink-0 justify-end", children: [
        activeTab === "active" && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsNewBookingOpen(true),
            className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-sans px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md shadow-amber-500/10 transition-colors cursor-pointer",
            id: "btn-new-dispatch",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " DISPATCH MACHINE"
            ]
          }
        ),
        activeTab === "invoices" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleExportInvoicesCSV,
              className: "bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold font-sans px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer",
              title: "Export Invoice List to CSV",
              children: [
                /* @__PURE__ */ jsx(FileSpreadsheet, { size: 16, className: "text-emerald-500" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "EXPORT EXCEL" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => window.print(),
              className: "bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold font-sans px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer",
              title: "Print Invoice List / Save PDF",
              children: [
                /* @__PURE__ */ jsx(Printer, { size: 16, className: "text-amber-500" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "PRINT LEDGER" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    activeTab === "active" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", id: "active-dispatches-grid", children: [
      bookings.filter((b) => b.status === "ACTIVE").map((b) => {
        const machine = machines.find((m) => m.id === b.machineId);
        const customer = customers.find((c) => c.id === b.customerId);
        const op = operators.find((o) => o.id === b.operatorId);
        return /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950/60 p-4 border-b border-slate-800 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest", children: "ACTIVE DEPLOYMENT" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-mono px-2 py-0.5 rounded uppercase", children: [
              b.billingType,
              " Lease"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/10 mt-0.5", children: /* @__PURE__ */ jsx(Truck, { size: 16 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-mono text-slate-400 uppercase tracking-wider", children: "Deploy Unit" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-100 mt-0.5", children: machine?.modelName || "JCB 3DX" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-bold text-amber-400 mt-1 block", children: machine?.plateNumber })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/10 mt-0.5", children: /* @__PURE__ */ jsx(User, { size: 16 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-mono text-slate-400 uppercase tracking-wider", children: "Client / Site Constructor" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-200 mt-0.5", children: customer?.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10 mt-0.5", children: /* @__PURE__ */ jsx(MapPin, { size: 16 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-mono text-slate-400 uppercase tracking-wider", children: "Site Location Address" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 line-clamp-1 mt-0.5", children: b.siteLocation })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border border-slate-800 rounded-lg p-3 grid grid-cols-2 gap-2 text-center font-mono", children: [
              /* @__PURE__ */ jsxs("div", { className: "border-r border-slate-800", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 uppercase", children: "STARTING HOURS" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-slate-200 mt-0.5", children: [
                  b.startHours,
                  " hrs"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 uppercase", children: "BILLING RATE" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-amber-400 mt-0.5", children: [
                  "\u20B9 ",
                  b.billingRate,
                  "/unit"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-950/40 border-t border-slate-800", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleCompleteClick(b),
              className: "w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer",
              id: `btn-complete-booking-${b.id}`,
              children: [
                /* @__PURE__ */ jsx(StopCircle, { size: 15 }),
                " STOP LEASE & BILL WORK"
              ]
            }
          ) })
        ] }, b.id);
      }),
      bookings.filter((b) => b.status === "ACTIVE").length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full bg-slate-900 border border-slate-800 rounded-xl p-12 text-center font-mono text-slate-500", children: 'No active heavy machine deployments at present. Click "Dispatch Machine" to deploy.' })
    ] }),
    activeTab === "invoices" && /* @__PURE__ */ jsx("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", id: "invoices-ledger", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono tracking-wider text-slate-400", children: [
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4", children: "Invoice ID" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Customer Client" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Taxable Subtotal" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Total Grand (GST)" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Paid amount" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Outstanding Debt" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-xs text-slate-300", children: invoices.map((inv) => {
        const clientName = customers.find((c) => c.id === inv.customerId)?.name || "Contract client";
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/30 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono font-bold text-amber-500", children: inv.invoiceNumber }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono", children: inv.invoiceDate }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-semibold text-slate-100", children: clientName }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono", children: [
            "\u20B9 ",
            Number(inv.subtotal).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono font-bold text-slate-100", children: [
            "\u20B9 ",
            Number(inv.grandTotal).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono text-emerald-400", children: [
            "\u20B9 ",
            Number(inv.paidAmount).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono text-rose-400 font-bold", children: [
            "\u20B9 ",
            Number(inv.outstandingAmount).toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : inv.status === "PARTIALLY_PAID" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`, children: inv.status }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1.5", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleViewInvoice(inv),
                className: "p-1.5 rounded bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80 transition-all flex items-center gap-1 font-mono text-[10px]",
                title: "Print invoice",
                id: `btn-view-invoice-${inv.id}`,
                children: [
                  /* @__PURE__ */ jsx(Eye, { size: 12 }),
                  " INVOICE"
                ]
              }
            ),
            inv.outstandingAmount > 0 && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleCollectPaymentClick(inv),
                className: "p-1.5 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/20 transition-all flex items-center gap-1 font-mono text-[10px]",
                title: "Receive Payment",
                id: `btn-collect-payment-${inv.id}`,
                children: [
                  /* @__PURE__ */ jsx(CreditCard, { size: 12 }),
                  " COLLECT"
                ]
              }
            )
          ] }) })
        ] }, inv.id);
      }) })
    ] }) }) }),
    isNewBookingOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleCreateBookingSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "text-amber-500" }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "DEPLOY & DISPATCH MACHINE UNIT" })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsNewBookingOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "CLIENT CONSTRUCTOR *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: newBooking.customerId,
                  onChange: (e) => setNewBooking({ ...newBooking, customerId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Choose Client --" }),
                    customers.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "AVAILABLE MACHINERY UNIT *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: newBooking.machineId,
                  onChange: (e) => setNewBooking({ ...newBooking, machineId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Select Available JCB --" }),
                    machines.filter((m) => m.status === "AVAILABLE").map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
                      m.modelName,
                      " (",
                      m.plateNumber,
                      ")"
                    ] }, m.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "ASSIGN DUTY OPERATOR *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: newBooking.operatorId,
                  onChange: (e) => setNewBooking({ ...newBooking, operatorId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Select Operator --" }),
                    operators.filter((o) => !o.status || o.status === "AVAILABLE" || o.status === "ACTIVE" || o.status !== "ON_DUTY").map((o) => /* @__PURE__ */ jsx("option", { value: o.id, children: o.name }, o.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "TRANSIT TRAILER DRIVER (OPTIONAL)" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: newBooking.driverId,
                  onChange: (e) => setNewBooking({ ...newBooking, driverId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- No Lowbed Trailer (Self Driven) --" }),
                    drivers.filter((d) => !d.status || d.status === "AVAILABLE" || d.status === "ACTIVE" || d.status !== "ON_DUTY").map((d) => /* @__PURE__ */ jsx("option", { value: d.id, children: d.name }, d.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "CONTRACT LEASE BASIS" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: newBooking.billingType,
                  onChange: (e) => setNewBooking({ ...newBooking, billingType: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "HOURLY", children: "HOURLY BASIS" }),
                    /* @__PURE__ */ jsx("option", { value: "DAILY", children: "DAILY BASIS" }),
                    /* @__PURE__ */ jsx("option", { value: "WEEKLY", children: "WEEKLY BASIS" }),
                    /* @__PURE__ */ jsx("option", { value: "MONTHLY", children: "MONTHLY BASIS" }),
                    /* @__PURE__ */ jsx("option", { value: "CONTRACT", children: "CONTRACT FIXED RATE" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "LEASE RATE VALUE (\u20B9) *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  required: true,
                  value: newBooking.billingRate,
                  onChange: (e) => setNewBooking({ ...newBooking, billingRate: Number(e.target.value) }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "MACHINERY STARTING HOURS" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  readOnly: true,
                  value: newBooking.startHours,
                  className: "w-full bg-slate-900 border border-slate-800 text-slate-500 text-xs rounded-lg p-2.5 outline-none font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "SITE LOCATION / CONSTRUCT ADDRESS *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. Metro Rail Site Corridor 4, Chennai",
                  value: newBooking.siteLocation,
                  onChange: (e) => setNewBooking({ ...newBooking, siteLocation: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsNewBookingOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10",
                children: [
                  /* @__PURE__ */ jsx(Play, { size: 14, fill: "currentColor" }),
                  " INITIATE WORK DISPATCH"
                ]
              }
            )
          ] })
        ]
      }
    ) }),
    selectedBookingForCompletion && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleCompleteSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-rose-400 tracking-wider", children: "STOP DEPLOYMENT & CONSOLIDATE WORK" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSelectedBookingForCompletion(null), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
              "You are ending work dispatch for ",
              /* @__PURE__ */ jsx("span", { className: "text-amber-400 font-bold font-mono", children: getMachinePlate(selectedBookingForCompletion.machineId) }),
              " deployed at ",
              /* @__PURE__ */ jsx("span", { className: "text-slate-100 font-semibold", children: selectedBookingForCompletion.siteLocation }),
              "."
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3.5 font-mono text-center bg-slate-950 p-3 rounded-lg border border-slate-800", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: "START HOURS" }),
                /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-slate-300 mt-1", children: [
                  selectedBookingForCompletion.startHours,
                  " hrs"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: "LEASE MODEL" }),
                /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-amber-500 mt-1", children: selectedBookingForCompletion.billingType })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "ENTER FINAL WORKMETER RUN-HOURS *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  required: true,
                  min: selectedBookingForCompletion.startHours,
                  value: completionHours,
                  onChange: (e) => setCompletionHours(Number(e.target.value)),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 mt-1 block", children: "Meter value must be equal or greater than starting hours." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedBookingForCompletion(null),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "CONSOLIDATE WORK & BILL"
              }
            )
          ] })
        ]
      }
    ) }),
    isInvoiceOpen && selectedInvoice && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white text-slate-900 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col", id: "print-tax-invoice-sheet", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-3 flex justify-between items-center print:hidden", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold font-mono text-amber-400", children: "TAX INVOICE BILLING PREVIEW" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => window.print(),
              className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-3.5 py-1.5 rounded flex items-center gap-1 transition-all",
              children: [
                /* @__PURE__ */ jsx(Printer, { size: 14 }),
                " PRINT SHEET / PDF"
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsInvoiceOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-6 flex-1 print:p-0 font-sans leading-relaxed text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b-2 border-slate-200 pb-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs", children: "J" }),
              /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold tracking-tight text-slate-950", children: "JCB360 Infra Projects Ltd" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Guindy Industrial Estate, Chennai - 600032" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
              "GSTIN: ",
              /* @__PURE__ */ jsx("span", { className: "font-mono text-slate-700", children: "33AABCU1234F1Z1" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded", children: "ORIGINAL FOR RECIPIENT" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 uppercase mt-2 tracking-tight", children: "GST TAX INVOICE" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-slate-600 mt-1", children: [
              "Invoice: ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: selectedInvoice.invoiceNumber })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-slate-600", children: [
              "Date: ",
              selectedInvoice.invoiceDate
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 border-b border-slate-100 pb-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-slate-500 uppercase tracking-wider", children: "BILLED TO (BUYER)" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900 mt-1", children: getCustomerName(selectedInvoice.customerId) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: customers.find((c) => c.id === selectedInvoice.customerId)?.billingAddress || "Main site contractor office." }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600 mt-1", children: [
              "GSTIN: ",
              /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold", children: customers.find((c) => c.id === selectedInvoice.customerId)?.gstin || "N/A" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-slate-500 uppercase tracking-wider", children: "DEPLOYMENT METERS" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-700 mt-1", children: [
              "Machinery No: ",
              /* @__PURE__ */ jsx("span", { className: "font-mono font-bold", children: getMachinePlate(bookings.find((b) => b.id === selectedInvoice.bookingId)?.machineId || 0) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-700", children: [
              "Lease Basis: ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold uppercase", children: bookings.find((b) => b.id === selectedInvoice.bookingId)?.billingType || "Hourly" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-700", children: [
              "Site Address: ",
              bookings.find((b) => b.id === selectedInvoice.bookingId)?.siteLocation
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b-2 border-slate-200 text-slate-500 font-mono uppercase text-[10px]", children: [
            /* @__PURE__ */ jsx("th", { className: "py-2.5 font-bold", children: "SL" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 font-bold", children: "Machinery / Lease Description" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 font-bold text-right", children: "Work Duration" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 font-bold text-right", children: "Unit Rate (\u20B9)" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 font-bold text-right", children: "Taxable Subtotal (\u20B9)" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 text-slate-800", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 font-mono", children: "01" }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 font-medium", children: [
              "Heavy Duty JCB Lease Rental Work Charge",
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 mt-0.5", children: [
                "Workmeter Start Hours: ",
                bookings.find((b) => b.id === selectedInvoice.bookingId)?.startHours || 0,
                " hrs | End Hours: ",
                bookings.find((b) => b.id === selectedInvoice.bookingId)?.endHours || 0,
                " hrs"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 text-right font-mono", children: [
              Math.max(1, (bookings.find((b) => b.id === selectedInvoice.bookingId)?.endHours || 0) - (bookings.find((b) => b.id === selectedInvoice.bookingId)?.startHours || 0)),
              " units"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 text-right font-mono", children: [
              "\u20B9 ",
              Number(selectedInvoice.subtotal / Math.max(1, (bookings.find((b) => b.id === selectedInvoice.bookingId)?.endHours || 0) - (bookings.find((b) => b.id === selectedInvoice.bookingId)?.startHours || 0))).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 text-right font-mono", children: [
              "\u20B9 ",
              Number(selectedInvoice.subtotal).toLocaleString()
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 border-t-2 border-slate-200 pt-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center bg-slate-50 p-3.5 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsx("div", { className: "p-1 bg-white border border-slate-200 rounded", children: /* @__PURE__ */ jsx(QrCode, { size: 52, className: "text-slate-900" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-900 flex items-center gap-1 font-mono", children: [
                  /* @__PURE__ */ jsx(Sparkles, { size: 11, className: "text-amber-500" }),
                  " FAST UPI PAYMENT"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-0.5", children: "Scan with GooglePay/PhonePe to settle dues immediately." }),
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-600 font-mono mt-1 font-semibold truncate bg-white px-1.5 py-0.5 rounded border border-slate-100", children: "UPI A/c: corporate@hdfcbank" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-6 w-52 gap-[1px] opacity-75", children: [3, 1, 2, 1, 4, 1, 3, 2, 1, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1].map((w, idx) => /* @__PURE__ */ jsx("div", { className: "bg-slate-950 flex-1", style: { width: `${w}px` } }, idx)) }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-mono text-slate-400 mt-1 block", children: [
                "SYSTEM REF: #",
                selectedInvoice.id,
                "99B01"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs font-mono text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Taxable Subtotal Value:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.subtotal).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-600", children: [
              /* @__PURE__ */ jsx("span", { children: "CGST (9.00%):" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.cgstAmount).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-600", children: [
              /* @__PURE__ */ jsx("span", { children: "SGST (9.00%):" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.sgstAmount).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-600 border-t border-slate-100 pt-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Total Tax Value:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.totalTax).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-900 font-bold text-sm border-t-2 border-slate-200 pt-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Grand Total Due (GST):" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.grandTotal).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-emerald-600 font-bold", children: [
              /* @__PURE__ */ jsx("span", { children: "Receipts Settled:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.paidAmount).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-rose-500 font-bold border-t border-slate-100 pt-1", children: [
              /* @__PURE__ */ jsx("span", { children: "Outstanding Due:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u20B9 ",
                Number(selectedInvoice.outstandingAmount).toLocaleString()
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 pt-5 text-center text-[10px] text-slate-400 font-mono space-y-1", children: [
          /* @__PURE__ */ jsx("p", { children: "Thank you for doing business with JCB360. All claims subject to local Chennai jurisdiction." }),
          /* @__PURE__ */ jsx("p", { children: "This is a computer generated invoice requiring no physical signature." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3.5 flex justify-end print:hidden", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsInvoiceOpen(false),
          className: "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition-colors",
          children: "CLOSE PREVIEW"
        }
      ) })
    ] }) }),
    isPaymentOpen && selectedInvoice && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handlePaymentSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(CreditCard, { size: 15, className: "text-emerald-500" }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-emerald-400 tracking-wider", children: "COLLECT RENTAL DEBT PAYMENT" })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsPaymentOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
              "Log collection transaction against Invoice ",
              /* @__PURE__ */ jsx("span", { className: "text-amber-500 font-bold font-mono", children: selectedInvoice.invoiceNumber }),
              "."
            ] }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "COLLECTED PAYMENT AMOUNT (\u20B9) *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  required: true,
                  max: selectedInvoice.outstandingAmount,
                  value: paymentForm.amount,
                  onChange: (e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono font-bold"
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-500 mt-1 block", children: [
                "Maximum outstanding: \u20B9 ",
                selectedInvoice.outstandingAmount.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "PAYMENT MODE *" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPaymentForm({ ...paymentForm, mode: "BANK" }),
                    className: `p-2.5 text-xs font-bold font-mono rounded-lg border transition-all ${paymentForm.mode === "BANK" ? "bg-amber-500/10 text-amber-400 border-amber-500/40" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"}`,
                    children: "BANK / ONLINE / NEFT"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPaymentForm({ ...paymentForm, mode: "CASH" }),
                    className: `p-2.5 text-xs font-bold font-mono rounded-lg border transition-all ${paymentForm.mode === "CASH" ? "bg-amber-500/10 text-amber-400 border-amber-500/40" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"}`,
                    children: "HARD CASH"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "TRANSACTION REF NO. / REMARKS" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "e.g. UPI Ref, NEFT Slip No, Cash Receipt",
                  value: paymentForm.ref,
                  onChange: (e) => setPaymentForm({ ...paymentForm, ref: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsPaymentOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "CONFIRM DEBT COLLECTION"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
