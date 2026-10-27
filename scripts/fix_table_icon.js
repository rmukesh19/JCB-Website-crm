import fs from "fs";
import esbuild from "esbuild";

let bundle = fs.readFileSync("public/assets/index-Dbowi09z.js", "utf8");

const oldSnippet = 'i.jsx(eb,{size:13,className:"inline mr-1"})';
const newSnippet = 'i.jsx(rp,{size:13,className:"inline mr-1"})';

if (bundle.includes(oldSnippet)) {
  bundle = bundle.replaceAll(oldSnippet, newSnippet);
  console.log("SUCCESS: Replaced invalid icon Map eb with valid table/spreadsheet icon rp!");
} else {
  console.warn("WARN: oldSnippet not found in bundle!");
}

// Verify syntax with esbuild
try {
  esbuild.transformSync(bundle, { loader: "js" });
  console.log("ESBUILD VALIDATION: Bundle syntax is 100% valid!");
} catch (err) {
  console.error("Syntax Error:", err);
  process.exit(1);
}

fs.writeFileSync("public/assets/index-Dbowi09z.js", bundle, "utf8");

if (fs.existsSync("dist/assets")) {
  fs.writeFileSync("dist/assets/index-Dbowi09z.js", bundle, "utf8");
}
console.log("Updated bundle written to public and dist.");
