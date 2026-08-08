import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  X,
  AlertCircle,
  Printer,
  FileSpreadsheet
} from "lucide-react";
export default function DieselMaintenanceModule({
  diesel,
  maintenance,
  machines,
  operators,
  spareParts,
  suppliers,
  purchases,
  onAddDiesel,
  onAddMaintenance,
  onAddSparePart,
  onAddPurchase,
  onAddSupplier
}) {
  const [activeTab, setActiveTab] = React.useState("diesel");
  const [isDieselOpen, setIsDieselOpen] = React.useState(false);
  const [isMaintOpen, setIsMaintOpen] = React.useState(false);
  const [isPartOpen, setIsPartOpen] = React.useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = React.useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = React.useState(false);

  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/expenses/diesel") {
      setActiveTab("diesel");
      setIsDieselOpen(false);
    } else if (path === "/expenses/maintenance") {
      setActiveTab("maintenance");
      setIsMaintOpen(false);
    } else if (path === "/expenses/other") {
      setActiveTab("inventory");
    } else if (path === "/maintenance/entry") {
      setActiveTab("maintenance");
      setIsMaintOpen(true);
    } else if (path === "/maintenance/parts") {
      setActiveTab("inventory");
      setIsPartOpen(false);
    } else if (path === "/maintenance/history") {
      setActiveTab("maintenance");
      setIsMaintOpen(false);
    }
  }, [location.pathname]);
  const [dieselForm, setDieselForm] = React.useState({
    machineId: "",
    operatorId: "",
    quantityLiters: 50,
    ratePerLiter: 94.5,
    currentHours: 0,
    vendorName: "",
    slipNumber: "",
    paymentMode: "BANK"
  });
  const [maintForm, setMaintForm] = React.useState({
    machineId: "",
    serviceType: "Engine Oil & Filter Replacement",
    serviceHours: 0,
    cost: 5e3,
    description: "",
    technicianName: "",
    partsReplaced: "",
    nextDueHours: 250
  });
  const [partForm, setPartForm] = React.useState({
    partName: "",
    partNumber: "",
    quantity: 5,
    unitPrice: 500,
    minStockLevel: 2
  });
  const [suppForm, setSuppForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: ""
  });
  const [purForm, setPurForm] = React.useState({
    supplierId: "",
    referenceNumber: "",
    partName: "",
    partNumber: "",
    quantity: 10,
    unitPrice: 350
  });
  React.useEffect(() => {
    if (dieselForm.machineId) {
      const mach = machines.find((m) => m.id === parseInt(dieselForm.machineId, 10));
      if (mach) setDieselForm((prev) => ({ ...prev, currentHours: mach.currentHours }));
    }
  }, [dieselForm.machineId, machines]);
  React.useEffect(() => {
    if (maintForm.machineId) {
      const mach = machines.find((m) => m.id === parseInt(maintForm.machineId, 10));
      if (mach) setMaintForm((prev) => ({ ...prev, serviceHours: mach.currentHours, nextDueHours: mach.currentHours + 250 }));
    }
  }, [maintForm.machineId, machines]);
  const handleExportDieselCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Machine,Operator,Liters,Rate,Total Cost,Slip Number,Payment Mode\r\n";
    diesel.forEach((d) => {
      const row = [
        d.date,
        getMachineLabel(d.machineId),
        operators.find((o) => o.id === d.operatorId)?.name || "N/A",
        String(d.quantityLiters),
        String(d.ratePerLiter),
        String(d.totalCost),
        d.slipNumber,
        d.paymentMode
      ];
      csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_Diesel_Logs_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleExportMaintenanceCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Machine,Service Type,Cost,Technician,Next Service Hours,Description\r\n";
    maintenance.forEach((m) => {
      const row = [
        m.date,
        getMachineLabel(m.machineId),
        m.serviceType,
        String(m.cost),
        m.technicianName,
        String(m.nextDueHours),
        m.description || ""
      ];
      csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_Maintenance_Logs_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleExportInventoryCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Part Name,Part Number,Stock Quantity,Unit Price,Min Level,Stock Status\r\n";
    spareParts.forEach((p) => {
      const isLow = p.quantity <= p.minStockLevel;
      const status = isLow ? "LOW STOCK" : "OK";
      const row = [
        p.partName,
        p.partNumber,
        String(p.quantity),
        String(p.unitPrice),
        String(p.minStockLevel),
        status
      ];
      csvContent += row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_Spare_Parts_Inventory_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDieselSubmit = (e) => {
    e.preventDefault();
    onAddDiesel({
      machineId: parseInt(dieselForm.machineId, 10),
      operatorId: parseInt(dieselForm.operatorId, 10),
      quantityLiters: Number(dieselForm.quantityLiters),
      ratePerLiter: Number(dieselForm.ratePerLiter),
      currentHours: Number(dieselForm.currentHours),
      vendorName: dieselForm.vendorName,
      slipNumber: dieselForm.slipNumber,
      paymentMode: dieselForm.paymentMode
    });
    setIsDieselOpen(false);
  };
  const handleMaintSubmit = (e) => {
    e.preventDefault();
    onAddMaintenance({
      machineId: parseInt(maintForm.machineId, 10),
      serviceType: maintForm.serviceType,
      serviceHours: Number(maintForm.serviceHours),
      cost: Number(maintForm.cost),
      description: maintForm.description,
      technicianName: maintForm.technicianName,
      partsReplaced: maintForm.partsReplaced,
      nextDueHours: Number(maintForm.nextDueHours)
    });
    setIsMaintOpen(false);
  };
  const handlePartSubmit = (e) => {
    e.preventDefault();
    onAddSparePart({
      partName: partForm.partName,
      partNumber: partForm.partNumber,
      quantity: Number(partForm.quantity),
      unitPrice: Number(partForm.unitPrice),
      minStockLevel: Number(partForm.minStockLevel)
    });
    setIsPartOpen(false);
  };
  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    onAddSupplier({
      name: suppForm.name,
      phone: suppForm.phone,
      email: suppForm.email,
      gstin: suppForm.gstin,
      address: suppForm.address
    });
    setIsSupplierOpen(false);
  };
  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    onAddPurchase({
      supplierId: parseInt(purForm.supplierId, 10),
      referenceNumber: purForm.referenceNumber,
      totalAmount: Number(purForm.quantity * purForm.unitPrice),
      items: [{
        partName: purForm.partName,
        partNumber: purForm.partNumber,
        quantity: Number(purForm.quantity),
        unitPrice: Number(purForm.unitPrice)
      }]
    });
    setIsPurchaseOpen(false);
  };
  const getMachineLabel = (id) => {
    const m = machines.find((x) => x.id === id);
    return m ? `${m.modelName} (${m.plateNumber})` : "JCB Machine";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "diesel-maintenance-module", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit", children: "FLEET SERVICE OPERATIONS" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white font-sans mt-2 tracking-tight", children: "Diesel, Maintenance & Spares" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-0.5", children: "TRACK REFUELINGS, LOG REPAIR EXPENSES, AND MONITOR INVENTORY OUT-STOCK ALERTS" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full md:w-auto shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 p-1 rounded-lg border border-slate-800 flex", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("diesel"),
              className: `px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === "diesel" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`,
              children: "DIESEL FUEL LOGS"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("maintenance"),
              className: `px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === "maintenance" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`,
              children: "REPAIR & SERVICE CARDS"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("inventory"),
              className: `px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === "inventory" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`,
              children: "SPARES & PURCHASES"
            }
          )
        ] }),
        activeTab === "diesel" && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsDieselOpen(true),
            className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-sans px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0",
            id: "btn-log-diesel",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " LOG REFUEL"
            ]
          }
        ),
        activeTab === "maintenance" && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsMaintOpen(true),
            className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-sans px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0",
            id: "btn-log-maint",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " LOG SERVICE"
            ]
          }
        ),
        activeTab === "inventory" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsPurchaseOpen(true),
              className: "bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-sans px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer",
              id: "btn-purchase-spares",
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                " PURCHASE BILL"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsSupplierOpen(true),
              className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-sans px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer",
              id: "btn-add-supplier",
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                " SUPPLIER"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-l border-slate-800 pl-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (activeTab === "diesel") handleExportDieselCSV();
                else if (activeTab === "maintenance") handleExportMaintenanceCSV();
                else handleExportInventoryCSV();
              },
              className: "bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold font-sans px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0",
              title: "Export Current Tab Data to CSV",
              children: [
                /* @__PURE__ */ jsx(FileSpreadsheet, { size: 16, className: "text-emerald-500" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "hidden lg:inline", children: "EXPORT EXCEL" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => window.print(),
              className: "bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold font-sans px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0",
              title: "Print Current Tab List / Save PDF",
              children: [
                /* @__PURE__ */ jsx(Printer, { size: 16, className: "text-amber-500" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "hidden lg:inline", children: "PRINT" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    activeTab === "diesel" && /* @__PURE__ */ jsx("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", id: "diesel-fuel-logs", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono tracking-wider text-slate-400", children: [
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4", children: "Refuel Date" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "JCB Machine" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Qty Liters" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Rate/Liter" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Total Cost (\u20B9)" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Current Hours" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-3", children: "Bunk Supplier Vendor" }),
        /* @__PURE__ */ jsx("th", { className: "py-4 px-4", children: "Fuel Voucher No" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-xs text-slate-300", children: diesel.map((d) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/30 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono", children: d.fillDate.split("T")[0] }),
        /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-semibold text-slate-100", children: getMachineLabel(d.machineId) }),
        /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono text-amber-500 font-bold", children: [
          d.quantityLiters,
          " L"
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono", children: [
          "\u20B9 ",
          d.ratePerLiter
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono font-bold text-slate-100", children: [
          "\u20B9 ",
          Number(d.totalCost).toLocaleString()
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono", children: [
          d.currentHours,
          " hrs"
        ] }),
        /* @__PURE__ */ jsx("td", { className: "py-3 px-3 text-slate-400", children: d.vendorName || "N/A" }),
        /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono text-slate-500", children: d.slipNumber || "N/A" })
      ] }, d.id)) })
    ] }) }) }),
    activeTab === "maintenance" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", id: "maintenance-cards-grid", children: [
      maintenance.map((m) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b border-slate-800/80 pb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-100", children: m.serviceType }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-amber-500 font-mono uppercase mt-0.5", children: [
              "MACHINE: ",
              getMachineLabel(m.machineId)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-rose-400", children: [
            "\u20B9 ",
            Number(m.cost).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs font-mono", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border border-slate-800 p-2.5 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 uppercase", children: "SERVICE DATE" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-300 mt-0.5", children: m.serviceDate })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border border-slate-800 p-2.5 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 uppercase", children: "RUNNING METER" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-slate-300 mt-0.5", children: [
              m.serviceHours,
              " hrs"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border border-slate-800 p-2.5 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 uppercase", children: "NEXT DUE" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-amber-500 mt-0.5", children: [
              m.nextDueHours || m.serviceHours + 250,
              " hrs"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs space-y-1.5 leading-relaxed text-slate-400 font-sans", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300 font-mono", children: "Technician:" }),
            " ",
            m.technicianName || "In-House workshop worker."
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300 font-mono", children: "Replaced Parts:" }),
            " ",
            m.partsReplaced || "No major spares replacements."
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "bg-slate-950 p-2.5 rounded border border-slate-800/60 text-slate-300 italic", children: [
            '"',
            m.description || "Routine maintenance and healthcheck.",
            '"'
          ] })
        ] })
      ] }, m.id)),
      maintenance.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full bg-slate-900 border border-slate-800 rounded-xl p-12 text-center font-mono text-slate-500", children: "No historical machinery maintenance service records found." })
    ] }),
    activeTab === "inventory" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "spares-inventory-block", children: [
      spareParts.some((p) => p.quantity <= p.minStockLevel) && /* @__PURE__ */ jsxs("div", { className: "bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-xs text-rose-400", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 18, className: "shrink-0 animate-bounce" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold", children: "LOW STOCK DETECTED IN WORKSHOP" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-rose-500/80 mt-0.5", children: "Critical spares are beneath the minimum safe levels. Plan supplier purchases immediately." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "JCB Spare Parts Stock Levels" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsPartOpen(true),
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold font-mono px-3 py-1.5 rounded transition-colors",
                children: "NEW STOCK PART"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/40 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500", children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Part Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "Part Serial" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "In Stock Qty" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "Minimum Safe" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 px-3", children: "Unit Price" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-slate-300", children: spareParts.map((part) => {
              const isLow = part.quantity <= part.minStockLevel;
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/20 transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-semibold text-slate-200", children: part.partName }),
                /* @__PURE__ */ jsx("td", { className: "py-2.5 px-3 font-mono text-slate-400", children: part.partNumber }),
                /* @__PURE__ */ jsxs("td", { className: `py-2.5 px-3 font-mono font-bold ${isLow ? "text-rose-400" : "text-slate-200"}`, children: [
                  part.quantity,
                  " units ",
                  isLow && /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-rose-500/10 border border-rose-500/10 px-1 py-0.5 rounded font-normal uppercase", children: "Critically Low" })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "py-2.5 px-3 font-mono text-slate-500", children: [
                  part.minStockLevel,
                  " units"
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "py-2.5 px-3 font-mono", children: [
                  "\u20B9 ",
                  Number(part.unitPrice).toLocaleString()
                ] })
              ] }, part.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3.5 border-b border-slate-800", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono uppercase text-slate-300", children: "Registered Suppliers" }) }),
            /* @__PURE__ */ jsx("div", { className: "p-4 space-y-3 max-h-[350px] overflow-y-auto", children: suppliers.map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-xs", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-100", children: s.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-500 font-mono mt-1", children: [
                "Phone: ",
                s.phone
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-500 font-mono", children: [
                "GSTIN: ",
                s.gstin || "N/A"
              ] })
            ] }, s.id)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-slate-800 bg-slate-950/30 text-center text-[10px] text-slate-500 font-mono", children: "Suppliers handle spare parts, consumables, and heavy grease orders." })
        ] })
      ] })
    ] }),
    isDieselOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleDieselSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "LOG NEW MACHINE REFUELING" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsDieselOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 max-h-[70vh] overflow-y-auto", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "REFUEL TARGET JCB *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: dieselForm.machineId,
                  onChange: (e) => setDieselForm({ ...dieselForm, machineId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Choose Machine --" }),
                    machines.map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
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
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "REQUISITION OPERATOR ON WORK *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: dieselForm.operatorId,
                  onChange: (e) => setDieselForm({ ...dieselForm, operatorId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Select Operator --" }),
                    operators.map((o) => /* @__PURE__ */ jsx("option", { value: o.id, children: o.name }, o.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3.5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "QUANTITY LITERS *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: dieselForm.quantityLiters,
                    onChange: (e) => setDieselForm({ ...dieselForm, quantityLiters: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "RATE PER LITER (\u20B9) *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: dieselForm.ratePerLiter,
                    onChange: (e) => setDieselForm({ ...dieselForm, ratePerLiter: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3.5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "WORKMETER RUN-HOURS *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: dieselForm.currentHours,
                    onChange: (e) => setDieselForm({ ...dieselForm, currentHours: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "SLIP / VOUCHER NO *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    required: true,
                    placeholder: "e.g. SLIP-452A",
                    value: dieselForm.slipNumber,
                    onChange: (e) => setDieselForm({ ...dieselForm, slipNumber: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "DIESEL BUNK / STATION NAME" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "e.g. Bharat Petroleum, Mylapore",
                  value: dieselForm.vendorName,
                  onChange: (e) => setDieselForm({ ...dieselForm, vendorName: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "PAYMENT OUTLET MODE" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: dieselForm.paymentMode,
                  onChange: (e) => setDieselForm({ ...dieselForm, paymentMode: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "BANK", children: "HDFC Bank account (Digital)" }),
                    /* @__PURE__ */ jsx("option", { value: "CASH", children: "Cash Drawer (Currency)" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsDieselOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "SAVE REFUEL LOG"
              }
            )
          ] })
        ]
      }
    ) }),
    isMaintOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleMaintSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "LOG COMPLETED SERVICE REPAIR" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsMaintOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "SERVICE TARGET JCB *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: maintForm.machineId,
                  onChange: (e) => setMaintForm({ ...maintForm, machineId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Choose Machine --" }),
                    machines.map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
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
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "SERVICE CARD CATEGORY *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  value: maintForm.serviceType,
                  onChange: (e) => setMaintForm({ ...maintForm, serviceType: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "CURRENT SERVICE HOURS *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  required: true,
                  value: maintForm.serviceHours,
                  onChange: (e) => setMaintForm({ ...maintForm, serviceHours: Number(e.target.value) }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "REPAIR BILL VALUE (\u20B9) *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  required: true,
                  value: maintForm.cost,
                  onChange: (e) => setMaintForm({ ...maintForm, cost: Number(e.target.value) }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono font-bold"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "AUTHORIZED TECHNICIAN" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "e.g. Kumar (JCB Workshop)",
                  value: maintForm.technicianName,
                  onChange: (e) => setMaintForm({ ...maintForm, technicianName: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "NEXT SERVICE DUE AFTER (HRS)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  placeholder: "e.g. 250",
                  value: maintForm.nextDueHours,
                  onChange: (e) => setMaintForm({ ...maintForm, nextDueHours: Number(e.target.value) }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "REPLACED WORKSHOP SPARES" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "e.g. Engine Oil (8L), Hydraulic Seal kit, Greasing",
                  value: maintForm.partsReplaced,
                  onChange: (e) => setMaintForm({ ...maintForm, partsReplaced: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "REPAIR REPORT REMARKS" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  placeholder: "Detailed breakdown reasons or comments...",
                  value: maintForm.description,
                  onChange: (e) => setMaintForm({ ...maintForm, description: e.target.value }),
                  rows: 2,
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-sans"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsMaintOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "SAVE SERVICE CARD"
              }
            )
          ] })
        ]
      }
    ) }),
    isPartOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handlePartSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "ADD NEW SPARE ITEM STOCK" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsPartOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "PART ITEM NAME *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. Hydraulic Filter Element",
                  value: partForm.partName,
                  onChange: (e) => setPartForm({ ...partForm, partName: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: "PART NUMBER / SERIAL *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. JCB-HY-009",
                  value: partForm.partNumber,
                  onChange: (e) => setPartForm({ ...partForm, partNumber: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "QTY *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: partForm.quantity,
                    onChange: (e) => setPartForm({ ...partForm, quantity: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "PRICE *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: partForm.unitPrice,
                    onChange: (e) => setPartForm({ ...partForm, unitPrice: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "MIN STOCK" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: partForm.minStockLevel,
                    onChange: (e) => setPartForm({ ...partForm, minStockLevel: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsPartOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "ADD STOCK"
              }
            )
          ] })
        ]
      }
    ) }),
    isPurchaseOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handlePurchaseSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "BOOK SUPPLIER PURCHASE BILL" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsPurchaseOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "SUPPLIER VENDOR *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  required: true,
                  value: purForm.supplierId,
                  onChange: (e) => setPurForm({ ...purForm, supplierId: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Choose Supplier --" }),
                    suppliers.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "REF BILL NUMBER *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. PUR-1002",
                  value: purForm.referenceNumber,
                  onChange: (e) => setPurForm({ ...purForm, referenceNumber: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 border-t border-slate-800/80 pt-4 mt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-amber-500 block mb-3 font-bold", children: "PURCHASED LINE ITEM DETAILS" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "PART NAME *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      placeholder: "e.g. Tooth kit",
                      value: purForm.partName,
                      onChange: (e) => setPurForm({ ...purForm, partName: e.target.value }),
                      className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "SERIAL NUMBER *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      placeholder: "e.g. JCB-BT-202",
                      value: purForm.partNumber,
                      onChange: (e) => setPurForm({ ...purForm, partNumber: e.target.value }),
                      className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:col-span-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "QUANTITY *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: purForm.quantity,
                    onChange: (e) => setPurForm({ ...purForm, quantity: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "UNIT PURCHASE PRICE *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    required: true,
                    value: purForm.unitPrice,
                    onChange: (e) => setPurForm({ ...purForm, unitPrice: Number(e.target.value) }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsPurchaseOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "BOOK BILL"
              }
            )
          ] })
        ]
      }
    ) }),
    isSupplierOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSupplierSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "REGISTER SPARE-PARTS SUPPLIER" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsSupplierOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "SUPPLIER AGENCY NAME *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. JCB Spares Chennai",
                  value: suppForm.name,
                  onChange: (e) => setSuppForm({ ...suppForm, name: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "PHONE CONTACT *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    required: true,
                    placeholder: "e.g. +91 44",
                    value: suppForm.phone,
                    onChange: (e) => setSuppForm({ ...suppForm, phone: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "GSTIN NUMBER" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "e.g. 33AAAC",
                    value: suppForm.gstin,
                    onChange: (e) => setSuppForm({ ...suppForm, gstin: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "EMAIL ADDRESS" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: "e.g. contact@supp.com",
                  value: suppForm.email,
                  onChange: (e) => setSuppForm({ ...suppForm, email: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-sans"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "POSTAL ADDRESS" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Ambattur Industrial Area, Chennai",
                  value: suppForm.address,
                  onChange: (e) => setSuppForm({ ...suppForm, address: e.target.value }),
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
                onClick: () => setIsSupplierOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "SAVE SUPPLIER"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
