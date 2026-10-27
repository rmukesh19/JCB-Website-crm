import fs from 'fs';
import path from 'path';

const publicBundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
const distBundlePath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundlePath, 'utf8');

console.log('Original bundle length:', bundle.length);

// 1. Master Modal Form State Initializer (Rate Master, Machine Master, Supplier Master, Customer Master, etc.)
const oldMasterInit = '_.type==="select"&&_.options?D[_.name]=_.options[0]:_.type==="number"?D[_.name]=0:D[_.name]=""';
const newMasterInit = '_.type==="select"&&_.options?D[_.name]=_.options[0]:D[_.name]=""';
if (bundle.includes(oldMasterInit)) {
  bundle = bundle.replace(oldMasterInit, newMasterInit);
  console.log('1. Patched Master Modal Initializer (removed default 0 for number fields)');
} else {
  console.warn('Could not find oldMasterInit');
}

// 2. Master Modal Input field rendering
const oldMasterInput = 'i.jsx("input",{type:D.type,value:L[D.name]??"",onChange:_=>M({...L,[D.name]:D.type==="number"?Number(_.target.value):_.target.value}),placeholder:D.placeholder,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none placeholder-slate-400",required:D.required})';
const newMasterInput = 'i.jsx("input",{type:D.type,value:(D.type==="number"&&(L[D.name]===0||L[D.name]==="0"))?"":(L[D.name]??""),onChange:_=>M({...L,[D.name]:D.type==="number"?(_.target.value===""?"":Number(_.target.value)):_.target.value}),placeholder:D.placeholder,className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none placeholder-slate-400",required:D.required})';
if (bundle.includes(oldMasterInput)) {
  bundle = bundle.replace(oldMasterInput, newMasterInput);
  console.log('2. Patched Master Modal Input element (cleared 0 prefill)');
} else {
  console.warn('Could not find oldMasterInput');
}

// 3. Master Modal Form Submit handler sanitize
const oldMasterSubmit = 'K=D=>{D.preventDefault(),E?r(E.id,L):n(L),O(!1)}';
const newMasterSubmit = 'K=D=>{D.preventDefault();const sanitized={...L};o.fields.forEach(_=>{if(_.type==="number"){sanitized[_.name]=L[_.name]===""?0:Number(L[_.name])||0}});E?r(E.id,sanitized):n(sanitized),O(!1)}';
if (bundle.includes(oldMasterSubmit)) {
  bundle = bundle.replace(oldMasterSubmit, newMasterSubmit);
  console.log('3. Patched Master Modal Form Submit (sanitizing empty numbers to 0 on submit)');
} else {
  console.warn('Could not find oldMasterSubmit');
}

// 4. Site Log Entry Form (startHours, endHours, dieselConsumed)
const oldSiteLogInit = 'startHours:0,\n    endHours:0,\n    totalHours:0,\n    dieselConsumed:0,';
const newSiteLogInit = 'startHours:"",\n    endHours:"",\n    totalHours:"",\n    dieselConsumed:"",';
if (bundle.includes(oldSiteLogInit)) {
  bundle = bundle.replace(oldSiteLogInit, newSiteLogInit);
  console.log('4. Patched Site Log Entry initialForm');
} else {
  console.warn('Could not find oldSiteLogInit');
}

// Site Log Entry input value bindings
bundle = bundle.replaceAll('value:formData.startHours,', 'value:formData.startHours===0||formData.startHours==="0"?"":formData.startHours,');
bundle = bundle.replaceAll('value:formData.endHours,', 'value:formData.endHours===0||formData.endHours==="0"?"":formData.endHours,');
bundle = bundle.replaceAll('value:formData.dieselConsumed,', 'value:formData.dieselConsumed===0||formData.dieselConsumed==="0"?"":formData.dieselConsumed,');

// 5. Diesel Modal Initializer & Value
const oldDieselInit = 'quantityLiters:50,ratePerLiter:94.5,currentHours:0';
const newDieselInit = 'quantityLiters:"",ratePerLiter:"",currentHours:""';
if (bundle.includes(oldDieselInit)) {
  bundle = bundle.replace(oldDieselInit, newDieselInit);
  console.log('5. Patched Diesel Modal Initializer');
} else {
  console.warn('Could not find oldDieselInit');
}

bundle = bundle.replace('value:de.quantityLiters,', 'value:(de.quantityLiters===0||de.quantityLiters==="0")?"":de.quantityLiters,');
bundle = bundle.replace('value:de.ratePerLiter,', 'value:(de.ratePerLiter===0||de.ratePerLiter==="0")?"":de.ratePerLiter,');
bundle = bundle.replace('value:de.currentHours,', 'value:(de.currentHours===0||de.currentHours==="0")?"":de.currentHours,');

// 6. Service Repairs Modal Initializer & Value
const oldServiceInit = 'serviceHours:0,cost:5e3,description:"",technicianName:"",partsReplaced:"",supplierId:"",nextDueHours:250';
const newServiceInit = 'serviceHours:"",cost:"",description:"",technicianName:"",partsReplaced:"",supplierId:"",nextDueHours:""';
if (bundle.includes(oldServiceInit)) {
  bundle = bundle.replace(oldServiceInit, newServiceInit);
  console.log('6. Patched Service Modal Initializer');
} else {
  console.warn('Could not find oldServiceInit');
}

bundle = bundle.replace('value:Z.cost,', 'value:(Z.cost===0||Z.cost==="0")?"":Z.cost,');
bundle = bundle.replace('value:Z.serviceHours,', 'value:(Z.serviceHours===0||Z.serviceHours==="0")?"":Z.serviceHours,');
bundle = bundle.replace('value:Z.nextDueHours,', 'value:(Z.nextDueHours===0||Z.nextDueHours==="0")?"":Z.nextDueHours,');

// 7. Spare Parts & Inventory Modal
const oldPartsInit = 'partName:"",partNumber:"",quantity:5,unitPrice:500,minStockLevel:2';
const newPartsInit = 'partName:"",partNumber:"",quantity:"",unitPrice:"",minStockLevel:""';
if (bundle.includes(oldPartsInit)) {
  bundle = bundle.replace(oldPartsInit, newPartsInit);
  console.log('7. Patched Spare Parts Initializer');
} else {
  console.warn('Could not find oldPartsInit');
}

bundle = bundle.replace('value:ge.quantity,', 'value:(ge.quantity===0||ge.quantity==="0")?"":ge.quantity,');
bundle = bundle.replace('value:ge.unitPrice,', 'value:(ge.unitPrice===0||ge.unitPrice==="0")?"":ge.unitPrice,');
bundle = bundle.replace('value:ge.minStockLevel,', 'value:(ge.minStockLevel===0||ge.minStockLevel==="0")?"":ge.minStockLevel,');

// 8. Staff / Employee Modal
bundle = bundle.replace('value:$.salary,', 'value:($.salary===0||$.salary==="0")?"":$.salary,');
bundle = bundle.replace('value:$.workingHours,', 'value:($.workingHours===0||$.workingHours==="0")?"":$.workingHours,');

// Save updated bundle
fs.writeFileSync(publicBundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist/assets/index-Dbowi09z.js');
}

console.log('Zero prefill patch execution complete!');
