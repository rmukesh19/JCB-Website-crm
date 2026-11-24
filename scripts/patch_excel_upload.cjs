const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

const targetDt = `Dt=U=>{var Je;const ke=(Je=U.target.files)==null?void 0:Je[0];if(!ke)return;const Ye=new FileReader;Ye.onload=xt=>{var ft;const dt=(ft=xt.target)==null?void 0:ft.result;typeof dt=="string"&&(J(dt),Ur(dt))},Ye.readAsText(ke)}`;

const replacementDt = `Dt=async U=>{var Je;const ke=(Je=U.target.files)==null?void 0:Je[0];if(!ke)return;if(ke.name.match(/\\.(xlsx|xls)$/i)){try{f("Parsing Excel spreadsheet in memory...","INFO");const fd=new FormData();fd.append("file",ke);const h={};try{const _h=c?c():{};_h.Authorization&&(h.Authorization=_h.Authorization),_h.authorization&&(h.Authorization=_h.authorization)}catch(e){}!h.Authorization&&o&&(h.Authorization=\`Bearer \${o}\`);const r=await fetch("/api/crm/leads/parse-excel",{method:"POST",headers:h,body:fd}),d=await r.json();if(r.ok&&d.success&&Array.isArray(d.records)){Te(d.records),J(d.csvPreview||""),f(\`Loaded \${d.records.length} records from Excel spreadsheet!\`,"SUCCESS");return}else{f(d.error||"Failed to parse Excel file.","ERROR");return}}catch(e){console.error("Excel parse error:",e),f("Error uploading/parsing Excel file.","ERROR");return}}const Ye=new FileReader;Ye.onload=xt=>{var ft;const dt=(ft=xt.target)==null?void 0:ft.result;typeof dt=="string"&&(J(dt),Ur(dt))},Ye.readAsText(ke)}`;

const targetInput = `accept:".csv,.txt"`;
const replacementInput = `accept:".csv,.txt,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"`;

const targetLabel = `"Select CSV File to Upload"`;
const replacementLabel = `"Select CSV or Excel (.xlsx, .xls) File to Upload"`;

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.warn(`File does not exist: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  if (content.includes(targetDt)) {
    content = content.replace(targetDt, replacementDt);
    modified = true;
    console.log(`[Patch] Replaced Dt in ${file}`);
  } else {
    console.warn(`[Patch] Target Dt not found in ${file}`);
  }

  if (content.includes(targetInput)) {
    content = content.replace(targetInput, replacementInput);
    modified = true;
    console.log(`[Patch] Replaced file accept in ${file}`);
  }

  if (content.includes(targetLabel)) {
    content = content.replace(targetLabel, replacementLabel);
    modified = true;
    console.log(`[Patch] Replaced label in ${file}`);
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[Patch] Saved updates to ${file}`);
  }
});
