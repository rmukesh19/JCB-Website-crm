import fs from "fs";

let bundle = fs.readFileSync("public/assets/index-Dbowi09z.js", "utf8");

const defString = "const mb=({children})=>children,vb={div:({initial:e,animate:t,exit:n,transition:r,...c})=>i.jsx(\"div\",c)};\n";

if (!bundle.includes("const mb=")) {
  bundle = bundle.replace("function cde(", defString + "function cde(");
  console.log("SUCCESS: Injected mb and vb definitions before function cde!");
} else {
  console.log("mb definition already exists!");
}

fs.writeFileSync("public/assets/index-Dbowi09z.js", bundle, "utf8");
fs.writeFileSync("dist/assets/index-Dbowi09z.js", bundle, "utf8");
console.log("Wrote updated bundle to public and dist!");
