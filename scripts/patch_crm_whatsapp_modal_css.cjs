const fs = require('fs');
const path = require('path');

const cssRules = `
/* ═══════════════════════════════════════════════════════════════════
   WhatsApp Outreach Modal Suite - Strict Viewport & Scrolling Constraints
   ═══════════════════════════════════════════════════════════════════ */
.wa-modal-overlay {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99999 !important;
  background-color: rgba(15, 23, 42, 0.85) !important;
  backdrop-filter: blur(4px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 12px !important;
  overflow: hidden !important;
}

.wa-modal-card {
  max-height: 85vh !important;
  height: 85vh !important;
  max-width: 680px !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
  border-radius: 1rem !important;
  background-color: #1e293b !important;
  border: 1px solid #334155 !important;
  margin: auto !important;
}

.wa-modal-header {
  flex-shrink: 0 !important;
  border-bottom: 1px solid #334155 !important;
  padding: 12px 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  background-color: #1e293b !important;
  border-top-left-radius: 1rem !important;
  border-top-right-radius: 1rem !important;
  z-index: 10 !important;
}

.wa-modal-body {
  flex: 1 1 0% !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  padding: 14px 18px !important;
}

.wa-modal-footer {
  flex-shrink: 0 !important;
  border-top: 1px solid #334155 !important;
  padding: 10px 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  background-color: #0f172a !important;
  border-bottom-left-radius: 1rem !important;
  border-bottom-right-radius: 1rem !important;
  z-index: 10 !important;
}
`;

// 1. Append to CSS files
['public/light-theme.css', 'dist/light-theme.css'].forEach(fPath => {
  const fullPath = path.join(process.cwd(), fPath);
  if (fs.existsSync(fullPath)) {
    let css = fs.readFileSync(fullPath, 'utf8');
    if (!css.includes('.wa-modal-overlay')) {
      css += '\n' + cssRules;
      fs.writeFileSync(fullPath, css, 'utf8');
      console.log(`[CSS] Appended .wa-modal-* to ${fPath}`);
    } else {
      console.log(`[CSS] Already present in ${fPath}`);
    }
  }
});

// 2. Cache-bust index.html
const indexHtmlPath = path.join(process.cwd(), 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  html = html.replace(/\/assets\/index-Dbowi09z\.js(\?v=[a-zA-Z0-9_-]+)?/g, '/assets/index-Dbowi09z.js?v=wa_20261016_v4');
  html = html.replace(/\/light-theme\.css(\?v=[a-zA-Z0-9_-]+)?/g, '/light-theme.css?v=wa_20261016_v4');
  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  console.log('[HTML] Updated index.html with cache-buster ?v=wa_20261016_v4');
}

// 3. Update public and dist JS bundles
const modalStartPattern = `ot&&i.jsx("div",{style:{position:"fixed",inset:0,zIndex:9999`;
const modalEndPattern = `,ie&&F&&i.jsx("div",{className:"fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4"`;

const newModalMarkup = `ot&&i.jsx("div",{className:"wa-modal-overlay",children:i.jsxs("div",{className:"wa-modal-card",children:[
// 1. Fixed Header
i.jsxs("div",{className:"wa-modal-header",children:[
  i.jsxs("div",{className:"flex items-center gap-2.5",children:[
    i.jsx("div",{className:"p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0",children:i.jsx(Ci,{size:18})}),
    i.jsxs("div",{children:[
      i.jsx("h3",{className:"text-sm font-bold text-white flex items-center gap-2 leading-tight",children:"WhatsApp Machine Outreach & Proposals"}),
      i.jsx("p",{className:"text-[10px] text-slate-300 font-mono mt-0.5",children:"Target by Customer Type & Sector • One-Click Multi-Send • Image & Flyer Attachments"})
    ]})
  ]}),
  i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0",children:i.jsx(Lt,{size:16})})
]}),

// 2. Scrollable Body
i.jsxs("div",{className:"wa-modal-body space-y-3",children:[
  // Sector and Recipient selection
  i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-slate-900/70 p-3 rounded-xl border border-slate-700/60",children:[
    // 1. Sector
    i.jsxs("div",{className:"space-y-1",children:[
      i.jsx("label",{className:"text-[11px] font-mono text-emerald-400 font-bold block uppercase tracking-wider",children:"1. Target Sector / Customer Type"}),
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
      },className:"w-full bg-[#0f172a] border border-emerald-500/40 text-emerald-300 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-400 focus:outline-none font-semibold",children:[
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

    // 2. Recipient selector
    i.jsxs("div",{className:"space-y-1",children:[
      i.jsx("label",{className:"text-[11px] font-mono text-emerald-400 font-bold block uppercase tracking-wider",children:"2. Select Recipient Lead / Client"}),
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
      },className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-mono font-semibold",children:[
        i.jsxs("option",{value:"ALL_SECTOR",className:"text-emerald-400 font-bold",children:["📢 ALL ",waSector.toUpperCase(),"S (One-Click Send to All ",(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length," ",waSector,"s)"]}),
        i.jsx("option",{disabled:!0,children:"──────── Individual Leads ────────"}),
        (waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("option",{value:x.id,children:[x.customerName," - ",x.companyName||x.customerType||"Client"," (",x.mobileNumber||"",")"]},x.id)),
        i.jsx("option",{value:"MANUAL",children:"✏️ Enter Manual / Custom Number"})
      ]})
    ]})
  ]}),

  // Batch mode banner or Single recipient details
  isBatchMode?i.jsxs("div",{className:"bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 space-y-1.5",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsxs("div",{className:"flex items-center gap-1.5",children:[
        i.jsx(Ci,{size:15,className:"text-emerald-400"}),
        i.jsxs("span",{className:"text-xs font-bold text-emerald-300 font-sans",children:[
          "One-Click Batch Mode Active: Targeting all ",
          (waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length,
          " ",waSector," contacts"
        ]})
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>setShowBatchList(!showBatchList),className:"text-[10px] font-mono text-cyan-300 hover:text-cyan-200 underline cursor-pointer",children:[
        showBatchList?"Hide List":"View Contact List & Open WhatsApp"
      ]})
    ]}),
    i.jsx("div",{className:"flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-0.5",children:(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("span",{className:"px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-200 border border-emerald-500/25 shrink-0",children:[x.customerName," (",x.mobileNumber,")"]},x.id))}),
    showBatchList&&i.jsxs("div",{className:"pt-2 border-t border-emerald-500/20 space-y-1 max-h-32 overflow-y-auto",children:[
      i.jsx("p",{className:"text-[10px] text-slate-300 font-mono",children:"Click 'Open Chat' next to any contractor to launch WhatsApp Web with proposal & flyer:"}),
      (waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).map(x=>i.jsxs("div",{className:"flex items-center justify-between bg-slate-900/80 px-2 py-1 rounded border border-slate-700/60 text-xs",children:[
        i.jsxs("div",{className:"truncate mr-2",children:[
          i.jsx("span",{className:"font-semibold text-white",children:x.customerName}),
          i.jsxs("span",{className:"text-slate-400 font-mono text-[10px] ml-1.5",children:["• ",x.mobileNumber," • ",x.companyName||""]})
        ]}),
        i.jsxs("button",{type:"button",onClick:()=>Pa(x),className:"px-2 py-0.5 text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1 shrink-0 cursor-pointer shadow",children:[
          i.jsx(Ci,{size:10}),"Open Chat"
        ]})
      ]},x.id))
    ]})
  ]}):i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2.5",children:[
    i.jsxs("div",{className:"space-y-0.5",children:[
      i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Recipient / Company Name"}),
      i.jsx("input",{type:"text",placeholder:"e.g. PP Sons Construction / Muthu Kumar",value:(Ae&&Ae.customerName)||"",onChange:U=>{
        const upd={...(Ae||{}),customerName:U.target.value};
        Ke(upd);
      },className:"w-full bg-[#0f172a] border border-[#334155] text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none font-sans"})
    ]}),
    i.jsxs("div",{className:"space-y-0.5",children:[
      i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold block",children:"Recipient Mobile (+91 Indian WhatsApp)"}),
      i.jsxs("div",{className:"flex items-center rounded-lg border border-[#334155] bg-[#0f172a] overflow-hidden focus-within:border-emerald-500",children:[
        i.jsx("span",{className:"bg-slate-800 text-slate-400 font-mono text-xs px-2 py-1.5 border-r border-[#334155] select-none font-bold",children:"+91"}),
        i.jsx("input",{type:"text",placeholder:"10-digit WhatsApp Number",value:((Ae&&(Ae.mobileNumber||Ae.whatsAppNumber))||"").replace(/^\\+?91/,"").replace(/\\D/g,""),onChange:U=>{
          const cleaned=U.target.value.replace(/\\D/g,"").slice(0,10);
          const upd={...(Ae||{}),mobileNumber:cleaned,whatsAppNumber:cleaned};
          Ke(upd);
        },className:"w-full bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none font-mono"})
      ]})
    ]})
  ]}),

  // 3. Image Flyer Attachment Section
  i.jsxs("div",{className:"bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/60 space-y-1.5",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsxs("label",{className:"text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-wider",children:[
        i.jsx(Vo,{size:13}),"3. Attach Machine Image / Flyer / Rate Card (Optional)"
      ]}),
      waImage&&i.jsx("span",{className:"text-[10px] text-emerald-400 font-mono font-bold",children:"✓ Image Attached"})
    ]}),
    !waImage?i.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
      i.jsxs("label",{className:"px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm",children:[
        i.jsx(Vo,{size:13,className:"text-teal-400"}),
        "Upload Image / Flyer",
        i.jsx("input",{type:"file",accept:"image/*",onChange:_handleImgUpload,className:"hidden"})
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>{setWaImage("https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg");f("MMT Promo Flyer attached!","SUCCESS");},className:"px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm",children:[
        i.jsx(js,{size:12,className:"text-amber-400"}),
        "Use MMT Promo Flyer"
      ]}),
      i.jsx("span",{className:"text-[10px] text-slate-400 italic",children:"JPG, PNG, WebP flyers & machine photos"})
    ]}):i.jsxs("div",{className:"flex items-center justify-between bg-slate-800/80 p-1.5 rounded-lg border border-emerald-500/30 gap-2.5",children:[
      i.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[
        i.jsx("img",{src:waImage,alt:"Attachment Preview",className:"w-9 h-9 object-cover rounded border border-emerald-500/40 shadow shrink-0"}),
        i.jsxs("div",{className:"min-w-0",children:[
          i.jsx("p",{className:"text-xs font-semibold text-white truncate leading-tight",children:"Machine Flyer / Image Attached"}),
          i.jsx("p",{className:"text-[10px] text-emerald-400 font-medium",children:"✓ Will be sent with proposal caption via WhatsApp"})
        ]})
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>setWaImage(""),className:"px-2 py-0.5 text-xs text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded flex items-center gap-1 transition-colors shrink-0 cursor-pointer",children:[
        i.jsx(Lt,{size:11}),"Remove"
      ]})
    ]})
  ]}),

  // 4. Template Selector
  i.jsxs("div",{className:"space-y-0.5",children:[
    i.jsx("label",{className:"text-[11px] font-mono text-amber-400 font-bold block uppercase tracking-wider",children:"4. Choose Pitch / Proposal Template"}),
    i.jsxs("select",{value:st,onChange:U=>{
      const tKey=U.target.value;
      Xt(tKey);
      on(_getTmpl(tKey,Ae));
    },className:"w-full bg-[#0f172a] border border-amber-500/40 text-amber-300 text-xs rounded-lg px-2.5 py-1.5 focus:border-amber-400 focus:outline-none font-semibold",children:[
      i.jsx("option",{value:"SITE_ENQUIRY_EN",children:"🚜 [English] Site Machinery Requirement Pitch (PP Sons / Palladam)"}),
      i.jsx("option",{value:"PALLADAM_TAMIL",children:"🚜 [தமிழ்] திட்டப் பணி இயந்திரங்கள் தேவை (பள்ளடம் வடிவம்)"}),
      i.jsx("option",{value:"HIGHWAY_TAMIL",children:"🛣️ [தமிழ்] நெடுஞ்சாலைத் திட்டப் பணி (நீலாம்பூர் Highway வடிவம்)"}),
      i.jsx("option",{value:"CORPORATE_INTRO_EN",children:"🏢 [English] Corporate Infrastructure Introduction (Equipment & Services Pitch)"}),
      i.jsx("option",{value:"CUSTOM",children:"✍️ Custom Message / Empty"})
    ]})
  ]}),

  // 5. Message Content Textarea
  i.jsxs("div",{className:"space-y-0.5",children:[
    i.jsxs("div",{className:"flex items-center justify-between",children:[
      i.jsx("label",{className:"text-[11px] font-mono text-slate-300 font-semibold",children:"Message Content (Live Editable Preview)"}),
      i.jsxs("span",{className:"text-[10px] font-mono text-slate-400",children:[Mt.length," characters"]})
    ]}),
    i.jsx("textarea",{rows:4,value:Mt,onChange:U=>on(U.target.value),placeholder:"Type or edit message here...",className:"w-full bg-[#0f172a] border border-[#334155] text-slate-100 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none font-sans leading-relaxed resize-y"}),
    i.jsx("p",{className:"text-[10px] text-slate-400 italic",children:"💡 Tip: You can edit rates, equipment lists, and site locations directly in the message box above before sending."})
  ]}),

  // Batch Progress Banner if active
  batchProgress&&i.jsxs("div",{className:"bg-sky-950/40 border border-sky-500/30 rounded-xl p-2 flex items-center justify-between",children:[
    i.jsxs("div",{className:"flex items-center gap-2",children:[
      batchProgress.inProgress&&i.jsx(Fm,{className:"animate-spin text-sky-400",size:14}),
      i.jsx("span",{className:"text-xs font-mono text-sky-200",children:batchProgress.status})
    ]}),
    i.jsxs("span",{className:"text-xs font-bold text-sky-300 font-mono",children:[batchProgress.sent," / ",batchProgress.total]})
  ]})
]}),

// 3. Fixed Footer
i.jsxs("div",{className:"wa-modal-footer",children:[
  i.jsxs("button",{type:"button",onClick:_copyMsg,className:"px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer",children:[
    i.jsx(Yu,{size:13}),"Copy Message"
  ]}),
  i.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
    i.jsx("button",{type:"button",onClick:()=>ee(!1),className:"px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors",children:"Cancel"}),
    isBatchMode?i.jsxs(i.Fragment,{children:[
      i.jsxs("button",{type:"button",onClick:()=>setShowBatchList(!showBatchList),className:"px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",children:[
        i.jsx(Ci,{size:13}),"Open WhatsApp List"
      ]}),
      i.jsxs("button",{type:"button",onClick:_batchSendToAll,className:"px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-900/50 transition-colors cursor-pointer font-sans",children:[
        i.jsx(Du,{size:13}),
        "One-Click Send to All ",waSector,"s (",(waSector==="ALL"?b:b.filter(x=>(x.customerType||x.businessType||"Contractor")===waSector)).length,")"
      ]})
    ]}):i.jsxs(i.Fragment,{children:[
      i.jsxs("button",{type:"button",onClick:_sendViaApi,className:"px-3 py-1.5 text-xs font-semibold text-sky-200 bg-sky-900/60 hover:bg-sky-800 border border-sky-600/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer",title:"Dispatch via Meta WhatsApp Cloud API",children:[
        i.jsx(Vo,{size:13}),"Send via API"
      ]}),
      i.jsxs("button",{type:"button",onClick:()=>Pa(),className:"px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition-colors cursor-pointer",children:[
        i.jsx(Ci,{size:13}),"Open in WhatsApp"
      ]})
    ]})
  ]})
]})
]})})` + modalEndPattern;

['public/assets/index-Dbowi09z.js', 'dist/assets/index-Dbowi09z.js'].forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  const modalStartIdx = content.indexOf(modalStartPattern);
  const modalEndIdx = content.indexOf(modalEndPattern, modalStartIdx);
  if (modalStartIdx !== -1 && modalEndIdx !== -1) {
    content = content.slice(0, modalStartIdx) + newModalMarkup + content.slice(modalEndIdx + modalEndPattern.length);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[JS] Patched .wa-modal-* classes in ${file}`);
  } else {
    console.log(`[JS] Pattern bounds not found in ${file}`);
  }
});
