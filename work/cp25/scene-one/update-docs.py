from pathlib import Path
p=Path(__file__).parent;r=p.parents[2]
report='''# CP-25 Playable loop v1

**2026.10.28 UAT 6 / APK4 published**, numeric **20261028222309**. Backup, local package and fresh cloud hash verified. Jenny approved the satchel tile and selected **Scene wakes up**. Water art below awaits approval; Cheese has not been painted.

## Published changes

- Approved leather satchel tile replaces the placeholder at its existing 44×44 bounds beside the table.
- Completion now wakes the scene with Water ripples/bubbles or a warm Cheese glow, plays the existing fanfare, and arcs 12 copies of the approved coin into the satchel purse counter. The counter catches up over about two seconds; the full reward is credited and saved atomically at placement, so closing early cannot lose or duplicate coins.
- Returning to the board plays 4.4 seconds of the existing approved cat dance, without its table-shake option or long drum track. Ordinary input can interrupt it. A saved pending flag preserves an unplayed return reaction across reopening.
- Water still pays 100 once for tuna + shrimp; Cheese pays 50 once for cheese. Future slots do not block. The illustrated scenes remain approval previews, so UAT6 uses the prior placeholder collection layout with the new payoff.
- UAT5's item-only translucent pickup overlay, short pickup chime, queue and tap-away remain. [Prior report](CP-25-evidence/stage3-report.md) includes audio preview, overlay evidence and earlier stage links.

## Validation and phone UAT

[Payoff checks](CP-25-evidence/scene-one/checks.json): once-only saved reward, cosmetic counter, no physical bodies added, timed approved dance, table-shake restoration and reload continuity. Existing drag/award/advance interaction checks also passed against the new source. [Package verification](CP-25-evidence/scene-one/package-verification.json): only HTML plus the approved tile changed; other package fields retained; Water art absent.

Phone-size evidence: [coin payoff](CP-25-evidence/scene-one/payoff-phone.png), [return dance](CP-25-evidence/scene-one/return-dance-phone.png). Try finishing a collection, watch coins enter the purse, close Collections, and check the cat reaction. If both collections were already paid, they remain paid and do not replay. Phone receipt, perceived sound, touch feel, Android lifecycle and FPS remain Jenny's UAT.

## Water art — approval preview only

Layout locked in the actual game before painting: tuna left/open water, sardine upper right, shrimp near right seagrass, crab on the sand. Frame, tabs and bottom satchel keep their fixed bounds. [Layout lock](CP-25-evidence/scene-one/water-layout-lock.json), [real-game template](CP-25-evidence/scene-one/water-layout-phone.png), [painting template](../work/cp25/scene-one/art/water-layout-template.png).

One new background painting: sunlit turquoise cove, rocky borders, seagrass and golden sand. No prize art was generated. Frozen tuna/shrimp sprites and their derived contours are drawn by the runtime; future sardine/crab remain outlines. [Phone-size empty scene](CP-25-evidence/scene-one/water-art-phone.png), [placed-item preview](CP-25-evidence/scene-one/water-filled-phone.png), [inline still](CP-25-evidence/scene-one/water-art-inline.png).

Built-in imagegen tool; [exact prompt](../work/cp25/scene-one/art/water-prompt.txt); [saved asset](../work/cp25/scene-one/art/water-scene-v1.png). Original generated file preserved. Approval renderer: `work/cp25/scene-one/water-preview.cjs`; its geometry and painting are not in UAT6. Waiting for Jenny's Water OK before integration, then lock and paint Cheese separately. Required approval comes from the brief's Stage 3 art process: “Show each piece as a phone-size still and wait for Jenny's OK before building it into the game.”

## Publication and close-out

Baseline UAT5. Source `work/cp25/scene-one/release.html`; builder `build.py` + `payoff.js`. Backup `uat/backups/before-CP-25-scene-one-20261028222309`. [Publication](CP-25-evidence/scene-one/publication.json), [cloud verification](CP-25-evidence/scene-one/cloud-verification.json). JSON SHA-256 `3e8958fa5a20504b7385c90305095161d99bada6289135241f86fbaaa5f26b76`; same OneDrive item/link, revision35; game-only APK4 update.

Commit/push close-out follows Jenny's ticket sign-off. CODEX_BRIEF.md remains reserved while the separate CP-22 promotion report is absent. This report is the current UAT checkpoint. Production remains outside scope.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
archive=r/'tickets/CP-25-evidence/stage3-report.md'
archive.write_text(archive.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text('''# CatCoin UAT

Current: **2026.10.28 UAT 6 / APK4** (20261028222309).

CP-25 approved satchel tile and Scene wakes up completion payoff: ripples/glow, fanfare, cosmetic coin-to-purse arc and approved cat dance on return. Overlay/pickup sound retained. Water illustration awaits approval and is absent from this package.

Source: work/cp25/scene-one/release.html. Report: tickets/CP-25.md. Backup: uat/backups/before-CP-25-scene-one-20261028222309. Fresh cloud hash verified; phone UAT pending.
''',encoding='utf-8')
for file,note in [('DEVELOPER.md','''## CP-25 approved tile / Scene wakes up (October 28, 2026)

Current UAT6/APK4 source `work/cp25/scene-one/release.html`, pinned to UAT5; builder `build.py` plus `payoff.js`. Approved tile is the only added runtime image. Collection reward remains atomic in `placeItem`; `collectionPayoff` animates a cosmetic purse display and 12 coin sprites, with no physics bodies. Schema1 adds `pendingCollectionDance`; existing missing field defaults false. Closing plays the approved silent dance clock for 4.4 seconds with table shaking disabled, then restores its previous setting. Input/powers/reset/screen opening end the reaction. UAT6 package/cloud verified. Water artwork and natural-slot layout exist only in `water-preview.cjs` until Jenny approves; Cheese painting pending. Current report: tickets/CP-25.md.

'''),('SPEC.md','''## CP-25 Stage 3 approved tile / chosen payoff (October 28, 2026)

UAT6 replaces the side Collections placeholder with Jenny's approved leather satchel at the same 44×44 bounds. Jenny selected Scene wakes up: Water ripples/bubbles or Cheese warm glow, existing fanfare, coin sprites arc into the purse, then 4.4 seconds of the approved cat dance on return. Ledger credits the existing once-only reward immediately; the purse number animation is presentation only. Scene illustration approval is separate: Water layout locked and painted for preview; not shipped yet. Cheese awaits its own layout/painting/approval. Report: tickets/CP-25.md. Earlier UAT checkpoints below are historical.

''')]:
 f=r/file;f.write_text(note+f.read_text(encoding='utf-8'),encoding='utf-8')
print('Report and current technical/publication notes updated')
