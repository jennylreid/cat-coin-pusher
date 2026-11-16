# CP-50 Simple first board (UAT 67, Jenny Nov 16, via PM): Level 1 = the original shrimp and cheese, no bonus prizes;
# end-card prize line spacing; bigger, full-colour goal icons on cream circles everywhere goals are listed (and bigger
# Album / Kitchen icons); every "< Board" back button reads "< Home"; the in-round goal row moves above the cat's head.
# On the published UAT 66 (work/cp66/release.html, pinned by hash). Usage: python build.py   Output: release.html
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASE = p.parent / 'cp66/release.html'
PIN = '522a489dcefd925498dce0ad080ad3a48f3d65c4a92a64b0ae5effc194c64c7f'  # UAT 66 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 66'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.16 UAT 66';", "const BUILD = '%s';" % v['displayName'])

# 1. Level 1 ("First push"): only the original shrimp and cheese, a few pushes in (not on the front edge), no star prize.
#    Coins, 9 rows, no towers, time, rain coins, Quake and tag unchanged. (No bonus prizes: cp50.js.)
rep("{name:'First push',tag:'Normal',coins:110,secs:60,goal:['egg','milk','sardine','biscuit'],star:'biscuit'," + N +
    "  p:[['egg',200,630],['milk',108,600],['sardine',292,600],['biscuit',250,520]],towers:[]",
    "{name:'First push',tag:'Normal',coins:110,secs:60,goal:['shrimp','cheese'],star:null, // CP-50 (Jenny, Nov 16): just the original shrimp and cheese" + N +
    "  p:[['cheese',110,610],['shrimp',290,575]],towers:[]")

# 2. Goal icons (every list of goal prizes): full colour on a cream circle, the check on the rim when collected (no dimming).
#    wildIcon(id, x, y, w, got) now takes the circle's centre and diameter; each caller below is moved to match.
rep("function wildIcon(id,x,y,w,got){", "function wildIcon(id,x,y,w,got){cp50Icon(id,x,y,w,got);return;")
rep("if(WILD.on&&WILD.v2&&WILD.star===id)w43Star(x+w*.36,y-w*.05,Math.max(6,w*.24),'#ffd23f');};",
    "if(WILD.on&&WILD.v2&&WILD.star===id)w43Star(x-w*.37,y-w*.37,Math.max(6,w*.21),'#ffd23f');}; // CP-50: on the circle's rim, top left")
#    in-round: the goal row is drawn above the cat's head (cp50.js); the bottom-left "Collection n / N" stays only for
#    Developer modes that have no level
rep("const bottom=hud.bottomY;ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0d0';ctx.fillText('Collection '+WILD.got+' / '+WILD_GOAL,hud.left+14,bottom+5);" + N +
    " WILD_COLLECTION.forEach((id,i)=>{const x=hud.left+24+(i%4)*24,y=bottom+22+(i/4|0)*22;wildIcon(id,x,y,20,!!WILD.have[id]);});",
    "if(!cp50RowOn()){const bottom=hud.bottomY;ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0d0';ctx.fillText('Collection '+WILD.got+' / '+WILD_GOAL,hud.left+14,bottom+5);" + N +
    " WILD_COLLECTION.forEach((id,i)=>{const x=hud.left+24+(i%4)*24,y=bottom+22+(i/4|0)*22;wildIcon(id,x,y+6,20,!!WILD.have[id]);});}")
#    the goal cards (Wild, Wild 2 / "? How to play", modes): same places, new look
rep("wildIcon(id,200+(i-(WILD_GOAL-1)/2)*42,R.card.y+106,36,false)", "wildIcon(id,200+(i-(WILD_GOAL-1)/2)*42,R.card.y+116,38,false)")
rep("wildIcon(id,200+(i-(WILD_GOAL-1)/2)*44,R.y+112,38,false)", "wildIcon(id,200+(i-(WILD_GOAL-1)/2)*44,R.y+123,40,false)")
rep("wildIcon(id,200+(i-(WILD_GOAL-1)/2)*44,R.y+74,34,false)", "wildIcon(id,200+(i-(WILD_GOAL-1)/2)*44,R.y+90,36,false)")
#    Home goal line (and layout B's panel): bigger icons; on Home "? How to play" moves 12 px down into the gap above PLAY
rep("const n=WILD_COLLECTION.length,sp=Math.min(42,238/Math.max(1,n));WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(n-1)/2)*sp,y+98,Math.min(40,sp-2),!!WILD.have[id]));",
    "cp50HomeRow(y);")
rep("L.help={x:200-58,y:y+130,w:116,h:26};", "L.help={x:200-58,y:y+(PGU.screen==='main'?CP50_HOME.help:130),w:116,h:26};")

# 3. End card: the count, the icon row and the stars each get clear space (same card, art and buttons); the board's star
#    marker isn't drawn over the card.
rep("ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+88);WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*38,R.card.y+100,28,!!WILD.have[id]));",
    "ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+CP50_END.count);cp50EndRow(R);")
rep("w43Star(200+(i-1)*34,y-2,13,", "w43Star(200+(i-1)*34,y+2,12,", 2)
rep("200,y+20,330);return true;}", "200,y+23,330);return true;}")
rep("if(!WILD.v2||!WILD.star||WILD.have[WILD.star]||WILD.phase==='card'||",
    "if(!WILD.v2||!WILD.star||WILD.have[WILD.star]||WILD.phase==='card'||(WILD.phase==='end'&&WILD.endT>.9)||")

# 4. Album and Kitchen: bigger prize icons in the space those screens already have
rep("pgPrizeIcon(id,x,y,ch*.5,ever?1:.18)", "pgPrizeIcon(id,x,y-ch*.13,ch*.74,ever?1:.18)")
rep("ctx.fillText('×'+pgHave(id),x+ch*.34,y-ch*.12);}const o=pgOwner(id);if(o){ctx.fillStyle=PG_CAT[o].tag;ctx.beginPath();ctx.arc(x-ch*.32,y-ch*.12,4,0,7);",
    "ctx.fillText('×'+pgHave(id),x+ch*.46,y-ch*.2);}const o=pgOwner(id);if(o){ctx.fillStyle=PG_CAT[o].tag;ctx.beginPath();ctx.arc(x-ch*.44,y-ch*.2,4,0,7);")
rep("let ix=row.x+108;for(const id in r.need){const have=pgHave(id),n=r.need[id],ok=have>=n;pgPrizeIcon(id,ix,row.y+60,28,ok?1:.55);",
    "let ix=row.x+120;for(const id in r.need){const have=pgHave(id),n=r.need[id],ok=have>=n;pgPrizeIcon(id,ix,row.y+57,40,ok?1:.55);")
rep("fillText(Math.min(have,99)+'/'+n,ix,row.y+88);ix+=40;}", "fillText(Math.min(have,99)+'/'+n,ix,row.y+94);ix+=44;}")

# 5. Back buttons that go to the Home screen read "Home" (Kitchen, Porch, Album, Shop headers; the round's top button)
rep("ctx.fillText('Board',b.x+b.w/2+7,b.y+b.h/2+1);", "ctx.fillText('Home',b.x+b.w/2+7,b.y+b.h/2+1);")
rep("ctx.fillText('Board',b.x+b.w/2+6,b.y+b.h/2+1,b.w-20);", "ctx.fillText('Home',b.x+b.w/2+6,b.y+b.h/2+1,b.w-20);")

anchor = "Promise.all([RAPIER.init(), loadArt()])"
code = (p / 'cp50.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)
rep(anchor, code + N + anchor)
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
