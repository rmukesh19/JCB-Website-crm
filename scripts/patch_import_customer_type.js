import fs from 'fs';
import path from 'path';

const filesToPatch = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js'),
];

// 1. Textarea placeholder fix: ensure CustomerType is in placeholder text and example row
const oldTextareaPlaceholder = 'placeholder:`CustomerName,CompanyName,MobileNumber,WhatsAppNumber,Email,District,Area,Address,InterestedMachine,RentalRequirement,Budget,LeadSource,Priority\nKishore Infra,Kishore Co,+91 9999988888,+91 9999988888,kishore@infra.com,Chennai,Guindy,GST Road OMR,JCB 3DX Super,Hourly,25000,Website,HIGH`';
const newTextareaPlaceholder = 'placeholder:`CustomerName,CompanyName,MobileNumber,WhatsAppNumber,Email,District,Area,Address,CustomerType,InterestedMachine,RentalRequirement,Budget,LeadSource,Priority\nKishore Infra,Kishore Co,+91 9999988888,+91 9999988888,kishore@infra.com,Chennai,Guindy,GST Road OMR,Builder,JCB 3DX Super,Hourly,25000,Website,HIGH`';

// 2. Parser header detection fix: ensure customertype/business type is detected BEFORE generic customer/client/name check
const oldHeaderDetection = 'Je&&Ye.forEach((tt,kt)=>{tt.includes("customer")||tt==="name"?dt.customerName=kt:tt.includes("company")?dt.companyName=kt:tt.includes("whatsapp")?dt.whatsAppNumber=kt:tt.includes("mobile")||tt.includes("phone")?dt.mobileNumber=kt:tt.includes("email")?dt.email=kt:tt.includes("district")||tt.includes("city")?dt.district=kt:tt.includes("area")||tt.includes("locality")?dt.area=kt:tt.includes("address")||tt.includes("street")?dt.address=kt:tt.includes("customertype")||tt.includes("customer type")||tt.includes("type")?dt.customerType=kt:tt.includes("machine")||tt.includes("interested")?dt.interestedMachine=kt:tt.includes("requirement")||tt.includes("rental")?dt.rentalRequirement=kt:tt.includes("budget")||tt.includes("rate")||tt.includes("amount")?dt.budget=kt:tt.includes("source")?dt.leadSource=kt:tt.includes("priority")&&(dt.priority=kt)});';
const newHeaderDetection = 'Je&&Ye.forEach((tt,kt)=>{tt.includes("customertype")||tt.includes("customer type")||tt.includes("business type")||(tt.includes("type")&&!tt.includes("rental"))?dt.customerType=kt:tt.includes("customer")||tt.includes("client")||tt==="name"?dt.customerName=kt:tt.includes("company")?dt.companyName=kt:tt.includes("whatsapp")?dt.whatsAppNumber=kt:tt.includes("mobile")||tt.includes("phone")?dt.mobileNumber=kt:tt.includes("email")?dt.email=kt:tt.includes("district")||tt.includes("city")?dt.district=kt:tt.includes("area")||tt.includes("locality")?dt.area=kt:tt.includes("address")||tt.includes("street")?dt.address=kt:tt.includes("machine")||tt.includes("interested")?dt.interestedMachine=kt:tt.includes("requirement")||tt.includes("rental")?dt.rentalRequirement=kt:tt.includes("budget")||tt.includes("rate")||tt.includes("amount")?dt.budget=kt:tt.includes("source")?dt.leadSource=kt:tt.includes("priority")&&(dt.priority=kt)});';

for (const filePath of filesToPatch) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (content.includes(oldTextareaPlaceholder)) {
    content = content.replace(oldTextareaPlaceholder, newTextareaPlaceholder);
    console.log(`Updated textarea placeholder in ${filePath}`);
    modified = true;
  } else {
    console.log(`Textarea placeholder already up to date or not found in ${filePath}`);
  }

  if (content.includes(oldHeaderDetection)) {
    content = content.replace(oldHeaderDetection, newHeaderDetection);
    console.log(`Updated header detection in ${filePath}`);
    modified = true;
  } else {
    console.log(`Header detection already up to date or not found in ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved ${filePath}`);
  }
}

console.log("Import patch completed successfully.");
