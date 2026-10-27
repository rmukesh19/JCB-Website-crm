const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
let bundle = fs.readFileSync(bundlePath, 'utf8');

// Target start: ot&&i.jsx("div",{className:"wa-modal-overlay"
// Target end: ]})}),ie&&F&&i.jsx("div"
const startMarker = 'ot&&i.jsx("div",{className:"wa-modal-overlay",children:i.jsxs("div",{className:"wa-modal-card",children:[';
const endMarker = 'ie&&F&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4"';

const startIndex = bundle.indexOf(startMarker);
const endIndex = bundle.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find modal markers in bundle!");
  console.log("startIndex:", startIndex, "endIndex:", endIndex);
  process.exit(1);
}

const newModalCode = `ot&&i.jsx("div",{className:"wa-modal-overlay",children:i.jsxs("div",{className:"wa-modal-card",children:[
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
          on(_getTmpl(st,{customerName:"Sir",companyName:"Your Project Site",district:"Palladam"}));
        }else if(flt.length>0){
          Ke(flt[0]);
          on(_getTmpl(st,flt[0]));
        }
      },className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-semibold shadow-xs",children:[
        i.jsx("option",{value:"Contractor",children:"Contractor"}),
        i.jsx("option",{value:"Builder",children:"Builder"}),
        i.jsx("option",{value:"Infrastructure / Highway",children:"Infrastructure / Highway"}),
        i.jsx("option",{value:"Individual / Home Owner",children:"Individual / Home Owner"}),
        i.jsx("option",{value:"Government / PSU",children:"Government / PSU"}),
        i.jsx("option",{value:"Mining / Quarry",children:"Mining / Quarry"}),
        i.jsx("option",{value:"Industrial / Factory",children:"Industrial / Factory"}),
        i.jsx("option",{value:"ALL",children:"All Customer Types / Sectors"}),
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
          on(_getTmpl(st,{customerName:"Sir",companyName:"Your Project Site",district:"Palladam"}));
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
    i.jsx("label",{className:"text-xs font-semibold text-slate-700 block uppercase tracking-wide",children:"4. Choose Pitch / Proposal Template"}),
    i.jsxs("select",{value:st,onChange:U=>{
      const tKey=U.target.value;
      Xt(tKey);
      on(_getTmpl(tKey,Ae));
    },className:"w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none font-semibold shadow-xs",children:[
      i.jsx("option",{value:"SITE_ENQUIRY_EN",children:"🚜 [English] Site Machinery Requirement Pitch (PP Sons / Palladam)"}),
      i.jsx("option",{value:"PALLADAM_TAMIL",children:"🚜 [தமிழ்] திட்டப் பணி இயந்திரங்கள் தேவை (பள்ளடம் வடிவம்)"}),
      i.jsx("option",{value:"HIGHWAY_TAMIL",children:"🛣️ [தமிழ்] நெடுஞ்சாலைத் திட்டப் பணி (நீலாம்பூர் Highway வடிவம்)"}),
      i.jsx("option",{value:"CORPORATE_INTRO_EN",children:"🏢 [English] Corporate Infrastructure Introduction (Equipment & Services Pitch)"}),
      i.jsx("option",{value:"CUSTOM",children:"✍️ Custom Message / Empty"})
    ]})
  ]}),
  i.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsx("label",{className:"text-xs font-semibold text-slate-700 block uppercase tracking-wide",children:"5. Message Content (Live Editable Preview)"}),
      i.jsxs("span",{className:"text-xs font-mono text-slate-400 font-medium",children:[Mt.length," characters"]})
    ]}),
    i.jsx("textarea",{rows:3,value:Mt,onChange:U=>on(U.target.value),placeholder:"Type or edit message here...",className:"w-full bg-slate-50/60 border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none font-sans leading-relaxed resize-y"}),
    i.jsx("p",{className:"text-xs text-slate-500 italic",children:"💡 Tip: You can edit rates, equipment lists, and site locations directly in the message box above before sending."})
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
  i.jsxs("button",{type:"button",onClick:_copyMsg,className:"px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors cursor-pointer",children:[
    i.jsx(Yu,{size:13}),"Copy Message"
  ]}),
  i.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
    i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer transition-colors",children:"Cancel"}),
    isBatchMode?i.jsxs(i.Fragment,{children:[
      i.jsxs("button",{type:"button",onClick:()=>setShowBatchList(!showBatchList),className:"px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",children:[
        i.jsx(Ci,{size:13}),"Open WhatsApp List"
      ]}),
      i.jsxs("button",{type:"button",onClick:_batchSendToAll,className:"px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer font-sans",children:[
        i.jsx(Du,{size:13}),
        "One-Click Send to All ",waSector,"s (",(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length,")"
      ]})
    ]}):i.jsxs(i.Fragment,{children:[
      i.jsxs("button",{type:"button",onClick:_sendViaApi,className:"px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",title:"Dispatch via Meta WhatsApp Cloud API",children:[
        i.jsx(Vo,{size:13}),"Send via API"
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>Pa(),className:"px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer",children:[
        i.jsx(Ci,{size:14}),"Open in WhatsApp"
      ]})
    ]})
  ]})
]})
]})}),`;

const updatedBundle = bundle.slice(0, startIndex) + newModalCode + bundle.slice(endIndex);
fs.writeFileSync(bundlePath, updatedBundle, 'utf8');
console.log("Successfully updated public/assets/index-Dbowi09z.js with user-friendly light markup!");
