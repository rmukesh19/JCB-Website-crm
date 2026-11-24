const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

const targetPattern = `:Gr.map(U=>i.jsxs("tr",{className:"hover:bg-slate-800/40 transition-colors"`;
const replacementPattern = `:((Gr&&Gr.length>80)?Gr.slice(0,80):Gr).map(U=>i.jsxs("tr",{className:"hover:bg-slate-800/40 transition-colors"`;

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetPattern)) {
      content = content.replace(targetPattern, replacementPattern);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`[Virtualization Patch] Applied successfully in ${file}`);
    } else {
      console.warn(`[Virtualization Patch] Pattern not found in ${file}`);
    }
  } else {
    console.warn(`[Virtualization Patch] File does not exist: ${file}`);
  }
});
