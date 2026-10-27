import fs from 'fs';
import path from 'path';

const filesToPatch = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'),
];

const targetPattern = 'i.jsxs("div",{className:"flex items-center gap-2.5 flex-wrap",children:[i.jsxs("button",{onClick:()=>_(!0),className:"bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-import-crm-leads",children:[i.jsx(Vo,{size:15,className:"text-teal-400"}),"Import Leads (CSV/Excel)"]}),i.jsxs("button",{onClick:Ki,className:"bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 shrink-0 cursor-pointer",id:"btn-create-crm-lead",children:[i.jsx(ar,{size:16}),"Add New Lead"]})]})';

const replacement = 'i.jsxs("div",{className:"flex items-center gap-2.5 flex-wrap",children:[i.jsxs("button",{onClick:()=>_(!0),className:"bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-import-crm-leads",children:[i.jsx(Vo,{size:15,className:"text-teal-400"}),"Import Leads (CSV/Excel)"]}),i.jsxs("button",{onClick:()=>{const exportList=Gr&&Gr.length>0?Gr:b;if(!exportList||exportList.length===0){f("No leads available to export.","WARNING");return;}let U="Lead ID,Customer Name,Company Name,Customer Type,Mobile Number,WhatsApp Number,Email,District,Area,Address,Interested Machine,Rental Requirement,Budget (INR),Lead Source,Priority,Stage / Status\\n";exportList.forEach(xt=>{U+=`\\"${xt.id||""}\\",\\"${(xt.customerName||"").replace(/"/g,\'""\')}\\",\\"${(xt.companyName||"").replace(/"/g,\'""\')}\\",\\"${(xt.customerType||xt.businessType||"Contractor").replace(/"/g,\'""\')}\\",\\"${(xt.mobileNumber||"").replace(/"/g,\'""\')}\\",\\"${(xt.whatsAppNumber||"").replace(/"/g,\'""\')}\\",\\"${(xt.email||"").replace(/"/g,\'""\')}\\",\\"${(xt.district||"").replace(/"/g,\'""\')}\\",\\"${(xt.area||"").replace(/"/g,\'""\')}\\",\\"${(xt.address||"").replace(/"/g,\'""\')}\\",\\"${(xt.interestedMachine||"JCB 3DX Super").replace(/"/g,\'""\')}\\",\\"${(xt.rentalRequirement||"Hourly").replace(/"/g,\'""\')}\\",\\"${(xt.budget||"").replace(/"/g,\'""\')}\\",\\"${(xt.leadSource||"Website").replace(/"/g,\'""\')}\\",\\"${(xt.priority||"MEDIUM").replace(/"/g,\'""\')}\\",\\"${(xt.status||"NEW").replace(/"/g,\'""\')}\\"\\n`});const ke=new Blob([U],{type:"text/csv;charset=utf-8;"}),Ye=URL.createObjectURL(ke),Je=document.createElement("a");Je.href=Ye,Je.setAttribute("download",`JCB360_CRM_Leads_${new Date().toISOString().split("T")[0]}.csv`),document.body.appendChild(Je),Je.click(),document.body.removeChild(Je),f(`Exported ${exportList.length} leads successfully!`,"SUCCESS");},className:"bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-export-crm-leads",children:[i.jsx(Yu,{size:15,className:"text-emerald-400"}),"Export Leads (CSV)"]}),i.jsxs("button",{onClick:Ki,className:"bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 shrink-0 cursor-pointer",id:"btn-create-crm-lead",children:[i.jsx(ar,{size:16}),"Add New Lead"]})]})';

for (const filePath of filesToPatch) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(targetPattern)) {
    content = content.replace(targetPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added Export Leads button to ${filePath}`);
  } else if (content.includes('id:"btn-export-crm-leads"')) {
    console.log(`Export Leads button already present in ${filePath}`);
  } else {
    console.log(`Target pattern not found in ${filePath}`);
  }
}

console.log("Export functionality enhancement complete.");
