// CP-96 face check (evaluated in the page; W = the page's window): every face has its pupils or its closed-eye layer.
// For each face image: the layers prepImages drew (open-eyed heads need the pupil layer, the sleeping face the closed-eye
// layer), and at both eye centres (head-art pixels, where the game draws the pupils) no blank eye yellow.
(W => (async () => {
  const C = W.__cp96, IM = C.IMGS || W.IMGS, LY = C.LAYERS || {}, EY = [[500, 541], [1060, 558]];
  const FACES = { sleep: [8, 22, 1520, 'over'], calm: [8, 22, 1520, 'pupils'], grin: [8, 22, 1520, 'pupils'], sweet: [11, 9, 1513, 'pupils'], yawn: [4, 0, 1529, 'own'] };
  const out = {}; let ok = true;
  for (const k of Object.keys(FACES)) {
    const [cx, cy, cw, need] = FACES[k], im = new W.Image(); im.src = IM[k]; await im.decode();
    const c = W.document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0); const s = im.naturalWidth / cw, L = LY[k] || {};
    const eyes = EY.map(([x, y]) => { const d = g.getImageData(Math.round((x - cx) * s) - 2, Math.round((y - cy) * s) - 2, 5, 5).data; let yel = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 170 && d[i + 2] < 140 && d[i + 3] > 200) yel++; return yel; });
    const layer = L.copy || (need === 'over' ? !!L.over : need === 'pupils' ? !!L.pupils : true); // a pre-made copy (standalone page) is judged by its pixels
    const r = { layer: L.copy ? 'pre-made copy' : need + (layer ? ' drawn' : ' MISSING'), blankYellowAtEyeCentres: eyes };
    r.ok = layer && !L.failed && eyes.every(n => n < 5); ok = ok && r.ok; out[k] = r;
  }
  return JSON.stringify({ ok, faces: out });
})())
