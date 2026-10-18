# UAT-07 — Published approved Happy refinement

**Status: PUBLISHED to UAT, game 20261012184647 / APK2, October12, 2026.**

Jenny approved the Happy-versus-Rest preview and explicitly requested publication. This release uses the exact approved mouth and clawless mitt assets. Happy remains **Settings → Preview Happy (6 seconds)**, with gameplay usage TBD. Board clear still uses Rest.

## Result

- Happy uses Rest-derived mitt artwork with the claws tucked, lowered onto the back edge. Mitts leave the head and whiskers clear.
- Happy uses the Sweet/Rest mouth and tongue, with the lower lip slightly lowered. The old dark-red mouth is removed.
- Closed golden eyes and star accents retain their original drawing.
- Waiting, Sharp Grin, Sweet, Quake, original paw art, Rest and all other poses remain unchanged. Both approved Waiting and Sharp Grin remain separate assets.
- Gameplay, layout, timing, sounds, physics and balance are unchanged.

![Released-source Happy render](UAT-07-released-happy.png)

The full phone-size Happy-versus-Rest comparison and mouth close-up remain in UAT-07-approved-review.md and the adjacent UAT-07-happy-vs-rest.png / UAT-07-sweet-mouth-vs-happy.png. Renders use1080×2404 and reconstructed safe-area insets; they are desktop runtime renders, not installed phone captures.

## Implementation and validation

Added two lossless WebP assets: **img/art/happy-mouth.webp** and **img/art/happy-mitt.webp**. Each decodes to the approved PNG’s **exact full RGBA**, including invisible-pixel RGB. Only the art loader and the two Happy drawing functions changed. Normalising those allowed changes yields identical remaining game source. Every original non-HTML runtime asset is byte-identical to UAT-06.

The actual WebP-rendered Happy matches the approved PNG preview within native decoder/compositing roundoff:2812 pixels differ by at most1 RGB value; file-level lossless RGBA is exact. No geometric or intentional art difference is introduced by encoding.

Runtime checks pass:

| Check | Result |
| --- | --- |
| Waiting render versus UAT-06 | Pixel-identical |
| Rest render versus UAT-06 | Pixel-identical |
| Quake full impact / recovery versus UAT-06 | Pixel-identical |
| Happy duration / expiry | Six seconds; returns to Rest in cleared-board setup |
| Original ART.paw restored after Happy drawing | Pass |
| Previewing Happy before any Rest draw | Rest palm clipping profile identical |
| Manual preview remains the only Happy trigger | Pass; preview trigger/gameplay code unchanged |
| Board1 spends at0.4 /0.22s | 86 /113 |
| Board2 spends at0.4 /0.22s | 119 /127 |
| Quake spills Board1 /Board2 | 15 /12 |
| Power exclusion / no coin cost / roar-before-slam / reset | Pass |

The clipping-profile comparison in the test harness was normalised to ordinary arrays before comparing separate VM contexts; this avoids a cross-realm prototype mismatch and makes no runtime change. See UAT-07-render-verification.json and UAT-07-implementation-proof.json.

The earlier art audit remains valid: original upper lip and protected tongue interior/cleft unchanged, original upper mitt795 rows unchanged, Rest upper-palm clip profiles equal, no ivory claw pixels, no head/whisker overlap, and unchanged rendered golden-eye band.

## Publication and rollback

Delivery: **uat/CatCoinPusher-UAT-game.json**, game20261012184647, APK2, channel catpusher-uat, applicationId com.jenny.catpusher.uat.22 runtime files /13 art assets. All payload files match staging; only index.html and the two new Happy assets differ from UAT-06, plus packaged build label.

The APK bytes, package ID, signing key, versionCode, save/settings keys and update path remain unchanged. This is a **game-only update** through the existing OneDrive UAT game-update flow; no APK reinstall is needed. Phone receipt/reload is not claimed from desktop verification; no ADB/USB debugging used.

Before publication, existing UAT JSON/APK, metadata/Happy preview, spec/handoff and ticket review report were backed up under **uat/backups/before-20261012184647**. The saved update JSON matches the prior published UAT-06 byte-for-byte. Publication used temporary-file replacement with post-copy hashes. UAT-07-release-verification.json records the checks. To roll back, republish saved game files with a fresh higher game version; a lower stamp will not downgrade the updater.

Published UAT JSON SHA256: `8f4991f4b48e693959eb88347ea529d1762c3dd38537eac12e2f506f0affb817`

UAT APK SHA256, unchanged: `43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production remains **20261012120202 / APK14**, unchanged before/after publication:

JSON `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

APK `e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

SPEC release table/Happy approval and handoffs are updated. UAT-06 remains approved, Waiting/Sharp Grin retained, and UAT-04 remains cancelled. Happy usage is still TBD; no automatic gameplay use or production promotion is authorised.
