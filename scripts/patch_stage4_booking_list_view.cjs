const fs = require('fs');
const path = require('path');

const publicBundle = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
const distBundle = path.join(__dirname, '../dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundle, 'utf8');

// 1. Inject state and helper methods into hC right after endTimeState
const anchorEndTime = 'const [endTimeState,setEndTimeState]=Y.useState(()=>{return fmtTime();});';

const newStatesAndHandlers = `const [endTimeState,setEndTimeState]=Y.useState(()=>{return fmtTime();});
  const [bkgList,setBkgList]=Y.useState(()=>Array.isArray(e)?e:[]);
  Y.useEffect(()=>{if(Array.isArray(e)&&e.length>0)setBkgList(e);},[e]);
  const [viewingBkg,setViewingBkg]=Y.useState(null);
  const [editingBkg,setEditingBkg]=Y.useState(null);
  const [editBkgForm,setEditBkgForm]=Y.useState({});
  const [siteLogBkg,setSiteLogBkg]=Y.useState(null);
  const [siteLogBkgForm,setSiteLogBkgForm]=Y.useState({});
  const [bkgFilterStatus,setBkgFilterStatus]=Y.useState("ALL");
  const [bkgSearch,setBkgSearch]=Y.useState("");

  const getBkgHdrs=()=>{
    const tok=localStorage.getItem("jcb360_token");
    return tok?{"Content-Type":"application/json","Authorization":tok}:{"Content-Type":"application/json"};
  };

  const handleOpenView=bItem=>setViewingBkg(bItem);

  const handleOpenEdit=bItem=>{
    setEditingBkg(bItem);
    setEditBkgForm({
      ...bItem,
      customerId:bItem.customerId||"",
      machineId:bItem.machineId||"",
      operatorId:bItem.operatorId||"",
      driverId:bItem.driverId||"",
      billingRate:bItem.billingRate||bItem.ratePerHour||2800,
      billingType:bItem.billingType||"HOURLY",
      siteLocation:bItem.siteLocation||"",
      status:bItem.status||"ACTIVE",
      totalAmount:bItem.totalAmount||0,
      advanceReceived:bItem.advanceReceived||0
    });
  };

  const handleSaveEdit=async ev=>{
    ev.preventDefault();
    try{
      const bId=editingBkg.id||editingBkg._id;
      const res=await fetch("/api/bookings/"+bId,{
        method:"PUT",
        headers:getBkgHdrs(),
        body:JSON.stringify(editBkgForm)
      });
      if(res.ok){
        const updated=await res.json();
        setBkgList(prev=>prev.map(x=>(x.id===bId||x._id===bId?{...x,...updated}:x)));
        setEditingBkg(null);
        alert("Booking updated successfully!");
      }else{
        alert("Failed to update booking.");
      }
    }catch(err){
      alert("Error updating booking: "+err.message);
    }
  };

  const handleDeleteBooking=async bItem=>{
    const bId=bItem.id||bItem._id;
    const bNum=bItem.bookingNumber||("BKG-"+bId);
    if(window.confirm("Are you sure you want to delete Booking "+bNum+"? This action cannot be undone.")){
      try{
        const res=await fetch("/api/bookings/"+bId,{
          method:"DELETE",
          headers:getBkgHdrs()
        });
        if(res.ok){
          setBkgList(prev=>prev.filter(x=>(x.id||x._id)!==bId));
          alert("Booking "+bNum+" deleted successfully!");
        }else{
          alert("Failed to delete booking.");
        }
      }catch(err){
        alert("Error deleting booking: "+err.message);
      }
    }
  };

  const handleOpenReceipt=bItem=>{
    const foundInv=o.find(inv=>inv.bookingId===bItem.id||String(inv.bookingId)===String(bItem.id));
    if(foundInv){
      k(foundInv);
      S(!0);
    }else{
      const calcSub=Number(bItem.totalAmount||(bItem.billingRate?bItem.billingRate*8:10000));
      const gst=calcSub*0.18;
      const grand=calcSub+gst;
      const adv=Number(bItem.advanceReceived||0);
      const out=Math.max(0,grand-adv);
      const synthInv={
        id:bItem.id,
        invoiceNumber:"REC-2026-"+String(bItem.id).padStart(4,"0"),
        bookingId:bItem.id,
        customerId:bItem.customerId,
        customerName:Te(bItem.customerId),
        invoiceDate:bItem.startDate||new Date().toISOString().split("T")[0],
        subtotal:calcSub,
        totalTax:gst,
        grandTotal:grand,
        paidAmount:adv,
        outstandingAmount:out,
        status:out<=0?"PAID":(adv>0?"PARTIAL":"ISSUED")
      };
      k(synthInv);
      S(!0);
    }
  };

  const calcBkgWorkingHours=(sTime,eTime,bHrs)=>{
    if(!sTime||!eTime)return 0;
    const parseM=t=>{
      const m=String(t).trim().match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)?$/i);
      if(!m)return null;
      let h=parseInt(m[1],10);
      const min=parseInt(m[2],10);
      const ap=m[3]?m[3].toUpperCase():null;
      if(ap==="PM"&&h<12)h+=12;
      if(ap==="AM"&&h===12)h=0;
      return h*60+min;
    };
    const sm=parseM(sTime);
    const em=parseM(eTime);
    const brk=Number(bHrs)||0;
    if(sm!==null&&em!==null){
      let diff=em-sm;
      if(diff<0)diff+=24*60;
      return Math.max(0,Number(((diff/60)-brk).toFixed(2)));
    }
    return 0;
  };

  const handleOpenSiteLog=bItem=>{
    setSiteLogBkg(bItem);
    const mObj=t.find(m=>m.id===bItem.machineId)||{};
    const cObj=n.find(c=>c.id===bItem.customerId)||{};
    const opObj=r.find(op=>op.id===bItem.operatorId)||{};
    const curM=Number(mObj.currentHours||bItem.startHours||3840);
    setSiteLogBkgForm({
      machineId:bItem.machineId||"",
      machineNumber:(mObj.modelName||mObj.name||"Machine")+" ("+(mObj.plateNumber||mObj.code||bItem.machineId)+")",
      customerId:bItem.customerId||"",
      customerName:cObj.name||Te(bItem.customerId),
      operatorName:opObj.name||"P. Murugan",
      siteLocation:bItem.siteLocation||"",
      workDate:new Date().toISOString().split("T")[0],
      startTime:"09:00",
      endTime:"18:00",
      breakTime:1.0,
      totalWorkingHours:8.0,
      startMeterReading:curM,
      endMeterReading:curM+8,
      totalRunHours:8.0,
      dieselConsumed:35.0,
      status:"Working",
      workDescription:"Site operations for "+(cObj.name||"Client")+" at "+(bItem.siteLocation||"Main Site")
    });
  };

  const handleSaveSiteLog=async ev=>{
    ev.preventDefault();
    try{
      const res=await fetch("/api/site-logs",{
        method:"POST",
        headers:getBkgHdrs(),
        body:JSON.stringify(siteLogBkgForm)
      });
      if(res.ok){
        setSiteLogBkg(null);
        alert("Site Log Entry recorded successfully for this booking!");
      }else{
        alert("Failed to save site log entry.");
      }
    }catch(err){
      alert("Error saving site log: "+err.message);
    }
  };

  const filteredBookingsList=Y.useMemo(()=>{
    return bkgList.filter(bItem=>{
      const bStatus=(bItem.status||"ACTIVE").toUpperCase();
      if(bkgFilterStatus!=="ALL"&&bStatus!==bkgFilterStatus)return false;
      if(!bkgSearch)return true;
      const q=bkgSearch.toLowerCase();
      const bNum=(bItem.bookingNumber||("BKG-"+bItem.id)).toLowerCase();
      const cust=(Te(bItem.customerId)||"").toLowerCase();
      const mach=(Ce(bItem.machineId)||"").toLowerCase();
      const loc=(bItem.siteLocation||"").toLowerCase();
      return bNum.includes(q)||cust.includes(q)||mach.includes(q)||loc.includes(q);
    });
  },[bkgList,bkgFilterStatus,bkgSearch]);`;

if (bundle.includes(anchorEndTime)) {
  bundle = bundle.replace(anchorEndTime, newStatesAndHandlers);
  console.log('✓ Req 2: Injected Bookings list state, filter, and 5 action handlers into hC');
} else {
  console.log('• anchorEndTime not found');
}

// 2. Replace active-dispatches-grid with the List View Table
const startGrid = bundle.indexOf(`b==="active"&&i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",id:"active-dispatches-grid"`);
const endGrid = bundle.indexOf(`b==="invoices"&&i.jsx("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-sm",id:"invoices-ledger"`);

if (startGrid !== -1 && endGrid !== -1) {
  const newBookingsListView = `b==="active"&&i.jsxs("div",{className:"space-y-4",id:"bookings-list-module",children:[
    i.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1e293b] p-3.5 rounded-xl border border-[#334155] shadow-xs",children:[
      i.jsxs("div",{className:"relative flex-1",children:[
        i.jsx(ec,{className:"absolute left-3 top-2.5 text-slate-400",size:15}),
        i.jsx("input",{type:"text",placeholder:"Search by Booking ID, Customer Client, Machinery, Site...",value:bkgSearch,onChange:ev=>setBkgSearch(ev.target.value),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"})
      ]}),
      i.jsxs("select",{value:bkgFilterStatus,onChange:ev=>setBkgFilterStatus(ev.target.value),className:"bg-[#0f172a] border border-[#334155] text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-blue-500 font-mono font-semibold cursor-pointer",children:[
        i.jsx("option",{value:"ALL",children:"All Bookings (Active & Completed)"}),
        i.jsx("option",{value:"ACTIVE",children:"Active Dispatches Only"}),
        i.jsx("option",{value:"COMPLETED",children:"Completed Jobs Only"})
      ]})
    ]}),
    i.jsx("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-sm",id:"bookings-list-table",children:i.jsx("div",{className:"overflow-x-auto",children:i.jsxs("table",{className:"w-full text-left border-collapse",children:[
      i.jsx("thead",{children:i.jsxs("tr",{className:"bg-slate-800 border-b border-[#334155] text-[11px] font-mono tracking-wider text-slate-200 uppercase",children:[
        i.jsx("th",{className:"py-3.5 px-4",children:"Booking ID"}),
        i.jsx("th",{className:"py-3.5 px-3",children:"Date & Time"}),
        i.jsx("th",{className:"py-3.5 px-3",children:"Customer Client"}),
        i.jsx("th",{className:"py-3.5 px-3",children:"Machinery Unit"}),
        i.jsx("th",{className:"py-3.5 px-3",children:"Duty Operator"}),
        i.jsx("th",{className:"py-3.5 px-3",children:"Site Location"}),
        i.jsx("th",{className:"py-3.5 px-3",children:"Rate & Model"}),
        i.jsx("th",{className:"py-3.5 px-3 text-center",children:"Status"}),
        i.jsx("th",{className:"py-3.5 px-4 text-right",children:"Actions"})
      ]})}),
      i.jsx("tbody",{className:"divide-y divide-[#334155] text-xs text-slate-300",children:[
        filteredBookingsList.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:9,className:"py-12 text-center text-slate-400 font-mono",children:'No bookings found. Click "Dispatch Machinery" to initiate a new job.'})}):
        filteredBookingsList.map(ee=>{
          const mach=t.find(m=>m.id===ee.machineId);
          const cust=n.find(c=>c.id===ee.customerId);
          const oper=r.find(op=>op.id===ee.operatorId);
          const isAct=(ee.status||"ACTIVE").toUpperCase()==="ACTIVE";
          return i.jsxs("tr",{key:ee.id||ee._id,className:"hover:bg-slate-800/60 transition-colors",children:[
            i.jsxs("td",{className:"py-3 px-4 font-mono font-bold text-blue-400 whitespace-nowrap",children:[
              ee.bookingNumber||("BKG-2026-"+String(ee.id).padStart(4,"0")),
              isAct&&i.jsx("span",{className:"ml-2 inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping",title:"Active Lease"})
            ]}),
            i.jsxs("td",{className:"py-3 px-3 font-mono text-slate-300 whitespace-nowrap",children:[
              i.jsx("div",{children:ee.startDate||new Date().toISOString().split("T")[0]}),
              i.jsx("div",{className:"text-[10px] text-slate-400",children:fmtTime(ee.startTime||ee.startDate)})
            ]}),
            i.jsxs("td",{className:"py-3 px-3 font-semibold text-slate-100",children:[
              i.jsx("div",{children:(cust&&cust.name)||Te(ee.customerId)||"Contract Client"}),
              cust&&cust.company&&i.jsx("div",{className:"text-[10px] text-slate-400 font-normal",children:cust.company})
            ]}),
            i.jsxs("td",{className:"py-3 px-3",children:[
              i.jsx("div",{className:"font-medium text-white",children:(mach&&mach.modelName)||(mach&&mach.name)||Ce(ee.machineId)}),
              i.jsx("div",{className:"text-[10px] font-mono text-blue-300",children:(mach&&mach.plateNumber)||(mach&&mach.regNumber)||""})
            ]}),
            i.jsx("td",{className:"py-3 px-3 text-slate-200",children:(oper&&oper.name)||"Duty Operator"}),
            i.jsx("td",{className:"py-3 px-3 text-slate-300 max-w-[160px] truncate",title:ee.siteLocation||"General Site",children:ee.siteLocation||"General Site"}),
            i.jsxs("td",{className:"py-3 px-3 font-mono",children:[
              i.jsxs("div",{className:"text-slate-100 font-semibold",children:["₹",Number(ee.billingRate||ee.ratePerHour||0).toLocaleString()]}),
              i.jsx("div",{className:"text-[10px] text-slate-400 uppercase",children:ee.billingType||"Hourly"})
            ]}),
            i.jsx("td",{className:"py-3 px-3 text-center",children:i.jsx("span",{className:\`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full \${isAct?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-slate-700 text-slate-300 border border-slate-600"}\`,children:isAct?"ACTIVE":"COMPLETED"})}),
            i.jsx("td",{className:"py-3 px-4 text-right whitespace-nowrap",children:i.jsxs("div",{className:"flex justify-end items-center gap-1.5",children:[
              i.jsx("button",{onClick:()=>handleOpenView(ee),className:"p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition-all cursor-pointer",title:"View Booking Details",id:\`btn-view-booking-\${ee.id}\`,children:i.jsx(hc,{size:14})}),
              i.jsx("button",{onClick:()=>handleOpenEdit(ee),className:"p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/20 transition-all cursor-pointer",title:"Edit Booking",id:\`btn-edit-booking-\${ee.id}\`,children:i.jsx(sy,{size:14})}),
              i.jsx("button",{onClick:()=>handleDeleteBooking(ee),className:"p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all cursor-pointer",title:"Delete Booking",id:\`btn-delete-booking-\${ee.id}\`,children:i.jsx(Dl,{size:14})}),
              i.jsx("button",{onClick:()=>handleOpenReceipt(ee),className:"p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all cursor-pointer",title:"Receipt / Tax Invoice",id:\`btn-receipt-booking-\${ee.id}\`,children:i.jsx(Sb,{size:14})}),
              i.jsx("button",{onClick:()=>handleOpenSiteLog(ee),className:"p-1.5 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500 hover:text-white border border-teal-500/20 transition-all cursor-pointer",title:"Add Site Log Entry",id:\`btn-sitelog-booking-\${ee.id}\`,children:i.jsx(Am,{size:14})})
            ]})})
          ]});
        })
      ]})
    ]})})
  ]}),`;

  bundle = bundle.slice(0, startGrid) + newBookingsListView + bundle.slice(endGrid);
  console.log('✓ Req 2: Replaced card grid with complete Bookings List View with 5 action icons');
} else {
  console.log('• Could not locate active-dispatches-grid bounds');
}

// 3. Render View Modal, Edit Modal, and Site Log Entry Modal right before the end of hC
const endOfHcModalsAnchor = `H&&i.jsx("div",{className:"fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:i.jsxs("form",{onSubmit:ve,className:"bg-[#1e293b] border border-[#334155] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"`;

const newBookingActionModals = `viewingBkg&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4",children:i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4",children:[
    i.jsxs("div",{className:"bg-slate-800 border-b border-[#334155] px-5 py-4 flex justify-between items-center",children:[
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx(hc,{size:18,className:"text-blue-400"}),
        i.jsx("h3",{className:"text-sm font-bold text-white uppercase tracking-wider",children:"Booking Details & Job Record"})
      ]}),
      i.jsx("button",{type:"button",onClick:()=>setViewingBkg(null),className:"text-slate-400 hover:text-white cursor-pointer",children:i.jsx(Lt,{size:18})})
    ]}),
    i.jsxs("div",{className:"p-5 space-y-3.5 text-xs",children:[
      i.jsxs("div",{className:"flex justify-between items-center bg-[#0f172a] p-3 rounded-xl border border-[#334155]",children:[
        i.jsxs("div",{children:[
          i.jsx("span",{className:"text-[10px] text-slate-400 font-mono uppercase block",children:"BOOKING NUMBER"}),
          i.jsx("span",{className:"text-sm font-bold font-mono text-blue-400",children:viewingBkg.bookingNumber||("BKG-"+viewingBkg.id)})
        ]}),
        i.jsx("span",{className:\`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full \${(viewingBkg.status||"ACTIVE")==="ACTIVE"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-slate-700 text-slate-300 border border-slate-600"}\`,children:viewingBkg.status||"ACTIVE"})
      ]}),
      i.jsxs("div",{className:"grid grid-cols-2 gap-3 bg-[#0f172a] p-3 rounded-xl border border-[#334155]",children:[
        i.jsxs("div",{children:[
          i.jsx("span",{className:"text-[10px] text-slate-400 uppercase font-mono block",children:"CUSTOMER CLIENT"}),
          i.jsx("p",{className:"font-semibold text-white mt-0.5",children:Te(viewingBkg.customerId)}),
          i.jsx("p",{className:"text-[10px] text-slate-400 mt-0.5",children:viewingBkg.siteLocation||"Main Site"})
        ]}),
        i.jsxs("div",{children:[
          i.jsx("span",{className:"text-[10px] text-slate-400 uppercase font-mono block",children:"MACHINERY & OPERATOR"}),
          i.jsx("p",{className:"font-semibold text-white mt-0.5",children:Ce(viewingBkg.machineId)}),
          i.jsx("p",{className:"text-[10px] text-blue-300 font-mono mt-0.5",children:"Operator: "+((r.find(op=>op.id===viewingBkg.operatorId)||{}).name||"Murugan")})
        ]})
      ]}),
      i.jsxs("div",{className:"grid grid-cols-3 gap-2 bg-[#0f172a] p-3 rounded-xl border border-[#334155] text-center font-mono",children:[
        i.jsxs("div",{children:[
          i.jsx("span",{className:"text-[9px] text-slate-400 uppercase block",children:"LEASE MODEL"}),
          i.jsx("span",{className:"font-bold text-white block mt-0.5",children:viewingBkg.billingType||"Hourly"})
        ]}),
        i.jsxs("div",{children:[
          i.jsx("span",{className:"text-[9px] text-slate-400 uppercase block",children:"RATE VALUE"}),
          i.jsxs("span",{className:"font-bold text-amber-400 block mt-0.5",children:["₹",viewingBkg.billingRate||viewingBkg.ratePerHour||0]})
        ]}),
        i.jsxs("div",{children:[
          i.jsx("span",{className:"text-[9px] text-slate-400 uppercase block",children:"RUN HOURS"}),
          i.jsxs("span",{className:"font-bold text-emerald-400 block mt-0.5",children:[viewingBkg.totalHours||8," hrs"]})
        ]})
      ]}),
      i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-xl border border-[#334155] space-y-1 font-mono text-[11px]",children:[
        i.jsxs("div",{className:"flex justify-between text-slate-400",children:[i.jsx("span",{children:"Total Contract Value:"}),i.jsxs("span",{className:"text-white font-bold",children:["₹",Number(viewingBkg.totalAmount||(viewingBkg.billingRate*8)||0).toLocaleString()]})]}),
        i.jsxs("div",{className:"flex justify-between text-emerald-400",children:[i.jsx("span",{children:"Advance Received:"}),i.jsxs("span",{children:["₹",Number(viewingBkg.advanceReceived||0).toLocaleString()]})]}),
        i.jsxs("div",{className:"flex justify-between text-rose-400 font-bold border-t border-[#334155] pt-1",children:[i.jsx("span",{children:"Balance Due:"}),i.jsxs("span",{children:["₹",Number(viewingBkg.balanceDue||viewingBkg.totalAmount||0).toLocaleString()]})]})
      ]})
    ]}),
    i.jsxs("div",{className:"bg-slate-800 border-t border-[#334155] px-5 py-3.5 flex justify-end gap-2.5",children:[
      i.jsx("button",{type:"button",onClick:()=>setViewingBkg(null),className:"bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#334155] text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer",children:"Close"}),
      i.jsxs("button",{type:"button",onClick:()=>{const b=viewingBkg;setViewingBkg(null);handleOpenReceipt(b);},className:"bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow",children:[i.jsx(Sb,{size:14}),"Tax Invoice / Receipt"]})
    ]})
  ]}),

  editingBkg&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4",children:i.jsxs("form",{onSubmit:handleSaveEdit,className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4",children:[
    i.jsxs("div",{className:"bg-slate-800 border-b border-[#334155] px-5 py-4 flex justify-between items-center",children:[
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx(sy,{size:18,className:"text-amber-400"}),
        i.jsxs("h3",{className:"text-sm font-bold text-white uppercase tracking-wider",children:["Edit Booking #",editingBkg.bookingNumber||editingBkg.id]})
      ]}),
      i.jsx("button",{type:"button",onClick:()=>setEditingBkg(null),className:"text-slate-400 hover:text-white cursor-pointer",children:i.jsx(Lt,{size:18})})
    ]}),
    i.jsxs("div",{className:"p-5 space-y-3.5 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5",children:[
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Customer Client *"}),
        i.jsxs("select",{value:editBkgForm.customerId,onChange:ev=>setEditBkgForm({...editBkgForm,customerId:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",children:[
          n.map(cust=>i.jsx("option",{value:cust.id,children:cust.name},cust.id))
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Machinery Unit *"}),
        i.jsxs("select",{value:editBkgForm.machineId,onChange:ev=>setEditBkgForm({...editBkgForm,machineId:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",children:[
          t.map(mach=>i.jsxs("option",{value:mach.id,children:[mach.modelName||mach.name," (",mach.plateNumber||mach.id,")"]},mach.id))
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Assign Duty Operator *"}),
        i.jsxs("select",{value:editBkgForm.operatorId,onChange:ev=>setEditBkgForm({...editBkgForm,operatorId:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",children:[
          r.map(op=>i.jsx("option",{value:op.id,children:op.name},op.id))
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Transit Trailer Driver"}),
        i.jsxs("select",{value:editBkgForm.driverId||"",onChange:ev=>setEditBkgForm({...editBkgForm,driverId:ev.target.value}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none",children:[
          i.jsx("option",{value:"",children:"-- No Trailer (Self Driven) --"}),
          s.map(dr=>i.jsx("option",{value:dr.id,children:dr.name},dr.id))
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Lease Model"}),
        i.jsxs("select",{value:editBkgForm.billingType,onChange:ev=>setEditBkgForm({...editBkgForm,billingType:ev.target.value}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono",children:[
          i.jsx("option",{value:"HOURLY",children:"HOURLY BASIS"}),
          i.jsx("option",{value:"DAILY",children:"DAILY BASIS"}),
          i.jsx("option",{value:"WEEKLY",children:"WEEKLY BASIS"}),
          i.jsx("option",{value:"MONTHLY",children:"MONTHLY BASIS"}),
          i.jsx("option",{value:"CONTRACT",children:"CONTRACT FIXED RATE"})
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Billing Rate (₹) *"}),
        i.jsx("input",{type:"number",value:editBkgForm.billingRate||"",onChange:ev=>setEditBkgForm({...editBkgForm,billingRate:Number(ev.target.value)}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Booking Status *"}),
        i.jsxs("select",{value:editBkgForm.status,onChange:ev=>setEditBkgForm({...editBkgForm,status:ev.target.value}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono font-bold",children:[
          i.jsx("option",{value:"ACTIVE",children:"ACTIVE"}),
          i.jsx("option",{value:"COMPLETED",children:"COMPLETED"})
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Advance Received (₹)"}),
        i.jsx("input",{type:"number",value:editBkgForm.advanceReceived||"",onChange:ev=>setEditBkgForm({...editBkgForm,advanceReceived:Number(ev.target.value)}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none font-mono"})
      ]}),
      i.jsxs("div",{className:"sm:col-span-2 space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Site Location / Destination Address *"}),
        i.jsx("input",{type:"text",value:editBkgForm.siteLocation||"",onChange:ev=>setEditBkgForm({...editBkgForm,siteLocation:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-amber-500 focus:outline-none"})
      ]})
    ]}),
    i.jsxs("div",{className:"bg-slate-800 border-t border-[#334155] px-5 py-3.5 flex justify-end gap-2.5",children:[
      i.jsx("button",{type:"button",onClick:()=>setEditingBkg(null),className:"bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#334155] text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer",children:"Cancel"}),
      i.jsxs("button",{type:"submit",className:"bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow",children:[i.jsx(Ku,{size:14}),"Save Changes"]})
    ]})
  ]}),

  siteLogBkg&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4",children:i.jsxs("form",{onSubmit:handleSaveSiteLog,className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4",children:[
    i.jsxs("div",{className:"bg-slate-800 border-b border-[#334155] px-5 py-4 flex justify-between items-center",children:[
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx(Am,{size:18,className:"text-teal-400"}),
        i.jsxs("h3",{className:"text-sm font-bold text-white uppercase tracking-wider",children:["Record Site Log Entry - ",siteLogBkgForm.machineNumber||"Machine"]})
      ]}),
      i.jsx("button",{type:"button",onClick:()=>setSiteLogBkg(null),className:"text-slate-400 hover:text-white cursor-pointer",children:i.jsx(Lt,{size:18})})
    ]}),
    i.jsxs("div",{className:"p-5 space-y-3.5 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5",children:[
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Machine *"}),
        i.jsx("input",{type:"text",readOnly:!0,value:siteLogBkgForm.machineNumber||"",className:"w-full bg-[#0f172a] border border-[#334155] text-slate-300 text-xs rounded-lg p-2.5 font-mono cursor-not-allowed"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Customer Client *"}),
        i.jsx("input",{type:"text",readOnly:!0,value:siteLogBkgForm.customerName||"",className:"w-full bg-[#0f172a] border border-[#334155] text-slate-300 text-xs rounded-lg p-2.5 cursor-not-allowed"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Operator *"}),
        i.jsx("input",{type:"text",value:siteLogBkgForm.operatorName||"",onChange:ev=>setSiteLogBkgForm({...siteLogBkgForm,operatorName:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-teal-500 focus:outline-none"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Work Date *"}),
        i.jsx("input",{type:"date",value:siteLogBkgForm.workDate||"",onChange:ev=>setSiteLogBkgForm({...siteLogBkgForm,workDate:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-teal-500 focus:outline-none font-mono"})
      ]}),
      i.jsxs("div",{className:"sm:col-span-2 bg-[#0f172a] p-3 rounded-xl border border-blue-500/30 space-y-2.5",children:[
        i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-1.5",children:[
          i.jsx("span",{className:"text-[11px] font-mono font-bold uppercase text-blue-400",children:"1. Work Time & Working Hours Calculation"}),
          i.jsx("span",{className:"text-[10px] text-slate-400 font-mono",children:"Working Hours = Ending Time - Start Time - Break"})
        ]}),
        i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2.5",children:[
          i.jsxs("div",{children:[
            i.jsx("label",{className:"text-[10px] font-mono text-slate-300 font-semibold block mb-1",children:"Start Time *"}),
            i.jsx("input",{type:"time",value:siteLogBkgForm.startTime||"09:00",onChange:ev=>{const s=ev.target.value;setSiteLogBkgForm(p=>({...p,startTime:s,totalWorkingHours:calcBkgWorkingHours(s,p.endTime||"18:00",p.breakTime||1)}));},required:!0,className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500"})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"text-[10px] font-mono text-slate-300 font-semibold block mb-1",children:"Break Time (hrs) *"}),
            i.jsx("input",{type:"number",step:"0.25",value:siteLogBkgForm.breakTime===0||siteLogBkgForm.breakTime==="0"?0:(siteLogBkgForm.breakTime||1),onChange:ev=>{const b=Number(ev.target.value)||0;setSiteLogBkgForm(p=>({...p,breakTime:b,totalWorkingHours:calcBkgWorkingHours(p.startTime||"09:00",p.endTime||"18:00",b)}));},required:!0,className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500"})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"text-[10px] font-mono text-slate-300 font-semibold block mb-1",children:"Ending Time *"}),
            i.jsx("input",{type:"time",value:siteLogBkgForm.endTime||"18:00",onChange:ev=>{const e=ev.target.value;setSiteLogBkgForm(p=>({...p,endTime:e,totalWorkingHours:calcBkgWorkingHours(p.startTime||"09:00",e,p.breakTime||1)}));},required:!0,className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500"})
          ]})
        ]}),
        i.jsxs("div",{className:"bg-blue-500/10 border border-blue-500/30 rounded p-2 flex justify-between items-center",children:[
          i.jsx("span",{className:"text-[10px] font-mono text-blue-300",children:"Calculated Total Working Hours:"}),
          i.jsxs("span",{className:"font-bold text-sm text-blue-400 font-mono",children:[siteLogBkgForm.totalWorkingHours||8," hrs"]})
        ]})
      ]}),
      i.jsxs("div",{className:"sm:col-span-2 bg-[#0f172a] p-3 rounded-xl border border-amber-500/30 space-y-2.5",children:[
        i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-1.5",children:[
          i.jsx("span",{className:"text-[11px] font-mono font-bold uppercase text-amber-400",children:"2. Meter Readings & Total Run Hours"}),
          i.jsx("span",{className:"text-[10px] text-slate-400 font-mono",children:"Run Hours = Ending Meter - Starting Meter"})
        ]}),
        i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2.5",children:[
          i.jsxs("div",{children:[
            i.jsx("label",{className:"text-[10px] font-mono text-slate-300 font-semibold block mb-1",children:"Starting Meter Reading *"}),
            i.jsx("input",{type:"number",step:"0.1",value:siteLogBkgForm.startMeterReading||"",onChange:ev=>{const s=Number(ev.target.value)||0;setSiteLogBkgForm(p=>{const ed=Number(p.endMeterReading)||0;return {...p,startMeterReading:s,startHours:s,totalRunHours:ed>=s?Number((ed-s).toFixed(2)):0,totalHours:ed>=s?Number((ed-s).toFixed(2)):0};});},required:!0,className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-amber-500"})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"text-[10px] font-mono text-slate-300 font-semibold block mb-1",children:"Ending Meter Reading *"}),
            i.jsx("input",{type:"number",step:"0.1",value:siteLogBkgForm.endMeterReading||"",onChange:ev=>{const ed=Number(ev.target.value)||0;setSiteLogBkgForm(p=>{const s=Number(p.startMeterReading)||0;return {...p,endMeterReading:ed,endHours:ed,totalRunHours:ed>=s?Number((ed-s).toFixed(2)):0,totalHours:ed>=s?Number((ed-s).toFixed(2)):0};});},required:!0,className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-amber-500"})
          ]})
        ]}),
        i.jsxs("div",{className:"bg-amber-500/10 border border-amber-500/30 rounded p-2 flex justify-between items-center",children:[
          i.jsx("span",{className:"text-[10px] font-mono text-amber-300",children:"Calculated Total Run Hours:"}),
          i.jsxs("span",{className:"font-bold text-sm text-amber-400 font-mono",children:[siteLogBkgForm.totalRunHours||0," hrs"]})
        ]})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Diesel Consumed (Liters)"}),
        i.jsx("input",{type:"number",step:"0.5",value:siteLogBkgForm.dieselConsumed||"",onChange:ev=>setSiteLogBkgForm({...siteLogBkgForm,dieselConsumed:Number(ev.target.value)||0}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-teal-500 focus:outline-none font-mono"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Work Status"}),
        i.jsxs("select",{value:siteLogBkgForm.status,onChange:ev=>setSiteLogBkgForm({...siteLogBkgForm,status:ev.target.value}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-teal-500 focus:outline-none",children:[
          i.jsx("option",{value:"Working",children:"Working"}),
          i.jsx("option",{value:"Idle",children:"Idle"}),
          i.jsx("option",{value:"Maintenance",children:"Maintenance"})
        ]})
      ]}),
      i.jsxs("div",{className:"sm:col-span-2 space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Site Location / Destination Address *"}),
        i.jsx("input",{type:"text",value:siteLogBkgForm.siteLocation||"",onChange:ev=>setSiteLogBkgForm({...siteLogBkgForm,siteLocation:ev.target.value}),required:!0,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-teal-500 focus:outline-none"})
      ]}),
      i.jsxs("div",{className:"sm:col-span-2 space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Work Description / Operations Note"}),
        i.jsx("textarea",{rows:2,value:siteLogBkgForm.workDescription||"",onChange:ev=>setSiteLogBkgForm({...siteLogBkgForm,workDescription:ev.target.value}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-teal-500 focus:outline-none"})
      ]})
    ]}),
    i.jsxs("div",{className:"bg-slate-800 border-t border-[#334155] px-5 py-3.5 flex justify-end gap-2.5",children:[
      i.jsx("button",{type:"button",onClick:()=>setSiteLogBkg(null),className:"bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#334155] text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer",children:"Cancel"}),
      i.jsxs("button",{type:"submit",className:"bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow",children:[i.jsx(Ku,{size:14}),"Save Site Log Entry"]})
    ]})
  ]}),

  ${endOfHcModalsAnchor}`;

if (bundle.includes(endOfHcModalsAnchor)) {
  bundle = bundle.replace(endOfHcModalsAnchor, newBookingActionModals);
  console.log('✓ Req 2: Injected View, Edit, and Site Log Entry action modals into hC');
} else {
  console.log('• endOfHcModalsAnchor not found');
}

fs.writeFileSync(publicBundle, bundle, 'utf8');
if (fs.existsSync(distBundle)) {
  fs.writeFileSync(distBundle, bundle, 'utf8');
}
console.log('Stage 4 complete!');
