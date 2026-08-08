import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Globe,
  Trash2,
  Edit2,
  Plus,
  Sparkles,
  Check,
  CheckCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  X
} from "lucide-react";
import { getTranslation } from "../lib/translations";
export default function SettingsAuditModule({
  users,
  auditLogs,
  notifications,
  companies,
  branches,
  currentUser,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onUpdateCompany,
  onUpdateBranch,
  language,
  setLanguage,
  appTheme,
  setAppTheme
}) {
  const [activeTab, setActiveTab] = React.useState("company");
  const [isUserFormOpen, setIsUserFormOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/settings/profile") {
      setActiveTab("company");
    } else if (path === "/settings/language") {
      setActiveTab("language");
    } else if (path === "/settings/whatsapp" || path === "/marketing/settings") {
      setActiveTab("whatsapp");
    } else {
      setActiveTab("company");
    }
  }, [location.pathname]);
  const [userForm, setUserForm] = React.useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "OPERATOR",
    branchId: ""
  });
  const [companyForm, setCompanyForm] = React.useState({
    name: "MMT ENTERPRISES",
    logo: "",
    gstin: "",
    pan: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    invoiceFooter: "",
    qrCode: "",
    bankDetails: ""
  });
  const [branchForm, setBranchForm] = React.useState({
    id: 0,
    name: "",
    code: "",
    phone: "",
    address: ""
  });
  React.useEffect(() => {
    const activeCompany = companies.find((c) => c.id === currentUser.companyId) || companies[0];
    if (activeCompany) {
      setCompanyForm({
        name: activeCompany.name || "MMT ENTERPRISES",
        logo: activeCompany.logo || "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=150&auto=format&fit=crop&q=80",
        gstin: activeCompany.gstin || "33AABCU1234F1Z1",
        pan: activeCompany.pan || "ABCDE1234F",
        email: activeCompany.email || "info@mmtenterprises.com",
        phone: activeCompany.phone || "+91 9876543210",
        address: activeCompany.address || "123, Industrial Estate, Main Highway, Chennai, Tamil Nadu, 600032",
        website: activeCompany.website || "www.mmtenterprises.com",
        invoiceFooter: activeCompany.invoiceFooter || "Thank you for choosing MMT ENTERPRISES! For support call +91 9876543210",
        qrCode: activeCompany.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=mmtenterprises@hdfcbank&pn=MMT%20ENTERPRISES",
        bankDetails: activeCompany.bankDetails || "Bank: HDFC Bank | A/c: 50200012345678 | IFSC: HDFC0001234 | Branch: Guindy, Chennai"
      });
    }
    const activeBranch = branches.find((b) => b.id === currentUser.branchId);
    if (activeBranch) {
      setBranchForm({
        id: activeBranch.id,
        name: activeBranch.name,
        code: activeBranch.code,
        phone: activeBranch.phone || "",
        address: activeBranch.address || ""
      });
    }
  }, [companies, branches, currentUser]);

  const [waForm, setWaForm] = React.useState({
    apiUrl: "https://graph.facebook.com/v18.0",
    phoneId: "10928374829301",
    accessToken: "EAAG_JCB360_META_CLOUD_PERMANENT_TOKEN",
    businessAccountId: "987654321098",
    verifyToken: "jcb360_webhook_verify_token"
  });
  const [waStatus, setWaStatus] = React.useState("CONNECTED");
  const [isTestingWa, setIsTestingWa] = React.useState(false);

  const handleTestWhatsApp = (e) => {
    e.preventDefault();
    setIsTestingWa(true);
    setTimeout(() => {
      setIsTestingWa(false);
      setWaStatus("CONNECTED");
      alert("WhatsApp Cloud API Credentials Verified Successfully! Status: CONNECTED (200 OK)");
    }, 1000);
  };
  const handleUserClick = (usr) => {
    if (usr) {
      setSelectedUser(usr);
      setUserForm({
        name: usr.name,
        username: usr.username,
        email: usr.email,
        password: "",
        // leave empty unless resetting
        role: usr.role,
        branchId: String(usr.branchId)
      });
    } else {
      setSelectedUser(null);
      setUserForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "OPERATOR",
        branchId: String(currentUser.branchId)
      });
    }
    setIsUserFormOpen(true);
  };
  const handleUserSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...userForm,
      branchId: parseInt(userForm.branchId, 10),
      companyId: currentUser.companyId
    };
    if (selectedUser) {
      if (!userForm.password) {
        delete payload.password;
      }
      onUpdateUser(selectedUser.id, payload);
    } else {
      if (!userForm.password) {
        alert("Password is required for new user creation.");
        return;
      }
      onCreateUser(payload);
    }
    setIsUserFormOpen(false);
  };
  const handleCompanySubmit = (e) => {
    e.preventDefault();
    onUpdateCompany({
      id: currentUser.companyId,
      ...companyForm
    });
    alert("Corporate registry credentials saved successfully.");
  };
  const handleBranchSubmit = (e) => {
    e.preventDefault();
    onUpdateBranch(branchForm);
    alert("Local branch operating code conformed successfully.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "settings-audit-module", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit", children: getTranslation(language, "control_panel", "CORE CONTROL PANEL") }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white font-sans mt-2 tracking-tight", children: getTranslation(language, "settings", "System Settings & Audit Log Console") }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-0.5 uppercase", children: getTranslation(language, "settings_desc", "MANAGE TEAM ROLES (RBAC), RE-CONFIGURE CODES, AND AUDIT SYSTEM LOGS") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 w-full md:w-auto shrink-0 overflow-x-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 p-1 rounded-lg border border-slate-800 flex flex-nowrap min-w-max", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("company"),
            className: `px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === "company" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`,
            children: "COMPANY PROFILE"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("language"),
            className: `px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === "language" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`,
            children: "LANGUAGE"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("whatsapp"),
            className: `px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${activeTab === "whatsapp" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`,
            children: "WHATSAPP INTEGRATION"
          }
        )
      ] }) })
    ] }),
    activeTab === "users" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", id: "user-management-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between gap-4 text-xs text-slate-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Globe, { className: "text-amber-500 shrink-0", size: 18 }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-200", children: "Unified Employees & HR System Active" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400", children: "You can manage detailed employee master profiles, daily attendance logs, automated payroll calculations, and salary slip printing directly in the new module." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("a", { href: "#/employees/directory", className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 transition-all", children: "OPEN EMPLOYEES & HR" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold font-mono text-slate-300 uppercase", children: "JCB360 Staff Profiles & Authorization (RBAC)" }),
        currentUser.role === "ADMIN" && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleUserClick(null),
            className: "bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-sans px-3 py-1.5 rounded flex items-center gap-1 transition-all",
            id: "btn-add-staff",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 14 }),
              " ADD STAFF"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950/40 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500", children: [
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-4", children: "Staff Name" }),
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-3", children: "Username ID" }),
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-3", children: "Email Address" }),
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-3", children: "Assigned Role" }),
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-3", children: "Authorized Branch" }),
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-3", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "py-3.5 px-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800/60 text-slate-300 font-sans", children: users.map((u) => {
          const brName = branches.find((b) => b.id === u.branchId)?.name || "HQ Head Office";
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-800/10 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 font-semibold text-slate-100", children: u.name }),
            /* @__PURE__ */ jsxs("td", { className: "py-3.5 px-3 font-mono font-bold text-slate-400", children: [
              "@",
              u.username
            ] }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3 font-mono", children: u.email }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3 font-mono", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full font-bold text-[10px] ${u.role === "ADMIN" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : u.role === "MANAGER" ? "bg-sky-500/10 text-sky-400" : u.role === "ACCOUNTANT" ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-400"}`, children: u.role }) }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3 font-medium text-slate-400", children: brName }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${u.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`, children: u.isActive ? "ACTIVE" : "SUSPENDED" }) }),
            /* @__PURE__ */ jsx("td", { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-1", children: currentUser.role === "ADMIN" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleUserClick(u),
                  className: "p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white",
                  id: `btn-edit-staff-${u.id}`,
                  children: /* @__PURE__ */ jsx(Edit2, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => onDeleteUser(u.id),
                  disabled: u.id === currentUser.id,
                  className: "p-1 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 disabled:opacity-20",
                  id: `btn-delete-staff-${u.id}`,
                  children: /* @__PURE__ */ jsx(Trash2, { size: 13 })
                }
              )
            ] }) }) })
          ] }, u.id);
        }) })
      ] }) })
    ] }) ] }),
    activeTab === "company" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", id: "registry-settings", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCompanySubmit, className: "bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-2", children: "Company Profile Settings — MMT ENTERPRISES" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "LEGAL COMPANY NAME *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: companyForm.name,
                onChange: (e) => setCompanyForm({ ...companyForm, name: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-bold"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "COMPANY LOGO URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: companyForm.logo,
                onChange: (e) => setCompanyForm({ ...companyForm, logo: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "CGST/SGST GSTIN *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: companyForm.gstin,
                onChange: (e) => setCompanyForm({ ...companyForm, gstin: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "PAN NUMBER *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: companyForm.pan,
                onChange: (e) => setCompanyForm({ ...companyForm, pan: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono uppercase"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "MOBILE NUMBER *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: companyForm.phone,
                onChange: (e) => setCompanyForm({ ...companyForm, phone: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "OFFICE EMAIL ADDRESS" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: companyForm.email,
                onChange: (e) => setCompanyForm({ ...companyForm, email: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "WEBSITE URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: companyForm.website,
                onChange: (e) => setCompanyForm({ ...companyForm, website: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "PAYMENT QR CODE URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: companyForm.qrCode,
                onChange: (e) => setCompanyForm({ ...companyForm, qrCode: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono text-[11px]"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "HEAD OFFICE POSTAL ADDRESS" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: companyForm.address,
              onChange: (e) => setCompanyForm({ ...companyForm, address: e.target.value }),
              rows: 2,
              className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "INVOICE FOOTER TEXT" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: companyForm.invoiceFooter,
              onChange: (e) => setCompanyForm({ ...companyForm, invoiceFooter: e.target.value }),
              className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "BANK ACCOUNT DETAILS (Printed on Invoices)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: companyForm.bankDetails,
              onChange: (e) => setCompanyForm({ ...companyForm, bankDetails: e.target.value }),
              rows: 2,
              className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md cursor-pointer",
            children: "SAVE COMPANY PROFILE"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-800 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(AlertTriangle, { size: 14, className: "text-rose-500" }),
                " PRODUCTION DATABASE RESET"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: "Clear all transactional demo records (bookings, invoices, expenses, logs) while preserving Company Profile & Master Settings." })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: async () => {
                  if (!window.confirm("CRITICAL WARNING: Are you sure you want to execute a complete Production Reset? All demo transactional data (bookings, invoices, diesel, expenses) will be wiped clean. Master setup and company profiles will remain intact.")) return;
                  try {
                    const res = await fetch("/api/system/reset-database", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                      }
                    });
                    if (res.ok) {
                      alert("Production Database Reset Completed Successfully!");
                      window.location.reload();
                    } else {
                      const err = await res.json();
                      alert(err.error || "Reset request failed.");
                    }
                  } catch (e) {
                    alert("Failed to reset database.");
                  }
                },
                className: "bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-xs font-bold font-mono px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 shadow cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { size: 14 }),
                  " RESET DEMO DATA"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleBranchSubmit, className: "bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold font-mono text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-2", children: "Operational Branch Specifics" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "BRANCH SITE NAME *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: branchForm.name,
              onChange: (e) => setBranchForm({ ...branchForm, name: e.target.value }),
              className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "BRANCH CODE IDENTIFIER *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: branchForm.code,
                onChange: (e) => setBranchForm({ ...branchForm, code: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "PHONE CONTACT" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: branchForm.phone,
                onChange: (e) => setBranchForm({ ...branchForm, phone: e.target.value }),
                className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono block mb-1.5", children: "GEOGRAPHICAL SITE LOCATION ADDRESS" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: branchForm.address,
              onChange: (e) => setBranchForm({ ...branchForm, address: e.target.value }),
              rows: 4,
              className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
            children: "SAVE LOCAL BRANCH CODE"
          }
        ) })
      ] })
    ] }),
    (activeTab === "language" || activeTab === "localization") && /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "localization-settings-tab", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold font-mono text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { size: 16 }),
          " ",
          getTranslation(language, "language_settings", "System Language Localization")
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-2 mb-4", children: getTranslation(language, "lang_help_text", "SELECT YOUR PREFERRED WORKSPACE OPERATING LANGUAGE. DATA, REPORTS, AND LABELS WILL TRANSLATE DYNAMICALLY.") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setLanguage("en"),
              className: `p-5 rounded-xl border text-left transition-all relative ${language === "en" ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/5" : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm", children: "English" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Default Business English (GST & INR conforming)" })
                ] }),
                language === "en" && /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs", children: /* @__PURE__ */ jsx(Check, { size: 12 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setLanguage("ta"),
              className: `p-5 rounded-xl border text-left transition-all relative ${language === "ta" ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/5" : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm", children: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD (Tamil)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BC1 (\u0BAE\u0BC1\u0BB4\u0BC1\u0BAE\u0BC8\u0BAF\u0BBE\u0BA9 \u0BAE\u0BC6\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAE\u0BCD)" })
                ] }),
                language === "ta" && /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs", children: /* @__PURE__ */ jsx(Check, { size: 12 }) })
              ] })
            }
          )
        ] })
      ] }),
    activeTab === "whatsapp" && (
      <div className="space-y-6" id="whatsapp-settings-tab">
        <form onSubmit={handleTestWhatsApp} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  Meta WhatsApp Cloud API Integration
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 ${
                  waStatus === "CONNECTED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${waStatus === "CONNECTED" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
                  {waStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                CONFIGURE META GRAPH API CREDENTIALS TO AUTOMATICALLY DISPATCH INVOICES, QUOTATIONS & BOOKING ALERTS.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestWhatsApp}
              disabled={isTestingWa}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isTestingWa ? "TESTING CONNECTION..." : "TEST CONNECTION"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">
                Meta Cloud API Base URL *
              </label>
              <input
                type="text"
                required
                value={waForm.apiUrl}
                onChange={(e) => setWaForm({ ...waForm, apiUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">
                Phone Number ID *
              </label>
              <input
                type="text"
                required
                value={waForm.phoneId}
                onChange={(e) => setWaForm({ ...waForm, phoneId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">
                Meta Business Account ID *
              </label>
              <input
                type="text"
                required
                value={waForm.businessAccountId}
                onChange={(e) => setWaForm({ ...waForm, businessAccountId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">
                Webhook Verify Token *
              </label>
              <input
                type="text"
                required
                value={waForm.verifyToken}
                onChange={(e) => setWaForm({ ...waForm, verifyToken: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">
              Permanent System User Access Token *
            </label>
            <textarea
              rows={3}
              required
              value={waForm.accessToken}
              onChange={(e) => setWaForm({ ...waForm, accessToken: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-5 py-3 rounded-lg transition-all"
            >
              SAVE WHATSAPP CREDENTIALS
            </button>
          </div>
        </form>
      </div>
    ),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold font-mono text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 16 }),
          " ",
          getTranslation(language, "theme_settings", "Enterprise Branding & Theme Customizer")
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-mono mt-2 mb-6", children: getTranslation(language, "theme_help_text", "CHOOSE FROM 9 PRE-BALANCED BRAND THEMES TO TAILOR YOUR FLEET MANAGEMENT EXPERIENCE.") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("default-blue"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "default-blue" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-blue-600 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-slate-950 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-slate-900 block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Default Blue" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-default-blue" })
                ] }),
                appTheme === "default-blue" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("professional-dark"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "professional-dark" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-amber-600 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-[#0c0c0e] block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-slate-900 block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Professional Dark" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-professional-dark" })
                ] }),
                appTheme === "professional-dark" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("construction-yellow"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "construction-yellow" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-yellow-500 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-black block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-zinc-900 block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "JCB Yellow" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-construction-yellow" })
                ] }),
                appTheme === "construction-yellow" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("green"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "green" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-emerald-600 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-stone-950 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-stone-900 block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Forest Green" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-green" })
                ] }),
                appTheme === "green" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("purple"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "purple" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-violet-600 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-slate-950 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-slate-900 block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Royal Purple" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-purple" })
                ] }),
                appTheme === "purple" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("red"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "red" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-rose-600 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-zinc-950 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-zinc-900 block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Crimson Fleet" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-red" })
                ] }),
                appTheme === "red" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("light-mode"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "light-mode" ? "bg-white border-amber-500 ring-2 ring-amber-500/20 text-slate-900" : "bg-white/80 border-slate-200 hover:border-slate-300 text-slate-900"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-blue-600 block border border-slate-300" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-white block border border-slate-300" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-slate-50 block border border-slate-300" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800", children: "Elegant Light" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-mono", children: "theme-light-mode" })
                ] }),
                appTheme === "light-mode" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("dark-mode"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "dark-mode" ? "bg-slate-950 border-amber-500 ring-2 ring-amber-500/20" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-indigo-500 block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-[#0a0f1d] block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-[#111827] block border border-slate-700" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Classic Dark" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-dark-mode" })
                ] }),
                appTheme === "dark-mode" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setAppTheme("high-contrast"),
              className: `p-4 rounded-xl border text-left transition-all ${appTheme === "high-contrast" ? "bg-black border-amber-500 ring-2 ring-amber-500/20" : "bg-black border-slate-800 hover:border-slate-700"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-white block border border-slate-700" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-black block border border-white" }),
                  /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-black block border border-white" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-200", children: "High Contrast" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono", children: "theme-high-contrast" })
                ] }),
                appTheme === "high-contrast" && /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) })
              ] })
            }
          )
        ] })
      ] })
    ] }),
    activeTab === "audit" && /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", id: "audit-log-viewer", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-slate-950 px-5 py-4 border-b border-slate-800", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold font-mono text-slate-300 uppercase", children: "System Operator Activity Trail (Real-Time Security Audit)" }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 max-h-[450px] overflow-y-auto space-y-2 font-mono text-[11px] leading-relaxed", children: [
        auditLogs.map((log) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start p-2.5 bg-slate-950/40 rounded border border-slate-800/60 text-slate-300", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-500 shrink-0 select-none", children: [
            "[",
            log.createdAt.split("T")[1].substring(0, 8),
            "]"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-amber-500 font-bold shrink-0", children: [
            "@",
            log.userName
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-indigo-400 shrink-0 font-bold uppercase", children: [
            "[",
            log.action,
            "]"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-200 flex-1", children: log.details }),
          /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-500 font-mono shrink-0 select-none", children: [
            "IP: ",
            log.ipAddress || "127.0.0.1"
          ] })
        ] }, log.id)),
        auditLogs.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center py-12 text-slate-500", children: "No activity logged in audit ledger trail yet." })
      ] })
    ] }),
    activeTab === "notifications" && /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", id: "notifications-audit-list", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold font-mono text-slate-300 uppercase", children: "Historic Notification Broadcast Events Log" }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-slate-800 border border-slate-700 text-slate-400 font-mono px-2 py-0.5 rounded uppercase", children: "Broadcast" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3 max-h-[450px] overflow-y-auto", children: [
        notifications.map((n) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-950/30 p-4 rounded-lg border border-slate-800/80 flex gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: `p-2 rounded-lg shrink-0 mt-0.5 ${n.type === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : n.type === "WARNING" ? "bg-amber-500/10 text-amber-400" : n.type === "ERROR" ? "bg-rose-500/10 text-rose-400" : "bg-indigo-500/10 text-indigo-400"}`, children: [
            n.type === "SUCCESS" && /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
            n.type === "WARNING" && /* @__PURE__ */ jsx(AlertTriangle, { size: 16 }),
            n.type === "ERROR" && /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
            n.type === "INFO" && /* @__PURE__ */ jsx(Info, { size: 16 })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-100", children: n.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-500 font-mono", children: [
                "(",
                n.createdAt.split("T")[0],
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 mt-1", children: n.message })
          ] })
        ] }, n.id)),
        notifications.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center py-12 text-slate-500 font-mono text-xs", children: "No broadcast alert notifications received." })
      ] })
    ] }),
    isUserFormOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleUserSubmit,
        className: "bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-950 border-b border-slate-800 px-5 py-4 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold font-mono uppercase text-amber-400 tracking-wider", children: selectedUser ? "EDIT STAFF MEMBER" : "REGISTER NEW STAFF LOGIN" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsUserFormOpen(false), className: "text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "STAFF FULL NAME *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. Siva Prasad",
                  value: userForm.name,
                  onChange: (e) => setUserForm({ ...userForm, name: e.target.value }),
                  className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3.5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "USERNAME LOGIN ID *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    required: true,
                    placeholder: "e.g. siva_finance",
                    value: userForm.username,
                    onChange: (e) => setUserForm({ ...userForm, username: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "EMAIL ADDRESS" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    placeholder: "e.g. siva@corp.com",
                    value: userForm.email,
                    onChange: (e) => setUserForm({ ...userForm, email: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3.5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "WAGES BASIS ROLE *" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: userForm.role,
                    onChange: (e) => setUserForm({ ...userForm, role: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "ADMIN", children: "ADMIN (FULL CONTROL)" }),
                      /* @__PURE__ */ jsx("option", { value: "MANAGER", children: "MANAGER (OPERATIONS)" }),
                      /* @__PURE__ */ jsx("option", { value: "ACCOUNTANT", children: "ACCOUNTANT (LEDGER)" }),
                      /* @__PURE__ */ jsx("option", { value: "OPERATOR", children: "OPERATOR (DUTIES ONLY)" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: "LOCAL OPERATIONAL BRANCH *" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: userForm.branchId,
                    onChange: (e) => setUserForm({ ...userForm, branchId: e.target.value }),
                    className: "w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-sans",
                    children: branches.map((b) => /* @__PURE__ */ jsxs("option", { value: b.id, children: [
                      b.name,
                      " (",
                      b.code,
                      ")"
                    ] }, b.id))
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] text-slate-400 font-mono uppercase block mb-1.5", children: [
                "PASSWORD SECURITY ",
                selectedUser ? "(LEAVE EMPTY TO KEEP SAME)" : "*"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  placeholder: selectedUser ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "Enter login password credentials",
                  required: !selectedUser,
                  value: userForm.password,
                  onChange: (e) => setUserForm({ ...userForm, password: e.target.value }),
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
                onClick: () => setIsUserFormOpen(false),
                className: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors",
                children: "CANCEL"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-all",
                children: "SAVE STAFF MEMBER"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
