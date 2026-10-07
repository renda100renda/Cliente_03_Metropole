// Build Vercel: concatena partes -> arquivos finais + decodifica imagens b64
const fs = require('fs');
const html = ['index.part1.html','index.part2.html','index.part3.html','index.part4.html','index.part5.html']
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('index.html', html);
const css = ['assets/styles.part1.css','assets/styles.part2.css']
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('assets/styles.css', css);
const cat = p => fs.readdirSync('.').filter(f => f.startsWith(p)).sort()
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('og-image.jpg', Buffer.from(cat('og-p0'), 'base64'));
fs.writeFileSync('favicon.png', Buffer.from(cat('favicon-p0'), 'base64'));
console.log('build OK | index:', html.length, 'bytes | css:', css.length, 'bytes');
