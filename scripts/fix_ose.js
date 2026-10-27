import fs from "fs";

let bundle = fs.readFileSync("public/assets/index-Dbowi09z.js", "utf8");

const oseCode = `
function ose({users=[],auditLogs=[],notifications=[],companies=[],branches=[],currentUser={},onCreateUser,onUpdateUser,onDeleteUser,onUpdateCompany,onUpdateBranch,language="en",setLanguage}){
  const loc=On();
  const path=loc.pathname.toLowerCase();
  const initTab=Y.useMemo(()=>{
    if(path.includes("/users"))return"users";
    if(path.includes("/language"))return"language";
    if(path.includes("/branches")||path.includes("/branch"))return"branches";
    if(path.includes("/backup")||path.includes("/audit"))return"audit";
    return"profile";
  },[path]);

  const [activeTab,setActiveTab]=Y.useState(initTab);
  const company=companies[0]||{name:"JCB Earthmovers & Infrastructure Pvt Ltd",address:"NH-44 Bangalore Highway, Omalur, Salem - 636011",gstin:"33AAACJ1234F1Z5",phone:"+91 98421 22334",email:"ops@jcb360salem.com",pan:"AAACJ1234F"};
  const [compForm,setCompForm]=Y.useState(company);
  const [userList,setUserList]=Y.useState(users);
  const [isUserModalOpen,setIsUserModalOpen]=Y.useState(!1);
  const [newUserForm,setNewUserForm]=Y.useState({name:"",username:"",email:"",role:"OPERATOR",phone:"",status:"ACTIVE"});
  const [toastMsg,setToastMsg]=Y.useState("");

  Y.useEffect(()=>{
    if(users&&users.length>0)setUserList(users);
  },[users]);

  const showLocalToast=(msg)=>{
    setToastMsg(msg);
    setTimeout(()=>setToastMsg(""),3000);
  };

  const handleSaveCompany=(e)=>{
    if(e&&e.preventDefault)e.preventDefault();
    if(onUpdateCompany)onUpdateCompany(compForm);
    showLocalToast("Company Profile updated successfully!");
  };

  const handleCreateUser=(e)=>{
    if(e&&e.preventDefault)e.preventDefault();
    const created={...newUserForm,id:Date.now()};
    setUserList(prev=>[created,...prev]);
    if(onCreateUser)onCreateUser(created);
    setIsUserModalOpen(!1);
    setNewUserForm({name:"",username:"",email:"",role:"OPERATOR",phone:"",status:"ACTIVE"});
    showLocalToast("User account created successfully!");
  };

  const handleDeleteUser=(uid)=>{
    setUserList(prev=>prev.filter(u=>u.id!==uid));
    if(onDeleteUser)onDeleteUser(uid);
    showLocalToast("User account removed.");
  };

  const tabs=[
    {id:"profile",label:"Company Profile",icon:WB},
    {id:"users",label:"User Management",icon:oO},
    {id:"language",label:"Language & Regional",icon:Wo},
    {id:"branches",label:"Branches & Depots",icon:aO},
    {id:"audit",label:"Audit Logs & Backups",icon:wb}
  ];

  return i.jsxs("div",{className:"space-y-6 animate-fadeIn",id:"settings-module-view",children:[
    // Toast notification
    toastMsg&&i.jsx("div",{className:"fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-mono text-xs font-bold animate-bounce",children:toastMsg}),

    // Header
    i.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-[#334155] shadow-lg",children:[
      i.jsxs("div",{className:"flex items-center gap-3",children:[
        i.jsx("div",{className:"p-2.5 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 text-white shadow-md",children:i.jsx(WB,{size:22})}),
        i.jsxs("div",{children:[
          i.jsx("h1",{className:"text-2xl font-black text-white tracking-tight",children:"System Settings"}),
          i.jsx("p",{className:"text-xs font-mono text-slate-400 uppercase tracking-wider mt-0.5",children:"Enterprise ERP Configuration & Access Control"})
        ]})
      ]})
    ]}),

    // Tab Navigation
    i.jsx("div",{className:"flex items-center gap-2 border-b border-[#334155] pb-2 overflow-x-auto",children:[
      tabs.map(t=>i.jsxs("button",{
        key:t.id,
        onClick:()=>setActiveTab(t.id),
        className:"px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 "+(activeTab===t.id?"bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20":"text-slate-400 hover:text-white hover:bg-slate-800"),
        children:[i.jsx(t.icon,{size:15}),t.label]
      }))
    ]}),

    // TAB: Company Profile
    activeTab==="profile"&&i.jsxs("form",{onSubmit:handleSaveCompany,className:"bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-xl space-y-5",children:[
      i.jsxs("div",{className:"border-b border-[#334155] pb-3",children:[
        i.jsx("h3",{className:"text-base font-bold text-white",children:"Enterprise Organization Profile"}),
        i.jsx("p",{className:"text-xs text-slate-400",children:"Used on GST tax invoices, booking confirmation slips, and payment receipts"})
      ]}),
      i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans",children:[
        i.jsxs("div",{children:[
          i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Company Legal Name"}),
          i.jsx("input",{type:"text",value:compForm.name||"",onChange:e=>setCompForm(prev=>({...prev,name:e.target.value})),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white font-medium focus:border-amber-500 focus:outline-none"})
        ]}),
        i.jsxs("div",{children:[
          i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"GSTIN Identification Number"}),
          i.jsx("input",{type:"text",value:compForm.gstin||"",onChange:e=>setCompForm(prev=>({...prev,gstin:e.target.value})),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white font-mono uppercase focus:border-amber-500 focus:outline-none"})
        ]}),
        i.jsxs("div",{children:[
          i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Official Business Phone"}),
          i.jsx("input",{type:"text",value:compForm.phone||"",onChange:e=>setCompForm(prev=>({...prev,phone:e.target.value})),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"})
        ]}),
        i.jsxs("div",{children:[
          i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Official Billing Email"}),
          i.jsx("input",{type:"email",value:compForm.email||"",onChange:e=>setCompForm(prev=>({...prev,email:e.target.value})),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"})
        ]}),
        i.jsxs("div",{className:"md:col-span-2",children:[
          i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Registered Operating Address"}),
          i.jsx("textarea",{rows:3,value:compForm.address||"",onChange:e=>setCompForm(prev=>({...prev,address:e.target.value})),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"})
        ]})
      ]}),
      i.jsxs("div",{className:"flex justify-end pt-3 border-t border-[#334155]",children:[
        i.jsxs("button",{type:"submit",className:"px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2",children:[
          i.jsx(Ku,{size:15}),"Save Profile Changes"
        ]})
      ]})
    ]}),

    // TAB: User Management
    activeTab==="users"&&i.jsxs("div",{className:"space-y-4",children:[
      i.jsxs("div",{className:"flex items-center justify-between",children:[
        i.jsxs("div",{children:[
          i.jsx("h3",{className:"text-base font-bold text-white",children:"Authorized User Accounts"}),
          i.jsx("p",{className:"text-xs text-slate-400",children:"Role-based access controls for fleet operators, accountants, and system administrators"})
        ]}),
        i.jsxs("button",{onClick:()=>setIsUserModalOpen(!0),className:"px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md",children:[
          i.jsx(ar,{size:15}),"Add User Account"
        ]})
      ]}),
      i.jsx("div",{className:"bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden shadow-xl",children:[
        i.jsxs("table",{className:"w-full text-left border-collapse",children:[
          i.jsx("thead",{className:"bg-[#0f172a]/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#334155]",children:[
            i.jsxs("tr",{children:[
              i.jsx("th",{className:"py-3.5 px-4",children:"User / Full Name"}),
              i.jsx("th",{className:"py-3.5 px-4",children:"Username / Email"}),
              i.jsx("th",{className:"py-3.5 px-4",children:"Assigned Role"}),
              i.jsx("th",{className:"py-3.5 px-4",children:"Contact Phone"}),
              i.jsx("th",{className:"py-3.5 px-4 text-center",children:"Status"}),
              i.jsx("th",{className:"py-3.5 px-4 text-right",children:"Actions"})
            ]})
          ]}),
          i.jsx("tbody",{className:"divide-y divide-[#334155]/60 text-xs text-slate-200",children:[
            userList.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:6,className:"py-8 text-center text-slate-400 font-mono",children:"No user accounts configured."})}):
            userList.map(u=>i.jsxs("tr",{key:u.id,className:"hover:bg-[#334155]/25",children:[
              i.jsxs("td",{className:"py-3.5 px-4 font-semibold text-white",children:[
                u.name||"User Account",
                currentUser.id===u.id&&i.jsx("span",{className:"ml-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30",children:"YOU"})
              ]}),
              i.jsxs("td",{className:"py-3.5 px-4 font-mono text-slate-400",children:[u.username||"—"," (",u.email||"no-email",")"]}),
              i.jsx("td",{className:"py-3.5 px-4",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase",children:u.role||"OPERATOR"})}),
              i.jsx("td",{className:"py-3.5 px-4 font-mono text-slate-300",children:u.phone||"—"}),
              i.jsx("td",{className:"py-3.5 px-4 text-center",children:i.jsx("span",{className:"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",children:u.status||"ACTIVE"})}),
              i.jsx("td",{className:"py-3.5 px-4 text-right",children:currentUser.id!==u.id&&i.jsx("button",{onClick:()=>handleDeleteUser(u.id),className:"p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg cursor-pointer transition-colors",title:"Delete User",children:i.jsx(Dl,{size:15})})})
            ]}))
          ]})
        ]})
      ]})
    ]}),

    // TAB: Language
    activeTab==="language"&&i.jsxs("div",{className:"bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-xl space-y-5",children:[
      i.jsxs("div",{className:"border-b border-[#334155] pb-3",children:[
        i.jsx("h3",{className:"text-base font-bold text-white",children:"Language & Regional Localization"}),
        i.jsx("p",{className:"text-xs text-slate-400",children:"Select preferred language for operational UI labels, buttons, and navigation"})
      ]}),
      i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[
        [
          {code:"en",name:"English",region:"United States / Global",desc:"Default operational English interface"},
          {code:"ta",name:"தமிழ் (Tamil)",region:"Tamil Nadu Regional",desc:"முழுமையான தமிழ் மொழி இடைமுகம்"},
          {code:"hi",name:"हिन्दी (Hindi)",region:"National / Northern Regional",desc:"सम्पूर्ण हिन्दी भाषा इंटरफ़ेस"}
        ].map(l=>i.jsxs("div",{
          key:l.code,
          onClick:()=>{if(setLanguage)setLanguage(l.code);showLocalToast("Language switched to "+l.name);},
          className:"p-4 rounded-xl border cursor-pointer transition-all "+(language===l.code?"bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10":"bg-[#0f172a] border-[#334155] hover:border-slate-500"),
          children:[
            i.jsxs("div",{className:"flex items-center justify-between mb-2",children:[
              i.jsx("h4",{className:"text-base font-bold text-white font-sans",children:l.name}),
              language===l.code&&i.jsx("span",{className:"p-1 rounded-full bg-amber-500 text-slate-950",children:i.jsx(Ku,{size:12})})
            ]}),
            i.jsx("p",{className:"text-xs font-mono text-amber-400 font-semibold",children:l.region}),
            i.jsx("p",{className:"text-xs text-slate-400 mt-2",children:l.desc})
          ]
        }))
      ]})
    ]}),

    // TAB: Branches
    activeTab==="branches"&&i.jsxs("div",{className:"bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-xl space-y-4",children:[
      i.jsxs("div",{className:"border-b border-[#334155] pb-3",children:[
        i.jsx("h3",{className:"text-base font-bold text-white",children:"Registered Operating Branches & Depots"}),
        i.jsx("p",{className:"text-xs text-slate-400",children:"Depots where machinery, operators, and diesel tankers are stationed"})
      ]}),
      i.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[
        (branches.length>0?branches:[
          {id:1,name:"Coimbatore Main Yard & Workshop",address:"Avinashi Road, Coimbatore, Tamil Nadu - 641001",code:"CBE-01",phone:"+91 98421 23456"}
        ]).map(b=>i.jsxs("div",{key:b.id,className:"bg-[#0f172a] p-4 rounded-xl border border-[#334155] space-y-1.5",children:[
          i.jsxs("div",{className:"flex items-center justify-between",children:[
            i.jsx("h4",{className:"font-bold text-white text-sm",children:b.name}),
            i.jsx("span",{className:"px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20",children:b.code||("BR-0"+b.id)})
          ]}),
          i.jsx("p",{className:"text-xs text-slate-400",children:b.address}),
          i.jsx("p",{className:"text-xs font-mono text-slate-300",children:b.phone||"—"})
        ]}))
      ]})
    ]}),

    // TAB: Audit & Backup
    activeTab==="audit"&&i.jsxs("div",{className:"bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-xl space-y-4",children:[
      i.jsxs("div",{className:"border-b border-[#334155] pb-3 flex items-center justify-between",children:[
        i.jsxs("div",{children:[
          i.jsx("h3",{className:"text-base font-bold text-white",children:"Audit Trail & Database Snapshots"}),
          i.jsx("p",{className:"text-xs text-slate-400",children:"System logs of user logins, ledger postings, and data modifications"})
        ]}),
        i.jsxs("button",{
          onClick:()=>{
            const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify({company:compForm,users:userList,timestamp:new Date().toISOString()},null,2));
            const dl=document.createElement("a");
            dl.setAttribute("href",dataStr);
            dl.setAttribute("download","JCB360_Backup_"+new Date().toISOString().split("T")[0]+".json");
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
            showLocalToast("Database backup downloaded!");
          },
          className:"px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md",
          children:[i.jsx(rp,{size:15}),"Download JSON Backup"]
        })
      ]}),
      i.jsx("div",{className:"space-y-2",children:[
        (auditLogs.length>0?auditLogs:[
          {id:1,action:"POST_VOUCHER",details:"Posted Journal Voucher #VCH-2026-0010 (Rs. 45,000)",user:"Admin",time:"Just now"},
          {id:2,action:"SITE_LOG_ENTRY",details:"Created Site Log Entry for JCB 3DX (8.5 hrs run, 45L diesel)",user:"Admin",time:"10 mins ago"},
          {id:3,action:"LOGIN",details:"User Admin logged in from IP 192.168.1.45",user:"Admin",time:"1 hour ago"}
        ]).map(a=>i.jsxs("div",{key:a.id,className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between text-xs",children:[
          i.jsxs("div",{children:[
            i.jsx("span",{className:"font-mono font-bold text-amber-400 mr-2",children:a.action}),
            i.jsx("span",{className:"text-slate-200",children:a.details})
          ]}),
          i.jsxs("div",{className:"text-[10px] font-mono text-slate-400 text-right shrink-0 ml-4",children:[
            i.jsx("p",{children:a.user}),
            i.jsx("p",{children:a.time})
          ]})
        ]}))
      ]})
    ]}),

    // CREATE USER MODAL
    isUserModalOpen&&i.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn",children:[
      i.jsxs("div",{className:"bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp p-6 space-y-4",children:[
        i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-3",children:[
          i.jsx("h3",{className:"text-base font-bold text-white",children:"Create User Account"}),
          i.jsx("button",{onClick:()=>setIsUserModalOpen(!1),className:"text-slate-400 hover:text-white cursor-pointer",children:i.jsx(Lt,{size:18})})
        ]}),
        i.jsxs("form",{onSubmit:handleCreateUser,className:"space-y-3 text-xs font-sans",children:[
          i.jsxs("div",{children:[
            i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Full Name *"}),
            i.jsx("input",{type:"text",required:!0,value:newUserForm.name,onChange:e=>setNewUserForm(p=>({...p,name:e.target.value})),placeholder:"e.g. Ramesh Kumar",className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Username *"}),
            i.jsx("input",{type:"text",required:!0,value:newUserForm.username,onChange:e=>setNewUserForm(p=>({...p,username:e.target.value})),placeholder:"e.g. ramesh_k",className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-500"})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Role *"}),
            i.jsxs("select",{value:newUserForm.role,onChange:e=>setNewUserForm(p=>({...p,role:e.target.value})),className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-500",children:[
              i.jsx("option",{value:"OPERATOR",children:"OPERATOR"}),
              i.jsx("option",{value:"ACCOUNTANT",children:"ACCOUNTANT"}),
              i.jsx("option",{value:"MANAGER",children:"MANAGER"}),
              i.jsx("option",{value:"ADMIN",children:"ADMIN"})
            ]})
          ]}),
          i.jsxs("div",{children:[
            i.jsx("label",{className:"block font-mono text-slate-400 mb-1",children:"Phone"}),
            i.jsx("input",{type:"text",value:newUserForm.phone,onChange:e=>setNewUserForm(p=>({...p,phone:e.target.value})),placeholder:"+91 98421...",className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-500"})
          ]}),
          i.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-[#334155]",children:[
            i.jsx("button",{type:"button",onClick:()=>setIsUserModalOpen(!1),className:"px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer",children:"Cancel"}),
            i.jsx("button",{type:"submit",className:"px-5 py-2 text-xs font-mono font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-md cursor-pointer",children:"Create User"})
          ]})
        ]})
      ]})
    ]})
  ]});
}
`;

// Insert ose right before function dde()
if (!bundle.includes("function ose(")) {
  bundle = bundle.replace("function dde()", oseCode + "\nfunction dde()");
  console.log("SUCCESS: Injected function ose into bundle!");
} else {
  console.log("function ose already exists in bundle!");
}

fs.writeFileSync("public/assets/index-Dbowi09z.js", bundle, "utf8");
fs.writeFileSync("dist/assets/index-Dbowi09z.js", bundle, "utf8");
console.log("Successfully written ose into both public and dist bundles!");
