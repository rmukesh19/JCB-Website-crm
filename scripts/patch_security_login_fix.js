import fs from 'fs';
import path from 'path';

const publicBundlePath = path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js');
const distBundlePath = path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundlePath, 'utf8');
console.log('Original bundle length:', bundle.length);

// 1. In fde, ensure token and user state validation from localStorage
const oldTokenState = 'const[e,t]=Y.useState(localStorage.getItem("jcb360_token")),[n,r]=Y.useState(()=>{const z=localStorage.getItem("jcb360_user");return z?JSON.parse(z):null})';
const newTokenState = 'const[e,t]=Y.useState(()=>{const tok=localStorage.getItem("jcb360_token");return(tok&&tok!=="null"&&tok!=="undefined"&&tok.trim()!=="")?tok:null}),[n,r]=Y.useState(()=>{try{const z=localStorage.getItem("jcb360_user");return(z&&z!=="null"&&z!=="undefined")?JSON.parse(z):null}catch(e){return null}})';

if (bundle.includes(oldTokenState)) {
  bundle = bundle.replace(oldTokenState, newTokenState);
  console.log('1. Patched token and user state initialization');
} else {
  console.log('1. Token state check skipped or already updated');
}

// 2. Clear default pre-filled admin credentials in login form
const oldAdminCreds = '[O,E]=Y.useState("admin"),[k,P]=Y.useState("admin")';
const newAdminCreds = '[O,E]=Y.useState(""),[k,P]=Y.useState("")';

if (bundle.includes(oldAdminCreds)) {
  bundle = bundle.replace(oldAdminCreds, newAdminCreds);
  console.log('2. Cleared pre-filled credentials in login form');
} else {
  console.log('2. Login credentials check skipped or already cleared');
}

// 3. In fde, add session validation on load via /api/auth/me
const oldUseEffect = 'Y.useEffect(()=>{localStorage.setItem("jcb360_language",s)},[s]);';
const newUseEffect = 'Y.useEffect(()=>{localStorage.setItem("jcb360_language",s)},[s]);Y.useEffect(()=>{const tok=localStorage.getItem("jcb360_token");if(tok&&tok!=="null"&&tok!=="undefined"&&tok.trim()!==""){fetch("/api/auth/me",{headers:{"Content-Type":"application/json",Authorization:tok}}).then(res=>{if(!res.ok){localStorage.removeItem("jcb360_token");localStorage.removeItem("jcb360_user");t(null);r(null);}else{return res.json();}}).then(data=>{if(data&&data.user){r(data.user);try{localStorage.setItem("jcb360_user",JSON.stringify(data.user));}catch(err){}}}).catch(()=>{});}else{localStorage.removeItem("jcb360_token");localStorage.removeItem("jcb360_user");t(null);r(null);}},[]);';

if (bundle.includes(oldUseEffect) && !bundle.includes('fetch("/api/auth/me"')) {
  bundle = bundle.replace(oldUseEffect, newUseEffect);
  console.log('3. Injected session validation effect with /api/auth/me');
} else {
  console.log('3. Session validation check skipped or already present');
}

// 4. In Rt fetch helper, catch 401 and 403 to immediately force logout and show login screen
const oldRtCheck = 'const ze=await fetch(z,we),mt=ze.headers.get("content-type")||"";return ze.ok&&mt.includes("application/json")?ze:ze.ok?{ok:!1,status:ze.status,json:async()=>[]}:ze';
const newRtCheck = 'const ze=await fetch(z,we),mt=ze.headers.get("content-type")||"";if(ze.status===401||ze.status===403){localStorage.removeItem("jcb360_token");localStorage.removeItem("jcb360_user");t(null);r(null);return{ok:!1,status:ze.status,json:async()=>[]};}return ze.ok&&mt.includes("application/json")?ze:ze.ok?{ok:!1,status:ze.status,json:async()=>[]}:ze';

if (bundle.includes(oldRtCheck)) {
  bundle = bundle.replace(oldRtCheck, newRtCheck);
  console.log('4. Updated Rt helper to force logout on 401/403');
} else {
  console.log('4. Rt helper check skipped or already updated');
}

// 5. In login handler Ur, ensure token and user are verified from backend response
const oldUr = 'we.ok&&Oe.success?(localStorage.setItem("jcb360_token",Oe.token),localStorage.setItem("jcb360_user",JSON.stringify(Oe.user)),t(Oe.token),r(Oe.user),Q(Oe.user.companyId),he(Oe.user.branchId),Ee(`Welcome back, ${Oe.user.name}! Connected to ${Oe.user.companyName}`,"SUCCESS")):A(Oe.message||"Invalid username or credentials.")';
const newUr = 'we.ok&&Oe.success&&Oe.token?(localStorage.setItem("jcb360_token",Oe.token),localStorage.setItem("jcb360_user",JSON.stringify(Oe.user)),t(Oe.token),r(Oe.user),Q(Oe.user.companyId||1),he(Oe.user.branchId||1),Ee(`Welcome back, ${Oe.user.name}! Connected to ${Oe.user.companyName}`,"SUCCESS")):A(Oe.error||Oe.message||"Invalid username or password.")';

if (bundle.includes(oldUr)) {
  bundle = bundle.replace(oldUr, newUr);
  console.log('5. Updated login handler Ur with strict token checks');
} else {
  console.log('5. Ur check skipped or already updated');
}

fs.writeFileSync(publicBundlePath, bundle, 'utf8');
if (fs.existsSync(distBundlePath)) {
  fs.writeFileSync(distBundlePath, bundle, 'utf8');
  console.log('Updated dist bundle');
}

console.log('Security & Login Protection Patch Complete!');
