import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare, Send, LayoutDashboard, Settings, Layers, Image as ImageIcon,
  Plus, Edit, Trash2, Search, Filter, Calendar, Clock, AlertTriangle, CheckCircle,
  FileText, Download, User, DollarSign, TrendingUp, BarChart2, Check, ArrowRight,
  Eye, RefreshCw, X, Shield, Globe, Activity, Users, Flame, Paperclip, Printer,
  FileSpreadsheet, Upload, CheckCheck
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

export default function MarketingModule({
  currentUser,
  token,
  getHeaders,
  showToast,
  loadAllData
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Role Access Verification
  const userRole = (currentUser?.role || "ADMIN").toUpperCase();
  const isAllowedRole = ["ADMIN", "MARKETING", "MANAGER"].includes(userRole);

  // Active sub-navigation tab inside marketing module
  const [activeTab, setActiveTab] = React.useState("dashboard"); // dashboard, contacts, templates, campaigns, reports

  // State collections
  const [templates, setTemplates] = React.useState([
    { id: 1, name: "New Rental Offers", category: "Promotions", subType: "New Offers", body: "Hello {{CustomerName}}, Exciting news! JCB 360 announces 15% discount on Backhoe Loader rentals for upcoming projects in {{Branch}}. Book today!", language: "en_US" },
    { id: 2, name: "Diwali Festival Discount", category: "Promotions", subType: "Festival Offers", body: "Dear {{CustomerName}}, Happy Festival Season! Get free operator & diesel bonus on 5+ days machine bookings. Valid till end of month.", language: "en_US" },
    { id: 3, name: "Payment Overdue Alert", category: "Utility", subType: "Payment Reminder", body: "Dear {{CustomerName}}, Payment reminder for Invoice #{{InvoiceNo}} for amount Rs. {{Amount}}. Kindly arrange payment at the earliest. Thank you!", language: "en_US" },
    { id: 4, name: "Booking Confirmation", category: "Utility", subType: "Booking Confirmation", body: "Hi {{CustomerName}}, Your booking for JCB 3DX #{{BookingNo}} is confirmed for {{Branch}}. Machine dispatch scheduled.", language: "en_US" },
  ]);

  const [campaigns, setCampaigns] = React.useState([
    { id: 101, name: "Monsoon Contractor Outreach", campaignType: "Promotions", subType: "Discount Offers", customerType: "Contractor", branchName: "Chennai HO", sentCount: 45, deliveredCount: 42, readCount: 38, failedCount: 3, pendingCount: 0, posterUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600", createdAt: "2026-07-20T10:30:00Z", status: "COMPLETED" },
    { id: 102, name: "Builder Payment Reminder Blast", campaignType: "Utility", subType: "Payment Reminder", customerType: "Builder", branchName: "Madurai", sentCount: 28, deliveredCount: 28, readCount: 25, failedCount: 0, pendingCount: 0, posterUrl: null, createdAt: "2026-07-25T14:15:00Z", status: "COMPLETED" },
  ]);

  const [contacts, setContacts] = React.useState([
    { id: 1, name: "Rajesh Sharma", mobile: "+91 98401 23456", customerType: "Builder", company: "Metro Infra Construction", branchName: "Chennai HO", totalCampaigns: 4, status: "Active" },
    { id: 2, name: "Anand Kumar", mobile: "+91 97890 12345", customerType: "Contractor", company: "AK Earthmovers", branchName: "Madurai", totalCampaigns: 3, status: "Active" },
    { id: 3, name: "Suresh Prabhu", mobile: "+91 94440 98765", customerType: "Civil Engineer", company: "Prabhu Engineering Works", branchName: "Chennai HO", totalCampaigns: 5, status: "Active" },
    { id: 4, name: "Muthu Raman", mobile: "+91 98940 54321", customerType: "Operator", company: "Sri Murugan JCB Services", branchName: "Coimbatore", totalCampaigns: 2, status: "Active" },
    { id: 5, name: "Karthik Raja", mobile: "+91 91760 11223", customerType: "Machine Owner", company: "Karthik Rentals", branchName: "Trichy", totalCampaigns: 6, status: "Active" },
    { id: 6, name: "Venkatesh Babu", mobile: "+91 98840 33445", customerType: "Rental Company", company: "Southern Fleet Solutions", branchName: "Chennai HO", totalCampaigns: 8, status: "Active" },
    { id: 7, name: "Dinesh Sharma", mobile: "+91 99620 55667", customerType: "Individual", company: "Self Employed", branchName: "Madurai", totalCampaigns: 1, status: "Active" },
    { id: 8, name: "Selvam Periasamy", mobile: "+91 94430 77889", customerType: "Builder", company: "Selvam Real Estates", branchName: "Coimbatore", totalCampaigns: 3, status: "Active" },
    { id: 9, name: "Gopalakrishnan V", mobile: "+91 98410 99000", customerType: "Contractor", company: "Gopal Infrastructure", branchName: "Trichy", totalCampaigns: 2, status: "Active" },
  ]);

  const [logs, setLogs] = React.useState([
    { id: 1, campaignName: "Monsoon Contractor Outreach", customerName: "Anand Kumar", mobileNumber: "+91 97890 12345", customerType: "Contractor", branchName: "Madurai", campaignType: "Promotions", messageText: "Exciting news! JCB 360 announces 15% discount on Backhoe Loader rentals for upcoming projects in Madurai.", status: "READ", sentAt: "2026-07-20T10:31:00Z" },
    { id: 2, campaignName: "Monsoon Contractor Outreach", customerName: "Gopalakrishnan V", mobileNumber: "+91 98410 99000", customerType: "Contractor", branchName: "Trichy", campaignType: "Promotions", messageText: "Exciting news! JCB 360 announces 15% discount on Backhoe Loader rentals for upcoming projects in Trichy.", status: "DELIVERED", sentAt: "2026-07-20T10:31:05Z" },
    { id: 3, campaignName: "Builder Payment Reminder Blast", customerName: "Rajesh Sharma", mobileNumber: "+91 98401 23456", customerType: "Builder", branchName: "Chennai HO", campaignType: "Utility", messageText: "Dear Rajesh Sharma, Payment reminder for Invoice #INV-2026-089 for amount Rs. 45,000. Kindly arrange payment at the earliest.", status: "READ", sentAt: "2026-07-25T14:16:00Z" },
    { id: 4, campaignName: "Builder Payment Reminder Blast", customerName: "Selvam Periasamy", mobileNumber: "+91 94430 77889", customerType: "Builder", branchName: "Coimbatore", campaignType: "Utility", messageText: "Dear Selvam Periasamy, Payment reminder for Invoice #INV-2026-104 for amount Rs. 82,500. Kindly arrange payment at the earliest.", status: "SENT", sentAt: "2026-07-25T14:16:10Z" },
  ]);

  // Bulk Campaign Creation Form State
  const [campaignForm, setCampaignForm] = React.useState({
    name: "",
    campaignType: "Promotions", // Mandatory: Promotions / Utility
    subType: "New Offers",
    customerType: "Builder", // Builder, Contractor, Civil Engineer, Operator, Machine Owner, Rental Company, Individual
    branchName: "ALL",
    templateId: "",
    messageBody: "Dear {{CustomerName}}, We have special JCB 360 rental packages tailored for your upcoming projects. Contact us today!",
    posterFile: null,
    posterPreviewUrl: "",
    pdfFile: null,
    pdfFileName: "",
    isScheduled: false,
    scheduleDate: "",
    scheduleTime: ""
  });

  // Filter & Search states for Reports & Contacts
  const [reportSearch, setReportSearch] = React.useState("");
  const [reportDateFilter, setReportDateFilter] = React.useState("ALL"); // ALL, TODAY, WEEK, MONTH
  const [reportStatusFilter, setReportStatusFilter] = React.useState("ALL");
  const [contactSearch, setContactSearch] = React.useState("");
  const [contactTypeFilter, setContactTypeFilter] = React.useState("ALL");

  // Template Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [templateForm, setTemplateForm] = React.useState({
    name: "",
    category: "Promotions",
    subType: "New Offers",
    body: "",
    language: "en_US"
  });

  // Customer Type Options
  const CUSTOMER_TYPES = [
    "Builder",
    "Contractor",
    "Civil Engineer",
    "Operator",
    "Machine Owner",
    "Rental Company",
    "Individual"
  ];

  // Campaign Type Sub-Categories
  const CAMPAIGN_SUBTYPES = {
    Promotions: [
      "New Offers",
      "Discount Offers",
      "Festival Offers",
      "Rental Offers",
      "Finance Offers"
    ],
    Utility: [
      "Payment Reminder",
      "Follow-up Reminder",
      "Booking Confirmation",
      "Invoice Copy",
      "Service Reminder",
      "Welcome Message"
    ]
  };

  // Sync route subpaths with activeTab
  React.useEffect(() => {
    const path = location.pathname;
    if (path.endsWith("/dashboard")) setActiveTab("dashboard");
    else if (path.endsWith("/contacts")) setActiveTab("contacts");
    else if (path.endsWith("/templates")) setActiveTab("templates");
    else if (path.endsWith("/campaigns")) setActiveTab("campaigns");
    else if (path.endsWith("/reports")) setActiveTab("reports");
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/marketing/${tab}`);
  };

  // Handle Poster Upload (JPG, PNG, PDF up to 10MB)
  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds maximum limit of 10 MB.", "ERROR");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      showToast("Unsupported file format. Please upload JPG, PNG, or PDF.", "WARNING");
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCampaignForm(prev => ({
          ...prev,
          posterFile: file,
          posterPreviewUrl: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setCampaignForm(prev => ({
        ...prev,
        posterFile: file,
        posterPreviewUrl: ""
      }));
    }
    showToast(`Uploaded ${file.name} successfully!`, "SUCCESS");
  };

  // Handle PDF Upload (Optional up to 10MB)
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("PDF file size exceeds maximum limit of 10 MB.", "ERROR");
      return;
    }

    if (file.type !== "application/pdf") {
      showToast("Please upload a valid PDF document.", "WARNING");
      return;
    }

    setCampaignForm(prev => ({
      ...prev,
      pdfFile: file,
      pdfFileName: file.name
    }));
    showToast(`Attached PDF: ${file.name}`, "SUCCESS");
  };

  // Launch Bulk Campaign
  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    if (!campaignForm.name) {
      showToast("Please enter a Campaign Name.", "WARNING");
      return;
    }

    // Filter targeted customers strictly by Customer Type and Branch
    const targetContacts = contacts.filter(c => {
      const typeMatch = campaignForm.customerType === "ALL" || c.customerType === campaignForm.customerType;
      const branchMatch = campaignForm.branchName === "ALL" || c.branchName === campaignForm.branchName;
      return typeMatch && branchMatch;
    });

    if (targetContacts.length === 0) {
      showToast(`No contacts found matching Customer Type: ${campaignForm.customerType}.`, "WARNING");
      return;
    }

    const newCampaignId = Date.now();
    const newCampaign = {
      id: newCampaignId,
      name: campaignForm.name,
      campaignType: campaignForm.campaignType,
      subType: campaignForm.subType,
      customerType: campaignForm.customerType,
      branchName: campaignForm.branchName,
      sentCount: targetContacts.length,
      deliveredCount: targetContacts.length,
      readCount: Math.floor(targetContacts.length * 0.8),
      failedCount: 0,
      pendingCount: 0,
      posterUrl: campaignForm.posterPreviewUrl || null,
      pdfName: campaignForm.pdfFileName || null,
      createdAt: new Date().toISOString(),
      status: campaignForm.isScheduled ? "SCHEDULED" : "COMPLETED"
    };

    setCampaigns([newCampaign, ...campaigns]);

    // Create delivery report logs for each targeted contact
    const newLogs = targetContacts.map((contact, idx) => ({
      id: Date.now() + idx,
      campaignName: campaignForm.name,
      customerName: contact.name,
      mobileNumber: contact.mobile,
      customerType: contact.customerType,
      branchName: contact.branchName,
      campaignType: campaignForm.campaignType,
      messageText: campaignForm.messageBody.replace("{{CustomerName}}", contact.name).replace("{{Branch}}", contact.branchName),
      status: idx % 4 === 0 ? "READ" : idx % 5 === 0 ? "SENT" : "DELIVERED",
      sentAt: new Date().toISOString()
    }));

    setLogs([...newLogs, ...logs]);

    showToast(`WhatsApp Campaign "${campaignForm.name}" launched to ${targetContacts.length} ${campaignForm.customerType} customers!`, "SUCCESS");

    // Reset Form
    setCampaignForm({
      name: "",
      campaignType: "Promotions",
      subType: "New Offers",
      customerType: "Builder",
      branchName: "ALL",
      templateId: "",
      messageBody: "Dear {{CustomerName}}, We have special JCB 360 rental packages tailored for your upcoming projects. Contact us today!",
      posterFile: null,
      posterPreviewUrl: "",
      pdfFile: null,
      pdfFileName: "",
      isScheduled: false,
      scheduleDate: "",
      scheduleTime: ""
    });

    handleTabChange("reports");
  };

  // Export CSV function for Delivery Reports
  const exportCSV = () => {
    const headers = ["ID", "Customer Name", "Mobile Number", "Customer Type", "Campaign Name", "Type", "Status", "Sent At"];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.customerName}"`,
      `"${l.mobileNumber}"`,
      `"${l.customerType}"`,
      `"${l.campaignName}"`,
      `"${l.campaignType}"`,
      `"${l.status}"`,
      `"${new Date(l.sentAt).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp_campaign_reports_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Delivery Report downloaded successfully!", "SUCCESS");
  };

  // Export PDF / Print Delivery Reports
  const exportPDF = () => {
    window.print();
  };

  // Aggregated Report Metrics
  const totalSent = logs.length;
  const deliveredCount = logs.filter(l => l.status === "DELIVERED" || l.status === "READ").length;
  const readCount = logs.filter(l => l.status === "READ").length;
  const failedCount = logs.filter(l => l.status === "FAILED").length;
  const pendingCount = logs.filter(l => l.status === "SENT").length;

  // Filter logs for Delivery Reports
  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.customerName.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          l.mobileNumber.includes(reportSearch) ||
                          l.campaignName.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          l.customerType.toLowerCase().includes(reportSearch.toLowerCase());
    const matchesStatus = reportStatusFilter === "ALL" || l.status === reportStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Target count for campaign form
  const targetContactCount = contacts.filter(c => {
    const typeMatch = campaignForm.customerType === "ALL" || c.customerType === campaignForm.customerType;
    const branchMatch = campaignForm.branchName === "ALL" || c.branchName === campaignForm.branchName;
    return typeMatch && branchMatch;
  }).length;

  // Role Restriction Screen
  if (!isAllowedRole) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 my-12 max-w-xl mx-auto shadow-2xl">
        <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-rose-500/20">
          <Shield size={32} />
        </div>
        <h2 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">Access Restricted</h2>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Only <strong className="text-amber-400">Administrator</strong>, <strong className="text-amber-400">Marketing</strong>, and <strong className="text-amber-400">Manager</strong> roles can access the WhatsApp CRM module. Your current role ({userRole}) does not have permission.
        </p>
      </div>
    );
  }

  return (
    <div id="whatsapp-crm-root" className="space-y-6 font-sans">
      
      {/* Module Title & Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100 uppercase tracking-wider font-sans">
                WhatsApp CRM
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Official Bulk Marketing Campaigns, Customer Directory, Templates & Delivery Reports
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap bg-slate-900/80 p-1 rounded-xl border border-slate-800 gap-1 shrink-0">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "contacts", label: "Contacts", icon: Users },
            { id: "templates", label: "Templates", icon: Layers },
            { id: "campaigns", label: "Bulk Campaign", icon: Send },
            { id: "reports", label: "Campaign Reports", icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  active 
                    ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/15" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                }`}
                id={`tab-btn-${tab.id}`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW: DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Stats overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Dispatches</span>
                <span className="text-2xl font-black text-slate-100 font-mono block mt-1">{totalSent}</span>
                <span className="text-[9px] text-emerald-400 font-mono mt-1 block">● Meta Cloud API Active</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                <Send size={20} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Delivered Messages</span>
                <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">{deliveredCount}</span>
                <span className="text-[9px] text-slate-400 font-mono mt-1 block">{totalSent > 0 ? Math.round((deliveredCount/totalSent)*100) : 0}% delivery success</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckCheck size={20} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Read Messages</span>
                <span className="text-2xl font-black text-amber-400 font-mono block mt-1">{readCount}</span>
                <span className="text-[9px] text-slate-400 font-mono mt-1 block">{totalSent > 0 ? Math.round((readCount/totalSent)*100) : 0}% engagement rate</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Eye size={20} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Contacts</span>
                <span className="text-2xl font-black text-slate-100 font-mono block mt-1">{contacts.length}</span>
                <span className="text-[9px] text-amber-500 font-mono mt-1 block">Segmented by Customer Type</span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Users size={20} />
              </div>
            </div>
          </div>

          {/* Recent Campaigns Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                <Activity size={15} className="text-amber-500" />
                Recent Campaign Launches
              </h3>
              <button
                onClick={() => handleTabChange("campaigns")}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + CREATE CAMPAIGN
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map(c => (
                <div key={c.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3 hover:border-amber-500/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          c.campaignType === "Promotions" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {c.campaignType}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Target: <strong className="text-slate-200">{c.customerType}</strong></span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mt-1 font-mono">{c.name}</h4>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block uppercase text-[8px]">Recipients</span>
                      <strong className="text-slate-100 text-xs">{c.sentCount}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-400 block uppercase text-[8px]">Delivered</span>
                      <strong className="text-emerald-400 text-xs">{c.deliveredCount}</strong>
                    </div>
                    <div>
                      <span className="text-amber-400 block uppercase text-[8px]">Read</span>
                      <strong className="text-amber-400 text-xs">{c.readCount}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CONTACTS */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search contacts by name, company, mobile..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-2 pl-9 pr-4 text-white font-mono focus:outline-none focus:border-amber-500 w-full"
                />
              </div>

              <select
                value={contactTypeFilter}
                onChange={(e) => setContactTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-slate-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Customer Types</option>
                {CUSTOMER_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing <strong className="text-amber-400">{contacts.filter(c => (contactTypeFilter === "ALL" || c.customerType === contactTypeFilter) && (c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.company.toLowerCase().includes(contactSearch.toLowerCase()))).length}</strong> WhatsApp Contacts
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase bg-slate-950/60">
                    <th className="py-3 px-4 font-bold">Contact Name</th>
                    <th className="py-3 px-4 font-bold">WhatsApp Mobile</th>
                    <th className="py-3 px-4 font-bold">Customer Type</th>
                    <th className="py-3 px-4 font-bold">Company / Organization</th>
                    <th className="py-3 px-4 font-bold">Assigned Branch</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-mono">
                  {contacts
                    .filter(c => (contactTypeFilter === "ALL" || c.customerType === contactTypeFilter) && (c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.company.toLowerCase().includes(contactSearch.toLowerCase())))
                    .map(contact => (
                      <tr key={contact.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-100">{contact.name}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">{contact.mobile}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            {contact.customerType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{contact.company}</td>
                        <td className="py-3.5 px-4 text-slate-400">{contact.branchName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase">
                            Opted-In
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TEMPLATES */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              WhatsApp Message Template Library (Promotions & Utility)
            </h3>
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setTemplateForm({ name: "", category: "Promotions", subType: "New Offers", body: "", language: "en_US" });
                setIsTemplateModalOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus size={14} />
              NEW TEMPLATE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(t => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition-all space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        t.category === "Promotions" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {t.category} ● {t.subType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 mt-2 font-mono">{t.name}</h4>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-lg font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {t.body}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Language: <strong className="text-slate-300">{t.language}</strong></span>
                  <button
                    onClick={() => {
                      setCampaignForm(prev => ({ ...prev, templateId: t.id.toString(), messageBody: t.body, campaignType: t.category, subType: t.subType }));
                      handleTabChange("campaigns");
                    }}
                    className="text-amber-400 hover:underline font-bold uppercase"
                  >
                    Use In Campaign →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: BULK CAMPAIGN */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
                <Send size={16} className="text-amber-500" />
                Create & Dispatch WhatsApp Bulk Campaign
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Upload your marketing poster manually. The uploaded poster will be sent directly to customers without modification.
              </p>
            </div>

            <form onSubmit={handleLaunchCampaign} className="space-y-6">
              {/* Row 1: Campaign Name & Mandatory Campaign Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-mono text-amber-400 tracking-wider block mb-1 uppercase font-bold">
                    CAMPAIGN NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    placeholder="e.g. Q3 Backhoe Rental Discount Offer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-amber-400 tracking-wider block mb-1 uppercase font-bold">
                    CAMPAIGN TYPE * (MANDATORY)
                  </label>
                  <select
                    required
                    value={campaignForm.campaignType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const defaultSubType = CAMPAIGN_SUBTYPES[newType][0];
                      setCampaignForm({ ...campaignForm, campaignType: newType, subType: defaultSubType });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Promotions">Promotions (Offers / Discounts)</option>
                    <option value="Utility">Utility (Reminders / Invoices / Follow-up)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1 uppercase font-bold">
                    CAMPAIGN CATEGORY / PURPOSE *
                  </label>
                  <select
                    required
                    value={campaignForm.subType}
                    onChange={(e) => setCampaignForm({ ...campaignForm, subType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {CAMPAIGN_SUBTYPES[campaignForm.campaignType].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Customer Selection & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[10px] font-mono text-amber-400 tracking-wider block mb-1 uppercase font-bold">
                    CUSTOMER SELECTION (CUSTOMER TYPE FILTER) *
                  </label>
                  <select
                    required
                    value={campaignForm.customerType}
                    onChange={(e) => setCampaignForm({ ...campaignForm, customerType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {CUSTOMER_TYPES.map(ct => (
                      <option key={ct} value={ct}>▼ {ct} Customers</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-amber-400/90 font-mono mt-1.5 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Only <strong>{campaignForm.customerType}</strong> customers will receive this campaign.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1 uppercase font-bold">
                    BRANCH LOCATION FILTER
                  </label>
                  <select
                    value={campaignForm.branchName}
                    onChange={(e) => setCampaignForm({ ...campaignForm, branchName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="ALL">All Operational Branches</option>
                    <option value="Chennai HO">Chennai HO</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Trichy">Trichy</option>
                  </select>
                  <p className="text-[10px] text-slate-400 font-mono mt-1.5">
                    Matching Target Audience: <strong className="text-amber-400">{targetContactCount} contacts</strong> selected.
                  </p>
                </div>
              </div>

              {/* Row 3: Message Template & Text Body */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block uppercase font-bold">
                    WHATSAPP TEXT TEMPLATE *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Available Placeholders: <code className="text-amber-400">{"{{CustomerName}}"}</code>, <code className="text-amber-400">{"{{Branch}}"}</code>
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={campaignForm.messageBody}
                  onChange={(e) => setCampaignForm({ ...campaignForm, messageBody: e.target.value })}
                  placeholder="Enter message text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Row 4: File Uploaders (Uploaded Poster & Optional PDF) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Poster Box */}
                <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 bg-slate-950 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-amber-400 tracking-wider uppercase font-bold flex items-center gap-1.5">
                      <ImageIcon size={14} />
                      UPLOAD MARKETING POSTER * (JPG, PNG, PDF MAX 10MB)
                    </label>
                    {campaignForm.posterFile && (
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        FILE READY
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    id="poster-upload-input"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />

                  {campaignForm.posterPreviewUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 h-36 flex items-center justify-center">
                      <img src={campaignForm.posterPreviewUrl} alt="Uploaded Poster" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, posterFile: null, posterPreviewUrl: "" }))}
                        className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full text-xs shadow"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="poster-upload-input" className="flex flex-col items-center justify-center py-6 cursor-pointer text-slate-400 hover:text-amber-400 space-y-2">
                      <Upload size={24} className="text-amber-500" />
                      <span className="text-xs font-mono font-bold">Click or Drag Poster File to Upload</span>
                      <span className="text-[9px] text-slate-500 font-mono">Do NOT auto-generate. Upload exact poster image.</span>
                    </label>
                  )}
                </div>

                {/* Upload PDF Box (Optional) */}
                <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 bg-slate-950 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold flex items-center gap-1.5">
                      <Paperclip size={14} />
                      UPLOAD PDF ATTACHMENT (OPTIONAL MAX 10MB)
                    </label>
                    {campaignForm.pdfFileName && (
                      <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">
                        PDF ATTACHED
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    id="pdf-upload-input"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />

                  {campaignForm.pdfFileName ? (
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono text-slate-200">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-amber-500" />
                        <span className="truncate max-w-[180px]">{campaignForm.pdfFileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, pdfFile: null, pdfFileName: "" }))}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="pdf-upload-input" className="flex flex-col items-center justify-center py-6 cursor-pointer text-slate-400 hover:text-amber-400 space-y-2">
                      <FileText size={24} className="text-blue-400" />
                      <span className="text-xs font-mono font-bold">Upload Catalogue or Quote PDF</span>
                      <span className="text-[9px] text-slate-500 font-mono">Format: PDF only (Up to 10 MB)</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 5: WhatsApp Message Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider block">
                  LIVE WHATSAPP MESSAGE PREVIEW
                </span>

                <div className="bg-[#0b141a] p-4 rounded-xl border border-slate-800 max-w-sm mx-auto shadow-2xl font-sans">
                  <div className="bg-[#1f2c34] p-2 rounded-t-lg flex items-center gap-2 border-b border-slate-700/50 mb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[10px] text-slate-950">
                      JCB
                    </div>
                    <span className="text-xs font-bold text-slate-100">JCB 360 Business</span>
                  </div>

                  <div className="bg-[#202c33] p-3 rounded-lg text-xs text-slate-100 space-y-2 relative border border-slate-700/40">
                    {campaignForm.posterPreviewUrl && (
                      <div className="rounded overflow-hidden bg-slate-900 border border-slate-700">
                        <img src={campaignForm.posterPreviewUrl} alt="Poster" className="w-full h-36 object-cover" />
                      </div>
                    )}

                    {campaignForm.pdfFileName && (
                      <div className="flex items-center gap-2 bg-[#111b21] p-2 rounded text-[10px] text-slate-300 font-mono border border-slate-700">
                        <FileText size={14} className="text-rose-400" />
                        <span className="truncate">{campaignForm.pdfFileName}</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap leading-relaxed text-xs">
                      {campaignForm.messageBody.replace("{{CustomerName}}", "Rajesh Sharma").replace("{{Branch}}", "Chennai HO")}
                    </p>

                    <div className="flex justify-end items-center gap-1 text-[9px] text-slate-400 font-mono pt-1">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-blue-400 font-black">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 6: Submit / Schedule Actions */}
              <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaignForm.isScheduled}
                      onChange={(e) => setCampaignForm({ ...campaignForm, isScheduled: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span>Schedule for Later Date</span>
                  </label>

                  {campaignForm.isScheduled && (
                    <input
                      type="date"
                      value={campaignForm.scheduleDate}
                      onChange={(e) => setCampaignForm({ ...campaignForm, scheduleDate: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black font-mono text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Send size={14} />
                    {campaignForm.isScheduled ? "SCHEDULE CAMPAIGN" : "SEND WHATSAPP NOW"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW: CAMPAIGN REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 font-mono uppercase block">Target Selected</span>
              <strong className="text-xl font-black text-slate-100 font-mono block mt-0.5">{totalSent}</strong>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[9px] text-emerald-400 font-mono uppercase block">Sent Success</span>
              <strong className="text-xl font-black text-emerald-400 font-mono block mt-0.5">{totalSent - failedCount}</strong>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[9px] text-emerald-400 font-mono uppercase block font-bold">Delivered</span>
              <strong className="text-xl font-black text-emerald-400 font-mono block mt-0.5">{deliveredCount}</strong>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[9px] text-amber-400 font-mono uppercase block font-bold">Read</span>
              <strong className="text-xl font-black text-amber-400 font-mono block mt-0.5">{readCount}</strong>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[9px] text-rose-400 font-mono uppercase block font-bold">Failed</span>
              <strong className="text-xl font-black text-rose-400 font-mono block mt-0.5">{failedCount}</strong>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[9px] text-blue-400 font-mono uppercase block font-bold">Pending</span>
              <strong className="text-xl font-black text-blue-400 font-mono block mt-0.5">{pendingCount}</strong>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search reports by customer, mobile, campaign..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-2 pl-9 pr-4 text-white font-mono focus:outline-none focus:border-amber-500 w-full"
                />
              </div>

              <select
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-slate-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Delivery Statuses</option>
                <option value="SENT">Sent</option>
                <option value="DELIVERED">Delivered</option>
                <option value="READ">Read</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <FileSpreadsheet size={14} className="text-emerald-400" />
                EXPORT CSV
              </button>
              <button
                onClick={exportPDF}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Printer size={14} className="text-amber-400" />
                EXPORT PDF
              </button>
            </div>
          </div>

          {/* Delivery Reports Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase bg-slate-950/60">
                    <th className="py-3 px-4 font-bold">Recipient Customer</th>
                    <th className="py-3 px-4 font-bold">Customer Type</th>
                    <th className="py-3 px-4 font-bold">Campaign Name</th>
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Delivery Status</th>
                    <th className="py-3 px-4 font-bold">Sent Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-mono">
                  {filteredLogs.map(l => (
                    <tr key={l.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-100 block">{l.customerName}</strong>
                        <span className="text-[10px] text-slate-400">{l.mobileNumber}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[10px] font-bold">
                          {l.customerType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">{l.campaignName}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          l.campaignType === "Promotions" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {l.campaignType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          l.status === "READ" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          l.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          l.status === "FAILED" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {l.status} {l.status === "READ" || l.status === "DELIVERED" ? "✓✓" : ""}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(l.sentAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-500 font-mono text-xs">
                        No delivery logs matched search or status filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT TEMPLATE */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-800">
                <h3 className="text-xs font-black font-mono uppercase tracking-wider text-slate-200">
                  {selectedTemplate ? "Edit Message Template" : "New WhatsApp Message Template"}
                </h3>
                <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!templateForm.name || !templateForm.body) {
                  showToast("Template Name and Body are required.", "WARNING");
                  return;
                }
                setTemplates([...templates, { id: Date.now(), ...templateForm }]);
                setIsTemplateModalOpen(false);
                showToast("New Message Template saved!", "SUCCESS");
              }} className="p-6 space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Template Title *</label>
                  <input
                    type="text"
                    required
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Backhoe monsoon discount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase block">Category *</label>
                    <select
                      value={templateForm.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setTemplateForm({ ...templateForm, category: cat, subType: CAMPAIGN_SUBTYPES[cat][0] });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                    >
                      <option value="Promotions">Promotions</option>
                      <option value="Utility">Utility</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase block">Purpose Sub-Type</label>
                    <select
                      value={templateForm.subType}
                      onChange={(e) => setTemplateForm({ ...templateForm, subType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                    >
                      {CAMPAIGN_SUBTYPES[templateForm.category].map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Template Body Content</label>
                  <textarea
                    required
                    rows={4}
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Hello {{CustomerName}}, Welcome to JCB 360..."
                  />
                </div>

                <div className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 text-slate-950 font-black px-5 py-2 rounded-lg shadow"
                  >
                    Save Template
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
