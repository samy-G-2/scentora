/*
 * Scentora — Bande son publicitaire générée en Web Audio (OfflineAudioContext)
 * Style : amapiano / pop moderne 120 BPM, log-drum mélodique, pads chaleureux.
 * Aucun sample externe : tout est synthétisé, donc 100% libre de droits.
 */

const BPM = 120;
const BEAT = 60 / BPM;          // 0.5 s
const BAR = BEAT * 4;           // 2 s
const DURATION = 30;
const SR = 44100;

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function makeImpulse(ctx, seconds = 2.6, decay = 2.6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * (i < 200 ? i / 200 : 1);
    }
  }
  return buf;
}

/* ---------------------------------------------------------------- drums */
function kick(ctx, out, t, gain = 1) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(170, t);
  o.frequency.exponentialRampToValueAtTime(48, t + 0.055);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.28);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 0.32);
  o.connect(g).connect(out);
  o.start(t); o.stop(t + 0.35);

  // click d'attaque
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, 0.02);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 1800;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.22 * gain, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
  n.connect(hp).connect(ng).connect(out);
  n.start(t);
}

function clap(ctx, out, t, gain = 0.7) {
  for (let i = 0; i < 3; i++) {
    const n = ctx.createBufferSource();
    n.buffer = noiseBuffer(ctx, 0.06);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1500 + i * 260; bp.Q.value = 1.1;
    const g = ctx.createGain();
    const tt = t + i * 0.011;
    g.gain.setValueAtTime(0, tt);
    g.gain.linearRampToValueAtTime(gain * (1 - i * 0.22), tt + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, tt + 0.085 + i * 0.02);
    n.connect(bp).connect(g).connect(out);
    n.start(tt);
  }
}

function hat(ctx, out, t, gain = 0.3, open = false) {
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, open ? 0.2 : 0.05);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 8200;
  const bp = ctx.createBiquadFilter();
  bp.type = 'peaking'; bp.frequency.value = 11000; bp.gain.value = 6;
  const g = ctx.createGain();
  const dur = open ? 0.17 : 0.045;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  n.connect(hp).connect(bp).connect(g).connect(out);
  n.start(t);
}

function shaker(ctx, out, t, gain = 0.16) {
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, 0.08);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = 6200; bp.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0006, t + 0.07);
  n.connect(bp).connect(g).connect(out);
  n.start(t);
}

/* ----------------------------------------------------------- log drum */
function logDrum(ctx, out, t, freq, gain = 0.85) {
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t);
  lp.frequency.exponentialRampToValueAtTime(240, t + 0.16);

  o.type = 'triangle';
  o.frequency.setValueAtTime(freq * 2.6, t);
  o.frequency.exponentialRampToValueAtTime(freq, t + 0.045);
  o2.type = 'sine';
  o2.frequency.setValueAtTime(freq, t);

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0012, t + 0.34);

  o.connect(lp); o2.connect(lp);
  lp.connect(g).connect(out);
  o.start(t); o2.start(t); o.stop(t + 0.36); o2.stop(t + 0.36);
}

/* --------------------------------------------------------------- pads */
function pad(ctx, out, t, freqs, dur, gain = 0.12) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.22);
  g.gain.linearRampToValueAtTime(gain * 0.75, t + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0007, t + dur);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.setValueAtTime(1500, t);
  lp.frequency.linearRampToValueAtTime(2600, t + dur * 0.4);
  lp.frequency.linearRampToValueAtTime(900, t + dur);
  lp.Q.value = 0.6;
  lp.connect(g).connect(out);
  freqs.forEach((f, i) => {
    for (const det of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = i % 2 ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      o.detune.value = det;
      const og = ctx.createGain();
      og.gain.value = 1 / (freqs.length * 2);
      o.connect(og).connect(lp);
      o.start(t); o.stop(t + dur + 0.05);
    }
  });
}

/* ----------------------------------------------------------- pluck / bell */
function pluck(ctx, out, t, freq, gain = 0.2, dur = 0.5) {
  const car = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();
  const g = ctx.createGain();
  car.type = 'sine'; car.frequency.value = freq;
  mod.type = 'sine'; mod.frequency.value = freq * 3.01;
  modGain.gain.setValueAtTime(freq * 1.6, t);
  modGain.gain.exponentialRampToValueAtTime(freq * 0.08, t + dur * 0.7);
  mod.connect(modGain).connect(car.frequency);

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
  car.connect(g).connect(out);
  car.start(t); mod.start(t);
  car.stop(t + dur + 0.02); mod.stop(t + dur + 0.02);
}

/* ------------------------------------------------------------- bass saw */
function subBass(ctx, out, t, freq, dur, gain = 0.4) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 380;
  o.type = 'sawtooth'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.setValueAtTime(gain, t + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(lp).connect(g).connect(out);
  o.start(t); o.stop(t + dur + 0.02);
}

/* ----------------------------------------------------------------- fx */
function riser(ctx, out, t, dur = 2, gain = 0.35) {
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, dur);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 3;
  bp.frequency.setValueAtTime(300, t);
  bp.frequency.exponentialRampToValueAtTime(9000, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.95);
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  n.connect(bp).connect(g).connect(out);
  n.start(t);
}

function whoosh(ctx, out, t, dur = 0.55, gain = 0.3, pan = 0) {
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx, dur);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 1.4;
  bp.frequency.setValueAtTime(1200, t);
  bp.frequency.exponentialRampToValueAtTime(5200, t + dur * 0.55);
  bp.frequency.exponentialRampToValueAtTime(700, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
  const p = ctx.createStereoPanner();
  p.pan.setValueAtTime(pan, t);
  p.pan.linearRampToValueAtTime(-pan * 0.6, t + dur);
  n.connect(bp).connect(g).connect(p).connect(out);
  n.start(t);
}

function sparkle(ctx, out, t, gain = 0.16) {
  const notes = [0, 4, 7, 12, 16];
  notes.forEach((semi, i) => {
    pluck(ctx, out, t + i * 0.045, mtof(84 + semi), gain * (1 - i * 0.12), 0.45);
  });
}

function boom(ctx, out, t, gain = 0.5) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(30, t + 0.9);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 1.1);
  o.connect(g).connect(out);
  o.start(t); o.stop(t + 1.15);
}

let _noise = new Map();
function noiseBuffer(ctx, dur) {
  const key = Math.round(dur * 1000);
  if (_noise.has(key)) return _noise.get(key);
  const len = Math.max(64, Math.floor(ctx.sampleRate * dur));
  const b = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  _noise.set(key, b);
  return b;
}

/* =========================================================== COMPOSITION */
// Progression (accords) — Amaj7 / F#m7 / Dmaj7 / E  (très "pop tendance")
const PROG = [
  { root: 57, chord: [57, 61, 64, 68], bass: 33 },  // Amaj7
  { root: 54, chord: [54, 57, 61, 64], bass: 30 },  // F#m7
  { root: 50, chord: [50, 54, 57, 61], bass: 26 },  // Dmaj7
  { root: 52, chord: [52, 56, 59, 64], bass: 28 },  // E
];

// Mélodie log-drum (en degrés relatifs au root de l'accord), par temps
const LOG_PATTERN = [
  [0, 0], [0.75, 7], [1.0, 0], [1.5, 12], [2.0, 7], [2.75, 0], [3.0, 10], [3.5, 7],
];

const BASS_PATTERN = [
  [0, 0, 0.42], [0.75, 0, 0.2], [1.5, 12, 0.22], [2.0, 0, 0.4], [2.75, 0, 0.2], [3.25, 7, 0.3],
];

// mélodie "hook" (cloche) — 2 notes accrocheuses par mesure sur certaines sections
const HOOK = [
  [0.5, 16, 0.28], [1.0, 19, 0.28], [1.5, 23, 0.4], [2.5, 19, 0.28], [3.0, 16, 0.28], [3.5, 14, 0.5],
];

export async function renderSoundtrack(onProgress) {
  const ctx = new OfflineAudioContext(2, Math.ceil(SR * DURATION), SR);

  const master = ctx.createGain();
  master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 3.2;
  comp.attack.value = 0.006; comp.release.value = 0.22;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -3.5; limiter.knee.value = 0; limiter.ratio.value = 20;
  limiter.attack.value = 0.002; limiter.release.value = 0.12;
  master.connect(comp).connect(limiter).connect(ctx.destination);

  // reverb send
  const verb = ctx.createConvolver();
  verb.buffer = makeImpulse(ctx, 2.4, 2.8);
  const verbGain = ctx.createGain();
  verbGain.gain.value = 0.55;
  verb.connect(verbGain).connect(master);

  const drums = ctx.createGain(); drums.gain.value = 0.9; drums.connect(master);
  const drumsVerb = ctx.createGain(); drumsVerb.gain.value = 0.18; drums.connect(drumsVerb).connect(verb);
  const music = ctx.createGain(); music.gain.value = 0.78; music.connect(master);
  const musicVerb = ctx.createGain(); musicVerb.gain.value = 0.4; music.connect(musicVerb).connect(verb);
  const fx = ctx.createGain(); fx.gain.value = 0.9; fx.connect(master);
  fx.connect(verb);

  // delay send pour les cloches
  const delay = ctx.createDelay(1);
  delay.delayTime.value = BEAT * 0.75;
  const fb = ctx.createGain(); fb.gain.value = 0.32;
  const dlw = ctx.createGain(); dlw.gain.value = 0.28;
  delay.connect(fb).connect(delay);
  delay.connect(dlw).connect(master);

  const bellBus = ctx.createGain();
  bellBus.gain.value = 1;
  bellBus.connect(music);
  const bellSend = ctx.createGain(); bellSend.gain.value = 0.5;
  bellBus.connect(bellSend).connect(delay);

  // --- structure (bars)
  // 0-1  intro riser + boom ; 2-3 build ; 4-9 groove complet ; 10-11 break "cute" ; 12-13 groove ; 14 final
  const totalBars = Math.floor(DURATION / BAR); // 15

  riser(ctx, fx, 0.15, 2.2, 0.3);
  boom(ctx, fx, 2.0, 0.42);
  sparkle(ctx, fx, 2.0, 0.12);

  for (let bar = 0; bar < totalBars; bar++) {
    const t0 = bar * BAR;
    const prog = PROG[bar % 4];
    const full = bar >= 2;
    const breakSection = bar >= 10 && bar <= 11;
    const finalBar = bar === 14;

    // --- pads / nappe
    if (bar >= 1 && !finalBar) {
      const chord = prog.chord.map((n) => mtof(n));
      pad(ctx, music, t0, chord, breakSection ? BAR * 1.9 : BAR * 1.05, breakSection ? 0.15 : 0.1);
    }

    // --- percussions
    if (full) {
      // kick 4/4 avec un kick "off" amapiano
      [0, 1, 2, 3].forEach((b) => kick(ctx, drums, t0 + b * BEAT, b === 0 ? 1 : 0.9));
      kick(ctx, drums, t0 + 2.75 * BEAT, 0.55);
    }
    if (full && !breakSection) {
      clap(ctx, drums, t0 + BEAT, 0.5);
      clap(ctx, drums, t0 + 2 * BEAT * 1.5 > 0 ? t0 + 3 * BEAT : t0 + 3 * BEAT, 0.5);
    }

    // hats 16th avec accents
    if (full) {
      for (let i = 0; i < 16; i++) {
        const pos = i / 4;
        const isOff = i % 4 === 2;
        const acc = isOff ? 0.24 : (i % 2 === 0 ? 0.11 : 0.07);
        const openHat = (i === 6 || i === 14) && bar % 2 === 1;
        hat(ctx, drums, t0 + pos * BEAT, acc * (breakSection ? 0.5 : 1), openHat);
      }
    }
    // shaker 8th
    for (let i = 0; i < 8; i++) {
      shaker(ctx, drums, t0 + (i / 2) * BEAT + 0.02, i % 2 ? 0.09 : 0.15);
    }

    // --- log drum mélodie
    if (bar >= 2 && !finalBar) {
      LOG_PATTERN.forEach(([pos, semi], k) => {
        if (breakSection && k % 2 === 1) return;
        const freq = mtof(prog.bass + 24 + semi);
        logDrum(ctx, music, t0 + pos * BEAT, freq, 0.8);
      });
    }

    // --- sub bass
    if (bar >= 2 && !finalBar) {
      BASS_PATTERN.forEach(([pos, semi, dur]) => {
        subBass(ctx, music, t0 + pos * BEAT, mtof(prog.bass + 12 + semi), dur, 0.3);
      });
    }

    // --- hook cloche (sections larges)
    if ((bar >= 4 && bar <= 9) || bar === 12 || bar === 13) {
      HOOK.forEach(([pos, semi, g]) => {
        pluck(ctx, bellBus, t0 + pos * BEAT, mtof(prog.root + 12 + (semi - 16)), g * 0.9, 0.55);
      });
    }

    // --- transitions
    if (bar === 3) riser(ctx, fx, t0 + BAR * 0.35, BAR * 0.62, 0.18);
    if (bar === 9) { whoosh(ctx, fx, t0 + BAR - 0.45, 0.6, 0.26, 0.6); }
    if (bar === 10) { boom(ctx, fx, t0, 0.4); sparkle(ctx, fx, t0, 0.14); }
    if (bar === 11) riser(ctx, fx, t0 + BAR * 0.45, BAR * 0.54, 0.2);
    if (bar === 13) { whoosh(ctx, fx, t0 + BAR - 0.5, 0.7, 0.3, -0.5); riser(ctx, fx, t0 + 0.9, 1.0, 0.16); }
  }

  // impacts synchronisés avec les cartons du montage
  [2.0, 6.0, 9.0, 12.0, 15.0, 18.0, 22.0, 26.0].forEach((t) => {
    boom(ctx, fx, t, 0.34);
    sparkle(ctx, fx, t + 0.02, 0.1);
  });
  [4.0, 7.5, 10.5, 13.5, 16.5, 20.0, 24.0].forEach((t) => whoosh(ctx, fx, t - 0.3, 0.45, 0.16, 0.3));

  // final : accord large + boom
  const finalT = 28.0;
  boom(ctx, fx, finalT, 0.55);
  pad(ctx, music, finalT, PROG[0].chord.map((n) => mtof(n)), 2.0, 0.2);
  pad(ctx, music, finalT, PROG[0].chord.map((n) => mtof(n + 12)), 2.0, 0.1);
  sparkle(ctx, fx, finalT + 0.05, 0.2);
  [0, 7, 12, 16, 19].forEach((s, i) => pluck(ctx, bellBus, finalT + 0.1 + i * 0.06, mtof(76 + s), 0.16, 0.9));

  // fade out doux sur la fin
  master.gain.setValueAtTime(0.9, 0);
  master.gain.setValueAtTime(0.9, 28.6);
  master.gain.linearRampToValueAtTime(0.0, 29.85);

  const rendered = await ctx.startRendering();
  return rendered;
}

/* ---------------------------------------------------------------- WAV */
export function encodeWav(buffer) {
  const numCh = buffer.numberOfChannels;
  const len = buffer.length;
  const data = new DataView(new ArrayBuffer(44 + len * numCh * 2));
  const wstr = (off, s) => { for (let i = 0; i < s.length; i++) data.setUint8(off + i, s.charCodeAt(i)); };
  wstr(0, 'RIFF'); data.setUint32(4, 36 + len * numCh * 2, true); wstr(8, 'WAVE');
  wstr(12, 'fmt '); data.setUint32(16, 16, true); data.setUint16(20, 1, true);
  data.setUint16(22, numCh, true); data.setUint32(24, buffer.sampleRate, true);
  data.setUint32(28, buffer.sampleRate * numCh * 2, true);
  data.setUint16(32, numCh * 2, true); data.setUint16(34, 16, true);
  wstr(36, 'data'); data.setUint32(40, len * numCh * 2, true);
  const chans = [];
  for (let c = 0; c < numCh; c++) chans.push(buffer.getChannelData(c));
  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, chans[c][i]));
      data.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Uint8Array(data.buffer);
}
