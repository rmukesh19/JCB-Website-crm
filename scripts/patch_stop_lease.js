import fs from 'fs';
import path from 'path';

const publicBundlePath = path.resolve('public/assets/index-Dbowi09z.js');
const distBundlePath = path.resolve('dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundlePath, 'utf8');

// 1. Fix D function (when Stop Lease is clicked on card)
const oldD = 'D=ee=>{const Ae=t.find(Ke=>Ke.id===ee.machineId);const curD=new Date();const curT24=`${String(curD.getHours()).padStart(2,"0")}:${String(curD.getMinutes()).padStart(2,"0")}`;setEndTime24(curT24);setEndTimeState(fmtTime(curT24));R(ee),M(Ae?Ae.currentHours+8:ee.startHours+8)}';
const newD = 'D=ee=>{const Ae=t.find(Ke=>Ke.id===ee.machineId||String(Ke.id)===String(ee.machineId)||(ee.machineName&&Ke.modelName&&ee.machineName.includes(Ke.modelName)));const curD=new Date();const curT24=`${String(curD.getHours()).padStart(2,"0")}:${String(curD.getMinutes()).padStart(2,"0")}`;setEndTime24(curT24);setEndTimeState(fmtTime(curT24));const baseHours=(Ae&&Number(Ae.currentHours))||Number(ee.startHours)||Number(ee.currentHours)||100;R(ee);M(baseHours+8);}';

if (bundle.includes(oldD)) {
  bundle = bundle.replace(oldD, newD);
  console.log('1. Replaced D function with bulletproof baseHours & id matching');
} else {
  console.warn('1. Could not find oldD in bundle');
}

// 2. Fix _ function (when Generate Tax Bill is submitted)
const oldSubmit = '_=ee=>{ee.preventDefault(),P&&(f(P.id,{endHours:L,endTime:endTimeState||fmtTime(endTime24)}),R(null))}';
const newSubmit = '_=ee=>{ee.preventDefault();if(P){const bId=P.id||P._id;const fHours=Number(L)||(P.startHours?Number(P.startHours)+8:8);f(bId,{endHours:fHours,endTime:endTimeState||fmtTime(endTime24)});R(null);}}';

if (bundle.includes(oldSubmit)) {
  bundle = bundle.replace(oldSubmit, newSubmit);
  console.log('2. Replaced _ submit function with safe bId and fallback fHours');
} else {
  console.warn('2. Could not find oldSubmit in bundle');
}

// 3. Fix input number in stop modal
const oldInput = 'i.jsx("input",{type:"number",required:!0,min:P.startHours,value:L,onChange:ee=>M(Number(ee.target.value)),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})';
const newInput = 'i.jsx("input",{type:"number",required:!0,value:L||"",onChange:ee=>M(Number(ee.target.value)),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})';

if (bundle.includes(oldInput)) {
  bundle = bundle.replace(oldInput, newInput);
  console.log('3. Removed restrictive min constraint on Run-Hours input');
} else {
  console.warn('3. Could not find oldInput in bundle');
}

fs.writeFileSync(publicBundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist bundle');
}

console.log('Patch completed successfully!');
