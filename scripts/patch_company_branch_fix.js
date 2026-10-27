import fs from 'fs';
import path from 'path';

// 1. Update data/db.json
const dbPath = path.join(process.cwd(), 'data', 'db.json');
if (fs.existsSync(dbPath)) {
  let dbContent = fs.readFileSync(dbPath, 'utf8');
  dbContent = dbContent.replace(
    /"name":\s*"MMT ENTERPRISES \(mmtenterprises\.in\)"/g,
    '"name": "MMT ENTERPRISES"'
  );
  fs.writeFileSync(dbPath, dbContent, 'utf8');
  console.log('Updated data/db.json company name to "MMT ENTERPRISES"');
}

// 2. Patch public/assets/index-Dbowi09z.js and dist/assets/index-Dbowi09z.js
const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
const distBundlePath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');

let bundle = fs.readFileSync(bundlePath, 'utf8');

// Patch 1: Default state initialization for companies ($) and branches (K) in fde
const targetState = '[$,V]=Y.useState([]),[K,ve]=Y.useState([])';
const newState = '[$,V]=Y.useState([{id:1,name:"MMT ENTERPRISES",code:"MMT"}]),[K,ve]=Y.useState([{id:1,companyId:1,name:"Coimbatore Main Yard & Workshop",code:"CBE-01",isHeadOffice:!0}])';

if (bundle.includes(targetState)) {
  bundle = bundle.replace(targetState, newState);
  console.log('Patched default state for companies and branches in fde!');
} else {
  console.warn('Target state pattern not found in bundle');
}

// Patch 2: Fallback logic in N6 Sidebar for L (branches) and s (companies)
const targetL = 'roles.includes((e==null?void 0:e.role)||"ADMIN")),L=o.filter(M=>M.companyId===c);';
const newL = 'roles.includes((e==null?void 0:e.role)||"ADMIN")),eComps=s.length>0?s:[{id:1,name:"MMT ENTERPRISES"}],bFilt=o.filter(M=>M.companyId===c),L=bFilt.length>0?bFilt:[{id:1,companyId:1,name:"Coimbatore Main Yard & Workshop",code:"CBE-01"}];';

if (bundle.includes(targetL)) {
  bundle = bundle.replace(targetL, newL);
  console.log('Patched L filter & fallback in N6 Sidebar!');
} else {
  console.warn('Target L pattern not found in bundle');
}

// Replace s.map in N6 sidebar with eComps.map and sanitize name
const targetSMap = 'children:s.map(M=>i.jsx("option",{value:M.id,className:"bg-slate-900 text-slate-200",children:M.name},M.id))';
const newSMap = 'children:eComps.map(M=>i.jsx("option",{value:M.id,className:"bg-slate-900 text-slate-200",children:(M.name||"MMT ENTERPRISES").replace(/\\s*\\(mmtenterprises\\.in\\)/gi,"")},M.id))';

if (bundle.includes(targetSMap)) {
  bundle = bundle.replaceAll(targetSMap, newSMap);
  console.log('Replaced s.map with eComps.map in N6 Sidebar!');
} else {
  console.warn('Target s.map pattern not found in bundle');
}

// Write to public and dist
fs.writeFileSync(bundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist/assets/index-Dbowi09z.js');
}

console.log('Patch completed successfully!');
