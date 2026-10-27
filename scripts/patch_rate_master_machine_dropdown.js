import fs from 'fs';
import path from 'path';

const publicBundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
const distBundlePath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundlePath, 'utf8');
console.log('Original bundle length:', bundle.length);

// 1. Update Bo signature to accept machines prop if not already accepted
const oldBoSig = 'function Bo({type:e,data:t,onCreate:n,onUpdate:r,onDelete:s}){const o=';
const newBoSig = 'function Bo({type:e,data:t,onCreate:n,onUpdate:r,onDelete:s,machines:mList=[]}){const o=';

if (bundle.includes(oldBoSig)) {
  bundle = bundle.replace(oldBoSig, newBoSig);
  console.log('1. Patched Bo signature to accept machines prop');
} else if (bundle.includes(newBoSig)) {
  console.log('1. Bo signature already has machines prop');
} else {
  console.warn('Could not find oldBoSig');
}

// 2. Pass machines={lr} to Bo for /master/rates route
const oldRatesRoute = 'i.jsx(yn,{path:"/master/rates",element:i.jsx(Bo,{type:"rates",data:xe.filter(z=>z.companyId===C),onCreate:z=>er("rates",z),onUpdate:(z,we)=>Ra("rates",z,we),onDelete:z=>ha("rates",z)})})';
const newRatesRoute = 'i.jsx(yn,{path:"/master/rates",element:i.jsx(Bo,{type:"rates",machines:lr,data:xe.filter(z=>z.companyId===C),onCreate:z=>er("rates",z),onUpdate:(z,we)=>Ra("rates",z,we),onDelete:z=>ha("rates",z)})})';

if (bundle.includes(oldRatesRoute)) {
  bundle = bundle.replace(oldRatesRoute, newRatesRoute);
  console.log('2. Patched /master/rates route to pass machines prop');
} else if (bundle.includes(newRatesRoute)) {
  console.log('2. /master/rates route already passes machines prop');
} else {
  console.warn('Could not find oldRatesRoute');
}

// 3. Patch modal form input rendering to render machine dropdown for machineModel with auto-fill
const currentPattern = bundle.includes('D.name==="machineModel"?i.jsx("select"')
  ? bundle.substring(
      bundle.indexOf('D.name==="machineModel"?i.jsx("select"'),
      bundle.indexOf(':D.type==="select"?i.jsx("select"') + ':D.type==="select"?i.jsx("select"'.length
    )
  : 'D.type==="select"?i.jsx("select"';

const replacementSelect = `D.name==="machineModel"?i.jsx("select",{value:L[D.name]||"",onChange:_=>{const v=_.target.value;const mArr=Array.isArray(mList)&&mList.length>0?mList:(function(){try{const ld=localStorage.getItem("jcb360_machines");return ld?JSON.parse(ld):[];}catch(e){return [];}})();const match=mArr.find(m=>{if(!m)return false;const md=m.modelName||m.name;const pl=m.plateNumber||m.regNumber;return (md&&pl&&\`\${md} (\${pl})\`===v)||md===v;});if(match){M(prev=>({...prev,[D.name]:v,hourlyRate:prev.hourlyRate||match.hourlyRate||match.defaultRatePerHour||"",dailyRate:prev.dailyRate||match.dailyRate||"",weeklyRate:prev.weeklyRate||match.weeklyRate||"",monthlyRate:prev.monthlyRate||match.monthlyRate||""}));}else{M(prev=>({...prev,[D.name]:v}));}},className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none cursor-pointer font-sans",required:D.required,id:"select-machine-model",children:[i.jsx("option",{value:"",children:"-- Select Machine / Vehicle Model --"},"default-opt"),(()=>{const opts=[];const set=new Set();const addOpt=(val)=>{if(val&&!set.has(val)){set.add(val);opts.push(val);}};if(Array.isArray(mList)){mList.forEach(m=>{if(!m)return;const md=m.modelName||m.name;const pl=m.plateNumber||m.regNumber;if(md&&pl)addOpt(\`\${md} (\${pl})\`);if(md)addOpt(md);});}try{const ld=localStorage.getItem("jcb360_machines");if(ld){const p=JSON.parse(ld);if(Array.isArray(p)){p.forEach(m=>{if(!m)return;const md=m.modelName||m.name;const pl=m.plateNumber||m.regNumber;if(md&&pl)addOpt(\`\${md} (\${pl})\`);if(md)addOpt(md);});}}}catch(e){}["JCB 3DX Super","JCB 3DX EcoXcellence","JCB 4DX Heavy Duty","JCB JS205 Excavator","JCB JS140 Track Excavator","CAT 424B2 Backhoe Loader","Hitachi EX200 Excavator","Poclain 210 Heavy Excavator","Kubota Mini Excavator","Mahindra EarthMaster VX","Tata Hitachi ZAXIS 220LC","Hamm 311 Soil Compactor"].forEach(addOpt);if(L[D.name]&&!set.has(L[D.name])){opts.unshift(L[D.name]);}return opts.map(o=>i.jsx("option",{value:o,children:o},o));})()]}):D.type==="select"?i.jsx("select"`;

if (bundle.includes(currentPattern)) {
  bundle = bundle.replace(currentPattern, replacementSelect);
  console.log('3. Successfully updated machineModel select dropdown rendering with auto-fill');
} else {
  console.warn('Could not find currentPattern for machineModel dropdown');
}

fs.writeFileSync(publicBundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist bundle');
}

console.log('Rate Master machine dropdown patch execution complete!');

