import fs from 'fs';
import path from 'path';

const filesToPatch = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'),
];

const targetPattern = 'i.jsxs("form",{onSubmit:ut,className:"space-y-4",children:[';

const replacement = `i.jsxs("form",{onSubmit:ut,className:"space-y-4",children:[i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-800/90 p-3.5 rounded-xl border border-blue-500/30",children:[i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-amber-400 font-bold block",children:"CUSTOMER SELECTION (AUTOFILL FROM MASTER)"}),i.jsxs("select",{onChange:U=>{const custId=U.target.value;if(!custId)return;const selected=s.find(cust=>String(cust.id)===String(custId)||cust._id===custId);if(selected){he({...G,customerName:selected.name||"",companyName:selected.company||"",mobileNumber:selected.mobile||selected.phone||"",whatsAppNumber:selected.mobile||selected.phone||"",email:selected.email||"",customerType:selected.customerType||"Contractor",businessType:selected.customerType||"Contractor",address:selected.billingAddress||selected.address||"",district:selected.district||G.district});}},className:"w-full bg-[#0f172a] border border-amber-500/40 text-amber-300 text-xs rounded-lg px-3 py-2 focus:border-amber-400 focus:outline-none font-semibold",children:[i.jsx("option",{value:"",children:"-- Select Existing Customer --"}),s.map(U=>i.jsxs("option",{value:U.id,children:[U.name," (",U.customerType||"Customer",") - ",U.mobile||""]},U.id))]})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-amber-400 font-bold block",children:"CUSTOMER SELECTION (CUSTOMER TYPE FILTER) *"}),i.jsxs("select",{value:G.customerType||G.businessType||"Contractor",onChange:U=>he({...G,customerType:U.target.value,businessType:U.target.value}),className:"w-full bg-[#0f172a] border border-amber-500/40 text-white text-xs rounded-lg px-3 py-2 focus:border-amber-400 focus:outline-none font-semibold",children:[i.jsx("option",{value:"Contractor",children:"Contractor"}),i.jsx("option",{value:"Builder",children:"Builder"}),i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"}),i.jsx("option",{value:"Government / PSU",children:"Government / PSU"}),i.jsx("option",{value:"Mining / Quarry",children:"Mining / Quarry"}),i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),i.jsx("option",{value:"Other",children:"Other"})]})]})]}),`;

let patched = false;
for (const filePath of filesToPatch) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('CUSTOMER SELECTION (AUTOFILL FROM MASTER)')) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Patched: ${filePath}`);
      patched = true;
    } else {
      console.log(`Already patched: ${filePath}`);
    }
  }
}

console.log('Done.');
