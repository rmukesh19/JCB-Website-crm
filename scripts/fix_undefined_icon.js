import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

console.log("Bundle length:", bundle.length);

// Replace undefined icon Yo with valid defined edit icon iO
const oldYoSnippet = 'i.jsx(Yo,{size:13})';
const newIoSnippet = 'i.jsx(iO,{size:13})';

if (bundle.includes(oldYoSnippet)) {
  bundle = bundle.replace(oldYoSnippet, newIoSnippet);
  console.log("SUCCESS: Replaced undefined Yo icon with valid iO icon!");
} else {
  console.warn("WARN: oldYoSnippet not found!");
}

fs.writeFileSync(bundlePath, bundle, 'utf8');

// Also sync to dist
const distPath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');
if (fs.existsSync(path.dirname(distPath))) {
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
  fs.writeFileSync(distPath, bundle, 'utf8');
}
fs.copyFileSync(path.join(process.cwd(), 'index.html'), path.join(process.cwd(), 'dist', 'index.html'));

// Verify parsing
try {
  esbuild.transformSync(bundle, { loader: 'js' });
  console.log("🎉 SUCCESS! public/assets/index-Dbowi09z.js parsed 100% CLEANLY!");
} catch (err) {
  console.error("❌ PARSE FAILURE:", err);
  process.exit(1);
}
