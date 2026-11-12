from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];source=(p.parent/'pickup-frame/release.html').read_bytes();u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==source
h=source.decode().replace("const BUILD = '2026.10.29 UAT 7';","const BUILD = '2026.10.29 UAT 8';")
code=(p/'awards.js').read_text(encoding='utf-8');split=code.index('function drawTreatAward()');start=h.index('const treatAwards=[];');end=h.index('function collectionsTile()',start);h=h[:start]+code[:split]+h[end:];start=h.index('function drawTreatAward()');end=h.index('// UI-only celebration.',start);h=h[:start]+code[split:]+'\n'+h[end:];(p/'draft.html').write_text(h,encoding='utf-8')
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py','check.cjs']:
 t=(p.parent/'pickup-frame'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-frame','work/cp25/pickup-spotlight').replace('CP-25-evidence/pickup-frame','CP-25-evidence/pickup-spotlight')
 if name=='stage.py':t=t.replace("p.parent/'pickup-pop/release.html'","p.parent/'pickup-frame/release.html'").replace('2026.10.29 UAT 7','2026.10.29 UAT 8').replace('before-CP-25-pickup-frame-','before-CP-25-pickup-spotlight-').replace('Jenny rejected flight and requested framed collected-item overlay with briefly grayed background; UAT only','Jenny requested trying proposed soft spotlight pickup: warm glow, pop, sparkles and short dim; UAT only')
 if name=='check.cjs':
  t=t.replace('i<107','i<70').replace('i<2;i++)g.tick();assert.equal(a.treatAwards.length,1)','i<3;i++)g.tick();assert.equal(a.treatAwards.length,1)').replace('1.8-second','1.2-second').replace('i<200','i<130').replace('i<84','i<54')
  t=t.replace("globalCompositeOperation:'source-over'", "globalCompositeOperation:'source-over',createRadialGradient(){return {addColorStop(){}};}")
  t=t.replace("assert(calls.some(c=>c.method==='fillRect'&&c.blend==='saturation'));assert.equal(calls.filter(c=>c.method==='roundRect').length,2);", "assert(!calls.some(c=>c.blend==='saturation'));assert.equal(calls.filter(c=>c.method==='roundRect').length,0);assert.equal(calls.filter(c=>c.method==='fillRect').length,2);assert.equal(calls.filter(c=>c.method==='quadraticCurveTo').length,12);")
  t=t.replace('Neutral saturation layer grays the background; two rounded frame lines; original full-colour item; no text; inventory survives reload', 'Soft dim and warm glow; three small sparkles; no frame, desaturation or text; original prize; inventory survives reload')
  t=t.replace("render.c.devicePixelRatio=2.7;render.c.resize();", "render.c.devicePixelRatio=1.35;render.c.resize();")
  t=t.replace("if(i===8)render.snapshot(out+'overlay-phone.png');", "if(i===5){render.c.devicePixelRatio=2.7;render.c.resize();render.snapshot(out+'overlay-phone.png');render.c.devicePixelRatio=1.35;render.c.resize();}")
 (p/name).write_text(t,encoding='utf-8')
print('Prepared short soft spotlight pickup')
