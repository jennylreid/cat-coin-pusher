# CP-51 Drop speed and Pause (UAT 68, Jenny Nov 16, via PM): holding drops a slower steady stream, fast tapping may go a
# bit faster; the 45-coin limit is gone (the 120-piece backstop stays as the safety net); a Pause button on the round timer
# with a pop-up (Resume, Finish round, Sound, How to play, Home); auto-pause in the background. Add-ons: Level 1 is the intro
# (only gold coins plus cheese and shrimp, bonus drops are gold coins); the prize bell at half volume.
# On the published UAT 67 (work/cp67/release.html, pinned by hash). Usage: python build.py   Output: release.html
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
BASE = p.parent / 'cp67/release.html'
PIN = 'b110480e7464afb492dab7ad9672748f6831f7bda600b0095e56b72114d066b8'  # UAT 67 release.html (publication-manifest)
v = json.loads((p / 'release-version.json').read_text())
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline must be the published UAT 67'
N = '\r\n' if '\r\n' in s else '\n'
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
rep("const BUILD = '2026.11.16 UAT 67';", "const BUILD = '%s';" % v['displayName'])

# 1. Drop speed: the hold repeat and the tap gap (both were DROP_INTERVAL = 0.20 s since CP-25 UAT 3) - cp51.js
rep("if(holding&&time-lastDrop>=DROP_INTERVAL-1e-6)tryDrop(holdPos);", "cp51StepDrops(); // CP-51: hold every CP51.hold s; an early tap waits for CP51.tap")
rep("if(time-lastDrop<DROP_INTERVAL-1e-6){if(time-(tryDrop.feedbackAt??-99)>.7){",
    "if(time-lastDrop<CP51.tap-1e-6){if(cp51Queue(at))return false;if(time-(tryDrop.feedbackAt??-99)>.7){")
# 1b. The 45-coin limit (CP-48 option A) is retired. The safety net stays far off: at 120 coin pieces (plain + gold 5s)
#     drops slow to one a second with "Board full" (CP-48's mechanism, unchanged; only what it counts and where it starts)
rep("function cp48Full(){return cp48Own()>=CP48_OWN;}",
    "function cp48Full(){return cp51Pieces()>=CP51_BACKSTOP;} // CP-51 (Jenny, Nov 16): no 45-coin limit; only the 120-piece backstop")

# 2. Pause: the game's existing "paused" checks (Settings open, the bag) also mean "Pause is open". Not the treat-award
#    drawing (the frozen pickup stays on screen while paused).
PZ = "inventoryOpen||panel.style.display==='block'"
n = s.count(PZ); assert n == 13, n
s = s.replace(PZ, PZ + "||cp51Paused")
rep("function drawTreatAward(){" + N + " if(" + PZ + "||cp51Paused)return;", "function drawTreatAward(){" + N + " if(" + PZ + ")return;")
#    Finish: the end card's big word and message for a round you ended yourself
rep("wildText(WILD.reason==='coins'?'OUT OF COINS!':\"TIME'S UP!\",0,0,WILD.reason==='coins'?38:46,",
    "wildText(WILD.reason==='coins'?'OUT OF COINS!':WILD.reason==='finish'?'ROUND OVER':\"TIME'S UP!\",0,0,WILD.reason==='coins'?38:WILD.reason==='finish'?42:46,")
rep("WILD.reason==='coins'?'Out of coins':\"Time's up\"", "WILD.reason==='coins'?'Out of coins':WILD.reason==='finish'?'Round over':\"Time's up\"")
rep("(WILD.reason==='coins'?'The coins ran out. One more go?':'The timer ran out. One more go?')",
    "(WILD.reason==='coins'?'The coins ran out. One more go?':WILD.reason==='finish'?'You ended the round. One more go?':'The timer ran out. One more go?')")
#    TURBO's countdown moves a little right, clear of the pause button around the timer
rep("ctx.font='bold 12px system-ui';ctx.fillStyle='#ff9ae8';ctx.fillText('TURBO '+Math.ceil(WILD.turbo),hud.left+92,hud.bannerY);",
    "ctx.font='bold 11px system-ui';ctx.fillStyle='#ff9ae8';ctx.fillText('TURBO '+Math.ceil(WILD.turbo),hud.left+100,hud.bannerY);")

# 3b. The prize bell at about half volume (Jenny: "far too loud"); only that call, nothing else in the frozen pickup
rep("sfx.pickup('bell',pickupFx.volume*LEDGE_BELL_LEVEL[n],wait/1000)", "sfx.pickup('bell',pickupFx.volume*LEDGE_BELL_LEVEL[n]*CP51_BELL,wait/1000)")

anchor = "Promise.all([RAPIER.init(), loadArt()])"
code = (p / 'cp51.js').read_text(encoding='utf-8').replace('\r\n', '\n').replace('\n', N)
rep(anchor, code + N + anchor)
OUT = p / 'release.html'
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest())
