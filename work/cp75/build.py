"""CP-61 No forced slow-down; fewer rain coins (Jenny, Nov 16). One-line replacements on a pinned published UAT.
Usage: python build.py [BASE_HTML SHA256] [OUT]   (default: published UAT 74 -> release.html; on73/ holds the same edits on UAT 73, for measuring)

1. No "Board full" slow-down at all: cp48Full() is always false, so drops always come at CP-51's speeds
   (hold 0.40 s, taps up to 4/s) and the "Board full" float/message never shows.
2. Rain coins about halved (every source; old -> new in tickets/CP-61.md):
   a. level start rain coins one size down (Rain 25 -> 10, Rain 10 -> 5; same spots);
   b. random bonus drops: Rain 5 30% -> 18%, Rain 10 20% -> 8%, Rain 25 8% -> 2% (quake 12% and prize 30% unchanged);
      the other 30% of drop slots bring nothing; and none of the rain drops while 100+ coin pieces are on the board;
   c. Dance break: rain-coin chance per hit halved (dial x0.5, default 12% -> 6%), and it is always a Rain 5;
   d. the wheel: no rain slices (RAIN 25 -> QUAKE COIN, RAIN 10 + QUAKE -> a second YAWN, RAIN 25 -> a second PRIZE
      YOU NEED), JACKPOT 50 -> JACKPOT 25;
   e. perfect Treat toss / Pet the cat / Mouse pounce: Rain 10 -> Rain 5 (texts too);
   f. Pet the cat payoff 20 coins (perfect 24) -> 10 (perfect 12); Mouse pounce 3 coins a mouse -> 2.
3. Backup (brief section 3): CP-48's gold-5 merge of resting coins starts at 100 plain coins instead of 130 (same merge,
   glint and chime; nothing slows). Measured: peaks and physics per tick below UAT 73.
4. Add-on: the wheel's Yawn only knocks off up to 6 coins from the top of the pile (below).
Untouched: the frozen pickup, CP-59's cascade fix, CP-57's sounds, art, layouts, goals, the rain budget (100)."""
from pathlib import Path
import sys,json,hashlib
p=Path(__file__).parent
base=Path(sys.argv[1]) if len(sys.argv)>1 else p.parent/'cp74/release.html'
pin=sys.argv[2] if len(sys.argv)>2 else 'faaf908d04511004fd98f9d1db3597c81315b55bdec18ba9e493c8f9cad49649'
out_path=Path(sys.argv[3]) if len(sys.argv)>3 else p/'release.html'
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,'base is not the pinned build'
s=s.decode('utf-8');v=json.loads((p/'release-version.json').read_text())
import re
old_build=re.search(r"const BUILD = '([^']+)';",s).group(0)
EDITS=[(old_build,"const BUILD = '%s';"%v['displayName']),
 # 1. no slow-down
 ("function cp48Full(){return cp51Pieces()>=CP51_BACKSTOP;}",
  "function cp48Full(){return false;} // CP-61 (Jenny, Nov 16): never slow the game down; no Board full"),
 # 2a. level start rain coins
 ("rain:[['rain10',110,690],['rain5',200,440]]","rain:[['rain5',110,690],['rain5',200,440]]"),
 ("rain:[['rain10',200,650],['rain5',110,580],['rain5',290,580]]","rain:[['rain5',200,650],['rain5',110,580],['rain5',290,580]]"),
 ("rain:[['rain10',200,435]]","rain:[['rain5',200,435]]"),
 ("rain:[['rain10',200,650],['rain5',200,718]]","rain:[['rain5',200,650],['rain5',200,718]]"),
 ("rain:[['rain25',200,345],['rain10',78,470],['rain10',322,470]]","rain:[['rain10',200,345],['rain5',78,470],['rain5',322,470]]"),
 ("rain:[['rain10',200,650]],quake:[110,640]","rain:[['rain5',200,650]],quake:[110,640]"),
 ("rain:[['rain10',130,725]]","rain:[['rain5',130,725]]"),
 # 2b. random bonus drops
 ("const miss=wildMissing(),r=Math.random(),pick=miss.length?'prize':r<.3?'rain5':r<.5?'rain10':r<.58?'rain25':r<.7?'quake':'prize';",
  "const miss=wildMissing(),r=Math.random();let pick=miss.length?'prize':r<.18?'rain5':r<.26?'rain10':r<.28?'rain25':r<.4?'quake':r<.7?'none':'prize'; // CP-61: fewer rain drops\n"
  " if(pick==='none'||(RAIN[pick]&&cp61Crowded())){WILD.cp61Skipped=(WILD.cp61Skipped|0)+1;return;} // CP-61: and none on a crowded board"),
 ("function wildScheduleBonus(){",
  "const CP61_CROWD=100; // CP-61: coin pieces (plain coins + gold 5s) from which no rain bonus drops come\n"
  "function cp61Crowded(){let n=0;for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))n++;return n>=CP61_CROWD;}\n"
  "function wildScheduleBonus(){"),
 # 2c. Dance break
 ("kind=r<D.rainChance?(Math.random()<.25?'rain10':'rain5'):'coin';",
  "kind=r<D.rainChance*.5?'rain5':'coin'; // CP-61: half as many rain coins, Rain 5 only"),
 # 2d. the wheel (add-on, Jenny Nov 16): no rain slices; two Yawns. RAIN 25 -> QUAKE COIN, RAIN 10 + QUAKE -> YAWN,
 #     second RAIN 25 -> PRIZE YOU NEED; JACKPOT 50 -> JACKPOT 25 (coins from the sky, halved); the rest unchanged.
 ("{label:'RAIN 25',kind:'rain25',w:.16,c:'#ff5a2c'}","{label:'QUAKE COIN',kind:'quake',w:.2,c:'#ff5a2c'}"),
 ("{label:'RAIN 10 + QUAKE',kind:'r10q',w:.2,c:'#4f8bff'}","{label:'YAWN',kind:'yawn',w:.12,c:'#4a4a5a'}"),
 ("{label:'RAIN 25',kind:'rain25',w:.16,c:'#ff8a3c'}","{label:'PRIZE YOU NEED',kind:'prize',w:.15,c:'#4fe0b0'}"),
 ("{label:'JACKPOT 50',kind:'jackpot'","{label:'JACKPOT 25',kind:'jackpot'"),
 ("if(s.kind==='rain25'){const p=front();skyDrop('rain25',p.x,p.y,{dur:1});return;}","if(s.kind==='quake'){const p=front();skyDrop('quake',p.x,p.y,{dur:1});return;} // CP-61: no rain slices"),
 ("if(s.kind==='jackpot'){w2Rain(50,.035);","if(s.kind==='jackpot'){w2Rain(25,.05);"),
 ("if(s.kind==='rain25'||s.kind==='r10q'){const sp=sprite(s.kind==='r10q'?'rain10':'rain25');ctx.drawImage(sp.cv,-17,6,34,34);}",
  "if(s.kind==='quake'){const sp=sprite('quake');ctx.drawImage(sp.cv,-17,6,34,34);}"),
 ("txt={rain25:'RAIN 25!',r10q:'RAIN 10 + QUAKE!',prize:'A PRIZE YOU NEED!',jackpot:'JACKPOT 50!'","txt={quake:'QUAKE COIN!',r10q:'RAIN 10 + QUAKE!',prize:'A PRIZE YOU NEED!',jackpot:'JACKPOT 25!'"),
 # 2e. perfect side games
 ("if(D.perfect){sfx.wild2('perfect',1);const x=200+rand(-60,60),y=rand(560,630);skyDrop('rain10',x,y,{dur:1,delay:.6});}",
  "if(D.perfect){sfx.wild2('perfect',1);const x=200+rand(-60,60),y=rand(560,630);skyDrop('rain5',x,y,{dur:1,delay:.6});}"),
 ("if(R.kind==='perfect'){skyDrop('rain10',200+rand(-60,60),rand(560,630),{dur:1,delay:.4});","if(R.kind==='perfect'){skyDrop('rain5',200+rand(-60,60),rand(560,630),{dur:1,delay:.4});"),
 ("if(D.perfect){sfx.wild2('perfect',1);skyDrop('rain10',200+rand(-60,60),rand(560,630),{dur:1,delay:.6});}",
  "if(D.perfect){sfx.wild2('perfect',1);skyDrop('rain5',200+rand(-60,60),rand(560,630),{dur:1,delay:.6});}"),
 ("'every treat! RAIN 10 coming'","'every treat! RAIN 5 coming'"),
 ("['perfect','Catch every one','for a RAIN 10 coin']","['perfect','Catch every one','for a RAIN 5 coin']"),
 ("' coins · RAIN 10 coming'","' coins · RAIN 5 coming'"),
 ("'every mouse! RAIN 10 and a Tortitude'","'every mouse! RAIN 5 and a Tortitude'"),
 ("['perfect','Catch every one','for a RAIN 10 and a Tortitude']","['perfect','Catch every one','for a RAIN 5 and a Tortitude']"),
 # 2f. pet and pounce payoffs
 ("PET_PERFECT_OVER=.45,PET_COINS=20;","PET_PERFECT_OVER=.45,PET_COINS=10; // CP-61: was 20"),
 ("const coins=kind==='perfect'?PET_COINS+4:","const coins=kind==='perfect'?PET_COINS+2:"),
 ("const POUNCE={len:8,count:14,tapR:44,coins:3};","const POUNCE={len:8,count:14,tapR:44,coins:2}; // CP-61: was 3"),
 # backup: the merge from 100
 ("const W43_COIN_CAP=130;","const W43_COIN_CAP=100; // CP-61: merging resting coins into gold 5s from 100 plain coins (was 130)"),
 # 3. add-on (Jenny, Nov 16): the wheel's Yawn knocks off at most CP61_YAWN_MAX coins, only ones lying on top of the pile;
 #    the bottom layer is never pushed. Same animation, sound and timing. (Tuxedo's YAWN power is unchanged.)
 ("function w2YawnTick(dt){",
  "const CP61_YAWN_MAX=6; // CP-61: the wheel's Yawn only knocks off up to 6 coins from the top of the pile\n"
  "function cp61YawnPick(){const top=[];for(const b of bodies){if(b.dead||!(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))continue;const p=b.rb.translation(),z=p.z/M,y=p.y/M;\n"
  " if(z<380||z>570||y<COIN_HALF*2.6)continue;top.push({b,y});}top.sort((a,c)=>c.y-a.y);return top.slice(0,CP61_YAWN_MAX).map(o=>o.b);}\n"
  "function w2YawnTick(dt){"),
 ("for(const b of bodies){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;\r\n   if(z<380||z>570||Math.abs(x-200)>reach)continue;",
  "const power=typeof PGPX!=='undefined'&&PGPX&&PGPX.id==='yawn';if(!power&&!Y.pick)Y.pick=cp61YawnPick(); // CP-61: the wheel's Yawn: top coins only\n"
  "  for(const b of (power?bodies:Y.pick)){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;\r\n   if(z<380||z>570||Math.abs(x-200)>reach)continue;"),
]
for a,b in EDITS:
    assert s.count(a)==1,('not exactly once',s.count(a),a);s=s.replace(a,b)
out=s.encode('utf-8');out_path.write_bytes(out)
(out_path.parent/'edits.json').write_text(json.dumps(EDITS))
print(out_path,hashlib.sha256(out).hexdigest())
