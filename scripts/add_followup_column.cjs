const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace table header
const thPattern = /i\.jsx\("th",\{className:"p-3\.5",children:"Stage \/ Status"\}\)/;
const thReplacement = `i.jsx("th",{className:"p-3.5",children:"Status & Follow-up"})`;
content = content.replace(thPattern, thReplacement);

// Replace table cell
// i.jsx("td",{className:"p-3.5",children:i.jsx("span",{className:`px-2.5 py-0.5 text-[10px] font-mono rounded font-semibold ${Gs(U.status)}`,children:U.status||"NEW"})})
const tdPattern = /i\.jsx\("td",\{className:"p-3\.5",children:i\.jsx\("span",\{className:`px-2\.5 py-0\.5 text-\[10px\] font-mono rounded font-semibold \$\{Gs\(U\.status\)\}`,children:U\.status\|\|"NEW"\}\)\}\),i\.jsx\("td",\{className:"p-3\.5 text-right"/;
const tdReplacement = `i.jsxs("td",{className:"p-3.5",children:[i.jsx("span",{className:\`px-2.5 py-0.5 text-[10px] font-mono rounded font-semibold \${Gs(U.status)}\`,children:U.status||"NEW"}),(U.nextFollowUpDate||U.nextFollowUpTime)&&i.jsxs("div",{className:"text-[10px] text-slate-400 mt-1.5 font-mono flex items-center gap-1",children:[i.jsx(aO,{size:10,className:"text-amber-400"}),U.nextFollowUpDate," ",U.nextFollowUpTime]})]}),i.jsx("td",{className:"p-3.5 text-right"`;

// Need to make sure aO is an icon or just use a dot/clock icon. Or just text without icon.
// Let's use simple text without aO because aO might be map pin.
// gl is arrow, hc is clock maybe?
const tdReplacementNoIcon = `i.jsxs("td",{className:"p-3.5",children:[i.jsx("span",{className:\`px-2.5 py-0.5 text-[10px] font-mono rounded font-semibold \${Gs(U.status)}\`,children:U.status||"NEW"}),(U.nextFollowUpDate||U.nextFollowUpTime)&&i.jsxs("div",{className:"text-[10px] text-slate-400 mt-1 font-mono",children:[U.nextFollowUpDate," ",U.nextFollowUpTime]})]}),i.jsx("td",{className:"p-3.5 text-right"`;

content = content.replace(tdPattern, tdReplacementNoIcon);

fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'), content, 'utf8');
console.log('Follow up column patched.');
