const fs = require('fs');
const path = require('path');

const publicBundle = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
const distBundle = path.join(__dirname, '../dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundle, 'utf8');

// 1. In SiteLogModule: Add calcWorkingHours & calcRunHours helper functions and update initialForm
const oldSiteLogInit = `const initialForm={
    machineId:"",
    machineNumber:"",
    customerId:"",
    customerName:"",
    siteLocation:"",
    operatorName:"",
    workDate:new Date().toISOString().split("T")[0],
    startHours:"",
    endHours:"",
    totalHours:"",
    dieselConsumed:"",
    status:"Working",
    workDescription:""
  };`;

const newSiteLogInit = `const calcWorkingHours = (sTime, eTime, bHrs) => {
    if (!sTime || !eTime) return 0;
    const parseM = t => {
      const m = String(t).trim().match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)?$/i);
      if (!m) return null;
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      const ap = m[3] ? m[3].toUpperCase() : null;
      if (ap === "PM" && h < 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return h * 60 + min;
    };
    const sm = parseM(sTime);
    const em = parseM(eTime);
    const brk = Number(bHrs) || 0;
    if (sm !== null && em !== null) {
      let diff = em - sm;
      if (diff < 0) diff += 24 * 60;
      return Math.max(0, Number(((diff / 60) - brk).toFixed(2)));
    }
    return 0;
  };
  const calcRunHours = (sMeter, eMeter) => {
    const s = Number(sMeter);
    const e = Number(eMeter);
    if (!isNaN(s) && !isNaN(e) && e >= s) {
      return Number((e - s).toFixed(2));
    }
    return 0;
  };
  const initialForm={
    machineId:"",
    machineNumber:"",
    customerId:"",
    customerName:"",
    siteLocation:"",
    operatorName:"",
    workDate:new Date().toISOString().split("T")[0],
    startTime:"09:00",
    endTime:"18:00",
    breakTime:1.0,
    totalWorkingHours:8.0,
    startMeterReading:"",
    endMeterReading:"",
    totalRunHours:"",
    startHours:"",
    endHours:"",
    totalHours:"",
    dieselConsumed:"",
    status:"Working",
    workDescription:""
  };`;

if (bundle.includes(oldSiteLogInit)) {
  bundle = bundle.replace(oldSiteLogInit, newSiteLogInit);
  console.log('✓ Req 3: Injected calcWorkingHours and updated initialForm');
}

// 2. In handleOpenCreate:
const oldHandleOpenCreate = `setFormData({
      ...initialForm,
      machineId:m0.id||"",
      machineNumber:m0.id?(m0.modelName||m0.name||"")+" ("+(m0.plateNumber||m0.code||m0.id)+")":"",
      customerId:c0.id||"",
      customerName:c0.name||"",
      operatorName:o0.name||"",
      workDate:new Date().toISOString().split("T")[0]
    });`;

const newHandleOpenCreate = `const curM = Number(m0.currentHours || 3840);
    setFormData({
      ...initialForm,
      machineId:m0.id||"",
      machineNumber:m0.id?(m0.modelName||m0.name||"")+" ("+(m0.plateNumber||m0.code||m0.id)+")":"",
      customerId:c0.id||"",
      customerName:c0.name||"",
      operatorName:o0.name||"",
      workDate:new Date().toISOString().split("T")[0],
      startTime:"09:00",
      endTime:"18:00",
      breakTime:1.0,
      totalWorkingHours:8.0,
      startMeterReading:curM,
      endMeterReading:curM + 8,
      totalRunHours:8.0,
      startHours:curM,
      endHours:curM + 8,
      totalHours:8.0
    });`;

if (bundle.includes(oldHandleOpenCreate)) {
  bundle = bundle.replace(oldHandleOpenCreate, newHandleOpenCreate);
  console.log('✓ Req 3: Updated handleOpenCreate with initial calculation values');
}

// 3. In handleOpenEdit:
const oldHandleOpenEdit = `startHours:Number(l.startHours||l.startReading||0),
      endHours:Number(l.endHours||l.endReading||0),
      totalHours:Number(l.totalHours||0),
      dieselConsumed:Number(l.dieselConsumed||l.dieselFilledLiters||0),
      status:l.status||"Working",
      workDescription:l.workDescription||""
    });
    setIsEditOpen(!0);`;

const newHandleOpenEdit = `startTime:l.startTime||"09:00",
      endTime:l.endTime||"18:00",
      breakTime:l.breakTime!==undefined?l.breakTime:1.0,
      totalWorkingHours:l.totalWorkingHours||calcWorkingHours(l.startTime||"09:00",l.endTime||"18:00",l.breakTime!==undefined?l.breakTime:1.0),
      startMeterReading:Number(l.startMeterReading||l.startHours||l.startReading||0),
      endMeterReading:Number(l.endMeterReading||l.endHours||l.endReading||0),
      totalRunHours:Number(l.totalRunHours||l.totalHours||0),
      startHours:Number(l.startMeterReading||l.startHours||l.startReading||0),
      endHours:Number(l.endMeterReading||l.endHours||l.endReading||0),
      totalHours:Number(l.totalRunHours||l.totalHours||0),
      dieselConsumed:Number(l.dieselConsumed||l.dieselFilledLiters||0),
      status:l.status||"Working",
      workDescription:l.workDescription||""
    });
    setIsEditOpen(!0);`;

if (bundle.includes(oldHandleOpenEdit)) {
  bundle = bundle.replace(oldHandleOpenEdit, newHandleOpenEdit);
  console.log('✓ Req 3: Updated handleOpenEdit with calculation fields');
}

// 4. In Create Modal inputs: replace Start Time/Hours & End Time/Hours with both calculation cards
const oldCreateInputs = `i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Start Time/Hours (Reading) *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.startHours===0||formData.startHours==="0"?"":formData.startHours,
                onChange:e=>{
                  const s=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    startHours:s,
                    totalHours:Number(prev.endHours)>=s?Number((Number(prev.endHours)-s).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"End Time/Hours (Reading) *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.endHours===0||formData.endHours==="0"?"":formData.endHours,
                onChange:e=>{
                  const ed=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    endHours:ed,
                    totalHours:ed>=Number(prev.startHours)?Number((ed-Number(prev.startHours)).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between",children:[
              i.jsxs("div",{children:[
                i.jsx("p",{className:"text-[10px] font-mono text-slate-400 uppercase",children:"Calculated Running Hours"}),
                i.jsxs("p",{className:"text-lg font-black text-amber-400 font-mono mt-0.5",children:[formData.totalHours," ","hrs"]})
              ]}),
              i.jsx(wb,{size:20,className:"text-amber-400/50"})
            ]})`;

const newCalculationInputs = `i.jsxs("div",{className:"sm:col-span-2 bg-[#0f172a] p-3.5 rounded-xl border border-blue-500/30 space-y-3",children:[
              i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-2",children:[
                i.jsx("span",{className:"text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400",children:"1. Work Time & Working Hours Calculation"}),
                i.jsx("span",{className:"text-[10px] text-slate-400 font-mono",children:"Working Hours = Ending Time − Start Time − Break Duration"})
              ]}),
              i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[
                i.jsxs("div",{children:[
                  i.jsx("label",{className:"block text-xs font-mono font-semibold text-slate-300 mb-1",children:"Start Time *"}),
                  i.jsx("input",{
                    type:"time",
                    value:formData.startTime||"09:00",
                    onChange:e=>{
                      const st=e.target.value;
                      setFormData(prev=>({
                        ...prev,
                        startTime:st,
                        totalWorkingHours:calcWorkingHours(st,prev.endTime||"18:00",prev.breakTime!==undefined?prev.breakTime:1)
                      }));
                    },
                    required:!0,
                    className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  })
                ]}),
                i.jsxs("div",{children:[
                  i.jsx("label",{className:"block text-xs font-mono font-semibold text-slate-300 mb-1",children:"Break Time (hrs) *"}),
                  i.jsx("input",{
                    type:"number",
                    step:"0.25",
                    min:"0",
                    value:formData.breakTime===0||formData.breakTime==="0"?0:(formData.breakTime||1),
                    onChange:e=>{
                      const bt=Number(e.target.value)||0;
                      setFormData(prev=>({
                        ...prev,
                        breakTime:bt,
                        totalWorkingHours:calcWorkingHours(prev.startTime||"09:00",prev.endTime||"18:00",bt)
                      }));
                    },
                    required:!0,
                    className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  })
                ]}),
                i.jsxs("div",{children:[
                  i.jsx("label",{className:"block text-xs font-mono font-semibold text-slate-300 mb-1",children:"Ending Time *"}),
                  i.jsx("input",{
                    type:"time",
                    value:formData.endTime||"18:00",
                    onChange:e=>{
                      const et=e.target.value;
                      setFormData(prev=>({
                        ...prev,
                        endTime:et,
                        totalWorkingHours:calcWorkingHours(prev.startTime||"09:00",et,prev.breakTime!==undefined?prev.breakTime:1)
                      }));
                    },
                    required:!0,
                    className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  })
                ]})
              ]}),
              i.jsxs("div",{className:"bg-blue-500/10 border border-blue-500/30 rounded-lg p-2.5 flex items-center justify-between",children:[
                i.jsxs("div",{children:[
                  i.jsx("p",{className:"text-[10px] font-mono text-blue-300 uppercase font-semibold",children:"Calculated Total Working Hours"}),
                  i.jsxs("p",{className:"text-lg font-black text-blue-400 font-mono mt-0.5",children:[formData.totalWorkingHours||8," hrs"]})
                ]}),
                i.jsx(wb,{size:20,className:"text-blue-400/60"})
              ]})
            ]}),
            i.jsxs("div",{className:"sm:col-span-2 bg-[#0f172a] p-3.5 rounded-xl border border-amber-500/30 space-y-3",children:[
              i.jsxs("div",{className:"flex items-center justify-between border-b border-[#334155] pb-2",children:[
                i.jsx("span",{className:"text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400",children:"2. Machine Meter Readings & Total Run Hours"}),
                i.jsx("span",{className:"text-[10px] text-slate-400 font-mono",children:"Total Run Hours = Ending Meter Reading − Starting Meter Reading"})
              ]}),
              i.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[
                i.jsxs("div",{children:[
                  i.jsx("label",{className:"block text-xs font-mono font-semibold text-slate-300 mb-1",children:"Starting Meter Reading *"}),
                  i.jsx("input",{
                    type:"number",
                    step:"0.1",
                    value:formData.startMeterReading===0||formData.startMeterReading==="0"?"":(formData.startMeterReading||formData.startHours||""),
                    onChange:e=>{
                      const sm=Number(e.target.value)||0;
                      setFormData(prev=>{
                        const em=Number(prev.endMeterReading||prev.endHours)||0;
                        const rH=em>=sm?Number((em-sm).toFixed(2)):0;
                        return { ...prev, startMeterReading:sm, startHours:sm, totalRunHours:rH, totalHours:rH };
                      });
                    },
                    required:!0,
                    placeholder:"e.g. 3840.0",
                    className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  })
                ]}),
                i.jsxs("div",{children:[
                  i.jsx("label",{className:"block text-xs font-mono font-semibold text-slate-300 mb-1",children:"Ending Meter Reading *"}),
                  i.jsx("input",{
                    type:"number",
                    step:"0.1",
                    value:formData.endMeterReading===0||formData.endMeterReading==="0"?"":(formData.endMeterReading||formData.endHours||""),
                    onChange:e=>{
                      const em=Number(e.target.value)||0;
                      setFormData(prev=>{
                        const sm=Number(prev.startMeterReading||prev.startHours)||0;
                        const rH=em>=sm?Number((em-sm).toFixed(2)):0;
                        return { ...prev, endMeterReading:em, endHours:em, totalRunHours:rH, totalHours:rH };
                      });
                    },
                    required:!0,
                    placeholder:"e.g. 3848.5",
                    className:"w-full bg-slate-800 border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  })
                ]})
              ]}),
              i.jsxs("div",{className:"bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between",children:[
                i.jsxs("div",{children:[
                  i.jsx("p",{className:"text-[10px] font-mono text-amber-300 uppercase font-semibold",children:"Calculated Total Run Hours"}),
                  i.jsxs("p",{className:"text-lg font-black text-amber-400 font-mono mt-0.5",children:[formData.totalRunHours||formData.totalHours||0," hrs"]})
                ]}),
                i.jsx(wb,{size:20,className:"text-amber-400/60"})
              ]})
            ]})`;

if (bundle.includes(oldCreateInputs)) {
  bundle = bundle.replace(oldCreateInputs, newCalculationInputs);
  console.log('✓ Req 3: Replaced Create Modal inputs with dual calculation cards');
}

// 5. In Edit Modal inputs: replace Start Time/Hours & End Time/Hours with dual calculation cards
const oldEditInputs = `i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"Start Time/Hours *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.startHours===0||formData.startHours==="0"?"":formData.startHours,
                onChange:e=>{
                  const s=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    startHours:s,
                    totalHours:Number(prev.endHours)>=s?Number((Number(prev.endHours)-s).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{children:[
              i.jsx("label",{className:"block text-xs font-mono font-medium text-slate-300 mb-1",children:"End Time/Hours *"}),
              i.jsx("input",{
                type:"number",
                step:"0.1",
                value:formData.endHours===0||formData.endHours==="0"?"":formData.endHours,
                onChange:e=>{
                  const ed=Number(e.target.value)||0;
                  setFormData(prev=>({
                    ...prev,
                    endHours:ed,
                    totalHours:ed>=Number(prev.startHours)?Number((ed-Number(prev.startHours)).toFixed(1)):0
                  }));
                },
                required:!0,
                className:"w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              })
            ]}),
            i.jsxs("div",{className:"bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between",children:[
              i.jsxs("div",{children:[
                i.jsx("p",{className:"text-[10px] font-mono text-slate-400 uppercase",children:"Calculated Running Hours"}),
                i.jsxs("p",{className:"text-lg font-black text-amber-400 font-mono mt-0.5",children:[formData.totalHours," ","hrs"]})
              ]}),
              i.jsx(wb,{size:20,className:"text-amber-400/50"})
            ]})`;

if (bundle.includes(oldEditInputs)) {
  bundle = bundle.replace(oldEditInputs, newCalculationInputs);
  console.log('✓ Req 3: Replaced Edit Modal inputs with dual calculation cards');
}

// 6. In Table headers & rows:
const oldTableHeaders = `i.jsx("th",{className:"py-3 px-4",children:"Hours (Reading)"}),`;
const newTableHeaders = `i.jsx("th",{className:"py-3 px-4",children:"Total Working Hours"}),i.jsx("th",{className:"py-3 px-4",children:"Total Run Hours"}),`;

if (bundle.includes(oldTableHeaders)) {
  bundle = bundle.replace(oldTableHeaders, newTableHeaders);
  console.log('✓ Req 3: Updated SiteLog table headers for working & run hours');
}

const oldTableRowHours = `i.jsxs("td",{className:"py-3.5 px-4 font-mono",children:[
                    i.jsxs("div",{className:"font-bold text-white",children:[l.totalHours," hrs"]}),
                    i.jsxs("div",{className:"text-[10px] text-slate-400",children:[l.startHours," → ",l.endHours]})
                  ]}),`;

const newTableRowHours = `i.jsxs("td",{className:"py-3.5 px-4 font-mono",children:[
                    i.jsxs("div",{className:"font-bold text-blue-400",children:[l.totalWorkingHours||l.totalHours||8," hrs"]}),
                    i.jsxs("div",{className:"text-[10px] text-slate-400",children:[l.startTime||"09:00"," - ",l.endTime||"18:00"," (",l.breakTime||1,"h brk)"]})
                  ]}),
                  i.jsxs("td",{className:"py-3.5 px-4 font-mono",children:[
                    i.jsxs("div",{className:"font-bold text-amber-400",children:[l.totalRunHours||l.totalHours||0," hrs"]}),
                    i.jsxs("div",{className:"text-[10px] text-slate-400",children:[l.startMeterReading||l.startHours||0," → ",l.endMeterReading||l.endHours||0]})
                  ]}),`;

if (bundle.includes(oldTableRowHours)) {
  bundle = bundle.replace(oldTableRowHours, newTableRowHours);
  console.log('✓ Req 3: Updated SiteLog table row columns for working & run hours');
}

fs.writeFileSync(publicBundle, bundle, 'utf8');
if (fs.existsSync(distBundle)) {
  fs.writeFileSync(distBundle, bundle, 'utf8');
}
console.log('Stage 3 complete!');
