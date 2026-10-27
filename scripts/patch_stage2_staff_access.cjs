const fs = require('fs');
const path = require('path');

const publicBundle = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
const distBundle = path.join(__dirname, '../dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundle, 'utf8');

// 1. Update initial state of $ in ode to include allowedScreens
const oldInit$ = 'loginAllowedTo:"06:00 PM",loginTimeRestrictionEnabled:!1,profileImage:""})';
const newInit$ = 'loginAllowedTo:"06:00 PM",loginTimeRestrictionEnabled:!1,profileImage:"",allowedScreens:["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports","employees","settings"]})';

if (bundle.includes(oldInit$)) {
  bundle = bundle.replace(oldInit$, newInit$);
  console.log('✓ Req 6: Added allowedScreens to initial state $ in ode');
}

// 2. Update role change handler to auto-check role screens while keeping admin customized
const oldRoleSelect = 'children:[i.jsx("label",{className:"text-[10px] font-mono text-slate-400 tracking-wider block mb-1",children:"PLATFORM ROLE (RBAC)"}),i.jsx("select",{value:$.role,onChange:C=>V({...$,role:C.target.value})';
const newRoleSelect = 'children:[i.jsx("label",{className:"text-[10px] font-mono text-slate-400 tracking-wider block mb-1",children:"PLATFORM ROLE (RBAC)"}),i.jsx("select",{value:$.role,onChange:C=>{const nr=C.target.value;const rMap={ADMIN:["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports","employees","settings"],MANAGER:["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports"],ACCOUNTANT:["dashboard","master","billing","accounts","reports"],OPERATOR:["booking","maintenance_expenses"],MARKETING:["dashboard","crm"]};V({...$,role:nr,allowedScreens:rMap[nr]||["booking","maintenance_expenses"]});}';

if (bundle.includes(oldRoleSelect)) {
  bundle = bundle.replace(oldRoleSelect, newRoleSelect);
  console.log('✓ Req 6: Added auto-select screen permissions on role change');
}

// 3. Update ee (edit employee) to preserve or initialize allowedScreens
const oldEe = 'loginAllowedTo:C.loginAllowedTo||"06:00 PM",loginTimeRestrictionEnabled:C.loginTimeRestrictionEnabled||!1,profileImage:C.profileImage||""}),L(!0)';
const newEe = 'loginAllowedTo:C.loginAllowedTo||"06:00 PM",loginTimeRestrictionEnabled:C.loginTimeRestrictionEnabled||!1,profileImage:C.profileImage||"",allowedScreens:Array.isArray(C.allowedScreens)&&C.allowedScreens.length>0?C.allowedScreens:(C.role==="ADMIN"?["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports","employees","settings"]:C.role==="MANAGER"?["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports"]:C.role==="ACCOUNTANT"?["dashboard","master","billing","accounts","reports"]:C.role==="MARKETING"?["dashboard","crm"]:["booking","maintenance_expenses"])}),L(!0)';

if (bundle.includes(oldEe)) {
  bundle = bundle.replace(oldEe, newEe);
  console.log('✓ Req 6: Updated edit employee handler with allowedScreens');
}

// 4. Update ADD NEW EMPLOYEE button to initialize allowedScreens
const oldAddBtn = 'loginAllowedTo:"06:00 PM",loginTimeRestrictionEnabled:!1,profileImage:""}),L(!0)},className:"bg-amber-500 hover:bg-amber-600';
const newAddBtn = 'loginAllowedTo:"06:00 PM",loginTimeRestrictionEnabled:!1,profileImage:"",allowedScreens:["booking","maintenance_expenses"]}),L(!0)},className:"bg-amber-500 hover:bg-amber-600';

if (bundle.includes(oldAddBtn)) {
  bundle = bundle.replace(oldAddBtn, newAddBtn);
  console.log('✓ Req 6: Updated ADD NEW EMPLOYEE button with allowedScreens');
}

// 5. Insert Role-Based Screen Access checkboxes UI right before the modal action buttons
const oldFormEnd = `placeholder:"e.g. 06:00 PM"})]})]})]}),i.jsxs("div",{className:"border-t border-[#334155] pt-4 flex justify-end gap-3.5",children:[i.jsx("button",{type:"button",onClick:()=>L(!1)`;

const screenCheckboxesUI = `placeholder:"e.g. 06:00 PM"})]})]})]}),i.jsxs("div",{className:"border-t border-[#334155] pt-4 mt-2 space-y-3 bg-[#1e293b]/70 p-4 rounded-xl border border-blue-500/30",children:[i.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#334155] pb-2.5",children:[i.jsxs("div",{children:[i.jsx("h4",{className:"text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2",children:"Role-Based Screen Access Permissions"}),i.jsx("p",{className:"text-[10px] text-slate-400 mt-0.5",children:"Select and check the specific screens permitted for this staff profile."})]}),i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("button",{type:"button",onClick:()=>V({...$,allowedScreens:["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports","employees","settings"]}),className:"px-2.5 py-1 text-[10px] font-mono font-bold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded border border-blue-500/30 cursor-pointer",children:"Check All"}),i.jsx("button",{type:"button",onClick:()=>V({...$,allowedScreens:[]}),className:"px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer",children:"Uncheck All"})]})]}),i.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1",children:[{id:"dashboard",name:"Overview Dashboard",badge:"KPIs & Fleet Overview"},{id:"master",name:"Master Settings",badge:"Machines, Rates, Operators"},{id:"crm",name:"CRM & Clients",badge:"Leads & WhatsApp Proposals"},{id:"booking",name:"Booking Module",badge:"Dispatch & Bookings List"},{id:"billing",name:"Billing & GST",badge:"Generate Invoice & Payments"},{id:"maintenance_expenses",name:"Machinery / Fleet",badge:"Site Logs, Diesel & Service"},{id:"accounts",name:"Financial Accounts",badge:"Ledger, Day Book & Vouchers"},{id:"reports",name:"Reports & Analytics",badge:"Dispatches, Fuel & GST"},{id:"employees",name:"Staff & Payroll",badge:"Staff Directory & Duty"},{id:"settings",name:"System Settings",badge:"Company Profile & Config"}].map(scr=>{const isChk=Array.isArray($.allowedScreens)?$.allowedScreens.includes(scr.id):true;return i.jsxs("label",{key:scr.id,className:\`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all \${isChk?"bg-blue-500/10 border-blue-500/40 text-blue-200 shadow-xs":"bg-slate-800/40 border-slate-700/60 text-slate-400 opacity-70 hover:opacity-100"}\`,children:[i.jsx("input",{type:"checkbox",checked:isChk,onChange:ev=>{const cur=Array.isArray($.allowedScreens)?[...$.allowedScreens]:["dashboard","master","crm","booking","billing","maintenance_expenses","accounts","reports","employees","settings"];const updated=ev.target.checked?[...cur,scr.id]:cur.filter(x=>x!==scr.id);V({...$,allowedScreens:updated});},className:"mt-0.5 w-4 h-4 rounded accent-blue-500 cursor-pointer"}),i.jsxs("div",{className:"min-w-0 select-none",children:[i.jsx("span",{className:"text-xs font-semibold block leading-tight",children:scr.name}),i.jsx("span",{className:"text-[10px] text-slate-400 font-mono block",children:scr.badge})]})]});})})]}),i.jsxs("div",{className:"border-t border-[#334155] pt-4 flex justify-end gap-3.5",children:[i.jsx("button",{type:"button",onClick:()=>L(!1)`;

if (bundle.includes(oldFormEnd)) {
  bundle = bundle.replace(oldFormEnd, screenCheckboxesUI);
  console.log('✓ Req 6: Rendered interactive Screen Access Checkboxes in staff modal');
} else {
  console.log('• oldFormEnd not matched');
}

fs.writeFileSync(publicBundle, bundle, 'utf8');
if (fs.existsSync(distBundle)) {
  fs.writeFileSync(distBundle, bundle, 'utf8');
}
console.log('Stage 2 complete!');
