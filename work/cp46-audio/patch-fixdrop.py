# CP-46 fix (Jenny's UAT 60 report: "the sound of a coin drop when there's no coin dropping"). NOT APPLIED; for the PM.
# Applies on top of a build that has UAT 60's CP-46 sound module (C46):
#   A (always): a rain / sky / bonus coin's first landing plays a clink (the current clink or one of the 4 new clinks), as a
#     collision did before UAT 60, instead of the "drop on pile" sound. The drop-on-pile sounds stay only for coins the
#     player drops (with the current landing sound), so a drop sound always means one of your coins landed.
#   B (option, --push-min N): the recorded coin roll at the start of a forward pusher stroke plays only when the stroke
#     is pushing at least N coins at once (today it plays as soon as one coin is nudged, about every other stroke).
#     Default 0 = unchanged.
# Usage: python patch-fixdrop.py BASE_release.html OUT_release.html "DISPLAY NAME" [--push-min N]
from pathlib import Path
import re, sys, hashlib
args = sys.argv[1:]; pm = 0
if '--push-min' in args: i = args.index('--push-min'); pm = int(args[i + 1]); del args[i:i + 2]
BASE, OUT, NAME = Path(args[0]), Path(args[1]), args[2]
s = BASE.read_text(encoding='utf-8', newline='')
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old)); s = s.replace(old, new)
old_build = re.findall(r"const BUILD = '[^']*';", s); assert len(old_build) == 1
rep(old_build[0], "const BUILD = '%s';" % NAME)
# A: rain/sky coins clink on their first landing (no player-drop sound)
rep("  if(b&&b.rain&&!b.c46){b.c46=1;if(t-lastLand<.09)return;lastLand=t;play('pile',Math.max(.5,v),old);return;}",
    "  // CP-46 fix A: a rain/sky coin's first landing clinks like any collision (the drop-on-pile sounds are only for the player's coins)")
rep("  if(b&&(b.kind==='gold5')&&!b.c46){b.c46=1;if(t-lastGold<.12)return;lastGold=t;play('gold',Math.max(.5,v),old);return;}",
    "  if(b&&(b.kind==='gold5')&&!b.c46){b.c46=1;if(t-lastGold<.12)return;lastGold=t;const gi=SETS.gold.findIndex(x=>/gold-clink/.test(x.file));if(gi>=0&&Math.random()<.5)playVariant('gold',gi,v);else old();return;} // CP-46 fix A: the gold clink or the current clink, at the hit's own strength (no thud, no 50% floor)")
rep("// - A rain coin's first landing: the current clink or a drop on pile; a gold coin's first landing: the current clink, a",
    "// - (fix A) A rain coin's first landing: a clink, like any collision; a gold coin's first landing: the current clink or the gold clink, at the hit's strength. Was: the current clink, a")
# B: the coin roll only when the stroke pushes at least pm coins at once
if pm > 0:
    m = re.search(r"if\(!pushCoinSoundPlayed&&phase>=\.08&&phase<\.53&&bodies\.some\(b=>\{(\r?\n\s*const t=b\.rb\.translation\(\),v=b\.rb\.linvel\(\);\r?\n\s*return !b\.boardTarget&&t\.y<\.3&&Math\.abs\(t\.z/M-pusherY\)<=b\.r\+8&&v\.z>\.015;\r?\n\s*)\}\)\)\{", s)
    assert m and len(re.findall(r"if\(!pushCoinSoundPlayed&&phase>=\.08", s)) == 1
    s = s[:m.start()] + "if(!pushCoinSoundPlayed&&phase>=.08&&phase<.53&&bodies.filter(b=>{" + m.group(1) + "}).length>=%d){ // CP-46 fix B: the coin roll only when the stroke pushes %d+ coins" % (pm, pm) + s[m.end():]
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest(), 'push-min', pm)
