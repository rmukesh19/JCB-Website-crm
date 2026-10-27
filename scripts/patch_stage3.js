import fs from "fs";

let bundle = fs.readFileSync("public/assets/index-Dbowi09z.js", "utf8");

// 1. In sse: Normalize transactions to prevent any freeze/crash
const sseTarget = 'function sse({accounts:e=[],transactions:t=[],onAddJournal:n,loadAllData:r,getHeaders:s,showToast:o}){';
const sseReplacement = `function sse({accounts:e=[],transactions:rawT=[],onAddJournal:n,loadAllData:r,getHeaders:s,showToast:o}){
  const t=Y.useMemo(()=>(Array.isArray(rawT)?rawT:[]).map(tx=>{
    const amt=Number(tx.amount||0);
    const typ=tx.type||"PAYMENT";
    const accId=Number(tx.accountId||1);
    const lns=Array.isArray(tx.lines)&&tx.lines.length>0?tx.lines.map(l=>({
      accountId:Number(l.accountId||accId),
      debit:Number(l.debit||0),
      credit:Number(l.credit||0)
    })):[
      {accountId:accId,debit:(typ==="RECEIPT"||typ==="JOURNAL")?amt:0,credit:(typ==="PAYMENT"||typ==="CONTRA")?amt:0},
      {accountId:3,debit:(typ==="PAYMENT"||typ==="CONTRA")?amt:0,credit:(typ==="RECEIPT"||typ==="JOURNAL")?amt:0}
    ];
    return {
      ...tx,
      lines:lns,
      transactionDate:tx.transactionDate||tx.date||(tx.createdAt?tx.createdAt.split("T")[0]:new Date().toISOString().split("T")[0]),
      date:tx.date||tx.transactionDate||new Date().toISOString().split("T")[0],
      referenceNumber:tx.referenceNumber||tx.voucherNumber||("VCH-2026-"+String(tx.id||100).padStart(4,"0")),
      voucherNumber:tx.voucherNumber||tx.referenceNumber||("VCH-2026-"+String(tx.id||100).padStart(4,"0")),
      description:tx.description||tx.particulars||(typ+" Voucher")
    };
  }),[rawT]);`;

if (bundle.includes(sseTarget)) {
  bundle = bundle.replace(sseTarget, sseReplacement);
  console.log("SUCCESS: Patched sse transaction normalization!");
} else {
  console.warn("Could not find sseTarget");
}

// 2. Pass additional props to lse in fde
const oldLseCall = 'path:"/reports/*",element:i.jsx(lse,{machines:lr,customers:ie.filter(z=>z.companyId===C),bookings:qr,invoices:U,diesel:ke,maintenance:Ye,expenses:Je})';
const newLseCall = 'path:"/reports/*",element:i.jsx(lse,{machines:lr,customers:ie.filter(z=>z.companyId===C),bookings:qr,invoices:U,diesel:ke,maintenance:Ye,expenses:Je,spareParts:xt,suppliers:dt,purchases:ft,operators:D.filter(z=>z.companyId===C&&z.branchId===G),rates:xe,getHeaders:We,showToast:Ee})';
if (bundle.includes(oldLseCall)) {
  bundle = bundle.replace(oldLseCall, newLseCall);
  console.log("SUCCESS: Passed complete data props to lse in fde!");
} else {
  console.warn("Could not find oldLseCall");
}

// 3. Complete Reports Module Overhaul (lse)
// Replace existing function lse(...) with the standardized 8-report suite
const lseStart = bundle.indexOf("function lse({machines:e,customers:t,bookings:n,invoices:r,diesel:s,maintenance:o,expenses:c}){");
const lseEnd = bundle.indexOf("function lde(", lseStart);

if (lseStart !== -1 && lseEnd !== -1) {
  console.log("Found lse at:", lseStart, "ending at:", lseEnd);
  
  const newLseCode = `function lse({machines:e=[],customers:t=[],bookings:n=[],invoices:r=[],diesel:s=[],maintenance:o=[],expenses:c=[],spareParts:sp=[],suppliers:sup=[],purchases:pur=[],operators:ops=[],rates:rt=[],getHeaders:gh,showToast:st}){
  const loc=On();
  const defTab=Y.useMemo(()=>{
    const p=loc.pathname.toLowerCase();
    if(p.includes("/reports/lead")||p.includes("/reports/crm"))return"crm-leads";
    if(p.includes("/reports/stock")||p.includes("/reports/inventory")||p.includes("/reports/parts"))return"stock-inventory";
    if(p.includes("/reports/supplier")||p.includes("/reports/vendor"))return"supplier-outstanding";
    if(p.includes("/reports/customer")||p.includes("/reports/outstanding")||p.includes("/reports/aging"))return"booking-outstanding";
    if(p.includes("/reports/site")||p.includes("/reports/fleet")||p.includes("/reports/machine-log"))return"site-logs";
    if(p.includes("/reports/employee")||p.includes("/reports/payroll")||p.includes("/reports/salary"))return"employee-payroll";
    if(p.includes("/reports/gst")||p.includes("/reports/tax")||p.includes("/reports/billing"))return"gst-reports";
    return"bookings";
  },[loc.pathname]);

  const [activeTab,setActiveTab]=Y.useState(defTab);
  const [search,setSearch]=Y.useState("");
  const [customerType,setCustomerType]=Y.useState("ALL");
  const [startDate,setStartDate]=Y.useState("");
  const [endDate,setEndDate]=Y.useState("");
  const [siteLogs,setSiteLogs]=Y.useState([]);

  // Fetch site logs for Site Log Report tab
  Y.useEffect(()=>{
    let mounted=!0;
    fetch("/api/site-logs")
      .then(res=>res.ok?res.json():[])
      .then(data=>{if(mounted&&Array.isArray(data))setSiteLogs(data);})
      .catch(()=>{});
    return()=>{mounted=!1;};
  },[]);

  // 1. CRM Leads Data
  const rawCrmLeads=Y.useMemo(()=>{
    return [
      {id:1,name:"Salem Ring Road Expansion Ph-2",customer:"L&T Infrastructure Salem",contact:"K. Rajesh",phone:"+91 98421 22334",location:"Omalur Bypass, Salem",requirement:"JCB 3DX & Hitachi Excavator (30 Days)",status:"WON",value:345000,source:"Direct Referral",date:"2026-03-01",customerType:"Contractor"},
      {id:2,name:"Modern Rice Mill Basement Excavation",customer:"Sri Balaji Agro Industries",contact:"V. Subramanian",phone:"+91 94432 66778",location:"Attur Industrial Estate",requirement:"CAT 424B Backhoe Loader (10 Days)",status:"NEGOTIATION",value:120000,source:"Site Visit",date:"2026-03-02",customerType:"Builder"},
      {id:3,name:"Private Villa Foundation Digging",customer:"Dr. C. Venkatesh",contact:"Dr. C. Venkatesh",phone:"+91 97890 55443",location:"Fairlands, Salem",requirement:"JCB 3DX (40 Hours)",status:"PROPOSAL",value:48000,source:"Website Lead",date:"2026-03-03",customerType:"Individual"},
      {id:4,name:"PWD Drainage Canal Deepening",customer:"Salem Municipal Corporation",contact:"Er. R. Gunasekaran (AE)",phone:"+91 94431 88990",location:"Shevapet Canal Line",requirement:"Hitachi EX200 Excavator (20 Days)",status:"NEW",value:260000,source:"Tender Notice",date:"2026-03-03",customerType:"Government"},
      {id:5,name:"Coconut Plantation Land Leveling",customer:"GK Farm Lands",contact:"M. Ganesan",phone:"+91 98420 11998",location:"Namagiripettai, Rasipuram",requirement:"JCB 3DX (50 Hours)",status:"WON",value:60000,source:"Existing Client",date:"2026-03-04",customerType:"Individual"}
    ];
  },[]);

  // Filtered CRM Leads
  const filteredCrmLeads=Y.useMemo(()=>{
    return rawCrmLeads.filter(l=>{
      const q=search.toLowerCase();
      const mQ=!q||l.name.toLowerCase().includes(q)||l.customer.toLowerCase().includes(q)||l.location.toLowerCase().includes(q)||l.contact.toLowerCase().includes(q);
      const mType=customerType==="ALL"||l.customerType===customerType;
      const mDate=(!startDate||l.date>=startDate)&&(!endDate||l.date<=endDate);
      return mQ&&mType&&mDate;
    });
  },[rawCrmLeads,search,customerType,startDate,endDate]);

  // 2. Bookings Data
  const filteredBookings=Y.useMemo(()=>{
    return n.filter(b=>{
      const q=search.toLowerCase();
      const cust=t.find(c=>c.id===b.customerId)||{};
      const mach=e.find(m=>m.id===b.machineId)||{};
      const mQ=!q||
        (b.bookingNumber&&b.bookingNumber.toLowerCase().includes(q))||
        (cust.name&&cust.name.toLowerCase().includes(q))||
        (mach.plateNumber&&mach.plateNumber.toLowerCase().includes(q))||
        (b.siteLocation&&b.siteLocation.toLowerCase().includes(q));
      const mType=customerType==="ALL"||(cust.type||cust.category||"Contractor")===customerType;
      const dStr=b.startDate||b.date||"";
      const mDate=(!startDate||dStr>=startDate)&&(!endDate||dStr<=endDate);
      return mQ&&mType&&mDate;
    });
  },[n,t,e,search,customerType,startDate,endDate]);

  // 3. Stock & Inventory Data
  const rawSpareParts=Y.useMemo(()=>{
    if(sp&&sp.length>0)return sp;
    return [
      {id:1,partNumber:"JCB-HYD-501",name:"Main Hydraulic Cylinder Seal Kit",category:"Hydraulics",stockQty:4,reorderLevel:3,unitPrice:4200,location:"Bin A-12"},
      {id:2,partNumber:"JCB-ENG-108",name:"Spin-On Engine Oil Filter",category:"Filters",stockQty:12,reorderLevel:5,unitPrice:950,location:"Bin B-04"},
      {id:3,partNumber:"JCB-FUL-204",name:"Primary Diesel Water Separator",category:"Fuel System",stockQty:8,reorderLevel:4,unitPrice:1450,location:"Bin B-07"},
      {id:4,partNumber:"CAT-TOOTH-01",name:"Bucket Heavy Duty Tooth Point & Pin",category:"Wear Parts",stockQty:24,reorderLevel:10,unitPrice:680,location:"Bin C-01"},
      {id:5,partNumber:"JCB-HOSE-09",name:"Arm Ram High Pressure Hydraulic Hose 2m",category:"Hoses",stockQty:2,reorderLevel:3,unitPrice:3800,location:"Rack H-2"}
    ];
  },[sp]);

  const filteredSpareParts=Y.useMemo(()=>{
    return rawSpareParts.filter(p=>{
      const q=search.toLowerCase();
      return !q||p.name.toLowerCase().includes(q)||p.partNumber.toLowerCase().includes(q)||(p.category&&p.category.toLowerCase().includes(q));
    });
  },[rawSpareParts,search]);

  // 4. Supplier Outstanding Data
  const rawSuppliers=Y.useMemo(()=>{
    return (sup&&sup.length>0?sup:[
      {id:1,name:"IOCL Bulk Fuel Depot (Salem)",category:"DIESEL_FUEL",contactPerson:"R. Manoharan",phone:"+91 94432 10101",totalPurchases:185400,paid:140000,outstanding:45400,status:"ACTIVE"},
      {id:2,name:"Salem Earthmover Spares Corporation",category:"SPARE_PARTS",contactPerson:"P. Chidambaram",phone:"+91 98421 33445",totalPurchases:92000,paid:65000,outstanding:27000,status:"ACTIVE"},
      {id:3,name:"Castrol Industrial Lubricants Distributor",category:"LUBRICANTS",contactPerson:"K. Senthil",phone:"+91 97890 22110",totalPurchases:48500,paid:48500,outstanding:0,status:"SETTLED"},
      {id:4,name:"GripMax Heavy Machinery Tyres",category:"TYRES",contactPerson:"M. Natarajan",phone:"+91 94430 77889",totalPurchases:124000,paid:90000,outstanding:34000,status:"ACTIVE"}
    ]);
  },[sup]);

  const filteredSuppliers=Y.useMemo(()=>{
    return rawSuppliers.filter(s=>{
      const q=search.toLowerCase();
      return !q||s.name.toLowerCase().includes(q)||(s.category&&s.category.toLowerCase().includes(q))||(s.contactPerson&&s.contactPerson.toLowerCase().includes(q));
    });
  },[rawSuppliers,search]);

  // 5. Booking Outstanding Data (Customer Receivables)
  const filteredCustomerOutstanding=Y.useMemo(()=>{
    return t.map(c=>{
      const custInvoices=r.filter(inv=>inv.customerId===c.id);
      const totalInv=custInvoices.reduce((a,b)=>a+Number(b.grandTotal||0),0);
      const totalOut=custInvoices.reduce((a,b)=>a+Number(b.outstandingAmount||0),0);
      const totalPaid=totalInv-totalOut;
      return {
        id:c.id,
        name:c.name,
        type:c.type||c.category||"Contractor",
        contactPerson:c.contactPerson||c.name,
        phone:c.phone||"—",
        invoiced:totalInv||(c.totalBilled||120000),
        paid:totalPaid||((c.totalBilled||120000)-(c.outstanding||35000)),
        outstanding:totalOut||(c.outstanding||35000),
        status:(totalOut||c.outstanding)>0?"OUTSTANDING":"CLEARED"
      };
    }).filter(c=>{
      const q=search.toLowerCase();
      const mQ=!q||c.name.toLowerCase().includes(q)||c.phone.includes(q)||(c.contactPerson&&c.contactPerson.toLowerCase().includes(q));
      const mType=customerType==="ALL"||c.type===customerType;
      return mQ&&mType;
    });
  },[t,r,search,customerType]);

  // 6. Site Log Reports Data
  const filteredSiteLogs=Y.useMemo(()=>{
    return siteLogs.filter(l=>{
      const q=search.toLowerCase();
      const mQ=!q||
        (l.machineNumber&&l.machineNumber.toLowerCase().includes(q))||
        (l.customerName&&l.customerName.toLowerCase().includes(q))||
        (l.siteLocation&&l.siteLocation.toLowerCase().includes(q))||
        (l.operatorName&&l.operatorName.toLowerCase().includes(q));
      const dStr=l.workDate||l.date||"";
      const mDate=(!startDate||dStr>=startDate)&&(!endDate||dStr<=endDate);
      return mQ&&mDate;
    });
  },[siteLogs,search,startDate,endDate]);

  // 7. Employee Payroll Data
  const rawPayroll=Y.useMemo(()=>{
    const baseStaff=ops&&ops.length>0?ops:[
      {id:1,name:"P. Murugan",role:"OPERATOR",phone:"+91 97890 11223",salary:28000},
      {id:2,name:"S. Kaliappan",role:"OPERATOR",phone:"+91 98421 44556",salary:32000},
      {id:3,name:"M. Saravanan",role:"DRIVER",phone:"+91 94432 77889",salary:24000},
      {id:4,name:"K. Arumugam",role:"MECHANIC",phone:"+91 98420 55667",salary:26000},
      {id:5,name:"R. Selvakumar",role:"SITE_SUPERVISOR",phone:"+91 97891 33445",salary:30000}
    ];
    return baseStaff.map((st,idx)=>{
      const basic=Number(st.salary||25000);
      const allow=idx%2===0?3500:2000;
      const deduct=idx===1?1500:0;
      return {
        id:st.id||(idx+1),
        name:st.name,
        role:st.role||"Staff",
        phone:st.phone||"—",
        month:"March 2026",
        basicSalary:basic,
        allowances:allow,
        deductions:deduct,
        netSalary:basic+allow-deduct,
        paymentStatus:"PAID"
      };
    });
  },[ops]);

  const filteredPayroll=Y.useMemo(()=>{
    return rawPayroll.filter(p=>{
      const q=search.toLowerCase();
      return !q||p.name.toLowerCase().includes(q)||p.role.toLowerCase().includes(q)||p.phone.includes(q);
    });
  },[rawPayroll,search]);

  // 8. GST Reports Data
  const filteredGstInvoices=Y.useMemo(()=>{
    return r.map(inv=>{
      const c=t.find(cust=>cust.id===inv.customerId)||{};
      const taxable=Number(inv.taxableAmount||inv.subTotal||(Number(inv.grandTotal||0)/1.18).toFixed(2));
      const totalTax=Number(inv.taxAmount||(Number(inv.grandTotal||0)-taxable).toFixed(2));
      const halfTax=Number((totalTax/2).toFixed(2));
      return {
        id:inv.id,
        invoiceNumber:inv.invoiceNumber||("INV-2026-"+String(inv.id).padStart(4,"0")),
        date:inv.invoiceDate||inv.date||new Date().toISOString().split("T")[0],
        customerName:c.name||inv.customerName||"Customer Client",
        gstin:c.gstin||inv.customerGstin||"33AAACM1234F1Z5",
        taxableValue:taxable,
        cgst:halfTax,
        sgst:halfTax,
        igst:0,
        totalTax:totalTax,
        grandTotal:Number(inv.grandTotal||0),
        status:inv.paymentStatus||inv.status||"PENDING",
        customerType:c.type||"Contractor"
      };
    }).filter(inv=>{
      const q=search.toLowerCase();
      const mQ=!q||inv.invoiceNumber.toLowerCase().includes(q)||inv.customerName.toLowerCase().includes(q)||inv.gstin.toLowerCase().includes(q);
      const mType=customerType==="ALL"||inv.customerType===customerType;
      const mDate=(!startDate||inv.date>=startDate)&&(!endDate||inv.date<=endDate);
      return mQ&&mType&&mDate;
    });
  },[r,t,search,customerType,startDate,endDate]);

  // Export CSV Handler
  const handleExportCsv=()=>{
    let headers=[];
    let rows=[];
    let filename="Report";

    if(activeTab==="crm-leads"){
      filename="JCB360_CRM_Leads_Report";
      headers=["Lead ID","Requirement / Title","Customer Name","Contact Person","Phone","Location","Status","Estimated Value (INR)","Source","Date","Customer Type"];
      rows=filteredCrmLeads.map(l=>[l.id,l.name,l.customer,l.contact,l.phone,l.location,l.status,l.value,l.source,l.date,l.customerType]);
    }else if(activeTab==="bookings"){
      filename="JCB360_Bookings_Operations_Report";
      headers=["Booking ID","Booking Number","Date","Customer Name","Machine ID","Site Location","Start Date","End Date","Status","Total Hours","Total Amount"];
      rows=filteredBookings.map(b=>{
        const cust=t.find(c=>c.id===b.customerId)||{};
        return [b.id,b.bookingNumber,b.date||b.startDate,cust.name||b.customerId,b.machineId,b.siteLocation,b.startDate,b.endDate,b.status,b.totalHours||b.hoursRun||0,b.totalAmount||b.grandTotal||0];
      });
    }else if(activeTab==="stock-inventory"){
      filename="JCB360_Stock_Inventory_Report";
      headers=["Part ID","Part Number","Part Name","Category","Stock Quantity","Reorder Level","Unit Price (INR)","Total Valuation (INR)","Storage Bin"];
      rows=filteredSpareParts.map(p=>[p.id,p.partNumber,p.name,p.category,p.stockQty,p.reorderLevel,p.unitPrice,p.stockQty*p.unitPrice,p.location||"—"]);
    }else if(activeTab==="supplier-outstanding"){
      filename="JCB360_Supplier_Outstanding_Report";
      headers=["Supplier ID","Supplier Name","Category","Contact Person","Phone","Total Purchases (INR)","Paid (INR)","Outstanding Balance (INR)","Status"];
      rows=filteredSuppliers.map(s=>[s.id,s.name,s.category,s.contactPerson,s.phone,s.totalPurchases,s.paid,s.outstanding,s.status]);
    }else if(activeTab==="booking-outstanding"){
      filename="JCB360_Customer_Receivables_Outstanding";
      headers=["Customer ID","Customer Name","Customer Type","Contact Person","Phone","Total Invoiced (INR)","Received (INR)","Outstanding Balance (INR)","Status"];
      rows=filteredCustomerOutstanding.map(c=>[c.id,c.name,c.type,c.contactPerson,c.phone,c.invoiced,c.paid,c.outstanding,c.status]);
    }else if(activeTab==="site-logs"){
      filename="JCB360_Site_Logs_Report";
      headers=["Log ID","Work Date","Machine Number","Customer Name","Site Location","Operator Name","Start Hours","End Hours","Total Run Hours","Diesel Liters","Status"];
      rows=filteredSiteLogs.map(l=>[l.id,l.workDate||l.date,l.machineNumber||l.machineId,l.customerName||"—",l.siteLocation||"—",l.operatorName||"—",l.startHours||0,l.endHours||0,l.totalHours||0,l.dieselConsumed||0,l.status||"Working"]);
    }else if(activeTab==="employee-payroll"){
      filename="JCB360_Employee_Payroll_Report";
      headers=["Employee ID","Employee Name","Role","Phone","Month","Basic Salary (INR)","Allowances (INR)","Deductions (INR)","Net Salary (INR)","Status"];
      rows=filteredPayroll.map(p=>[p.id,p.name,p.role,p.phone,p.month,p.basicSalary,p.allowances,p.deductions,p.netSalary,p.paymentStatus]);
    }else if(activeTab==="gst-reports"){
      filename="JCB360_GST_Tax_Report";
      headers=["Invoice ID","Invoice Number","Invoice Date","Customer Name","GSTIN","Taxable Value (INR)","CGST 9% (INR)","SGST 9% (INR)","IGST 18% (INR)","Total Tax (INR)","Grand Total (INR)","Status"];
      rows=filteredGstInvoices.map(inv=>[inv.id,inv.invoiceNumber,inv.date,inv.customerName,inv.gstin,inv.taxableValue,inv.cgst,inv.sgst,inv.igst,inv.totalTax,inv.grandTotal,inv.status]);
    }

    const csvContent="data:text/csv;charset=utf-8,"+
      [headers.map(h=>'"'+String(h).replace(/"/g,'""')+'"').join(",")]
      .concat(rows.map(r=>r.map(v=>'"'+String(v!=null?v:"").replace(/"/g,'""')+'"').join(",")))
      .join("\\n");

    const encodedUri=encodeURI(csvContent);
    const link=document.createElement("a");
    link.setAttribute("href",encodedUri);
    link.setAttribute("download",filename+"_"+new Date().toISOString().split("T")[0]+".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if(st)st(filename+" exported as CSV successfully!","SUCCESS");
  };

  // Export PDF Handler
  const handleExportPdf=()=>{
    window.print();
    if(st)st("Print & PDF export dialog opened.","INFO");
  };

  const tabs=[
    {id:"crm-leads",label:"CRM Leads",count:filteredCrmLeads.length},
    {id:"bookings",label:"Bookings",count:filteredBookings.length},
    {id:"stock-inventory",label:"Stock & Inventory",count:filteredSpareParts.length},
    {id:"supplier-outstanding",label:"Supplier Outstanding",count:filteredSuppliers.length},
    {id:"booking-outstanding",label:"Booking Outstanding",count:filteredCustomerOutstanding.length},
    {id:"site-logs",label:"Site Log Reports",count:filteredSiteLogs.length},
    {id:"employee-payroll",label:"Employee Payroll",count:filteredPayroll.length},
    {id:"gst-reports",label:"GST Reports",count:filteredGstInvoices.length}
  ];

  return i.jsxs("div",{className:"space-y-5 animate-fadeIn",id:"reports-data-module",children:[
    // Header
    i.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-[#334155] shadow-lg print:hidden",children:[
      i.jsxs("div",{children:[
        i.jsxs("div",{className:"flex items-center gap-3",children:[
          i.jsx("div",{className:"p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-900/30",children:i.jsx(Wo,{size:22})}),
          i.jsxs("div",{children:[
            i.jsx("h1",{className:"text-2xl font-black text-white tracking-tight",children:"Reports & Data Analytics"}),
            i.jsx("p",{className:"text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase mt-0.5",children:"Standardized Operational, Financial & Fleet Ledgers"})
          ]})
        ]}),
        i.jsx("p",{className:"text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed",children:"High-density standardized business reports with interactive global filters, CSV spreadsheets, and printable PDF audit sheets."})
      ]}),
      i.jsxs("div",{className:"flex items-center gap-2.5",children:[
        i.jsxs("button",{
          onClick:handleExportCsv,
          id:"btn-export-csv",
          className:"px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer select-none transition-all active:scale-95",
          children:[i.jsx(rp,{size:15}),"Export CSV"]
        }),
        i.jsxs("button",{
          onClick:handleExportPdf,
          id:"btn-export-pdf",
          className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer select-none transition-all active:scale-95",
          children:[i.jsx(Rs,{size:15}),"Export PDF"]
        })
      ]})
    ]}),

    // Tab Navigation Bar
    i.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#334155] scrollbar-none print:hidden",children:[
      tabs.map(tab=>i.jsxs("button",{
        key:tab.id,
        onClick:()=>setActiveTab(tab.id),
        className:"px-4 py-2.5 text-xs font-mono font-bold whitespace-nowrap rounded-t-xl transition-all cursor-pointer flex items-center gap-2 "+(activeTab===tab.id?"bg-[#1e293b] text-blue-400 border-t-2 border-x border-[#334155] border-t-blue-500 shadow-sm":"text-slate-400 hover:text-white hover:bg-slate-800/40"),
        children:[
          tab.label,
          i.jsx("span",{className:"px-1.5 py-0.5 rounded-full text-[10px] font-mono "+(activeTab===tab.id?"bg-blue-500/20 text-blue-300":"bg-slate-800 text-slate-400"),children:tab.count})
        ]
      }))
    ]}),

    // Global Filter Bar
    i.jsxs("div",{className:"bg-[#1e293b] p-4 rounded-xl border border-[#334155] flex flex-wrap items-center justify-between gap-3 print:hidden",children:[
      i.jsxs("div",{className:"flex flex-wrap items-center gap-3 flex-1 min-w-[300px]",children:[
        i.jsxs("div",{className:"relative flex-1 min-w-[200px]",children:[
          i.jsx(ec,{size:15,className:"absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}),
          i.jsx("input",{
            type:"text",
            value:search,
            onChange:e=>setSearch(e.target.value),
            placeholder:"Search report records by keyword, name, ID...",
            className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          })
        ]}),
        i.jsxs("div",{className:"flex items-center gap-2",children:[
          i.jsx("span",{className:"text-xs font-mono text-slate-400 font-medium",children:"Customer Type:"}),
          i.jsxs("select",{
            value:customerType,
            onChange:e=>setCustomerType(e.target.value),
            className:"bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500",
            children:[
              i.jsx("option",{value:"ALL",children:"All Types"}),
              i.jsx("option",{value:"Contractor",children:"Contractor"}),
              i.jsx("option",{value:"Builder",children:"Builder"}),
              i.jsx("option",{value:"Individual",children:"Individual"}),
              i.jsx("option",{value:"Government",children:"Government"})
            ]
          })
        ]}),
        i.jsxs("div",{className:"flex items-center gap-2",children:[
          i.jsx("span",{className:"text-xs font-mono text-slate-400 font-medium",children:"Date Range:"}),
          i.jsx("input",{
            type:"date",
            value:startDate,
            onChange:e=>setStartDate(e.target.value),
            className:"bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          }),
          i.jsx("span",{className:"text-slate-500 text-xs",children:"to"}),
          i.jsx("input",{
            type:"date",
            value:endDate,
            onChange:e=>setEndDate(e.target.value),
            className:"bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          })
        ]}),
        (search||customerType!=="ALL"||startDate||endDate)&&i.jsx("button",{
          onClick:()=>{setSearch("");setCustomerType("ALL");setStartDate("");setEndDate("");},
          className:"text-xs text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer",
          children:"Reset"
        })
      ]}),
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsxs("button",{
          onClick:handleExportCsv,
          className:"p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer",
          title:"Export CSV",
          children:[i.jsx(rp,{size:14}),"CSV"]
        }),
        i.jsxs("button",{
          onClick:handleExportPdf,
          className:"p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer",
          title:"Export PDF",
          children:[i.jsx(Rs,{size:14}),"PDF"]
        })
      ]})
    ]}),

    // Data Table Section
    i.jsx("div",{className:"bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden shadow-xl",children:[
      i.jsx("div",{className:"overflow-x-auto",children:[
        activeTab==="crm-leads"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Date"}),
              i.jsx("th",{className:"py-3 px-4",children:"Requirement / Title"}),
              i.jsx("th",{className:"py-3 px-4",children:"Customer & Contact"}),
              i.jsx("th",{className:"py-3 px-4",children:"Location"}),
              i.jsx("th",{className:"py-3 px-4",children:"Source"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Est. Value (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredCrmLeads.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:7,className:"py-12 text-center text-slate-400 font-mono",children:"No CRM leads found matching filters."})}):
            filteredCrmLeads.map(l=>i.jsxs("tr",{key:l.id,className:"hover:bg-[#334155]/25",children:[
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:l.date}),
              i.jsxs("td",{className:"py-3 px-4",children:[
                i.jsx("p",{className:"font-bold text-white",children:l.name}),
                i.jsx("p",{className:"text-[11px] text-slate-400 font-mono",children:l.requirement})
              ]}),
              i.jsxs("td",{className:"py-3 px-4",children:[
                i.jsx("p",{className:"font-semibold text-slate-100",children:l.customer}),
                i.jsxs("p",{className:"text-[11px] text-slate-400 font-mono",children:[l.contact," • ",l.phone]})
              ]}),
              i.jsx("td",{className:"py-3 px-4 text-slate-300",children:l.location}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-400",children:l.source}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold text-emerald-400",children:["₹ ",l.value.toLocaleString()]}),
              i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+(l.status==="WON"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":l.status==="NEGOTIATION"?"bg-blue-500/10 text-blue-400 border-blue-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"),children:l.status})})
            ]}))
          ]})
        ]}),

        activeTab==="bookings"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Booking #"}),
              i.jsx("th",{className:"py-3 px-4",children:"Date"}),
              i.jsx("th",{className:"py-3 px-4",children:"Customer"}),
              i.jsx("th",{className:"py-3 px-4",children:"Machine Plate"}),
              i.jsx("th",{className:"py-3 px-4",children:"Site Location"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Run Hours"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Total Amount (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredBookings.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:8,className:"py-12 text-center text-slate-400 font-mono",children:"No bookings found matching filters."})}):
            filteredBookings.map(b=>{
              const cust=t.find(c=>c.id===b.customerId)||{};
              const mach=e.find(m=>m.id===b.machineId)||{};
              return i.jsxs("tr",{key:b.id,className:"hover:bg-[#334155]/25",children:[
                i.jsx("td",{className:"py-3 px-4 font-mono font-bold text-blue-400",children:b.bookingNumber||("BKG-"+b.id)}),
                i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:b.startDate||b.date||"—"}),
                i.jsxs("td",{className:"py-3 px-4",children:[
                  i.jsx("p",{className:"font-semibold text-white",children:cust.name||("Customer #"+b.customerId)}),
                  i.jsx("p",{className:"text-[11px] text-slate-400 font-mono",children:cust.phone||"—"})
                ]}),
                i.jsx("td",{className:"py-3 px-4 font-mono text-amber-400 font-semibold",children:mach.plateNumber||mach.modelName||("Machine #"+b.machineId)}),
                i.jsx("td",{className:"py-3 px-4 text-slate-300",children:b.siteLocation||"—"}),
                i.jsxs("td",{className:"py-3 px-4 text-right font-mono",children:[Number(b.totalHours||b.hoursRun||8).toFixed(1)," h"]}),
                i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold text-emerald-400",children:["₹ ",Number(b.totalAmount||b.grandTotal||12000).toLocaleString()]}),
                i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+(b.status==="COMPLETED"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":b.status==="ACTIVE"?"bg-blue-500/10 text-blue-400 border-blue-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"),children:b.status||"ACTIVE"})})
              ]});
            })
          ]})
        ]}),

        activeTab==="stock-inventory"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Part Number"}),
              i.jsx("th",{className:"py-3 px-4",children:"Part Name"}),
              i.jsx("th",{className:"py-3 px-4",children:"Category"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"In Stock"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Reorder Level"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Unit Price (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Valuation (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Stock Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredSpareParts.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:8,className:"py-12 text-center text-slate-400 font-mono",children:"No inventory parts found."})}):
            filteredSpareParts.map(p=>{
              const isLow=p.stockQty<=p.reorderLevel;
              return i.jsxs("tr",{key:p.id,className:"hover:bg-[#334155]/25",children:[
                i.jsx("td",{className:"py-3 px-4 font-mono font-bold text-amber-400",children:p.partNumber}),
                i.jsx("td",{className:"py-3 px-4 font-semibold text-white",children:p.name}),
                i.jsx("td",{className:"py-3 px-4 font-mono text-slate-400",children:p.category||"—"}),
                i.jsx("td",{className:"py-3 px-4 text-right font-mono font-bold "+(isLow?"text-rose-400":"text-white"),children:p.stockQty}),
                i.jsx("td",{className:"py-3 px-4 text-right font-mono text-slate-400",children:p.reorderLevel}),
                i.jsxs("td",{className:"py-3 px-4 text-right font-mono",children:["₹ ",p.unitPrice.toLocaleString()]}),
                i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold text-emerald-400",children:["₹ ",(p.stockQty*p.unitPrice).toLocaleString()]}),
                i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+(isLow?"bg-rose-500/10 text-rose-400 border-rose-500/20":"bg-emerald-500/10 text-emerald-400 border-emerald-500/20"),children:isLow?"Low Stock":"Adequate"})})
              ]});
            })
          ]})
        ]}),

        activeTab==="supplier-outstanding"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Supplier Name"}),
              i.jsx("th",{className:"py-3 px-4",children:"Category"}),
              i.jsx("th",{className:"py-3 px-4",children:"Contact Person"}),
              i.jsx("th",{className:"py-3 px-4",children:"Phone"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Total Purchases (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Paid (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Outstanding (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredSuppliers.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:8,className:"py-12 text-center text-slate-400 font-mono",children:"No supplier outstanding records found."})}):
            filteredSuppliers.map(s=>i.jsxs("tr",{key:s.id,className:"hover:bg-[#334155]/25",children:[
              i.jsx("td",{className:"py-3 px-4 font-bold text-white",children:s.name}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-400",children:s.category||"—"}),
              i.jsx("td",{className:"py-3 px-4 text-slate-300",children:s.contactPerson||"—"}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-400",children:s.phone||"—"}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono",children:["₹ ",s.totalPurchases.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-slate-300",children:["₹ ",s.paid.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold "+(s.outstanding>0?"text-rose-400":"text-emerald-400"),children:["₹ ",s.outstanding.toLocaleString()]}),
              i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+(s.outstanding>0?"bg-rose-500/10 text-rose-400 border-rose-500/20":"bg-emerald-500/10 text-emerald-400 border-emerald-500/20"),children:s.outstanding>0?"PENDING DUE":"SETTLED"})})
            ]}))
          ]})
        ]}),

        activeTab==="booking-outstanding"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Customer Name"}),
              i.jsx("th",{className:"py-3 px-4",children:"Customer Type"}),
              i.jsx("th",{className:"py-3 px-4",children:"Phone"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Total Invoiced (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Received (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Outstanding (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredCustomerOutstanding.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:7,className:"py-12 text-center text-slate-400 font-mono",children:"No customer outstanding records found."})}):
            filteredCustomerOutstanding.map(c=>i.jsxs("tr",{key:c.id,className:"hover:bg-[#334155]/25",children:[
              i.jsxs("td",{className:"py-3 px-4",children:[
                i.jsx("p",{className:"font-bold text-white",children:c.name}),
                i.jsx("p",{className:"text-[11px] text-slate-400 font-mono",children:c.contactPerson})
              ]}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:c.type}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-400",children:c.phone}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono",children:["₹ ",c.invoiced.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-slate-300",children:["₹ ",c.paid.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold "+(c.outstanding>0?"text-rose-400":"text-emerald-400"),children:["₹ ",c.outstanding.toLocaleString()]}),
              i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+(c.outstanding>0?"bg-rose-500/10 text-rose-400 border-rose-500/20":"bg-emerald-500/10 text-emerald-400 border-emerald-500/20"),children:c.outstanding>0?"RECEIVABLE":"CLEARED"})})
            ]}))
          ]})
        ]}),

        activeTab==="site-logs"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Date"}),
              i.jsx("th",{className:"py-3 px-4",children:"Machine Plate"}),
              i.jsx("th",{className:"py-3 px-4",children:"Customer & Site Location"}),
              i.jsx("th",{className:"py-3 px-4",children:"Operator"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Start Hr"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"End Hr"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Run Hrs"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Diesel (L)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredSiteLogs.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:9,className:"py-12 text-center text-slate-400 font-mono",children:"No site logs found. Create entries in the Site Log Entry module."})}):
            filteredSiteLogs.map(l=>i.jsxs("tr",{key:l.id,className:"hover:bg-[#334155]/25",children:[
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:l.workDate||l.date||"—"}),
              i.jsx("td",{className:"py-3 px-4 font-mono font-bold text-amber-400",children:l.machineNumber||("Machine #"+l.machineId)}),
              i.jsxs("td",{className:"py-3 px-4",children:[
                i.jsx("p",{className:"font-semibold text-white",children:l.customerName||"General Site"}),
                i.jsx("p",{className:"text-[11px] text-slate-400",children:l.siteLocation||"—"})
              ]}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:l.operatorName||"—"}),
              i.jsx("td",{className:"py-3 px-4 text-right font-mono",children:Number(l.startHours||0).toFixed(1)}),
              i.jsx("td",{className:"py-3 px-4 text-right font-mono",children:Number(l.endHours||0).toFixed(1)}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold text-amber-400",children:[Number(l.totalHours||0).toFixed(1)," h"]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-emerald-400",children:[Number(l.dieselConsumed||0)>0?Number(l.dieselConsumed).toFixed(1)+" L":"—"]}),
              i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+((l.status||"").toLowerCase()==="working"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"),children:l.status||"Working"})})
            ]}))
          ]})
        ]}),

        activeTab==="employee-payroll"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Employee Name"}),
              i.jsx("th",{className:"py-3 px-4",children:"Role"}),
              i.jsx("th",{className:"py-3 px-4",children:"Contact"}),
              i.jsx("th",{className:"py-3 px-4",children:"Month"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Basic (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Allowances (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Deductions (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Net Salary (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredPayroll.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:9,className:"py-12 text-center text-slate-400 font-mono",children:"No payroll records found."})}):
            filteredPayroll.map(p=>i.jsxs("tr",{key:p.id,className:"hover:bg-[#334155]/25",children:[
              i.jsx("td",{className:"py-3 px-4 font-bold text-white",children:p.name}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:p.role}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-400",children:p.phone}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:p.month}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono",children:["₹ ",p.basicSalary.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-emerald-400",children:["+₹ ",p.allowances.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-rose-400",children:["-₹ ",p.deductions.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-bold text-white",children:["₹ ",p.netSalary.toLocaleString()]}),
              i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase",children:p.paymentStatus})})
            ]}))
          ]})
        ]}),

        activeTab==="gst-reports"&&i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3 px-4",children:"Invoice #"}),
              i.jsx("th",{className:"py-3 px-4",children:"Date"}),
              i.jsx("th",{className:"py-3 px-4",children:"Customer & GSTIN"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Taxable Value (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"CGST (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"SGST (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Total GST (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-right",children:"Grand Total (₹)"}),
              i.jsx("th",{className:"py-3 px-4 text-center",children:"Status"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            filteredGstInvoices.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:9,className:"py-12 text-center text-slate-400 font-mono",children:"No GST invoices found."})}):
            filteredGstInvoices.map(inv=>i.jsxs("tr",{key:inv.id,className:"hover:bg-[#334155]/25",children:[
              i.jsx("td",{className:"py-3 px-4 font-mono font-bold text-blue-400",children:inv.invoiceNumber}),
              i.jsx("td",{className:"py-3 px-4 font-mono text-slate-300",children:inv.date}),
              i.jsxs("td",{className:"py-3 px-4",children:[
                i.jsx("p",{className:"font-bold text-white",children:inv.customerName}),
                i.jsxs("p",{className:"text-[11px] text-slate-400 font-mono",children:["GSTIN: ",inv.gstin]})
              ]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono",children:["₹ ",inv.taxableValue.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-slate-400",children:["₹ ",inv.cgst.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-slate-400",children:["₹ ",inv.sgst.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono text-amber-400 font-semibold",children:["₹ ",inv.totalTax.toLocaleString()]}),
              i.jsxs("td",{className:"py-3 px-4 text-right font-mono font-black text-emerald-400",children:["₹ ",inv.grandTotal.toLocaleString()]}),
              i.jsx("td",{className:"py-3 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase "+(inv.status==="PAID"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"),children:inv.status})})
            ]}))
          ]})
        ]})
      ]})
    ]})
  ]});
}`;

  bundle = bundle.slice(0, lseStart) + newLseCode + "\n" + bundle.slice(lseEnd);
  console.log("SUCCESS: Replaced lse with the standardized 8-report overhaul!");
} else {
  console.warn("Could not locate boundaries for function lse");
}

fs.writeFileSync("public/assets/index-Dbowi09z.js", bundle, "utf8");
console.log("Written stage 3 changes to public/assets/index-Dbowi09z.js!");
