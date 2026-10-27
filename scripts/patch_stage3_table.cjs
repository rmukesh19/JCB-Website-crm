const fs = require('fs');
const path = require('path');

const publicBundle = path.join(__dirname, '../public/assets/index-Dbowi09z.js');
const distBundle = path.join(__dirname, '../dist/assets/index-Dbowi09z.js');

let bundle = fs.readFileSync(publicBundle, 'utf8');

const oldTbodyHours = `i.jsx("td",{className:"py-3.5 px-4 text-right font-mono text-slate-300",children:Number(l.startHours||l.startReading||0).toFixed(1)}),
                i.jsx("td",{className:"py-3.5 px-4 text-right font-mono text-slate-300",children:Number(l.endHours||l.endReading||0).toFixed(1)}),
                i.jsxs("td",{className:"py-3.5 px-4 text-right font-mono font-bold text-amber-400",children:[Number(l.totalHours||0).toFixed(1)," h"]}),`;

const newTbodyHours = `i.jsxs("td",{className:"py-3.5 px-4 text-right font-mono",children:[
                  i.jsxs("span",{className:"font-bold text-blue-400",children:[l.totalWorkingHours||8," hrs"]}),
                  i.jsxs("span",{className:"text-[10px] text-slate-400 block font-mono",children:[l.startTime||"09:00"," - ",l.endTime||"18:00"," (",l.breakTime||1,"h brk)"]})
                ]}),
                i.jsxs("td",{className:"py-3.5 px-4 text-right font-mono",children:[
                  i.jsxs("span",{className:"font-bold text-amber-400",children:[l.totalRunHours||l.totalHours||0," hrs"]}),
                  i.jsxs("span",{className:"text-[10px] text-slate-400 block font-mono",children:[Number(l.startMeterReading||l.startHours||0).toFixed(1)," → ",Number(l.endMeterReading||l.endHours||0).toFixed(1)]})
                ]}),`;

if (bundle.includes(oldTbodyHours)) {
  bundle = bundle.replace(oldTbodyHours, newTbodyHours);
  console.log('✓ Req 3: Successfully updated SiteLogModule table row with Working Hours & Run Hours');
} else {
  console.log('• oldTbodyHours not found');
}

fs.writeFileSync(publicBundle, bundle, 'utf8');
if (fs.existsSync(distBundle)) {
  fs.writeFileSync(distBundle, bundle, 'utf8');
}
