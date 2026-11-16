# CP-35 Wild board prototype: builds release.html from published UAT 34 (work/cp33/release.html, pinned by hash).
# Inlines wild35.js (board, hooks, HUD, overlays) and wild-sounds.js (sfx.wild). Boards 1-3 pass straight through.
from pathlib import Path
import json, hashlib
p = Path(__file__).parent
v = json.loads((p / 'release-version.json').read_text())
s = (p.parent / 'cp33/release.html').read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == 'df0b66aed8e03c747a0e5aec44768d0c7c81a6c3b62ff63b878dc35115380245', 'baseline must be UAT 34'
N = '\r\n'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:80], s.count(old))
    s = s.replace(old, new)


rep("const BUILD = '2026.11.11 UAT 34';", "const BUILD = '%s';" % v['displayName'])
W = 'WILD&&WILD.on'
# The normal board's save and purse are left alone while the Wild board is on (restored on the way out).
rep('function save(){', 'function save(){if(%s)return; // CP-35' % W)
rep('function regen(){', 'function regen(){if(%s){board.remaining=S.coins;return;} // CP-35: Wild bank, no refill' % W)
rep('function boardTick(dt){', 'function boardTick(dt){if(%s){wildBoardTick(dt);return;} // CP-35: no auto next/retry' % W)
rep('function reconcileBoardTargets(){', 'function reconcileBoardTargets(){if(%s)return;' % W)
rep("if(board.collected.length===BOARD.targets.length)finishBoard('won');", "if(!(%s)&&board.collected.length===BOARD.targets.length)finishBoard('won');" % W)
rep('function prefill() {', "function prefill() {if(BOARD.id==='wild'){wildPrefill();return;} // CP-35")
rep('function selectBoard(index) {', 'function selectBoard(index) {if(%s)wildExit();' % W)
# Quake on the Wild board: earned only (like Board 3), whatever Developer mode says.
rep("if(!S.dev&&BOARD.id==='tuna-terraces')return id==='quake'?board.earnedQuakes:0;", "if((!S.dev&&BOARD.id==='tuna-terraces')||BOARD.id==='wild')return id==='quake'?board.earnedQuakes:0;")
rep("if(!S.dev&&BOARD.id==='tuna-terraces')useEarnedQuake();", "if((!S.dev&&BOARD.id==='tuna-terraces')||BOARD.id==='wild')useEarnedQuake();")
rep("id==='quake'&&!S.dev&&BOARD.id==='tuna-terraces'?", "id==='quake'&&((!S.dev&&BOARD.id==='tuna-terraces')||BOARD.id==='wild')?")
# HUD: timer and prize progress in the Wild board; the WILD / EXIT button in the header.
rep("ctx.fillText(S.coins<REGEN_CAP?'+1 '+purseCountdown():'Purse full',hud.left+12,hud.bannerY);",
    "if(%s)drawWildHud(hud);else ctx.fillText(S.coins<REGEN_CAP?'+1 '+purseCountdown():'Purse full',hud.left+12,hud.bannerY);" % W)
rep("ctx.fillText('BOARD '+(boardIndex+1)+' / '+BOARDS.length", "ctx.fillText(%s?'WILD BOARD':'BOARD '+(boardIndex+1)+' / '+BOARDS.length" % W)
rep("const message=saveError?", "const message=%s?wildMessage():saveError?" % W)
rep("drawInventoryButton();ctx.fillStyle='rgba(18,11,28,.96)'", "drawWildButton();drawInventoryButton();ctx.fillStyle='rgba(18,11,28,.96)'")
# Taps on the WILD button, goal card and end screen; everything else is untouched.
rep("const p = toGame(e);", "const p = toGame(e);if(wildPointer(e,p))return; // CP-35")
rep('    fanfare() {', (p / 'wild-sounds.js').read_text(encoding='utf-8').replace('\n', N) + '    fanfare() {')
# Developer dials for the Wild timer and starting coins, under the Prize feedback dials.
rep("Reset tuning to defaults</button></div>':'')", "Reset tuning to defaults</button></div>':'')+(S.dev?wildDevHtml():'')")
rep("openCredits();panel.scrollTop=top;};}", "openCredits();panel.scrollTop=top;};}wildDevBind(panel);")
a = s.index('// Local UAT diagnostics:')
s = s[:a] + (p / 'wild35.js').read_text(encoding='utf-8').replace('\n', N) + s[a:]
rep("PICKUP_FX_DEFAULTS, sfx", "PICKUP_FX_DEFAULTS, sfx, get WILD(){return WILD;}, wildEnter, wildExit, wildReset, wildStartCountdown, wildFinish, wildPointer, wildButton, wildCardRects, wildEndRects, RAIN")
(p / 'release.html').write_text(s, encoding='utf-8', newline='')
print('built', v['displayName'], len(s))
