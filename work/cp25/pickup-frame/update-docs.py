from pathlib import Path
p=Path(__file__).parent;r=p.parents[2]
report='''# CP-25 Playable loop v1

**2026.10.29 UAT 7 / APK4 published**, numeric **VERSION**. Backup/package verified; fresh cloud evidence linked below. Jenny rejected the moving pickup drafts and requested the earlier overlay with a frame and briefly grayed background.

## Framed overlay replaces pickup flight

- Original collected prize shown large and in full colour inside a thin champagne rounded double-line frame with a translucent interior. No text/name/card copy. Background board is desaturated and lightly veiled in neutral grey while it remains visible and running.
- Duration about 1.8 seconds, with short fade-in/out. One item at a time; existing short pickup chime plays once when each item appears. Mute/background sound handling retained. No flight, shrinking or satchel bounce.
- Tap-away restored: dismissal stops an existing hold and consumes the touch, so it cannot drop a coin. Automatic expiry lets an existing hold continue. Queue finishes before board-clear feedback and next-board advance.
- Actual front payout still credits and saves inventory once, before presentation. Reopening retains inventory without replaying transient overlays. No approved artwork changed or generated.

## Evidence and validation

[Four checks](CP-25-evidence/pickup-frame/checks.json): queue/timing/chime count; zero-coin dismissal; actual payout counted once; board running beneath; neutral saturation layer and rounded frame; full-colour original sprite/no text; save/reopen; clear/advance waits for queue.

[Phone-size overlay](CP-25-evidence/pickup-frame/overlay-phone.png). [Clip with chimes](CP-25-evidence/pickup-frame/pickup-frame.mp4), 540×1200, 5.6 seconds, desktop renderer. Three existing Board3 prizes moved through the actual payout path as a UI fixture; audio is the earlier mathematical render of the same pickup chime at display times, not a phone recording. Phone receipt, perceived greying/framing, sound/touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Approved backgrounds, satchel tile and Scene wakes up completion payoff retained. Destination square during placement remains removed. Further Kitchen prize candidates remain proposals in the [Kitchen report](CP-25-evidence/kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT6. Source `work/cp25/pickup-frame/release.html`; builder `prepare.py` + `awards.js`. Backup `BACKUP`. [Package verification](CP-25-evidence/pickup-frame/package-verification.json), [publication](CP-25-evidence/pickup-frame/publication.json), [cloud verification](CP-25-evidence/pickup-frame/cloud-verification.json). Only HTML changed. JSON SHA-256 `SHA`. Existing OneDrive item/link retained; game-only update keeps APK4.

[Previous motion report](CP-25-evidence/pickup-pop-report.md) links earlier drafts and scene/loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
'''
import json
m=json.loads((p/'publication-manifest.json').read_text());report=report.replace('VERSION',str(m['version'])).replace('BACKUP',m['backup']).replace(chr(96)+'SHA'+chr(96),chr(96)+m['stagedJSONSHA256']+chr(96));(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
f=r/'tickets/CP-25-evidence/pickup-pop-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.29 UAT 7 / APK4** ({m['version']}).

CP-25 pickup returns to a large full-colour prize inside a thin rounded frame over a briefly desaturated/grey board. About1.8 seconds, tap-away consumes the touch, queued chimes play once per displayed item. Flight removed. Approved collections and completion payoff retained.

Source: work/cp25/pickup-frame/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Cloud evidence linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md',f'''## CP-25 framed pickup overlay (October 29, 2026)

Current UAT7/APK4 ({m['version']}) replaces the rejected pickup-flight drafts. Existing full-colour prize is large within a thin rounded champagne frame; background board is briefly desaturated and lightly greyed, still visible/running. No text or flight. About1.8 seconds with fades, tap-away consumes the touch, queue is sequential with one pickup chime per display. Inventory credits once at payout; clear/advance waits for queue. Approved collections and Scene wakes up payoff retained. Report: tickets/CP-25.md. Earlier checkpoints below are historical.

'''),('DEVELOPER.md',f'''## CP-25 framed pickup overlay (October 29, 2026)

Current UAT7 source `work/cp25/pickup-frame/release.html`, pinned to Oct29 UAT6. `prepare.py` + `awards.js` restore modal pointer dismissal and display-start chime, replace flight with neutral saturation blend (0.78 alpha), source-over grey veil (0.28), rounded double-line frame and full-colour original sprite. No canvas readback/filter copy; frame duration1.8s, fades0.14/0.2s. Queue presentation continues through inventory view as the earlier overlay did. Saved inventory and clear/queue ordering unchanged. Four checks and package/cloud evidence in tickets/CP-25-evidence/pickup-frame/. Report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Framed overlay checkpoint recorded')
