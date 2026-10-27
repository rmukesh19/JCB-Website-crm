const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

const targetPattern = `i.jsxs("button",{onClick:()=>_(!0),className:"bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-import-crm-leads",children:[i.jsx(Vo,{size:15,className:"text-teal-400"}),"Import Leads (CSV/Excel)"]})`;

const replacement = `i.jsxs("button",{onClick:async()=>{if(window.confirm("Are you sure you want to clear all leads & enquiries? This cannot be undone.")){try{const _cRes=await fetch("/api/crm/leads/all",{method:"DELETE",headers:c()});if(_cRes.ok){f("All CRM leads and enquiries cleared successfully.","SUCCESS");pe();}else f("Failed to clear leads.","ERROR")}catch(e){f("Network error clearing leads.","ERROR")}}},className:"bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-clear-crm-leads",children:[i.jsx(Dl,{size:15,className:"text-rose-400"}),"Clear Leads"]}),` + targetPattern;

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetPattern)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Successfully added Clear Leads button in: ${file}`);
    } else {
      console.warn(`Target pattern not found in: ${file}`);
    }
  } else {
    console.warn(`File does not exist: ${file}`);
  }
});
