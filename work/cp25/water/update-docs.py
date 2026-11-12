from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];m=json.loads((p/'publication-manifest.json').read_text())
text='''# CP-25 Playable loop v1

**2026.10.29 UAT 1 / APK4 published**, numeric **20261029064437**. Backup, package and fresh cloud hash verified. Jenny approved Water's painting and requested clam and kelp as future prizes/outlines. Seahorse remains an optional idea pending her choice. **Cheese painting now ready for approval; not integrated.**

## Water published

- Approved sunlit underwater cove replaces the Water grid. Tuna/shrimp use their frozen sprites and matching derived outlines; sardine/crab remain future outlines. Added **clam on the sand and kelp beside the reef**, outline-only. No new board prizes or full prize artwork. All six slots fit above the fixed bottom satchel; dragging tuna/shrimp into their matching outlines fills them in place.
- Water completion still requires only tuna + shrimp and pays 100 coins once. New future slots do not block it. Previously placed items and paid collections remain valid.
- Chosen Scene wakes up payoff runs across the illustration: ripples/bubbles, fanfare, coin-to-purse arc, then the approved cat dance on return. Approved tile and pickup overlay/sound remain from prior UAT.
- [Phone-size Water](CP-25-evidence/water/water-phone.png), [inline Water](CP-25-evidence/water/water-inline.png), [placed items](CP-25-evidence/water/water-filled-phone.png), [payoff](CP-25-evidence/water/water-payoff-phone.png), [updated layout lock](CP-25-evidence/water/layout-lock.json). The approved background was reused without repainting; new outlines fit its existing space.

## Validation and phone UAT

[Water checks](CP-25-evidence/water/checks.json): slot bounds; actual drag placement/consumption; wrong drags and future slots reject; current obtainable items still complete the collection; reward pays once; save/reopen retains placements and balance. [Package verification](CP-25-evidence/water/package-verification.json): HTML plus approved Water image and two derived contours are the only changed files; all other package fields retained; unapproved Cheese painting absent.

On phone, open Water, drag owned tuna/shrimp into their outlines, check completion animation and return reaction. Existing paid collections remain paid and cannot replay their payout. Phone receipt, sound/touch feel, Android lifecycle and device FPS remain Jenny's UAT.

## Cheese — next art piece, approval only

Actual-game layout locked before painting: cheese on the left counter, toy mouse on the lower-right floor; fixed frame/tabs/bottom satchel. [Layout lock](CP-25-evidence/cheese/layout-lock.json), [real-game template](CP-25-evidence/cheese/cheese-layout-phone.png), [painting template](../work/cp25/cheese/art/layout-template.png).

One new background: warm window light, cream tiles, honey wood, teal cupboards and brass handles. No prize art generated. Original cheese sprite is shown as-is in the placed preview; toy mouse remains an outline. [Phone-size Cheese](CP-25-evidence/cheese/cheese-art-phone.png), [inline still](CP-25-evidence/cheese/cheese-art-inline.png), [placed preview](CP-25-evidence/cheese/cheese-filled-phone.png).

Generated with built-in imagegen; [exact prompt](../work/cp25/cheese/art/prompt.txt); [saved painting](../work/cp25/cheese/art/cheese-scene-v1.png). Original generated file preserved. Preview renderer `work/cp25/cheese/preview.cjs` is outside the update payload. Waiting for Cheese OK before integration, as the brief requires: “Show each piece as a phone-size still and wait for Jenny's OK before building it into the game.”

## Publication and close-out

Baseline UAT6 (Oct 28). Source `work/cp25/water/release.html`; builder `build.py`. Backup `uat/backups/before-CP-25-water-20261029064437`. [Publication](CP-25-evidence/water/publication.json), [cloud verification](CP-25-evidence/water/cloud-verification.json). JSON SHA-256 `db710c3e0ea6d71a72311cd46ce570fad04976022beaabdb2f5639dad1a98a3b`; same OneDrive item/link, revision36. Game-only update retains APK4.

[Previous report](CP-25-evidence/scene-one-report.md) covers payoff/tile validation and links the earlier loop/overlay evidence. Commit/push close-out follows Jenny's ticket sign-off. CODEX_BRIEF.md remains reserved while the separate CP-22 promotion report is absent. This report is the current UAT checkpoint. Production is outside scope.
'''
(r/'tickets/CP-25.md').write_text(text,encoding='utf-8')
archive=r/'tickets/CP-25-evidence/scene-one-report.md';archive.write_text(archive.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
(r/'uat/README.md').write_text('''# CatCoin UAT

Current: **2026.10.29 UAT 1 / APK4** (20261029064437).

CP-25 approved Water cove with natural drag slots and new clam/kelp future outlines. Completion remains tuna + shrimp for 100 coins once. Satchel tile, pickup sound/overlay and chosen completion payoff retained. Cheese painting awaits approval and is absent from this package.

Source: work/cp25/water/release.html. Report: tickets/CP-25.md. Backup: uat/backups/before-CP-25-water-20261029064437. Fresh cloud hash verified; phone UAT pending.
''',encoding='utf-8')
notes={'DEVELOPER.md':'''## CP-25 approved Water scene (October 29, 2026)

Current UAT source `work/cp25/water/release.html`, pinned to Oct28 UAT6. `build.py` integrates the approved Water image and natural-slot geometry; Cheese delegates to the existing placeholder renderer. `export-outlines.cjs` derives transparent contours from frozen tuna/shrimp sprites without editing those originals. Collection geometry, draw hitboxes and payoff share the scene bounds. New clam/kelp IDs are future outlines only; no bodies, inventory IDs, save-schema or completion requirement changes. Runtime image payload includes only approved Water plus the contours. Tests/publication: `tickets/CP-25-evidence/water/`. Cheese locked-layout painting/renderer lives separately in `work/cp25/cheese/` pending approval. Seahorse remains an optional idea. Report: tickets/CP-25.md.

''','SPEC.md':'''## CP-25 Water approved; Cheese preview (October 29, 2026)

Current UAT1/APK4 (20261029064437) integrates Jenny's approved Water cove. Tuna left/open water; sardine upper right; shrimp near right seagrass; crab lower-left sand; new clam lower-right sand and kelp left reef outlines. Water requires only obtainable tuna + shrimp for 100 coins once; all four future items remain outlines. Bottom satchel/frame fixed; original prize sprites reused. Selected Scene wakes up payoff retained. Seahorse is an optional idea pending Jenny's choice. Cheese kitchen layout is locked with cheese on the left counter and toy mouse lower-right floor; painting ready for approval, not shipped. Report: tickets/CP-25.md. Earlier release checkpoints below are historical.

'''}
for name,note in notes.items():
 f=r/name;old=f.read_text(encoding='utf-8');end=old.index('\n## ',3) if '\n## ' in old[3:] else -1
 if name=='SPEC.md':end=old.index('\n# CP-21')
 f.write_text(note+old[end+1:],encoding='utf-8')
print('Current report and technical notes updated')
