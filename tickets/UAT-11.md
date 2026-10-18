# UAT-11 — Back out UAT-10

Status: PUBLISHED to UAT **20261013215900 / APK2**, October 13, 2026. Jenny's phone UAT acceptance pending.

Restored the exact published UAT-08 **20261013164950** payload from the backup taken before UAT-10. This removes UAT-10's rear widening and perspective warp, restoring the original table, coin projection and Rest paw relationship. Only game version and HTML BUILD label differ from UAT-08. Wider table work is deferred to the art pass. Ticket authorizes direct publication without preview.

Verification: pinned backup SHA256 matches UAT-08 release evidence; all 23 decoded runtime files verified against UAT-08, with 22 byte-identical and HTML byte-identical after normalizing BUILD. All other payload fields match UAT-08, including channel/applicationId and embedded APK2. Post-publication hash matches staged payload. Exact restoration makes UAT-08 gameplay validation applicable; no new balance tuning or simulation changes.

Backup: uat/backups/before-20261013215900. Current source: work/uat11/release.html or published payload. Evidence: UAT-11-release-verification.json; reproducible publication checks: work/uat11/publish.cjs. Published SHA256: 3c2f030f51cee68f34361619035678311004a6366dbfe8ccdb5ff3bd3dc5e370.

Load the existing OneDrive UAT update after sync and accept 20261013215900; no APK reinstall. Jenny must confirm it looks and plays like UAT-08 on her phone, including restored rear proportions and Rest paws. Phone receipt, save continuity, sound and FPS cannot be established by payload verification. No USB/ADB used. Production was not promoted. Claude review and Jenny sign-off remain pending.
