import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

console.log("Original bundle length:", bundle.length);
let patchedCount = 0;

// ==========================================
// 1. ADD CUSTOMER TYPE TO CSV IMPORT PREVIEW TABLE & CRM TABLE
// ==========================================

// Import Preview Modal Table Header: Add "Customer Type" right after "Phone"
const oldImportPreviewThead = 'i.jsx("th",{className:"p-2",children:"Phone"}),i.jsx("th",{className:"p-2",children:"Machine"})';
const newImportPreviewThead = 'i.jsx("th",{className:"p-2",children:"Phone"}),i.jsx("th",{className:"p-2 text-indigo-300",children:"Customer Type"}),i.jsx("th",{className:"p-2",children:"Machine"})';

if (bundle.includes(oldImportPreviewThead)) {
  bundle = bundle.replace(oldImportPreviewThead, newImportPreviewThead);
  console.log("SUCCESS 1: Added Customer Type to CSV Import preview table header!");
  patchedCount++;
}

// Import Preview Modal Table Row: Add Customer Type td right after Phone td
const oldImportPreviewTbody = 'i.jsx("td",{className:"p-2",children:U.mobileNumber}),i.jsx("td",{className:"p-2 text-indigo-400",children:U.interestedMachine})';
const newImportPreviewTbody = 'i.jsx("td",{className:"p-2",children:U.mobileNumber}),i.jsx("td",{className:"p-2 text-indigo-300 font-semibold",children:U.customerType||U.businessType||"Contractor"}),i.jsx("td",{className:"p-2 text-indigo-400",children:U.interestedMachine})';

if (bundle.includes(oldImportPreviewTbody)) {
  bundle = bundle.replace(oldImportPreviewTbody, newImportPreviewTbody);
  console.log("SUCCESS 2: Added Customer Type to CSV Import preview table row!");
  patchedCount++;
}

// CRM Lead Table Client Column: Display Customer Type badge right next to customer name
const oldCrmTableClientCell = 'i.jsxs("div",{children:[i.jsx("div",{children:U.customerName}),U.companyName&&i.jsxs("div",{className:"text-[10px] text-slate-400 font-mono font-normal flex items-center gap-1",children:[i.jsx(js,{size:10}),U.companyName]})]})';
const newCrmTableClientCell = 'i.jsxs("div",{children:[i.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap",children:[i.jsx("span",{className:"font-semibold text-white",children:U.customerName}),i.jsx("span",{className:"px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold shrink-0"},U.customerType||U.businessType||"Contractor")]),U.companyName&&i.jsxs("div",{className:"text-[10px] text-slate-400 font-mono font-normal flex items-center gap-1",children:[i.jsx(js,{size:10}),U.companyName]})]})';

if (bundle.includes(oldCrmTableClientCell)) {
  bundle = bundle.replace(oldCrmTableClientCell, newCrmTableClientCell);
  console.log("SUCCESS 3: Added Customer Type badge to CRM Lead Table!");
  patchedCount++;
}

// ==========================================
// 2. PERFORMANCE OPTIMIZATION: NON-BLOCKING BACKGROUND SYNC IN CRUD HANDLERS
// ==========================================

const oldErSync = 'Ee("Record registered successfully in central repository.","SUCCESS"),await Dt(),ze';
const newErSync = 'Ee("Record registered successfully in central repository.","SUCCESS"),setTimeout(()=>Dt(),50),ze';

if (bundle.includes(oldErSync)) {
  bundle = bundle.replace(oldErSync, newErSync);
  console.log("SUCCESS 4: Optimized er (onCreate) with non-blocking background sync!");
  patchedCount++;
}

const oldRaSync = 'if(nt.ok)Ee("Record updated successfully.","SUCCESS"),await Dt();else';
const newRaSync = 'if(nt.ok)Ee("Record updated successfully.","SUCCESS"),setTimeout(()=>Dt(),50);else';

if (bundle.includes(oldRaSync)) {
  bundle = bundle.replace(oldRaSync, newRaSync);
  console.log("SUCCESS 5: Optimized Ra (onUpdate) with non-blocking background sync!");
  patchedCount++;
}

// ==========================================
// 3. MACHINE MASTER REDESIGN (Bo component)
// ==========================================

// Let's add view mode state (grid vs table) to Bo component
const oldBoStates = 'const[c,d]=Y.useState(""),[f,m]=Y.useState("ALL"),[p,x]=Y.useState(""),[b,N]=Y.useState("asc"),[j,w]=Y.useState(1),S=7,[A,O]=Y.useState(!1),[E,k]=Y.useState(null),[P,R]=Y.useState(!1),[L,M]=Y.useState({});';
const newBoStates = 'const[c,d]=Y.useState(""),[f,m]=Y.useState("ALL"),[p,x]=Y.useState(""),[b,N]=Y.useState("asc"),[j,w]=Y.useState(1),S=e==="machines"?12:7,[A,O]=Y.useState(!1),[E,k]=Y.useState(null),[P,R]=Y.useState(!1),[L,M]=Y.useState({}),[viewMode,setViewMode]=Y.useState("grid");';

if (bundle.includes(oldBoStates)) {
  bundle = bundle.replace(oldBoStates, newBoStates);
  console.log("SUCCESS 6: Added viewMode state and updated page size for Machine Master in Bo!");
  patchedCount++;
}

fs.writeFileSync(bundlePath, bundle, 'utf8');
console.log(`Patched ${patchedCount} targets. Bundle length: ${bundle.length}`);
