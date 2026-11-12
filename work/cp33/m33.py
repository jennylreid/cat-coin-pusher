# UAT 33: module32.js -> module33.js. Spin in/out (flip like the Quake coin) with one Spin dial; three generated pickup
# sounds (full size + bag landing) with a picker and a volume dial; Time held 0.7 s; settings key v6 (migrates v5).
from pathlib import Path
import sys
p = Path(__file__).parent
s = (p / 'module32.js').read_text(encoding='utf-8')
HELD = sys.argv[1] if len(sys.argv) > 1 else '.7'


def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:80], s.count(a))
    s = s.replace(a, b)


rep("// Lost prize (side gutter): grey, sink and fade, with a small dark ripple.",
    "// UAT 33: prizes spin (the Quake coin's flip) while rising and growing, rest still and tilted at full size, and spin\n"
    "// again on the way into the bag. One Spin dial (turns; 0 = off) covers both; the Quake coin keeps its own two flips.\n"
    "// Three generated pickup sounds (full size and bag landing) with a picker and a volume dial.\n"
    "// Lost prize (side gutter): grey, sink and fade, with a small dark ripple.")
rep("const PICKUP_FX_KEY='catpusher.uat.pickupfx.v5'; // UAT 30 key kept in UAT 32: her tuning carries over; Panel padding and Quake size start at defaults",
    "// UAT 33: new key so the new defaults reach her phone. Values saved under the UAT 30-32 key carry over once, except\n"
    "// the dials whose default changed in UAT 33 (PICKUP_FX_NEW_DEFAULTS), which start at the new default.\n"
    "const PICKUP_FX_KEY='catpusher.uat.pickupfx.v6',PICKUP_FX_OLD_KEY='catpusher.uat.pickupfx.v5',PICKUP_FX_NEW_DEFAULTS=['held'];")
rep("held:.5,turn:14,", "held:%s,turn:14,spin:1," % HELD)
rep("sink:.3};\nconst PICKUP_FX_LIMITS", "sink:.3,sound:1,volume:1};\nconst PICKUP_FX_LIMITS")
rep("turn:[0,30,2],", "turn:[0,30,2],spin:[0,3,.25],")
rep("sink:[.1,1,.05]};", "sink:[.1,1,.05],sound:[1,3,1],volume:[0,1.5,.1]};")
rep("turn:['Turn (max)','°'],", "turn:['Turn (max)','°'],spin:['Spin',' turns'],")
rep("sink:['Lost sink time',' s']};", "sink:['Lost sink time',' s'],sound:['Pickup sound',''],volume:['Pickup volume','%']};")
rep("try{const pref=JSON.parse(localStorage.getItem(PICKUP_FX_KEY)||'null');if(pref)",
    "try{let pref=JSON.parse(localStorage.getItem(PICKUP_FX_KEY)||'null');if(!pref){pref=JSON.parse(localStorage.getItem(PICKUP_FX_OLD_KEY)||'null');if(pref){for(const k of PICKUP_FX_NEW_DEFAULTS)delete pref[k];localStorage.setItem(PICKUP_FX_KEY,JSON.stringify({...PICKUP_FX_DEFAULTS,...pref}));}}if(pref)")
rep("function pickupFxText(k){const [label,unit]=PICKUP_FX_LABELS[k],x=pickupFx[k];return label+': '+",
    "function pickupFxText(k){const [label,unit]=PICKUP_FX_LABELS[k],x=pickupFx[k];if(k==='sound')return label+': Sound '+x;if(k==='spin'&&x===1)return label+': 1 turn';if(k==='volume')return label+': '+(x===0?'off':Math.round(x*100)+unit);return label+': '+")
rep("['turn','offCentre','burst','sparkles','fade','stripes'].includes(k)", "['turn','offCentre','burst','sparkles','fade','stripes','spin'].includes(k)")
rep("let tileBounceT=-1,quakeBounceT=-1,lastPickupChime=-9,pickupPreviewIndex=0;",
    "let tileBounceT=-1,quakeBounceT=-1,lastPickupChime=-9,lastPickupLand=-9,pickupPreviewIndex=0;")
# Spin: prizes take the Spin dial's turns in and out; the Quake coin keeps its two flips out and no spin in.
rep("if(quake){const tg=quakeTarget();f.es=Math.min(1,26/(2*radius('quake')*sc.s))*sc.s;f.turns=2;",
    "f.spinIn=quake?0:pickupFx.spin;\n if(quake){const tg=quakeTarget();f.es=Math.min(1,26/(2*radius('quake')*sc.s))*sc.s;f.turns=2;")
rep("else{const tg=pickupTarget();f.es=sc.s*pickupFx.endScale;f.turns=0;",
    "else{const tg=pickupTarget();f.es=sc.s*pickupFx.endScale;f.turns=pickupFx.spin;")
rep("// Position, size, flip (horizontal scale, -1..1, Quake final flight only) and angle of a flight at its own time t.",
    "// Position, size, flip (horizontal scale, -1..1: the coin-flip spin) and angle of a flight at its own time t.")
rep("P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);P.rot=f.rot*e;return P;}",
    "P.s=f.s0+(f.ms-f.s0)*easeOutSoft(u);P.rot=f.rot*e;\n  // Spin in: the turns unwind as it grows, slowing to face front exactly at full size.\n  if(f.spinIn)P.flip=Math.cos(2*Math.PI*f.spinIn*(1-e));return P;}")
rep("P.s=f.ms+(f.es-f.ms)*k;P.rot=f.rot*(1-e);if(f.kind==='quake')P.flip=Math.cos(2*Math.PI*f.turns*e);return P;",
    "P.s=f.ms+(f.es-f.ms)*k;P.rot=f.rot*(1-e);if(f.turns)P.flip=Math.cos(2*Math.PI*f.turns*e);return P; // spin out (prize: Spin dial; Quake: 2)")
# Sounds: full size (prize reveal) and bag landing use the picked sound at the pickup volume. Quake keeps its own sound.
rep("function pickupChime(){const now=performance.now();if(now-lastPickupChime<120)return;lastPickupChime=now;sfx.itemCollected();}",
    "function pickupChime(){const now=performance.now();if(now-lastPickupChime<120)return;lastPickupChime=now;sfx.pickup('full',pickupFx.sound,pickupFx.volume);}\n"
    "function pickupLandSound(){const now=performance.now();if(now-lastPickupLand<120)return;lastPickupLand=now;sfx.pickup('land',pickupFx.sound,pickupFx.volume);}")
rep("// The reveal: the existing chime for a prize (the Quake coin keeps its Quake sound for landing)",
    "// The reveal: the picked pickup sound for a prize (the Quake coin keeps its Quake sound for landing)")
rep("if(f.kind==='quake'){quakeBounceT=0;sfx.special();}else tileBounceT=0;}",
    "if(f.kind==='quake'){quakeBounceT=0;sfx.special();}else{tileBounceT=0;pickupLandSound();}}")
rep(" // Quake keeps its coin flip on the final flight (horizontal scale follows cos; never quite zero).",
    " // Coin-flip spin (horizontal scale follows cos; never quite zero).")
for x in ['itemCollected', 'v5\'; //']:
    assert x not in s, x
(p / 'module33.js').write_text(s, encoding='utf-8')
print('ok held', HELD)
