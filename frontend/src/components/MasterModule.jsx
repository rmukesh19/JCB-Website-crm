import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  X
} from "lucide-react";
export default function MasterModule({ type, data, onCreate, onUpdate, onDelete }) {
  const config = {
    machines: {
      title: "JCB Machinery Master",
      subtitle: "REGISTRATION, HOURLY/DAILY LEASE VALUES, AND MAINTENANCE HOURS",
      searchKeys: ["modelName", "plateNumber", "chassisNumber"],
      filterKey: "status",
      filterOptions: ["AVAILABLE", "RUNNING", "MAINTENANCE", "OUT_OF_SERVICE"],
      headers: ["Model Name", "Registration No.", "Hourly Rate", "Daily Rate", "Current Hours", "Status"],
      fields: [
        { name: "modelName", label: "Model Name", type: "text", placeholder: "e.g. JCB 3DX Super", required: true },
        { name: "plateNumber", label: "Registration Plate Number", type: "text", placeholder: "e.g. TN-01-AX-4521", required: true },
        { name: "hourlyRate", label: "Hourly Lease Rate (\u20B9)", type: "number", placeholder: "e.g. 1200", required: true },
        { name: "dailyRate", label: "Daily Lease Rate (\u20B9)", type: "number", placeholder: "e.g. 9000", required: true },
        { name: "weeklyRate", label: "Weekly Lease Rate (\u20B9)", type: "number", placeholder: "e.g. 55000", required: true },
        { name: "monthlyRate", label: "Monthly Lease Rate (\u20B9)", type: "number", placeholder: "e.g. 210000", required: true },
        { name: "chassisNumber", label: "Chassis Chassis No.", type: "text", placeholder: "e.g. JDX9942A", required: false },
        { name: "engineNumber", label: "Engine Serial No.", type: "text", placeholder: "e.g. EG8871A", required: false },
        { name: "nextServiceDueHours", label: "Next Service Run Limit (Hours)", type: "number", placeholder: "e.g. 250", required: true }
      ]
    },
    customers: {
      title: "Corporate Customers Master",
      subtitle: "GSTIN, CREDIT LIMIT, AND LIVE OUTSTANDING BALANCE TRACKER",
      searchKeys: ["name", "phone", "email", "gstin"],
      filterKey: "outstanding",
      filterOptions: ["ALL", "HAS_OUTSTANDING", "NO_OUTSTANDING"],
      headers: ["Customer Name", "Contact Phone", "GSTIN", "Outstanding Bal.", "Credit Limit", "Actions"],
      fields: [
        { name: "name", label: "Company / Client Name", type: "text", placeholder: "e.g. L&T Projects", required: true },
        { name: "phone", label: "Mobile / Phone Number", type: "text", placeholder: "e.g. +91 9003001234", required: true },
        { name: "email", label: "Email Address", type: "email", placeholder: "e.g. billing@client.com", required: false },
        { name: "gstin", label: "GSTIN Number", type: "text", placeholder: "e.g. 33AABCU1234F1Z1", required: false },
        { name: "creditLimit", label: "Approved Credit Limit (\u20B9)", type: "number", placeholder: "e.g. 200000", required: true },
        { name: "billingAddress", label: "Complete Billing Address", type: "textarea", placeholder: "Complete postal address", required: false }
      ]
    },
    operators: {
      title: "JCB Operators Registry",
      subtitle: "DRIVING LICENSE VERIFICATION AND SALARY WAGES MANAGER",
      searchKeys: ["name", "phone", "licenseNumber"],
      filterKey: "status",
      filterOptions: ["AVAILABLE", "ON_DUTY", "ON_LEAVE"],
      headers: ["Operator Name", "Phone Number", "License No.", "Wages Rate", "Duty Status"],
      fields: [
        { name: "name", label: "Operator Full Name", type: "text", placeholder: "e.g. Ramesh Kumar", required: true },
        { name: "phone", label: "Primary Phone Number", type: "text", placeholder: "e.g. +91 9771234567", required: true },
        { name: "licenseNumber", label: "Driving License No.", type: "text", placeholder: "e.g. DL-TN01-2015-8841", required: true },
        { name: "salaryType", label: "Salary Wages Basis", type: "select", options: ["MONTHLY", "DAILY"], required: true },
        { name: "salaryRate", label: "Wages Rate (\u20B9)", type: "number", placeholder: "e.g. 18000", required: true }
      ]
    },
    drivers: {
      title: "Transit Drivers Master",
      subtitle: "LOWBED TRAILER DRIVERS RESPONSIBLE FOR JCB SITE TRANSFER",
      searchKeys: ["name", "phone", "licenseNumber"],
      filterKey: "status",
      filterOptions: ["AVAILABLE", "ON_DUTY", "ON_LEAVE"],
      headers: ["Driver Name", "Phone Number", "License No.", "Duty Status"],
      fields: [
        { name: "name", label: "Driver Full Name", type: "text", placeholder: "e.g. Velu Pillai", required: true },
        { name: "phone", label: "Primary Phone Number", type: "text", placeholder: "e.g. +91 9001122334", required: true },
        { name: "licenseNumber", label: "Trailer Driver License No.", type: "text", placeholder: "e.g. DL-TN01-TRANS-881", required: true }
      ]
    }
  }[type];
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("ALL");
  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({});
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);
  const handleAddClick = () => {
    const defaultVals = {};
    config.fields.forEach((f) => {
      if (f.type === "select" && f.options) {
        defaultVals[f.name] = f.options[0];
      } else if (f.type === "number") {
        defaultVals[f.name] = 0;
      } else {
        defaultVals[f.name] = "";
      }
    });
    setFormValues(defaultVals);
    setSelectedItem(null);
    setIsFormOpen(true);
  };
  const handleEditClick = (item) => {
    setFormValues({ ...item });
    setSelectedItem(item);
    setIsFormOpen(true);
  };
  const handleViewClick = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      onUpdate(selectedItem.id, formValues);
    } else {
      onCreate(formValues);
    }
    setIsFormOpen(false);
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const filteredData = React.useMemo(() => {
    let result = [...data];
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return config.searchKeys.some((key) => {
          const val = item[key];
          return val ? String(val).toLowerCase().includes(q) : false;
        });
      });
    }
    if (selectedFilter !== "ALL") {
      if (type === "customers") {
        if (selectedFilter === "HAS_OUTSTANDING") {
          result = result.filter((c) => Number(c.outstandingBalance) > 0);
        } else if (selectedFilter === "NO_OUTSTANDING") {
          result = result.filter((c) => Number(c.outstandingBalance) === 0);
        }
      } else {
        result = result.filter((item) => item[config.filterKey] === selectedFilter);
      }
    }
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") {
          return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortOrder === "asc" ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        }
      });
    }
    return result;
  }, [data, searchTerm, selectedFilter, sortField, sortOrder, type]);
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += config.headers.join(",") + "\r\n";
    filteredData.forEach((item) => {
      const row = [];
      if (type === "machines") {
        row.push(item.modelName, item.plateNumber, String(item.hourlyRate), String(item.dailyRate), String(item.currentHours), item.status);
      } else if (type === "customers") {
        row.push(item.name, item.phone, item.gstin || "N/A", String(item.outstandingBalance), String(item.creditLimit));
      } else if (type === "operators") {
        row.push(item.name, item.phone, item.licenseNumber, `${item.salaryRate}/${item.salaryType}`, item.status);
      } else {
        row.push(item.name, item.phone, item.licenseNumber, item.status);
      }
      csvContent += row.map((v) => `"${v}"`).join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_${type}_Master_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: `master-module-${type}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit", children: "JCB360 MASTERS MODULE" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white font-sans mt-2 tracking-tight", children: config.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-0.5", children: config.subtitle })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAddClick,
          className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-sans px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-amber-500/10 shrink-0",
          id: `btn-add-${type}`,
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 16 }),
            " ADD RECORD"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-slate-900/50 border border-slate-800 rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-5 relative", children: [
        /* @__PURE__ */ jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: `Search by ${config.searchKeys.join(", ")}...`,
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-4 py-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-500 font-mono",
            id: `input-search-${type}`
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxs(
        "select",
        {
          value: selectedFilter,
          onChange: (e) => setSelectedFilter(e.target.value),
          className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2.5 focus:border-amber-500 focus:outline-none font-mono uppercase cursor-pointer",
          id: `select-filter-${type}`,
          children: [
            /* @__PURE__ */ jsx("option", { value: "ALL", children: "All Statuses / Scopes" }),
            type === "customers" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("option", { value: "HAS_OUTSTANDING", children: "Has Outstanding Debt" }),
              /* @__PURE__ */ jsx("option", { value: "NO_OUTSTANDING", children: "Clear Balance" })
            ] }) : config.filterOptions.map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt))
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 flex items-center gap-2 justify-end", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleExportCSV,
            className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-medium px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors",
            title: "Download CSV",
            id: `btn-export-csv-${type}`,
            children: [
              /* @__PURE__ */ jsx(FileSpreadsheet, { size: 15, className: "text-emerald-500" }),
              " CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handlePrint,
            className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-medium px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors",
            title: "Open system printing panel",
            id: `btn-print-${type}`,
            children: [
              /* @__PURE__ */ jsx(Printer, { size: 15, className: "text-amber-500" }),
              " PRINT / PDF"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", id: `table-master-${type}`, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono tracking-wider text-slate-400", children: [
          /* @__PURE__ */ jsx("th", { className: "py-4 px-4 font-semibold", children: "S.No" }),
          type === "machines" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("modelName"), children: [
              "JCB Model ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("plateNumber"), children: [
              "Reg Plate ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("hourlyRate"), children: [
              "Hourly Rate ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("dailyRate"), children: [
              "Daily Rate ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("currentHours"), children: [
              "Total Hours ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Status" })
          ] }),
          type === "customers" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("name"), children: [
              "Customer Name ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Phone Contact" }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "GSTIN" }),
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("outstandingBalance"), children: [
              "Outstanding Debt ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Credit Limit" })
          ] }),
          type === "operators" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("name"), children: [
              "Operator Name ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Phone Contact" }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "License Number" }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Salary Wage Plan" }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Duty Status" })
          ] }),
          type === "drivers" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("th", { className: "py-4 px-3 font-semibold cursor-pointer select-none hover:text-white", onClick: () => handleSort("name"), children: [
              "Driver Name ",
              /* @__PURE__ */ jsx(ArrowUpDown, { size: 12, className: "inline ml-1" })
            ] }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Phone Contact" }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Trailer License No." }),
            /* @__PURE__ */ jsx("th", { className: "py-4 px-3 font-semibold", children: "Status" })
          ] }),
          /* @__PURE__ */ jsx("th", { className: "py-4 px-4 font-semibold text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-800/60 text-xs text-slate-300 font-sans", children: [
          paginatedData.map((item, index) => {
            const sNo = (currentPage - 1) * itemsPerPage + index + 1;
            return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/30 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono font-medium text-slate-500", children: sNo }),
              type === "machines" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-semibold text-slate-100", children: item.modelName }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono text-amber-500 font-bold", children: item.plateNumber }),
                /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono", children: [
                  "\u20B9 ",
                  item.hourlyRate,
                  "/hr"
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono", children: [
                  "\u20B9 ",
                  item.dailyRate,
                  "/day"
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono font-semibold", children: [
                  item.currentHours,
                  " hrs"
                ] }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${item.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : item.status === "RUNNING" ? "bg-sky-500/10 text-sky-400 animate-pulse" : item.status === "MAINTENANCE" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`, children: item.status }) })
              ] }),
              type === "customers" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-semibold text-slate-100", children: item.name }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono", children: item.phone }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono text-slate-400", children: item.gstin || "N/A" }),
                /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono font-bold text-rose-400", children: [
                  "\u20B9 ",
                  Number(item.outstandingBalance).toLocaleString()
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono text-slate-400", children: [
                  "\u20B9 ",
                  Number(item.creditLimit).toLocaleString()
                ] })
              ] }),
              type === "operators" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-semibold text-slate-100", children: item.name }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono", children: item.phone }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono", children: item.licenseNumber }),
                /* @__PURE__ */ jsxs("td", { className: "py-3 px-3 font-mono", children: [
                  "\u20B9 ",
                  item.salaryRate,
                  " (",
                  item.salaryType,
                  ")"
                ] }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${item.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : item.status === "ON_DUTY" ? "bg-sky-500/10 text-sky-400" : "bg-rose-500/10 text-rose-400"}`, children: item.status }) })
              ] }),
              type === "drivers" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-semibold text-slate-100", children: item.name }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono", children: item.phone }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3 font-mono", children: item.licenseNumber }),
                /* @__PURE__ */ jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${item.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : item.status === "ON_DUTY" ? "bg-sky-500/10 text-sky-400" : "bg-rose-500/10 text-rose-400"}`, children: item.status }) })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1.5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleViewClick(item),
                    className: "p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors",
                    title: "View Details",
                    id: `btn-view-${type}-${item.id}`,
                    children: /* @__PURE__ */ jsx(Eye, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleEditClick(item),
                    className: "p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors",
                    title: "Edit Record",
                    id: `btn-edit-${type}-${item.id}`,
                    children: /* @__PURE__ */ jsx(Edit2, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onDelete(item.id),
                    className: "p-1.5 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors",
                    title: "Delete Record",
                    id: `btn-delete-${type}-${item.id}`,
                    children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
                  }
                )
              ] }) })
            ] }, item.id);
          }),
          filteredData.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "text-center py-12 text-slate-500 font-mono", children: "No matching records registered in system." }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 px-4 py-3 flex items-center justify-between border-t border-slate-800 font-mono text-[11px] text-slate-400", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Showing ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-200 font-bold", children: Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1) }),
          " to",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-200 font-bold", children: Math.min(filteredData.length, currentPage * itemsPerPage) }),
          " of",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-200 font-bold", children: filteredData.length }),
          " entries"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage(Math.max(1, currentPage - 1)),
              disabled: currentPage === 1,
              className: "p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white",
              children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "px-3", children: [
            "Page ",
            currentPage,
            " of ",
            totalPages
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)),
              disabled: currentPage === totalPages,
              className: "p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white",
              children: /* @__PURE__ */ jsx(ChevronRight, { size: 14 })
            }
          )
        ] })
      ] })
    ] }),
    isViewOpen && selectedItem && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: "Record Details Overview" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsViewOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4 max-h-[75vh] overflow-y-auto", children: [
        config.fields.map((f) => /* @__PURE__ */ jsxs("div", { className: "border-b border-slate-800/60 pb-2.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-mono uppercase tracking-wider block", children: f.label }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-200 mt-1", children: f.type === "number" ? `\u20B9 ${Number(selectedItem[f.name]).toLocaleString()}` : String(selectedItem[f.name] || "N/A") })
        ] }, f.name)),
        selectedItem.status && /* @__PURE__ */ jsxs("div", { className: "border-b border-slate-800/60 pb-2.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-mono uppercase tracking-wider block", children: "CURRENT STATE STATUS" }),
          /* @__PURE__ */ jsx("span", { className: "inline-block mt-1 px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20", children: selectedItem.status })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-3.5 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsViewOpen(false),
          className: "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition-colors",
          children: "CLOSE"
        }
      ) })
    ] }) }),
    isFormOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleFormSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: selectedItem ? "UPDATE RECORD SPECIFICATIONS" : "REGISTER NEW RECORD ENTRY" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsFormOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-5 space-y-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4", children: config.fields.map((f) => /* @__PURE__ */ jsxs("div", { className: f.type === "textarea" ? "sm:col-span-2" : "", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1.5", children: [
              f.label,
              " ",
              f.required && /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            f.type === "textarea" ? /* @__PURE__ */ jsx(
              "textarea",
              {
                placeholder: f.placeholder,
                value: formValues[f.name] || "",
                onChange: (e) => setFormValues({ ...formValues, [f.name]: e.target.value }),
                required: f.required,
                rows: 3,
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600 font-sans"
              }
            ) : f.type === "select" ? /* @__PURE__ */ jsx(
              "select",
              {
                value: formValues[f.name] || "",
                onChange: (e) => setFormValues({ ...formValues, [f.name]: e.target.value }),
                required: f.required,
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono",
                children: f.options?.map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt))
              }
            ) : /* @__PURE__ */ jsx(
              "input",
              {
                type: f.type,
                placeholder: f.placeholder,
                value: formValues[f.name] || "",
                onChange: (e) => setFormValues({ ...formValues, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value }),
                required: f.required,
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none placeholder-slate-600 font-sans"
              }
            )
          ] }, f.name)) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-t border-slate-800 px-5 py-3.5 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsFormOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "SAVE RECORD SPECIFICATION"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
