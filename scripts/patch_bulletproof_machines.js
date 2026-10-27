import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

console.log("Original bundle length:", bundle.length);

// 1. Make lr in fde robust against string/number branchId and missing fields
const oldLrFilter = 'const lr=F.filter(z=>z.companyId===C&&z.branchId===G)';
const newLrFilter = 'const lr=F.filter(z=>z&&(!z.companyId||String(z.companyId)===String(C||1))&&(!z.branchId||String(z.branchId)===String(G||1)))';

if (bundle.includes(oldLrFilter)) {
  bundle = bundle.replace(oldLrFilter, newLrFilter);
  console.log("SUCCESS 1: Made lr in fde bulletproof for machines!");
} else {
  console.warn("WARN 1: oldLrFilter not found");
}

// 2. Make KPI status filters in Bo null-safe
const oldKpiAvailable = 'i.jsx("h3",{className:"text-2xl font-bold text-emerald-400 font-mono mt-0.5",children:(t||[]).filter(z=>!z.status||(z.status+"").toUpperCase()==="AVAILABLE"||(z.status+"").toUpperCase()==="ACTIVE"||(z.status+"").toUpperCase()==="IDLE").length})';
const newKpiAvailable = 'i.jsx("h3",{className:"text-2xl font-bold text-emerald-400 font-mono mt-0.5",children:(t||[]).filter(z=>z&&(!z.status||(z.status+"").toUpperCase()==="AVAILABLE"||(z.status+"").toUpperCase()==="ACTIVE"||(z.status+"").toUpperCase()==="IDLE")).length})';

if (bundle.includes(oldKpiAvailable)) {
  bundle = bundle.replace(oldKpiAvailable, newKpiAvailable);
  console.log("SUCCESS 2A: Made KPI Available filter null-safe!");
}

const oldKpiRunning = 'i.jsx("h3",{className:"text-2xl font-bold text-sky-400 font-mono mt-0.5",children:(t||[]).filter(z=>(z.status+"").toUpperCase()==="RUNNING"||(z.status+"").toUpperCase()==="ON_DUTY").length})';
const newKpiRunning = 'i.jsx("h3",{className:"text-2xl font-bold text-sky-400 font-mono mt-0.5",children:(t||[]).filter(z=>z&&z.status&&((z.status+"").toUpperCase()==="RUNNING"||(z.status+"").toUpperCase()==="ON_DUTY")).length})';

if (bundle.includes(oldKpiRunning)) {
  bundle = bundle.replace(oldKpiRunning, newKpiRunning);
  console.log("SUCCESS 2B: Made KPI Running filter null-safe!");
}

const oldKpiMaintenance = 'i.jsx("h3",{className:"text-2xl font-bold text-amber-400 font-mono mt-0.5",children:(t||[]).filter(z=>(z.status+"").toUpperCase()==="MAINTENANCE"||(z.status+"").toUpperCase()==="OUT_OF_SERVICE").length})';
const newKpiMaintenance = 'i.jsx("h3",{className:"text-2xl font-bold text-amber-400 font-mono mt-0.5",children:(t||[]).filter(z=>z&&z.status&&((z.status+"").toUpperCase()==="MAINTENANCE"||(z.status+"").toUpperCase()==="OUT_OF_SERVICE")).length})';

if (bundle.includes(oldKpiMaintenance)) {
  bundle = bundle.replace(oldKpiMaintenance, newKpiMaintenance);
  console.log("SUCCESS 2C: Made KPI Maintenance filter null-safe!");
}

// 3. Make card mapping inside Bo null-safe
const oldCardSt = 'const st=(D.status||"AVAILABLE").toUpperCase();';
const newCardSt = 'const st=(D&&D.status?D.status:"AVAILABLE").toUpperCase();';

if (bundle.includes(oldCardSt)) {
  bundle = bundle.replace(oldCardSt, newCardSt);
  console.log("SUCCESS 3: Made D.status in Machine cards null-safe!");
}

fs.writeFileSync(bundlePath, bundle, 'utf8');

// Also sync to dist
const distPath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');
if (fs.existsSync(path.dirname(distPath))) {
  fs.writeFileSync(distPath, bundle, 'utf8');
}
fs.copyFileSync(path.join(process.cwd(), 'index.html'), path.join(process.cwd(), 'dist', 'index.html'));

// Verify parsing
try {
  esbuild.transformSync(bundle, { loader: 'js' });
  console.log("🎉 SUCCESS! public/assets/index-Dbowi09z.js parsed 100% CLEANLY!");
} catch (err) {
  console.error("❌ PARSE ERROR:", err);
  process.exit(1);
}
