# UAT-06 — Published approved Waiting face; Sharp Grin retained

**Status: PUBLISHED to UAT, game 20261012180042 / APK2, October12, 2026.**

Jenny explicitly approved the corrected revision6 and instructed publication, keeping both Sharp Grin and the new Waiting face. This release contains that exact approved face. UAT-07 Happy refinements are separate pending preview work and are not included.

## Result and assets

- Waiting uses the approved crisp chunky four-fang artwork, losslessly encoded as **img/art/head-waiting.webp**.
- The original **Sharp Grin stays byte-identical as img/art/head.webp**, retained and loaded separately as ART.headSharp for future use TBD. It is no longer the active Waiting expression.
- Only the art-loader mapping/reserved Sharp Grin reference, new Waiting asset and packaged build label differ from UAT-03. All other original runtime assets are byte-identical. No poses, dimensions, layout, physics, timing, sounds, storage keys or native app identity changes.
- Both heads remain1536×1024 with original draw registration. Sweet, Quake, Happy and mitt art remain unchanged. Existing Happy remains preview-only; UAT-07 changes not shipped.

![Actual released-source Waiting render](UAT-06-published-waiting.png)

![Preserved Sharp Grin render](UAT-06-preserved-sharp-grin.png)

These are1080×2404 native-canvas runtime renders using the reconstructed Pixel safe-area profile, not installed phone screenshots. The original approval comparison and mouth close-up remain in UAT-06-r6-fix-approved-review.md.

## Validation

The Waiting WebP decodes to **exactly the approved PNG’s full RGBA**, including transparent-pixel RGB (encoder exact mode). Source and encoding hashes: UAT-06-implementation-proof.json. Sharp Grin retains SHA256 `54fd9c2513770e46850fdfc34b5e1103860e5a40e8c45cc46f618000eec606e9`.

The actual encoded runtime render differs from the approved PNG mockup only by native PNG/WebP decoder/compositing roundoff:753 edge pixels, maximum1 RGB value. No geometric or visible art redraw occurs at encoding. Rest, full Quake impact, recovery and the existing Happy preview are **pixel-identical** to the UAT-03 baseline renders. See UAT-06-face-switch-verification.json.

SPEC physics outcomes remain exact:

| Check | Result |
| --- | --- |
| Board1 spend at0.4 /0.22s cadence | 86 /113 |
| Board2 spend at0.4 /0.22s cadence | 119 /127 |
| Quake spill Board1 /Board2 | 15 /12 |
| Power exclusion, no coin cost, roar-before-slam, reset | Pass |
| UAT-03 fit at1080×2404,719×1600,400×720 | Pass; head/board fit, idle coins over mitts |

The old UAT-02 historical comparator was unsuitable: it references pre-WebP assets and requires Waiting to match that old version. Its legacy asset loader failed with a Windows-path protocol error. It was not altered; the relevant pose checks above instead compare directly against current published UAT-03. The native comparison harness was adjusted to report numeric pixel deltas rather than trying to print full multi-megapixel arrays, and rerun successfully.

## Publication and backup

Delivery: **uat/CatCoinPusher-UAT-game.json**, channel catpusher-uat, applicationId com.jenny.catpusher.uat, game20261012180042, APK2.20 runtime files/11 art assets are packaged. Every payload file was verified against staging; all prior non-HTML assets remain unchanged. The APK is unchanged, so no native rebuild, versionCode or signing-key change is required. Use the existing UAT **game update** after OneDrive sync; no APK reinstall.

Before replacement, current UAT JSON/APK, relevant metadata/previews, spec/handoff and pre-publication ticket report were copied to **uat/backups/before-20261012180042**. Saved JSON matches the prior published UAT-03 byte-for-byte. Delivery used temporary-file replacement and post-copy hash checks. Verification: UAT-06-release-verification.json.

Published UAT JSON SHA256: `81a7e58f92659c6accf782899c1d03c8f102c448ad67693378d71261ed97d0ab`

UAT APK SHA256, unchanged: `43c81f070ffb4b371b11de78692b537baf12284ce3127a490a438165f9c92a78`

Production remains **20261012120202 / APK14**, unchanged before/after publication:

JSON `f5e6c67d68d29c08f64c8a4a96d51464d90b31ff4c28773caa46494a90f6b314`

APK `e1ee59222e40541327e8ba4e0f7d320a774028e9da79315c4720b5071cd5df26`

OneDrive file delivery is verified. Cloud sync, receipt/reload and appearance on Jenny’s phone are not claimed from desktop checks. No ADB or USB debugging used. SPEC release table, face approvals and handoff are updated. UAT-04 remains cancelled; discarded UAT-06 revisions must not be published.

## Next ticket

UAT-07 is a **preview-only** Happy refinement: same closed golden eyes/head, Rest mitt artwork with claws tucked, paws lower on rear edge, Sweet mouth/tongue with only bottom lip lowered. Show beside Rest and wait for Jenny’s OK before publication. This UAT-06 payload contains none of those pending changes.
