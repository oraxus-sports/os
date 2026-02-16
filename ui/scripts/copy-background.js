#!/usr/bin/env node
// Usage: node copy-background.js /path/to/source-image.png
// Copies source image into lib/assets, web/src/assets, and mobile/assets

import fs from 'fs';
import path from 'path';

const src = process.argv[2];
if (!src) {
  console.error('Usage: node copy-background.js /path/to/source-image.(png|jpg|jpeg)');
  process.exit(1);
}

if (!fs.existsSync(src)) {
  console.error('Source file not found:', src);
  process.exit(2);
}

const ext = path.extname(src) || '.png';
const root = path.resolve(__dirname, '..'); // ui/
const targets = [
  path.join(root, 'lib', 'assets', `sports-background${ext}`),
  path.join(root, 'web', 'src', 'assets', `sports-background${ext}`),
  path.join(root, 'mobile', 'assets', `sports-background${ext}`),
];

for (const t of targets) {
  const dir = path.dirname(t);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, t);
  console.log('Copied to', t);
}

console.log('Done.');
