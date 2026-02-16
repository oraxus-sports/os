const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'mobile', 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1x1 transparent PNG
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const buf = Buffer.from(base64, 'base64');

const files = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png',
  'sports-background.png'
];

files.forEach((f) => {
  const p = path.join(outDir, f);
  fs.writeFileSync(p, buf);
  console.log('wrote', p);
});

console.log('Placeholder assets created in', outDir);
