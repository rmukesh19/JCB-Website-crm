import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

console.log("Original bundle length:", bundle.length);

let patchedCount = 0;

// ==========================================
// 1. CRM CUSTOMER TYPE IN IMPORT & VIEW
// ==========================================

// A. CSV Download Template (er)
const oldCsvTemplate = 'CustomerName,CompanyName,MobileNumber,WhatsAppNumber,Email,District,Area,Address,InterestedMachine,RentalRequirement,Budget,LeadSource,Priority\nRajesh Infra,Rajesh Constructions,+91 9840123456,+91 9840123456,rajesh@infra.com,Chennai,Guindy,GST Road OMR IT Corridor,JCB 3DX Super,Hourly,25000,Website,HIGH';
const newCsvTemplate = 'CustomerName,CompanyName,MobileNumber,WhatsAppNumber,Email,District,Area,Address,CustomerType,InterestedMachine,RentalRequirement,Budget,LeadSource,Priority\nRajesh Infra,Rajesh Constructions,+91 9840123456,+91 9840123456,rajesh@infra.com,Chennai,Guindy,GST Road OMR IT Corridor,Contractor,JCB 3DX Super,Hourly,25000,Website,HIGH';

if (bundle.includes(oldCsvTemplate)) {
  bundle = bundle.replace(oldCsvTemplate, newCsvTemplate);
  console.log("SUCCESS 1A: Patched CSV Download Template with CustomerType!");
  patchedCount++;
} else {
  console.warn("WARN 1A: oldCsvTemplate not found");
}

// B. Header Auto-Detection & Row Parser in CSV Import
const oldHeaderDetection = 'tt.includes("street")?dt.address=kt:tt.includes("machine")||tt.includes("interested")?dt.interestedMachine=kt:tt.includes("requirement")||tt.includes("rental")?dt.rentalRequirement=kt:tt.includes("budget")||tt.includes("rate")||tt.includes("amount")?dt.budget=kt:tt.includes("source")?dt.leadSource=kt:tt.includes("priority")&&(dt.priority=kt)';
const newHeaderDetection = 'tt.includes("street")?dt.address=kt:tt.includes("customertype")||tt.includes("customer type")||tt.includes("type")?dt.customerType=kt:tt.includes("machine")||tt.includes("interested")?dt.interestedMachine=kt:tt.includes("requirement")||tt.includes("rental")?dt.rentalRequirement=kt:tt.includes("budget")||tt.includes("rate")||tt.includes("amount")?dt.budget=kt:tt.includes("source")?dt.leadSource=kt:tt.includes("priority")&&(dt.priority=kt)';

if (bundle.includes(oldHeaderDetection)) {
  bundle = bundle.replace(oldHeaderDetection, newHeaderDetection);
  console.log("SUCCESS 1B: Patched CSV Header Detection with CustomerType!");
  patchedCount++;
} else {
  console.warn("WARN 1B: oldHeaderDetection not found");
}

const oldLeadObjParse = 'z={customerName:Ft("customerName",0,`Client ${tt}`),companyName:Ft("companyName",1,""),mobileNumber:Ft("mobileNumber",2,"+91 9000000000"),whatsAppNumber:Ft("whatsAppNumber",3,Ft("mobileNumber",2,"")),email:Ft("email",4,""),district:Ft("district",5,"Chennai"),area:Ft("area",6,""),address:Ft("address",7,""),interestedMachine:Ft("interestedMachine",8,"JCB 3DX Super"),rentalRequirement:Ft("rentalRequirement",9,"Hourly"),budget:Ft("budget",10,""),leadSource:Ft("leadSource",11,"CSV Import"),priority:(Ft("priority",12,"MEDIUM")||"MEDIUM").toUpperCase(),status:"NEW"}';
const newLeadObjParse = 'z={customerName:Ft("customerName",0,`Client ${tt}`),companyName:Ft("companyName",1,""),mobileNumber:Ft("mobileNumber",2,"+91 9000000000"),whatsAppNumber:Ft("whatsAppNumber",3,Ft("mobileNumber",2,"")),email:Ft("email",4,""),district:Ft("district",5,"Chennai"),area:Ft("area",6,""),address:Ft("address",7,""),customerType:Ft("customerType",8,"Contractor"),businessType:Ft("customerType",8,"Contractor"),interestedMachine:Ft("interestedMachine",9,"JCB 3DX Super"),rentalRequirement:Ft("rentalRequirement",10,"Hourly"),budget:Ft("budget",11,""),leadSource:Ft("leadSource",12,"CSV Import"),priority:(Ft("priority",13,"MEDIUM")||"MEDIUM").toUpperCase(),status:"NEW"}';

if (bundle.includes(oldLeadObjParse)) {
  bundle = bundle.replace(oldLeadObjParse, newLeadObjParse);
  console.log("SUCCESS 1C: Patched Lead Object Parser with customerType!");
  patchedCount++;
} else {
  console.warn("WARN 1C: oldLeadObjParse not found");
}

// C. CRM Table View Tag & View Details
const oldCrmTableRowClient = 'i.jsxs("div",{children:[i.jsx("h4",{className:"font-semibold text-white",children:U.customerName}),i.jsxs("p",{className:"text-[11px] text-slate-400 flex items-center gap-1",children:[U.companyName||"Individual Client",U.district?` • ${U.district}`:""]})]})';
const newCrmTableRowClient = 'i.jsxs("div",{children:[i.jsxs("div",{className:"flex items-center gap-1.5",children:[i.jsx("h4",{className:"font-semibold text-white",children:U.customerName}),i.jsx("span",{className:"px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold",children:U.customerType||U.businessType||"Contractor"})]}),i.jsxs("p",{className:"text-[11px] text-slate-400 flex items-center gap-1",children:[U.companyName||"Individual Client",U.district?` • ${U.district}`:""]})]})';

if (bundle.includes(oldCrmTableRowClient)) {
  bundle = bundle.replace(oldCrmTableRowClient, newCrmTableRowClient);
  console.log("SUCCESS 1D: Added Customer Type badge to CRM Lead Table!");
  patchedCount++;
} else {
  console.warn("WARN 1D: oldCrmTableRowClient not found");
}

// ==========================================
// 2. BOOKING SCREEN AVAILABLE MACHINE DROPDOWN
// ==========================================

const oldBookingMachineSelect = 't.filter(ee=>ee.status==="AVAILABLE").map(ee=>i.jsxs("option",{value:ee.id,children:[ee.modelName," (",ee.plateNumber,")"]},ee.id))';
const newBookingMachineSelect = 't.filter(ee=>!ee.status||(ee.status+"").toUpperCase()==="AVAILABLE"||(ee.status+"").toUpperCase()==="ACTIVE"||(ee.status+"").toUpperCase()==="IDLE"||(ee.status+"").toUpperCase()==="OPERATIONAL"||(ee.status+"").toUpperCase()==="RUNNING").map(ee=>i.jsxs("option",{value:ee.id,children:[ee.modelName||ee.name||"Machine"," (",ee.plateNumber||ee.regNumber||ee.code||ee.id,")",ee.status?` - [${ee.status}]`:""]},ee.id))';

if (bundle.includes(oldBookingMachineSelect)) {
  bundle = bundle.replace(oldBookingMachineSelect, newBookingMachineSelect);
  console.log("SUCCESS 2: Fixed Booking Screen Available Machine Dropdown!");
  patchedCount++;
} else {
  console.warn("WARN 2: oldBookingMachineSelect not found");
}

fs.writeFileSync(bundlePath, bundle, 'utf8');
console.log(`Patched ${patchedCount} targets. Bundle length: ${bundle.length}`);
