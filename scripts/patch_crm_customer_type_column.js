import fs from 'fs';
import path from 'path';

const filesToPatch = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'),
];

const oldThead = 'i.jsx("th",{className:"p-3.5",children:"Lead / Client Name"}),i.jsx("th",{className:"p-3.5",children:"Contact Details"})';
const newThead = 'i.jsx("th",{className:"p-3.5",children:"Lead / Client Name"}),i.jsx("th",{className:"p-3.5",children:"Customer Type"}),i.jsx("th",{className:"p-3.5",children:"Contact Details"})';

const oldColspan = 'j?i.jsx("tr",{children:i.jsxs("td",{colSpan:7,className:"text-center py-12 text-slate-500 font-mono",children:[i.jsx(Fm,{className:"animate-spin inline mr-2",size:16}),"Loading CRM leads pipeline..."]})}):Gr.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:7,className:"text-center py-12 text-slate-500 font-mono",children:\'No leads match the specified filter criteria. Click "Add New Lead" or "Import Leads".\'})})';
const newColspan = 'j?i.jsx("tr",{children:i.jsxs("td",{colSpan:8,className:"text-center py-12 text-slate-500 font-mono",children:[i.jsx(Fm,{className:"animate-spin inline mr-2",size:16}),"Loading CRM leads pipeline..."]})}):Gr.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:8,className:"text-center py-12 text-slate-500 font-mono",children:\'No leads match the specified filter criteria. Click "Add New Lead" or "Import Leads".\'})})';

const oldRow = 'i.jsxs("tr",{className:"hover:bg-slate-800/40 transition-colors",children:[i.jsx("td",{className:"p-3.5 font-semibold text-white",children:i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("div",{className:"w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 border border-indigo-500/20",children:U.customerName?U.customerName[0].toUpperCase():"C"}),i.jsxs("div",{children:[i.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap",children:[i.jsx("span",{className:"font-semibold text-white",children:U.customerName}),i.jsx("span",{className:"px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold shrink-0",children:U.customerType||U.businessType||"Contractor"})]}),U.companyName&&i.jsxs("div",{className:"text-[10px] text-slate-400 font-mono font-normal flex items-center gap-1",children:[i.jsx(js,{size:10}),U.companyName]})]})]})}),i.jsxs("td",{className:"p-3.5 font-mono",children:[i.jsx("div",{className:"text-slate-200",children:U.mobileNumber})';

const newRow = 'i.jsxs("tr",{className:"hover:bg-slate-800/40 transition-colors",children:[i.jsx("td",{className:"p-3.5 font-semibold text-white",children:i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("div",{className:"w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 border border-indigo-500/20",children:U.customerName?U.customerName[0].toUpperCase():"C"}),i.jsxs("div",{children:[i.jsx("div",{className:"font-semibold text-white",children:U.customerName}),U.companyName&&i.jsxs("div",{className:"text-[10px] text-slate-400 font-mono font-normal flex items-center gap-1",children:[i.jsx(js,{size:10}),U.companyName]})]})]})}),i.jsx("td",{className:"p-3.5",children:i.jsx("span",{className:"px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold inline-block",children:U.customerType||U.businessType||"Contractor"})}),i.jsxs("td",{className:"p-3.5 font-mono",children:[i.jsx("div",{className:"text-slate-200",children:U.mobileNumber})';

for (const filePath of filesToPatch) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing file: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (content.includes(oldThead)) {
    content = content.replace(oldThead, newThead);
    console.log(`Patched header in ${filePath}`);
    modified = true;
  } else {
    console.log(`Header pattern not found or already patched in ${filePath}`);
  }

  if (content.includes(oldColspan)) {
    content = content.replace(oldColspan, newColspan);
    console.log(`Patched colSpan in ${filePath}`);
    modified = true;
  } else {
    console.log(`Colspan pattern not found or already patched in ${filePath}`);
  }

  if (content.includes(oldRow)) {
    content = content.replace(oldRow, newRow);
    console.log(`Patched row in ${filePath}`);
    modified = true;
  } else {
    console.log(`Row pattern not found or already patched in ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${filePath}`);
  }
}

console.log("Customer Type column patch complete.");
