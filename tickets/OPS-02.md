# OPS-02 Readable build names

Status: **published to UAT; phone UAT pending**. Jenny approved the preview and UAT publication (“lovely, yes”).

Release name: **2026.10.15 UAT 1 / APK4**. Baseline: current published UAT / APK3, pinned in `work/ops02/baseline-pin.json`. UAT APK4 and JSON published with verified backup.

- Footer: bold 15px white release name on a dark backing, replacing faint 9px timestamp text. FPS is Developer-only. Settings stays in place.
- Native game/app update offers and successful manual checks use the payload's `displayName`. Cached update metadata retains it. APK versionName uses the same name.
- Naming helper supports UAT `2026.10.15 UAT 1`, `2026.10.15 UAT 2`; production `2026.10.15`, `2026.10.15.2`. Production naming support is staged only; production is not published by this ticket.
- Hidden numeric IDs, offer policy and game activation comparisons retain their existing behavior. The release uses a fresh increasing numeric ID; future publications must allocate release-day name/sequence and numeric ID together.

Evidence: [before](OPS-02-evidence/baseline.png), [after](OPS-02-evidence/draft.png). Both are actual game canvas renders at 400 × 889 using baseline assets, not phone captures. Implementation and reproducible checks: `work/ops02`.

Validation: Android APK4 compiled; 10 existing release-offer cases passed. Additional sequence checks cover APK3 → APK4, subsequent game update, equal/older rejection. Naming formats and dialog bindings passed; numeric policy and activation methods match baseline. These checks establish desktop ordering behavior, not phone installation.

Publication: signed APK4 compiled and certificate matched the existing UAT identity. APK bundled HTML and numeric version match the JSON. Local publication hashes verified. Backup: `uat/backups/before-OPS-02-20261015220458`. Numeric updater ID for engineering traceability only: `20261015220458`. Manifest: OPS-02-evidence/publication.json.

Cloud verification passed: HTTP 200 from the existing shared OneDrive item, downloaded SHA-256 matches the published JSON (including embedded APK4). Evidence: OPS-02-evidence/cloud-verification.json.

Pending: phone update dialogs, sequential installs and readability/FPS. APK4 requires one in-place installation. APK3's initial offer retains its generic message until APK4 is installed. Actual phone installation is not claimed. Older payloads without displayName show “Earlier UAT build”.
