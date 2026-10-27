const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

// 1. Hook state declaration
const stateTarget = `[O,E]=Y.useState(""),[k,P]=Y.useState("ALL"),[R,L]=Y.useState("ALL"),[M,H]=Y.useState("ALL"),[$,V]=Y.useState("ALL"),[K,ve]=Y.useState("ALL"),`;
const stateReplacement = `[O,E]=Y.useState(""),[crmSector,setCrmSector]=Y.useState("ALL"),[waSector,setWaSector]=Y.useState("ALL"),[k,P]=Y.useState("ALL"),[R,L]=Y.useState("ALL"),[M,H]=Y.useState("ALL"),[$,V]=Y.useState("ALL"),[K,ve]=Y.useState("ALL"),`;

// 2. Gr filter logic replacement
const grTarget = `dt=$==="ALL"||U.marketingExecutive===$,ft=K==="ALL"||K==="NEW"&&U.status==="NEW"||K==="DISCUSSION"&&["CONTACTED","FOLLOW_UP","INTERESTED","NEGOTIATION"].includes(U.status)||K==="QUOTED"&&U.status==="QUOTATION_SENT"||K==="CONVERTED"&&U.status==="CONVERTED"||K==="LOST"&&U.status==="LOST";return ke&&Ye&&Je&&xt&&dt&&ft}),Gs=U=>`;
const grReplacement = `dt=$==="ALL"||U.marketingExecutive===$,ft=K==="ALL"||K==="NEW"&&U.status==="NEW"||K==="DISCUSSION"&&["CONTACTED","FOLLOW_UP","INTERESTED","NEGOTIATION"].includes(U.status)||K==="QUOTED"&&U.status==="QUOTATION_SENT"||K==="CONVERTED"&&U.status==="CONVERTED"||K==="LOST"&&U.status==="LOST";const _secOk=crmSector==="ALL"||(U.customerType||U.businessType||"Contractor")===crmSector;return ke&&Ye&&Je&&xt&&dt&&ft&&_secOk}),Gs=U=>`;

// 3. Da and Pa definition
const daPaTarget = `Da=U=>{Ke(U);const ke=\`Hello \${U.customerName},
Thank you for reaching out to JCB 360 Fleet Solutions regarding your \${U.interestedMachine||"Machinery"} requirement. How can we assist your project today?\`;on(ke),ee(!0)},Pa=()=>{if(!Ae)return;const U=(Ae.whatsAppNumber||Ae.mobileNumber||"").replace(/[^0-9]/g,""),ke=U.startsWith("91")?U:\`91\${U}\`,Ye=encodeURIComponent(Mt),Je=\`https://wa.me/\${ke}?text=\${Ye}\`;window.open(Je,"_blank"),f(\`WhatsApp message opened for \${Ae.customerName}.\`,"SUCCESS"),ee(!1)},Kl=U=>{`;

const daPaReplacement = `_getTmpl=(tId,ld)=>{
const n=(ld&&ld.customerName)||"Sir";
const c=(ld&&(ld.companyName||ld.customerName))||"PP Sons Construction";
const l=(ld&&(ld.district||ld.area))||"Palladam";
const myN=((e==null?void 0:e.name)||(e==null?void 0:e.username))||"MMT Enterprises";
const myP="+91 96265 46679";
const myE=(e==null?void 0:e.email)||"mmtenterprisescbe@gmail.com";
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
},Da=U=>{
const target=U||(b&&b.length>0?b[0]:{customerName:"Prospective Client",companyName:"PP Sons Construction",mobileNumber:"",customerType:"Contractor",district:"Palladam"});
Ke(target);
if(target&&target.customerType)setWaSector(target.customerType);
Xt("SITE_ENQUIRY_EN");
const initMsg=_getTmpl("SITE_ENQUIRY_EN",target);
on(initMsg);
ee(!0);
},Pa=()=>{
if(!Ae){f("Please select a recipient.","WARNING");return;}
const rawNum=Ae.whatsAppNumber||Ae.mobileNumber||"";
const U=rawNum.replace(/[^0-9]/g,"");
if(!U||U.length<10){f("Please enter a valid 10-digit mobile number.","WARNING");return;}
if(U==="9626546679"||U==="919626546679"){
f("Cannot send to +91 96265 46679: This is your own WhatsApp Business sender number. Please enter recipient mobile.","WARNING");
return;
}
const ke=U.startsWith("91")?U:\`91\${U}\`;
const Ye=encodeURIComponent(Mt||"");
const Je=\`https://wa.me/\${ke}?text=\${Ye}\`;
window.open(Je,"_blank");
f(\`Opening WhatsApp for \${Ae.customerName||ke}...\`,"SUCCESS");
ee(!1);
},_sendViaApi=async()=>{
if(!Ae){f("Please select a recipient.","WARNING");return;}
const rawNum=Ae.whatsAppNumber||Ae.mobileNumber||"";
const U=rawNum.replace(/[^0-9]/g,"");
if(!U||U.length<10){f("Please enter a valid 10-digit mobile number.","WARNING");return;}
if(U==="9626546679"||U==="919626546679"){
f("Cannot send to +91 96265 46679: This is your own WhatsApp Business number.","WARNING");
return;
}
if(!Mt){f("Message content cannot be empty.","WARNING");return;}
try{
f("Sending message via WhatsApp API...","INFO");
const res=await fetch("/api/whatsapp/send-message",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({to:U,message:Mt,customerName:Ae.customerName,sector:Ae.customerType})
});
const data=await res.json();
if(res.ok&&data.success){
f("Message sent successfully via WhatsApp Cloud API!","SUCCESS");
ee(!1);
}else{
console.warn("API direct send fallback:",data);
f(data.hint||data.error||"Meta 24h window closed. Opening WhatsApp directly...","WARNING");
const ke=U.startsWith("91")?U:\`91\${U}\`;
window.open(\`https://wa.me/\${ke}?text=\${encodeURIComponent(Mt)}\`,"_blank");
ee(!1);
}
}catch(err){
console.error("API error:",err);
f("Network issue. Opening WhatsApp directly...","WARNING");
const ke=U.startsWith("91")?U:\`91\${U}\`;
window.open(\`https://wa.me/\${ke}?text=\${encodeURIComponent(Mt)}\`,"_blank");
ee(!1);
}
},_copyMsg=()=>{
if(!Mt){f("No message to copy.","WARNING");return;}
try{
navigator.clipboard.writeText(Mt);
f("Message copied to clipboard!","SUCCESS");
}catch(e){
f("Could not auto-copy. Please select and copy manually.","WARNING");
}
},Kl=U=>{`;

// 4. Header button: Add WhatsApp Outreach button next to Import Leads
const toolbarTarget = `children:[i.jsxs("button",{onClick:()=>_(!0),className:"bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-import-crm-leads",children:[i.jsx(Vo,{size:15,className:"text-teal-400"}),"Import Leads (CSV/Excel)"]}),`;

const toolbarReplacement = `children:[i.jsxs("button",{onClick:()=>Da(),className:"bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer shrink-0 border border-emerald-500/40",id:"btn-whatsapp-outreach-toolbar",children:[i.jsx(Ci,{size:16,className:"text-white"}),"WhatsApp Outreach & Proposals"]}),i.jsxs("button",{onClick:()=>_(!0),className:"bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm",id:"btn-import-crm-leads",children:[i.jsx(Vo,{size:15,className:"text-teal-400"}),"Import Leads (CSV/Excel)"]}),`;

// 5. Filter bar: add Customer Type / Sector filter dropdown
const filterBarTarget = `i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#1e293b] border border-[#334155] rounded-xl p-3.5",children:[i.jsxs("div",{className:"md:col-span-5 relative",children:[i.jsx(ec,{size:15,className:"absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}),i.jsx("input",{type:"text",placeholder:"Search by customer, company, phone, location, machine...",value:O,onChange:U=>E(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg pl-9 pr-4 py-2 focus:border-blue-500 focus:outline-none placeholder-slate-400 font-mono"})]}),i.jsx("div",{className:"md:col-span-3",children:i.jsxs("select",{value:R,onChange:U=>L(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none font-mono",children:[i.jsx("option",{value:"ALL",children:"All Lead Sources"}),Se.map(U=>i.jsx("option",{value:U,children:U},U))]})}),i.jsx("div",{className:"md:col-span-2",children:i.jsxs("select",{value:M,onChange:U=>H(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none font-mono",children:[i.jsx("option",{value:"ALL",children:"All Priorities"}),Ee.map(U=>i.jsxs("option",{value:U,children:[U," Priority"]},U))]})}),i.jsxs("div",{className:"md:col-span-2 flex items-center justify-end text-xs text-slate-300 font-mono",children:[i.jsx("span",{className:"text-blue-400 font-bold mr-1",children:Gr.length})," leads"]})]}),`;

const filterBarReplacement = `i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-12 gap-2.5 bg-[#1e293b] border border-[#334155] rounded-xl p-3.5",children:[i.jsxs("div",{className:"md:col-span-4 relative",children:[i.jsx(ec,{size:15,className:"absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}),i.jsx("input",{type:"text",placeholder:"Search name, company, phone, location...",value:O,onChange:U=>E(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg pl-9 pr-4 py-2 focus:border-blue-500 focus:outline-none placeholder-slate-400 font-mono"})]}),i.jsx("div",{className:"md:col-span-3",children:i.jsxs("select",{value:crmSector,onChange:U=>setCrmSector(U.target.value),className:"w-full bg-[#0f172a] border border-indigo-500/40 text-indigo-300 text-xs rounded-lg px-2.5 py-2 focus:border-indigo-400 focus:outline-none font-mono font-semibold",children:[i.jsx("option",{value:"ALL",children:"All Customer Types / Sectors"}),i.jsx("option",{value:"Contractor",children:"Contractor"}),i.jsx("option",{value:"Builder",children:"Builder"}),i.jsx("option",{value:"Infrastructure / Highway",children:"Infrastructure / Highway"}),i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"}),i.jsx("option",{value:"Government / PSU",children:"Government / PSU"}),i.jsx("option",{value:"Mining / Quarry",children:"Mining / Quarry"}),i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),i.jsx("option",{value:"Other",children:"Other"})]})}),i.jsx("div",{className:"md:col-span-2",children:i.jsxs("select",{value:R,onChange:U=>L(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-2 py-2 focus:border-blue-500 focus:outline-none font-mono",children:[i.jsx("option",{value:"ALL",children:"All Sources"}),Se.map(U=>i.jsx("option",{value:U,children:U},U))]})}),i.jsx("div",{className:"md:col-span-2",children:i.jsxs("select",{value:M,onChange:U=>H(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-2 py-2 focus:border-blue-500 focus:outline-none font-mono",children:[i.jsx("option",{value:"ALL",children:"All Priorities"}),Ee.map(U=>i.jsxs("option",{value:U,children:[U," Priority"]},U))]})}),i.jsxs("div",{className:"md:col-span-1 flex items-center justify-end text-xs text-slate-300 font-mono",children:[i.jsx("span",{className:"text-blue-400 font-bold mr-1",children:Gr.length})," leads"]})]}),`;

// 6. WhatsApp Modal replacement
const modalTarget = `ot&&Ae&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4",children:i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4",children:[i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-3",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("div",{className:"p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400",children:i.jsx(Ci,{size:16})}),i.jsxs("div",{children:[i.jsx("h3",{className:"text-base font-bold text-white",children:"Direct WhatsApp Outreach"}),i.jsxs("p",{className:"text-[11px] text-slate-300 font-mono",children:[Ae.customerName," (",Ae.whatsAppNumber||Ae.mobileNumber,")"]})]})]}),i.jsx("button",{onClick:()=>ee(!1),className:"p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800",children:i.jsx(Lt,{size:18})})]}),i.jsxs("div",{className:"space-y-3",children:[i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Select Campaign / Template"}),i.jsxs("select",{value:st,onChange:U=>{Xt(U.target.value),U.target.value==="INQUIRY_GREETING"?on(\`Hello \${Ae.customerName},
Thank you for contacting JCB 360 Fleet Solutions regarding your \${Ae.interestedMachine||"Machinery"} requirement. How can we assist your project today?\`):U.target.value==="DISCOUNT_OFFER"?on(\`Dear \${Ae.customerName},
Exciting news! JCB 360 announces a special seasonal discount on Backhoe Loader & Excavator rentals for projects in \${Ae.district||"Tamil Nadu"}. Book today!\`):U.target.value==="BOOKING_FOLLOWUP"&&on(\`Hi \${Ae.customerName},
Following up on our discussion regarding \${Ae.interestedMachine||"JCB"}. We have units available for immediate site dispatch. Let us know!\`)},className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none",children:[i.jsx("option",{value:"INQUIRY_GREETING",children:"Inquiry Welcome Message"}),i.jsx("option",{value:"DISCOUNT_OFFER",children:"Seasonal Machinery Discount"}),i.jsx("option",{value:"BOOKING_FOLLOWUP",children:"Machine Booking Follow-up"})]})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Message Content"}),i.jsx("textarea",{rows:4,value:Mt,onChange:U=>on(U.target.value),className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none font-sans placeholder-slate-400"})]})]}),i.jsxs("div",{className:"flex items-center justify-end gap-2.5 pt-2 border-t border-[#334155]",children:[i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"px-3.5 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer",children:"Cancel"}),i.jsxs("button",{type:"button",onClick:Pa,className:"px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-900/30 cursor-pointer",children:[i.jsx(Du,{size:13}),"Open in WhatsApp"]})]})]})}),`;

const modalReplacement = `ot&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4",children:i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto",children:[i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-3",children:[i.jsxs("div",{className:"flex items-center gap-2.5",children:[i.jsx("div",{className:"p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",children:i.jsx(Ci,{size:20})}),i.jsxs("div",{children:[i.jsx("h3",{className:"text-base font-bold text-white flex items-center gap-2",children:"WhatsApp Machine Outreach & Proposals"}),i.jsx("p",{className:"text-xs text-slate-300 font-mono",children:"Target by Customer Type & Sector • Send Machine Pitches & Proposals"})]})]}),i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer",children:i.jsx(Lt,{size:18})})]}),i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60",children:[i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-emerald-400 font-bold block uppercase tracking-wider",children:"1. Target Sector / Customer Type"}),i.jsxs("select",{value:waSector,onChange:U=>{const sec=U.target.value;setWaSector(sec);const flt=sec==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===sec);if(flt.length>0){Ke(flt[0]);on(_getTmpl(st,flt[0]))}},className:"w-full bg-[#0f172a] border border-emerald-500/40 text-emerald-300 text-xs rounded-lg px-3 py-2 focus:border-emerald-400 focus:outline-none font-semibold",children:[i.jsx("option",{value:"ALL",children:"All Customer Types / Sectors"}),i.jsx("option",{value:"Contractor",children:"Contractor"}),i.jsx("option",{value:"Builder",children:"Builder"}),i.jsx("option",{value:"Infrastructure / Highway",children:"Infrastructure / Highway"}),i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"}),i.jsx("option",{value:"Government / PSU",children:"Government / PSU"}),i.jsx("option",{value:"Mining / Quarry",children:"Mining / Quarry"}),i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),i.jsx("option",{value:"Other",children:"Other"})]})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-emerald-400 font-bold block uppercase tracking-wider",children:"2. Select Recipient Lead / Client"}),i.jsxs("select",{value:(Ae&&Ae.id)||"MANUAL",onChange:U=>{const val=U.target.value;if(val==="MANUAL"){const blank={customerName:"",companyName:"",mobileNumber:"",customerType:waSector!=="ALL"?waSector:"Contractor"};Ke(blank);on(_getTmpl(st,blank))}else{const found=b.find(x=>String(x.id)===String(val)||x._id===val);if(found){Ke(found);on(_getTmpl(st,found))}}},className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-mono",children:[i.jsx("option",{value:"",children:"-- Select Lead from CRM --"}),(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("option",{value:x.id,children:[x.customerName," - ",x.companyName||x.customerType||"Client"," (",x.mobileNumber||"",")"]},x.id)),i.jsx("option",{value:"MANUAL",children:"✏️ Enter Manual / Custom Number"})]})]})]}),i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:[i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Recipient / Company Name"}),i.jsx("input",{type:"text",placeholder:"e.g. PP Sons Construction / Muthu Kumar",value:(Ae&&Ae.customerName)||"",onChange:U=>{const upd={...(Ae||{}),customerName:U.target.value};Ke(upd)},className:"w-full bg-[#0f172a] border border-[#334155] text-white text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-sans"})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Recipient Mobile (+91 Indian WhatsApp)"}),i.jsxs("div",{className:"flex items-center rounded-lg border border-[#334155] bg-[#0f172a] overflow-hidden focus-within:border-emerald-500",children:[i.jsx("span",{className:"bg-slate-800 text-slate-400 font-mono text-xs px-2.5 py-2 border-r border-[#334155] select-none font-bold",children:"+91"}),i.jsx("input",{type:"text",placeholder:"10-digit WhatsApp Number",value:((Ae&&(Ae.mobileNumber||Ae.whatsAppNumber))||"").replace(/^\\+?91/,"").replace(/\\D/g,""),onChange:U=>{const cleaned=U.target.value.replace(/\\D/g,"").slice(0,10);const upd={...(Ae||{}),mobileNumber:cleaned,whatsAppNumber:cleaned};Ke(upd)},className:"w-full bg-transparent text-white text-xs px-2.5 py-2 focus:outline-none font-mono"})]})]})]}),i.jsxs("div",{className:"space-y-1",children:[i.jsx("label",{className:"text-[11px] font-mono text-amber-400 font-bold block uppercase tracking-wider",children:"3. Choose Pitch / Proposal Template"}),i.jsxs("select",{value:st,onChange:U=>{const tKey=U.target.value;Xt(tKey);on(_getTmpl(tKey,Ae))},className:"w-full bg-[#0f172a] border border-amber-500/40 text-amber-300 text-xs rounded-lg px-3 py-2.5 focus:border-amber-400 focus:outline-none font-semibold",children:[i.jsx("option",{value:"SITE_ENQUIRY_EN",children:"🚜 [English] Site Machinery Requirement Pitch (PP Sons / Palladam)"}),i.jsx("option",{value:"PALLADAM_TAMIL",children:"🚜 [தமிழ்] திட்டப் பணி இயந்திரங்கள் தேவை (பள்ளடம் வடிவம்)"}),i.jsx("option",{value:"HIGHWAY_TAMIL",children:"🛣️ [தமிழ்] நெடுஞ்சாலைத் திட்டப் பணி (நீலாம்பூர் Highway வடிவம்)"}),i.jsx("option",{value:"CORPORATE_INTRO_EN",children:"🏢 [English] Corporate Infrastructure Introduction (Equipment & Services Pitch)"}),i.jsx("option",{value:"CUSTOM",children:"✍️ Custom Message / Empty"})]})]}),i.jsxs("div",{className:"space-y-1.5",children:[i.jsxs("div",{className:"flex items-center justify-between",children:[i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold",children:"Message Content (Live Editable Preview)"}),i.jsxs("span",{className:"text-[10px] font-mono text-slate-400",children:[Mt.length," characters"]})]}),i.jsx("textarea",{rows:9,value:Mt,onChange:U=>on(U.target.value),placeholder:"Type or edit message here...",className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none font-sans leading-relaxed resize-y"}),i.jsx("p",{className:"text-[11px] text-slate-400 italic",children:"💡 Tip: You can edit any details, site locations, equipment types, and contact numbers in the message above before sending."})]}),i.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[#334155]",children:[i.jsxs("button",{type:"button",onClick:_copyMsg,className:"px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer",children:[i.jsx(Yu,{size:13}),"Copy Message"]}),i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"px-3.5 py-2 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors",children:"Cancel"}),i.jsxs("button",{type:"button",onClick:_sendViaApi,className:"px-3.5 py-2 text-xs font-semibold text-sky-200 bg-sky-900/60 hover:bg-sky-800 border border-sky-600/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",title:"Dispatch via Meta WhatsApp Cloud API",children:[i.jsx(Vo,{size:13}),"Send via API"]}),i.jsxs("button",{type:"button",onClick:Pa,className:"px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition-colors cursor-pointer",children:[i.jsx(Ci,{size:14}),"Open in WhatsApp"]})]})]})]})}),`;

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log("File not found:", file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;

  if (content.includes(stateTarget)) {
    content = content.replace(stateTarget, stateReplacement);
    console.log(`[1] State hooked in ${path.basename(file)}`);
    count++;
  } else {
    console.log(`[1] State already hooked or pattern missing in ${path.basename(file)}`);
  }

  if (content.includes(grTarget)) {
    content = content.replace(grTarget, grReplacement);
    console.log(`[2] Gr sector filter hooked in ${path.basename(file)}`);
    count++;
  } else {
    console.log(`[2] Gr pattern missing or already hooked in ${path.basename(file)}`);
  }

  if (content.includes(daPaTarget)) {
    content = content.replace(daPaTarget, daPaReplacement);
    console.log(`[3] Da and Pa template engine hooked in ${path.basename(file)}`);
    count++;
  } else {
    console.log(`[3] Da/Pa pattern missing or already hooked in ${path.basename(file)}`);
  }

  if (content.includes(toolbarTarget)) {
    content = content.replace(toolbarTarget, toolbarReplacement);
    console.log(`[4] Toolbar WhatsApp button hooked in ${path.basename(file)}`);
    count++;
  } else {
    console.log(`[4] Toolbar pattern missing or already hooked in ${path.basename(file)}`);
  }

  if (content.includes(filterBarTarget)) {
    content = content.replace(filterBarTarget, filterBarReplacement);
    console.log(`[5] Filter bar Sector dropdown hooked in ${path.basename(file)}`);
    count++;
  } else {
    console.log(`[5] Filter bar pattern missing or already hooked in ${path.basename(file)}`);
  }

  if (content.includes(modalTarget)) {
    content = content.replace(modalTarget, modalReplacement);
    console.log(`[6] WhatsApp Outreach modal suite hooked in ${path.basename(file)}`);
    count++;
  } else {
    console.log(`[6] Modal pattern missing or already hooked in ${path.basename(file)}`);
  }

  if (count > 0) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully patched ${file} (${count} changes).`);
  }
});
