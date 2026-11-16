from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];source=(p.parent/'pickup-vignette/release.html').read_bytes();u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==source
h=source.decode().replace("const BUILD = '2026.10.29 UAT 9';","const BUILD = '2026.10.29 UAT 10';")
start=h.index(' // Full-screen patterned vignette;');end=h.index(' const glow=',start)
h=h[:start]+''' // Modal scrim and translucent diagonal-striped popup.
 ctx.fillStyle='rgba(15,19,27,.54)';ctx.fillRect(0,0,W,H);
 const pw=Math.min(336,W-40),ph=320,px=(W-pw)/2,py=(H-ph)/2;
 ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=24;ctx.shadowOffsetY=8;
 ctx.beginPath();ctx.roundRect(px,py,pw,ph,20);ctx.fillStyle='rgba(237,239,232,.18)';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.save();ctx.clip();ctx.strokeStyle='rgba(255,255,247,.085)';ctx.lineWidth=10;
 for(let sx=px-ph;sx<px+pw+ph;sx+=32){ctx.beginPath();ctx.moveTo(sx,py+ph);ctx.lineTo(sx+ph,py);ctx.stroke();}ctx.restore();
 ctx.beginPath();ctx.roundRect(px+.5,py+.5,pw-1,ph-1,20);ctx.strokeStyle='rgba(255,249,226,.36)';ctx.lineWidth=1;ctx.stroke();
'''+h[end:]
old="function queueTreatAward(id){treatAwards.push({id,t:0,sounded:false});startTreatAward();}"
assert old in h;h=h.replace(old,"function queueTreatAward(id){stopDrops();cancelCollectionDrag();treatAwards.push({id,t:0,sounded:false});startTreatAward();}")
assert 'if(inventoryOpen)return;' in h;h=h.replace('if(inventoryOpen)return;', 'if(inventoryOpen||treatAwards.length)return;',1)
old='tickCollectionPayoff(dt);tickTreatAwards(dt);collectionStars='
assert old in h;h=h.replace(old,'const pickupModal=treatAwards.length>0;tickTreatAwards(dt);if(pickupModal){regen();return;}tickCollectionPayoff(dt);collectionStars=')
(p/'draft.html').write_text(h,encoding='utf-8')
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py']:
 t=(p.parent/'pickup-vignette'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-vignette','work/cp25/pickup-modal').replace('CP-25-evidence/pickup-vignette','CP-25-evidence/pickup-modal')
 if name=='stage.py':t=t.replace("p.parent/'pickup-spotlight/release.html'","p.parent/'pickup-vignette/release.html'").replace("['passed'])==4","['passed'])==3").replace('2026.10.29 UAT 9','2026.10.29 UAT 10').replace('before-CP-25-pickup-vignette-','before-CP-25-pickup-modal-').replace('Jenny approved spotlight motion and requested a bigger overlay pattern that dims the scene; UAT only','Jenny clarified translucent modal popup with light diagonal stripes and disabled background; UAT only')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared translucent striped popup with paused/disabled background')
