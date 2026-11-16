from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
report='''# CP-25 Playable loop v1

**2026.10.29 UAT 3 / APK4 published**, numeric **20261029073906**. Backup/package/fresh cloud hash verified. Jenny approved the kitchen painting and renamed the collection **Kitchen**. Both scene backgrounds are now integrated; phone UAT/sign-off pending.

## Kitchen published

- Kitchen replaces the former Cheese collection name in tabs and completion feedback. Contains **cheese** (obtainable now, counter slot) and **toy mouse** (future outline, floor slot).
- Approved warm kitchen painting integrated exactly as previewed. Frozen cheese art reused; its outline is derived from the original sprite. No new prize art generated.
- Dragging cheese to the counter pays 50 coins once; future mouse does not block. Existing placed cheese and paid collection flags remain valid. Internal `cheese` collection/save ID is retained for continuity; user-facing name is Kitchen.
- The chosen Scene wakes up payoff now uses the approved kitchen background: warm glow, existing fanfare, coin-to-purse arc and approved cat dance on return.
- Water retains tuna, shrimp and future outlines sardine, crab, clam, kelp and seahorse.

## Future Kitchen ideas — proposals only

- **Milk bottle:** a familiar cat-themed collectible with a strong bottle outline.
- **Sardine tin:** pantry treat, visually distinct from the loose fish in Water.
- **Oven mitt:** clear kitchen silhouette and a playful echo of the cat's mitts.
- **Wooden spoon:** naturally belongs beside the countertop utensils.
- **Fish-shaped biscuit:** a small kitchen treat with a readable outline.

Suggested next three: milk bottle, sardine tin, oven mitt. No proposed item has been added; Jenny chooses.

## Validation and evidence

[Kitchen checks](CP-25-evidence/kitchen/checks.json): correct tab/name; approved scene rendering; real cheese drag consumes one and pays 50 once; future mouse stays outline; saved completion and purse persist; return dance starts. [Phone-size Kitchen](CP-25-evidence/kitchen/kitchen-phone.png), [inline](CP-25-evidence/kitchen/kitchen-inline.png), [payoff](CP-25-evidence/kitchen/kitchen-payoff-phone.png). The approved [layout lock](CP-25-evidence/cheese/layout-lock.json), [painting prompt](../work/cp25/cheese/art/prompt.txt) and built-in imagegen source painting remain preserved.

Try Kitchen on the phone: drag owned cheese to the counter, watch the reward/glow, then return to the cat. Previously paid collections remain paid; they do not replay rewards. Phone receipt, sound/touch feel, Android lifecycle and FPS remain Jenny's UAT.

## Publication and close-out

Baseline Oct29 UAT2. Source `work/cp25/kitchen/release.html`; builder `build.py`. Backup `uat/backups/before-CP-25-kitchen-20261029073906`. [Package verification](CP-25-evidence/kitchen/package-verification.json), [publication](CP-25-evidence/kitchen/publication.json), [cloud verification](CP-25-evidence/kitchen/cloud-verification.json). Only HTML, approved kitchen painting and derived cheese outline changed. JSON SHA-256 `164d3cc6a62de323d61fe6b11fb7059fbf16281f3db45fa7c49d68d11cb65e30`; same OneDrive item/link. Game-only update retains APK4.

[Previous report](CP-25-evidence/seahorse-report.md) links Water, tile, payoff and earlier loop evidence. Ticket remains open for phone UAT and Jenny's sign-off; commit/push close-out follows sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
f=r/'tickets/CP-25-evidence/seahorse-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
f=r/'uat/README.md';f.write_text('''# CatCoin UAT

Current: **2026.10.29 UAT 3 / APK4** (20261029073906).

CP-25 approved kitchen painting integrated; collection renamed Kitchen. Cheese remains obtainable, toy mouse a future outline. Kitchen pays 50 once; saved placements/rewards retained. Water and selected Scene wakes up payoff retained. Additional Kitchen prizes are proposals only.

Source: work/cp25/kitchen/release.html. Report: tickets/CP-25.md. Backup: uat/backups/before-CP-25-kitchen-20261029073906. Fresh cloud hash verified; phone UAT pending.
''',encoding='utf-8')
for name,note in [('SPEC.md', '''## CP-25 Kitchen approved (October 29, 2026)

Current UAT3/APK4 (20261029073906) integrates the approved kitchen painting and renames the Cheese collection Kitchen. Contains obtainable cheese on the counter and future toy mouse on the floor. Cheese pays 50 coins once; no new requirements. Water retains its approved cove, obtainable tuna/shrimp and future sardine/crab/clam/kelp/seahorse. Selected Scene wakes up payoff retained for both. Further Kitchen items are proposals pending Jenny's choice. Report: tickets/CP-25.md. Earlier release checkpoints below are historical.

'''),('DEVELOPER.md', '''## CP-25 Kitchen integration (October 29, 2026)

Current UAT3 source `work/cp25/kitchen/release.html`, pinned to Oct29 UAT2. Builder `build.py` adds approved kitchen painting/cheese contour, scene geometry from the approved preview, and Kitchen display name. Internal collection ID `cheese`, placement and paid save flags remain unchanged. Tabs map labels to stable IDs so Kitchen selects/highlights correctly. Kitchen draw path shares the natural scene renderer and existing payoff. No new prize requirements. Tests/package/cloud evidence: `tickets/CP-25-evidence/kitchen/`; report tickets/CP-25.md. Additional prize candidates are proposals only.

''')]:
 f=r/name;t=f.read_text(encoding='utf-8');end=t.index('\n# CP-21') if name=='SPEC.md' else t.index('\n## ',3);f.write_text(note+t[end+1:],encoding='utf-8')
print('Kitchen report and technical notes updated')
