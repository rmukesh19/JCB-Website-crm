const fs = require('fs');
const path = require('path');

const publicBundle = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
const distBundle = path.join(__dirname, '../dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundle, 'utf8');
console.log('Initial bundle length:', bundle.length);

// ============================================================================
// REQUIREMENT 1: Remove Starting Start Time and Starting Run-Meter (hrs)
// ============================================================================
const oldTimeAndMeter = `,i.jsxs("div",{className:"space-y-1",children:[i.jsxs("div",{className:"flex items-center justify-between",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Start Time *"}),i.jsx("span",{className:"text-[10px] font-mono text-blue-400 font-bold",children:fmtTime(le.startTime||le.startTime24)})]}),i.jsx("input",{type:"time",required:!0,value:le.startTime24||"",onChange:ee=>{const val=ee.target.value;de(prev=>({...prev,startTime24:val,startTime:fmtTime(val)}));},className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono cursor-pointer"})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Starting Run-Meter (hrs)"}),i.jsx("input",{type:"number",value:le.startHours||0,onChange:ee=>de({...le,startHours:Number(ee.target.value)}),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none font-mono"})]})`;

if (bundle.includes(oldTimeAndMeter)) {
  bundle = bundle.replace(oldTimeAndMeter, '');
  console.log('✓ Req 1: Removed Starting Start Time and Starting Run-Meter fields from Booking modal');
} else {
  console.log('• Req 1: Fields already removed or signature changed');
}

// Ensure dispatch submission default sets startTime and startHours
const oldGeDispatch = 'const ge=ee=>{ee.preventDefault(),d({customerId:parseInt(le.customerId,10),machineId:parseInt(le.machineId,10),operatorId:parseInt(le.operatorId,10),driverId:le.driverId?parseInt(le.driverId,10):null,startHours:Number(le.startHours),startTime:le.startTime||fmtTime(le.startTime24),billingType:le.billingType,billingRate:Number(le.billingRate),siteLocation:le.siteLocation,status:"ACTIVE"}),j(!1)}';
const newGeDispatch = 'const ge=ee=>{ee.preventDefault();const curM=(t.find(m=>m.id===parseInt(le.machineId,10))||{}).currentHours||0;d({customerId:parseInt(le.customerId,10),machineId:parseInt(le.machineId,10),operatorId:parseInt(le.operatorId,10),driverId:le.driverId?parseInt(le.driverId,10):null,startHours:Number(le.startHours||curM),startTime:le.startTime||fmtTime(),billingType:le.billingType,billingRate:Number(le.billingRate),siteLocation:le.siteLocation,status:"ACTIVE"}),j(!1)}';

if (bundle.includes(oldGeDispatch)) {
  bundle = bundle.replace(oldGeDispatch, newGeDispatch);
  console.log('✓ Req 1: Updated dispatch submit handler defaults');
}

// ============================================================================
// REQUIREMENT 5: WhatsApp Promotion – Customer Type: Add Operator option
// ============================================================================
const oldWaSectorSelect = `i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),
        i.jsx("option",{value:"Other",children:"Other"})`;
const newWaSectorSelect = `i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),
        i.jsx("option",{value:"Operator",children:"Operator"}),
        i.jsx("option",{value:"Other",children:"Other"})`;

if (bundle.includes(oldWaSectorSelect)) {
  bundle = bundle.replace(oldWaSectorSelect, newWaSectorSelect);
  console.log('✓ Req 5: Added Operator to WhatsApp Customer Type dropdown');
}

// In CRM Lead customer type select
const oldCrmCustType = `i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),i.jsx("option",{value:"Other",children:"Other"})]`;
const newCrmCustType = `i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),i.jsx("option",{value:"Operator",children:"Operator"}),i.jsx("option",{value:"Other",children:"Other"})]`;

if (bundle.includes(oldCrmCustType)) {
  bundle = bundle.replace(oldCrmCustType, newCrmCustType);
  console.log('✓ Req 5: Added Operator to CRM Customer Type select');
}

// Update WhatsApp sector filtering to support Operator
const oldWaSectorFilter = `const flt=sec==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===sec);`;
const newWaSectorFilter = `const flt=sec==="ALL"?b:b.filter(x=>{const ct=(x.customerType||x.businessType||"").toLowerCase();const r=(x.role||"").toLowerCase();if(sec.toLowerCase()==="operator")return ct==="operator"||r==="operator";return (x.customerType||x.businessType||"Contractor")===sec;});`;

if (bundle.includes(oldWaSectorFilter)) {
  bundle = bundle.replace(oldWaSectorFilter, newWaSectorFilter);
  console.log('✓ Req 5: Enhanced WhatsApp sector filter for Operator');
}

// Update batch recipient text for Operator
const oldSecLeads = `const secLeads=waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector);`;
const newSecLeads = `const secLeads=waSector==="ALL"?b:b.filter(x=>{const ct=(x.customerType||x.businessType||"").toLowerCase();const r=(x.role||"").toLowerCase();if(waSector.toLowerCase()==="operator")return ct==="operator"||r==="operator";return (x.customerType||x.businessType||"Contractor")===waSector;});`;

if (bundle.includes(oldSecLeads)) {
  bundle = bundle.replace(oldSecLeads, newSecLeads);
  console.log('✓ Req 5: Enhanced secLeads resolution for Operator');
}

fs.writeFileSync(publicBundle, bundle, 'utf8');
if (fs.existsSync(distBundle)) {
  fs.writeFileSync(distBundle, bundle, 'utf8');
}
console.log('Step 1 complete. New bundle length:', bundle.length);
