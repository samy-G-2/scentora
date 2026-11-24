/* Rendu vidéo : ouvre film.html dans Chromium headless, capture 900 images (30 fps),
   synthétise la musique, puis assemble le tout avec ffmpeg. */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;                                  // dossier marketing/
const REPO = path.resolve(__dirname, '..');
const OUT = path.join(REPO, 'out');
const FRAMES = path.join(OUT, 'frames');
fs.mkdirSync(FRAMES, { recursive: true });

const FFMPEG = process.env.FFMPEG_BIN ||
  path.join(REPO, 'node_modules', '@ffmpeg-installer', 'linux-x64', 'ffmpeg');

const FPS = 30;
const DURATION = 30;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rq) => {
      const u = decodeURIComponent(req.url.split('?')[0]);
      const p = path.join(ROOT, u === '/' ? 'index.html' : u);
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { console.log('404', u); rq.writeHead(404); return rq.end('nope'); }
      rq.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rq);
    });
    srv.listen(0, '127.0.0.1', () => res({ srv, port: srv.address().port }));
  });
}

const { srv, port } = await serve();
const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  executablePath: await chromium.executablePath(),
  headless: true,
  defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${port}/render/film.html`, { waitUntil: 'load' });
await page.waitForFunction('window.__film && window.__film.ready()', { timeout: 60000 });
console.log('film prêt');

const total = Math.round(FPS * DURATION);
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const t = i / FPS;
  await page.evaluate(tt => window.__film.render(tt), t);
  await page.screenshot({
    path: path.join(FRAMES, `f${String(i).padStart(4, '0')}.jpg`),
    type: 'jpeg', quality: 94, optimizeForSpeed: true,
  });
  if (i % 90 === 0) console.log(`frame ${i}/${total} — ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
console.log('images capturées en', ((Date.now() - t0) / 1000).toFixed(1), 's');

/* ---------------------------------------------------------- audio */
const audioPage = await browser.newPage();
await audioPage.goto(`http://127.0.0.1:${port}/render/audio.html`, { waitUntil: 'load' });
const b64 = await audioPage.evaluate(async () => {
  const { renderSoundtrack, encodeWav } = await import('/audio-engine.js');
  const buf = await renderSoundtrack();
  const wav = encodeWav(buf);
  let s = '';
  const CH = 0x8000;
  for (let i = 0; i < wav.length; i += CH) s += String.fromCharCode.apply(null, wav.subarray(i, i + CH));
  return btoa(s);
});
const wavPath = path.join(OUT, 'soundtrack.wav');
fs.writeFileSync(wavPath, Buffer.from(b64, 'base64'));
console.log('musique rendue ->', wavPath, (fs.statSync(wavPath).size / 1e6).toFixed(1), 'Mo');

await browser.close();
srv.close();

/* -------------------------------------------------------- assemblage */
const videoOut = path.join(OUT, 'scentora-pub.mp4');
execFileSync(FFMPEG, [
  '-y', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f%04d.jpg'),
  '-i', wavPath,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-level', '4.2', '-movflags', '+faststart',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '44100',
  '-shortest',
  videoOut,
], { stdio: 'inherit' });

console.log('VIDÉO:', videoOut, (fs.statSync(videoOut).size / 1e6).toFixed(1), 'Mo');
