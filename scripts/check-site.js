const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'site');
const htmlFiles = [];
function walk(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  });
}
walk(root);
const forbidden = [/\[УТОЧНИТЬ\]/i, /макет/i, /заглушк/i, /не подключ/i, /не подтвержд/i, /вымышлен/i, />[^<]*(?:placeholder|mockup|unconfirmed)[^<]*</i];
const errors = [];
for (const file of htmlFiles) {
  const contents = fs.readFileSync(file, 'utf8');
  forbidden.forEach((pattern) => {
    if (pattern.test(contents)) errors.push(path.relative(root, file) + ': forbidden text ' + pattern);
  });
  for (const match of contents.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = match[1].split(/[?#]/)[0];
    if (!link || /^(?:https?:|mailto:|tel:|#|\/api\/)/.test(link)) continue;
    const target = path.resolve(path.dirname(file), link);
    if (!fs.existsSync(target)) errors.push(path.relative(root, file) + ': missing ' + link);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Checked ' + htmlFiles.length + ' HTML pages: no forbidden text or broken local assets.');
