import fs from 'fs';
import path from 'path';

const bundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

console.log("Original bundle length:", bundle.length);

// 1. Add viewMode state in Bo
const oldStates = '[c,d]=Y.useState(""),[f,m]=Y.useState("ALL"),[p,x]=Y.useState(""),[b,N]=Y.useState("asc"),[j,w]=Y.useState(1),S=7,[A,O]=Y.useState(!1),[E,k]=Y.useState(null),[P,R]=Y.useState(!1),[L,M]=Y.useState({});';
const newStates = '[c,d]=Y.useState(""),[f,m]=Y.useState("ALL"),[p,x]=Y.useState(""),[b,N]=Y.useState("asc"),[j,w]=Y.useState(1),S=e==="machines"?12:7,[A,O]=Y.useState(!1),[E,k]=Y.useState(null),[P,R]=Y.useState(!1),[L,M]=Y.useState({}),[viewMode,setViewMode]=Y.useState("grid");';

if (bundle.includes(oldStates)) {
  bundle = bundle.replace(oldStates, newStates);
  console.log("SUCCESS: Added viewMode state to Bo!");
} else {
  console.warn("WARN: oldStates not found in Bo");
}

// 2. Enhance Header Bar in Bo to include Grid/Table toggle when e === "machines"
const oldHeaderRightButtons = 'i.jsxs("button",{onClick:H,className:"bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 shrink-0 cursor-pointer",id:`btn-add-${e}`,children:[i.jsx(ar,{size:16}),"Add New Record"]})';
const newHeaderRightButtons = 'e==="machines"&&i.jsxs("div",{className:"flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 gap-1",children:[i.jsxs("button",{type:"button",onClick:()=>setViewMode("grid"),className:`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${viewMode==="grid"?"bg-blue-600 text-white shadow":"hover:text-white"}`,children:[i.jsx(Os,{size:13,className:"inline mr-1"}),"Grid Cards"]}),i.jsxs("button",{type:"button",onClick:()=>setViewMode("table"),className:`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${viewMode==="table"?"bg-blue-600 text-white shadow":"hover:text-white"}`,children:[i.jsx(eb,{size:13,className:"inline mr-1"}),"Table List"]})]}),i.jsxs("button",{onClick:H,className:"bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 shrink-0 cursor-pointer",id:`btn-add-${e}`,children:[i.jsx(ar,{size:16}),"Add New Record"]})';

if (bundle.includes(oldHeaderRightButtons)) {
  bundle = bundle.replace(oldHeaderRightButtons, newHeaderRightButtons);
  console.log("SUCCESS: Added Grid/Table view mode toggle to Bo header!");
} else {
  console.warn("WARN: oldHeaderRightButtons not found in Bo");
}

fs.writeFileSync(bundlePath, bundle, 'utf8');
console.log("Saved stage 2 machine master patch. Bundle length:", bundle.length);
