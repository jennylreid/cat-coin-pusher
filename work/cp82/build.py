"""CP-58 change (Jenny via PM, Nov 17, after UAT 81): eaten prizes are "exactly like a prize that falls off the side".
On pinned published UAT 81 (CP-62, unchanged). Only the wheel's CP-58 Yawn block changes:
1. A prize the cat eats is lost at the gulp, handled like a prize lost over the side (Levels' lost-prize handling: the
   lost sound, the goal icon shakes, "LOST THE CHEESE!" / "LOST THE STAR!" (the star comes back 12 s later as usual), the
   round's lost count). The side-rail flash and the tumble over the edge are left out: it was eaten, not knocked off.
   A goal prize comes back only through the normal lost-prize bonus drop, with its usual timing, if there's time left.
2. No immediate drop-back and no "IT'LL DROP BACK!" message.
3. The Yawn never does nothing: with no prize in reach, the mitt grabs a few top coins (up to 4 lying on top of the pile,
   nearest the front and near each other) and eats them; the bottom layer is never touched, so no gaps.
The Tuxedo's YAWN power (CP-61) and everything else are unchanged. Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent;W=p.parent
s=(W/'cp81/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='985625c87fd72ae6be6f13741d9320fa13dbf692a9367731f6f4140ed107f6f0','base is not published UAT 81'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
EDITS=[("const BUILD = '2026.11.16 UAT 81';","const BUILD = '%s';"%v['displayName']),
 ("// mouth and eaten (chomp, crumbs, Happy eyes). Coins are never touched, so no gap. A stolen goal prize drops back in.",
  "// mouth and eaten (chomp, crumbs, Happy eyes). An eaten prize is lost, like one over the side (UAT 82); with no prize in\n"
  "// reach the mitt takes a few top coins instead. The bottom layer is never touched, so no gap."),
 # 3. no prize in reach: a few top coins
 ("\n const away=grabs.length?(CP58.lookAway?-grabs[0].side:grabs[0].side):1;",
  "\n if(!grabs.length)cp58CoinGrab(grabs); // UAT 82: never nothing\n const away=grabs.length?(CP58.lookAway?-grabs[0].side:grabs[0].side):1;"),
 ("if(g.b.dead){g.missed=true;return;}g.held=true;cp58PrizeScreen(g);g.s0=g.at.s;removeCoin(g.b);",
  "if(g.b.dead){g.missed=true;return;}g.held=true;cp58PrizeScreen(g);g.s0=g.at.s;removeCoin(g.b);"
  "if(g.coins){g.coins=g.coins.filter(c=>c!==g.b&&!c.dead);g.kinds=[g.b.kind,...g.coins.map(c=>c.kind)];for(const c of g.coins)removeCoin(c);}"),
 ("cp62DrawPrize('item',g.id,0,0,s,g.b);ctx.restore();});","if(g.coins)cp58DrawCoins(g,s);else cp62DrawPrize('item',g.id,0,0,s,g.b);ctx.restore();});"),
 # 1. the gulp: each eaten prize is lost like one over the side
 ("if(t>=CP58.gulp&&!fx.gulp){fx.gulp=1;if(Y.grabs.some(g=>g.held)){pgSfx('plop',1);for(const g of Y.grabs)g.gone=true;}}",
  "if(t>=CP58.gulp&&!fx.gulp){fx.gulp=1;if(Y.grabs.some(g=>g.held)){pgSfx('plop',1);for(const g of Y.grabs)g.gone=true;for(const g of Y.grabs)if(g.held&&!g.coins)cp58Lost(g);}}"),
 # 2. no drop-back, no message
 (""" // a stolen goal prize comes back as the game's own bonus drop (marker, whistle, drop from the sky), one after the other
 if(t>=CP58.dropAt&&!fx.drop){fx.drop=1;let n=0;Y.dropping=true;const miss=wildMissing();for(const g of Y.grabs)if(g.held&&miss.includes(g.id)&&WILD.on&&WILD.phase==='play'){
   const y=rand(430,650),x=200+rand(-1,1)*(tableHalfAt(y)-50);WILD.incoming.push({kind:'item',id:g.id,x,y,t:.9+n*.45,t0:.9});WILD.bonusN++;n++;CP58.stats.replaced.push(g.id);}
  if(n){sfx.wild('whistle',1);callout(n>1?"THEY'LL DROP BACK!":"IT'LL DROP BACK!",{color:'#7dff6a',dur:1.2});}}
""",""),
 # in the mitt it isn't lost yet; from the gulp on it's missing like any lost prize (the bonus clock waits for the wheel anyway)
 ("wildMissing=function(){const r=__cp58Missing(),Y=W2_YAWN;if(!Y||!Y.cp58||Y.dropping)return r;return r.filter(id=>!Y.grabs.some(g=>g.held&&g.id===id));};",
  "wildMissing=function(){const r=__cp58Missing(),Y=W2_YAWN;if(!Y||!Y.cp58)return r;return r.filter(id=>!Y.grabs.some(g=>g.held&&!g.gone&&g.id===id));};"),
 # URGENT boot fix (CP-63 engineer via PM, Nov 17): UAT 80/81 didn't start in a real browser ("Cannot access
 # 'CP62_ART' before initialization": loadArt() runs at boot and fills CP62_ART, declared further down). Both CP-62
 # consts move above the boot line; nothing else about CP-62 changes.
 ("\nconst CP62_ART={};\nconst CP62_COLOURS=new WeakMap();\n","\n"),
 ("\r\nPromise.all([RAPIER.init(), loadArt()])","\r\nconst CP62_ART={},CP62_COLOURS=new WeakMap(); // UAT 82: declared before the boot (CP-62's art loads in loadArt)\r\nPromise.all([RAPIER.init(), loadArt()])"),
 ("// ---------- end CP-58 ----------","""// UAT 82: an eaten prize is lost exactly like one over the side (the Levels' lost-prize handling: sound, goal icon shake,
// "LOST THE ...!", the star's 12 s return, the lost count), without the side-rail flash and tumble (it was eaten).
function cp58Lost(g){if(!(WILD.on&&WILD.v2))return;const need=!WILD.have[g.id],star=g.id===WILD.star;
 WILD.iconShake[g.id]=0;WILD.lostN++;sfx.wild43&&sfx.wild43(star?'lostStar':'lost',1);
 if(star){WILD.starBackAt=time+12;callout('LOST THE STAR!',{color:'#ff4b4b',dur:1.6});}
 else if(need)callout('LOST THE '+String(WILD_PRIZE_NAMES[g.id]||g.id).replace(/^(Toy|Rubber|Cat) /,'').toUpperCase()+'!',{color:'#ff8a6a',dur:1.1});
 CP58.stats.lost=(CP58.stats.lost||[]);CP58.stats.lost.push(g.id);try{diagEvent('wild2','cp58 ate '+g.id+(star?' (star)':''));}catch(e){}}
// UAT 82: no prize in reach: the mitt takes up to 4 coins lying on top of the pile, nearest the front and close together.
function cp58CoinTargets(){const c=[];for(const b of bodies){if(b.dead||!(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))continue;
  const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;if(z<PUSH_MAX+20||z>T.FRONT-30||Math.abs(x-200)>tableHalfAt(z)-4)continue; // the pile builds up at the back
  if(y-cp61Half(b)<COIN_HALF*1.5)continue;c.push({b,x,z});}
 if(!c.length)return [];c.sort((a,d)=>d.z-a.z);const A=c[0];
 return c.filter(o=>Math.hypot(o.x-A.x,o.z-A.z)<=90).sort((a,d)=>Math.hypot(a.x-A.x,a.z-A.z)-Math.hypot(d.x-A.x,d.z-A.z)).slice(0,4).map(o=>o.b);}
function cp58CoinGrab(grabs){const cs=cp58CoinTargets();if(!cs.length)return;const b=cs[0],x=b.rb.translation().x/M;
 grabs.push({b,id:'coins',coins:cs,side:x<200?-1:1,goal:false,held:false,gone:false,bites:0});cp58PrizeScreen(grabs[0]);}
function cp58DrawCoins(g,s){const k=g.kinds||['coin'],n=k.length;
 for(let i=0;i<n;i++){const sp=sprite(k[i]==='silver'?'coin':k[i]),r=sp.half*s;ctx.drawImage(sp.cv,(i-(n-1)/2)*r*1.1-r,-(i%2)*r*.5-r,2*r,2*r);}}
// ---------- end CP-58 ----------""")]
for a,b in EDITS:
    assert s.count(a)==1,a[:80];s=s.replace(a,b)
assert "DROP BACK" not in s and 'WILD.incoming.push({kind:\'item\',id:g.id' not in s
out=s.encode('utf-8');(p/'release.html').write_bytes(out);(p/'edits.json').write_text(json.dumps(EDITS))
print(p/'release.html',hashlib.sha256(out).hexdigest())
