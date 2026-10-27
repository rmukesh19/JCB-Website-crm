import fs from "fs";

let bundle = fs.readFileSync("public/assets/index-Dbowi09z.js", "utf8");

console.log("Original bundle length:", bundle.length);

// 1. Sidebar Menu Item: Add "Site Log Entry" under Machinery / Fleet in N6
// Find subItems of maintenance_expenses
const targetMaintenanceSubitems = 'id:"maintenance_expenses",name:"Machinery / Fleet",icon:Am,roles:["ADMIN","MANAGER","ACCOUNTANT","OPERATOR"],subItems:[';
if (bundle.includes(targetMaintenanceSubitems)) {
  const newMaintenanceSubitems = 'id:"maintenance_expenses",name:"Machinery / Fleet",icon:Am,roles:["ADMIN","MANAGER","ACCOUNTANT","OPERATOR"],subItems:[{id:"site_log_entry",name:"Site Log Entry",targetModule:"fleet-site-logs"},';
  bundle = bundle.replace(targetMaintenanceSubitems, newMaintenanceSubitems);
  console.log("Added Site Log Entry to sidebar subItems!");
} else {
  console.warn("Could not find targetMaintenanceSubitems");
}

// Ensure k in N6 maps fleet-site-logs to /fleet/site-logs
const targetK = 'k=M=>M==="dashboard"?"/":';
if (bundle.includes(targetK)) {
  bundle = bundle.replace(targetK, 'k=M=>M==="fleet-site-logs"||M==="site-logs"?"/fleet/site-logs":M==="dashboard"?"/":');
  console.log("Updated k in N6 for fleet-site-logs!");
} else {
  console.warn("Could not find targetK in N6");
}

// 2. Dashboard Navigation Triggers in mC:
// Convert all 9 KPI cards into the exact requested navigation triggers
const oldKpiInquiry = 'onClick:()=>b("marketing-leads"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#06b6d4]/70 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-today-inquiry"';
const newKpiInquiry = 'onClick:()=>b("/crm/leads"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#06b6d4]/70 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-today-inquiry"';
if (bundle.includes(oldKpiInquiry)) {
  bundle = bundle.replace(oldKpiInquiry, newKpiInquiry);
  console.log("Updated Today Inquiry click to /crm/leads!");
} else {
  console.warn("Could not find oldKpiInquiry");
}

const oldKpiFollowups = 'onClick:()=>b("marketing-pipeline"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#f43f5e]/70 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-follow-ups"';
const newKpiFollowups = 'onClick:()=>b("/crm/leads"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#f43f5e]/70 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-follow-ups"';
if (bundle.includes(oldKpiFollowups)) {
  bundle = bundle.replace(oldKpiFollowups, newKpiFollowups);
  console.log("Updated Follow-ups click to /crm/leads!");
} else {
  console.warn("Could not find oldKpiFollowups");
}

const oldKpiCash = 'onClick:()=>b("accounts-vouchers"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#10b981]/70 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-cash-in-hand"';
const newKpiCash = 'onClick:()=>b("/accounts/vouchers"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#10b981]/70 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-cash-in-hand"';
if (bundle.includes(oldKpiCash)) {
  bundle = bundle.replace(oldKpiCash, newKpiCash);
  console.log("Updated Cash In Hand click to /accounts/vouchers!");
} else {
  console.warn("Could not find oldKpiCash");
}

const oldKpiBank = 'onClick:()=>b("accounts-chart"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#8b5cf6]/70 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-bank-balance"';
const newKpiBank = 'onClick:()=>b("/accounts/vouchers"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#8b5cf6]/70 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-bank-balance"';
if (bundle.includes(oldKpiBank)) {
  bundle = bundle.replace(oldKpiBank, newKpiBank);
  console.log("Updated Bank Balance click to /accounts/vouchers!");
} else {
  console.warn("Could not find oldKpiBank");
}

const oldKpiLowStock = 'onClick:()=>b("maintenance-inventory"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#f59e0b]/70 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-low-stock"';
const newKpiLowStock = 'onClick:()=>b("/maintenance/inventory"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#f59e0b]/70 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] rounded-xl p-4 shadow-md hover:-translate-y-0.5 duration-200 transition-all cursor-pointer select-none group",id:"kpi-low-stock"';
if (bundle.includes(oldKpiLowStock)) {
  bundle = bundle.replace(oldKpiLowStock, newKpiLowStock);
  console.log("Updated Low Stock click to /maintenance/inventory!");
} else {
  console.warn("Could not find oldKpiLowStock");
}

const oldKpiRunning = 'onClick:()=>b("bookings-active"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#22c55e]/70 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
const newKpiRunning = 'onClick:()=>b("/master/machines"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#22c55e]/70 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
if (bundle.includes(oldKpiRunning)) {
  bundle = bundle.replace(oldKpiRunning, newKpiRunning);
  console.log("Updated Running Machines click to /master/machines!");
} else {
  console.warn("Could not find oldKpiRunning");
}

const oldKpiAvailable = 'onClick:()=>b("machines"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#0284c7]/70 hover:shadow-[0_0_25px_rgba(2,132,199,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
const newKpiAvailable = 'onClick:()=>b("/master/machines"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#0284c7]/70 hover:shadow-[0_0_25px_rgba(2,132,199,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
if (bundle.includes(oldKpiAvailable)) {
  bundle = bundle.replace(oldKpiAvailable, newKpiAvailable);
  console.log("Updated Available Machines click to /master/machines!");
} else {
  console.warn("Could not find oldKpiAvailable");
}

const oldKpiBookings = 'onClick:()=>b("bookings-new"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#6366f1]/70 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
const newKpiBookings = 'onClick:()=>b("/bookings"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#6366f1]/70 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
if (bundle.includes(oldKpiBookings)) {
  bundle = bundle.replace(oldKpiBookings, newKpiBookings);
  console.log("Updated Today Bookings click to /bookings!");
} else {
  console.warn("Could not find oldKpiBookings");
}

const oldKpiRevenue = 'onClick:()=>b("billing-list"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#eab308]/70 hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
const newKpiRevenue = 'onClick:()=>b("/accounts/vouchers"),className:"relative overflow-hidden bg-[#1e293b] border border-[#334155] hover:border-[#eab308]/70 hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] rounded-xl p-5 shadow-sm hover:-translate-y-1 duration-300 transition-all cursor-pointer select-none active:scale-95"';
if (bundle.includes(oldKpiRevenue)) {
  bundle = bundle.replace(oldKpiRevenue, newKpiRevenue);
  console.log("Updated Today Revenue click to /accounts/vouchers!");
} else {
  console.warn("Could not find oldKpiRevenue");
}

// Also update b in mC:
const oldBMC = 'function mC({machines:e=[],bookings:t=[],invoices:n=[],dieselRecords:r=[],maintenanceRecords:s=[],expenses:o=[],accounts:c=[],transactions:d=[],spareParts:f=[],customers:m=[],language:p,onNavigate:x}){const b=se=>{x&&x(se)},';
const newBMC = 'function mC({machines:e=[],bookings:t=[],invoices:n=[],dieselRecords:r=[],maintenanceRecords:s=[],expenses:o=[],accounts:c=[],transactions:d=[],spareParts:f=[],customers:m=[],language:p,onNavigate:x}){const b=se=>{x&&x(se)},';
// b in mC already forwards se to x!

// In tb, support /inventory -> parts
const oldTbMemo = 'B.includes("/parts")?"parts"';
const newTbMemo = 'B.includes("/parts")||B.includes("/inventory")?"parts"';
if (bundle.includes(oldTbMemo)) {
  bundle = bundle.replace(oldTbMemo, newTbMemo);
  console.log("Updated tb for /inventory route!");
}

// In fde, update f and x to support direct paths:
const oldF = 'f=z=>z==="dashboard"?"/":';
const newF = 'f=z=>typeof z==="string"&&z.startsWith("/")?z:z==="fleet-site-logs"||z==="site-logs"?"/fleet/site-logs":z==="dashboard"?"/":';
if (bundle.includes(oldF)) {
  bundle = bundle.replace(oldF, newF);
  console.log("Updated f in fde for direct paths and fleet-site-logs!");
}

const oldX = 'x=z=>{c(f(z))}';
const newX = 'x=z=>{typeof z==="string"&&z.startsWith("/")?c(z):c(f(z))}';
if (bundle.includes(oldX)) {
  bundle = bundle.replace(oldX, newX);
  console.log("Updated x in fde to support direct paths!");
}

fs.writeFileSync("public/assets/index-Dbowi09z.js", bundle, "utf8");
console.log("Saved stage 1 changes!");
