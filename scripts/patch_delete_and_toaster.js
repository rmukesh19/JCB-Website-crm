import fs from 'fs';
import path from 'path';

const publicBundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
const distBundlePath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundlePath, 'utf8');

// Instant Delete Handler without blocking window.confirm dialogs
const oldHaTarget = 'ha=async(z,we)=>{const recId=(typeof we==="object"&&we!==null)?(we.id||we._id):we;if(confirm("Are you sure you want to permanently delete this master record? This action is irreversible.")){w(!0);z==="machines"?Z(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="customers"?ge(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="operators"?_(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="drivers"?J(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="suppliers"?Ie(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="rates"&&Te(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId)));try{const Oe=await fetch(`/api/${z}/${recId}`,{method:"DELETE",headers:We()});if(Oe.ok){Ee("Record permanently purged successfully.","SUCCESS");await Dt();}else{const Xe=await Oe.json().catch(()=>({}));Ee(Xe.error||"Failed to purge record.","ERROR");}}catch(err){console.error("Delete error:",err);Ee("Record purged locally.","INFO");}finally{w(!1);}}}';

const newHaTarget = 'ha=async(z,we)=>{const recId=(typeof we==="object"&&we!==null)?(we.id||we._id):we;w(!0);z==="machines"?Z(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="customers"?ge(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="operators"?_(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="drivers"?J(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="suppliers"?Ie(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId))):z==="rates"&&Te(Oe=>Oe.filter(Xe=>String(Xe.id)!=String(recId)&&String(Xe._id)!=String(recId)));try{const Oe=await fetch(`/api/${z}/${recId}`,{method:"DELETE",headers:We()});if(Oe.ok){Ee(`${z.charAt(0).toUpperCase()+z.slice(1)} record deleted successfully.`,"SUCCESS");await Dt();}else{const Xe=await Oe.json().catch(()=>({}));Ee(Xe.error||"Failed to delete record.","ERROR");await Dt();}}catch(err){console.error("Delete error:",err);Ee("Record removed locally.","INFO");}finally{w(!1);}}';

if (bundle.includes(oldHaTarget)) {
  bundle = bundle.replace(oldHaTarget, newHaTarget);
  console.log('1. Patched ha to instant delete without blocking confirm!');
} else {
  console.warn('oldHaTarget pattern not found');
}

// Ensure ve in Bo extracts recId and calls s(recId) immediately
const oldVeTarget = 've=D=>{const recId=(typeof D==="object"&&D!==null)?(D.id||D._id):D;s(recId)}';
const newVeTarget = 've=D=>{const recId=(typeof D==="object"&&D!==null)?(D.id||D._id):D;s(recId)}';
if (bundle.includes(oldVeTarget)) {
  console.log('2. ve handler already up to date in Bo.');
}

// Write to public and dist
fs.writeFileSync(publicBundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist/assets/index-Dbowi09z.js');
}

console.log('Instant delete patch completed!');
