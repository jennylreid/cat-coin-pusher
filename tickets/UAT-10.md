# UAT-10 — Wider table at the back

Status: PUBLISHED to UAT 20261013170210 / APK2 after Jenny approved the preview and publication. October 13, 2026.

Baseline: exact published UAT 20261013164950 / APK2, decoded from uat/CatCoinPusher-UAT-game.json into work/uat10/baseline.html. Proposed source: work/uat10/draft.html. No publishing or packaging performed. Production 20261013160516, published UAT and both APKs remain unchanged; protected SHA256 hashes verified in UAT-10-verification.json.

## Change and preview

Rear display half-width rises from 86 to 114 game units (+32.56%). Front width and all table vertical coordinates stay fixed. Existing table artwork receives a cached horizontal perspective warp, tapering to zero at the front. The felt mask, coin projection, delivery clip and rear housing follow the new width; brass texture, highlights, gradients and stroke remain the same. Head and paw art, placement, scale and drawing functions remain unchanged. No change to physics, input timing, board recipes, budgets, powers, audio or frame scheduling.

![Before and after, actual phone-aspect game frames](UAT-10-before-after.png)

Actual seeded game renders at 540×1202, with Android safe-area inputs 1080×2404, left/right/bottom37 and top164. Individual images: UAT-10-baseline.png and UAT-10-draft.png. Head stays fully visible. HUD FPS is a runtime test label, not a phone measurement.

## No-power results

Same target-following bot and seeded boards; all four wins exactly match current UAT.

| Board | Tap cadence | Coins spent / budget | Spare | Clear time |
|---|---|---|---|---|
| 1 | 0.40 s | 109 / 140 | 31 | 43.57 s |
| 1 | 0.22 s | 140 / 140 | 0 | 41.05 s |
| 2 | 0.40 s | 117 / 160 | 43 | 46.48 s |
| 2 | 0.22 s | 129 / 160 | 31 | 28.23 s |

Each board has a demonstrated win with over25% budget-over-spend slack at0.4s cadence. Board1 faster cadence spends its entire budget. All runs pass timer, collider/drawn-front alignment and settled-idle checks. Evidence: UAT-10-board-results.json. Reproduce with node work/uat10/boards.cjs work/uat10/draft.html draft.

## Verification and performance

120 complete physics samples across both boards (8 seconds each) identical to baseline. 300 rapid-drop rendered frames: ledge corners remain inside traced felt/rails;20560 board coin draws and2090 delivery draws pass existing clip enforcement, zero unclipped coin calls. Settled board uses the same cached rail matte against widened felt. First480 pixel rows of phone preview identical, and head/paw drawing source/assets unchanged. Visual inspection confirms fixed fully visible head and paws, ledge contained, same brass appearance. Containment evidence covers rapid drops; no separate Quake run was required because no physics or power code changed.

Desktop native-canvas smoke at540×1202,50 bodies,90 samples: baseline draw13.01ms/step0.634ms; draft draw15.15ms/step0.680ms. The one-time table warp uses a1200×1260 cache (~6MB RGBA); each frame draws that cached image, with no row-warp work. This smoke showed about16.5% higher drawing time; it does not measure Android/browser FPS.120fps scheduling and existing cached coin renderer unchanged. Actual full-board120fps remains a required phone acceptance check after approved UAT publication; cannot claim it from desktop. Evidence: UAT-10-desktop-performance.json. No USB/ADB.

Scripts in work/uat10: prepare.cjs, render.cjs, boards.cjs, verify.cjs, perf.cjs. Rendering needs NODE_PATH set to the bundled runtime node_modules. Source pin, hashes, physics/containment evidence: UAT-10-verification.json.

## Next step

Wait for Jenny's explicit OK on these before/after images. Then publish only the exact approved draft to the existing UAT channel with a higher game label, backup and hash verification, retaining APK2. Phone review must confirm roomier rear, containment, head visibility and120fps. Production promotion needs separate sign-off.

## Publication — October 13, 2026

Jenny approved with “yes, please publish to UAT.” Published exact shown draft, only BUILD label updated, as UAT20261013170210/APK2. All23 runtime files verified;22 non-HTML files unchanged. UAT embedded APK equals existing APK2; production JSON/APK and UAT APK hashes unchanged. Backup: uat/backups/before-20261013170210. Payload SHA256: 46d2b5197fedb2f1dfa2e1af108d448019f8f87a963510cbb8757e7e6e197ee8. Release evidence: UAT-10-release-verification.json.

Use existing OneDrive UAT update after sync; no reinstall. Phone receipt, visual acceptance and full-board120fps remain pending. No production promotion or USB/ADB. Current source is published payload or work/uat10/draft.html; older external outputs/uat/game must not overwrite this release. Previous review/next-step text above is historical and superseded by this approval/publication.
