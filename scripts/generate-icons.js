import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create clean, high-res brand SVG
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#d1fae5" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#064e3b" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background Squircle / Shield -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#bgGrad)" filter="url(#shadow)" />

  <!-- Inner Decorative Ring -->
  <rect x="44" y="44" width="424" height="424" rx="96" fill="none" stroke="#34d399" stroke-width="4" stroke-opacity="0.4" />

  <!-- FreshSaver Icon: Dynamic Sprout / Leaf & Shield -->
  <g transform="translate(256, 256) scale(1.15)">
    <!-- Main Fresh Sprout Leaf -->
    <path d="M-8,72 C-8,72 -96,24 -88,-64 C-80,-152 40,-168 80,-160 C80,-160 96,-72 8,-8 C-8,72 -8,72 -8,72 Z"
          fill="url(#leafGrad)" />
    <!-- Leaf Vein -->
    <path d="M-8,72 C12,16 40,-48 80,-160"
          stroke="#059669" stroke-width="10" stroke-linecap="round" fill="none" />
    <!-- Secondary Sprout Leaf -->
    <path d="M-4,40 C-36,24 -72,-16 -64,-64 C-56,-112 0,-104 24,-88 C8,-40 -4,40 -4,40 Z"
          fill="#a7f3d0" fill-opacity="0.9" />
    <!-- Energy Sparkles -->
    <circle cx="108" cy="-88" r="16" fill="#fef08a" />
    <path d="M108,-116 L113,-98 L131,-93 L113,-88 L108,-70 L103,-88 L85,-93 L103,-98 Z" fill="#fef08a" />
    <circle cx="-100" cy="-24" r="10" fill="#fef08a" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());
console.log('Saved public/icon.svg');

// Helper to write raw uncompressed PNG image
function createPngBuffer(width, height, getPixelRgba) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // color type 6: RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines (filter 0 = None)
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter byte: 0
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Precomputed CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Pixel generator for FreshSaver icon
function generatePixel(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);

  // Background shape
  const distSquircle = Math.pow(Math.abs(dx), 3.2) + Math.pow(Math.abs(dy), 3.2);

  if (!isMaskable && distSquircle > 0.95) {
    return [0, 0, 0, 0]; // Transparent outside icon bounds for standard icons
  }

  // Base background gradient: #059669 (5, 150, 105) to #047857 (4, 120, 87)
  const grad = (dy + 1) / 2;
  let r = Math.round(5 * (1 - grad) + 4 * grad);
  let g = Math.round(160 * (1 - grad) + 115 * grad);
  let b = Math.round(110 * (1 - grad) + 80 * grad);

  // Border highlight
  if (!isMaskable && distSquircle > 0.88 && distSquircle <= 0.95) {
    return [52, 211, 153, 255]; // emerald-400
  }

  // Center leaf motif
  const leafDist = Math.sqrt(Math.pow(dx + 0.05, 2) + Math.pow(dy + 0.05, 2));
  if (leafDist < 0.42) {
    // Leaf body
    return [255, 255, 255, 255];
  } else if (leafDist < 0.48 && dy < 0.2 && dx > -0.2) {
    // Leaf vein accent
    return [167, 243, 208, 255];
  }

  // Sparkle at top right
  const spDist = Math.sqrt(Math.pow(dx - 0.45, 2) + Math.pow(dy + 0.45, 2));
  if (spDist < 0.12) {
    return [254, 240, 138, 255]; // yellow sparkle
  }

  return [r, g, b, 255];
}

// Generate all standard PWA assets
const pwa192 = createPngBuffer(192, 192, (x, y, w, h) => generatePixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

const pwa512 = createPngBuffer(512, 512, (x, y, w, h) => generatePixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

const pwaMaskable512 = createPngBuffer(512, 512, (x, y, w, h) => generatePixel(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable512);

const appleIcon = createPngBuffer(180, 180, (x, y, w, h) => generatePixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

console.log('Successfully generated all PWA icons in /public!');
