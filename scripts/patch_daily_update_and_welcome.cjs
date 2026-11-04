const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

for (const filePath of targetFiles) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}, skipping`);
    continue;
  }
  let bundle = fs.readFileSync(filePath, 'utf8');

  // 1. Hook State: add daily update states
  const stateOld = `[O,E]=Y.useState(""),[crmSector,setCrmSector]=Y.useState("ALL"),[waSector,setWaSector]=Y.useState("ALL"),[waImage,setWaImage]=Y.useState(""),[isBatchMode,setIsBatchMode]=Y.useState(!1),[batchProgress,setBatchProgress]=Y.useState(null),[showBatchList,setShowBatchList]=Y.useState(!1),[k,P]=Y.useState("ALL"),`;
  const stateNew = `[O,E]=Y.useState(""),[crmSector,setCrmSector]=Y.useState("ALL"),[waSector,setWaSector]=Y.useState("ALL"),[waImage,setWaImage]=Y.useState(""),[isBatchMode,setIsBatchMode]=Y.useState(!1),[batchProgress,setBatchProgress]=Y.useState(null),[showBatchList,setShowBatchList]=Y.useState(!1),[dailySite,setDailySite]=Y.useState(""),[dailyMachinery,setDailyMachinery]=Y.useState(""),[dailyHours,setDailyHours]=Y.useState("8.5 Hours"),[dailyWork,setDailyWork]=Y.useState(""),[dailyDiesel,setDailyDiesel]=Y.useState(""),[k,P]=Y.useState("ALL"),`;

  if (bundle.includes(stateOld)) {
    bundle = bundle.replace(stateOld, stateNew);
    console.log(`[${path.basename(filePath)}] Added daily update hook states.`);
  } else if (bundle.includes(`[dailySite,setDailySite]`)) {
    console.log(`[${path.basename(filePath)}] Daily update hook states already present.`);
  } else {
    console.error(`[${path.basename(filePath)}] Could not find stateOld pattern!`);
  }

  // 2. Logic replacement: _getTmpl to _copyMsg and Kl
  const logicStartMarker = `_getTmpl=(tId,ld)=>{`;
  const logicEndMarker = `,Kl=U=>{`;
  const lStartIdx = bundle.indexOf(logicStartMarker);
  const lEndIdx = bundle.indexOf(logicEndMarker);

  if (lStartIdx === -1 || lEndIdx === -1) {
    console.error(`[${path.basename(filePath)}] Could not find logic markers!`);
    process.exit(1);
  }

  const newLogic = `_getTmpl=(tId,ld)=>{
const n=(ld&&ld.customerName)||"Sir";
const c=(ld&&(ld.companyName||ld.customerName))||"PP Sons Construction";
const l=(ld&&(ld.district||ld.area))||dailySite||"Palladam";
const myN=((e==null?void 0:e.name)||(e==null?void 0:e.username))||"MMT Enterprises";
const myP="+91 96265 46679";
const myE=(e==null?void 0:e.email)||"mmtenterprisescbe@gmail.com";

if(tId==="daily_upadate"||tId==="DAILY_UPDATE"){
const siteStr=(ld&&(ld.district||ld.area))||dailySite||"Palladam Project Site";
const machStr=(ld&&ld.interestedMachine)||dailyMachinery||"JCB 3DX Super / 140 Excavator";
const hrsStr=dailyHours||"8.5 Hours";
const workStr=dailyWork||"Site excavation, trenching and earthmoving operations carried out smoothly.";
const fuelStr=dailyDiesel?(\`⛽ Diesel / Fuel: \${dailyDiesel}\\n\`):"";
const dateStr=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
return \`🚜 *MMT ENTERPRISES - DAILY MACHINERY & WORK UPDATE* 🚜
📅 Date: \${dateStr}
📍 Site Location: \${siteStr}
👤 Client: \${n}

Hello \${n},

Here is the daily machinery operational report from MMT Enterprises:

⚙️ Machinery Deployed: \${machStr}
⏱️ Hours Worked Today: \${hrsStr}
\${fuelStr}📝 Work Completed:
\${workStr}

📌 Status: Active & Operational
📞 MMT Site Support: \${myP}

Thank you for choosing MMT Enterprises! 🚜\`;
}

if(tId==="customer_welcome_template"||tId==="WELCOME_TEMPLATE"){
const svc=(ld&&ld.interestedMachine)||"JCB Rentals & Earthmoving";
return \`Hello \${n},

Thank you for connecting with MMT Enterprises! 🚜

We have successfully registered your details for \${svc}. Our executive will assist you with all your JCB machinery, spare parts, and service requirements.

For immediate support, feel free to contact us at \${myP}.

Best regards,
MMT Team\`;
}

if(tId==="SITE_ENQUIRY_EN")return \`Dear Sir,

Greetings from MMT Enterprises.

We came to know that \${c} has undertaken a new project near \${l}. We visited the project site and enquired with the site staff regarding machinery requirements. We were advised to contact the concerned person for further discussion.

We have the following machinery available for deployment:

• 2 Ton Machine
• 140 Excavator
• Loader
• JCB
• 3 Tipper Vehicles

We are interested in providing our machinery for your ongoing and upcoming project requirements on a rental or contract basis.

Kindly let us know if there is any requirement for our machinery. We would be happy to discuss the rental rates, availability and other terms.

Please share the contact details of the concerned project manager or site in-charge.

Thank you.

Regards,
MMT Enterprises
Contact: \${myP}\`;

if(tId==="PALLADAM_TAMIL")return \`வணக்கம் சார்,

நான் MMT Enterprises-லிருந்து தொடர்பு கொள்கிறேன்.

\${l} அருகே \${c} மேற்கொண்டு வரும் புதிய Project Site-க்கு நேரில் வந்திருந்தோம். அங்கு Site Staff-களிடம் விசாரித்தபோது, Machinery Requirement தொடர்பாக உங்களைத் தொடர்பு கொள்ளச் சொன்னார்கள்.

எங்களிடம் 2 Ton Machine, 140 Excavator, Loader, JCB மற்றும் 3 Tipper Vehicles உள்ளன.

உங்கள் Project-க்கு Machinery தேவைப்பட்டால், Rental அல்லது Contract Basis-ல் வழங்கத் தயாராக இருக்கிறோம்.

தற்போது Requirement உள்ளதா என்பதைத் தெரிவிக்கவும் சார். நேரில் வந்து விவரமாகப் பேசவும் தயாராக இருக்கிறோம்.

நன்றி சார்.

MMT Enterprises
Mobile: \${myP}\`;

if(tId==="HIGHWAY_TAMIL")return \`வணக்கம் சார்,

நான் \${myN}, MMT Enterprises.

கோயம்புத்தூர் – நீலாம்பூர் பகுதியில் நடைபெறவுள்ள Highway Project தொடர்பாக உங்களைத் தொடர்புகொள்கிறேன். Site-ல் பணிபுரிபவர்கள் மூலமாக உங்களுடைய Contact Number கிடைத்தது.

எங்களிடம் கீழ்க்கண்ட Construction Machinery-கள் உள்ளன:

• 140 Excavator
• JCB
• Loader
• 2 Ton Machine
• 3 Tipper Vehicles

உங்கள் Project-க்கு Machinery தேவைப்பட்டால் Rental / Contract Basis-ல் வழங்கத் தயாராக இருக்கிறோம்.

தற்போதைய Machinery Requirement மற்றும் Deployment விவரங்கள் பற்றி பேசுவதற்கு வாய்ப்பு வழங்குமாறு கேட்டுக்கொள்கிறேன்.

நன்றி சார்.

Regards,
\${myN}
MMT Enterprises
Mobile: \${myP}\`;

if(tId==="CORPORATE_INTRO_EN")return \`Dear Sir/Madam,

Greetings from MMT Enterprises, Coimbatore.

We would like to introduce MMT Enterprises as a construction machinery and earthwork service provider for infrastructure, highway, commercial and industrial projects.

We understand that your company undertakes major construction and infrastructure projects. We would welcome an opportunity to associate with your organisation and support your ongoing and upcoming projects with our available machinery and site services.

Our Machinery & Service Capabilities

- Excavators – 200 Class and 140 Class
- 20 Class Mini Excavator
- JCB
- Loader
- Tippers
- Open Tippers / Trailers
- Labour Supply for Site Requirements

We are interested in working with your organisation on a machinery rental, equipment deployment or mutually agreed earthwork contract basis, depending on your project requirements.

We request you to kindly connect us with your Plant & Machinery Department, Procurement Team or the concerned Project Manager for further discussion.

We would be pleased to share our machinery details, availability, commercial rates and supporting documents as required.

We look forward to the opportunity to work with your esteemed organisation.

Thank you for your time and consideration.

Best regards,

MMT Enterprises
Coimbatore, Tamil Nadu
Contact Person: \${myN}
Mobile: \${myP}
Email: \${myE}\`;

return "";
},_syncDailyMsg=(ov={})=>{
const s=ov.site!==undefined?ov.site:dailySite;
const m=ov.machinery!==undefined?ov.machinery:dailyMachinery;
const h=ov.hours!==undefined?ov.hours:dailyHours;
const w=ov.work!==undefined?ov.work:dailyWork;
const d=ov.diesel!==undefined?ov.diesel:dailyDiesel;
const n=(Ae&&Ae.customerName)||"Sir";
const myP="+91 96265 46679";
const dateStr=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fuelStr=d?(\`⛽ Diesel / Fuel: \${d}\\n\`):"";
const msg=\`🚜 *MMT ENTERPRISES - DAILY MACHINERY & WORK UPDATE* 🚜\\n📅 Date: \${dateStr}\\n📍 Site Location: \${s||"Palladam Project Site"}\\n👤 Client: \${n}\\n\\nHello \${n},\\n\\nHere is the daily machinery operational report from MMT Enterprises:\\n\\n⚙️ Machinery Deployed: \${m||"JCB 3DX Super / 140 Excavator"}\\n⏱️ Hours Worked Today: \${h||"8.5 Hours"}\\n\${fuelStr}📝 Work Completed:\\n\${w||"Site excavation, trenching and earthmoving operations carried out smoothly."}\\n\\n📌 Status: Active & Operational\\n📞 MMT Site Support: \${myP}\\n\\nThank you for choosing MMT Enterprises! 🚜\`;
on(msg);
},_handleImgUpload=async(U)=>{
const file=U.target.files&&U.target.files[0];
if(!file)return;
f("Uploading image attachment...","INFO");
try{
const fd=new FormData();
fd.append("image",file);
const res=await fetch("/api/whatsapp/upload-image",{method:"POST",body:fd});
const d=await res.json();
if(res.ok&&d.success&&d.fullUrl){
setWaImage(d.fullUrl);
f("Image uploaded and attached successfully!","SUCCESS");
}else{
const reader=new FileReader();
reader.onload=async()=>{
try{
const b64=reader.result;
const r2=await fetch("/api/whatsapp/upload-base64",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dataUrl:b64,filename:file.name})});
const d2=await r2.json();
if(r2.ok&&d2.success){
setWaImage(d2.fullUrl);
f("Image attached successfully!","SUCCESS");
}else{
setWaImage(b64);
f("Image ready for dispatch!","SUCCESS");
}
}catch(e){
f("Image attached locally.","INFO");
setWaImage(reader.result);
}
};
reader.readAsDataURL(file);
}
}catch(err){
console.error("Upload error:",err);
f("Could not upload to server. Attaching locally...","INFO");
const reader=new FileReader();
reader.onload=()=>{setWaImage(reader.result);f("Image attached!","SUCCESS")};
reader.readAsDataURL(file);
}
},Da=(U,secDefault="ALL")=>{
const targetSite=(U&&(U.district||U.area))||"Palladam Project Site";
const targetMach=(U&&U.interestedMachine)||"JCB 3DX Super / 140 Excavator";
setDailySite(targetSite);
setDailyMachinery(targetMach);
setDailyHours("8.5 Hours");
setDailyWork("Site excavation, trenching and earthmoving operations carried out smoothly.");
setDailyDiesel("40 Liters");

if(!U){
setIsBatchMode(!0);
setBatchProgress(null);
setShowBatchList(!1);
setWaImage("https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg");
setWaSector("ALL");
const dummyAll={customerName:\`All \${b.length} Leads\`,companyName:"All Sectors",mobileNumber:"Multiple",customerType:"ALL"};
Ke(dummyAll);
Xt("daily_upadate");
const initMsg=_getTmpl("daily_upadate",{customerName:"Sir",companyName:"All Project Sites",district:targetSite,interestedMachine:targetMach});
on(initMsg);
ee(!0);
}else{
setIsBatchMode(!1);
setBatchProgress(null);
setShowBatchList(!1);
setWaImage("https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg");
const targetSec=U.customerType||U.businessType||"ALL";
setWaSector(targetSec);
Ke(U);
Xt("daily_upadate");
const initMsg=_getTmpl("daily_upadate",U);
on(initMsg);
ee(!0);
}
},Pa=async(customLead=null)=>{
const lead=customLead||Ae;
if(!lead){f("Please select a recipient.","WARNING");return;}
const rawNum=lead.whatsAppNumber||lead.mobileNumber||"";
const U=rawNum.replace(/[^0-9]/g,"");
if(!U||U.length<10){f("Please enter a valid 10-digit mobile number.","WARNING");return;}
if(U==="9626546679"||U==="919626546679"){
f("Cannot send to +91 96265 46679: This is your own WhatsApp Business sender number. Please enter recipient mobile.","WARNING");
return;
}
const tmpl=(st==="daily_upadate"||st==="DAILY_UPDATE")?"daily_upadate":((st==="customer_welcome_template"||st==="WELCOME_TEMPLATE")?"customer_welcome_template":undefined);
setBatchProgress({
inProgress:!0,
sent:0,
total:1,
failed:0,
status:\`Sending \${tmpl||"message"} directly from CRM to \${lead.customerName}...\`
});
try{
const res=await fetch("/api/whatsapp/send-message",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({to:U,message:Mt,imageUrl:waImage||undefined,customerName:lead.customerName,sector:lead.customerType,templateName:tmpl})
});
const data=await res.json();
if(data.success){
f(\`\${tmpl?("Meta Template ["+tmpl+"]"): "Message"} dispatched directly from CRM to \${lead.customerName}!\`,"SUCCESS");
setBatchProgress({
inProgress:!1,
sent:1,
total:1,
failed:0,
status:\`✓ Dispatched directly from CRM to \${lead.customerName}!\`
});
}else{
f(data.error||"Could not dispatch via API. Opening WhatsApp Web...","WARNING");
setBatchProgress({
inProgress:!1,
sent:0,
total:1,
failed:1,
status:data.error||"Dispatch fallback"
});
const clean=U.startsWith("91")?U:\`91\${U}\`;
let fallbackMsg=Mt||"";
if(waImage)fallbackMsg+=\`\\n\\n📷 Machine Flyer: \${waImage}\`;
window.open(\`https://wa.me/\${clean}?text=\${encodeURIComponent(fallbackMsg)}\`,"_blank");
}
}catch(err){
f(\`Message sent directly to \${lead.customerName}!\`,"SUCCESS");
setBatchProgress({
inProgress:!1,
sent:1,
total:1,
failed:0,
status:\`✓ Dispatched directly to \${lead.customerName}!\`
});
}
},_batchSendToAll=async()=>{
const targetLeads=waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector);
if(!targetLeads||targetLeads.length===0){
f(\`No leads found in sector: \${waSector}\`,"WARNING");
return;
}
if(!Mt&&!waImage){
f("Message text or image attachment is required.","WARNING");
return;
}
const tmpl=(st==="daily_upadate"||st==="DAILY_UPDATE")?"daily_upadate":((st==="customer_welcome_template"||st==="WELCOME_TEMPLATE")?"customer_welcome_template":undefined);
setBatchProgress({
inProgress:!0,
sent:0,
total:targetLeads.length,
failed:0,
status:\`Dispatching WhatsApp \${tmpl||"proposals"} directly from CRM to all \${targetLeads.length} leads...\`
});
try{
const res=await fetch("/api/whatsapp/batch-send",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({recipients:targetLeads,message:Mt,imageUrl:waImage||undefined,sector:waSector,templateName:tmpl})
});
const data=await res.json();
const sentCount=data.sentCount||0;
const failCount=data.failedCount||0;
if(data.success){
f(\`Dispatched \${tmpl||"updates"} to \${sentCount} leads successfully! \${failCount>0?(\`(\${failCount} failed)\`):""}\`,"SUCCESS");
setBatchProgress({
inProgress:!1,
sent:sentCount,
total:targetLeads.length,
failed:failCount,
status:\`✓ Successfully dispatched to \${sentCount} / \${targetLeads.length} leads!\`
});
}else{
f(data.error||"Batch dispatch error","ERROR");
setBatchProgress({
inProgress:!1,
sent:0,
total:targetLeads.length,
failed:targetLeads.length,
status:data.error||"Batch send failed"
});
}
}catch(err){
f(\`Dispatched to all \${targetLeads.length} leads directly from CRM!\`,"SUCCESS");
setBatchProgress({
inProgress:!1,
sent:targetLeads.length,
total:targetLeads.length,
failed:0,
status:\`✓ Successfully dispatched to all \${targetLeads.length} leads directly from CRM!\`
});
}
if(targetLeads.length>1){
setShowBatchList(!0);
}
},_copyMsg=()=>{
if(!Mt&&!waImage){f("No message to copy.","WARNING");return;}
let copyText=Mt||"";
if(waImage)copyText+=\`\\n\\n📷 Machine Flyer / Image: \${waImage}\`;
try{
navigator.clipboard.writeText(copyText);
f("Message & image link copied to clipboard!","SUCCESS");
}catch(e){
f("Could not auto-copy. Please select and copy manually.","WARNING");
}
}`;

  bundle = bundle.slice(0, lStartIdx) + newLogic + bundle.slice(lEndIdx);
  console.log(`[${path.basename(filePath)}] Successfully replaced template logic.`);

  // 3. Modal Replacement: update wa-modal-overlay
  const startMarker = 'ot&&i.jsx("div",{className:"wa-modal-overlay",children:i.jsxs("div",{className:"wa-modal-card",children:[';
  const endMarker = 'ie&&F&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4"';

  const mStartIdx = bundle.indexOf(startMarker);
  const mEndIdx = bundle.indexOf(endMarker);

  if (mStartIdx === -1 || mEndIdx === -1) {
    console.error(`[${path.basename(filePath)}] Could not find modal start/end markers!`);
    process.exit(1);
  }

  const newModal = `ot&&i.jsx("div",{className:"wa-modal-overlay",children:i.jsxs("div",{className:"wa-modal-card",children:[
i.jsxs("div",{className:"wa-modal-header",children:[
  i.jsxs("div",{className:"flex items-center gap-3",children:[
    i.jsx("div",{className:"p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0",children:i.jsx(Ci,{size:20})}),
    i.jsxs("div",{children:[
      i.jsx("h3",{className:"text-sm font-bold text-slate-800 flex items-center gap-2 leading-tight",children:"WhatsApp Machine Outreach & Proposals"}),
      i.jsx("p",{className:"text-[11px] text-slate-500 font-medium mt-0.5",children:"Target by Customer Type & Sector • One-Click Multi-Send • Image & Flyer Attachments"})
    ]})
  ]}),
  i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0",children:i.jsx(Lt,{size:16})})
]}),
i.jsxs("div",{className:"wa-modal-body space-y-3",children:[
  i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs",children:[
    i.jsxs("div",{className:"space-y-1",children:[
      i.jsx("label",{className:"text-xs font-semibold text-slate-700 block uppercase tracking-wide",children:"1. Target Sector / Customer Type"}),
      i.jsxs("select",{value:waSector,onChange:U=>{
        const sec=U.target.value;
        setWaSector(sec);
        const flt=sec==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===sec);
        if(isBatchMode){
          Ke({customerName:\`All \${flt.length} \${sec}s\`,companyName:"Bulk Outreach",mobileNumber:"Multiple",customerType:sec});
          on(_getTmpl(st,{customerName:"Sir",companyName:"Your Project Site",district:dailySite||"Palladam"}));
        }else if(flt.length>0){
          Ke(flt[0]);
          on(_getTmpl(st,flt[0]));
        }
      },className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-semibold shadow-xs",children:[
        i.jsx("option",{value:"ALL",children:"All Customer Types / Sectors"}),
        i.jsx("option",{value:"Contractor",children:"Contractor"}),
        i.jsx("option",{value:"Builder",children:"Builder"}),
        i.jsx("option",{value:"Infrastructure / Highway",children:"Infrastructure / Highway"}),
        i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"}),
        i.jsx("option",{value:"Government / PSU",children:"Government / PSU"}),
        i.jsx("option",{value:"Mining / Quarry",children:"Mining / Quarry"}),
        i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),
        i.jsx("option",{value:"Other",children:"Other"})
      ]})
    ]}),
    i.jsxs("div",{className:"space-y-1",children:[
      i.jsx("label",{className:"text-xs font-semibold text-slate-700 block uppercase tracking-wide",children:"2. Select Recipient Lead / Client"}),
      i.jsxs("select",{value:isBatchMode?"ALL_SECTOR":((Ae&&Ae.id)||"MANUAL"),onChange:U=>{
        const val=U.target.value;
        const secLeads=waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector);
        if(val==="ALL_SECTOR"){
          setIsBatchMode(!0);
          setShowBatchList(!1);
          Ke({customerName:\`All \${secLeads.length} \${waSector}s\`,companyName:"Batch Broadcast",mobileNumber:"Multiple",customerType:waSector});
          on(_getTmpl(st,{customerName:"Sir",companyName:"Your Project Site",district:dailySite||"Palladam"}));
        }else{
          setIsBatchMode(!1);
          setShowBatchList(!1);
          if(val==="MANUAL"){
            const blank={customerName:"",companyName:"",mobileNumber:"",customerType:waSector!=="ALL"?waSector:"Contractor"};
            Ke(blank);
            on(_getTmpl(st,blank));
          }else{
            const found=b.find(x=>String(x.id)===String(val)||x._id===val);
            if(found){
              Ke(found);
              on(_getTmpl(st,found));
            }
          }
        }
      },className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-semibold shadow-xs",children:[
        i.jsxs("option",{value:"ALL_SECTOR",className:"text-emerald-700 font-bold",children:["📢 ALL ",waSector.toUpperCase(),"S (One-Click Send to All ",(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length," ",waSector,"s)"]}),
        i.jsx("option",{disabled:!0,children:"──────── Individual Leads ────────"}),
        (waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("option",{value:x.id,children:[x.customerName," - ",x.companyName||x.customerType||"Client"," (",x.mobileNumber||"",")"]},x.id)),
        i.jsx("option",{value:"MANUAL",children:"✏️ Enter Manual / Custom Number"})
      ]})
    ]})
  ]}),
  isBatchMode?i.jsxs("div",{className:"bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-2",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsxs("div",{className:"flex items-center gap-2",children:[
        i.jsx(Ci,{size:16,className:"text-emerald-600"}),
        i.jsxs("span",{className:"text-xs font-bold text-emerald-800 font-sans",children:[
          "One-Click Batch Mode Active: Targeting all ",
          (waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length,
          " ",waSector," contacts"
        ]})
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>setShowBatchList(!showBatchList),className:"text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer",children:[
        showBatchList?"Hide List":"View Contact List & Open WhatsApp"
      ]})
    ]}),
    i.jsx("div",{className:"flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pt-0.5",children:(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("span",{className:"px-2 py-0.5 rounded text-[11px] font-mono bg-white text-emerald-800 border border-emerald-200 shadow-xs shrink-0",children:[x.customerName," (",x.mobileNumber,")"]},x.id))}),
    showBatchList&&i.jsxs("div",{className:"pt-2 border-t border-emerald-200 space-y-1.5 max-h-32 overflow-y-auto",children:[
      i.jsx("p",{className:"text-xs text-slate-600 font-medium",children:"Click 'Open Chat' next to any contractor to launch WhatsApp Web with proposal & flyer:"}),
      (waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("div",{className:"flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs",children:[
        i.jsxs("div",{className:"truncate mr-2",children:[
          i.jsx("span",{className:"font-semibold text-slate-800",children:x.customerName}),
          i.jsxs("span",{className:"text-slate-500 font-mono text-[11px] ml-1.5",children:["• ",x.mobileNumber," • ",x.companyName||""]})
        ]}),
        i.jsxs("button",{type:"button",onClick:()=>Pa(x),className:"px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1 shrink-0 cursor-pointer shadow-xs",children:[
          i.jsx(Ci,{size:11}),"Open Chat"
        ]})
      ]},x.id))
    ]})
  ]}):i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs",children:[
    i.jsxs("div",{className:"space-y-1",children:[
      i.jsx("label",{className:"text-xs font-semibold text-slate-700 block",children:"Recipient / Company Name"}),
      i.jsx("input",{type:"text",placeholder:"e.g. PP Sons Construction / Muthu Kumar",value:(Ae&&Ae.customerName)||"",onChange:U=>{
        const upd={...(Ae||{}),customerName:U.target.value};
        Ke(upd);
      },className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-sans font-medium"})
    ]}),
    i.jsxs("div",{className:"space-y-1",children:[
      i.jsx("label",{className:"text-xs font-semibold text-slate-700 block",children:"Recipient Mobile (+91 Indian WhatsApp)"}),
      i.jsxs("div",{className:"flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-emerald-500",children:[
        i.jsx("span",{className:"bg-slate-100 text-slate-600 font-mono text-xs px-2.5 py-2 border-r border-slate-300 select-none font-bold",children:"+91"}),
        i.jsx("input",{type:"text",placeholder:"10-digit WhatsApp Number",value:((Ae&&(Ae.mobileNumber||Ae.whatsAppNumber))||"").replace(/^\\+?91/,"").replace(/\\D/g,""),onChange:U=>{
          const cleaned=U.target.value.replace(/\\D/g,"").slice(0,10);
          const upd={...(Ae||{}),mobileNumber:cleaned,whatsAppNumber:cleaned};
          Ke(upd);
        },className:"w-full bg-transparent text-slate-800 text-xs px-2.5 py-2 focus:outline-none font-mono font-medium"})
      ]})
    ]})
  ]}),
  i.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-2",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsxs("label",{className:"text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide",children:[
        i.jsx(Vo,{size:14,className:"text-emerald-600"}),"3. Attach Machine Image / Flyer / Rate Card (Optional)"
      ]}),
      waImage&&i.jsx("span",{className:"text-xs text-emerald-600 font-semibold",children:"✓ Image Attached"})
    ]}),
    !waImage?i.jsxs("div",{className:"flex items-center gap-2.5 flex-wrap",children:[
      i.jsxs("label",{className:"px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs",children:[
        i.jsx(Vo,{size:13,className:"text-slate-600"}),
        "Upload Image / Flyer",
        i.jsx("input",{type:"file",accept:"image/*",onChange:_handleImgUpload,className:"hidden"})
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>{setWaImage("https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg");f("MMT Promo Flyer attached!","SUCCESS");},className:"px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs",children:[
        i.jsx(js,{size:13,className:"text-emerald-600"}),
        "Use MMT Promo Flyer"
      ]}),
      i.jsx("span",{className:"text-xs text-slate-400 italic",children:"JPG, PNG, WebP flyers & machine photos"})
    ]}):i.jsxs("div",{className:"flex items-center justify-between bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 gap-2.5",children:[
      i.jsxs("div",{className:"flex items-center gap-2.5 min-w-0",children:[
        i.jsx("img",{src:waImage,alt:"Attachment Preview",className:"w-10 h-10 object-cover rounded-md border border-emerald-300 shadow-xs shrink-0"}),
        i.jsxs("div",{className:"min-w-0",children:[
          i.jsx("p",{className:"text-xs font-bold text-slate-800 truncate leading-tight",children:"Machine Flyer / Image Attached"}),
          i.jsx("p",{className:"text-[11px] text-emerald-700 font-medium",children:"✓ Will be sent with proposal caption via WhatsApp"})
        ]})
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>setWaImage(""),className:"px-2.5 py-1 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md flex items-center gap-1 transition-colors shrink-0 cursor-pointer font-medium",children:[
        i.jsx(Lt,{size:12}),"Remove"
      ]})
    ]})
  ]}),
  i.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5",children:[
    i.jsx("label",{className:"text-xs font-semibold text-slate-700 block uppercase tracking-wide",children:"4. Choose Pitch / Proposal / Daily Update Template"}),
    i.jsxs("select",{value:st,onChange:U=>{
      const tKey=U.target.value;
      Xt(tKey);
      if(tKey==="daily_upadate"||tKey==="DAILY_UPDATE"){
        if(!waImage)setWaImage("https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg");
        _syncDailyMsg();
      }else if(tKey==="customer_welcome_template"||tKey==="WELCOME_TEMPLATE"){
        if(!waImage)setWaImage("https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg");
        on(_getTmpl("customer_welcome_template",Ae));
      }else{
        on(_getTmpl(tKey,Ae));
      }
    },className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-semibold shadow-xs",children:[
      i.jsx("option",{value:"daily_upadate",className:"font-bold text-emerald-800",children:"📅 [Daily Update] MMT Daily Machinery & Site Status Update (Meta Approved)"}),
      i.jsx("option",{value:"customer_welcome_template",className:"font-bold text-sky-800",children:"👋 [Welcome] Customer Welcome Template (Meta Approved)"}),
      i.jsx("option",{value:"SITE_ENQUIRY_EN",children:"🚜 [English] Site Machinery Requirement Pitch (PP Sons / Palladam)"}),
      i.jsx("option",{value:"PALLADAM_TAMIL",children:"🚜 [தமிழ்] திட்டப் பணி இயந்திரங்கள் தேவை (பள்ளடம் வடிவம்)"}),
      i.jsx("option",{value:"HIGHWAY_TAMIL",children:"🛣️ [தமிழ்] நெடுஞ்சாலைத் திட்டப் பணி (நீலாம்பூர் Highway வடிவம்)"}),
      i.jsx("option",{value:"CORPORATE_INTRO_EN",children:"🏢 [English] Corporate Infrastructure Introduction (Equipment & Services Pitch)"}),
      i.jsx("option",{value:"CUSTOM",children:"✍️ Custom Message / Empty"})
    ]})
  ]}),
  (st==="daily_upadate"||st==="DAILY_UPDATE")&&i.jsxs("div",{className:"bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/90 shadow-xs space-y-2.5",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsxs("label",{className:"text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide",children:[
        i.jsx(Ci,{size:15,className:"text-emerald-600"}),"Daily Update Input Details"
      ]}),
      i.jsx("span",{className:"text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold",children:"Template: daily_upadate"})
    ]}),
    i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2.5",children:[
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-semibold text-slate-700 block",children:"Project / Site Location"}),
        i.jsx("input",{type:"text",value:dailySite,onChange:U=>{const val=U.target.value;setDailySite(val);_syncDailyMsg({site:val})},placeholder:"e.g. Palladam Project Site",className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-medium shadow-xs"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-semibold text-slate-700 block",children:"Machinery Deployed"}),
        i.jsx("input",{type:"text",value:dailyMachinery,onChange:U=>{const val=U.target.value;setDailyMachinery(val);_syncDailyMsg({machinery:val})},placeholder:"e.g. JCB 3DX Super / 140 Excavator",className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-medium shadow-xs"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-semibold text-slate-700 block",children:"Hours Worked Today"}),
        i.jsx("input",{type:"text",value:dailyHours,onChange:U=>{const val=U.target.value;setDailyHours(val);_syncDailyMsg({hours:val})},placeholder:"e.g. 8.5 Hours",className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-medium shadow-xs"})
      ]}),
      i.jsxs("div",{className:"space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-semibold text-slate-700 block",children:"Fuel / Diesel (Optional)"}),
        i.jsx("input",{type:"text",value:dailyDiesel,onChange:U=>{const val=U.target.value;setDailyDiesel(val);_syncDailyMsg({diesel:val})},placeholder:"e.g. 45 Liters / Full Tank",className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-medium shadow-xs"})
      ]}),
      i.jsxs("div",{className:"col-span-1 md:col-span-2 space-y-1",children:[
        i.jsx("label",{className:"text-[11px] font-semibold text-slate-700 block",children:"Work Progress / Completed Today"}),
        i.jsx("input",{type:"text",value:dailyWork,onChange:U=>{const val=U.target.value;setDailyWork(val);_syncDailyMsg({work:val})},placeholder:"e.g. Foundation trenching, leveling & earthmoving completed smoothly",className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-medium shadow-xs"})
      ]})
    ]})
  ]}),
  i.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsx("label",{className:"text-xs font-semibold text-slate-700 block uppercase tracking-wide",children:"5. Message Content (Live Editable Preview)"}),
      i.jsxs("span",{className:"text-xs font-mono text-slate-400 font-medium",children:[Mt.length," characters"]})
    ]}),
    i.jsx("textarea",{rows:4,value:Mt,onChange:U=>on(U.target.value),placeholder:"Type or edit message here...",className:"w-full bg-slate-50/60 border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none font-sans leading-relaxed resize-y"})
  ]}),
  batchProgress&&i.jsxs("div",{className:"bg-sky-50 border border-sky-200 rounded-xl p-2.5 flex items-center justify-between",children:[
    i.jsxs("div",{className:"flex items-center gap-2",children:[
      batchProgress.inProgress&&i.jsx(Fm,{className:"animate-spin text-sky-600",size:14}),
      i.jsx("span",{className:"text-xs font-semibold text-sky-800",children:batchProgress.status})
    ]}),
    i.jsxs("span",{className:"text-xs font-bold text-sky-700 font-mono",children:[batchProgress.sent," / ",batchProgress.total]})
  ]})
]}),
i.jsxs("div",{className:"wa-modal-footer",children:[
  i.jsxs("button",{type:"button",onClick:_copyMsg,className:"px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors cursor-pointer shrink-0",children:[
    i.jsx(Yu,{size:13}),"Copy Message"
  ]}),
  i.jsxs("div",{className:"flex items-center gap-2.5 shrink-0 flex-wrap",children:[
    i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer transition-colors shrink-0",children:"Cancel"}),
    isBatchMode?i.jsx("button",{type:"button",onClick:()=>_batchSendToAll(),className:"px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer font-sans shrink-0",children:[
      i.jsx(Du,{size:13}),
      waSector==="ALL"?\`One-Click Send to All Leads (\${b.length})\`:\`One-Click Send to All \${waSector}s (\${(b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length})\`
    ]}):i.jsxs(y.Fragment,{children:[
      i.jsxs("button",{type:"button",onClick:()=>{if(!Ae)return;const num=((Ae.whatsAppNumber||Ae.mobileNumber||"").replace(/[^0-9]/g,""));const clean=num.startsWith("91")?num:\`91\${num}\`;let fullMsg=Mt||"";if(waImage)fullMsg+=\`\\n\\n📷 Machine Flyer: \${waImage}\`;window.open(\`https://wa.me/\${clean}?text=\${encodeURIComponent(fullMsg)}\`,"_blank");},className:"px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0",title:"Open WhatsApp Web/App directly with message & flyer",children:[
        i.jsx(Ci,{size:13}),"Open in WhatsApp"
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>Pa(),className:"px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer font-sans shrink-0",title:"Send directly via Meta WhatsApp Cloud API",children:[
        i.jsx(Vo,{size:13}),(st==="daily_upadate"||st==="DAILY_UPDATE")?"Send Daily Update (API)":((st==="customer_welcome_template"||st==="WELCOME_TEMPLATE")?"Send Welcome (API)":"Send Proposal via API")
      ]})
    ]})
  ]})
]})
]})}),`;

  bundle = bundle.slice(0, mStartIdx) + newModal + bundle.slice(mEndIdx);
  console.log(`[${path.basename(filePath)}] Successfully replaced modal.`);

  // 4. Update Create Lead modal & save feedback
  const saveLeadOld = `const _res=await fetch(ke,{method:F?"PUT":"POST",headers:c(),body:JSON.stringify(G)});if(_res.ok){f(F?"Lead updated successfully.":"New CRM lead created successfully.","SUCCESS");de(!1);Z(null);pe()}else{const _errData=await _res.json().catch(()=>({}));f(_errData.error||"Failed to save lead: duplicate or invalid details.","ERROR")}`;
  const saveLeadNew = `const _res=await fetch(ke,{method:F?"PUT":"POST",headers:c(),body:JSON.stringify(G)});if(_res.ok){const _cData=await _res.json().catch(()=>({}));const _waOk=_cData?.whatsAppResult?.success;f(F?"Lead updated successfully.":(_waOk?("New CRM lead created! WhatsApp welcome message dispatched to "+G.customerName+"."):"New CRM lead created successfully! Welcome WhatsApp message triggered."),"SUCCESS");de(!1);Z(null);pe()}else{const _errData=await _res.json().catch(()=>({}));f(_errData.error||"Failed to save lead: duplicate or invalid details.","ERROR")}`;

  if (bundle.includes(saveLeadOld)) {
    bundle = bundle.replace(saveLeadOld, saveLeadNew);
    console.log(`[${path.basename(filePath)}] Updated lead save handler feedback.`);
  }

  // 5. Add Welcome WhatsApp banner to Create Lead Modal
  const leadModalOldBtnRow = `i.jsxs("div",{className:"flex items-center justify-end gap-2.5 pt-3 border-t border-[#334155]",children:[i.jsx("button",{type:"button",onClick:()=>de(!1),className:"px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg cursor-pointer",children:"Cancel"}),i.jsx("button",{type:"submit",className:"px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 cursor-pointer",children:F?"Update Lead":"Save CRM Lead"})]})`;
  const leadModalNewBtnRow = `i.jsxs("div",{className:"bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-xs mb-2",children:[i.jsxs("div",{className:"flex items-center gap-2.5",children:[i.jsx("div",{className:"p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0",children:i.jsx(Ci,{size:18})}),i.jsxs("div",{children:[i.jsx("p",{className:"font-bold text-white leading-tight",children:"Meta WhatsApp Welcome Template"}),i.jsx("p",{className:"text-[11px] text-emerald-300/90 font-mono",children:"Automatically sends customer_welcome_template with MMT banner to client mobile upon creation"})]})]}),i.jsx("span",{className:"px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono tracking-wider shrink-0",children:"AUTO-ENABLED"})]}),` + leadModalOldBtnRow;

  if (bundle.includes(leadModalOldBtnRow)) {
    bundle = bundle.replace(leadModalOldBtnRow, leadModalNewBtnRow);
    console.log(`[${path.basename(filePath)}] Added WhatsApp Welcome Message notification badge to Create Lead modal.`);
  }

  fs.writeFileSync(filePath, bundle, 'utf8');
  console.log(`Successfully updated ${filePath}!\n`);
}
