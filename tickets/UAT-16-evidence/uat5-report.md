# UAT-16 — Board 3: coin stacks and Tuna

Status: approved by Jenny on phone, October 16, 2026. UAT-16 complete. Release: 2026.10.16 UAT 5 / APK4 (20261016203354). Jenny: “found it and it looks good. approved”.

## Scope and baseline
Built from published UAT 20261016144422 / 2026.10.16 UAT 4 / APK4; baseline HTML text matches the published payload (line endings differ). Release: `work/uat16/release.html`, **2026.10.16 UAT 5 / APK4**, numeric **20261016203354**. Baseline preserved at `work/uat16/baseline.html`. Verified backup: `uat/backups/before-UAT-16-20261016203354`. Game-only update; no APK reinstall required.

## Changes
Board 3 adds nine columns arranged as stepped pyramids, including 11-, 12- and 14-coin towers. Ordinary coin contact produces a stronger Board-3-only tipping impulse; tilted columns split into real coins with inherited motion. Three tall stacks toppled at 4.78, 7.52 and 14.57 seconds in the captured no-power run. Shorter columns can remain standing.

A whole rounded-3D blue-and-silver Tuna with a smooth plump body, soft shading and no label joins Cheese and Shrimp as the third required target. Targets use the existing collection and win flow. Board 3 allows 140 coins and 110 seconds. The HUD fits three target labels and the final clear label covers all boards. A central rear space is reserved for UAT-18; no Quake coin implemented.

Board 3 caches upright stack images with a small projection/orientation tolerance; leaning stacks use per-coin drawing. This avoids the extra upright-stack drawing cost without changing physics.

## Evidence and validation
Actual game/Rapier render at 400 × 889, not a mockup or phone capture: [start screenshot](UAT-16-evidence/board3-start.png), [20-second silent toppling clip](UAT-16-evidence/board3-toppling.mp4). The whole fish is visible over the populated board. Jenny requested a whole fish, then more realistic rendering matching the shrimp; physics and balance are unchanged. The new transparent sprite is `work/uat16/art/tuna.png` and must be packaged as `img/art/tuna.png`. Built-in imagegen used; prompt saved beside the sprite.

Deterministic target-following bot, changes target every 12 drops; no powers used. Same strategy and cadence on both boards:

| Tap cadence | Board 2 used / budget | Board 2 left | Board 3 used / budget | Board 3 left |
|---|---|---|---|---|
| 0.4 seconds | 101 / 160 | 59 (36.9%) | 103 / 140 | 37 (26.4%) |
| 0.22 seconds | 113 / 160 | 47 (29.4%) | 124 / 140 | 16 (11.4%) |

Board 3 wins at 40.8 and 27.1 seconds respectively. These demonstrate viable no-power strategies, not a guarantee for every play style. Machine results: `UAT-16-evidence/balance.json`; runner: `work/uat16/balance.cjs`.

Desktop drawing sample: Board 2 median 10.11 ms, Board 3 9.43 ms for the initial board; this is a native canvas draw benchmark, not device FPS. See `UAT-16-evidence/drawing.json`.

## Sign-off and limits
Jenny selected B (Rounded 3D) on October 16. The selected style is integrated in `work/uat16/art/tuna.png`; the board screenshot and clip have been refreshed. Earlier natural illustration preserved as `work/uat16/art/tuna-natural-v1.png`. UAT publication approved by Jenny's request to check it on her phone and completed. Fresh OneDrive download SHA-256 matches staged JSON (`3b27a766fa16bf67cf1f05219bb23624af404adfbd2c885cb79a82acef9c95e8`); HTTP 200 and existing shared item preserved. See `UAT-16-evidence/publication.json` and `cloud-verification.json`. Release-source no-power runs reproduce both Board 3 results. The Tuna source is 1536 × 1024 with transparency; this does not establish phone sharpness. Jenny found Board 3 on her phone and approved its appearance and the ticket. The earlier pixelation/readability concern is resolved by that phone approval. No numeric device FPS, sound, or save-continuity result was supplied. Production promotion is outside this ticket and has not been performed.
