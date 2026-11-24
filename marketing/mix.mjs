/* Mélange musique + voix off (ducking auto) puis remuxe de la vidéo.
   Usage : node mix.mjs [video-in] [soundtrack.wav] [video-out] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const FFMPEG = process.env.FFMPEG_BIN || path.join(REPO, 'node_modules/@ffmpeg-installer/linux-x64/ffmpeg');
const FFPROBE = process.env.FFPROBE_BIN || path.join(REPO, 'node_modules/@ffprobe-installer/linux-x64/ffprobe');

const DURATION = 30;
const videoIn = process.argv[2] || path.join(REPO, 'out/scentora-pub.mp4');
const musicIn = process.argv[3] || path.join(REPO, 'out/soundtrack.wav');
const videoOut = process.argv[4] || path.join(REPO, 'out/scentora-pub-vo.mp4');

const script = JSON.parse(fs.readFileSync(path.join(__dirname, 'vo/script.json'), 'utf8'));
const probe = f => parseFloat(execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

/* 1. préparation de chaque prise : silence coupé, tempo, fondu de sortie */
const tmp = path.join(__dirname, 'vo/trim');
fs.mkdirSync(tmp, { recursive: true });

const clips = [];
for (const seg of script.segments) {
  const src = path.join(__dirname, 'vo', seg.file);
  const out = path.join(tmp, 'p-' + seg.file.replace('.mp3', '.wav'));
  const tempo = seg.tempo || 1;
  // passe 1 : nettoyage + compression + tempo
  const mid = path.join(tmp, 'mid-' + seg.file.replace('.mp3', '.wav'));
  execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', src,
    '-af', `highpass=f=90,acompressor=threshold=0.07:ratio=3:attack=6:release=140:makeup=2.2,volume=1.6,atempo=${tempo}`,
    '-ar', '48000', '-ac', '2', mid]);
  const raw = probe(mid);
  // passe 2 : fondu de sortie (afade est cassé dans ce build de ffmpeg → enveloppe de volume)
  const fade = Math.min(0.18, raw * 0.15);
  execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', mid,
    '-af', `volume='min(1,max(0,(${(raw).toFixed(3)}-t)/${fade.toFixed(3)}))':eval=frame`,
    '-ar', '48000', '-ac', '2', out]);
  const d = probe(out);
  clips.push({ ...seg, file: out, d });
}

/* 2. placement (on décale si ça se chevauche) */
let cursor = 0;
clips.forEach((c, i) => {
  const start = Math.max(c.start, cursor + (i ? 0.14 : 0));
  c.actual = +start.toFixed(3);
  cursor = c.actual + c.d;
});
const last = clips.at(-1);
if (last.actual + last.d > DURATION - 0.25) {
  last.actual = +(DURATION - 0.25 - last.d).toFixed(3);
  if (last.actual < clips.at(-2).actual + clips.at(-2).d + 0.1) {
    throw new Error('Voix off trop longue pour 30 s — réduis les textes ou augmente les tempos dans vo/script.json');
  }
}

/* 3. filtergraph */
const inputs = ['-i', videoIn, '-i', musicIn];
const f = [];
const voLabels = [];
clips.forEach((c, i) => {
  inputs.push('-i', c.file);
  const ms = Math.round(c.actual * 1000);
  f.push(`[${i + 2}:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.0,adelay=${ms}|${ms}[v${i}]`);
  voLabels.push(`[v${i}]`);
});

f.push('[1:a]highpass=f=30,volume=1.0,asplit=2[mA][mB]');
f.push(`${voLabels.join('')}amix=inputs=${clips.length}:weights=${Array(clips.length).fill('1').join(' ')}:duration=longest,apad=whole_len=1440000,asplit=2[vMix][vKey]`);
f.push('[mB]aformat=channel_layouts=stereo[mb2]');
f.push('[vKey]aformat=channel_layouts=stereo[vk2]');
f.push('[mb2][vk2]sidechaincompress=threshold=0.035:ratio=10:attack=10:release=300:makeup=1[musDuck]');
f.push('[mA]volume=0.32[mLow]');
f.push('[musDuck][mLow][vMix]amix=inputs=3:weights=0.90 0.42 2.1:duration=first,alimiter=limit=0.94:level=0[pre]');
f.push('[pre]loudnorm=I=-14:TP=-1.3:LRA=9:print_format=none,aresample=48000,atrim=0:30[aout]');

console.log('Timeline voix off :');
clips.forEach(c => console.log(`  ${String(c.actual).padStart(6)}s → ${(c.actual + c.d).toFixed(2)}s  « ${c.text} »`));

execFileSync(FFMPEG, [
  '-y', '-v', 'error', ...inputs,
  '-filter_complex', f.join(';'),
  '-map', '0:v:0', '-map', '[aout]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
  '-shortest', '-movflags', '+faststart', videoOut,
], { stdio: 'inherit' });

console.log('\n✔', videoOut, (fs.statSync(videoOut).size / 1e6).toFixed(1), 'Mo');
