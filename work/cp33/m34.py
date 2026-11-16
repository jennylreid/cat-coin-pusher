# UAT 34: module33.js -> module34.js. Ledge bell at the collection moment (spaced and capped when several drop together),
# soft thump on landing; the full-size sound and the Sound 1/2/3 picker are removed. Spin, Time held and the rest unchanged.
from pathlib import Path
p = Path(__file__).parent
s = (p / 'module33.js').read_text(encoding='utf-8')


def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:80], s.count(a))
    s = s.replace(a, b)


rep("// Three generated pickup sounds (full size and bag landing) with a picker and a volume dial.\n",
    "// UAT 34: one bright bell as a prize drops over the ledge (Jenny's pick, ledge-3-bell) and a soft thump as it lands in\n"
    "// the bag; Pickup volume dial. Bells that drop together are spaced 0.1 s apart, each quieter, at most 3 per burst.\n")
rep("sink:.3,sound:1,volume:1};", "sink:.3,volume:1};")
rep("sink:[.1,1,.05],sound:[1,3,1],volume:[0,1.5,.1]};", "sink:[.1,1,.05],volume:[0,1.5,.1]};")
rep("sink:['Lost sink time',' s'],sound:['Pickup sound',''],volume:['Pickup volume','%']};", "sink:['Lost sink time',' s'],volume:['Pickup volume','%']};")
rep("if(k==='sound')return label+': Sound '+x;", "")
rep("let tileBounceT=-1,quakeBounceT=-1,lastPickupChime=-9,lastPickupLand=-9,pickupPreviewIndex=0;",
    "let tileBounceT=-1,quakeBounceT=-1,nextLedgeBell=-9,lastPickupLand=-9,pickupPreviewIndex=0;")
rep("function pickupChime(){const now=performance.now();if(now-lastPickupChime<120)return;lastPickupChime=now;sfx.pickup('full',pickupFx.sound,pickupFx.volume);}\n"
    "function pickupLandSound(){const now=performance.now();if(now-lastPickupLand<120)return;lastPickupLand=now;sfx.pickup('land',pickupFx.sound,pickupFx.volume);}",
    "// Ledge bell, once per prize at the moment it drops over the ledge. Prizes that drop together don't stack into one loud\n"
    "// burst: each bell starts at least LEDGE_BELL_GAP after the previous one, the 2nd and 3rd are quieter, and any that would\n"
    "// start more than 0.2 s late (a 4th and later in one burst) are skipped.\n"
    "const LEDGE_BELL_GAP=100,LEDGE_BELL_LEVEL=[1,.7,.5];\n"
    "function ledgeBell(){const now=time*1000;if(nextLedgeBell-now>LEDGE_BELL_GAP*LEDGE_BELL_LEVEL.length)nextLedgeBell=-9; // game time restarts with a board\n"
    " const wait=Math.max(0,nextLedgeBell-now),n=Math.round(wait/LEDGE_BELL_GAP);if(n>=LEDGE_BELL_LEVEL.length)return false;\n"
    " nextLedgeBell=now+wait+LEDGE_BELL_GAP;sfx.pickup('bell',pickupFx.volume*LEDGE_BELL_LEVEL[n],wait/1000);return true;}\n"
    "function pickupLandSound(){const now=time*1000;if(now<lastPickupLand)lastPickupLand=-9;if(now-lastPickupLand<120)return;lastPickupLand=now;sfx.pickup('thump',pickupFx.volume);}")
rep(" f.spinIn=quake?0:pickupFx.spin;\n", " f.spinIn=quake?0:pickupFx.spin;\n if(!quake)ledgeBell(); // the collection moment: the prize has just dropped over the ledge\n")
rep("// The reveal: the picked pickup sound for a prize (the Quake coin keeps its Quake sound for landing), and a burst of glints",
    "// Full size: a burst of glints")
rep("if(!f.burst&&f.t>=f.tr){f.burst=true;if(f.kind==='item')pickupChime();const n=",
    "if(!f.burst&&f.t>=f.tr){f.burst=true;const n=")
for x in ['pickupChime', "'full'", 'pickupFx.sound', 'Pickup sound']:
    assert x not in s, x
(p / 'module34.js').write_text(s, encoding='utf-8')
print('ok')
