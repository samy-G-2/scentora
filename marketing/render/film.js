/* Scentora — spot publicitaire 1080x1920, 30 s. Rendu image par image (déterministe). */
(() => {
  const W = 1080, H = 1920;
  const cv = document.getElementById('c');
  const ctx = cv.getContext('2d');

  const GOLD = '#D4AF37', GOLD_L = '#F2DE9B', GOLD_D = '#A98420';
  const NAVY = '#061224', CREAM = '#FBF8F1';
  const PINK = '#F7BFD0', PINK_D = '#DE7FA0';

  /* ------------------------------------------------------------ utils */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inCubic: t => t * t * t,
    inOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outQuint: t => 1 - Math.pow(1 - t, 5),
    outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    outBack: (t, s = 1.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  };
  const rnd = (() => { let s = 1337; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
  const rand = (a, b) => a + Math.random() * (b - a);

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function shadowOn(blur = 60, color = 'rgba(0,0,0,.45)', oy = 24) {
    ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy;
  }
  function shadowOff() { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }

  function fitFont(text, weight, family, size, maxW) {
    let s = size;
    do { ctx.font = `${weight} ${s}px ${family}`; s -= 2; } while (ctx.measureText(text).width > maxW && s > 20);
    ctx.font = `${weight} ${s}px ${family}`;
    return s;
  }

  function goldGrad(y0, y1) {
    const g = ctx.createLinearGradient(0, y0, W, y1);
    g.addColorStop(0, '#B78A24');
    g.addColorStop(0.28, GOLD_L);
    g.addColorStop(0.5, '#FFF6D8');
    g.addColorStop(0.72, GOLD_L);
    g.addColorStop(1, '#A87718');
    return g;
  }

  function drawCover(img, x, y, w, h, scale = 1, panX = 0, panY = 0, rot = 0, alpha = 1) {
    const s = Math.max(w / img.width, h / img.height) * scale;
    const dw = img.width * s, dh = img.height * s;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.translate(x + w / 2 + panX, y + h / 2 + panY);
    if (rot) ctx.rotate(rot);
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  function drawContain(img, cx, cy, maxW, maxH, scale = 1, rot = 0, alpha = 1, flipX = false) {
    const s = Math.min(maxW / img.width, maxH / img.height) * scale;
    const dw = img.width * s, dh = img.height * s;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  function star(cx, cy, r, points = 4, inner = 0.28, rot = 0, color = GOLD_L) {
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 ? r * inner : r;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  function heart(cx, cy, s, color) {
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(s / 100, s / 100);
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(-55, -8, -42, -62, 0, -34);
    ctx.bezierCurveTo(42, -62, 55, -8, 0, 30);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  // petite étincelle "cute" animée
  function sparkle(cx, cy, r, a, color = '#FFF4CC') {
    if (a <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(cx, cy);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const ang = i * Math.PI / 2;
      ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
      ctx.lineTo(Math.cos(ang + Math.PI / 4) * r * 0.16, Math.sin(ang + Math.PI / 4) * r * 0.16);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function goldRule(cx, cy, w, a = 1) {
    const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    g.addColorStop(0, 'rgba(212,175,55,0)');
    g.addColorStop(0.5, `rgba(242,222,155,${a})`);
    g.addColorStop(1, 'rgba(212,175,55,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - w / 2, cy, w, 2);
  }

  function vignette(strength = 0.55) {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.24, W / 2, H / 2, H * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(2,6,14,${strength})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  // grain
  const grainCv = document.createElement('canvas');
  grainCv.width = grainCv.height = 220;
  {
    const g = grainCv.getContext('2d');
    const id = g.createImageData(220, 220);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = 120 + Math.random() * 135;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 26;
    }
    g.putImageData(id, 0, 0);
  }
  const grainPat = ctx.createPattern(grainCv, 'repeat');
  function grain(alpha = 0.35, frame = 0) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'overlay';
    ctx.translate(-((frame * 37) % 220), -((frame * 61) % 220));
    ctx.fillStyle = grainPat;
    ctx.fillRect(0, 0, W + 240, H + 240);
    ctx.restore();
  }

  function flash(a) {
    if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function lightSweep(t, x0, x1, y0, y1, rot = -0.5, alpha = 0.35) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(clamp(t - 0.12), 'rgba(255,255,255,0)');
    g.addColorStop(clamp(t), `rgba(255,246,214,${alpha})`);
    g.addColorStop(clamp(t + 0.14), 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.restore();
  }

  /* --------------------------------------------------------- images */
  const A = '../assets/';
  const files = {
    gold: 'scene-gold.jpg', men: 'scene-men.jpg', women: 'scene-women.jpg', yara: 'scene-yara.jpg',
    bgGold: 'bg-gold.jpg', bgYara: 'bg-yara.jpg', bgWomen: 'bg-women.jpg', bgMen: 'bg-men.jpg',
    khamrah: 'bottle-khamrah.png', asad: 'bottle-asad.png', ninepm: 'bottle-9pm.png',
    cdn: 'bottle-cdn.png', yaraBottle: 'bottle-yara.png',
  };
  const IMG = {};
  const loadOne = src => new Promise(res => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });

  /* ========================================================= SCÈNES */

  function bgNavy(seed = 0, t = 0) {
    const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
    g.addColorStop(0, '#0A1A33');
    g.addColorStop(0.55, '#061224');
    g.addColorStop(1, '#030A14');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // halo or
    const rg = ctx.createRadialGradient(W * 0.5 + Math.sin(t * 0.7 + seed) * 90, H * 0.34, 20, W * 0.5, H * 0.44, H * 0.55);
    rg.addColorStop(0, 'rgba(212,175,55,0.24)');
    rg.addColorStop(0.45, 'rgba(212,175,55,0.07)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  }

  function rotatingRings(cx, cy, t, baseAlpha = 0.3, count = 3) {
    ctx.save();
    for (let i = 0; i < count; i++) {
      const r = 250 + i * 120 + Math.sin(t * 1.2 + i) * 8;
      ctx.strokeStyle = `rgba(212,175,55,${baseAlpha * (1 - i * 0.22)})`;
      ctx.lineWidth = i === 0 ? 2.4 : 1.3;
      ctx.setLineDash([160 - i * 20, 66 + i * 24]);
      ctx.lineDashOffset = (t * (70 + i * 40)) * (i % 2 ? -1 : 1);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function logoMark(cx, cy, size, rot = 0, glow = 1) {
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(rot);
    const g = ctx.createLinearGradient(-size, -size, size, size);
    g.addColorStop(0, '#8E6612'); g.addColorStop(0.35, GOLD_L); g.addColorStop(0.6, '#FFF7DC'); g.addColorStop(1, GOLD_D);
    ctx.strokeStyle = g; ctx.lineWidth = size * 0.078; ctx.lineJoin = 'round';
    // losange "flacon" stylisé
    ctx.beginPath();
    ctx.moveTo(0, -size); ctx.lineTo(size * 0.72, 0); ctx.lineTo(0, size); ctx.lineTo(-size * 0.72, 0); ctx.closePath();
    if (glow > 0) { ctx.shadowColor = `rgba(212,175,55,${0.5 * glow})`; ctx.shadowBlur = 40; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.52); ctx.lineTo(size * 0.36, 0); ctx.lineTo(0, size * 0.52); ctx.lineTo(-size * 0.36, 0); ctx.closePath();
    ctx.fillStyle = g; ctx.globalAlpha = 0.92; ctx.fill();
    ctx.restore();
  }

  const scenes = [];

  /* ---------- 0. HOOK ---------------------------------------------- */
  scenes.push({
    start: 0, end: 2.4, name: 'hook',
    draw(t, u, dur) {
      bgNavy(0, t);
      drawingGlow(t);
      rotatingRings(W / 2, H * 0.42, t, 0.34);

      const p = ease.outBack(seg(u, 0.05, 0.75), 1.5);
      const outP = seg(u, dur - 0.25, dur);
      ctx.save();
      ctx.translate(W / 2, H * 0.40);
      ctx.scale(p * (1 + outP * 0.25), p * (1 + outP * 0.25));
      ctx.globalAlpha = 1 - outP;
      logoMark(0, -250, 92, Math.sin(t * 1.6) * 0.05);
      ctx.textAlign = 'center';
      ctx.fillStyle = goldGrad(-60, 90);
      ctx.font = '900 148px Mont';
      ctx.letterSpacing = '14px';
      shadowOn(34, 'rgba(212,175,55,.45)', 8);
      ctx.fillText('SCENTORA', 8, 46);
      shadowOff();
      ctx.letterSpacing = '0px';
      ctx.font = '600 34px Mont';
      ctx.fillStyle = 'rgba(251,248,241,.82)';
      ctx.fillText('PARFUMS ORIENTAUX AUTHENTIQUES', 0, 118);
      ctx.restore();

      // traînée de particules dorées
      for (let i = 0; i < 26; i++) {
        const ph = (t * 0.42 + rnd()) % 1;
        const x = W / 2 + Math.sin(i * 2.1 + t) * (140 + i * 22);
        const y = H * 0.95 - ph * H * 0.8;
        ctx.globalAlpha = (1 - ph) * 0.55;
        ctx.fillStyle = '#F2DE9B';
        ctx.beginPath(); ctx.arc(x, y, 1.4 + (i % 4), 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      sparkle(W * 0.18, H * 0.22, 46 * (0.6 + 0.4 * Math.sin(t * 5)), 0.5);
      sparkle(W * 0.84, H * 0.30, 30 * (0.5 + 0.5 * Math.cos(t * 4.4)), 0.45);
      vignette(0.6);
      flash(1 - seg(u, 0, 0.35));
      flash(seg(u, dur - 0.22, dur));
    },
  });

  function drawingGlow(t) {
    const g = ctx.createRadialGradient(W / 2, H * 0.42, 10, W / 2, H * 0.42, 620);
    g.addColorStop(0, 'rgba(212,175,55,.16)');
    g.addColorStop(1, 'rgba(212,175,55,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  /* ---------- 1. HERO KHAMRAH -------------------------------------- */
  scenes.push({
    start: 2.4, end: 6.0, name: 'hero',
    draw(t, u, dur) {
      // fond photo très flou + voile navy
      drawCover(IMG.bgGold, 0, 0, W, H, 1.04 + seg(u, 0, dur) * 0.07);
      const veil = ctx.createLinearGradient(0, 0, 0, H);
      veil.addColorStop(0, 'rgba(4,10,20,.55)');
      veil.addColorStop(0.30, 'rgba(4,10,20,.30)');
      veil.addColorStop(0.55, 'rgba(6,14,28,.62)');
      veil.addColorStop(1, 'rgba(3,8,16,.94)');
      ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H);
      const rgv = ctx.createRadialGradient(W / 2, H * 0.40, 30, W / 2, H * 0.44, H * 0.6);
      rgv.addColorStop(0, 'rgba(212,175,55,.20)');
      rgv.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = rgv; ctx.fillRect(0, 0, W, H);
      vignette(0.8);

      const zoom = 1 + ease.outCubic(seg(u, 0.1, 1.1)) * 0.06;
      const slide = ease.outExpo(seg(u, 0.05, 0.75));
      // pill
      ctx.save();
      ctx.globalAlpha = clamp(slide * 1.2);
      ctx.translate(W / 2, 236 - (1 - slide) * 60);
      ctx.font = '800 30px Mont'; ctx.textAlign = 'center';
      const label = 'BEST-SELLER N°1 EN ALGÉRIE';
      const tw = ctx.measureText(label).width;
      rr(-tw / 2 - 46, -38, tw + 92, 76, 38);
      ctx.fillStyle = 'rgba(212,175,55,.12)'; ctx.fill();
      ctx.strokeStyle = 'rgba(212,175,55,.6)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = GOLD_L; ctx.fillText(label, 0, 12);
      ctx.restore();

      // flacon
      const bIn = ease.outBack(seg(u, 0.15, 1.1), 1.5);
      ctx.save();
      ctx.globalAlpha = bIn;
      ctx.translate(W / 2, H * 0.405);
      ctx.scale(bIn * zoom, bIn * zoom);
      ctx.rotate(Math.sin(u * 1.1) * 0.02);
      shadowOn(70, 'rgba(0,0,0,.6)', 34);
      drawContain(IMG.khamrah, 0, 0, 1010, 820);
      shadowOff();
      ctx.restore();

      // titre
      const tIn = ease.outBack(seg(u, 0.55, 1.25), 1.7);
      ctx.save();
      ctx.translate(W / 2, H * 0.698);
      ctx.scale(tIn, tIn);
      ctx.globalAlpha = clamp(tIn);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 168px Playfair';
      shadowOn(40, 'rgba(0,0,0,.55)', 10);
      ctx.fillText('Khamrah', 0, 0);
      shadowOff();
      ctx.font = '800 44px Mont'; ctx.letterSpacing = '18px';
      ctx.fillStyle = GOLD_L;
      ctx.fillText('LATTAFA', 9, 72);
      ctx.letterSpacing = '0px';
      ctx.restore();

      goldRule(W / 2, H * 0.718, 420 * ease.outCubic(seg(u, 0.9, 1.4)));

      // baseline
      ctx.save();
      ctx.globalAlpha = ease.outCubic(seg(u, 1.0, 1.6));
      ctx.textAlign = 'center';
      ctx.font = '600 35px Mont';
      ctx.fillStyle = 'rgba(251,248,241,.86)';
      ctx.fillText('Cannelle · Vanille · Dattes', W / 2, H * 0.757);
      ctx.restore();

      // prix
      const pr = ease.outBack(seg(u, 1.25, 1.9), 2.2);
      ctx.save();
      ctx.translate(W / 2, H * 0.877);
      ctx.scale(pr, pr);
      ctx.globalAlpha = clamp(pr);
      ctx.textAlign = 'center';
      ctx.font = '600 36px Mont'; ctx.fillStyle = 'rgba(251,248,241,.42)';
      const oldPrice = '8 900 DA'; const ow = ctx.measureText(oldPrice).width;
      ctx.fillText(oldPrice, 0, -112);
      ctx.strokeStyle = 'rgba(251,248,241,.45)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-ow / 2, -124); ctx.lineTo(ow / 2, -124); ctx.stroke();
      ctx.font = '900 94px Mont';
      ctx.fillStyle = goldGrad(-60, 40);
      shadowOn(30, 'rgba(212,175,55,.4)', 6);
      ctx.fillText('7 500', 0, 6);
      ctx.font = '800 40px Mont'; ctx.fillText('DA', 0, 62);
      shadowOff();
      ctx.restore();

      // zoom punch sur le flacon à mi-scène
      const punch = seg(u, 1.55, dur);
      if (punch > 0) {
        ctx.save();
        ctx.globalAlpha = 0.9 * Math.min(1, punch * 2.2);
        shadowOff();
        // halo
        const g = ctx.createRadialGradient(W / 2, H * 0.44, 20, W / 2, H * 0.44, 420);
        g.addColorStop(0, 'rgba(255,240,190,.12)'); g.addColorStop(1, 'rgba(255,240,190,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
      lightSweep(seg(u, 1.5, 2.4), 0, W, 0, H, 0, 0.22);
      flash(seg(u, dur - 0.22, dur));
      grain(0.3, Math.floor(t * 60));
    },
  });

  /* ---------- 2. FINDER / QUIZ ------------------------------------- */
  scenes.push({
    start: 6.0, end: 8.8, name: 'finder',
    draw(t, u, dur) {
      bgNavy(2, t);
      drawingGlow(t);
      rotatingRings(W / 2, H * 0.52, t, 0.16, 2);

      const inA = ease.outCubic(seg(u, 0.02, 0.5));
      ctx.save();
      ctx.globalAlpha = inA;
      ctx.translate(0, (1 - inA) * 60);

      // carte
      const cw = 880, chh = 940, cx = (W - cw) / 2, cy = H * 0.25;
      const pop = ease.outBack(seg(u, 0.05, 0.7), 1.35);
      ctx.save();
      ctx.translate(W / 2, cy + chh / 2); ctx.scale(pop, pop); ctx.translate(-W / 2, -(cy + chh / 2));
      shadowOn(70, 'rgba(0,0,0,.5)', 30);
      rr(cx, cy, cw, chh, 54);
      const cg = ctx.createLinearGradient(cx, cy, cx + cw, cy + chh);
      cg.addColorStop(0, 'rgba(255,255,255,.10)');
      cg.addColorStop(1, 'rgba(255,255,255,.03)');
      ctx.fillStyle = cg; ctx.fill();
      shadowOff();
      ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 2; ctx.stroke();

      // "?" flottant
      ctx.save();
      ctx.translate(W / 2, cy + 148);
      const bob = Math.sin(t * 2.4) * 10;
      ctx.translate(0, bob);
      const rg = ctx.createRadialGradient(0, 0, 6, 0, 0, 110);
      rg.addColorStop(0, 'rgba(212,175,55,.42)'); rg.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(212,175,55,.16)';
      ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill();
      ctx.strokeStyle = GOLD_L; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.stroke();
      ctx.textAlign = 'center'; ctx.font = '900 74px Mont'; ctx.fillStyle = GOLD_L;
      ctx.fillText('?', 0, 26);
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.font = '600 28px Mont'; ctx.letterSpacing = '8px';
      ctx.fillStyle = 'rgba(212,175,55,.9)';
      ctx.fillText('LE QUIZ PARFUM', W / 2, cy + 300);
      ctx.letterSpacing = '0px';

      const line1 = 'Vous ne savez pas';
      const line2 = 'quel parfum choisir ?';
      fitFont(line2, '700', 'Playfair', 78, cw - 120);
      ctx.fillStyle = '#fff';
      ctx.fillText(line1, W / 2, cy + 392);
      ctx.fillText(line2, W / 2, cy + 478);

      ctx.font = '600 31px Mont';
      ctx.fillStyle = 'rgba(251,248,241,.72)';
      ctx.fillText('4 questions. Une sélection sur-mesure.', W / 2, cy + 546);

      // chips de questions
      const chips = ['Pour homme', 'Pour femme', 'Mixte', 'En soirée', 'Bureau', 'Été', 'Hiver'];
      let cxp = cx + 60, cyp = cy + 616;
      chips.forEach((c, i) => {
        const a = seg(u, 0.5 + i * 0.11, 0.78 + i * 0.11);
        if (a <= 0) return;
        const sc = ease.outBack(a, 2.2);
        ctx.save();
        ctx.globalAlpha = clamp(a);
        ctx.font = '700 26px Mont';
        const w = ctx.measureText(c).width + 58;
        if (cxp + w > cx + cw - 50) { cxp = cx + 60; cyp += 74; }
        ctx.translate(cxp + w / 2, cyp + 27);
        ctx.scale(sc, sc);
        rr(-w / 2, -27, w, 54, 27);
        const sel = i === 3;
        ctx.fillStyle = sel ? 'rgba(212,175,55,.9)' : 'rgba(255,255,255,.09)';
        ctx.fill();
        if (!sel) { ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1.6; ctx.stroke(); }
        ctx.fillStyle = sel ? '#22160A' : 'rgba(251,248,241,.9)';
        ctx.textAlign = 'center'; ctx.fillText(c, 0, 9);
        ctx.restore();
        cxp += w + 16;
      });

      // bouton
      const bA = seg(u, 1.55, 1.85);
      if (bA > 0) {
        const sc = ease.outBack(bA, 2.4);
        ctx.save();
        ctx.translate(W / 2, cy + chh - 92);
        ctx.scale(sc, sc);
        ctx.globalAlpha = clamp(bA);
        rr(-330, -46, 660, 92, 46);
        const bg = ctx.createLinearGradient(-330, 0, 330, 0);
        bg.addColorStop(0, GOLD_D); bg.addColorStop(0.5, GOLD_L); bg.addColorStop(1, GOLD_D);
        shadowOn(40, 'rgba(212,175,55,.5)', 12);
        ctx.fillStyle = bg; ctx.fill();
        shadowOff();
        ctx.fillStyle = '#20180A'; ctx.font = '900 32px Mont'; ctx.textAlign = 'center';
        ctx.fillText('TROUVER MON PARFUM', 0, 12);
        ctx.restore();
      }
      ctx.restore(); // carte
      ctx.restore();

      // petits cœurs flottants
      for (let i = 0; i < 7; i++) {
        const ph = (t * 0.28 + i * 0.14) % 1;
        const x = 90 + (i * 149) % (W - 180) + Math.sin(t + i) * 22;
        heart(x, H * 1.02 - ph * H * 1.05, 26 + (i % 3) * 9, `rgba(244,190,210,${0.28 * (1 - ph)})`);
      }
      vignette(0.5);
      flash(seg(u, dur - 0.2, dur));
      grain(0.3, Math.floor(t * 60));
    },
  });

  /* ---------- 3. TRIO PRODUITS ------------------------------------- */
  scenes.push({
    start: 8.8, end: 12.2, name: 'trio',
    draw(t, u, dur) {
      bgNavy(3, t);
      drawingGlow(t);
      // grand chiffre en fond
      ctx.save();
      ctx.globalAlpha = 0.055;
      ctx.textAlign = 'center'; ctx.fillStyle = '#FFF';
      ctx.font = '900 620px Mont';
      ctx.fillText('-24%', W / 2, H * 0.62);
      ctx.restore();

      const titleA = ease.outCubic(seg(u, 0.05, 0.55));
      ctx.save();
      ctx.globalAlpha = titleA;
      ctx.translate(0, (1 - titleA) * -50);
      ctx.textAlign = 'center';
      ctx.font = '600 28px Mont'; ctx.letterSpacing = '10px';
      ctx.fillStyle = 'rgba(212,175,55,.95)';
      ctx.fillText('NOTRE COLLECTION', W / 2, 300);
      ctx.letterSpacing = '0px';
      fitFont('Les best-sellers', '700', 'Playfair', 104, W - 140);
      ctx.fillStyle = '#fff';
      ctx.fillText('Les best-sellers', W / 2, 420);
      ctx.restore();
      goldRule(W / 2, 470, 400 * titleA);

      const cards = [
        { img: IMG.asad, name: 'Asad', brand: 'LATTAFA', price: '6 900 DA', old: '8 200', fam: 'Boisé épicé' },
        { img: IMG.ninepm, name: '9PM', brand: 'AFNAN', price: '6 500 DA', old: '7 800', fam: 'Épicé vanillé' },
        { img: IMG.cdn, name: 'Club de Nuit', brand: 'ARMAF', price: '8 500 DA', old: '9 900', fam: 'Fruité boisé' },
      ];
      const cardW = 306, cardH = 580, gap = 22;
      const totalW = cards.length * cardW + (cards.length - 1) * gap;
      let x0 = (W - totalW) / 2;
      cards.forEach((c, i) => {
        const a = seg(u, 0.22 + i * 0.16, 0.72 + i * 0.16);
        const sc = ease.outBack(a, 1.9);
        if (a <= 0) return;
        const cy = H * 0.565 + (i === 1 ? -26 : 0);
        ctx.save();
        ctx.globalAlpha = clamp(a);
        ctx.translate(x0 + cardW / 2, cy);
        ctx.scale(sc, sc);
        ctx.rotate((i - 1) * 0.012 + Math.sin(t * 1.4 + i) * 0.006);

        shadowOn(50, 'rgba(0,0,0,.55)', 26);
        rr(-cardW / 2, -cardH / 2, cardW, cardH, 34);
        const g = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
        g.addColorStop(0, 'rgba(255,255,255,.13)');
        g.addColorStop(1, 'rgba(255,255,255,.035)');
        ctx.fillStyle = g; ctx.fill();
        shadowOff();
        ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.6; ctx.stroke();

        // badge
        rr(-cardW / 2 + 18, -cardH / 2 + 18, 148, 44, 22);
        ctx.fillStyle = 'rgba(212,175,55,.92)'; ctx.fill();
        ctx.fillStyle = '#1E1508'; ctx.font = '800 21px Mont'; ctx.textAlign = 'center';
        ctx.fillText('-' + (i === 0 ? '16' : i === 1 ? '17' : '14') + '%', -cardW / 2 + 92, -cardH / 2 + 47);

        // produit
        ctx.save();
        shadowOn(34, 'rgba(0,0,0,.55)', 16);
        drawContain(c.img, 0, i === 0 ? -84 : -92, cardW - 64, i === 0 ? 340 : 300, 1);
        shadowOff();
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.font = '700 22px Mont'; ctx.letterSpacing = '6px';
        ctx.fillStyle = 'rgba(212,175,55,.95)';
        ctx.fillText(c.brand, 0, cardH / 2 - 166);
        ctx.letterSpacing = '0px';
        fitFont(c.name, '800', 'Playfair', 46, cardW - 30);
        ctx.fillStyle = '#fff';
        ctx.fillText(c.name, 0, cardH / 2 - 112);
        ctx.font = '600 22px Mont'; ctx.fillStyle = 'rgba(251,248,241,.6)';
        ctx.fillText(c.fam, 0, cardH / 2 - 76);
        ctx.font = '900 36px Mont';
        const pw = ctx.measureText(c.price).width;
        ctx.font = '600 20px Mont';
        const ow = ctx.measureText(c.old).width;
        const totW = pw + 12 + ow;
        ctx.textAlign = 'left';
        ctx.font = '900 36px Mont'; ctx.fillStyle = goldGrad(cardH / 2 - 60, cardH / 2);
        ctx.fillText(c.price, -totW / 2, cardH / 2 - 22);
        ctx.font = '600 20px Mont'; ctx.fillStyle = 'rgba(251,248,241,.38)';
        ctx.fillText(c.old, -totW / 2 + pw + 12, cardH / 2 - 26);
        ctx.strokeStyle = 'rgba(251,248,241,.45)'; ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-totW / 2 + pw + 12, cardH / 2 - 34);
        ctx.lineTo(-totW / 2 + pw + 12 + ow, cardH / 2 - 34);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.restore();
        x0 += cardW + gap;
      });

      // bandeau bas
      const bA = seg(u, 1.9, 2.4);
      if (bA > 0) {
        ctx.save();
        ctx.globalAlpha = clamp(bA);
        ctx.translate(W / 2, H * 0.845);
        ctx.scale(ease.outBack(bA, 2), ease.outBack(bA, 2));
        rr(-340, -44, 680, 88, 44);
        ctx.fillStyle = 'rgba(212,175,55,.14)'; ctx.fill();
        ctx.strokeStyle = 'rgba(212,175,55,.7)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = GOLD_L; ctx.font = '800 30px Mont'; ctx.textAlign = 'center';
        ctx.fillText('+ 17 PARFUMS EN STOCK', 0, 11);
        ctx.restore();
      }

      // zoom, whip de lumière
      lightSweep(seg(u, 1.6, 2.6), -200, W + 200, 0, H, 0, 0.2);
      vignette(0.55);
      flash(seg(u, dur - 0.2, dur) * 0.9);
      grain(0.3, Math.floor(t * 60));
    },
  });

  /* ---------- 4. PERFORMANCE / SILLAGE ----------------------------- */
  scenes.push({
    start: 12.2, end: 15.4, name: 'performance',
    draw(t, u, dur) {
      // ambiance chaleureuse floutée (mouvement lent = macro)
      ctx.fillStyle = '#050D1A'; ctx.fillRect(0, 0, W, H);
      const z = 1.08 + seg(u, 0, dur) * 0.14;
      drawCover(IMG.bgGold, 0, 0, W, H, z, Math.sin(u * 0.6) * 40, -20);
      const dk = ctx.createLinearGradient(0, 0, 0, H);
      dk.addColorStop(0, 'rgba(4,9,18,.80)');
      dk.addColorStop(0.35, 'rgba(4,9,18,.52)');
      dk.addColorStop(0.72, 'rgba(4,9,18,.72)');
      dk.addColorStop(1, 'rgba(4,9,18,.96)');
      ctx.fillStyle = dk; ctx.fillRect(0, 0, W, H);

      // titre
      const a1 = seg(u, 0.05, 0.5);
      ctx.save();
      ctx.globalAlpha = a1;
      ctx.textAlign = 'center';
      ctx.font = '600 28px Mont'; ctx.letterSpacing = '10px';
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.fillText('PERFORMANCE', W / 2, 300);
      ctx.letterSpacing = '0px';
      fitFont('Sillage XXL', '700', 'Playfair', 118, W - 120);
      ctx.fillStyle = goldGrad(330, 460);
      shadowOn(40, 'rgba(0,0,0,.5)', 8);
      ctx.fillText('Sillage XXL', W / 2, 448);
      shadowOff();
      ctx.restore();

      // flacon au centre en zoom
      const bA = ease.outBack(seg(u, 0.12, 0.7), 1.4);
      ctx.save();
      ctx.globalAlpha = clamp(bA);
      ctx.translate(W / 2, H * 0.475);
      ctx.scale(bA * (1 + seg(u, 0.6, dur) * 0.12), bA * (1 + seg(u, 0.6, dur) * 0.12));
      ctx.rotate(Math.sin(u * 0.9) * 0.012);
      shadowOn(80, 'rgba(0,0,0,.65)', 30);
      drawContain(IMG.khamrah, 0, 0, 980, 860);
      shadowOff();
      ctx.restore();

      // ondes de sillage
      for (let i = 0; i < 4; i++) {
        const ph = ((u * 0.42 + i * 0.25) % 1);
        ctx.save();
        ctx.globalAlpha = (1 - ph) * 0.35;
        ctx.strokeStyle = GOLD_L; ctx.lineWidth = 3 - ph * 2;
        ctx.beginPath(); ctx.arc(W / 2, H * 0.475, 190 + ph * 620, 0, 7); ctx.stroke();
        ctx.restore();
      }

      // barres de stats
      const stats = [
        { label: 'TENUE', value: '12h+', p: 0.94, d: 0.95 },
        { label: 'SILLAGE', value: '9/10', p: 0.88, d: 1.15 },
        { label: 'INTENSITÉ', value: 'FORTE', p: 0.8, d: 1.35 },
      ];
      stats.forEach((s, i) => {
        const a = seg(u, s.d, s.d + 0.35);
        if (a <= 0) return;
        const y = H * 0.775 + i * 116;
        ctx.save();
        ctx.globalAlpha = clamp(a * 1.3);
        ctx.font = '700 26px Mont'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,.8)';
        ctx.fillText(s.label, 120, y);
        ctx.textAlign = 'right'; ctx.font = '800 26px Mont'; ctx.fillStyle = GOLD_L;
        ctx.fillText(s.value, W - 120, y);
        // rail
        rr(120, y + 26, W - 240, 18, 9);
        ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill();
        const w = (W - 240) * s.p * ease.outCubic(a);
        if (w > 4) {
          const g = ctx.createLinearGradient(120, 0, 120 + w, 0);
          g.addColorStop(0, '#A98420'); g.addColorStop(0.6, GOLD_L); g.addColorStop(1, '#FFF3CF');
          rr(120, y + 26, w, 18, 9);
          ctx.fillStyle = g;
          shadowOn(20, 'rgba(212,175,55,.65)', 0);
          ctx.fill(); shadowOff();
        }
        ctx.restore();
      });

      vignette(0.7);
      flash(seg(u, dur - 0.18, dur));
      grain(0.32, Math.floor(t * 60));
    },
  });

  /* ---------- 5. YARA / PINK CUTE ---------------------------------- */
  scenes.push({
    start: 15.4, end: 18.2, name: 'yara',
    draw(t, u, dur) {
      // fond pastel
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#FDE7EE');
      g.addColorStop(0.5, '#F8CEDA');
      g.addColorStop(1, '#EFB4C7');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // halo
      const rg = ctx.createRadialGradient(W / 2, H * 0.44, 30, W / 2, H * 0.44, 700);
      rg.addColorStop(0, 'rgba(255,255,255,.85)');
      rg.addColorStop(0.6, 'rgba(255,255,255,.25)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

      // cœurs flottants
      for (let i = 0; i < 14; i++) {
        const ph = (t * 0.22 + i * 0.09) % 1;
        const x = 60 + ((i * 197) % (W - 120)) + Math.sin(t * 1.3 + i) * 26;
        const y = H * 1.05 - ph * H * 1.15;
        const s = 30 + (i % 4) * 14;
        heart(x, y, s, `rgba(226,120,160,${0.18 + 0.12 * (1 - ph)})`);
      }
      // sparkles
      for (let i = 0; i < 10; i++) {
        sparkle(
          90 + ((i * 233) % (W - 180)),
          200 + ((i * 411) % (H - 500)),
          16 + (i % 3) * 10,
          0.35 + 0.35 * Math.sin(t * 4 + i),
          'rgba(255,255,255,.95)'
        );
      }

      // photo de fond (flacon rose dans les fleurs) en médaillon
      const mA = ease.outBack(seg(u, 0.05, 0.7), 1.3);
      ctx.save();
      ctx.globalAlpha = clamp(mA);
      ctx.translate(W / 2, H * 0.40);
      ctx.scale(mA, mA);
      ctx.beginPath(); ctx.arc(0, 0, 356, 0, 7); ctx.closePath();
      ctx.save(); ctx.clip();
      const zy = Math.max(712 / IMG.yara.width, 712 / IMG.yara.height) * (1.02 + seg(u, 0.4, dur) * 0.1);
      ctx.drawImage(IMG.yara, -IMG.yara.width * zy / 2, -356 - 40, IMG.yara.width * zy, IMG.yara.height * zy);
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 12; ctx.stroke();
      ctx.strokeStyle = 'rgba(222,127,160,.55)'; ctx.lineWidth = 3; ctx.stroke();
      ctx.restore();

      // badge "CUTE"
      const bA = seg(u, 0.35, 0.7);
      if (bA > 0) {
        ctx.save();
        ctx.globalAlpha = clamp(bA);
        const bob = Math.sin(t * 2.6) * 8;
        ctx.translate(W / 2 + 262, H * 0.40 - 262 + bob);
        ctx.rotate(0.16);
        ctx.scale(ease.outBack(bA, 2.4), ease.outBack(bA, 2.4));
        rr(-118, -50, 236, 100, 50);
        ctx.fillStyle = '#FFFFFF'; ctx.fill();
        shadowOn(24, 'rgba(222,127,160,.5)', 8);
        ctx.fillStyle = '#DE7FA0'; ctx.font = '900 34px Mont'; ctx.textAlign = 'center';
        ctx.fillText('TENDANCE', 0, 12); shadowOff();
        ctx.restore();
      }

      // textes
      const tA = ease.outBack(seg(u, 0.4, 1.05), 1.6);
      ctx.save();
      ctx.globalAlpha = clamp(tA);
      ctx.translate(W / 2, H * 0.705);
      ctx.scale(1 + (1 - tA) * 0.2, 1 + (1 - tA) * 0.2);
      ctx.textAlign = 'center';
      ctx.font = '800 34px Mont'; ctx.letterSpacing = '14px';
      ctx.fillStyle = 'rgba(150,70,100,.95)';
      ctx.fillText('LATTAFA', 7, -118);
      ctx.letterSpacing = '0px';
      ctx.font = '700 176px Playfair';
      ctx.fillStyle = '#7C3350';
      shadowOn(30, 'rgba(255,255,255,.6)', 6);
      ctx.fillText('Yara', 0, 36);
      shadowOff();
      ctx.font = '700 40px Mont'; ctx.fillStyle = 'rgba(124,51,80,.8)';
      ctx.fillText('Floral Gourmand', 0, 106);
      ctx.restore();

      // prix
      const pA = seg(u, 0.85, 1.2);
      ctx.save();
      ctx.globalAlpha = clamp(pA);
      ctx.translate(W / 2, H * 0.845);
      ctx.scale(ease.outBack(pA, 2.2), ease.outBack(pA, 2.2));
      rr(-250, -56, 500, 112, 56);
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
      shadowOn(30, 'rgba(180,80,120,.32)', 10);
      shadowOff();
      ctx.textAlign = 'center'; ctx.font = '900 62px Mont'; ctx.fillStyle = '#C2557C';
      ctx.fillText('6 500 DA', 0, 22);
      ctx.restore();

      // petites notes gourmandes
      const nA = seg(u, 1.15, 1.5);
      if (nA > 0) {
        ctx.save(); ctx.globalAlpha = clamp(nA);
        ctx.textAlign = 'center'; ctx.font = '600 30px Mont'; ctx.fillStyle = 'rgba(124,51,80,.85)';
        ctx.fillText('Vanille · Orchidée · Mandarine', W / 2, H * 0.93);
        ctx.restore();
      }
      vignette(0.22);
      flash(seg(u, dur - 0.2, dur) * 0.85);
      grain(0.22, Math.floor(t * 60));
    },
  });

  /* ---------- 6. LIVRAISON / COD ----------------------------------- */
  scenes.push({
    start: 18.2, end: 21.4, name: 'delivery',
    draw(t, u, dur) {
      bgNavy(4, t);
      drawingGlow(t);

      // carte de l'Algérie en pointillés stylisés
      ctx.save();
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 90; i++) {
        const x = 120 + ((i * 137) % (W - 240));
        const y = H * 0.24 + ((i * 271) % 520);
        const d = Math.hypot(x - W / 2, y - (H * 0.36)) / 420;
        const a = clamp(1 - d) * (0.2 + 0.2 * Math.sin(t * 3 + i));
        ctx.fillStyle = `rgba(212,175,55,${a})`;
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill();
      }
      // arcs de livraison
      for (let i = 0; i < 3; i++) {
        const ph = (u * 0.55 + i * 0.33) % 1;
        ctx.strokeStyle = `rgba(242,222,155,${0.5 * (1 - ph)})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(W / 2, H * 0.36, 60 + ph * 460, 0, 7); ctx.stroke();
      }
      ctx.restore();

      // pin
      const pA = ease.outBack(seg(u, 0.1, 0.6), 2);
      ctx.save();
      ctx.translate(W / 2, H * 0.34);
      ctx.scale(pA, pA);
      const glow = ctx.createRadialGradient(0, 0, 6, 0, 0, 120);
      glow.addColorStop(0, 'rgba(212,175,55,.5)'); glow.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 120, 0, 7); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 52); ctx.bezierCurveTo(-46, -6, -42, -62, 0, -62);
      ctx.bezierCurveTo(42, -62, 46, -6, 0, 52); ctx.closePath();
      ctx.fillStyle = GOLD_L; ctx.fill();
      ctx.beginPath(); ctx.arc(0, -20, 17, 0, 7); ctx.fillStyle = '#061224'; ctx.fill();
      ctx.restore();

      // titre
      ctx.save();
      ctx.globalAlpha = ease.outCubic(seg(u, 0.25, 0.7));
      ctx.textAlign = 'center';
      fitFont('Livraison 58 wilayas', '700', 'Playfair', 92, W - 120);
      ctx.fillStyle = '#fff';
      ctx.fillText('Livraison 58 wilayas', W / 2, H * 0.52);
      ctx.restore();
      goldRule(W / 2, H * 0.545, 420 * seg(u, 0.35, 0.8));

      // 3 cartes avantages
      const cards = [
        { t1: 'PAIEMENT', t2: 'À LA LIVRAISON', i: 'cash' },
        { t1: 'EXPÉDITION', t2: '24H – 72H', i: 'truck' },
        { t1: 'SUPPORT', t2: 'WHATSAPP 7J/7', i: 'chat' },
      ];
      const cardW = 272, gap = 20;
      let x0 = (W - (3 * cardW + 2 * gap)) / 2;
      cards.forEach((c, i) => {
        const a = seg(u, 0.6 + i * 0.16, 1.0 + i * 0.16);
        if (a <= 0) return;
        const sc = ease.outBack(a, 2);
        ctx.save();
        ctx.globalAlpha = clamp(a);
        ctx.translate(x0 + cardW / 2, H * 0.70);
        ctx.scale(sc, sc);
        shadowOn(40, 'rgba(0,0,0,.5)', 20);
        rr(-cardW / 2, -150, cardW, 300, 30);
        const g2 = ctx.createLinearGradient(0, -150, 0, 150);
        g2.addColorStop(0, 'rgba(255,255,255,.14)');
        g2.addColorStop(1, 'rgba(255,255,255,.04)');
        ctx.fillStyle = g2; ctx.fill();
        shadowOff();
        ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.5; ctx.stroke();

        // icône vectorielle
        ctx.save();
        ctx.translate(0, -72);
        ctx.strokeStyle = GOLD_L; ctx.fillStyle = GOLD_L; ctx.lineWidth = 3.4;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (c.i === 'cash') {
          rr(-38, -26, 76, 52, 8); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-30, -18); ctx.lineTo(-20, -18); ctx.stroke();
        } else if (c.i === 'truck') {
          ctx.beginPath(); ctx.moveTo(-42, 14); ctx.lineTo(-42, -14); ctx.lineTo(6, -14); ctx.lineTo(6, 14); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(22, -2); ctx.lineTo(38, 12); ctx.lineTo(38, 14); ctx.stroke();
          ctx.beginPath(); ctx.arc(-26, 20, 9, 0, 7); ctx.stroke();
          ctx.beginPath(); ctx.arc(24, 20, 9, 0, 7); ctx.stroke();
        } else {
          rr(-40, -30, 80, 56, 12); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-14, 26); ctx.lineTo(-20, 44); ctx.lineTo(6, 26); ctx.stroke();
          ctx.beginPath(); ctx.arc(-16, -2, 3, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(0, -2, 3, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(16, -2, 3, 0, 7); ctx.fill();
        }
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.font = '700 21px Mont'; ctx.fillStyle = 'rgba(251,248,241,.6)';
        ctx.fillText(c.t1, 0, 30);
        fitFont(c.t2, '800', 'Mont', 27, cardW - 34);
        ctx.fillStyle = '#fff';
        const lines = c.t2.split(' ');
        ctx.fillText(c.t2, 0, 72);
        ctx.restore();
        x0 += cardW + gap;
      });

      const fA = seg(u, 1.3, 1.7);
      if (fA > 0) {
        ctx.save();
        ctx.globalAlpha = clamp(fA);
        ctx.textAlign = 'center';
        ctx.font = '700 34px Mont'; ctx.fillStyle = GOLD_L;
        ctx.fillText('ZÉRO RISQUE. ZÉRO AVANCE.', W / 2, H * 0.875);
        ctx.restore();
      }
      vignette(0.55);
      flash(seg(u, dur - 0.2, dur));
      grain(0.3, Math.floor(t * 60));
    },
  });

  /* ---------- 7. AUTHENTIQUE / SCEAU ------------------------------- */
  scenes.push({
    start: 21.4, end: 24.6, name: 'auth',
    draw(t, u, dur) {
      bgNavy(5, t);
      // photo du flacon centrée, très diffuse
      ctx.save();
      ctx.globalAlpha = 0.30;
      drawCover(IMG.bgGold, 0, H * 0.1, W, H * 0.8, 1.15);
      ctx.restore();
      const skrim = ctx.createLinearGradient(0, 0, 0, H);
      skrim.addColorStop(0, 'rgba(4,9,18,.55)');
      skrim.addColorStop(0.5, 'rgba(4,9,18,.30)');
      skrim.addColorStop(1, 'rgba(4,9,18,.72)');
      ctx.fillStyle = skrim; ctx.fillRect(0, 0, W, H);
      const rg = ctx.createRadialGradient(W * 0.5, H * 0.36, 40, W * 0.5, H * 0.42, 800);
      rg.addColorStop(0, 'rgba(212,175,55,.20)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

      // sceau rotatif
      const sA = ease.outBack(seg(u, 0.05, 0.75), 1.6);
      ctx.save();
      ctx.translate(W / 2, H * 0.36);
      ctx.scale(sA, sA);
      ctx.rotate(t * 0.22);
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(212,175,55,${0.75 - i * 0.2})`;
        ctx.lineWidth = 2.6 - i * 0.5;
        ctx.setLineDash(i === 1 ? [8, 12] : []);
        ctx.beginPath(); ctx.arc(0, 0, 210 + i * 26, 0, 7); ctx.stroke();
      }
      ctx.setLineDash([]);
      const cg = ctx.createRadialGradient(-40, -40, 10, 0, 0, 190);
      cg.addColorStop(0, '#FFF6D8'); cg.addColorStop(0.55, GOLD_L); cg.addColorStop(1, GOLD_D);
      ctx.beginPath(); ctx.arc(0, 0, 176, 0, 7); ctx.fillStyle = cg; ctx.fill();
      ctx.restore();

      // check
      ctx.save();
      ctx.translate(W / 2, H * 0.36);
      ctx.scale(sA, sA);
      ctx.strokeStyle = '#2A2008'; ctx.lineWidth = 17; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const cA = seg(u, 0.5, 0.8);
      if (cA > 0) {
        ctx.setLineDash([200, 200]);
        ctx.lineDashOffset = 200 * (1 - cA);
        ctx.beginPath(); ctx.moveTo(-62, 6); ctx.lineTo(-14, 58); ctx.lineTo(72, -54); ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.textAlign = 'center';
      ctx.globalAlpha = ease.outCubic(seg(u, 0.35, 0.8));
      ctx.font = '600 28px Mont'; ctx.letterSpacing = '11px';
      ctx.fillStyle = 'rgba(212,175,55,.95)';
      ctx.fillText('GARANTIE SCENTORA', W / 2, H * 0.585);
      ctx.letterSpacing = '0px';
      fitFont('100% Authentique', '700', 'Playfair', 112, W - 110);
      ctx.fillStyle = '#fff';
      ctx.fillText('100% Authentique', W / 2, H * 0.665);
      ctx.restore();

      // 3 puces
      const chips = ['Hologramme vérifié', 'Flacons scellés', 'Import officiel'];
      let cxp = 0;
      ctx.font = '700 26px Mont';
      const widths = chips.map(c => ctx.measureText(c).width + 64);
      const tot = widths.reduce((a, b) => a + b, 0) + (chips.length - 1) * 18;
      cxp = (W - tot) / 2;
      chips.forEach((c, i) => {
        const a = seg(u, 0.7 + i * 0.14, 1.0 + i * 0.14);
        if (a <= 0) return;
        const sc = ease.outBack(a, 2.2);
        ctx.save();
        ctx.globalAlpha = clamp(a);
        ctx.translate(cxp + widths[i] / 2, H * 0.755);
        ctx.scale(sc, sc);
        rr(-widths[i] / 2, -34, widths[i], 68, 34);
        ctx.fillStyle = 'rgba(212,175,55,.14)'; ctx.fill();
        ctx.strokeStyle = 'rgba(212,175,55,.6)'; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.fillStyle = GOLD_L; ctx.textAlign = 'center'; ctx.font = '700 25px Mont';
        ctx.fillText(c, 0, 9);
        ctx.restore();
        cxp += widths[i] + 18;
      });

      const fA = seg(u, 1.2, 1.6);
      if (fA > 0) {
        ctx.save(); ctx.globalAlpha = clamp(fA);
        ctx.textAlign = 'center'; ctx.font = '600 30px Mont';
        ctx.fillStyle = 'rgba(251,248,241,.7)';
        ctx.fillText('Les mêmes jus, jusqu\'à 5x moins cher.', W / 2, H * 0.845);
        ctx.restore();
      }
      sparkle(W * 0.2, H * 0.2, 40, 0.4 + 0.3 * Math.sin(t * 5));
      sparkle(W * 0.82, H * 0.28, 30, 0.4 + 0.3 * Math.cos(t * 4));
      vignette(0.6);
      flash(seg(u, dur - 0.18, dur));
      grain(0.3, Math.floor(t * 60));
    },
  });

  /* ---------- 8. AVIS 4.9/5 ---------------------------------------- */
  scenes.push({
    start: 24.6, end: 27.2, name: 'social',
    draw(t, u, dur) {
      bgNavy(6, t);
      drawingGlow(t);
      rotatingRings(W / 2, H * 0.34, t, 0.14, 2);

      const a1 = ease.outBack(seg(u, 0.05, 0.65), 1.8);
      ctx.save();
      ctx.translate(W / 2, H * 0.30);
      ctx.scale(a1, a1);
      ctx.textAlign = 'center';
      ctx.font = '900 240px Mont';
      ctx.fillStyle = goldGrad(-140, 100);
      shadowOn(50, 'rgba(212,175,55,.45)', 10);
      ctx.fillText('4,9', 0, 60);
      ctx.shadowBlur = 0;
      ctx.font = '800 54px Mont'; ctx.fillStyle = 'rgba(251,248,241,.75)';
      ctx.fillText('/ 5', 0, 140);
      ctx.restore();

      // étoiles
      for (let i = 0; i < 5; i++) {
        const a = seg(u, 0.35 + i * 0.1, 0.6 + i * 0.1);
        const sc = ease.outBack(a, 2.4);
        if (a <= 0) continue;
        ctx.save();
        ctx.translate(W / 2 + (i - 2) * 84, H * 0.435);
        ctx.scale(sc, sc);
        ctx.globalAlpha = clamp(a);
        star(0, 0, 34, 5, 0.45, 0, GOLD_L);
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = ease.outCubic(seg(u, 0.5, 0.9));
      ctx.textAlign = 'center';
      fitFont('+ de 1 200 clients satisfaits', '700', 'Playfair', 76, W - 120);
      ctx.fillStyle = '#fff';
      ctx.fillText('+ de 1 200 clients satisfaits', W / 2, H * 0.535);
      ctx.font = '600 30px Mont'; ctx.fillStyle = 'rgba(251,248,241,.66)';
      ctx.fillText('Ils sentent la différence.', W / 2, H * 0.585);
      ctx.restore();

      // bulles d'avis
      const revs = [
        { n: 'Amine · Alger', txt: 'Sillage de fou, on me demande\nmon parfum tous les jours !' },
        { n: 'Lina · Oran', txt: 'Livraison en 48h, flacon scellé.\nYara est une tuerie.' },
      ];
      revs.forEach((r, i) => {
        const a = seg(u, 0.85 + i * 0.25, 1.25 + i * 0.25);
        if (a <= 0) return;
        const sc = ease.outBack(a, 1.8);
        const cw = 860, chh = 210, cx = (W - cw) / 2;
        const cy = H * 0.665 + i * 240;
        ctx.save();
        ctx.globalAlpha = clamp(a);
        ctx.translate(W / 2 + (i === 0 ? -16 : 16), cy + chh / 2);
        ctx.scale(sc, sc);
        ctx.translate(-W / 2, -(cy + chh / 2));
        shadowOn(44, 'rgba(0,0,0,.45)', 18);
        rr(cx, cy, cw, chh, 34);
        ctx.fillStyle = 'rgba(255,255,255,.09)'; ctx.fill();
        shadowOff();
        ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 1.6; ctx.stroke();

        // avatar
        ctx.beginPath(); ctx.arc(cx + 96, cy + chh / 2, 48, 0, 7);
        const ag = ctx.createLinearGradient(cx + 48, cy + chh / 2, cx + 144, cy + chh / 2);
        ag.addColorStop(0, '#D4AF37'); ag.addColorStop(1, '#8E6612');
        ctx.fillStyle = ag; ctx.fill();
        ctx.fillStyle = '#12200F'; ctx.font = '900 42px Mont'; ctx.textAlign = 'center';
        ctx.fillStyle = '#1B1408';
        ctx.fillText(r.n[0], cx + 96, cy + chh / 2 + 15);

        ctx.textAlign = 'left';
        ctx.font = '800 28px Mont'; ctx.fillStyle = GOLD_L;
        ctx.fillText(r.n, cx + 172, cy + 64);
        for (let s = 0; s < 5; s++) star(cx + 182 + s * 34, cy + 96, 12, 5, 0.45, 0, GOLD);
        ctx.font = '600 27px Mont'; ctx.fillStyle = 'rgba(251,248,241,.82)';
        r.txt.split('\n').forEach((l, k) => ctx.fillText(l, cx + 172, cy + 146 + k * 36));
        ctx.restore();
      });
      vignette(0.55);
      flash(seg(u, dur - 0.2, dur));
      grain(0.3, Math.floor(t * 60));
    },
  });

  /* ---------- 9. OUTRO CTA ---------------------------------------- */
  scenes.push({
    start: 27.2, end: 30.0, name: 'outro',
    draw(t, u, dur) {
      // fond photo + navy
      drawCover(IMG.bgGold, 0, 0, W, H, 1.06 + seg(u, 0, dur) * 0.08);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(4,10,20,.80)');
      g.addColorStop(0.35, 'rgba(4,10,20,.58)');
      g.addColorStop(0.62, 'rgba(5,11,22,.78)');
      g.addColorStop(1, 'rgba(3,7,14,.96)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      drawingGlow(t);
      rotatingRings(W / 2, H * 0.40, t, 0.28);
      rotatingRings(W / 2, H * 0.40, t + 3, 0.12, 2);

      // confettis dorés
      for (let i = 0; i < 40; i++) {
        const sp = 0.35 + (i % 7) * 0.09;
        const ph = (u * sp * 0.5 + i * 0.073) % 1;
        const x = 40 + ((i * 251) % (W - 80)) + Math.sin(t * 2 + i) * 40;
        const y = -60 + ph * (H + 120);
        ctx.save();
        ctx.globalAlpha = 0.5 * Math.sin(ph * Math.PI);
        ctx.translate(x, y); ctx.rotate(t * 3 + i);
        if (i % 3 === 0) heart(0, 0, 16, GOLD_L);
        else { ctx.fillStyle = i % 2 ? GOLD_L : '#FFF3CF'; ctx.fillRect(-5, -9, 10, 18); }
        ctx.restore();
      }

      const p = ease.outBack(seg(u, 0.02, 0.55), 1.5);
      ctx.save();
      ctx.translate(W / 2, H * 0.30);
      ctx.scale(p, p);
      ctx.globalAlpha = clamp(p);
      logoMark(0, -150, 70, Math.sin(t * 1.5) * 0.05);
      ctx.textAlign = 'center';
      ctx.font = '900 126px Mont'; ctx.letterSpacing = '12px';
      ctx.fillStyle = goldGrad(-60, 60);
      shadowOn(36, 'rgba(212,175,55,.5)', 8);
      ctx.fillText('SCENTORA', 8, -30);
      shadowOff();
      ctx.letterSpacing = '0px';
      ctx.font = '600 32px Mont'; ctx.fillStyle = 'rgba(251,248,241,.8)';
      ctx.fillText('PARFUMS ORIENTAUX AUTHENTIQUES', 0, 32);
      ctx.restore();

      // gros CTA
      const cA = seg(u, 0.35, 0.75);
      if (cA > 0) {
        const sc = ease.outBack(cA, 2.1);
        const pulse = 1 + Math.sin(t * 4.2) * 0.018;
        ctx.save();
        ctx.translate(W / 2, H * 0.545);
        ctx.scale(sc * pulse, sc * pulse);
        ctx.globalAlpha = clamp(cA);
        rr(-392, -80, 784, 160, 80);
        const bg = ctx.createLinearGradient(-392, 0, 392, 0);
        bg.addColorStop(0, '#B8890F'); bg.addColorStop(0.45, '#F6E39B'); bg.addColorStop(0.75, '#D4AF37'); bg.addColorStop(1, '#A87E14');
        shadowOn(60, 'rgba(212,175,55,.55)', 16);
        ctx.fillStyle = bg; ctx.fill();
        shadowOff();
        // icône whatsapp stylisée
        ctx.save();
        ctx.translate(-286, 0);
        ctx.strokeStyle = '#231A06'; ctx.fillStyle = '#231A06'; ctx.lineWidth = 3.2;
        rr(-30, -30, 60, 52, 18); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-12, 22); ctx.lineTo(-18, 40); ctx.lineTo(6, 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-16, -6); ctx.quadraticCurveTo(-16, -18, -2, -18); ctx.quadraticCurveTo(14, -18, 14, -4); ctx.quadraticCurveTo(14, 8, 0, 10); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#1E1607'; ctx.font = '900 44px Mont'; ctx.textAlign = 'center';
        ctx.fillText('COMMANDER', 40, 16);
        ctx.restore();
      }

      // url + mentions
      const uA = seg(u, 0.7, 1.1);
      ctx.save();
      ctx.globalAlpha = clamp(uA);
      ctx.textAlign = 'center';
      ctx.font = '700 40px Mont'; ctx.fillStyle = '#fff';
      ctx.fillText('scentora-ivory.vercel.app', W / 2, H * 0.675);
      ctx.restore();
      goldRule(W / 2, H * 0.712, 460 * uA);

      const rA = seg(u, 0.95, 1.35);
      ctx.save();
      ctx.globalAlpha = clamp(rA);
      ctx.textAlign = 'center';
      ctx.font = '600 30px Mont'; ctx.fillStyle = 'rgba(251,248,241,.78)';
      ctx.fillText('Livraison 58 wilayas  ·  Paiement à la livraison', W / 2, H * 0.765);
      ctx.font = '600 28px Mont'; ctx.fillStyle = 'rgba(212,175,55,.9)';
      ctx.fillText('WhatsApp 0555 74 19 29', W / 2, H * 0.805);
      ctx.restore();

      // badge final
      const bA = seg(u, 1.2, 1.6);
      if (bA > 0) {
        ctx.save();
        ctx.globalAlpha = clamp(bA);
        ctx.translate(W / 2, H * 0.885);
        ctx.scale(ease.outBack(bA, 2), ease.outBack(bA, 2));
        rr(-300, -44, 600, 88, 44);
        ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.24)'; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.fillStyle = '#FFF6D8'; ctx.font = '800 28px Mont'; ctx.textAlign = 'center';
        ctx.fillText('L\'ORIENT DANS UN FLACON', 0, 10);
        ctx.restore();
      }

      vignette(0.72);
      flash((1 - seg(u, 0, 0.30)) * 0.95);
      grain(0.32, Math.floor(t * 60));
    },
  });

  /* ============================================================ PILOTE */
  let ready = false;
  const TOTAL = 30;

  function renderAt(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    let s = scenes.find(s => t >= s.start && t < s.end) || scenes[scenes.length - 1];
    const u = t - s.start, dur = s.end - s.start;
    ctx.save();
    s.draw(t, u, dur);
    ctx.restore();
    // transition "flash" globale
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  window.__film = {
    ready: () => ready,
    duration: TOTAL,
    render: renderAt,
    sceneName: t => (scenes.find(s => t >= s.start && t < s.end) || {}).name,
  };

  (async () => {
    for (const [k, f] of Object.entries(files)) IMG[k] = await loadOne(A + f);
    await document.fonts.ready;
    renderAt(0);
    ready = true;
  })();
})();
