const fs = require('fs');
const path = require('path');

const publicBundle = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
const distBundle = path.join(__dirname, '../dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundle, 'utf8');

// 1. In Sidebar navigation (N6):
// Keep only Booking menu under booking (remove new_booking, active_booking, completed_booking)
// Keep only Generate Invoice menu under billing (remove invoice_list, payment_collection)
const oldNavBookingBilling = `{id:"booking",name:"Bookings",icon:Zz,roles:["ADMIN","MANAGER","OPERATOR"],subItems:[{id:"new_booking",name:"New Booking",targetModule:"bookings-new"},{id:"active_booking",name:"Active Dispatches",targetModule:"bookings-active"},{id:"completed_booking",name:"Completed Jobs",targetModule:"bookings-completed"}]},{id:"billing",name:"Billing & GST",icon:Sb,roles:["ADMIN","MANAGER","ACCOUNTANT"],subItems:[{id:"create_invoice",name:"Generate Invoice",targetModule:"billing-create"},{id:"invoice_list",name:"Invoices Register",targetModule:"billing-list"},{id:"payment_collection",name:"Payment Receipts",targetModule:"billing-payments"}]},`;

const newNavBookingBilling = `{id:"booking",name:"Booking",icon:Zz,roles:["ADMIN","MANAGER","OPERATOR"],subItems:[{id:"booking_menu",name:"Booking",targetModule:"bookings-list"}]},{id:"billing",name:"Billing & GST",icon:Sb,roles:["ADMIN","MANAGER","ACCOUNTANT"],subItems:[{id:"create_invoice",name:"Generate Invoice",targetModule:"billing-create"}]},`;

if (bundle.includes(oldNavBookingBilling)) {
  bundle = bundle.replace(oldNavBookingBilling, newNavBookingBilling);
  console.log('✓ Req 2 & 4: Sidebar updated - kept only Booking and Generate Invoice menus');
} else {
  console.log('• Old NavBookingBilling not found or already patched');
}

// 2. In k(M) module router in N6:
// Ensure bookings-list maps to /booking/list or /bookings
const oldKMap = `M==="fleet-site-logs"||M==="site-logs"?"/fleet/site-logs":M==="dashboard"?"/":`;
const newKMap = `M==="fleet-site-logs"||M==="site-logs"?"/fleet/site-logs":M==="bookings-list"||M==="booking"||M==="bookings-new"||M==="bookings-active"||M==="bookings-completed"?"/booking/list":M==="dashboard"?"/":`;

if (bundle.includes(oldKMap)) {
  bundle = bundle.replace(oldKMap, newKMap);
  console.log('✓ Added bookings-list routing to k(M)');
}

// 3. Make clicking the menu item directly navigate if single subItem:
const oldGroupHeaderClick = `i.jsxs("button",{type:"button",onClick:()=>E(M.id),className:\`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group \${V&&!$?"bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold":"text-slate-300 hover:text-white hover:bg-slate-800/50"}\`,id:\`group-header-\${M.id}\``;
const newGroupHeaderClick = `i.jsxs("button",{type:"button",onClick:()=>{if(M.subItems&&M.subItems.length===1){j(k(M.subItems[0].targetModule));}E(M.id);},className:\`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group \${V&&!$?"bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold":"text-slate-300 hover:text-white hover:bg-slate-800/50"}\`,id:\`group-header-\${M.id}\``;

if (bundle.includes(oldGroupHeaderClick)) {
  bundle = bundle.replace(oldGroupHeaderClick, newGroupHeaderClick);
  console.log('✓ Added direct navigation on single-item group header click');
}

// 4. Role-based screen access filtering in Sidebar (N6):
const oldRoleFilter = `].filter(M=>M.roles.includes((e==null?void 0:e.role)||"ADMIN"))`;
const newRoleFilter = `].filter(M=>{const uRole=((e==null?void 0:e.role)||"ADMIN").toUpperCase();if(uRole==="ADMIN")return true;if(Array.isArray(e==null?void 0:e.allowedScreens)&&e.allowedScreens.length>0){return e.allowedScreens.includes(M.id);}return M.roles.includes(uRole);})`;

if (bundle.includes(oldRoleFilter)) {
  bundle = bundle.replace(oldRoleFilter, newRoleFilter);
  console.log('✓ Req 6: Added role-based screen access filtering in sidebar');
}

fs.writeFileSync(publicBundle, bundle, 'utf8');
if (fs.existsSync(distBundle)) {
  fs.writeFileSync(distBundle, bundle, 'utf8');
}
console.log('Stage 1 successfully applied!');
