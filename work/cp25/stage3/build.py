from pathlib import Path
import json,base64,re
p=Path(__file__).parent;r=p.parents[2]
h=(p.parent/'layout/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())
assert base64.b64decode(u['files']['index.html'])==(p.parent/'layout/release.html').read_bytes()
h=re.sub(r"const BUILD = '[^']+';","const BUILD = '2026.10.28 UAT 5';",h)
start=h.index('function queueTreatAward(');end=h.index('function collectionsTile()',start)
h=h[:start]+'''function startTreatAward(){const a=treatAwards[0];if(a&&!a.sounded){a.sounded=true;sfx.itemCollected();}}
function queueTreatAward(id){treatAwards.push({id,t:0,sounded:false});startTreatAward();}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();startTreatAward();}
function tickTreatAwards(dt){if(treatAwards.length){treatAwards[0].t+=dt;if(treatAwards[0].t>=2)dismissTreatAward();}}
'''+h[end:]
start=h.index('function drawTreatAward()');end=h.index('function drawHUD()',start)
h=h[:start]+'''function drawTreatAward(){
 const a=treatAwards[0];if(!a)return;
 ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.globalAlpha=1;
 // Only the approved item is opaque. No panel, border, copy or queue counter.
 ctx.fillStyle='rgba(12,7,20,.28)';ctx.fillRect(0,0,W,H);
 const pop=.94+.06*Math.min(1,a.t/.16),y=H/2;
 ctx.translate(200,y);ctx.scale(pop,pop);drawPrize('item',a.id,0,40,2.3);
 ctx.restore();
}

'''+h[end:]
needle='    fanfare() {'
assert needle in h
h=h.replace(needle,'''    // A short soft E-major pickup, once as each item becomes visible.
    itemCollected(){
      if(inBackground||document.hidden||!ready())return;
      const t=ac.currentTime;
      [[659.25,0,.17,.065],[830.61,.055,.20,.055],[1318.51,.11,.27,.05]].forEach(([f,at,d,v])=>tone(f,t+at,d,'sine',v));
    },
'''+needle)
needle='if(board.collected.length===1)board.sweeps=1;\n  sfx.special();'
assert needle in h
h=h.replace(needle,'if(board.collected.length===1)board.sweeps=1;')
(p/'draft.html').write_text(h,encoding='utf-8')
print('Built Stage 3 item-only overlay and pickup chime')
