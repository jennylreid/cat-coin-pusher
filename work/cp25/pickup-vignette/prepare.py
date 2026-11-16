from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];source=(p.parent/'pickup-spotlight/release.html').read_bytes();u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==source
h=source.decode().replace("const BUILD = '2026.10.29 UAT 8';","const BUILD = '2026.10.29 UAT 9';")
old="ctx.fillStyle='rgba(14,16,24,.28)';ctx.fillRect(0,0,W,H);"
new="""// Full-screen patterned vignette; prize/pop/sparkle timing remains approved.
 ctx.fillStyle='rgba(14,16,24,.52)';ctx.fillRect(0,0,W,H);
 const radius=Math.hypot(W,H)*.65;
 const shade=ctx.createRadialGradient(x,y,90,x,y,radius);shade.addColorStop(0,'rgba(8,12,22,0)');shade.addColorStop(1,'rgba(8,12,22,.28)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
 const rays=ctx.createRadialGradient(x,y,40,x,y,radius);rays.addColorStop(0,'rgba(255,226,174,0)');rays.addColorStop(.25,'rgba(255,226,174,.075)');rays.addColorStop(1,'rgba(255,226,174,.015)');ctx.fillStyle=rays;
 for(let i=0;i<16;i++){const angle=i*Math.PI/8-.12;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*radius,y+Math.sin(angle)*radius);ctx.lineTo(x+Math.cos(angle+.13)*radius,y+Math.sin(angle+.13)*radius);ctx.closePath();ctx.fill();}
 """
assert old in h;h=h.replace(old,new);(p/'draft.html').write_text(h,encoding='utf-8')
for name in ['stage.py','publish.ps1','verify-cloud.py','verify.py','check.cjs']:
 t=(p.parent/'pickup-spotlight'/name).read_text(encoding='utf-8').replace('work/cp25/pickup-spotlight','work/cp25/pickup-vignette').replace('CP-25-evidence/pickup-spotlight','CP-25-evidence/pickup-vignette')
 if name=='stage.py':t=t.replace("p.parent/'pickup-frame/release.html'","p.parent/'pickup-spotlight/release.html'").replace('2026.10.29 UAT 8','2026.10.29 UAT 9').replace('before-CP-25-pickup-spotlight-','before-CP-25-pickup-vignette-').replace('Jenny requested trying proposed soft spotlight pickup: warm glow, pop, sparkles and short dim; UAT only','Jenny approved spotlight motion and requested a bigger overlay pattern that dims the scene; UAT only')
 if name=='check.cjs':t=t.replace("c.method==='fillRect').length,2", "c.method==='fillRect').length,3").replace('Soft dim and warm glow; three small sparkles;', 'Full-screen patterned vignette dims scene, with warm glow and three sparkles;')
 (p/name).write_text(t,encoding='utf-8')
print('Prepared full-screen dark vignette with broad radial pattern; prize animation retained')
