// Build Vercel: decodifica imagens b64 (HTML/CSS/JS ja sao arquivos finais no repo)
const fs = require('fs');
const cat = p => fs.readdirSync('.').filter(f => f.startsWith(p)).sort()
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('og-image.jpg', Buffer.from(cat('og-p0'), 'base64'));
fs.writeFileSync('favicon.png', Buffer.from(cat('favicon-p0'), 'base64'));
console.log('build OK: imagens decodificadas');
