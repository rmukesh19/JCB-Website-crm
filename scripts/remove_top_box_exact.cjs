const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let content = fs.readFileSync(filePath, 'utf8');

const startStr = 'i.jsxs("form",{onSubmit:ut,className:"space-y-4",children:[';
const endStr = ']})]}),i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3.5",children:[';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const boxPart = content.substring(startIdx + startStr.length, endIdx + 7);
    
    // Replace the box part with empty string
    content = content.replace(boxPart, '');
    
    const companyNamePattern = /i\.jsxs\("div",\{className:"space-y-1",children:\[i\.jsx\("label",\{className:"text-\[11px\] font-mono text-slate-400 font-semibold block",children:"Company \/ Business Name"\}\),i\.jsx\("input",\{type:"text",placeholder:"e\.g\. AK Earthmovers & Infra",value:G\.companyName,onChange:U=>he\(\{\.\.\.G,companyName:U\.target\.value\}\),className:"w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"\}\)\]\}\),/;
    
    const customerTypeField = `i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-400 font-semibold block",children:"Customer Type *"}),i.jsxs("select",{value:G.customerType||G.businessType||"Contractor",onChange:U=>he({...G,customerType:U.target.value,businessType:U.target.value}),className:"w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none font-semibold",children:[i.jsx("option",{value:"Contractor",children:"Contractor"}),i.jsx("option",{value:"Builder",children:"Builder"}),i.jsx("option",{value:"Operator",children:"Operator"}),i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"}),i.jsx("option",{value:"Government / PSU",children:"Government / PSU"}),i.jsx("option",{value:"Mining / Quarry",children:"Mining / Quarry"}),i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),i.jsx("option",{value:"Other",children:"Other"})]})]}),`;
    
    content = content.replace(companyNamePattern, companyNamePattern.source.replace(/\\/g, '') + customerTypeField);
    
    fs.writeFileSync(filePath, content, 'utf8');
    fs.writeFileSync(path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'), content, 'utf8');
    console.log('Successfully sliced and patched!');
} else {
    console.log('Indices not found:', startIdx, endIdx);
}
