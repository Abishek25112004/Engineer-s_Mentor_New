const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  if (content.includes('let ctx;') && !content.includes('let isCancelled = false;')) {
    content = content.replace(/(let ctx;)/g, '$1\n    let isCancelled = false;');
    content = content.replace(/(ctx = gsap\.context)/g, 'if (isCancelled) return;\n      $1');
    content = content.replace(/(if \(ctx\) ctx\.revert\(\);)/g, 'isCancelled = true;\n      $1');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + file);
  }
});
