import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

console.log("Original bundle length:", bundle.length);

// 1. Insert KPI Summary Bar right before Search & Filter Bar in Bo
const oldSearchFilterBar = 'i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-[#1e293b] border border-[#334155] rounded-xl p-4",children:[';
const newSearchFilterBar = 'e==="machines"&&i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-1",children:['+
'i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between",children:[i.jsxs("div",{children:[i.jsx("p",{className:"text-[10px] font-mono text-slate-400 font-bold uppercase",children:"TOTAL FLEET"}),i.jsx("h3",{className:"text-2xl font-bold text-white font-mono mt-0.5",children:(t||[]).length}),i.jsx("p",{className:"text-[11px] text-indigo-400 font-mono mt-0.5",children:"Registered Machinery"})]}),i.jsx("div",{className:"p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",children:i.jsx(Os,{size:22})})]}),'+
'i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between",children:[i.jsxs("div",{children:[i.jsx("p",{className:"text-[10px] font-mono text-emerald-400 font-bold uppercase",children:"AVAILABLE FLEET"}),i.jsx("h3",{className:"text-2xl font-bold text-emerald-400 font-mono mt-0.5",children:(t||[]).filter(z=>!z.status||(z.status+"").toUpperCase()==="AVAILABLE"||(z.status+"").toUpperCase()==="ACTIVE"||(z.status+"").toUpperCase()==="IDLE").length}),i.jsx("p",{className:"text-[11px] text-slate-400 font-mono mt-0.5",children:"Ready for Dispatch"})]}),i.jsx("div",{className:"p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",children:i.jsx(ia,{size:22})})]}),'+
'i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between",children:[i.jsxs("div",{children:[i.jsx("p",{className:"text-[10px] font-mono text-sky-400 font-bold uppercase",children:"RUNNING ON SITE"}),i.jsx("h3",{className:"text-2xl font-bold text-sky-400 font-mono mt-0.5",children:(t||[]).filter(z=>(z.status+"").toUpperCase()==="RUNNING"||(z.status+"").toUpperCase()==="ON_DUTY").length}),i.jsx("p",{className:"text-[11px] text-slate-400 font-mono mt-0.5",children:"Active Dispatches"})]}),i.jsx("div",{className:"p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20",children:i.jsx(Gm,{size:22})})]}),'+
'i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between",children:[i.jsxs("div",{children:[i.jsx("p",{className:"text-[10px] font-mono text-amber-400 font-bold uppercase",children:"UNDER SERVICE"}),i.jsx("h3",{className:"text-2xl font-bold text-amber-400 font-mono mt-0.5",children:(t||[]).filter(z=>(z.status+"").toUpperCase()==="MAINTENANCE"||(z.status+"").toUpperCase()==="OUT_OF_SERVICE").length}),i.jsx("p",{className:"text-[11px] text-slate-400 font-mono mt-0.5",children:"Maintenance & Repairs"})]}),i.jsx("div",{className:"p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20",children:i.jsx(js,{size:22})})]})'+
']}),'+
oldSearchFilterBar;

if (bundle.includes(oldSearchFilterBar)) {
  bundle = bundle.replace(oldSearchFilterBar, newSearchFilterBar);
  console.log("SUCCESS 1: Added Top Summary KPI Bar to Machine Master!");
} else {
  console.warn("WARN 1: oldSearchFilterBar not found");
}

// 2. Machine Grid Cards View container right after Search/Filter bar
const oldTableMasterWrapper = 'i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-sm",children:[i.jsx("div",{className:"overflow-x-auto",children:i.jsxs("table",{className:"w-full text-left border-collapse",id:`table-master-${e}`';

const newTableMasterWrapper = 'e==="machines"&&viewMode==="grid"?i.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5",children:de.length===0?i.jsx("div",{className:"col-span-full bg-[#1e293b] border border-[#334155] rounded-xl p-12 text-center text-slate-400 font-mono",children:"No machines found matching your filters."}):de.map(D=>{'+
'const st=(D.status||"AVAILABLE").toUpperCase();'+
'const stBg=st==="AVAILABLE"||st==="ACTIVE"?"bg-emerald-500/15 text-emerald-300 border-emerald-500/40":st==="RUNNING"||st==="ON_DUTY"?"bg-sky-500/15 text-sky-300 border-sky-500/40":st==="MAINTENANCE"?"bg-amber-500/15 text-amber-300 border-amber-500/40":"bg-rose-500/15 text-rose-300 border-rose-500/40";'+
'const hrRate=Number(D.hourlyRate||D.defaultRatePerHour||1400);'+
'const dyRate=Number(D.dailyRate||(hrRate*8));'+
'const wkRate=Number(D.weeklyRate||(dyRate*6));'+
'const moRate=Number(D.monthlyRate||(dyRate*25));'+
'const curHrs=Number(D.currentHours||D.currentMeterReading||0);'+
'const dueHrs=Number(D.nextServiceDueHours||250);'+
'return i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] hover:border-blue-500/40 rounded-2xl p-5 shadow-lg space-y-4 transition-all hover:-translate-y-0.5 relative overflow-hidden group",children:['+
'i.jsxs("div",{className:"flex items-start justify-between gap-2 border-b border-[#334155] pb-3",children:['+
'i.jsxs("div",{className:"flex items-center gap-3",children:['+
'i.jsx("div",{className:"w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0 font-bold",children:i.jsx(Os,{size:20})}),'+
'i.jsxs("div",{children:['+
'i.jsx("h3",{className:"text-sm font-bold text-white font-sans tracking-tight",children:D.modelName||D.name||"JCB Machine"}),'+
'i.jsxs("div",{className:"flex items-center gap-2 mt-0.5 font-mono text-[11px]",children:['+
'i.jsx("span",{className:"text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20",children:D.plateNumber||D.regNumber||"TN-30-BD-4492"}),'+
'D.code&&i.jsx("span",{className:"text-slate-400 text-[10px]",children:`#${D.code}`})'+
']})'+
']})'+
']}),'+
'i.jsx("span",{className:`px-2.5 py-1 text-[10px] font-mono rounded-full font-bold uppercase tracking-wider border shrink-0 ${stBg}`,children:D.status||"AVAILABLE"})'+
']}),'+
'i.jsxs("div",{className:"grid grid-cols-2 gap-2 bg-[#0f172a] p-3 rounded-xl border border-[#334155]/60 text-xs font-mono",children:['+
'i.jsxs("div",{children:[i.jsx("span",{className:"text-[10px] text-slate-400 block",children:"HOURLY RATE"}),i.jsxs("span",{className:"font-bold text-emerald-400 text-sm",children:["₹",hrRate.toLocaleString("en-IN"),"/hr"]})]}),'+
'i.jsxs("div",{children:[i.jsx("span",{className:"text-[10px] text-slate-400 block",children:"DAILY RATE"}),i.jsxs("span",{className:"font-bold text-teal-400 text-sm",children:["₹",dyRate.toLocaleString("en-IN"),"/day"]})]}),'+
'i.jsxs("div",{children:[i.jsx("span",{className:"text-[10px] text-slate-400 block",children:"WEEKLY RATE"}),i.jsxs("span",{className:"font-semibold text-slate-300",children:["₹",wkRate.toLocaleString("en-IN")]})]}),'+
'i.jsxs("div",{children:[i.jsx("span",{className:"text-[10px] text-slate-400 block",children:"MONTHLY LEASE"}),i.jsxs("span",{className:"font-semibold text-slate-300",children:["₹",moRate.toLocaleString("en-IN")]})]}'+
']}),'+
'i.jsxs("div",{className:"space-y-1.5 font-mono text-xs",children:['+
'i.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:['+
'i.jsx("span",{className:"text-slate-400",children:"Current Meter Reading:"}),'+
'i.jsxs("span",{className:"font-bold text-white",children:[curHrs.toLocaleString("en-IN")," hrs"]})'+
']}),'+
'i.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:['+
'i.jsx("span",{className:"text-slate-400",children:"Next Service Interval:"}),'+
'i.jsxs("span",{className:"text-amber-400 font-semibold",children:[dueHrs," hrs limit"]})'+
']}),'+
'i.jsx("div",{className:"w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700 mt-1",children:i.jsx("div",{className:"bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full",style:{width:`${Math.min(100,(curHrs%500)/5)}%`}})})'+
']}),'+
'(D.chassisNumber||D.engineNumber)&&i.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#334155]/40",children:['+
'D.chassisNumber&&i.jsxs("span",{children:["Chassis: ",i.jsx("span",{className:"text-slate-300",children:D.chassisNumber})]}),'+
'D.engineNumber&&i.jsxs("span",{children:["Engine: ",i.jsx("span",{className:"text-slate-300",children:D.engineNumber})]})'+
']}),'+
'i.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2 border-t border-[#334155]",children:['+
'i.jsxs("button",{type:"button",onClick:()=>$(D),className:"px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer",children:[i.jsx(Yo,{size:13}),"Edit"]}),'+
'i.jsxs("button",{type:"button",onClick:()=>V(D),className:"px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer",children:[i.jsx(Lt,{size:13}),"Delete"]})'+
']})'+
']});})}):'+
oldTableMasterWrapper;

if (bundle.includes(oldTableMasterWrapper)) {
  bundle = bundle.replace(oldTableMasterWrapper, newTableMasterWrapper);
  console.log("SUCCESS 2: Integrated Machine Master Grid Cards View!");
} else {
  console.warn("WARN 2: oldTableMasterWrapper not found");
}

fs.writeFileSync(bundlePath, bundle, 'utf8');
console.log("Saved stage 3 machine master redesign. Bundle length:", bundle.length);
