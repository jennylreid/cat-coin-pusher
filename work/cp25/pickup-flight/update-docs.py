from pathlib import Path
p=Path(__file__).parent;r=p.parents[2]
report='''# CP-25 Playable loop v1

**2026.10.29 UAT 5 / APK4 published**, numeric **20261029074827**. Backup/package verified; cloud verification linked below. Jenny requested replacing the current collected-item overlay with movement into the satchel and sound. This pickup presentation was developed in CP-25 Stage 2/3.

## Pickup flight replaces centred overlay

- Existing collected sprite appears in the bottom play area after its front fall, arcs into the **existing approved side satchel icon**, shrinks and disappears. Satchel gives a small arrival pulse. No dim backdrop, centred popup, text, card or frame.
- Uses the existing short three-note pickup chime **on arrival**, once per item. Mute/hidden handling retained. No new sound asset.
- About 0.5 seconds for the existing front fall, then 1.2 seconds for appearance/flight/arrival. Multiple wins take turns. Pickup presentation is non-modal: ordinary taps/hold continue; there is no tap-to-dismiss target. Opening inventory pauses presentation until returning to play; credited inventory is available immediately.
- Inventory still credits/saves once at the actual front payout, independent of animation. Presentation is transient and never credits an item itself. Clear/advance waits for queued pickups.
- Direction assumption stated during implementation: from bottom play area to existing side satchel. Jenny was offered bottom-satchel vs existing-side-satchel options; no choice received during this run. The approved icon stays in its position, and no bottom icon was added.

## Evidence and validation

[Six checks](CP-25-evidence/pickup-flight/checks.json): actual payout credits once; arrival-only sound; ordinary input continues; queued items take turns; inventory pause/reopen; original-sprite flight has no backdrop/card/text; endpoint matches satchel; actual chime honors mute/hidden; queue finishes before clear/next board.

[Flight clip with chimes](CP-25-evidence/pickup-flight/pickup-flight.mp4), 540×1200, 5.4 seconds. Desktop game renderer, three existing Board3 prizes moved through the actual front payout path as a presentation fixture. Audio uses the earlier mathematical render of the same chime at arrival times; not a phone recording. [Phone-size mid-flight](CP-25-evidence/pickup-flight/flight-phone.png), [arrival](CP-25-evidence/pickup-flight/arrival-phone.png). Artwork reused as-is. Phone receipt, timing, sound, touch feel and FPS remain Jenny's UAT.

## Retained loop and collections

Water: tuna/shrimp obtainable; sardine/crab/clam/kelp/seahorse future outlines; 100 coins once. Kitchen: cheese obtainable; toy mouse future outline; 50 once. Both approved backgrounds, satchel tile and Scene wakes up completion payoff remain. Destination square during placement remains removed. Additional Kitchen prize candidates remain proposals in the [Kitchen report](CP-25-evidence/kitchen-report.md).

## Publication and close-out

Baseline Oct29 UAT4. Source `work/cp25/pickup-flight/release.html`; builder `build.py` + `awards.js`. Backup `uat/backups/before-CP-25-pickup-flight-20261029074827`. [Package verification](CP-25-evidence/pickup-flight/package-verification.json), [publication](CP-25-evidence/pickup-flight/publication.json), [cloud verification](CP-25-evidence/pickup-flight/cloud-verification.json). Only HTML changed. JSON SHA-256 `c07c2d52672ff55afbd1904234b8dd12d191f4a49d0f5f46b1c76c8499bb13da`; existing OneDrive item/link retained. Game-only update retains APK4.

[Previous report](CP-25-evidence/no-box-report.md) links scene, collection and earlier loop evidence. Ticket remains open for phone UAT/sign-off; commit/push close-out follows Jenny's sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
f=r/'tickets/CP-25-evidence/no-box-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text('''# CatCoin UAT

Current: **2026.10.29 UAT 5 / APK4** (20261029074827).

CP-25 collected-item overlay replaced with a flight from bottom play area into the existing side satchel, shrinking on arrival with the pickup chime. No dim backdrop; ordinary play continues. Saved inventory still credits once at payout. Approved Water/Kitchen scenes and completion payoff retained.

Source: work/cp25/pickup-flight/release.html. Report: tickets/CP-25.md. Backup: uat/backups/before-CP-25-pickup-flight-20261029074827. Cloud verification linked in report; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md','''## CP-25 pickup flight (October 29, 2026)

Current UAT5/APK4 (20261029074827) replaces the centred pickup overlay. After the front fall, collected sprites fly from the bottom play area into the existing side satchel, shrinking with a short chime/pulse on arrival. No backdrop, card or text. Queued pickups take turns, ordinary input continues, and presentation pauses in collection screens. Actual payout still credits/saves inventory once before presentation; clear/advance waits for the queue. Approved Water/Kitchen art, current collection requirements/rewards, placement with no destination square, and Scene wakes up completion payoff retained. Direction assumption/preview: tickets/CP-25.md. Earlier release checkpoints below are historical.

'''),('DEVELOPER.md','''## CP-25 pickup flight (October 29, 2026)

Current UAT5 source `work/cp25/pickup-flight/release.html`, pinned to Oct29 UAT4. Builder `build.py` + `awards.js`. `fallOff` passes payout x into a transient queue; existing inventory credit/save remains unchanged. Queue starts at -0.5s to allow front fall, flies at t0.15–0.95, sounds once at t0.95 and ends at t1.2. Endpoint derives from existing `collectionsTile`; safe bottom origin follows current HUD. No backdrop/card/text; small satchel pulse. Pickup no longer intercepts pointerdown. Inventory view pauses/hides presentation without removing credits. Existing mute/hidden audio method unchanged. Six checks, clip, manifest/cloud: tickets/CP-25-evidence/pickup-flight/. Report tickets/CP-25.md.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Pickup flight report and current technical notes written')
