import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users, Plus, Edit, Trash2, Search, Filter, Calendar, Clock, Phone, Send,
  CheckCircle, AlertTriangle, FileText, Download, Printer, User, DollarSign,
  TrendingUp, BarChart2, Check, ArrowRight, Eye, RefreshCw, X, MessageSquare,
  Briefcase, Mail, Info, Award, Target, HelpCircle, Shield, Share2
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

export default function CRMModule({
  currentUser,
  machines = [],
  bookings = [],
  invoices = [],
  customers = [],
  token,
  getHeaders,
  onNavigate,
  showToast,
  loadAllData
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("dashboard"); // dashboard, leads, followups, quotations, executive, reports
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sourceFilter, setSourceFilter] = React.useState("ALL");
  const [priorityFilter, setPriorityFilter] = React.useState("ALL");
  const [executiveFilter, setExecutiveFilter] = React.useState("ALL");

  // Lead Modal / Detail state
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Follow-up modal state
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = React.useState(false);
  const [followUpForm, setFollowUpForm] = React.useState({
    followUpDate: new Date().toISOString().split("T")[0],
    followUpTime: "10:00",
    followUpType: "Phone Call",
    discussionNotes: "",
    nextFollowUpDate: "",
    nextFollowUpTime: "",
    customerResponse: "Neutral",
    status: "COMPLETED"
  });

  // Quotation form modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);
  const [selectedQuoteForPrint, setSelectedQuoteForPrint] = React.useState(null);
  const [quoteForm, setQuoteForm] = React.useState({
    date: new Date().toISOString().split("T")[0],
    taxRate: 18,
    items: [
      { machineName: "JCB 3DX Super", rate: 1200, duration: "8 Hours", total: 1200 }
    ],
    terms: "Payment terms: 50% advance, 50% upon work completion.",
    status: "SENT"
  });

  // Report Date Filter State
  const [reportType, setReportType] = React.useState("leads"); // leads, followups, conversions, executives, sources, quotations, lost, performance
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // New Lead Form State
  const [leadForm, setLeadForm] = React.useState({
    customerName: "",
    companyName: "",
    mobileNumber: "",
    whatsAppNumber: "",
    email: "",
    address: "",
    district: "",
    businessType: "Contractor",
    interestedMachine: "",
    rentalRequirement: "Hourly",
    leadSource: "Website",
    marketingExecutive: currentUser?.name || currentUser?.username || "Admin",
    priority: "MEDIUM",
    expectedBookingDate: "",
    remarks: "",
    status: "NEW"
  });

  // Load Leads from server
  const fetchLeads = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch("/api/crm/leads", {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        showToast("Failed to fetch CRM leads.", "ERROR");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      showToast("Network error fetching CRM leads.", "ERROR");
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders, showToast]);

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle Tab sync with router
  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/crm/dashboard") setActiveTab("dashboard");
    else if (path === "/crm/leads") setActiveTab("leads");
    else if (path === "/crm/followups") setActiveTab("followups");
    else if (path === "/crm/quotations") setActiveTab("quotations");
    else if (path === "/crm/executive") setActiveTab("executive");
    else if (path === "/crm/reports") setActiveTab("reports");
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/crm/${tab}`);
  };

  // Lead sources options
  const LEAD_SOURCES = [
    "Website", "Walk-in", "Phone Call", "WhatsApp", "Facebook",
    "Instagram", "Google Ads", "Referral", "Existing Customer", "Other"
  ];

  // Lead status options
  const LEAD_STATUSES = [
    "NEW", "CONTACTED", "FOLLOW_UP", "INTERESTED", "QUOTATION_SENT",
    "NEGOTIATION", "CONVERTED", "LOST", "HOLD"
  ];

  // Follow up types
  const FOLLOWUP_TYPES = [
    "Phone Call", "WhatsApp", "SMS", "Office Visit", "Site Visit", "Email", "Video Call"
  ];

  // Priorities
  const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];

  // Handle Create or Edit Lead Submit
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.customerName || !leadForm.mobileNumber) {
      showToast("Please provide Customer Name and Mobile Number.", "WARNING");
      return;
    }

    try {
      const url = selectedLead ? `/api/crm/leads/${selectedLead.id}` : "/api/crm/leads";
      const method = selectedLead ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(leadForm)
      });

      if (response.ok) {
        showToast(
          selectedLead ? "Lead updated successfully." : "New CRM lead created successfully.",
          "SUCCESS"
        );
        setIsLeadModalOpen(false);
        setSelectedLead(null);
        fetchLeads();
      } else {
        showToast("Failed to save lead.", "ERROR");
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      showToast("Network error saving lead.", "ERROR");
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (response.ok) {
        showToast("Lead deleted successfully.", "SUCCESS");
        if (selectedLead?.id === leadId) setIsDetailOpen(false);
        fetchLeads();
      } else {
        showToast("Failed to delete lead.", "ERROR");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      showToast("Network error deleting lead.", "ERROR");
    }
  };

  // Convert Lead to Customer Workflow
  const handleConvertLead = async (lead) => {
    try {
      const response = await fetch(`/api/crm/leads/${lead.id}/convert`, {
        method: "POST",
        headers: getHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        showToast(`Lead converted! Customer created/linked (ID: ${result.customerId}).`, "SUCCESS");
        
        // Refresh leads & root data
        fetchLeads();
        if (loadAllData) loadAllData();

        // Automatically Open Booking Screen with Prefilled State
        navigate("/booking/new", {
          state: {
            prefillCustomerId: result.customerId,
            prefillLocation: lead.address || lead.district || "",
            // Find a machine that matches lead requirement if possible
            prefillMachineId: machines.find(m => m.status === "AVAILABLE")?.id || ""
          }
        });
      } else {
        showToast("Failed to convert lead to customer.", "ERROR");
      }
    } catch (error) {
      console.error("Error converting lead:", error);
      showToast("Network error converting lead.", "ERROR");
    }
  };

  // Add Follow-up Entry
  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    const updatedFollowUps = [...(selectedLead.followUps || []), followUpForm];
    
    // Automatically transition lead status to "FOLLOW_UP" or similar if next follow-up is scheduled
    let updatedStatus = selectedLead.status;
    if (selectedLead.status === "NEW") {
      updatedStatus = "CONTACTED";
    } else if (followUpForm.nextFollowUpDate) {
      updatedStatus = "FOLLOW_UP";
    }

    try {
      const response = await fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          followUps: updatedFollowUps,
          status: updatedStatus
        })
      });

      if (response.ok) {
        showToast("Follow-up entry added successfully.", "SUCCESS");
        setIsFollowUpModalOpen(false);
        // Reset follow-up form
        setFollowUpForm({
          followUpDate: new Date().toISOString().split("T")[0],
          followUpTime: "10:00",
          followUpType: "Phone Call",
          discussionNotes: "",
          nextFollowUpDate: "",
          nextFollowUpTime: "",
          customerResponse: "Neutral",
          status: "COMPLETED"
        });
        
        // Refresh local details and global list
        const updatedLead = await response.json();
        setSelectedLead(updatedLead);
        fetchLeads();
      } else {
        showToast("Failed to add follow-up.", "ERROR");
      }
    } catch (error) {
      console.error("Error adding follow-up:", error);
      showToast("Network error saving follow-up.", "ERROR");
    }
  };

  // Create Quotation Submit
  const handleAddQuotation = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    // Calc total amount
    const subtotal = quoteForm.items.reduce((sum, item) => sum + (Number(item.rate) || 0), 0);
    const grandTotal = subtotal + (subtotal * Number(quoteForm.taxRate) / 100);

    const newQuotation = {
      id: (selectedLead.quotations?.length || 0) + 1,
      date: quoteForm.date,
      items: quoteForm.items,
      taxRate: Number(quoteForm.taxRate),
      totalAmount: grandTotal,
      terms: quoteForm.terms,
      status: quoteForm.status || "SENT"
    };

    const updatedQuotations = [...(selectedLead.quotations || []), newQuotation];

    try {
      const response = await fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          quotations: updatedQuotations,
          status: "QUOTATION_SENT"
        })
      });

      if (response.ok) {
        showToast("Quotation created and tracked successfully.", "SUCCESS");
        setIsQuoteModalOpen(false);
        
        const updatedLead = await response.json();
        setSelectedLead(updatedLead);
        fetchLeads();
      } else {
        showToast("Failed to create quotation.", "ERROR");
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      showToast("Network error saving quotation.", "ERROR");
    }
  };

  // Quotation simulation controls
  const handleQuoteAction = (action, leadName, quoteNum, details) => {
    if (action === "whatsapp") {
      showToast(`Quotation #${quoteNum} successfully dispatched to ${leadName} via WhatsApp!`, "SUCCESS");
    } else if (action === "email") {
      showToast(`Quotation #${quoteNum} successfully dispatched to ${details} via Email!`, "SUCCESS");
    }
  };

  // Open Lead Edit Modal
  const openEditLeadModal = (lead) => {
    setSelectedLead(lead);
    setLeadForm({
      customerName: lead.customerName || "",
      companyName: lead.companyName || "",
      mobileNumber: lead.mobileNumber || "",
      whatsAppNumber: lead.whatsAppNumber || "",
      email: lead.email || "",
      address: lead.address || "",
      district: lead.district || "",
      businessType: lead.businessType || "Contractor",
      interestedMachine: lead.interestedMachine || "",
      rentalRequirement: lead.rentalRequirement || "Hourly",
      leadSource: lead.leadSource || "Website",
      marketingExecutive: lead.marketingExecutive || currentUser?.name || "Admin",
      priority: lead.priority || "MEDIUM",
      expectedBookingDate: lead.expectedBookingDate || "",
      remarks: lead.remarks || "",
      status: lead.status || "NEW"
    });
    setIsLeadModalOpen(true);
  };

  // Open Create Lead Modal
  const openCreateLeadModal = () => {
    setSelectedLead(null);
    setLeadForm({
      customerName: "",
      companyName: "",
      mobileNumber: "",
      whatsAppNumber: "",
      email: "",
      address: "",
      district: "",
      businessType: "Contractor",
      interestedMachine: machines[0]?.plateNumber || "JCB 3DX",
      rentalRequirement: "Hourly",
      leadSource: "Website",
      marketingExecutive: currentUser?.name || currentUser?.username || "Admin",
      priority: "MEDIUM",
      expectedBookingDate: "",
      remarks: "",
      status: "NEW"
    });
    setIsLeadModalOpen(true);
  };

  // Metrics aggregations
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === "NEW").length;
  
  const todayStr = new Date().toISOString().split("T")[0];
  
  // Today's Follow-ups
  const todaysFollowUps = leads.filter(lead => 
    lead.followUps?.some(f => f.nextFollowUpDate === todayStr && f.status !== "COMPLETED")
  );
  
  // Missed Follow-ups (nextFollowUpDate is before today, and not marked completed)
  const missedFollowUps = leads.filter(lead => 
    lead.followUps?.some(f => f.nextFollowUpDate < todayStr && f.status !== "COMPLETED")
  );

  const convertedCount = leads.filter(l => l.status === "CONVERTED").length;
  const lostCount = leads.filter(l => l.status === "LOST").length;
  
  // Pending Quotations (leads with status QUOTATION_SENT or quotations with status SENT)
  const pendingQuotationsCount = leads.filter(l => l.status === "QUOTATION_SENT" || l.quotations?.some(q => q.status === "SENT")).length;

  const todayCallsCount = leads.reduce((sum, lead) => {
    const todayCalls = lead.followUps?.filter(f => f.followUpDate === todayStr && f.followUpType === "Phone Call").length || 0;
    return sum + todayCalls;
  }, 0);

  // Conversion rate
  const conversionRate = totalLeadsCount > 0 ? Math.round((convertedCount / totalLeadsCount) * 100) : 0;

  // Monthly Sales performance from real invoice records
  const monthlySales = invoices.reduce((sum, inv) => sum + parseFloat(inv.grandTotal || 0), 0);

  // Recharts: Lead Source aggregations
  const sourceDataMap = LEAD_SOURCES.map(source => {
    const value = leads.filter(l => l.leadSource === source).length;
    return { name: source, value };
  }).filter(item => item.value > 0);

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#06b6d4", "#a855f7", "#14b8a6", "#64748b"];

  // Recharts: Lead Status aggregations
  const statusData = LEAD_STATUSES.map(status => {
    const count = leads.filter(l => l.status === status).length;
    return { name: status, count };
  }).filter(item => item.count > 0);

  // Recharts: Conversion rate monthly simulation
  const monthlyConversionData = [
    { month: "Jan", Rate: 20 },
    { month: "Feb", Rate: 25 },
    { month: "Mar", Rate: 32 },
    { month: "Apr", Rate: 40 },
    { month: "May", Rate: 45 },
    { month: "Jun", Rate: conversionRate || 38 }
  ];

  // Recharts: Sales Target simulation (Marketing Executives)
  const executivePerformances = Array.from(new Set(leads.map(l => l.marketingExecutive || "Unassigned"))).map(exec => {
    const assignedLeads = leads.filter(l => l.marketingExecutive === exec);
    const converted = assignedLeads.filter(l => l.status === "CONVERTED").length;
    const lost = assignedLeads.filter(l => l.status === "LOST").length;
    return {
      name: exec,
      Leads: assignedLeads.length,
      Converted: converted,
      Lost: lost
    };
  });

  // Recharts: Follow-ups Analysis
  const followUpTypesData = FOLLOWUP_TYPES.map(type => {
    const total = leads.reduce((sum, lead) => {
      const typeMatches = lead.followUps?.filter(f => f.followUpType === type).length || 0;
      return sum + typeMatches;
    }, 0);
    return { name: type, count: total };
  }).filter(item => item.count > 0);


  // Filtered Leads list
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.mobileNumber.includes(searchTerm) ||
      (lead.district && lead.district.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "ALL" || lead.leadSource === sourceFilter;
    const matchesPriority = priorityFilter === "ALL" || lead.priority === priorityFilter;
    const matchesExecutive = executiveFilter === "ALL" || lead.marketingExecutive === executiveFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesPriority && matchesExecutive;
  });

  // Reminders notifications
  const totalReminders = todaysFollowUps.length + overdueReminderLeads().length;

  function overdueReminderLeads() {
    return leads.filter(lead => 
      lead.followUps?.some(f => f.nextFollowUpDate < todayStr && f.status !== "COMPLETED")
    );
  }

  // Exports CSV / Excel mock
  const exportCRMReportToCSV = (type) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === "leads") {
      csvContent += "Lead ID,Customer Name,Company,Mobile,Email,Source,Executive,Status,Created Date\r\n";
      leads.forEach(l => {
        csvContent += `"${l.id}","${l.customerName}","${l.companyName || ''}","${l.mobileNumber}","${l.email || ''}","${l.leadSource}","${l.marketingExecutive}","${l.status}","${l.createdAt || ''}"\r\n`;
      });
    } else if (type === "quotations") {
      csvContent += "Lead Name,Quotation Date,Tax Rate %,Total Amount,Quotation Status\r\n";
      leads.forEach(l => {
        l.quotations?.forEach(q => {
          csvContent += `"${l.customerName}","${q.date}","${q.taxRate}","${q.totalAmount}","${q.status}"\r\n`;
        });
      });
    } else {
      csvContent += "Lead Name,Follow-up Date,Type,Discussion,Next Follow-up Date,Response,Status\r\n";
      leads.forEach(l => {
        l.followUps?.forEach(f => {
          csvContent += `"${l.customerName}","${f.followUpDate}","${f.followUpType}","${f.discussionNotes}","${f.nextFollowUpDate || ''}","${f.customerResponse || ''}","${f.status}"\r\n`;
        });
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JCB360_CRM_${type}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file exported successfully.", "SUCCESS");
  };

  return (
    <div className="space-y-6" id="crm-module">
      {/* Module Title / Header banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono tracking-wider font-semibold uppercase block w-fit">
            CRM: CRM & SALES PIPELINE ENGINE
          </span>
          <h2 className="text-xl font-bold text-white font-sans mt-2 tracking-tight flex items-center gap-2">
            <Users className="text-amber-500" size={22} />
            Marketing & CRM Workspace
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            ACQUIRE CLIENTS, TRACK FOLLOW-UPS, DISPATCH QUOTATIONS, AND PROCESS BOOKING CONVERSIONS
          </p>
        </div>
        
        {/* Action Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openCreateLeadModal}
            className="px-4 py-2.5 text-xs font-mono font-bold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            ADD NEW LEAD
          </button>
        </div>
      </div>

      {/* Global CRM Reminders banner */}
      {totalReminders > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
              <AlertTriangle size={18} className="animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-400 font-sans">
                Attention Required: {totalReminders} Pending Actions Today!
              </h4>
              <p className="text-xs text-slate-300">
                You have {todaysFollowUps.length} follow-ups scheduled for today and {overdueReminderLeads().length} overdue leads needing urgent contact.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleTabChange("followups")}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono rounded-lg transition-all"
          >
            RESOLVE NOW
          </button>
        </div>
      )}

      {/* ----------------- TAB: DASHBOARD ----------------- */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Professional Color-Coded CRM Dashboard KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {[
              {
                label: "New Leads",
                value: newLeadsCount,
                desc: "Awaiting initial outreach",
                bg: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900",
                borderColor: "border-blue-400/30",
                icon: Users,
                textColor: "text-white",
                onClick: () => handleTabChange("leads")
              },
              {
                label: "Today's Follow-up",
                value: todaysFollowUps.length,
                desc: "Outreach scheduled for today",
                bg: "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700",
                borderColor: "border-orange-400/30",
                icon: Clock,
                textColor: "text-white",
                onClick: () => handleTabChange("followups")
              },
              {
                label: "Converted Customers",
                value: convertedCount,
                desc: "Successfully closed rentals",
                bg: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800",
                borderColor: "border-emerald-400/30",
                icon: CheckCircle,
                textColor: "text-white",
                onClick: () => handleTabChange("leads")
              },
              {
                label: "Lost Leads",
                value: lostCount,
                desc: "Archived pipeline deals",
                bg: "bg-gradient-to-br from-rose-600 via-rose-700 to-red-800",
                borderColor: "border-rose-400/30",
                icon: X,
                textColor: "text-white",
                onClick: () => handleTabChange("leads")
              },
              {
                label: "Pending Quotations",
                value: pendingQuotationsCount,
                desc: "Dispatched & awaiting response",
                bg: "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800",
                borderColor: "border-purple-400/30",
                icon: FileText,
                textColor: "text-white",
                onClick: () => handleTabChange("quotations")
              },
              {
                label: "Today's Calls",
                value: todayCallsCount,
                desc: "Phone calls logged today",
                bg: "bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800",
                borderColor: "border-cyan-400/30",
                icon: Phone,
                textColor: "text-white",
                onClick: () => handleTabChange("followups")
              },
              {
                label: "Monthly Revenue",
                value: `₹${monthlySales.toLocaleString('en-IN')}`,
                desc: "Invoiced pipeline total",
                bg: "bg-gradient-to-br from-emerald-700 via-green-800 to-teal-900",
                borderColor: "border-emerald-400/30",
                icon: DollarSign,
                textColor: "text-white",
                onClick: () => handleTabChange("reports")
              },
              {
                label: "Sales Conversion",
                value: `${conversionRate}%`,
                desc: "Lead win ratio",
                bg: "bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-900",
                borderColor: "border-indigo-400/30",
                icon: Target,
                textColor: "text-white",
                onClick: () => handleTabChange("executive")
              },
              {
                label: "Active Machinery",
                value: machines.filter(m => m.status === "RUNNING").length,
                desc: "JCB units currently on job site",
                bg: "bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600",
                borderColor: "border-amber-300/40",
                icon: Briefcase,
                textColor: "text-slate-950",
                onClick: () => navigate("/master/machines")
              }
            ].map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  onClick={card.onClick}
                  className={`${card.bg} border ${card.borderColor} rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group select-none relative overflow-hidden`}
                >
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <IconComp size={100} className={card.textColor} />
                  </div>
                  <div className="flex justify-between items-start gap-2 relative z-10">
                    <span className={`text-xs font-mono font-bold tracking-wider uppercase opacity-90 ${card.textColor}`}>
                      {card.label}
                    </span>
                    <div className={`p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${card.textColor} group-hover:scale-110 transition-transform`}>
                      <IconComp size={18} />
                    </div>
                  </div>
                  <div className="my-3 relative z-10">
                    <h3 className={`text-3xl font-black font-sans tracking-tight ${card.textColor}`}>
                      {card.value}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10">
                    <span className={`text-[11px] font-mono opacity-80 ${card.textColor}`}>
                      {card.desc}
                    </span>
                    <span className={`text-xs font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${card.textColor}`}>
                      View →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead Sources Pie */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">Lead Source Distribution</h3>
              <div className="h-64">
                {sourceDataMap.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceDataMap}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sourceDataMap.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Leads`, 'Count']} contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono">
                    NO LEAD SOURCE DATA FOUND
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[10px] font-mono">
                {sourceDataMap.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Status Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">Pipeline Status Funnel</h3>
              <div className="h-64">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono">
                    NO PIPELINE STATUS DATA FOUND
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono text-center block mt-1">Real-time status conversion analysis</span>
            </div>

            {/* Conversion Performance & Monthly Trend */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">Monthly Conversion Rate (%)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyConversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                    <Line type="monotone" dataKey="Rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-500 font-mono text-center block mt-1">Goal vs actual marketing execution ratio</span>
            </div>
          </div>

          {/* Follow ups & Executive performance charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Executive Leaderboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">Executive Lead Conversion Performance</h3>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full">ACTIVE WORKLOADS</span>
              </div>
              <div className="h-64">
                {executivePerformances.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={executivePerformances}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                      <Legend textAnchor="middle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
                      <Bar dataKey="Leads" fill="#3b82f6" name="Total Assigned" />
                      <Bar dataKey="Converted" fill="#10b981" name="Converted Client" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono">
                    NO EXECUTIVE RECORDS FOUND
                  </div>
                )}
              </div>
            </div>

            {/* Follow-up Analysis Graph */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">Follow-up Analysis by Channel</h3>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full">COMMUNICATION</span>
              </div>
              <div className="h-64">
                {followUpTypesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={followUpTypesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono">
                    NO FOLLOW-UP HISTORY DIALED
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: LEADS PIPELINE ----------------- */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search leads, mobile, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg">
                <Filter size={12} className="text-amber-500" />
                <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none font-mono cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-950">ALL STATUSES</option>
                  {LEAD_STATUSES.map(st => (
                    <option key={st} value={st} className="bg-slate-950">{st}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg">
                <Filter size={12} className="text-amber-500" />
                <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Source:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none font-mono cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-950">ALL SOURCES</option>
                  {LEAD_SOURCES.map(src => (
                    <option key={src} value={src} className="bg-slate-950">{src}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg">
                <Filter size={12} className="text-amber-500" />
                <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none font-mono cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-950">ALL PRIORITIES</option>
                  {PRIORITIES.map(pr => (
                    <option key={pr} value={pr} className="bg-slate-950">{pr}</option>
                  ))}
                </select>
              </div>

              {/* Reset filter button */}
              {(statusFilter !== "ALL" || sourceFilter !== "ALL" || priorityFilter !== "ALL" || searchTerm) && (
                <button
                  onClick={() => {
                    setStatusFilter("ALL");
                    setSourceFilter("ALL");
                    setPriorityFilter("ALL");
                    setSearchTerm("");
                  }}
                  className="px-3 py-2 text-xs font-mono bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg"
                >
                  RESET
                </button>
              )}
            </div>
          </div>

          {/* Pipeline Leads Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                    <th className="py-4 px-4">Lead ID</th>
                    <th className="py-4 px-4">Customer & Company</th>
                    <th className="py-4 px-4">Contact Info</th>
                    <th className="py-4 px-4">Int. Machine</th>
                    <th className="py-4 px-4">Source & Executive</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <RefreshCw className="animate-spin inline mr-2" size={16} />
                        Synchronizing pipeline data...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No matches found in pipeline. Click "Add New Lead" to seed the CRM.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const priorityColor =
                        lead.priority === "HIGH" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        lead.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-slate-500/10 text-slate-400 border-slate-800";

                      const statusColors = {
                        "NEW": "bg-sky-500/10 text-sky-400 border-sky-500/20",
                        "CONTACTED": "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        "FOLLOW_UP": "bg-purple-500/10 text-purple-400 border-purple-500/20",
                        "INTERESTED": "bg-pink-500/10 text-pink-400 border-pink-500/20",
                        "QUOTATION_SENT": "bg-teal-500/10 text-teal-400 border-teal-500/20",
                        "NEGOTIATION": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                        "CONVERTED": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        "LOST": "bg-red-500/10 text-red-400 border-red-500/20",
                        "HOLD": "bg-slate-600/10 text-slate-400 border-slate-700"
                      };

                      return (
                        <tr key={lead.id} className="hover:bg-slate-850/40 transition-all">
                          <td className="py-4 px-4 font-black text-slate-300">#LD-{lead.id}</td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-100">{lead.customerName}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono">{lead.companyName || "N/A"}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-slate-100 font-bold">{lead.mobileNumber}</div>
                            <div className="text-[10px] text-slate-400 font-mono lowercase">{lead.email || "no-email@crm.com"}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-200">{lead.interestedMachine || "General JCB"}</div>
                            <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">{lead.rentalRequirement}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-slate-100 font-bold">{lead.leadSource}</div>
                            <div className="text-[10px] text-slate-400">{lead.marketingExecutive || "Unassigned"}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 text-[9px] border rounded-full font-black ${priorityColor}`}>
                              {lead.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2.5 py-1 text-[10px] border rounded-lg font-black tracking-wide ${statusColors[lead.status] || 'bg-slate-800'}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open detail timeline */}
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsDetailOpen(true);
                                }}
                                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-amber-400 hover:text-amber-300 transition-all"
                                title="View Timeline & Add Follow-up"
                              >
                                <Eye size={14} />
                              </button>

                              {/* Edit details */}
                              <button
                                onClick={() => openEditLeadModal(lead)}
                                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300 hover:text-white transition-all"
                                title="Edit Lead info"
                              >
                                <Edit size={14} />
                              </button>

                              {/* Conversion Trigger */}
                              {lead.status !== "CONVERTED" && (
                                <button
                                  onClick={() => handleConvertLead(lead)}
                                  className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-black text-[10px] flex items-center gap-1 shadow-sm"
                                  title="Convert lead to customer & open Booking"
                                >
                                  <ArrowRight size={10} />
                                  CONVERT
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 bg-slate-950 hover:bg-red-950 border border-slate-800 hover:border-red-800 rounded-md text-slate-500 hover:text-red-400 transition-all"
                                title="Delete Lead"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: REMINDERS & ALERTS ----------------- */}
      {activeTab === "followups" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reminders Left Panel: Overdue list */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-red-400 font-sans flex items-center gap-2">
                <AlertTriangle size={16} />
                Overdue / Missed Follow-ups
              </h3>
              <p className="text-xs text-slate-400">These scheduled calls were missed or need immediate updates.</p>
              
              <div className="space-y-3 overflow-y-auto max-h-96">
                {overdueReminderLeads().length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs font-mono">
                    NO OVERDUE REMINDERS. GOOD JOB!
                  </div>
                ) : (
                  overdueReminderLeads().map(lead => {
                    const latest = lead.followUps?.find(f => f.nextFollowUpDate < todayStr && f.status !== "COMPLETED") || {};
                    return (
                      <div key={lead.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white">{lead.customerName}</span>
                          <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">OVERDUE</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Planned: {latest.nextFollowUpDate} at {latest.nextFollowUpTime || 'N/A'} ({latest.followUpType})
                        </div>
                        <div className="text-xs text-slate-300 line-clamp-1">Notes: {latest.discussionNotes || "No previous notes."}</div>
                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setFollowUpForm({
                                followUpDate: new Date().toISOString().split("T")[0],
                                followUpTime: "10:00",
                                followUpType: latest.followUpType || "Phone Call",
                                discussionNotes: "",
                                nextFollowUpDate: "",
                                nextFollowUpTime: "",
                                customerResponse: "Neutral",
                                status: "COMPLETED"
                              });
                              setIsFollowUpModalOpen(true);
                            }}
                            className="px-2 py-1 bg-red-500 hover:bg-red-400 text-slate-950 font-mono text-[10px] font-black rounded"
                          >
                            CALL & COMPLETE
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Today's schedule panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 lg:col-span-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <Calendar size={16} className="text-amber-500" />
                  Today's Active Follow-up Schedule
                </h3>
                <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full">
                  {todaysFollowUps.length} SCHEDULED FOR TODAY
                </span>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {todaysFollowUps.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 font-mono text-xs">
                    No follow-ups scheduled for today. Explore the pipeline to set up new appointments!
                  </div>
                ) : (
                  todaysFollowUps.map(lead => {
                    const todayF = lead.followUps?.find(f => f.nextFollowUpDate === todayStr && f.status !== "COMPLETED") || {};
                    return (
                      <div key={lead.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-amber-500/40 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-100">{lead.customerName}</span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded uppercase font-mono">{lead.priority} Priority</span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
                            <span className="flex items-center gap-1"><Clock size={12} /> {todayF.nextFollowUpTime || '10:00'}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {todayF.followUpType}</span>
                            <span>Executive: {lead.marketingExecutive}</span>
                          </div>
                          <div className="text-xs text-slate-300 mt-2 font-sans bg-slate-900 p-2.5 rounded border border-slate-850">
                            <strong>Discussion Intent:</strong> {todayF.discussionNotes || "General inquiry outreach."}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {/* Send WhatsApp Quick button */}
                          <button
                            onClick={() => handleQuoteAction("whatsapp", lead.customerName, "Today's Call", lead.mobileNumber)}
                            className="p-2 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 rounded-lg transition-all"
                            title="Quick WhatsApp Outreach"
                          >
                            <Send size={14} />
                          </button>

                          {/* Execute Dial & log result */}
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setFollowUpForm({
                                followUpDate: new Date().toISOString().split("T")[0],
                                followUpTime: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5),
                                followUpType: todayF.followUpType || "Phone Call",
                                discussionNotes: "",
                                nextFollowUpDate: "",
                                nextFollowUpTime: "",
                                customerResponse: "Neutral",
                                status: "COMPLETED"
                              });
                              setIsFollowUpModalOpen(true);
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-xs rounded-lg transition-all"
                          >
                            COMPLETE FOLLOW-UP
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: QUOTATIONS ----------------- */}
      {activeTab === "quotations" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase">Quotation Master Registry</h3>
                <p className="text-xs text-slate-400">Generate and print commercial rental quotations and transition them directly into dispatch jobs.</p>
              </div>
              <button
                onClick={() => {
                  if (leads.length === 0) {
                    showToast("Configure at least one lead in the Pipeline to issue quotations.", "WARNING");
                    return;
                  }
                  // Prefill first lead
                  setSelectedLead(leads[0]);
                  setIsQuoteModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-mono font-bold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} />
                CREATE QUOTATION
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                    <th className="py-4 px-4">Quote Ref</th>
                    <th className="py-4 px-4">Lead Customer</th>
                    <th className="py-4 px-4">Quotation Date</th>
                    <th className="py-4 px-4">Proposed Equipment Details</th>
                    <th className="py-4 px-4 text-right">Tax (GST)</th>
                    <th className="py-4 px-4 text-right">Grand Total</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {leads.filter(l => l.quotations?.length > 0).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No quotations compiled yet. Add quotations from inside lead details or click "Create Quotation".
                      </td>
                    </tr>
                  ) : (
                    leads.flatMap(lead => 
                      (lead.quotations || []).map(q => (
                        <tr key={`${lead.id}-${q.id}`} className="hover:bg-slate-850/40 transition-all">
                          <td className="py-4 px-4 font-black text-amber-500">#QT-{lead.id}-{q.id}</td>
                          <td className="py-4 px-4 font-bold text-slate-100">{lead.customerName}</td>
                          <td className="py-4 px-4 text-slate-300">{q.date}</td>
                          <td className="py-4 px-4 text-slate-200">
                            {q.items?.map(it => `${it.machineName} (${it.duration} @ ₹${it.rate})`).join(", ") || "General Machine Rental"}
                          </td>
                          <td className="py-4 px-4 text-right text-slate-400">{q.taxRate}%</td>
                          <td className="py-4 px-4 text-right font-black text-white">₹{(q.totalAmount || 0).toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2 py-0.5 text-[9px] font-bold border rounded-full uppercase ${
                              q.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              q.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {q.status || "SENT"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View / Print button */}
                              <button
                                onClick={() => setSelectedQuoteForPrint({ lead, q })}
                                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-amber-400 hover:text-amber-300"
                                title="Print / Download Quotation"
                              >
                                <Printer size={12} />
                              </button>

                              {/* WhatsApp Dispatch */}
                              <button
                                onClick={() => handleQuoteAction("whatsapp", lead.customerName, `${lead.id}-${q.id}`, lead.mobileNumber)}
                                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-emerald-400 hover:text-emerald-300"
                                title="Dispatch Quotation on WhatsApp"
                              >
                                <Send size={12} />
                              </button>

                              {/* Convert to Job Booking immediately */}
                              {lead.status !== "CONVERTED" && (
                                <button
                                  onClick={() => handleConvertLead(lead)}
                                  className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] rounded"
                                  title="Accept & Dispatch Job Booking"
                                >
                                  CONVERT TO JOB
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: EXECUTIVE MY DESK ----------------- */}
      {activeTab === "executive" && (
        <div className="space-y-6">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">My Assigned Workloads</span>
                <span className="text-3xl font-black text-white font-sans block mt-1">
                  {leads.filter(l => l.marketingExecutive === currentUser?.name || l.marketingExecutive === currentUser?.username).length}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Assigned leads in queue</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">Monthly Targets</span>
                <span className="text-3xl font-black text-white font-sans block mt-1">12</span>
                <span className="text-[10px] text-slate-500 font-mono">Client bookings goal</span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Target size={24} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">Conversions Logged</span>
                <span className="text-3xl font-black text-emerald-400 font-sans block mt-1">
                  {leads.filter(l => l.marketingExecutive === (currentUser?.name || currentUser?.username) && l.status === "CONVERTED").length}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Completed conversion funnels</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <CheckCircle size={24} />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">Achievement Percentage</span>
                <span className="text-3xl font-black text-amber-500 font-sans block mt-1">
                  {Math.round((leads.filter(l => l.marketingExecutive === (currentUser?.name || currentUser?.username) && l.status === "CONVERTED").length / 12) * 100) || 0}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Target pacing index</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          {/* Executive Filtered Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans uppercase">My Active Leads Workspace</h3>
            <p className="text-xs text-slate-400">List of your personally assigned marketing leads. Complete daily follow-ups below to hit targets.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                    <th className="py-4 px-4">Lead ID</th>
                    <th className="py-4 px-4">Customer Name</th>
                    <th className="py-4 px-4">Mobile</th>
                    <th className="py-4 px-4">Interested JCB</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-4">Next Planned Action</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {leads.filter(l => l.marketingExecutive === (currentUser?.name || currentUser?.username)).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No personal leads assigned to you. Contact administrators to assign incoming enquiries.
                      </td>
                    </tr>
                  ) : (
                    leads.filter(l => l.marketingExecutive === (currentUser?.name || currentUser?.username)).map(lead => {
                      const latestAction = lead.followUps?.[lead.followUps.length - 1] || {};
                      return (
                        <tr key={lead.id} className="hover:bg-slate-850/40 transition-all">
                          <td className="py-4 px-4 font-black">#LD-{lead.id}</td>
                          <td className="py-4 px-4 font-bold text-slate-100">{lead.customerName}</td>
                          <td className="py-4 px-4 text-slate-200">{lead.mobileNumber}</td>
                          <td className="py-4 px-4 font-bold text-amber-400">{lead.interestedMachine || "General JCB"}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 text-[9px] rounded-full border ${
                              lead.priority === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-850'
                            }`}>
                              {lead.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-300">
                            {latestAction.nextFollowUpDate ? `${latestAction.nextFollowUpDate} (${latestAction.followUpType})` : "None scheduled"}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-2 py-0.5 text-[10px] border border-amber-500/20 bg-amber-500/10 text-amber-400 rounded">
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsDetailOpen(true);
                                }}
                                className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-100 font-bold rounded"
                              >
                                VIEW DETAILS & ACTION
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: REPORTS ----------------- */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase">CRM Marketing & Sales Audit Reports</h3>
                <p className="text-xs text-slate-400">Review analytics across lead acquisitions, conversions, quotation records, and marketing executive audits.</p>
              </div>

              {/* PDF & CSV Export row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportCRMReportToCSV(reportType)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-mono font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Download size={14} />
                  EXPORT EXCEL (CSV)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-mono font-black rounded-lg text-xs flex items-center gap-1 hover:bg-amber-400"
                >
                  <Printer size={14} />
                  PRINT PDF REPORT
                </button>
              </div>
            </div>

            {/* Selector and Date range */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none"
                >
                  <option value="leads">Lead Acquisition Report</option>
                  <option value="followups">Communications / Follow-up Audit</option>
                  <option value="conversions">Conversion Efficiency Audit</option>
                  <option value="quotations">Quotation Register Report</option>
                  <option value="lost">Lost Leads Analysis</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs text-white p-2 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs text-white p-2 font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    showToast("Filters cleared.", "INFO");
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg transition-all border border-slate-800"
                >
                  CLEAR DATES
                </button>
              </div>
            </div>

            {/* Generated results area */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 overflow-hidden">
              <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider mb-3">
                Query Results: {reportType.toUpperCase()}
              </h4>
              
              <div className="overflow-x-auto">
                {reportType === "leads" && (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5">Lead Name</th>
                        <th className="py-2.5">Mobile</th>
                        <th className="py-2.5">District</th>
                        <th className="py-2.5">Source</th>
                        <th className="py-2.5">Executive</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Created Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {leads.map(lead => (
                        <tr key={lead.id}>
                          <td className="py-3 font-bold text-white">{lead.customerName}</td>
                          <td className="py-3 text-slate-300">{lead.mobileNumber}</td>
                          <td className="py-3 text-slate-400">{lead.district || "N/A"}</td>
                          <td className="py-3 text-slate-300">{lead.leadSource}</td>
                          <td className="py-3 text-slate-400">{lead.marketingExecutive}</td>
                          <td className="py-3 font-bold text-amber-400">{lead.status}</td>
                          <td className="py-3 text-right text-slate-500">{(lead.createdAt || "").substring(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === "followups" && (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Type</th>
                        <th className="py-2.5">Discussion Notes</th>
                        <th className="py-2.5">Customer Response</th>
                        <th className="py-2.5 text-right">Executive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {leads.flatMap(lead => 
                        (lead.followUps || []).map((f, index) => (
                          <tr key={`${lead.id}-${index}`}>
                            <td className="py-3 font-bold text-white">{lead.customerName}</td>
                            <td className="py-3 text-slate-300">{f.followUpDate}</td>
                            <td className="py-3 text-purple-400">{f.followUpType}</td>
                            <td className="py-3 text-slate-400 truncate max-w-xs" title={f.discussionNotes}>{f.discussionNotes}</td>
                            <td className="py-3 font-bold text-amber-500">{f.customerResponse}</td>
                            <td className="py-3 text-right text-slate-300">{lead.marketingExecutive}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {reportType === "conversions" && (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5">Converted Customer</th>
                        <th className="py-2.5">Company</th>
                        <th className="py-2.5">Original Source</th>
                        <th className="py-2.5">Total Follow-ups dialled</th>
                        <th className="py-2.5">Assigned Executive</th>
                        <th className="py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {leads.filter(l => l.status === "CONVERTED").map(lead => (
                        <tr key={lead.id}>
                          <td className="py-3 font-bold text-white">{lead.customerName}</td>
                          <td className="py-3 text-slate-400">{lead.companyName || "N/A"}</td>
                          <td className="py-3 text-slate-300">{lead.leadSource}</td>
                          <td className="py-3 font-bold text-amber-400">{lead.followUps?.length || 0} Contacts</td>
                          <td className="py-3 text-slate-300">{lead.marketingExecutive}</td>
                          <td className="py-3 text-right text-emerald-400 font-bold uppercase">CONVERTED</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === "quotations" && (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5">Quotation Ref</th>
                        <th className="py-2.5">Customer Name</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Proposed Rates</th>
                        <th className="py-2.5">GST Rate</th>
                        <th className="py-2.5 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {leads.flatMap(lead => 
                        (lead.quotations || []).map(q => (
                          <tr key={`${lead.id}-${q.id}`}>
                            <td className="py-3 font-bold text-amber-500">#QT-{lead.id}-{q.id}</td>
                            <td className="py-3 font-bold text-white">{lead.customerName}</td>
                            <td className="py-3 text-slate-300">{q.date}</td>
                            <td className="py-3 text-slate-400">{q.items?.map(it => it.machineName).join(", ")}</td>
                            <td className="py-3 text-slate-400">{q.taxRate}%</td>
                            <td className="py-3 text-right font-black text-white">₹{(q.totalAmount || 0).toLocaleString('en-IN')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {reportType === "lost" && (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                        <th className="py-2.5">Lead Name</th>
                        <th className="py-2.5">Mobile</th>
                        <th className="py-2.5">Lead Source</th>
                        <th className="py-2.5">Owner / Executive</th>
                        <th className="py-2.5">Closing Remarks</th>
                        <th className="py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {leads.filter(l => l.status === "LOST").map(lead => (
                        <tr key={lead.id}>
                          <td className="py-3 font-bold text-white">{lead.customerName}</td>
                          <td className="py-3 text-slate-300">{lead.mobileNumber}</td>
                          <td className="py-3 text-slate-400">{lead.leadSource}</td>
                          <td className="py-3 text-slate-300">{lead.marketingExecutive}</td>
                          <td className="py-3 text-slate-400 max-w-xs truncate" title={lead.remarks}>{lead.remarks || "No remarks entered."}</td>
                          <td className="py-3 text-right text-red-400 font-bold">LOST / ARCHIVED</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- DIALOGS & MODALS ----------------- */}

      {/* Detail Panel / Timeline Drawer Modal */}
      {isDetailOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex justify-end">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded uppercase font-mono">Lead Timeline Tracker</span>
                  <h3 className="text-base font-bold text-white font-sans mt-1">#LD-{selectedLead.id}: {selectedLead.customerName}</h3>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Bio details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 border border-slate-850 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 block">COMPANY NAME</span>
                  <span className="text-white font-bold">{selectedLead.companyName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">MOBILE NUMBER</span>
                  <span className="text-white font-bold">{selectedLead.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">WHATSAPP</span>
                  <span className="text-emerald-400 font-bold">{selectedLead.whatsAppNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">EMAIL ADDRESS</span>
                  <span className="text-white">{selectedLead.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">INTERESTED MACHINE</span>
                  <span className="text-amber-400 font-bold">{selectedLead.interestedMachine || "General Heavy Machinery"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">RENTAL REQUIREMENT</span>
                  <span className="text-white uppercase font-bold">{selectedLead.rentalRequirement || "Hourly"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] text-slate-500 block">ADDRESS / DISTRICT</span>
                  <span className="text-white">{selectedLead.address || "N/A"}, {selectedLead.district || "N/A"}</span>
                </div>
              </div>

              {/* Actions Section: Log communications, generate quote */}
              <div className="flex gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    setFollowUpForm({
                      followUpDate: new Date().toISOString().split("T")[0],
                      followUpTime: "10:00",
                      followUpType: "Phone Call",
                      discussionNotes: "",
                      nextFollowUpDate: "",
                      nextFollowUpTime: "",
                      customerResponse: "Interested",
                      status: "COMPLETED"
                    });
                    setIsFollowUpModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black font-mono rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  LOG FOLLOW-UP ACTION
                </button>

                <button
                  onClick={() => {
                    setQuoteForm({
                      date: new Date().toISOString().split("T")[0],
                      taxRate: 18,
                      items: [
                        { machineName: selectedLead.interestedMachine || "JCB 3DX Super", rate: 1200, duration: "8 Hours", total: 1200 }
                      ],
                      terms: "Terms: 50% advance, balance on completion. Transport charges extra.",
                      status: "SENT"
                    });
                    setIsQuoteModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-slate-950 border border-slate-850 text-slate-300 hover:text-white text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5"
                >
                  <FileText size={14} />
                  GENERATE COMMERCIAL QUOTATION
                </button>
              </div>

              {/* Follow ups Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Communication Timeline History</h4>
                
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {(!selectedLead.followUps || selectedLead.followUps.length === 0) ? (
                    <div className="text-slate-500 text-xs font-mono pl-6 py-2">
                      No communications logged. Dial their contact to register first follow-up action.
                    </div>
                  ) : (
                    selectedLead.followUps.map((item, i) => (
                      <div key={i} className="relative pl-7 space-y-1">
                        {/* Dot indicator */}
                        <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-4 border-slate-900 shadow"></div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>{item.followUpDate} at {item.followUpTime} ({item.followUpType})</span>
                          <span className="font-bold text-amber-500 uppercase">Response: {item.customerResponse}</span>
                        </div>
                        <div className="bg-slate-950 p-3 border border-slate-850 rounded-lg text-xs text-slate-300">
                          {item.discussionNotes || "General enquiry communication logged."}
                          {item.nextFollowUpDate && (
                            <div className="text-[10px] text-amber-400 font-mono mt-1.5 border-t border-slate-850/40 pt-1">
                              👉 Next planned contact: {item.nextFollowUpDate} at {item.nextFollowUpTime || 'N/A'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quotations List */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Issued Quotations</h4>
                {(!selectedLead.quotations || selectedLead.quotations.length === 0) ? (
                  <div className="text-slate-500 text-xs font-mono pl-1 py-2">
                    No commercial quotes issued.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedLead.quotations.map((q, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">Quote Ref: #QT-{selectedLead.id}-{q.id}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Issued on: {q.date} | Tax: {q.taxRate}%</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-amber-400">₹{(q.totalAmount || 0).toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => setSelectedQuoteForPrint({ lead: selectedLead, q })}
                            className="p-1 bg-slate-900 border border-slate-800 rounded text-amber-400 hover:text-amber-300"
                            title="Print Quotation Document"
                          >
                            <Printer size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 mt-6 flex justify-between">
              <span className="text-[10px] text-slate-500 font-mono">JCB ERP CRM Ledger Engine</span>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Lead Form Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-sans font-bold text-white text-base">
                {selectedLead ? `Edit CRM Lead Details (#LD-${selectedLead.id})` : "Create New CRM Sales Lead"}
              </h3>
              <button
                onClick={() => setIsLeadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Customer / Lead Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.customerName}
                    onChange={(e) => setLeadForm({ ...leadForm, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Company / Business Name</label>
                  <input
                    type="text"
                    value={leadForm.companyName}
                    onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter business firm name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.mobileNumber}
                    onChange={(e) => setLeadForm({ ...leadForm, mobileNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">WhatsApp Messenger Number</label>
                  <input
                    type="tel"
                    value={leadForm.whatsAppNumber}
                    onChange={(e) => setLeadForm({ ...leadForm, whatsAppNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter WhatsApp mobile number"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Email Address</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">District / City</label>
                  <input
                    type="text"
                    value={leadForm.district}
                    onChange={(e) => setLeadForm({ ...leadForm, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter district name"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Full Street Address</label>
                  <input
                    type="text"
                    value={leadForm.address}
                    onChange={(e) => setLeadForm({ ...leadForm, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Enter full billing address details"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Interested Equipment / Machine</label>
                  <select
                    value={leadForm.interestedMachine}
                    onChange={(e) => setLeadForm({ ...leadForm, interestedMachine: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none"
                  >
                    <option value="">Choose Machine</option>
                    <option value="JCB 3DX Eco">JCB 3DX Eco (Backhoe Loader)</option>
                    <option value="JCB 4DX Super">JCB 4DX Super (Heavy Loader)</option>
                    <option value="JCB JS205 Excavator">JCB JS205 (Tracked Excavator)</option>
                    <option value="JCB 220LC">JCB 220LC (Max Excavator)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block">Rental Requirement Schedule</label>
                  <select
                    value={leadForm.rentalRequirement}
                    onChange={(e) => setLeadForm({ ...leadForm, rentalRequirement: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 font-mono focus:outline-none font-sans"
                  >
                    <option value="Hourly">Hourly basis contract</option>
                    <option value="Daily">Daily basis flat-rate</option>
                    <option value="Weekly">Weekly project contract</option>
                    <option value="Monthly">Monthly lease allocation</option>
                  </select>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-400 uppercase block">Marketing Lead Source</label>
                  <select
                    value={leadForm.leadSource}
                    onChange={(e) => setLeadForm({ ...leadForm, leadSource: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                  >
                    {LEAD_SOURCES.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-amber-400 font-mono uppercase block">Customer Type *</label>
                  <select
                    required
                    value={leadForm.customerType || leadForm.businessType || "Contractor"}
                    onChange={(e) => setLeadForm({ ...leadForm, customerType: e.target.value, businessType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                  >
                    <option value="Builder">Builder</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Civil Engineer">Civil Engineer</option>
                    <option value="Operator">Operator</option>
                    <option value="Machine Owner">Machine Owner</option>
                    <option value="Rental Company">Rental Company</option>
                    <option value="Government Contractor">Government Contractor</option>
                    <option value="Road Contractor">Road Contractor</option>
                    <option value="Individual">Individual</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-400 uppercase block">Assign Marketing Executive</label>
                  <input
                    type="text"
                    value={leadForm.marketingExecutive}
                    onChange={(e) => setLeadForm({ ...leadForm, marketingExecutive: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                    placeholder="Executive Name"
                  />
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-400 uppercase block">Priority Level</label>
                  <select
                    value={leadForm.priority}
                    onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                  >
                    {PRIORITIES.map(pr => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-slate-400 uppercase block">Expected Start Date</label>
                  <input
                    type="date"
                    value={leadForm.expectedBookingDate}
                    onChange={(e) => setLeadForm({ ...leadForm, expectedBookingDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 font-mono">
                  <label className="text-[10px] text-slate-400 uppercase block">Remarks / Notes</label>
                  <textarea
                    value={leadForm.remarks}
                    onChange={(e) => setLeadForm({ ...leadForm, remarks: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-amber-500 h-16"
                    placeholder="Provide additional details or lost lead reason"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-mono font-black hover:bg-amber-400"
                >
                  {selectedLead ? "SAVE CHANGES" : "CREATE NEW LEAD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Follow-up Form Modal */}
      {isFollowUpModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-sans font-bold text-white text-base">
                Log Follow-up Call results for {selectedLead.customerName}
              </h3>
              <button
                onClick={() => setIsFollowUpModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFollowUp} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Follow-up Date</label>
                  <input
                    type="date"
                    required
                    value={followUpForm.followUpDate}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, followUpDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Follow-up Time</label>
                  <input
                    type="time"
                    required
                    value={followUpForm.followUpTime}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, followUpTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Follow-up Channel</label>
                  <select
                    value={followUpForm.followUpType}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, followUpType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                  >
                    {FOLLOWUP_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Customer Response Mood</label>
                  <select
                    value={followUpForm.customerResponse}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, customerResponse: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="Interested">Highly Interested</option>
                    <option value="Negotiation">Negotiating Price</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Call Back">Call Back Later</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Outreach Discussion Notes *</label>
                  <textarea
                    required
                    value={followUpForm.discussionNotes}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, discussionNotes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 h-20 text-xs"
                    placeholder="Log what was discussed, price negotiation variables, site requirements..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Set Next Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpForm.nextFollowUpDate}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, nextFollowUpDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Set Next Follow-up Time</label>
                  <input
                    type="time"
                    value={followUpForm.nextFollowUpTime}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, nextFollowUpTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFollowUpModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-mono font-black hover:bg-amber-400"
                >
                  SAVE COMMUNICATION LOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Quotation Form Modal */}
      {isQuoteModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-sans font-bold text-white text-base">
                Create Commercial Rental Quote for {selectedLead.customerName}
              </h3>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddQuotation} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Quotation Issue Date</label>
                  <input
                    type="date"
                    required
                    value={quoteForm.date}
                    onChange={(e) => setQuoteForm({ ...quoteForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Tax Rate (GST %)</label>
                  <input
                    type="number"
                    required
                    value={quoteForm.taxRate}
                    onChange={(e) => setQuoteForm({ ...quoteForm, taxRate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white p-2 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="col-span-2 border border-slate-850 rounded-xl p-3 bg-slate-950 space-y-3">
                  <h4 className="text-[10px] text-slate-400 uppercase">Quotation Item Row</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 block">JCB TYPE</label>
                      <input
                        type="text"
                        value={quoteForm.items[0]?.machineName || ""}
                        onChange={(e) => {
                          const updated = [...quoteForm.items];
                          updated[0].machineName = e.target.value;
                          setQuoteForm({ ...quoteForm, items: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded text-white p-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 block">RENTAL RATE (₹)</label>
                      <input
                        type="number"
                        value={quoteForm.items[0]?.rate || 0}
                        onChange={(e) => {
                          const updated = [...quoteForm.items];
                          updated[0].rate = Number(e.target.value);
                          updated[0].total = Number(e.target.value);
                          setQuoteForm({ ...quoteForm, items: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded text-white p-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 block">DURATION</label>
                      <input
                        type="text"
                        value={quoteForm.items[0]?.duration || ""}
                        onChange={(e) => {
                          const updated = [...quoteForm.items];
                          updated[0].duration = e.target.value;
                          setQuoteForm({ ...quoteForm, items: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded text-white p-1"
                        placeholder="e.g. 8 Hours"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block">Terms & Conditions</label>
                  <textarea
                    value={quoteForm.terms}
                    onChange={(e) => setQuoteForm({ ...quoteForm, terms: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 h-20 text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-mono font-black hover:bg-amber-400"
                >
                  DISPATCH COMMERCIAL QUOTE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable / Download PDF Quotation Layout Modal */}
      {selectedQuoteForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Control Bar (hidden on print) */}
            <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center no-print">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <FileText size={14} />
                COMMERCIAL QUOTATION VIEW
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-lg transition-all flex items-center gap-1"
                >
                  <Printer size={12} />
                  PRINT DOC
                </button>
                <button
                  onClick={() => setSelectedQuoteForPrint(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white font-mono text-xs rounded-lg"
                >
                  CLOSE
                </button>
              </div>
            </div>

            {/* Document Printable Area */}
            <div className="p-8 space-y-6 printable-document bg-white" id="printable-quote">
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-wider">JCB 360 ERP</h1>
                  <p className="text-xs text-slate-500 font-mono">HIGH-PERFORMANCE LOGISTICS & RENTALS</p>
                  <p className="text-xs text-slate-500 font-mono mt-2">National Highway 45, construction corridor, TN</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest font-sans">QUOTATION</h2>
                  <span className="text-xs font-mono bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full font-black mt-2 inline-block">
                    #QT-{selectedQuoteForPrint.lead.id}-{selectedQuoteForPrint.q.id}
                  </span>
                  <div className="text-xs text-slate-500 font-mono mt-2">Date: {selectedQuoteForPrint.q.date}</div>
                </div>
              </div>

              {/* Addresses row */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-slate-500 font-sans tracking-wide uppercase">CLIENT / LEAD ACCOUNT</h4>
                  <p className="font-black text-slate-850 mt-1">{selectedQuoteForPrint.lead.customerName}</p>
                  {selectedQuoteForPrint.lead.companyName && <p className="font-bold text-slate-600 font-mono">{selectedQuoteForPrint.lead.companyName}</p>}
                  <p className="text-slate-500 mt-1">Mobile: {selectedQuoteForPrint.lead.mobileNumber}</p>
                  <p className="text-slate-500">Address: {selectedQuoteForPrint.lead.address || selectedQuoteForPrint.lead.district}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-500 font-sans tracking-wide uppercase">AUTHORIZED SALES REPRESENTATIVE</h4>
                  <p className="font-black text-slate-850 mt-1">{selectedQuoteForPrint.lead.marketingExecutive || "Marketing Executive"}</p>
                  <p className="text-slate-500">Corporate Group Headquarters</p>
                  <p className="text-slate-500 mt-1">Tel: +91 9845 360 360</p>
                  <p className="text-slate-500">Email: sales@jcb360erp.com</p>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                      <th className="py-2">Proposed Equipment Details</th>
                      <th className="py-2 text-right">Duration</th>
                      <th className="py-2 text-right">Unit rate (₹)</th>
                      <th className="py-2 text-right">Net Subtotal (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedQuoteForPrint.q.items || []).map((it, i) => (
                      <tr key={i} className="text-slate-800">
                        <td className="py-3 font-bold">{it.machineName}</td>
                        <td className="py-3 text-right font-mono">{it.duration}</td>
                        <td className="py-3 text-right font-mono">₹{it.rate?.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-right font-mono font-bold">₹{it.total?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals computation */}
              <div className="flex justify-end pt-4 border-t border-slate-200 text-xs">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedQuoteForPrint.q.items?.reduce((s, it) => s + (it.total || 0), 0)?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({selectedQuoteForPrint.q.taxRate || 18}%):</span>
                    <span className="font-mono">₹{(selectedQuoteForPrint.q.items?.reduce((s, it) => s + (it.total || 0), 0) * (selectedQuoteForPrint.q.taxRate || 18) / 100)?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{selectedQuoteForPrint.q.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* T&C Terms and signature block */}
              <div className="space-y-4 pt-6 text-[10px] text-slate-500 leading-relaxed border-t border-slate-100">
                <div>
                  <h5 className="font-bold text-slate-600 uppercase font-sans">Commercial Terms & Conditions:</h5>
                  <p className="mt-1">{selectedQuoteForPrint.q.terms || "Quote valid for 15 days. Mobilization and demobilization charges extra as actuals."}</p>
                </div>
                
                <div className="flex justify-between pt-8 text-[10px] uppercase font-mono">
                  <div>
                    <div className="border-t border-slate-300 w-48 pt-1 text-center">CLIENT ACCEPTANCE SIGN</div>
                  </div>
                  <div className="text-right">
                    <div className="border-t border-slate-300 w-48 pt-1 text-center inline-block">AUTHORIZED SIGNATORY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
