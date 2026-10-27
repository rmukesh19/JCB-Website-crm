import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

const badExtraParen = 'Contractor"})]}),),U.companyName';
const fixedExtraParen = 'Contractor"})]}),U.companyName';

if (bundle.includes(badExtraParen)) {
  bundle = bundle.replace(badExtraParen, fixedExtraParen);
  console.log("SUCCESS: Removed extra ), before U.companyName!");
} else {
  console.warn("WARN: badExtraParen not found!");
}

fs.writeFileSync(bundlePath, bundle, 'utf8');

// Test parsing with esbuild
try {
  esbuild.transformSync(bundle, { loader: 'js' });
  console.log("🎉 SUCCESS! public/assets/index-Dbowi09z.js parsed 100% CLEANLY with ZERO syntax errors!");
  
  // Sync to dist
  const distPath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');
  if (fs.existsSync(path.dirname(distPath))) {
    fs.writeFileSync(distPath, bundle, 'utf8');
  }
  fs.copyFileSync(path.join(process.cwd(), 'index.html'), path.join(process.cwd(), 'dist', 'index.html'));
  console.log("Synced fixed bundle to dist!");
} catch (err) {
  console.error("❌ STILL PARSE ERROR:", err);
  process.exit(1);
}
