import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Users, UserPlus, Clock, Calendar, DollarSign, FileSpreadsheet, 
  Printer, Search, Plus, Edit, Trash2, Eye, Settings, Check, 
  CheckSquare, Square, UserCheck, FileText, Sliders, Download, 
  ArrowLeft, AlertCircle, CalendarRange, Calculator, ShieldAlert,
  ChevronLeft, ChevronRight, X, Sparkles, Building
} from "lucide-react";

export default function EmployeesModule({
  getHeaders,
  showToast,
  loadAllData
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  // Tabs: "directory", "attendance", "salary", "slips", "rbac"
  const currentTab = React.useMemo(() => {
    if (activePath.includes("/employees/attendance")) return "attendance";
    if (activePath.includes("/employees/salary-slip")) return "slips";
    if (activePath.includes("/employees/salary")) return "salary";
    if (activePath.includes("/employees/roles")) return "rbac";
    return "directory";
  }, [activePath]);

  // States
  const [employees, setEmployees] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);
  const [salarySlips, setSalarySlips] = React.useState([]);
  const [rolePermissions, setRolePermissions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Search and filters for directory
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  // Form States for Employee Directory
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [formData, setFormData] = React.useState({
    employeeId: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
    dob: "",
    joiningDate: "",
    branchId: 1,
    branchName: "Chennai HO",
    department: "Operations",
    designation: "JCB Operator",
    role: "OPERATOR",
    salary: 20000,
    workingHours: 8,
    shift: "Day",
    status: "ACTIVE",
    username: "",
    password: "",
    loginAllowedFrom: "09:00 AM",
    loginAllowedTo: "06:00 PM",
    loginTimeRestrictionEnabled: false,
    profileImage: ""
  });

  // Attendance states
  const [attendanceDate, setAttendanceDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceGrid, setAttendanceGrid] = React.useState({}); // employeeId -> { status, workingHours, remarks }
  const [selectedEmpForCalendar, setSelectedEmpForCalendar] = React.useState(null);
  const [calendarYear, setCalendarYear] = React.useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = React.useState(new Date().getMonth());

  // Salary Calculator states
  const [salaryMonth, setSalaryMonth] = React.useState(
    new Date().toISOString().substring(0, 7) // YYYY-MM
  );
  const [salaryGrid, setSalaryGrid] = React.useState({}); // employeeId -> financial inputs
  const [viewingSlip, setViewingSlip] = React.useState(null);

  // RBAC active role
  const [activeRbacRole, setActiveRbacRole] = React.useState("MANAGER");
  const [rbacMatrix, setRbacMatrix] = React.useState({});

  const rolesList = ["ADMIN", "MANAGER", "ACCOUNTANT", "MARKETING", "OPERATOR"];
  const deptsList = ["Operations", "Accounts", "Management", "Marketing", "Workshop", "Drivers"];

  const modulesList = [
    { id: "dashboard", name: "Dashboard" },
    { id: "machines", name: "Machine Master" },
    { id: "customers", name: "Customer Master" },
    { id: "operators", name: "Operator Master" },
    { id: "drivers", name: "Driver Master" },
    { id: "booking", name: "Booking Module" },
    { id: "billing", name: "Billing Module" },
    { id: "crm", name: "CRM (Sales)" },
    { id: "accounts", name: "Accounts Ledger" },
    { id: "expenses", name: "Expenses" },
    { id: "maintenance", name: "Maintenance" },
    { id: "reports", name: "Reports Center" },
    { id: "settings", name: "System Settings" },
    { id: "employees", name: "Employees Management" }
  ];

  const permissionsList = [
    { id: "view", name: "View" },
    { id: "create", name: "Create" },
    { id: "edit", name: "Edit" },
    { id: "delete", name: "Delete" },
    { id: "print", name: "Print" },
    { id: "export", name: "Export" }
  ];

  // Fetch all employee and associated data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = getHeaders();
      
      // Fetch Employees (reusing Users endpoint)
      const empRes = await fetch("/api/users", { headers });
      if (empRes.ok) {
        const data = await empRes.json();
        setEmployees(data);
      }

      // Fetch Attendance
      const attRes = await fetch("/api/attendance", { headers });
      if (attRes.ok) {
        const data = await attRes.json();
        setAttendance(data);
      }

      // Fetch Slips
      const slipRes = await fetch("/api/salaries", { headers });
      if (slipRes.ok) {
        const data = await slipRes.json();
        setSalarySlips(data);
      }

      // Fetch Role Permissions
      const rbacRes = await fetch("/api/roles/permissions", { headers });
      if (rbacRes.ok) {
        const data = await rbacRes.json();
        setRolePermissions(data);
        
        // Find permission matrix for current active role
        const activeRp = data.find(r => r.roleName === activeRbacRole);
        if (activeRp && activeRp.permissions) {
          setRbacMatrix(activeRp.permissions);
        } else {
          initializeDefaultRbacMatrix(activeRbacRole);
        }
      } else {
        initializeDefaultRbacMatrix(activeRbacRole);
      }

    } catch (err) {
      console.error("Error fetching employee data", err);
      showToast("Failed to fetch employee records.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [activeRbacRole]);

  // Handle active role permission switch
  const initializeDefaultRbacMatrix = (role) => {
    const matrix = {};
    modulesList.forEach(m => {
      matrix[m.id] = {
        view: role === "ADMIN" || role === "MANAGER" || (role === "ACCOUNTANT" && ["dashboard", "accounts", "billing", "reports", "expenses"].includes(m.id)),
        create: role === "ADMIN" || (role === "MANAGER" && m.id !== "settings") || (role === "ACCOUNTANT" && ["accounts", "billing", "expenses"].includes(m.id)),
        edit: role === "ADMIN" || (role === "MANAGER" && m.id !== "settings") || (role === "ACCOUNTANT" && ["accounts", "billing", "expenses"].includes(m.id)),
        delete: role === "ADMIN",
        print: role === "ADMIN" || ["MANAGER", "ACCOUNTANT"].includes(role),
        export: role === "ADMIN" || ["MANAGER", "ACCOUNTANT"].includes(role)
      };
    });
    setRbacMatrix(matrix);
  };

  // Directory Employee CRUD Submit
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getHeaders();
      const method = selectedEmployee ? "PUT" : "POST";
      const url = selectedEmployee ? `/api/users/${selectedEmployee.id}` : "/api/users";
      
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary) || 0,
        workingHours: parseInt(formData.workingHours, 10) || 8
      };

      const res = await fetch(url, {
        method,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(
          selectedEmployee 
            ? "Employee details updated successfully!" 
            : "New employee profile registered!", 
          "SUCCESS"
        );
        setIsFormOpen(false);
        setSelectedEmployee(null);
        fetchData();
        if (loadAllData) loadAllData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to process employee record.", "ERROR");
      }
    } catch (err) {
      console.error(err);
      showToast("Server communication error.", "ERROR");
    }
  };

  // Open Edit Form
  const handleEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      employeeId: emp.employeeId || `EMP-${String(emp.id).padStart(3, "0")}`,
      name: emp.name || "",
      email: emp.email || "",
      mobile: emp.mobile || "",
      address: emp.address || "",
      dob: emp.dob || "",
      joiningDate: emp.joiningDate || "",
      branchId: emp.branchId || 1,
      branchName: emp.branchName || "Chennai HO",
      department: emp.department || "Operations",
      designation: emp.designation || "JCB Operator",
      role: emp.role || "OPERATOR",
      salary: emp.salary || 20000,
      workingHours: emp.workingHours || 8,
      shift: emp.shift || "Day",
      status: emp.status || "ACTIVE",
      username: emp.username || "",
      password: emp.password || "",
      loginAllowedFrom: emp.loginAllowedFrom || "09:00 AM",
      loginAllowedTo: emp.loginAllowedTo || "06:00 PM",
      loginTimeRestrictionEnabled: emp.loginTimeRestrictionEnabled || false,
      profileImage: emp.profileImage || ""
    });
    setIsFormOpen(true);
  };

  // Delete Employee
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This will revoke their platform credentials.")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        showToast("Employee record removed successfully.", "SUCCESS");
        fetchData();
        if (loadAllData) loadAllData();
      } else {
        showToast("Could not complete removal.", "ERROR");
      }
    } catch (err) {
      showToast("Error processing deletion.", "ERROR");
    }
  };

  // Filtered employees list
  const filteredEmployees = React.useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.employeeId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.username?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;
      const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, deptFilter, statusFilter]);

  // Load attendance grid for selected date
  React.useEffect(() => {
    if (employees.length === 0) return;
    const grid = {};
    employees.forEach(emp => {
      const existing = attendance.find(a => a.employeeId === emp.id && a.date === attendanceDate);
      grid[emp.id] = {
        status: existing?.status || "PRESENT",
        workingHours: existing?.workingHours !== undefined ? existing.workingHours : emp.workingHours || 8,
        remarks: existing?.remarks || ""
      };
    });
    setAttendanceGrid(grid);
  }, [attendanceDate, employees, attendance]);

  // Submit Daily Attendance
  const handleSaveAttendance = async () => {
    try {
      const payload = Object.keys(attendanceGrid).map(empId => ({
        employeeId: parseInt(empId, 10),
        date: attendanceDate,
        status: attendanceGrid[empId].status,
        workingHours: parseFloat(attendanceGrid[empId].workingHours) || 0,
        remarks: attendanceGrid[empId].remarks
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { ...getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast("Daily attendance logged successfully!", "SUCCESS");
        fetchData();
      } else {
        showToast("Failed to save attendance logs.", "ERROR");
      }
    } catch (err) {
      showToast("Network error submitting attendance.", "ERROR");
    }
  };

  // Helper to count monthly attendance metrics
  const getEmployeeMonthlyMetrics = (empId, monthStr) => {
    const monthlyRecords = attendance.filter(a => a.employeeId === empId && a.date.startsWith(monthStr));
    let present = 0;
    let late = 0;
    let leaves = 0;
    let absent = 0;
    let halfDay = 0;
    let workedHours = 0;

    monthlyRecords.forEach(r => {
      workedHours += r.workingHours || 0;
      if (r.status === "PRESENT") present++;
      else if (r.status === "LATE_ENTRY") {
        present++;
        late++;
      } else if (r.status === "HALF_DAY") {
        halfDay++;
      } else if (r.status === "LEAVE") {
        leaves++;
      } else if (r.status === "ABSENT") {
        absent++;
      }
    });

    const totalWorkingDays = present + (halfDay * 0.5);
    return {
      recordsCount: monthlyRecords.length,
      present,
      late,
      leaves,
      absent,
      halfDay,
      workedHours,
      totalWorkingDays
    };
  };

  // Populate Salary grid for calculator tab
  React.useEffect(() => {
    if (employees.length === 0) return;
    const grid = {};
    employees.forEach(emp => {
      const metrics = getEmployeeMonthlyMetrics(emp.id, salaryMonth);
      const daysInMonth = new Date(
        parseInt(salaryMonth.split("-")[0], 10),
        parseInt(salaryMonth.split("-")[1], 10),
        0
      ).getDate();

      const empSalary = parseFloat(emp.salary) || 0;
      // Pro-rata basic calculation: (BaseSalary / DaysInMonth) * WorkedDays
      const calculatedBasic = Math.round((empSalary / (daysInMonth || 30)) * (metrics.totalWorkingDays || daysInMonth));

      // Check if a slip is already generated for this month
      const existingSlip = salarySlips.find(s => s.employeeId === emp.id && s.month === salaryMonth);

      grid[emp.id] = {
        baseSalary: empSalary,
        workingDays: metrics.totalWorkingDays || daysInMonth,
        basicSalary: existingSlip ? parseFloat(existingSlip.basicSalary) || 0 : calculatedBasic,
        allowance: existingSlip ? parseFloat(existingSlip.allowance) || 0 : 0,
        overtime: existingSlip ? parseFloat(existingSlip.overtime) || 0 : 0,
        incentive: existingSlip ? parseFloat(existingSlip.incentive) || 0 : 0,
        bonus: existingSlip ? parseFloat(existingSlip.bonus) || 0 : 0,
        deduction: existingSlip ? parseFloat(existingSlip.deduction) || 0 : 0,
        advance: existingSlip ? parseFloat(existingSlip.advance) || 0 : 0,
        pf: existingSlip ? parseFloat(existingSlip.pf) || 0 : Math.round(calculatedBasic * 0.12), // default 12% PF
        esi: existingSlip ? parseFloat(existingSlip.esi) || 0 : Math.round(calculatedBasic * 0.0075), // default 0.75% ESI
        isGenerated: !!existingSlip,
        slipId: existingSlip?.id || null
      };
    });
    setSalaryGrid(grid);
  }, [salaryMonth, employees, attendance, salarySlips]);

  // Save/Generate Salary Slip
  const handleGenerateSalarySlip = async (empId) => {
    const calc = salaryGrid[empId];
    if (!calc) return;

    const netSalary = 
      (calc.basicSalary + calc.allowance + calc.overtime + calc.incentive + calc.bonus) - 
      (calc.deduction + calc.advance + calc.pf + calc.esi);

    const emp = employees.find(e => e.id === parseInt(empId, 10));

    const payload = {
      employeeId: parseInt(empId, 10),
      employeeName: emp?.name,
      employeeCode: emp?.employeeId || `EMP-${empId}`,
      designation: emp?.designation,
      month: salaryMonth,
      baseSalary: calc.baseSalary,
      workingDays: calc.workingDays,
      basicSalary: calc.basicSalary,
      allowance: calc.allowance,
      overtime: calc.overtime,
      incentive: calc.incentive,
      bonus: calc.bonus,
      deduction: calc.deduction,
      advance: calc.advance,
      pf: calc.pf,
      esi: calc.esi,
      netSalary
    };

    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { ...getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Salary slip generated for ${payload.employeeName}!`, "SUCCESS");
        fetchData();
      } else {
        showToast("Failed to compile payroll.", "ERROR");
      }
    } catch (err) {
      showToast("Error establishing network dispatch.", "ERROR");
    }
  };

  // Delete Salary Slip
  const handleDeleteSlip = async (id) => {
    if (!window.confirm("Delete this generated salary slip? This will remove it from historic reports.")) return;
    try {
      const res = await fetch(`/api/salaries/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        showToast("Salary slip removed.", "SUCCESS");
        fetchData();
      } else {
        showToast("Error removing record.", "ERROR");
      }
    } catch (err) {
      showToast("Could not communicate with backend.", "ERROR");
    }
  };

  // Save Role Permissions
  const handleSaveRbac = async () => {
    try {
      const res = await fetch("/api/roles/permissions", {
        method: "POST",
        headers: { ...getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          roleName: activeRbacRole,
          permissions: rbacMatrix
        })
      });

      if (res.ok) {
        showToast(`Access permissions updated for role ${activeRbacRole}!`, "SUCCESS");
        fetchData();
      } else {
        showToast("Failed to write permission configurations.", "ERROR");
      }
    } catch (err) {
      showToast("Error updating role database.", "ERROR");
    }
  };

  // Convert numbers to words (for printable slip)
  const numberToWords = (num) => {
    if (num === 0) return "Zero Only";
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    const g = ["", "Thousand", "Million", "Billion"];
    
    const countWords = (n) => {
      let word = "";
      if (n < 20) {
        word = a[n];
      } else if (n < 100) {
        word = b[Math.floor(n / 10)] + " " + a[n % 10];
      } else {
        word = a[Math.floor(n / 100)] + " Hundred and " + countWords(n % 100);
      }
      return word.trim();
    };

    let word = "";
    let temp = Math.floor(num);
    let i = 0;
    while (temp > 0) {
      if (temp % 1000 !== 0) {
        word = countWords(temp % 1000) + " " + g[i] + " " + word;
      }
      temp = Math.floor(temp / 1000);
      i++;
    }
    return word.trim() + " Rupees Only";
  };

  // Trigger Local Browser Printing
  const triggerPrint = (id) => {
    const printContent = document.getElementById(id);
    const windowUrl = "about:blank";
    const uniqueName = new Date().getTime();
    const printWindow = window.open(windowUrl, uniqueName, "left=50,top=50,width=800,height=900,toolbar=0,scrollbars=1,status=0");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>JCB 360 - Salary Slip</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { font-family: sans-serif; background-color: white; color: black; }
            @media print {
              .no-print { display: none; }
              body { padding: 20px; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="p-6 max-w-3xl mx-auto border border-gray-300 rounded">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <Users size={22} />
          </div>
          <div>
            <h2 className="text-xl font-sans font-bold text-slate-100 tracking-tight">Employees & HR System</h2>
            <p className="text-xs text-slate-400">Manage payroll, track daily attendance, configure system credentials & RBAC permissions matrix.</p>
          </div>
        </div>
      </div>

      {/* Loading overlay indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/60 animate-pulse text-amber-500 gap-2 font-mono text-xs">
          <Clock className="animate-spin" size={16} /> LOAD SYNC ACTIVE...
        </div>
      )}

      {/* TAB 1: EMPLOYEE DIRECTORY */}
      {currentTab === "directory" && !isLoading && (
        <div className="space-y-6">
          {/* Quick metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">TOTAL EMPLOYEES</span>
                <h4 className="text-xl font-bold font-mono text-slate-100">{employees.length}</h4>
              </div>
              <Users className="text-blue-400 shrink-0" size={20} />
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">ACTIVE PROFILES</span>
                <h4 className="text-xl font-bold font-mono text-slate-100">
                  {employees.filter(e => e.status === "ACTIVE").length}
                </h4>
              </div>
              <UserCheck className="text-emerald-400 shrink-0" size={20} />
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">SUSPENDED / LEAVE</span>
                <h4 className="text-xl font-bold font-mono text-slate-100">
                  {employees.filter(e => e.status !== "ACTIVE").length}
                </h4>
              </div>
              <ShieldAlert className="text-rose-400 shrink-0" size={20} />
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">TOTAL PAYROLL VALUE</span>
                <h4 className="text-xl font-bold font-mono text-slate-100">
                  ₹{employees.reduce((acc, curr) => acc + (parseFloat(curr.salary) || 0), 0).toLocaleString()}
                </h4>
              </div>
              <DollarSign className="text-amber-500 shrink-0" size={20} />
            </div>
          </div>

          {/* Search, filters & Add action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800/80">
            <div className="flex flex-1 flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
                <input
                  type="text"
                  placeholder="Search Employee by Name, ID, Designation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-sans"
                />
              </div>
              
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none font-mono"
              >
                <option value="ALL">ALL DEPARTMENTS</option>
                {deptsList.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none font-mono"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedEmployee(null);
                setFormData({
                  employeeId: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
                  name: "",
                  email: "",
                  mobile: "",
                  address: "",
                  dob: "",
                  joiningDate: "",
                  branchId: 1,
                  branchName: "Chennai HO",
                  department: "Operations",
                  designation: "JCB Operator",
                  role: "OPERATOR",
                  salary: 20000,
                  workingHours: 8,
                  shift: "Day",
                  status: "ACTIVE",
                  username: "",
                  password: "",
                  loginAllowedFrom: "09:00 AM",
                  loginAllowedTo: "06:00 PM",
                  loginTimeRestrictionEnabled: false,
                  profileImage: ""
                });
                setIsFormOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shrink-0 transition-all shadow"
            >
              <UserPlus size={15} /> ADD NEW EMPLOYEE
            </button>
          </div>

          {/* Directory Grid */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 tracking-wider">
                  <th className="p-4">EMP ID</th>
                  <th className="p-4">EMPLOYEE PROFILE</th>
                  <th className="p-4">ROLE & CREDENTIALS</th>
                  <th className="p-4">BASE SALARY</th>
                  <th className="p-4">SHIFT & TIMINGS</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-500">
                      {emp.employeeId || `EMP-${String(emp.id).padStart(3, "0")}`}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-500 border border-slate-700 uppercase">
                          {emp.name ? emp.name.substring(0, 2) : "EM"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{emp.name}</p>
                          <p className="text-[10px] text-slate-400">{emp.designation} &bull; {emp.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-slate-200 uppercase">{emp.role}</p>
                      <p className="text-[10px] font-mono text-slate-500">User: {emp.username || "No credentials"}</p>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-200">
                      ₹{(parseFloat(emp.salary) || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <p className="text-slate-200">{emp.shift} Shift &bull; {emp.workingHours} hrs</p>
                      {emp.loginTimeRestrictionEnabled ? (
                        <p className="text-[9px] font-mono text-rose-400">
                          Login window: {emp.loginAllowedFrom} - {emp.loginAllowedTo}
                        </p>
                      ) : (
                        <p className="text-[9px] font-mono text-slate-500">Login anytime</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        emp.status === "ACTIVE" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditEmployee(emp)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
                          title="Edit employee profile"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove employee record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 font-mono">
                      No employee records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORM DIALOG: CREATE/EDIT EMPLOYEE */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-sm font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <UserPlus size={16} className="text-amber-500" /> 
                {selectedEmployee ? "Modify Employee Record" : "Register New Employee Profile"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEmployeeSubmit} className="p-6 space-y-4">
              {/* Row 1: ID, Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">EMPLOYEE UNIQUE ID</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono font-bold text-amber-500"
                    placeholder="e.g. EMP-001"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-sans"
                    placeholder="Enter full legal name"
                  />
                </div>
              </div>

              {/* Row 2: Email, Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-sans"
                    placeholder="employee@domain.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">MOBILE NUMBER</label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Row 3: Branch, Department, Designation, Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-amber-400 tracking-wider block mb-1 uppercase font-bold">ASSIGNED BRANCH *</label>
                  <select
                    required
                    value={formData.branchName || "Chennai HO"}
                    onChange={(e) => {
                      const name = e.target.value;
                      const bMap = { "Chennai HO": 1, "Madurai": 2, "Coimbatore": 3, "Trichy": 4 };
                      setFormData({ ...formData, branchName: name, branchId: bMap[name] || 1 });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono font-bold"
                  >
                    <option value="Chennai HO">▼ Chennai HO</option>
                    <option value="Madurai">▼ Madurai</option>
                    <option value="Coimbatore">▼ Coimbatore</option>
                    <option value="Trichy">▼ Trichy</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">DEPARTMENT</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                  >
                    {deptsList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">DESIGNATION</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-sans"
                    placeholder="e.g. JCB Senior Operator"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">PLATFORM ROLE (RBAC)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                  >
                    {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 4: DOB, Joining Date, Base Salary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">DATE OF BIRTH</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">JOINING DATE</label>
                  <input
                    type="date"
                    required
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">MONTHLY BASE SALARY (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono font-bold text-slate-100"
                    placeholder="25000"
                  />
                </div>
              </div>

              {/* Row 5: Shift, Working Hours, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">WORK SHIFT</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                  >
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                    <option value="Rotational">Rotational</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">WORKING HOURS/DAY</label>
                  <input
                    type="number"
                    required
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">EMPLOYEE STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono font-bold"
                  >
                    <option value="ACTIVE" className="text-emerald-400 font-bold">ACTIVE</option>
                    <option value="INACTIVE" className="text-slate-400">INACTIVE</option>
                    <option value="SUSPENDED" className="text-rose-400">SUSPENDED</option>
                  </select>
                </div>
              </div>

              {/* Address field */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">RESIDENTIAL ADDRESS</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-sans h-16 resize-none"
                  placeholder="Complete postal address..."
                />
              </div>

              {/* Section: Platform Credentials */}
              <div className="border-t border-slate-800 pt-4 mt-2 space-y-4">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
                  PLATFORM SECURE LOGIN CREDENTIALS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">PORTAL USERNAME</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                      placeholder="e.g. operator_suresh"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">SECURE PORTAL PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Login Time Restriction */}
              <div className="border-t border-slate-800 pt-4 mt-2 space-y-3 bg-slate-950/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200">
                      LOGIN TIME RESTRICTIONS CONTROL
                    </h4>
                    <p className="text-[9px] text-slate-500 font-sans">Enforce specified login hours limit. Revoke session access outside standard shift window.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.loginTimeRestrictionEnabled}
                    onChange={(e) => setFormData({ ...formData, loginTimeRestrictionEnabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                    id="checkbox-login-restrict"
                  />
                </div>

                {formData.loginTimeRestrictionEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 animate-fade-in">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">LOGIN ALLOWED FROM</label>
                      <input
                        type="text"
                        required
                        value={formData.loginAllowedFrom}
                        onChange={(e) => setFormData({ ...formData, loginAllowedFrom: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                        placeholder="e.g. 09:00 AM"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 tracking-wider block mb-1">LOGIN ALLOWED TO</label>
                      <input
                        type="text"
                        required
                        value={formData.loginAllowedTo}
                        onChange={(e) => setFormData({ ...formData, loginAllowedTo: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full font-mono"
                        placeholder="e.g. 06:00 PM"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-800 pt-4 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
                >
                  DISCARD CHANGE
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold py-2.5 px-6 rounded-lg transition-all shadow"
                >
                  {selectedEmployee ? "SAVE CHANGES" : "REGISTER EMPLOYEE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE TRACKER */}
      {currentTab === "attendance" && !isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Day Logger Panel */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold font-mono text-xs text-slate-200 uppercase tracking-wider">DAILY CHECK-IN PORTAL</h3>
                  <p className="text-[10px] text-slate-400">Select log date to mark daily shift attendance.</p>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200">
                  <Calendar size={14} className="text-amber-500" />
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="bg-transparent border-none text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="overflow-hidden border border-slate-800/80 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-[9px] font-mono text-slate-400 tracking-wider">
                      <th className="p-3">EMPLOYEE</th>
                      <th className="p-3">STATUS FLAG</th>
                      <th className="p-3">SHIFT WORK HOURS</th>
                      <th className="p-3">REMARKS / EXCEPTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                    {employees.map(emp => {
                      const gridRow = attendanceGrid[emp.id] || { status: "PRESENT", workingHours: 8, remarks: "" };
                      return (
                        <tr key={emp.id} className="hover:bg-slate-950/20">
                          <td className="p-3">
                            <p className="font-semibold text-slate-200">{emp.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {emp.employeeId || `EMP-${emp.id}`} &bull; {emp.designation}</p>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {["PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "LATE_ENTRY"].map(status => {
                                const isCurrent = gridRow.status === status;
                                const statusLabels = {
                                  PRESENT: "P",
                                  ABSENT: "A",
                                  HALF_DAY: "HD",
                                  LEAVE: "LV",
                                  LATE_ENTRY: "LT"
                                };
                                const colorMap = {
                                  PRESENT: isCurrent ? "bg-emerald-500 text-slate-950" : "hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/10",
                                  ABSENT: isCurrent ? "bg-rose-500 text-slate-950" : "hover:bg-rose-500/10 text-rose-400 border border-rose-500/10",
                                  HALF_DAY: isCurrent ? "bg-amber-500 text-slate-950" : "hover:bg-amber-500/10 text-amber-400 border border-amber-500/10",
                                  LEAVE: isCurrent ? "bg-blue-500 text-white" : "hover:bg-blue-500/10 text-blue-400 border border-blue-500/10",
                                  LATE_ENTRY: isCurrent ? "bg-orange-500 text-slate-950" : "hover:bg-orange-500/10 text-orange-400 border border-orange-500/10"
                                };
                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => setAttendanceGrid({
                                      ...attendanceGrid,
                                      [emp.id]: {
                                        ...gridRow,
                                        status,
                                        workingHours: status === "PRESENT" || status === "LATE_ENTRY" ? emp.workingHours || 8 : status === "HALF_DAY" ? (emp.workingHours || 8) / 2 : 0
                                      }
                                    })}
                                    className={`w-8 h-7 text-[10px] font-bold rounded flex items-center justify-center font-mono transition-all ${colorMap[status]}`}
                                    title={status}
                                  >
                                    {statusLabels[status]}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={gridRow.workingHours}
                              onChange={(e) => setAttendanceGrid({
                                ...attendanceGrid,
                                [emp.id]: { ...gridRow, workingHours: parseFloat(e.target.value) || 0 }
                              })}
                              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none w-16 text-center font-mono"
                              placeholder="8"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={gridRow.remarks}
                              onChange={(e) => setAttendanceGrid({
                                ...attendanceGrid,
                                [emp.id]: { ...gridRow, remarks: e.target.value }
                              })}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none w-full font-sans"
                              placeholder="Notes..."
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSaveAttendance}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold py-2.5 px-6 rounded-lg transition-all shadow flex items-center gap-2"
                >
                  <CheckSquare size={14} /> SAVE & LOG ATTENDANCE
                </button>
              </div>
            </div>

            {/* Right: Individual Calendar & Report */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 space-y-4">
                <h3 className="font-bold font-mono text-xs text-slate-200 uppercase tracking-wider">MONTHLY HISTORIC CALENDAR</h3>
                
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">SELECT EMPLOYEE</label>
                  <select
                    value={selectedEmpForCalendar || ""}
                    onChange={(e) => setSelectedEmpForCalendar(e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none w-full font-sans"
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>

                {selectedEmpForCalendar && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Month/Year Scroller */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <button
                        onClick={() => {
                          if (calendarMonth === 0) {
                            setCalendarMonth(11);
                            setCalendarYear(calendarYear - 1);
                          } else {
                            setCalendarMonth(calendarMonth - 1);
                          }
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                        {new Date(calendarYear, calendarMonth).toLocaleString("default", { month: "long" })} {calendarYear}
                      </span>
                      <button
                        onClick={() => {
                          if (calendarMonth === 11) {
                            setCalendarMonth(0);
                            setCalendarYear(calendarYear + 1);
                          } else {
                            setCalendarMonth(calendarMonth + 1);
                          }
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Simple Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-slate-500">
                      <div>SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-6"></div>
                      ))}
                      {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const log = attendance.find(a => a.employeeId === selectedEmpForCalendar && a.date === dateStr);
                        
                        let bgColor = "bg-slate-950 text-slate-600";
                        if (log) {
                          if (log.status === "PRESENT") bgColor = "bg-emerald-500 text-slate-950 font-bold";
                          else if (log.status === "ABSENT") bgColor = "bg-rose-500 text-slate-950 font-bold";
                          else if (log.status === "HALF_DAY") bgColor = "bg-amber-500 text-slate-950 font-bold";
                          else if (log.status === "LEAVE") bgColor = "bg-blue-500 text-white font-bold";
                          else if (log.status === "LATE_ENTRY") bgColor = "bg-orange-500 text-slate-950 font-bold";
                        }
                        
                        return (
                          <div 
                            key={`day-${day}`} 
                            className={`h-6 text-[10px] rounded flex items-center justify-center font-mono transition-all ${bgColor}`}
                            title={log ? `${day}: ${log.status} &bull; ${log.workingHours} hrs` : `${day}: No attendance`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    {(() => {
                      const mStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}`;
                      const met = getEmployeeMonthlyMetrics(selectedEmpForCalendar, mStr);
                      return (
                        <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">WORKING DAYS:</span>
                            <span className="text-slate-100 font-bold">{met.totalWorkingDays} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">LATE ENTRIES:</span>
                            <span className="text-orange-400 font-bold">{met.late}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">LEAVES LOGGED:</span>
                            <span className="text-blue-400 font-bold">{met.leaves}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">HOURS LOGGED:</span>
                            <span className="text-emerald-400 font-bold">{met.workedHours} hrs</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SALARY CALCULATOR */}
      {currentTab === "salary" && !isLoading && (
        <div className="space-y-6">
          {/* Month selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800/80">
            <div>
              <h3 className="font-bold font-mono text-xs text-slate-200 uppercase tracking-wider">PAYROLL SETTLEMENT CALCULATOR</h3>
              <p className="text-[10px] text-slate-400">Review monthly working metrics and calculate earnings & statutory deductions.</p>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200">
              <CalendarRange size={14} className="text-amber-500" />
              <input
                type="month"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                className="bg-transparent border-none text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Salary grid table */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[9px] font-mono text-slate-400 tracking-wider">
                  <th className="p-3">EMPLOYEE</th>
                  <th className="p-3 text-center">DAYS</th>
                  <th className="p-3">PRO-RATA BASIC (₹)</th>
                  <th className="p-3">EARNINGS (₹)</th>
                  <th className="p-3">DEDUCTIONS (₹)</th>
                  <th className="p-3">NET WAGES (₹)</th>
                  <th className="p-3 text-right">PAYROLL ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {employees.map(emp => {
                  const empSalaryParsed = parseFloat(emp.salary) || 0;
                  const sRow = salaryGrid[emp.id] || {
                    baseSalary: empSalaryParsed,
                    workingDays: 30,
                    basicSalary: empSalaryParsed,
                    allowance: 0,
                    overtime: 0,
                    incentive: 0,
                    bonus: 0,
                    deduction: 0,
                    advance: 0,
                    pf: 0,
                    esi: 0,
                    isGenerated: false
                  };

                  const grossEarnings = (parseFloat(sRow.basicSalary) || 0) + (parseFloat(sRow.allowance) || 0) + (parseFloat(sRow.overtime) || 0) + (parseFloat(sRow.incentive) || 0) + (parseFloat(sRow.bonus) || 0);
                  const totalDeductions = (parseFloat(sRow.deduction) || 0) + (parseFloat(sRow.advance) || 0) + (parseFloat(sRow.pf) || 0) + (parseFloat(sRow.esi) || 0);
                  const netWages = grossEarnings - totalDeductions;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-950/20">
                      <td className="p-3">
                        <p className="font-semibold text-slate-200">{emp.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Base: ₹{empSalaryParsed.toLocaleString()}/mo</p>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-amber-500">
                        {sRow.workingDays}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={sRow.basicSalary}
                          onChange={(e) => setSalaryGrid({
                            ...salaryGrid,
                            [emp.id]: { ...sRow, basicSalary: parseFloat(e.target.value) || 0 }
                          })}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none w-24 text-center font-mono"
                        />
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 w-16">ALLOW:</span>
                          <input
                            type="number"
                            value={sRow.allowance}
                            onChange={(e) => setSalaryGrid({
                              ...salaryGrid,
                              [emp.id]: { ...sRow, allowance: parseFloat(e.target.value) || 0 }
                            })}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none w-16 text-center font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 w-16">OVERTIME:</span>
                          <input
                            type="number"
                            value={sRow.overtime}
                            onChange={(e) => setSalaryGrid({
                              ...salaryGrid,
                              [emp.id]: { ...sRow, overtime: parseFloat(e.target.value) || 0 }
                            })}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none w-16 text-center font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 w-16">BONUS:</span>
                          <input
                            type="number"
                            value={sRow.bonus}
                            onChange={(e) => setSalaryGrid({
                              ...salaryGrid,
                              [emp.id]: { ...sRow, bonus: parseFloat(e.target.value) || 0 }
                            })}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none w-16 text-center font-mono"
                          />
                        </div>
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 w-12">ADVANCE:</span>
                          <input
                            type="number"
                            value={sRow.advance}
                            onChange={(e) => setSalaryGrid({
                              ...salaryGrid,
                              [emp.id]: { ...sRow, advance: parseFloat(e.target.value) || 0 }
                            })}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none w-16 text-center font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 w-12">PF (12%):</span>
                          <input
                            type="number"
                            value={sRow.pf}
                            onChange={(e) => setSalaryGrid({
                              ...salaryGrid,
                              [emp.id]: { ...sRow, pf: parseFloat(e.target.value) || 0 }
                            })}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none w-16 text-center font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 w-12">ESI (.75):</span>
                          <input
                            type="number"
                            value={sRow.esi}
                            onChange={(e) => setSalaryGrid({
                              ...salaryGrid,
                              [emp.id]: { ...sRow, esi: parseFloat(e.target.value) || 0 }
                            })}
                            className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none w-16 text-center font-mono"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-mono text-amber-400 font-bold text-sm">₹{netWages.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-500">Gross: ₹{grossEarnings.toLocaleString()}</p>
                      </td>
                      <td className="p-3 text-right">
                        {sRow.isGenerated ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                              GENERATED
                            </span>
                            <button
                              onClick={() => {
                                const slip = salarySlips.find(s => s.employeeId === emp.id && s.month === salaryMonth);
                                if (slip) setViewingSlip(slip);
                              }}
                              className="text-[10px] text-amber-500 hover:underline font-mono font-bold"
                            >
                              PRINT / VIEW SLIP
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGenerateSalarySlip(emp.id)}
                            className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-slate-200 font-mono text-[10px] font-bold px-3 py-1.5 rounded transition-all shadow"
                          >
                            GENERATE SLIP
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SALARY SLIP REGISTRY */}
      {currentTab === "slips" && !isLoading && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <h3 className="font-bold font-mono text-xs text-slate-200 uppercase tracking-wider">SALARY SLIP COMPILATION DATABASE</h3>
              <p className="text-[10px] text-slate-400">View and print archived salary slips for employees.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 tracking-wider">
                  <th className="p-4">SLIP ID</th>
                  <th className="p-4">EMPLOYEE</th>
                  <th className="p-4">SALARY PERIOD</th>
                  <th className="p-4">NET DISBURSED</th>
                  <th className="p-4">GENERATED DATE</th>
                  <th className="p-4 text-right">RECORDS ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {salarySlips.map(slip => (
                  <tr key={slip.id} className="hover:bg-slate-950/20">
                    <td className="p-4 font-mono font-bold text-amber-500">
                      SLIP-{String(slip.id).padStart(4, "0")}
                    </td>
                    <td className="p-4 font-sans font-semibold text-slate-200">
                      {slip.employeeName} ({slip.employeeCode})
                    </td>
                    <td className="p-4 font-mono font-bold">
                      {slip.month}
                    </td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">
                      ₹{slip.netSalary.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {slip.createdAt?.split("T")[0]}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setViewingSlip(slip)}
                          className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded text-slate-300 flex items-center gap-1 text-[10px] font-bold font-mono transition-colors"
                          title="View and print"
                        >
                          <Eye size={13} /> VIEW
                        </button>
                        <button
                          onClick={() => handleDeleteSlip(slip.id)}
                          className="bg-rose-950/40 hover:bg-rose-900/40 p-1.5 rounded text-rose-400 transition-colors"
                          title="Delete Slip"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {salarySlips.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-mono">
                      No payroll records generated yet for the current fiscal periods.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ROLES & PERMISSIONS (RBAC) */}
      {currentTab === "rbac" && !isLoading && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800/80">
            <div>
              <h3 className="font-bold font-mono text-xs text-slate-200 uppercase tracking-wider">ROLE ACCESS CONTROL INTERFACE (RBAC)</h3>
              <p className="text-[10px] text-slate-400">Configure access policies for various user roles. Changes will override client navigation panels in real-time.</p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <label className="text-[10px] font-mono text-slate-400 tracking-wider">SELECT TARGET ROLE:</label>
              <select
                value={activeRbacRole}
                onChange={(e) => setActiveRbacRole(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono font-bold"
              >
                {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 tracking-wider">
                  <th className="p-4">APPLICATION SECTION</th>
                  {permissionsList.map(p => (
                    <th key={p.id} className="p-4 text-center">{p.name.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-mono">
                {modulesList.map(mod => {
                  const permissions = rbacMatrix[mod.id] || { view: false, create: false, edit: false, delete: false, print: false, export: false };
                  return (
                    <tr key={mod.id} className="hover:bg-slate-950/20">
                      <td className="p-4 font-bold text-slate-200 font-sans">
                        {mod.name}
                      </td>
                      {permissionsList.map(perm => {
                        const isChecked = !!permissions[perm.id];
                        return (
                          <td key={perm.id} className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (activeRbacRole === "ADMIN") {
                                  showToast("Administrator role inherits global permissions; configuration is locked.", "INFO");
                                  return;
                                }
                                setRbacMatrix({
                                  ...rbacMatrix,
                                  [mod.id]: {
                                    ...permissions,
                                    [perm.id]: !isChecked
                                  }
                                });
                              }}
                              className={`mx-auto w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                isChecked 
                                  ? "bg-amber-500 border-amber-600 text-slate-950 font-bold" 
                                  : "bg-slate-950 border-slate-800 text-transparent"
                              }`}
                              disabled={activeRbacRole === "ADMIN"}
                            >
                              <Check size={12} strokeWidth={3} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleSaveRbac}
              disabled={activeRbacRole === "ADMIN"}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-mono text-xs font-bold py-2.5 px-6 rounded-lg transition-all shadow flex items-center gap-2"
            >
              <Sliders size={14} /> SAVE ROLE PERMISSIONS
            </button>
          </div>
        </div>
      )}

      {/* MODAL: printable SALARY SLIP VIEW */}
      {viewingSlip && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl shadow-2xl p-6 space-y-6 flex flex-col max-h-[95vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 no-print">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">PAYROLL REPORT GENERATOR</span>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerPrint("salary-slip-print-box")}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                >
                  <Printer size={14} /> PRINT SALARY SLIP
                </button>
                <button
                  onClick={() => setViewingSlip(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded font-mono text-xs font-bold"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>

            {/* Print Content Wrapper */}
            <div id="salary-slip-print-box" className="bg-white text-black p-8 font-sans border border-gray-200 shadow-sm leading-relaxed rounded">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-gray-800 pb-5 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-black text-amber-400 font-extrabold flex items-center justify-center text-lg rounded-lg">JCB</div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight uppercase">JCB 360 ERP BILLING</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Infra Projects & Logistic Solutions</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800">PAYSLIP REPORT</h3>
                  <p className="text-xs font-mono text-gray-500">PERIOD: {viewingSlip.month}</p>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 border-b border-gray-200 pb-4 mb-5 text-xs text-gray-700">
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold uppercase text-gray-500">Employee ID:</span>
                  <span className="font-mono font-bold text-black">{viewingSlip.employeeCode}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold uppercase text-gray-500">Working Days:</span>
                  <span className="font-mono text-black font-bold">{viewingSlip.workingDays} Days</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold uppercase text-gray-500">Full Name:</span>
                  <span className="text-black font-bold">{viewingSlip.employeeName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold uppercase text-gray-500">Base Salary:</span>
                  <span className="font-mono text-black font-bold">₹{Number(viewingSlip.baseSalary || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold uppercase text-gray-500">Designation:</span>
                  <span className="text-black font-bold">{viewingSlip.designation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-semibold uppercase text-gray-500">Generation Date:</span>
                  <span className="font-mono text-black">{viewingSlip.createdAt?.split("T")[0]}</span>
                </div>
              </div>

              {/* Wage Breakup Columns */}
              <div className="grid grid-cols-2 gap-6 text-xs mb-6">
                {/* Earnings */}
                <div className="border border-gray-200 rounded">
                  <div className="bg-gray-100 p-2.5 font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200">
                    Gross Earnings
                  </div>
                  <div className="p-3 space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span>Pro-rata Basic:</span>
                      <span>₹{Number(viewingSlip.basicSalary || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowance:</span>
                      <span>₹{Number(viewingSlip.allowance || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Pay:</span>
                      <span>₹{Number(viewingSlip.overtime || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Bonus:</span>
                      <span>₹{Number(viewingSlip.bonus || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incentive:</span>
                      <span>₹{Number(viewingSlip.incentive || 0).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-black font-sans">
                      <span>Gross Total Earnings:</span>
                      <span className="font-mono">₹{(Number(viewingSlip.basicSalary || 0) + Number(viewingSlip.allowance || 0) + Number(viewingSlip.overtime || 0) + Number(viewingSlip.bonus || 0) + Number(viewingSlip.incentive || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-gray-200 rounded">
                  <div className="bg-gray-100 p-2.5 font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200">
                    Statutory Deductions
                  </div>
                  <div className="p-3 space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span>Provident Fund (12%):</span>
                      <span>₹{Number(viewingSlip.pf || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employee State Ins. (.75%):</span>
                      <span>₹{Number(viewingSlip.esi || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salary Advance Taken:</span>
                      <span>₹{Number(viewingSlip.advance || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Deductions:</span>
                      <span>₹{Number(viewingSlip.deduction || 0).toLocaleString()}</span>
                    </div>
                    <div className="h-4"></div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-black font-sans">
                      <span>Total Deductions:</span>
                      <span className="font-mono">₹{(Number(viewingSlip.pf || 0) + Number(viewingSlip.esi || 0) + Number(viewingSlip.advance || 0) + Number(viewingSlip.deduction || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">NET Wages Disbursed</span>
                <h4 className="text-2xl font-black font-mono">₹{Number(viewingSlip.netSalary || 0).toLocaleString()}</h4>
                <p className="text-[10px] font-semibold text-gray-700 italic">
                  In Words: {numberToWords(Number(viewingSlip.netSalary || 0))}
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-12 text-xs">
                <div>
                  <div className="border-b border-gray-300 h-10 w-44"></div>
                  <p className="text-gray-500 font-bold mt-1.5 uppercase">Employee Signature</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="border-b border-gray-300 h-10 w-44"></div>
                  <p className="text-gray-500 font-bold mt-1.5 uppercase">Authorized Signatory</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
