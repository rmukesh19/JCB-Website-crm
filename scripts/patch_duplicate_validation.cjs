const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

const targetPattern = `ut=async U=>{if(U.preventDefault(),!G.customerName||!G.mobileNumber){f("Please provide Customer Name and Mobile Number.","WARNING");return}try{const ke=F?\`/api/crm/leads/\${F.id}\`:"/api/crm/leads";(await fetch(ke,{method:F?"PUT":"POST",headers:c(),body:JSON.stringify(G)})).ok?(f(F?"Lead updated successfully.":"New CRM lead created successfully.","SUCCESS"),de(!1),Z(null),pe()):f("Failed to save lead.","ERROR")}catch(ke){console.error("Error saving lead:",ke),f("Network error saving lead.","ERROR")}}`;

const replacement = `ut=async U=>{if(U.preventDefault(),!G.customerName||!G.mobileNumber){f("Please provide Customer Name and Mobile Number.","WARNING");return}const _cp=p=>String(p||"").replace(/\\D/g,"").slice(-10);const _tp=_cp(G.mobileNumber);if(!F&&_tp&&b.some(ex=>_cp(ex.mobileNumber||ex.phone)===_tp)){const _dup=b.find(ex=>_cp(ex.mobileNumber||ex.phone)===_tp);f(\`Duplicate Entry! A lead with mobile \${_tp} already exists (\${_dup?.customerName||_dup?.name||"Existing Lead"}).\`,"WARNING");return}try{const ke=F?\`/api/crm/leads/\${F.id}\`:"/api/crm/leads";const _res=await fetch(ke,{method:F?"PUT":"POST",headers:c(),body:JSON.stringify(G)});if(_res.ok){f(F?"Lead updated successfully.":"New CRM lead created successfully.","SUCCESS");de(!1);Z(null);pe()}else{const _errData=await _res.json().catch(()=>({}));f(_errData.error||"Failed to save lead: duplicate or invalid details.","ERROR")}}catch(ke){console.error("Error saving lead:",ke),f("Network error saving lead.","ERROR")}}`;

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetPattern)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Successfully patched duplicate validation in: ${file}`);
    } else {
      console.warn(`Target pattern not found in: ${file}`);
    }
  } else {
    console.warn(`File does not exist: ${file}`);
  }
});
