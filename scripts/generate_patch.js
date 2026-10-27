import fs from "fs";

// Create the patch script that updates public/assets/index-Dbowi09z.js
let bundle = fs.readFileSync("public/assets/index-Dbowi09z.js", "utf8");

console.log("Original bundle length:", bundle.length);

// 1. Add Site Log Entry to sidebar Machinery / Fleet
const sidebarTarget = '{id:"maintenance_expenses",name:"Maintenance & Expenses",icon:Am,roles:["ADMIN","MANAGER","ACCOUNTANT","OPERATOR"],subItems:[{id:"maint_diesel",name:"Diesel & Fuel Logs",targetModule:"maintenance-expenses-diesel"},';
const sidebarReplacement = '{id:"maintenance_expenses",name:"Machinery / Fleet",icon:Am,roles:["ADMIN","MANAGER","ACCOUNTANT","OPERATOR"],subItems:[{id:"site_log_entry",name:"Site Log Entry",targetModule:"fleet-site-logs"},{id:"maint_diesel",name:"Diesel & Fuel Logs",targetModule:"maintenance-expenses-diesel"},';
if (bundle.includes(sidebarTarget)) {
  bundle = bundle.replace(sidebarTarget, sidebarReplacement);
  console.log("SUCCESS: Added Site Log Entry to Sidebar Machinery / Fleet!");
} else {
  console.warn("Could not find sidebarTarget");
}

// 2. Ensure k in N6 and f in fde map fleet-site-logs
if (!bundle.includes('fleet-site-logs"||M==="site-logs')) {
  bundle = bundle.replace('k=M=>M==="dashboard"?"/":', 'k=M=>M==="fleet-site-logs"||M==="site-logs"?"/fleet/site-logs":M==="dashboard"?"/":');
}

// 3. Make sure /fleet expands the Machinery / Fleet accordion in sidebar N6
const accordionTarget = 'S.startsWith("/maintenance")?O(M=>({...M,maintenance_expenses:!0}))';
const accordionReplacement = 'S.startsWith("/fleet")||S.startsWith("/maintenance")?O(M=>({...M,maintenance_expenses:!0}))';
if (bundle.includes(accordionTarget)) {
  bundle = bundle.replace(accordionTarget, accordionReplacement);
  console.log("SUCCESS: Updated sidebar accordion expansion for /fleet!");
}

// 4. Update breadcrumbs ut in fde to recognize fleet and site-logs
const breadcrumbTarget = 'diesel:"Diesel Expense",';
const breadcrumbReplacement = 'fleet:"Machinery / Fleet","site-logs":"Site Log Entry",diesel:"Diesel Expense",';
if (bundle.includes(breadcrumbTarget)) {
  bundle = bundle.replace(breadcrumbTarget, breadcrumbReplacement);
  console.log("SUCCESS: Updated breadcrumb titles for fleet and site-logs!");
}

// 5. Update activeModule calculation p in fde to set "maintenance" for /fleet
const activeModTarget = 'z.startsWith("/maintenance-expenses")||z.startsWith("/expenses")||z.startsWith("/maintenance")?"maintenance"';
const activeModReplacement = 'z.startsWith("/fleet")||z.startsWith("/maintenance-expenses")||z.startsWith("/expenses")||z.startsWith("/maintenance")?"maintenance"';
if (bundle.includes(activeModTarget)) {
  bundle = bundle.replace(activeModTarget, activeModReplacement);
  console.log("SUCCESS: Updated activeModule detection for /fleet!");
}

// 6. Now let's define SiteLogModule and inject it right before fde
const siteLogModuleCode = `
function SiteLogModule({machines=[],customers=[],operators=[],siteLogs=[],onAddSiteLog,onUpdateSiteLog,onDeleteSiteLog,showToast,getHeaders}){
  const [logs,setLogs]=Y.useState(()=>Array.isArray(siteLogs)&&siteLogs.length>0?siteLogs:[]);
  const [loading,setLoading]=Y.useState(!1);
  const [search,setSearch]=Y.useState("");
  const [selectedMachine,setSelectedMachine]=Y.useState("ALL");
  const [selectedStatus,setSelectedStatus]=Y.useState("ALL");
  const [startDate,setStartDate]=Y.useState("");
  const [endDate,setEndDate]=Y.useState("");

  const [isCreateOpen,setIsCreateOpen]=Y.useState(!1);
  const [isEditOpen,setIsEditOpen]=Y.useState(!1);
  const [isViewOpen,setIsViewOpen]=Y.useState(!1);
  const [isDeleteOpen,setIsDeleteOpen]=Y.useState(!1);
  const [activeLog,setActiveLog]=Y.useState(null);

  const initialForm={
    machineId:"",
    machineNumber:"",
    customerId:"",
    customerName:"",
    siteLocation:"",
    operatorName:"",
    workDate:new Date().toISOString().split("T")[0],
    startHours:0,
    endHours:0,
    totalHours:0,
    dieselConsumed:0,
    status:"Working",
    workDescription:""
  };
  const [formData,setFormData]=Y.useState(initialForm);

  const fetchLogs=Y.useCallback(async()=>{
    try{
      setLoading(!0);
      const h=getHeaders?getHeaders():{"Content-Type":"application/json"};
      const res=await fetch("/api/site-logs",{headers:h});
      if(res.ok){
        const d=await res.json();
        if(Array.isArray(d)&&d.length>0)setLogs(d);
      }
    }catch(err){
      console.warn("Fetch site-logs failed:",err);
    }finally{
      setLoading(!1);
    }
  },[getHeaders]);

  Y.useEffect(()=>{
    if(Array.isArray(siteLogs)&&siteLogs.length>0){
      setLogs(siteLogs);
    }else{
      fetchLogs();
    }
  },[siteLogs,fetchLogs]);

  const handleOpenCreate=()=>{
    const m0=machines[0]||{};
    const c0=customers[0]||{};
    const o0=operators[0]||{};
    setFormData({
      ...initialForm,
      machineId:m0.id||"",
      machineNumber:m0.id?(m0.modelName||m0.name||"")+" ("+(m0.plateNumber||m0.code||m0.id)+")":"",
      customerId:c0.id||"",
      customerName:c0.name||"",
      operatorName:o0.name||"",
      workDate:new Date().toISOString().split("T")[0]
    });
    setIsCreateOpen(!0);
  };

  const handleOpenEdit=l=>{
    setActiveLog(l);
    setFormData({
      machineId:l.machineId||"",
      machineNumber:l.machineNumber||"",
      customerId:l.customerId||"",
      customerName:l.customerName||"",
      siteLocation:l.siteLocation||"",
      operatorName:l.operatorName||"",
      workDate:l.workDate||l.date||new Date().toISOString().split("T")[0],
      startHours:Number(l.startHours||l.startReading||0),
      endHours:Number(l.endHours||l.endReading||0),
      totalHours:Number(l.totalHours||0),
      dieselConsumed:Number(l.dieselConsumed||l.dieselFilledLiters||0),
      status:l.status||"Working",
      workDescription:l.workDescription||""
    });
    setIsEditOpen(!0);
  };

  const handleOpenView=l=>{
    setActiveLog(l);
    setIsViewOpen(!0);
  };

  const handleOpenDelete=l=>{
    setActiveLog(l);
    setIsDeleteOpen(!0);
  };

  const handleSaveCreate=async e=>{
    if(e&&e.preventDefault)e.preventDefault();
    try{
      setLoading(!0);
      const h=getHeaders?getHeaders():{"Content-Type":"application/json"};
      const res=await fetch("/api/site-logs",{method:"POST",headers:h,body:JSON.stringify(formData)});
      if(res.ok){
        const saved=await res.json();
        setLogs(prev=>[saved,...prev]);
        if(onAddSiteLog)onAddSiteLog(saved);
        if(showToast)showToast("Site Log Entry logged successfully!","SUCCESS");
        setIsCreateOpen(!1);
      }else{
        const err=await res.json().catch(()=>({}));
        if(showToast)showToast(err.error||"Failed to record site log","ERROR");
      }
    }catch(err){
      if(showToast)showToast("Network error creating site log","ERROR");
    }finally{
      setLoading(!1);
    }
  };

  const handleSaveEdit=async e=>{
    if(e&&e.preventDefault)e.preventDefault();
    if(!activeLog)return;
    try{
      setLoading(!0);
      const h=getHeaders?getHeaders():{"Content-Type":"application/json"};
      const res=await fetch("/api/site-logs/"+activeLog.id,{method:"PUT",headers:h,body:JSON.stringify(formData)});
      if(res.ok){
        const updated=await res.json();
        setLogs(prev=>prev.map(l=>l.id===activeLog.id?{...l,...updated}:l));
        if(onUpdateSiteLog)onUpdateSiteLog(activeLog.id,updated);
        if(showToast)showToast("Site Log Entry updated successfully!","SUCCESS");
        setIsEditOpen(!1);
      }else{
        const err=await res.json().catch(()=>({}));
        if(showToast)showToast(err.error||"Failed to update site log","ERROR");
      }
    }catch(err){
      if(showToast)showToast("Network error updating site log","ERROR");
    }finally{
      setLoading(!1);
    }
  };

  const handleConfirmDelete=async()=>{
    if(!activeLog)return;
    try{
      setLoading(!0);
      const h=getHeaders?getHeaders():{"Content-Type":"application/json"};
      const res=await fetch("/api/site-logs/"+activeLog.id,{method:"DELETE",headers:h});
      if(res.ok){
        setLogs(prev=>prev.filter(l=>l.id!==activeLog.id));
        if(onDeleteSiteLog)onDeleteSiteLog(activeLog.id);
        if(showToast)showToast("Site Log Entry removed.","SUCCESS");
        setIsDeleteOpen(!1);
      }else{
        const err=await res.json().catch(()=>({}));
        if(showToast)showToast(err.error||"Failed to delete site log","ERROR");
      }
    }catch(err){
      if(showToast)showToast("Network error deleting site log","ERROR");
    }finally{
      setLoading(!1);
    }
  };

  const filteredLogs=Y.useMemo(()=>{
    return logs.filter(l=>{
      const q=search.toLowerCase().trim();
      const mText=!q||
        (l.machineNumber&&l.machineNumber.toLowerCase().includes(q))||
        (l.siteLocation&&l.siteLocation.toLowerCase().includes(q))||
        (l.customerName&&l.customerName.toLowerCase().includes(q))||
        (l.operatorName&&l.operatorName.toLowerCase().includes(q));
      const mMach=selectedMachine==="ALL"||String(l.machineId)===String(selectedMachine);
      const mStat=selectedStatus==="ALL"||(l.status&&l.status.toLowerCase()===selectedStatus.toLowerCase());
      const dStr=l.workDate||l.date||"";
      const mStart=!startDate||dStr>=startDate;
      const mEnd=!endDate||dStr<=endDate;
      return mText&&mMach&&mStat&&mStart&&mEnd;
    });
  },[logs,search,selectedMachine,selectedStatus,startDate,endDate]);

  const totalRunHours=Y.useMemo(()=>filteredLogs.reduce((acc,l)=>acc+(Number(l.totalHours)||0),0),[filteredLogs]);
  const totalFuelLiters=Y.useMemo(()=>filteredLogs.reduce((acc,l)=>acc+(Number(l.dieselConsumed||l.dieselFilledLiters)||0),0),[filteredLogs]);
  const workingCount=Y.useMemo(()=>filteredLogs.filter(l=>(l.status||"").toLowerCase()==="working").length,[filteredLogs]);

  return i.jsxs("div",{className:"space-y-6 animate-fadeIn",id:"site-log-entry-module",children:[
    // Module Header
    i.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-[#334155] shadow-lg",children:[
      i.jsxs("div",{children:[
        i.jsxs("div",{className:"flex items-center gap-3",children:[
          i.jsx("div",{className:"p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-md shadow-amber-900/30",children:i.jsx(Am,{size:22})}),
          i.jsxs("div",{children:[
            i.jsx("h1",{className:"text-2xl font-black text-white tracking-tight",children:"Site Log Entry"}),
            i.jsx("p",{className:"text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase mt-0.5",children:"Machinery & Fleet Operations • Daily Run Hours & Diesel Log"})
          ]})
        ]}),
        i.jsx("p",{className:"text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed",children:"Log daily equipment meter readings, working hours, site location, customer assignment, and diesel consumption for accurate billing and machine maintenance tracking."})
      ]}),
      i.jsxs("button",{onClick:handleOpenCreate,id:"btn-new-site-log",className:"px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 duration-150 active:scale-95 transition-all cursor-pointer select-none",children:[
        i.jsx(ar,{size:18,strokeWidth:2.5}),
        i.jsx("span",{children:"New Site Log Entry"})
      ]})
    ]}),

    // Top Summary KPI Ribbon
    i.jsxs("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4",id:"site-log-kpis",children:[
      i.jsxs("div",{className:"bg-[#1e293b] p-4 rounded-xl border border-[#334155] relative overflow-hidden",children:[
        i.jsx("div",{className:"absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"}),
        i.jsx("p",{className:"text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider",children:"Total Run Hours"}),
        i.jsxs("h3",{className:"text-2xl font-black text-white font-sans mt-1",children:[totalRunHours.toFixed(1)," ","hrs"]}),
        i.jsx("p",{className:"text-[11px] text-slate-300 font-mono mt-2",children:"Cumulative operating time"})
      ]}),
      i.jsxs("div",{className:"bg-[#1e293b] p-4 rounded-xl border border-[#334155] relative overflow-hidden",children:[
        i.jsx("div",{className:"absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"}),
        i.jsx("p",{className:"text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider",children:"Diesel Consumed"}),
        i.jsxs("h3",{className:"text-2xl font-black text-white font-sans mt-1",children:[totalFuelLiters.toFixed(1)," ","L"]}),
        i.jsx("p",{className:"text-[11px] text-slate-300 font-mono mt-2",children:"Total fuel burn recorded"})
      ]}),
      i.jsxs("div",{className:"bg-[#1e293b] p-4 rounded-xl border border-[#334155] relative overflow-hidden",children:[
        i.jsx("div",{className:"absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400"}),
        i.jsx("p",{className:"text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider",children:"Active Working"}),
        i.jsxs("h3",{className:"text-2xl font-black text-white font-sans mt-1",children:[workingCount," ","Units"]}),
        i.jsx("p",{className:"text-[11px] text-slate-300 font-mono mt-2",children:"Currently active on sites"})
      ]}),
      i.jsxs("div",{className:"bg-[#1e293b] p-4 rounded-xl border border-[#334155] relative overflow-hidden",children:[
        i.jsx("div",{className:"absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-400"}),
        i.jsx("p",{className:"text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider",children:"Total Log Entries"}),
        i.jsxs("h3",{className:"text-2xl font-black text-white font-sans mt-1",children:[filteredLogs.length," ","Logs"]}),
        i.jsx("p",{className:"text-[11px] text-slate-300 font-mono mt-2",children:"Filtered records found"})
      ]})
    ]}),

    // Filter & Search Bar
    i.jsxs("div",{className:"bg-[#1e293b] p-4 rounded-xl border border-[#334155] flex flex-wrap items-center gap-3",children:[
      i.jsxs("div",{className:"relative flex-1 min-w-[200px]",children:[
        i.jsx(ec,{size:16,className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"}),
        i.jsx("input",{
          type:"text",
          value:search,
          onChange:e=>setSearch(e.target.value),
          placeholder:"Search site location, machine, customer or operator...",
          className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
        })
      ]}),
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx("span",{className:"text-xs font-mono text-slate-400 font-medium",children:"Machine:"}),
        i.jsxs("select",{
          value:selectedMachine,
          onChange:e=>setSelectedMachine(e.target.value),
          className:"bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
          children:[
            i.jsx("option",{value:"ALL",children:"All Machines"}),
            machines.map(m=>i.jsx("option",{value:m.id,children:m.plateNumber||m.modelName||m.name||m.id},m.id))
          ]
        })
      ]}),
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx("span",{className:"text-xs font-mono text-slate-400 font-medium",children:"Status:"}),
        i.jsxs("select",{
          value:selectedStatus,
          onChange:e=>setSelectedStatus(e.target.value),
          className:"bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
          children:[
            i.jsx("option",{value:"ALL",children:"All Statuses"}),
            i.jsx("option",{value:"Working",children:"Working"}),
            i.jsx("option",{value:"Idle",children:"Idle"}),
            i.jsx("option",{value:"Maintenance",children:"Maintenance"})
          ]
        })
      ]}),
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx("span",{className:"text-xs font-mono text-slate-400 font-medium",children:"Date:"}),
        i.jsx("input",{
          type:"date",
          value:startDate,
          onChange:e=>setStartDate(e.target.value),
          className:"bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
        }),
        i.jsx("span",{className:"text-slate-400 text-xs",children:"to"}),
        i.jsx("input",{
          type:"date",
          value:endDate,
          onChange:e=>setEndDate(e.target.value),
          className:"bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
        })
      ]}),
      (search||selectedMachine!=="ALL"||selectedStatus!=="ALL"||startDate||endDate)&&i.jsx("button",{
        onClick:()=>{setSearch("");setSelectedMachine("ALL");setSelectedStatus("ALL");setStartDate("");setEndDate("");},
        className:"text-xs text-amber-400 hover:text-amber-300 font-mono underline ml-auto cursor-pointer",
        children:"Reset Filters"
      })
    ]}),

    // Data Table Container
    i.jsx("div",{className:"bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden shadow-xl",children:[
      i.jsx("div",{className:"overflow-x-auto",children:[
        i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3.5 px-4",children:"Date"}),
              i.jsx("th",{className:"py-3.5 px-4",children:"Machine ID / Model"}),
              i.jsx("th",{className:"py-3.5 px-4",children:"Customer & Site Location"}),
              i.jsx("th",{className:"py-3.5 px-4",children:"Operator"}),
              i.jsx("th",{className:"py-3.5 px-4 text-right",children:"Start Hr"}),
              i.jsx("th",{className:"py-3.5 px-4 text-right",children:"End Hr"}),
              i.jsx("th",{className:"py-3.5 px-4 text-right",children:"Run Hrs"}),
              i.jsx("th",{className:"py-3.5 px-4 text-right",children:"Diesel (L)"}),
              i.jsx("th",{className:"py-3.5 px-4 text-center",children:"Status"}),
              i.jsx("th",{className:"py-3.5 px-4 text-right",children:"Actions"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200 font-sans",children:[
            filteredLogs.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:10,className:"py-12 text-center text-slate-400 font-mono",children:"No site log entries found matching your search or filters."})}):
            filteredLogs.map(l=>{
              const st=(l.status||"Working").toLowerCase();
              const badgeClass=st==="working"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/25":
                                st==="idle"?"bg-amber-500/10 text-amber-400 border-amber-500/25":
                                "bg-rose-500/10 text-rose-400 border-rose-500/25";
              return i.jsxs("tr",{key:l.id,className:"hover:bg-[#334155]/25 transition-colors group",children:[
                i.jsx("td",{className:"py-3.5 px-4 font-mono text-slate-300 font-medium whitespace-nowrap",children:l.workDate||l.date||"—"}),
                i.jsxs("td",{className:"py-3.5 px-4 whitespace-nowrap",children:[
                  i.jsxs("div",{className:"flex items-center gap-2",children:[
                    i.jsx("div",{className:"p-1.5 rounded-md bg-blue-500/10 text-blue-400",children:i.jsx(Os,{size:14})}),
                    i.jsxs("div",{children:[
                      i.jsx("p",{className:"font-bold text-white font-mono",children:l.machineNumber||("Machine #"+l.machineId)}),
                      i.jsx("p",{className:"text-[10px] text-slate-400 font-mono",children:"ID: "+l.machineId})
                    ]})
                  ]})
                ]}),
                i.jsxs("td",{className:"py-3.5 px-4",children:[
                  i.jsx("p",{className:"font-semibold text-slate-100",children:l.customerName||"General Site"}),
                  i.jsxs("p",{className:"text-[11px] text-slate-400 flex items-center gap-1 mt-0.5",children:[
                    i.jsx(aO,{size:12,className:"text-amber-400 shrink-0"}),
                    i.jsx("span",{className:"truncate max-w-[200px]",children:l.siteLocation||"—"})
                  ]})
                ]}),
                i.jsxs("td",{className:"py-3.5 px-4 whitespace-nowrap font-mono text-slate-300",children:[
                  i.jsxs("div",{className:"flex items-center gap-1.5",children:[
                    i.jsx(oO,{size:13,className:"text-slate-400"}),
                    l.operatorName||"—"
                  ]})
                ]}),
                i.jsx("td",{className:"py-3.5 px-4 text-right font-mono text-slate-300",children:Number(l.startHours||l.startReading||0).toFixed(1)}),
                i.jsx("td",{className:"py-3.5 px-4 text-right font-mono text-slate-300",children:Number(l.endHours||l.endReading||0).toFixed(1)}),
                i.jsxs("td",{className:"py-3.5 px-4 text-right font-mono font-bold text-amber-400",children:[Number(l.totalHours||0).toFixed(1)," h"]}),
                i.jsxs("td",{className:"py-3.5 px-4 text-right font-mono text-emerald-400",children:[
                  Number(l.dieselConsumed||l.dieselFilledLiters||0)>0?i.jsxs("span",{className:"flex items-center justify-end gap-1",children:[i.jsx(Ab,{size:12}),Number(l.dieselConsumed||l.dieselFilledLiters).toFixed(1)," L"]}):"—"
                ]}),
                i.jsx("td",{className:"py-3.5 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase "+badgeClass,children:l.status||"Working"})}),
                i.jsxs("td",{className:"py-3.5 px-4 text-right whitespace-nowrap",children:[
                  i.jsxs("div",{className:"flex items-center justify-end gap-1.5",children:[
                    i.jsx("button",{
                      onClick:()=>handleOpenView(l),
                      title:"View details",
                      className:"p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer",
                      children:i.jsx(hc,{size:15})
                    }),
                    i.jsx("button",{
                      onClick:()=>handleOpenEdit(l),
                      title:"Edit site log",
                      className:"p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer",
                      children:i.jsx(sy,{size:15})
                    }),
                    i.jsx("button",{
                      onClick:()=>handleOpenDelete(l),
                      title:"Delete entry",
                      className:"p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors cursor-pointer",
                      children:i.jsx(Dl,{size:15})
                    })
                  ]})
                ]})
              ]});
            })
          ]})
        ]})
      ]})
    ]}),

    // CREATE MODAL
    isCreateOpen&&i.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn",children:[
      i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp",children:[
        i.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]/50",children:[
          i.jsxs("div",{className:"flex items-center gap-2.5",children:[
            i.jsx("div",{className:"p-2 rounded-lg bg-amber-500/10 text-amber-400",children:i.jsx(ar,{size:18})}),
            i.jsxs("div",{children:[
              i.jsx("h3",{className:"text-base font-bold text-white",children:"New Site Log Entry"}),
              i.jsx("p",{className:"text-[11px] font-mono text-slate-400",children:"Record machine hours, site location, customer & diesel burn"})
            ]})
          ]}),
          i.jsx("button",{onClick:()=>setIsCreateOpen(!1),className:"p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer",children:i.jsx(Lt,{size:18})})
        ]}),
        i.jsxs("form",{onSubmit:handleSaveCreate,className:"p-6 space-y-4 max-h-[80vh] overflow-y-auto",children:[
          i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Machine ID / Number *"}),
              i.jsxs("select",{
                value:formData.machineId,
                onChange:e=>{
                  const mid=e.target.value;
                  const mach=machines.find(m=>String(m.id)===String(mid));
                  setFormData(prev=>({...prev,machineId:mid,machineNumber:mach?(mach.modelName||mach.name||"")+" ("+(mach.plateNumber||mach.code||mid)+")":prev.machineNumber}));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  i.jsx("option",{value:"",children:"-- Select Machine --"}),
                  machines.map(m=>i.jsx("option",{value:m.id,children:(m.plateNumber||m.modelName||m.name||m.id)+" - "+(m.modelName||"Machine")},m.id))
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Customer Name *"}),
              i.jsxs("select",{
                value:formData.customerId,
                onChange:e=>{
                  const cid=e.target.value;
                  const cust=customers.find(c=>String(c.id)===String(cid));
                  setFormData(prev=>({...prev,customerId:cid,customerName:cust?cust.name:prev.customerName}));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  i.jsx("option",{value:"",children:"-- Select Customer --"}),
                  customers.map(c=>i.jsx("option",{value:c.id,children:c.name+" ("+(c.phone||c.city||"Client")+")"},c.id))
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Site Location *"}),
              i.jsx("input",{
                type:"text",
                value:formData.siteLocation,
                onChange:e=>setFormData(prev=>({...prev,siteLocation:e.target.value})),
                required:!0,
                placeholder:"e.g. Omalur Bypass Section 3, Salem",
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Operator Name *"}),
              i.jsxs("select",{
                value:formData.operatorName,
                onChange:e=>setFormData(prev=>({...prev,operatorName:e.target.value})),
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  i.jsx("option",{value:"",children:"-- Select Operator --"}),
                  operators.map(o=>i.jsx("option",{value:o.name,children:o.name+" ("+(o.phone||"Operator")+")"},o.id||o.name)),
                  i.jsx("option",{value:"P. Murugan",children:"P. Murugan"}),
                  i.jsx("option",{value:"S. Kaliappan",children:"S. Kaliappan"}),
                  i.jsx("option",{value:"M. Saravanan",children:"M. Saravanan"})
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Work Date *"}),
              i.jsx("input",{
                type:"date",
                value:formData.workDate,
                onChange:e=>setFormData(prev=>({...prev,workDate:e.target.value})),
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Work Status *"}),
              i.jsxs("select",{
                value:formData.status,
                onChange:e=>setFormData(prev=>({...prev,status:e.target.value})),
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  i.jsx("option",{value:"Working",children:"Working"}),
                  i.jsx("option",{value:"Idle",children:"Idle"}),
                  i.jsx("option",{value:"Maintenance",children:"Maintenance"})
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Start Time/Hours (Reading) *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.startHours,
                onChange:e=>{
                  const s=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    startHours:s,
                    totalHours:Number(prev.endHours)>=s?Number((Number(prev.endHours)-s).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"End Time/Hours (Reading) *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.endHours,
                onChange:e=>{
                  const ed=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    endHours:ed,
                    totalHours:ed>=Number(prev.startHours)?Number((ed-Number(prev.startHours)).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between",children:[
              i.jsxs("div",{children:[
                i.jsx("p",{className:"text-[10px] font-mono text-slate-400 uppercase",children:"Calculated Running Hours"}),
                i.jsxs("p",{className:"text-lg font-black text-amber-400 font-mono mt-0.5",children:[formData.totalHours," ","hrs"]})
              ]}),
              i.jsx(wb,{size:20,className:"text-amber-400/50"})
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Diesel Consumed (Liters)"}),
              i.jsx("input",{
                type:"number",
                step:"0.5",
                value:formData.dieselConsumed,
                onChange:e=>setFormData(prev=>({...prev,dieselConsumed:Number(e.target.value)||0})),
                placeholder:"e.g. 45.0",
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Work Description / Operations Note"}),
            i.jsx("textarea",{
              rows:2,
              value:formData.workDescription,
              onChange:e=>setFormData(prev=>({...prev,workDescription:e.target.value})),
              placeholder:"e.g. Earth trenching and sub-base grading at north flyover curve",
              className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            })
          ]}),
          i.jsxs("div",{className:"flex items-center justify-end gap-3 pt-3 border-t border-[#334155]",children:[
            i.jsx("button",{
              type:"button",
              onClick:()=>setIsCreateOpen(!1),
              className:"px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer",
              children:"Cancel"
            }),
            i.jsxs("button",{
              type:"submit",
              disabled:loading,
              className:"px-5 py-2 text-xs font-mono font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer select-none",
              children:[
                i.jsx(Ku,{size:14}),
                loading?"Saving Log...":"Save Site Log Entry"
              ]
            })
          ]})
        ]})
      ]})
    ]}),

    // EDIT MODAL
    isEditOpen&&i.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn",children:[
      i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp",children:[
        i.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]/50",children:[
          i.jsxs("div",{className:"flex items-center gap-2.5",children:[
            i.jsx("div",{className:"p-2 rounded-lg bg-amber-500/10 text-amber-400",children:i.jsx(sy,{size:18})}),
            i.jsxs("div",{children:[
              i.jsxs("h3",{className:"text-base font-bold text-white",children:["Edit Site Log Entry #",activeLog&&activeLog.id]}),
              i.jsx("p",{className:"text-[11px] font-mono text-slate-400",children:"Update hours, location, fuel or work notes"})
            ]})
          ]}),
          i.jsx("button",{onClick:()=>setIsEditOpen(!1),className:"p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer",children:i.jsx(Lt,{size:18})})
        ]}),
        i.jsxs("form",{onSubmit:handleSaveEdit,className:"p-6 space-y-4 max-h-[80vh] overflow-y-auto",children:[
          i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Machine ID / Number *"}),
              i.jsxs("select",{
                value:formData.machineId,
                onChange:e=>{
                  const mid=e.target.value;
                  const mach=machines.find(m=>String(m.id)===String(mid));
                  setFormData(prev=>({...prev,machineId:mid,machineNumber:mach?(mach.modelName||mach.name||"")+" ("+(mach.plateNumber||mach.code||mid)+")":prev.machineNumber}));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  machines.map(m=>i.jsx("option",{value:m.id,children:(m.plateNumber||m.modelName||m.name||m.id)+" - "+(m.modelName||"Machine")},m.id))
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Customer Name *"}),
              i.jsxs("select",{
                value:formData.customerId,
                onChange:e=>{
                  const cid=e.target.value;
                  const cust=customers.find(c=>String(c.id)===String(cid));
                  setFormData(prev=>({...prev,customerId:cid,customerName:cust?cust.name:prev.customerName}));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  customers.map(c=>i.jsx("option",{value:c.id,children:c.name+" ("+(c.phone||c.city||"Client")+")"},c.id))
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Site Location *"}),
              i.jsx("input",{
                type:"text",
                value:formData.siteLocation,
                onChange:e=>setFormData(prev=>({...prev,siteLocation:e.target.value})),
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Operator Name *"}),
              i.jsx("input",{
                type:"text",
                value:formData.operatorName,
                onChange:e=>setFormData(prev=>({...prev,operatorName:e.target.value})),
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Work Date *"}),
              i.jsx("input",{
                type:"date",
                value:formData.workDate,
                onChange:e=>setFormData(prev=>({...prev,workDate:e.target.value})),
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Work Status *"}),
              i.jsxs("select",{
                value:formData.status,
                onChange:e=>setFormData(prev=>({...prev,status:e.target.value})),
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500",
                children:[
                  i.jsx("option",{value:"Working",children:"Working"}),
                  i.jsx("option",{value:"Idle",children:"Idle"}),
                  i.jsx("option",{value:"Maintenance",children:"Maintenance"})
                ]
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Start Time/Hours *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.startHours,
                onChange:e=>{
                  const s=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    startHours:s,
                    totalHours:Number(prev.endHours)>=s?Number((Number(prev.endHours)-s).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"End Time/Hours *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.endHours,
                onChange:e=>{
                  const ed=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    endHours:ed,
                    totalHours:ed>=Number(prev.startHours)?Number((ed-Number(prev.startHours)).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between",children:[
              i.jsxs("div",{children:[
                i.jsx("p",{className:"text-[10px] font-mono text-slate-400 uppercase",children:"Calculated Running Hours"}),
                i.jsxs("p",{className:"text-lg font-black text-amber-400 font-mono mt-0.5",children:[formData.totalHours," ","hrs"]})
              ]}),
              i.jsx(wb,{size:20,className:"text-amber-400/50"})
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Diesel Consumed (Liters)"}),
              i.jsx("input",{
                type:"number",
                step:"0.5",
                value:formData.dieselConsumed,
                onChange:e=>setFormData(prev=>({...prev,dieselConsumed:Number(e.target.value)||0})),
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Work Description / Operations Note"}),
            i.jsx("textarea",{
              rows:2,
              value:formData.workDescription,
              onChange:e=>setFormData(prev=>({...prev,workDescription:e.target.value})),
              className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            })
          ]}),
          i.jsxs("div",{className:"flex items-center justify-end gap-3 pt-3 border-t border-[#334155]",children:[
            i.jsx("button",{
              type:"button",
              onClick:()=>setIsEditOpen(!1),
              className:"px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer",
              children:"Cancel"
            }),
            i.jsxs("button",{
              type:"submit",
              disabled:loading,
              className:"px-5 py-2 text-xs font-mono font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer select-none",
              children:[
                i.jsx(Ku,{size:14}),
                loading?"Updating...":"Save Changes"
              ]
            })
          ]})
        ]})
      ]})
    ]}),

    // VIEW MODAL
    isViewOpen&&activeLog&&i.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn",children:[
      i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp",children:[
        i.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]/50",children:[
          i.jsxs("div",{className:"flex items-center gap-2.5",children:[
            i.jsx("div",{className:"p-2 rounded-lg bg-blue-500/10 text-blue-400",children:i.jsx(hc,{size:18})}),
            i.jsxs("div",{children:[
              i.jsxs("h3",{className:"text-base font-bold text-white",children:["Site Log Entry Details #",activeLog.id]}),
              i.jsx("p",{className:"text-[11px] font-mono text-slate-400",children:activeLog.workDate||activeLog.date||"Logged Record"})
            ]})
          ]}),
          i.jsx("button",{onClick:()=>setIsViewOpen(!1),className:"p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer",children:i.jsx(Lt,{size:18})})
        ]}),
        i.jsxs("div",{className:"p-6 space-y-4 text-xs",children:[
          i.jsxs("div",{className:"bg-[#0f172a] p-4 rounded-xl border border-[#334155] space-y-2.5",children:[
            i.jsxs("div",{className:"flex justify-between items-center",children:[
              i.jsx("span",{className:"font-mono text-slate-400",children:"Machine Assignment:"}),
              i.jsx("span",{className:"font-bold font-mono text-white",children:activeLog.machineNumber||("ID #"+activeLog.machineId)})
            ]}),
            i.jsxs("div",{className:"flex justify-between items-center",children:[
              i.jsx("span",{className:"font-mono text-slate-400",children:"Customer Client:"}),
              i.jsx("span",{className:"font-semibold text-slate-200",children:activeLog.customerName||"—"})
            ]}),
            i.jsxs("div",{className:"flex justify-between items-center",children:[
              i.jsx("span",{className:"font-mono text-slate-400",children:"Site Location:"}),
              i.jsx("span",{className:"font-semibold text-amber-400",children:activeLog.siteLocation||"—"})
            ]}),
            i.jsxs("div",{className:"flex justify-between items-center",children:[
              i.jsx("span",{className:"font-mono text-slate-400",children:"Operating Driver:"}),
              i.jsx("span",{className:"text-slate-200 font-mono",children:activeLog.operatorName||"—"})
            ]}),
            i.jsxs("div",{className:"flex justify-between items-center",children:[
              i.jsx("span",{className:"font-mono text-slate-400",children:"Current Status:"}),
              i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase",children:activeLog.status||"Working"})
            ]})
          ]}),
          i.jsxs("div",{className:"grid grid-cols-3 gap-2.5 text-center font-mono",children:[
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155]",children:[
              i.jsx("p",{className:"text-[10px] text-slate-400 uppercase",children:"Start Meter"}),
              i.jsxs("p",{className:"text-sm font-bold text-white mt-0.5",children:[Number(activeLog.startHours||activeLog.startReading||0).toFixed(1),"h"]})
            ]}),
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155]",children:[
              i.jsx("p",{className:"text-[10px] text-slate-400 uppercase",children:"End Meter"}),
              i.jsxs("p",{className:"text-sm font-bold text-white mt-0.5",children:[Number(activeLog.endHours||activeLog.endReading||0).toFixed(1),"h"]})
            ]}),
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155]",children:[
              i.jsx("p",{className:"text-[10px] text-amber-400 font-bold uppercase",children:"Total Run"}),
              i.jsxs("p",{className:"text-sm font-black text-amber-400 mt-0.5",children:[Number(activeLog.totalHours||0).toFixed(1),"h"]})
            ]})
          ]}),
          Number(activeLog.dieselConsumed||activeLog.dieselFilledLiters||0)>0&&i.jsxs("div",{className:"bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-center justify-between font-mono",children:[
            i.jsxs("span",{className:"text-amber-400 flex items-center gap-1.5",children:[i.jsx(Ab,{size:14}),"Diesel Consumption Fuel Burn:"]}),
            i.jsxs("span",{className:"font-bold text-white",children:[Number(activeLog.dieselConsumed||activeLog.dieselFilledLiters).toFixed(1)," Liters"]})
          ]}),
          activeLog.workDescription&&i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155]",children:[
            i.jsx("p",{className:"text-[10px] font-mono text-slate-400 uppercase mb-1",children:"Work Notes & Description"}),
            i.jsx("p",{className:"text-slate-200 leading-relaxed",children:activeLog.workDescription})
          ]})
        ]}),
        i.jsx("div",{className:"flex justify-end p-4 border-t border-[#334155] bg-[#0f172a]/30",children:[
          i.jsx("button",{onClick:()=>setIsViewOpen(!1),className:"px-5 py-2 text-xs font-mono font-bold bg-[#334155] hover:bg-slate-600 text-white rounded-lg cursor-pointer",children:"Close Details"})
        ]})
      ]})
    ]}),

    // DELETE CONFIRMATION MODAL
    isDeleteOpen&&activeLog&&i.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn",children:[
      i.jsxs("div",{className:"bg-[#1e293b] border border-rose-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp p-6 space-y-4",children:[
        i.jsxs("div",{className:"flex items-center gap-3 text-rose-400",children:[
          i.jsx("div",{className:"p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20",children:i.jsx(Hm,{size:24})}),
          i.jsxs("div",{children:[
            i.jsx("h3",{className:"text-base font-bold text-white",children:"Confirm Deletion"}),
            i.jsx("p",{className:"text-[11px] font-mono text-slate-400",children:"Irreversible database purge"})
          ]})
        ]}),
        i.jsxs("p",{className:"text-xs text-slate-300 leading-relaxed",children:[
          "Are you sure you want to permanently delete Site Log Entry #",
          i.jsx("strong",{className:"text-white font-mono",children:activeLog.id}),
          " for ",
          i.jsx("strong",{className:"text-white",children:activeLog.machineNumber||"Machine"}),
          "? This will update equipment totals."
        ]}),
        i.jsxs("div",{className:"flex items-center justify-end gap-3 pt-2",children:[
          i.jsx("button",{onClick:()=>setIsDeleteOpen(!1),className:"px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg cursor-pointer",children:"Cancel"}),
          i.jsxs("button",{onClick:handleConfirmDelete,disabled:loading,className:"px-5 py-2 text-xs font-mono font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer select-none",children:[
            i.jsx(Dl,{size:14}),
            loading?"Deleting...":"Delete Permanently"
          ]})
        ]})
      ]})
    ]})
  ]});
}
`;

// Inject SiteLogModule right above function dde() or function fde()
if (bundle.includes("function dde()")) {
  bundle = bundle.replace("function dde()", siteLogModuleCode + "\nfunction dde()");
  console.log("SUCCESS: Injected SiteLogModule into bundle!");
} else {
  console.warn("Could not find function dde()");
}

// In fde router, add route for /fleet/site-logs and /fleet/*
const oldAccountsRoute = 'i.jsx(yn,{path:"/accounts/*",element:i.jsx(sse,{accounts:tt,transactions:kt,onAddJournal:Yl,loadAllData:Dt,getHeaders:We,showToast:Ee})}),';
const newFleetRoute = 'i.jsx(yn,{path:"/fleet/site-logs",element:i.jsx(SiteLogModule,{machines:lr,customers:ie.filter(z=>z.companyId===C),operators:D.filter(z=>z.companyId===C&&z.branchId===G),siteLogs:[],showToast:Ee,getHeaders:We})}),i.jsx(yn,{path:"/fleet/*",element:i.jsx(SiteLogModule,{machines:lr,customers:ie.filter(z=>z.companyId===C),operators:D.filter(z=>z.companyId===C&&z.branchId===G),siteLogs:[],showToast:Ee,getHeaders:We})}),i.jsx(yn,{path:"/bookings/*",element:i.jsx(hC,{bookings:qr,machines:lr,customers:ie.filter(z=>z.companyId===C),operators:D.filter(z=>z.companyId===C&&z.branchId===G),drivers:te.filter(z=>z.companyId===C&&z.branchId===G),invoices:U,rates:xe,onStartBooking:Da,onCompleteBooking:Pa,onReceivePayment:Kl,onCreateCustomer:z=>er("customers",z)})}),i.jsx(yn,{path:"/bookings",element:i.jsx(hC,{bookings:qr,machines:lr,customers:ie.filter(z=>z.companyId===C),operators:D.filter(z=>z.companyId===C&&z.branchId===G),drivers:te.filter(z=>z.companyId===C&&z.branchId===G),invoices:U,rates:xe,onStartBooking:Da,onCompleteBooking:Pa,onReceivePayment:Kl,onCreateCustomer:z=>er("customers",z)})}),' + oldAccountsRoute;

if (bundle.includes(oldAccountsRoute)) {
  bundle = bundle.replace(oldAccountsRoute, newFleetRoute);
  console.log("SUCCESS: Added /fleet/site-logs and /bookings routes to fde router!");
} else {
  console.warn("Could not find oldAccountsRoute");
}

fs.writeFileSync("public/assets/index-Dbowi09z.js", bundle, "utf8");
console.log("Written updated bundle stage 2!");
