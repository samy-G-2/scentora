/* Génère le QR code de la page de téléchargement (SVG + PNG) + une carte QR à l'identité Scentora.
   Usage : node make-qr.mjs [url] */
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'qr');
fs.mkdirSync(OUT, { recursive: true });

const url = process.argv[2] ||
  `https://8100-${process.env.E2B_SANDBOX_ID || 'sandbox'}.e2b.app/telecharger.html`;

const opts = {
  errorCorrectionLevel: 'H',
  margin: 2,
  width: 1024,
  color: { dark: '#061224ff', light: '#ffffffff' },
};

await QRCode.toFile(path.join(OUT, 'qr-telechargement.png'), url, opts);
await QRCode.toFile(path.join(OUT, 'qr-telechargement.svg'), url, { ...opts, type: 'svg' });
// version "sur fond clair" pour impression
await QRCode.toFile(path.join(OUT, 'qr-telechargement-print.png'), url, { ...opts, width: 2000, color: { dark: '#000000ff', light: '#ffffffff' } });

/* carte QR dorée (visuel prêt à poster / imprimer) */
const modules = QRCode.create(url, { errorCorrectionLevel: 'H' });
const size = modules.modules.size;
const data = modules.modules.data;
const cell = 12;
const qrPx = size * cell;
const pad = 110;
const W = Math.max(qrPx + pad * 2, 980);
const H = qrPx + pad * 2 + 300;

const rects = [];
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (data[y * size + x]) rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>`);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0A1E3C"/><stop offset="0.55" stop-color="#061224"/><stop offset="1" stop-color="#030A14"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#B78A24"/><stop offset="0.3" stop-color="#F2DE9B"/><stop offset="0.55" stop-color="#FFF6D8"/>
      <stop offset="0.78" stop-color="#D4AF37"/><stop offset="1" stop-color="#8E6612"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W / 2}" cy="${pad + qrPx / 2}" r="${qrPx * 0.78}" fill="#D4AF37" opacity="0.10"/>
  <rect x="${pad - 26}" y="${pad - 26}" width="${qrPx + 52}" height="${qrPx + 52}" rx="34" fill="#FFFFFF"/>
  <g transform="translate(${pad},${pad})" fill="#061224">${rects.join('')}</g>
  <text x="${W / 2}" y="${pad + qrPx + 96}" text-anchor="middle" font-family="Georgia,serif" font-size="72" font-weight="700" fill="#FFFFFF">Scentora</text>
  <text x="${W / 2}" y="${pad + qrPx + 152}" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="21" letter-spacing="4.2" fill="#D4AF37">PARFUMS ORIENTAUX AUTHENTIQUES</text>
  <text x="${W / 2}" y="${pad + qrPx + 224}" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="36" font-weight="700" fill="#FFFFFF">Scanne pour voir notre pub</text>
  <text x="${W / 2}" y="${pad + qrPx + 272}" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="27" fill="#B9C3D4">et télécharger la vidéo</text>
</svg>`;

fs.writeFileSync(path.join(OUT, 'qr-carte-scentora.svg'), svg);
console.log('QR générés dans marketing/qr/ pour :', url);
console.log('  qr-telechargement.png / .svg  (écran)');
console.log('  qr-telechargement-print.png   (impression, 2000 px)');
console.log('  qr-carte-scentora.svg         (carte dorée à poster)');
