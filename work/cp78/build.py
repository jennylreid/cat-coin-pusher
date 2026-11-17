"""CP-61 rework (Jenny, Nov 16, UAT 77: "I just tried Yawn twice and nothing was knocked off ... anything on the top layer
could be knocked off"), on pinned published UAT 77. Both Yawns (the wheel slice and the Tuxedo's YAWN power):
- any piece lying on top of the pile counts (coins, rain coins, gold 5s, power coins, prizes; never tower blocks): its
  bottom is at least 1.5 coin-half-thicknesses above the table, i.e. it rests on something;
- up to 6 of the highest are picked where the sides are open (past CP-21's side walls, depth 431) in the paws' band (to
  depth 570), or further forward if that band has fewer than 4 (UAT 77 also picked pieces beside the walls, which can't go off);
- each picked piece is pushed outward once the paws reach it, and keeps being pushed until it leaves the table (UAT 77
  stopped at 2.05 s and only took plain coins, so coins stopped against prizes stayed on);
- nothing else is pushed: the bottom layer is never swept. Same animation, sound and timing.
  A prize counts as 2 of the 6: a couple of prizes, a prize and a few coins, or a handful of coins; never nothing while
  anything lies on top where the sides are open (Jenny: "It can be a mix. It's just never nothing.").
Also (Jenny, Nov 16): no merging of coins already on the board into gold 5s; a gold 5 may stand in for 5 plain coins only
when coins are dropped in (rain, pours, payouts). The player's own drops are always plain coins. Usage: python build.py"""
from pathlib import Path
import json,hashlib
p=Path(__file__).parent
s=(p.parent/'cp77/release.html').read_bytes()
assert hashlib.sha256(s).hexdigest()=='14ce68c66185da57a61889f7b9938d6ef7e91781c851d8e3b28cfb94f2097261','base is not published UAT 77'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
a=s.index("const CP61_YAWN_MAX=6;");b=s.index("function yawnText(){")
old=s[a:b];assert old.count('function w2YawnTick(dt){')==1 and s.count("const CP61_YAWN_MAX=6;")==1
NEW="""const CP61_YAWN_MAX=6; // CP-61 rework: each Yawn knocks off up to 6 pieces lying on top of the pile (any kind), never the bottom layer
function cp61Half(b){return typeof b.half==='number'?b.half:halfOf(b.kind);}
function cp61YawnPick(){const pick=(z0,z1)=>{const top=[];for(const b of bodies){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;
  if(z<z0||z>z1||Math.abs(x-200)>tableHalfAt(z)-4)continue;if(y-cp61Half(b)<COIN_HALF*1.5)continue;top.push({b,y});}
  top.sort((a,c)=>c.y-a.y);const r=[];let room=CP61_YAWN_MAX,prizes=0; // a prize counts as 2: two prizes, a prize and a few coins, or a handful of coins
  for(const o of top){if(o.b.kind==='item'){if(prizes<2&&room>=2){r.push(o.b);room-=2;prizes++;}}else if(room>=1){r.push(o.b);room--;}if(room<=0)break;}return r;};
 let r=pick(GUARD_END+COIN_R,570);if(r.length<3)r=pick(GUARD_END+COIN_R,T.FRONT-30);return r;} // past the side walls (CP-21), where pieces can go over
function w2YawnTick(dt){
 const Y=W2_YAWN;if(!Y)return;Y.t+=dt;happyUntil=0;
 if(Y.t>=1.25&&!Y.swept){Y.swept=true;sfx.wild2('sweep',1);callout('SWOOSH!',{color:'#b9a6d6',dur:.8});}
 if(Y.t>=1.25&&Y.t<2.8){
  // the paws sweep outward; the pieces on top of the pile they reach fly off the sides (pushed until they leave the table)
  const f=Math.min(1,(Y.t-1.25)/.75),reach=20+f*170;
  if(!Y.pick)Y.pick=cp61YawnPick();
  for(const b of Y.pick){if(b.dead)continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;
   if(!Y.pushed.has(b)){if(Math.abs(x-200)>reach)continue;Y.pushed.set(b,x<200?-1:1);}
   if(Math.abs(x-200)>tableHalfAt(z)+2)continue; // over the side: let it fall
   const v=b.rb.linvel();b.rb.setLinvel({x:Y.pushed.get(b)*Math.max(Math.abs(v.x),rand(5,7.5)),y:Math.max(v.y,rand(.8,1.6)),z:v.z},true);}}
 if(Y.t>=2.8){W2_YAWN=null;if(pawDance&&pawDance.yawn)stopPawDance();}
}
"""
s=s[:a]+NEW+s[b:]
EDITS=[("const BUILD = '2026.11.16 UAT 77';","const BUILD = '%s';"%v['displayName']),
 # 1b. Dance break fix (found by the CP-57 engineer; same line as work/cp57-money/build-dancefix.py): CP-61's comment in UAT 75
 #     swallowed D.bank[kind]++, so on-beat hits banked nothing. The bank line runs again; half as many rain coins kept.
 ("const r=Math.random(),kind=r<D.rainChance*.5?'rain5':'coin'; // CP-61: half as many rain coins, Rain 5 onlyD.bank[kind]++;",
  "const r=Math.random(),kind=r<D.rainChance*.5?'rain5':'coin';D.bank[kind]++; // CP-61: half as many rain coins, Rain 5 only (CP-57 fix: the bank line runs again)"),
 # 2. no merging on the board (Jenny, Nov 16): coins already on the board never turn into a gold 5
 ("function w43MergeTick(dt){","function w43MergeTick(dt){return; // CP-61 (Jenny, Nov 16): coins on the board are never merged into gold 5s\n"),
 # 3. gold 5s only at drop time: rain and pours past the budget (100 plain coins) are scheduled as one gold 5 per five coins
 #    when they're dropped, instead of falling as plain coins that vanish when they land
 ("skyLand=function(s){if(s.kind==='coin'||s.kind==='silver'){const k=w43Budget(s.kind);if(!k)return;if(k!==s.kind)s={...s,kind:k};}return __w43SkyLand(s);};",
  "skyLand=function(s){return __w43SkyLand(s);}; // CP-61: nothing vanishes on landing; the budget is applied when coins are dropped\n"
  "const __cp61SkyDrop=skyDrop;skyDrop=function(kind,x,y,o){if((kind==='coin'||kind==='silver')&&WILD.on){const k=w43Budget(kind);if(!k)return;if(k!==kind)return __cp61SkyDrop(k,x,y,o);}return __cp61SkyDrop(kind,x,y,o);};")]
for x,y in EDITS:
    assert s.count(x)==1;s=s.replace(x,y)
out=s.encode('utf-8');(p/'release.html').write_bytes(out);(p/'edits.json').write_text(json.dumps(EDITS));(p/'yawn-old.txt').write_text(old,encoding='utf-8');(p/'yawn-new.txt').write_text(NEW,encoding='utf-8')
print(p/'release.html',hashlib.sha256(out).hexdigest())
