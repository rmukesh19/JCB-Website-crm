const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Sidebar menu changes: Only Leads and Enquiry
const menuPattern = /{id:"crm",name:"CRM & Clients",icon:ia,roles:\["ADMIN","MANAGER","ACCOUNTANT","OPERATOR"\],subItems:\[.*?\]}/;
const menuReplacement = `{id:"crm",name:"CRM & Clients",icon:ia,roles:["ADMIN","MANAGER","ACCOUNTANT","OPERATOR"],subItems:[{id:"crm_leads",name:"Leads",targetModule:"crm-leads"},{id:"crm_enquiry",name:"Enquiry",targetModule:"crm-leads"}]}`;
content = content.replace(menuPattern, menuReplacement);

// 2. Add Operator to Customer Type in Add Lead form
const customerTypePattern = /i.jsx\("option",\{value:"Builder",children:"Builder"\}\),i.jsx\("option",\{value:"Individual \/ Home Owner",children:"Individual \/ Home Owner"\}\)/;
const customerTypeReplacement = `i.jsx("option",{value:"Builder",children:"Builder"}),i.jsx("option",{value:"Operator",children:"Operator"}),i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"})`;
content = content.replace(customerTypePattern, customerTypeReplacement);

// 3. Add Next Follow-up Date and Time to Add Lead form
const addressPattern = /i.jsxs\("div",\{className:"space-y-1",children:\[i.jsx\("label",\{className:"text-\[11px\] font-mono text-slate-400 font-semibold block",children:"Complete Address \/ Notes"\}\)/;
const addressReplacement = `i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-400 font-semibold block",children:"Next Follow-up Date"}),i.jsx("input",{type:"date",value:G.nextFollowUpDate||"",onChange:U=>he({...G,nextFollowUpDate:U.target.value}),className:"w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none font-mono"})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-400 font-semibold block",children:"Next Follow-up Time"}),i.jsx("input",{type:"time",value:G.nextFollowUpTime||"",onChange:U=>he({...G,nextFollowUpTime:U.target.value}),className:"w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none font-mono"})]}),` + addressPattern.source.replace(/\\/g, '');
content = content.replace(addressPattern, addressReplacement);

// 4. Update "Book ->" to set status COMPLETED when opening New Booking modal?
// Wait, when you click Book, it usually just opens a booking modal. Let's find "Book \u2192". The text might be "Book \u2192".
const bookBtnPattern = />Book \u2192</g;
const bookBtnPatternAlt = />Book -></g;
// Actually, let's just make ALL new bookings from the "Lead" screen default to COMPLETED.
// We can do this by setting the default state of the New Booking form.
// Or we can modify the backend to automatically set `status: 'COMPLETED'` when creating a booking, and generating the invoice. But maybe they only want it for Leads/Enquiries converted to bookings.

fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'), content, 'utf8');
console.log('Frontend patched.');
