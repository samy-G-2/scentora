/* Rend une image de contrôle à un instant donné (debug) : node snapshot.mjs 3.2 */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve('.');
const MIME={'.html':'text/html','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'};
const srv = http.createServer((req,rq)=>{const u=decodeURIComponent(req.url.split('?')[0]);const p=path.join(ROOT,u);
 if(!fs.existsSync(p)){rq.writeHead(404);return rq.end();}
 rq.writeHead(200,{'Content-Type':MIME[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(rq);}).listen(4599);
const browser = await puppeteer.launch({args:[...chromium.args,'--no-sandbox','--font-render-hinting=none'],executablePath:await chromium.executablePath(),headless:true,defaultViewport:{width:1080,height:1920}});
const page = await browser.newPage();
page.on('pageerror',e=>console.error('ERR',e.message));
page.on('console',m=>console.log('LOG',m.text()));
await page.goto('http://127.0.0.1:4599/render/film.html',{waitUntil:'load'});
await page.waitForFunction('window.__film && window.__film.ready()',{timeout:60000});
const times = process.argv.slice(2).map(Number);
for(const t of (times.length?times:[3.2,7.5,10.5,13.8,17,20,23,26,29])){
  await page.evaluate(tt=>window.__film.render(tt), t);
  await page.screenshot({path:`/tmp/snap_${t}.png`});
  console.log('snap', t);
}
await browser.close(); srv.close();
