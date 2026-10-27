const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(process.cwd(), 'public', 'assets', 'index-Dbowi09z.js'),
  path.join(process.cwd(), 'dist', 'assets', 'index-Dbowi09z.js')
];

const targetPattern = `const _tp=_cp(G.mobileNumber);`;
const replacement = `const _tp=_cp(G.mobileNumber);if(_tp==="9626546679"){f("Cannot use +91 96265 46679: This is your own WhatsApp Business sender number. Please enter the customer's mobile number.","WARNING");return}`;

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetPattern) && !content.includes(`if(_tp==="9626546679")`)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Successfully patched sender number guard in: ${file}`);
    } else {
      console.log(`Pattern check for ${file}: already patched or pattern missing`);
    }
  }
});
