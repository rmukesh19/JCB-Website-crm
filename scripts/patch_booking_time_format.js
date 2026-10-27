import fs from 'fs';
import path from 'path';

const publicBundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
const distBundlePath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundlePath, 'utf8');
console.log('Original bundle length:', bundle.length);

// 1. Update Pa to accept an object (containing endTime, endHours, etc.)
const oldPa = 'Pa=async(z,we)=>{w(!0);try{const Oe=await fetch(`/api/bookings/${z}`,{method:"PUT",headers:We(),body:JSON.stringify({endHours:we,status:"COMPLETED"})});';
const newPa = 'Pa=async(z,we)=>{w(!0);try{const payload=typeof we==="object"&&we!==null?we:{endHours:we};const Oe=await fetch(`/api/bookings/${z}`,{method:"PUT",headers:We(),body:JSON.stringify({...payload,status:"COMPLETED"})});';

if (bundle.includes(oldPa)) {
  bundle = bundle.replace(oldPa, newPa);
  console.log('1. Patched Pa signature in fde');
} else {
  console.log('1. Pa signature check skipped or already updated');
}

// 2. Add time states and fmtTime helper to hC component
const oldHcSig = 'function hC({bookings:e=[],machines:t=[],customers:n=[],operators:r=[],drivers:s=[],invoices:o=[],rates:c=[],onStartBooking:d,onCompleteBooking:f,onReceivePayment:m,onCreateCustomer:p}){';

const helperCode = `const fmtTime=(val,fbDate)=>{if(!val&&val!==0&&!fbDate){const d=new Date();let h=d.getHours();const m=String(d.getMinutes()).padStart(2,"0");const ampm=h>=12?"PM":"AM";h=h%12||12;return \`\${String(h).padStart(2,"0")}:\${m} \${ampm}\`;}if(typeof val==="string"){const t=val.trim();if(/^(0?[1-9]|1[0-2]):[0-5][0-9]\\s*(AM|PM|am|pm)$/i.test(t))return t.toUpperCase();if(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t)){const [hS,mS]=t.split(":");let h=parseInt(hS,10);const ampm=h>=12?"PM":"AM";h=h%12||12;return \`\${String(h).padStart(2,"0")}:\${mS} \${ampm}\`;}if(t.includes("T")||(t.includes("-")&&t.includes(":"))){const d=new Date(t);if(!isNaN(d.getTime()))return d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true});}}if(fbDate){const d=new Date(fbDate);if(!isNaN(d.getTime()))return d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true});}const num=Number(val);if(!isNaN(num)&&num>=0&&num<=24){const h=Math.floor(num);const m=Math.round((num-h)*60);const ampm=h>=12?"PM":"AM";const h12=h%12||12;return \`\${String(h12).padStart(2,"0")}:\${String(m).padStart(2,"0")} \${ampm}\`;}if(typeof val==="number"||(typeof val==="string"&&!isNaN(Number(val)))){const d=new Date();let h=d.getHours();const m=String(d.getMinutes()).padStart(2,"0");const ampm=h>=12?"PM":"AM";h=h%12||12;return \`\${String(h).padStart(2,"0")}:\${m} \${ampm}\`;}return String(val||"");};`;

const newHcSig = `${oldHcSig}${helperCode}const [endTime24,setEndTime24]=Y.useState(()=>{const d=new Date();return \`\${String(d.getHours()).padStart(2,"0")}:\${String(d.getMinutes()).padStart(2,"0")}\`;});const [endTimeState,setEndTimeState]=Y.useState(()=>{return fmtTime();});`;

if (bundle.includes(oldHcSig) && !bundle.includes('const fmtTime=')) {
  bundle = bundle.replace(oldHcSig, newHcSig);
  console.log('2. Injected fmtTime and endTime states into hC');
} else {
  console.log('2. hC signature already updated');
}

// 3. Update initial state of le in hC
const oldLeState = 'const[le,de]=Y.useState({customerId:"",machineId:"",operatorId:"",driverId:"",startHours:0,billingType:"HOURLY",billingRate:0,siteLocation:"",status:"ACTIVE"})';
const newLeState = 'const[le,de]=Y.useState(()=>{const d=new Date();const t24=`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;return {customerId:"",machineId:"",operatorId:"",driverId:"",startHours:0,startTime:fmtTime(t24),startTime24:t24,billingType:"HOURLY",billingRate:0,siteLocation:"",status:"ACTIVE"};})';

if (bundle.includes(oldLeState)) {
  bundle = bundle.replace(oldLeState, newLeState);
  console.log('3. Updated initial state of le with startTime & startTime24');
} else {
  console.log('3. le state check skipped or already updated');
}

// 4. Update submit dispatch handler `ge`
const oldGe = 'd({customerId:parseInt(le.customerId,10),machineId:parseInt(le.machineId,10),operatorId:parseInt(le.operatorId,10),driverId:le.driverId?parseInt(le.driverId,10):null,startHours:Number(le.startHours),billingType:le.billingType,billingRate:Number(le.billingRate),siteLocation:le.siteLocation,status:"ACTIVE"})';
const newGe = 'd({customerId:parseInt(le.customerId,10),machineId:parseInt(le.machineId,10),operatorId:parseInt(le.operatorId,10),driverId:le.driverId?parseInt(le.driverId,10):null,startHours:Number(le.startHours),startTime:le.startTime||fmtTime(le.startTime24),billingType:le.billingType,billingRate:Number(le.billingRate),siteLocation:le.siteLocation,status:"ACTIVE"})';

if (bundle.includes(oldGe)) {
  bundle = bundle.replace(oldGe, newGe);
  console.log('4. Updated dispatch submit handler ge with startTime');
} else {
  console.log('4. ge handler check skipped or already updated');
}

// 5. Update Stop Lease open handler `D` and submit handler `_`
const oldD = 'D=ee=>{const Ae=t.find(Ke=>Ke.id===ee.machineId);R(ee),M(Ae?Ae.currentHours+8:ee.startHours+8)},_=ee=>{ee.preventDefault(),P&&(f(P.id,L),R(null))}';
const newD = 'D=ee=>{const Ae=t.find(Ke=>Ke.id===ee.machineId);const curD=new Date();const curT24=`${String(curD.getHours()).padStart(2,"0")}:${String(curD.getMinutes()).padStart(2,"0")}`;setEndTime24(curT24);setEndTimeState(fmtTime(curT24));R(ee),M(Ae?Ae.currentHours+8:ee.startHours+8)},_=ee=>{ee.preventDefault(),P&&(f(P.id,{endHours:L,endTime:endTimeState||fmtTime(endTime24)}),R(null))}';

if (bundle.includes(oldD)) {
  bundle = bundle.replace(oldD, newD);
  console.log('5. Updated D and _ handlers with endTime state and payload');
} else {
  console.log('5. D and _ handlers check skipped or already updated');
}

// 6. Update Active Site Lease Card to show START TIME in proper format
const oldActiveCardTime = 'i.jsxs("div",{className:"border-r border-[#334155]",children:[i.jsx("div",{className:"text-[9px] text-slate-400 uppercase",children:"START HOURS"}),i.jsxs("div",{className:"text-sm font-bold text-slate-100 mt-0.5",children:[ee.startHours," hrs"]})]}),i.jsxs("div",{children:[i.jsx("div",{className:"text-[9px] text-slate-400 uppercase",children:"RATE VALUE"}),i.jsxs("div",{className:"text-sm font-bold text-blue-300 mt-0.5",children:["₹",ee.billingRate,"/unit"]})]})';

const newActiveCardTime = 'i.jsxs("div",{className:"border-r border-[#334155]",children:[i.jsx("div",{className:"text-[9px] text-slate-400 uppercase",children:"START TIME"}),i.jsx("div",{className:"text-sm font-bold text-slate-100 mt-0.5 font-mono",children:fmtTime(ee.startTime||ee.startDate||ee.startHours,ee.startDate)})]}),i.jsxs("div",{children:[i.jsx("div",{className:"text-[9px] text-slate-400 uppercase",children:"RATE VALUE"}),i.jsxs("div",{className:"text-sm font-bold text-blue-300 mt-0.5",children:["₹",ee.billingRate,"/unit"]})]})';

if (bundle.includes(oldActiveCardTime)) {
  bundle = bundle.replace(oldActiveCardTime, newActiveCardTime);
  console.log('6. Updated Active Site Lease Card START TIME display');
} else {
  console.warn('6. Could not find oldActiveCardTime');
}

// 7. Add Start Time input to Dispatch Modal
const oldDispatchBillingRate = 'i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Billing Rate (₹) *"}),i.jsx("input",{type:"number",required:!0,value:le.billingRate,onChange:ee=>de({...le,billingRate:Number(ee.target.value)}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})]})';

const newDispatchBillingRate = `${oldDispatchBillingRate},i.jsxs("div",{className:"space-y-1",children:[i.jsxs("div",{className:"flex items-center justify-between",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Start Time *"}),i.jsx("span",{className:"text-[10px] font-mono text-blue-400 font-bold",children:fmtTime(le.startTime||le.startTime24)})]}),i.jsx("input",{type:"time",required:!0,value:le.startTime24||"",onChange:ee=>{const val=ee.target.value;de(prev=>({...prev,startTime24:val,startTime:fmtTime(val)}));},className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono cursor-pointer"})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Starting Run-Meter (hrs)"}),i.jsx("input",{type:"number",value:le.startHours||0,onChange:ee=>de({...le,startHours:Number(ee.target.value)}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})]})`;

if (bundle.includes(oldDispatchBillingRate)) {
  bundle = bundle.replace(oldDispatchBillingRate, newDispatchBillingRate);
  console.log('7. Added Start Time and Run-Meter inputs to Dispatch modal');
} else {
  console.warn('7. Could not find oldDispatchBillingRate');
}

// 8. Update "Consolidate Work & Bill" modal (Stop Lease) to display START TIME and END TIME with time picker
const oldStopModalBody = 'i.jsxs("div",{className:"p-5 space-y-4 text-xs",children:[i.jsxs("p",{className:"text-slate-300",children:["Ending job for ",i.jsx("strong",{className:"text-blue-400 font-mono",children:Ce(P.machineId)})," at ",P.siteLocation,"."]}),i.jsxs("div",{className:"grid grid-cols-2 gap-3 font-mono text-center bg-[#0f172a] p-3 rounded-lg border border-[#334155]",children:[i.jsxs("div",{children:[i.jsx("div",{className:"text-[10px] text-slate-400 uppercase",children:"START HOURS"}),i.jsxs("div",{className:"text-sm font-bold text-slate-100 mt-1",children:[P.startHours," hrs"]})]}),i.jsxs("div",{children:[i.jsx("div",{className:"text-[10px] text-slate-400 uppercase",children:"LEASE BASIS"}),i.jsx("div",{className:"text-sm font-bold text-blue-400 mt-1",children:P.billingType})]})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 uppercase block",children:"Final Workmeter Run-Hours *"}),i.jsx("input",{type:"number",required:!0,min:P.startHours,value:L,onChange:ee=>M(Number(ee.target.value)),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})]})]})';

const newStopModalBody = 'i.jsxs("div",{className:"p-5 space-y-4 text-xs",children:[i.jsxs("p",{className:"text-slate-300",children:["Ending job for ",i.jsx("strong",{className:"text-blue-400 font-mono",children:Ce(P.machineId)})," at ",P.siteLocation,"."]}),i.jsxs("div",{className:"grid grid-cols-2 gap-3 font-mono text-center bg-[#0f172a] p-3 rounded-lg border border-[#334155]",children:[i.jsxs("div",{children:[i.jsx("div",{className:"text-[10px] text-slate-400 uppercase",children:"START TIME"}),i.jsx("div",{className:"text-sm font-bold text-emerald-400 mt-1",children:fmtTime(P.startTime||P.startDate||P.startHours,P.startDate)})]}),i.jsxs("div",{children:[i.jsx("div",{className:"text-[10px] text-slate-400 uppercase",children:"LEASE BASIS"}),i.jsx("div",{className:"text-sm font-bold text-blue-400 mt-1",children:P.billingType})]})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsxs("div",{className:"flex items-center justify-between",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 uppercase font-semibold block",children:"End Time *"}),i.jsx("span",{className:"text-[10px] font-mono text-emerald-400 font-bold",children:fmtTime(endTimeState||endTime24)})]}),i.jsx("input",{type:"time",required:!0,value:endTime24||"",onChange:ee=>{const val=ee.target.value;setEndTime24(val);setEndTimeState(fmtTime(val));},className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono cursor-pointer"})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 uppercase font-semibold block",children:"Final Workmeter Run-Hours *"}),i.jsx("input",{type:"number",required:!0,min:P.startHours,value:L,onChange:ee=>M(Number(ee.target.value)),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})]})]})';

if (bundle.includes(oldStopModalBody)) {
  bundle = bundle.replace(oldStopModalBody, newStopModalBody);
  console.log('8. Updated Stop Lease modal with START TIME and END TIME inputs');
} else {
  console.warn('8. Could not find oldStopModalBody');
}

fs.writeFileSync(publicBundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist bundle');
}

console.log('Booking time format patch execution complete!');
