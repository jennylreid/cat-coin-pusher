# UAT-12 — Make Board 1 easy

Status: PUBLISHED to UAT **20261015163000 / APK2**, October 15, 2026. Claude review and Jenny phone UAT pending.

Pinned the exact published UAT-11 20261013215900 payload. Increased Board 1's coin allowance from 140 to 220. The extra allowance gives new players room for inefficient taps without changing the approved layout or landing behavior. Only allowance and release label changed. Direct UAT publication is authorized by the ticket.

Same seeded target-following bot, no powers, actual game script and Rapier:

| Tap interval | Baseline used / spare | UAT-12 used / spare | Clear time, baseline → UAT-12 |
|---|---:|---:|---:|
| 0.4 seconds | 109 / 31 | 109 / 111 | 43.57 → 43.57 s |
| 0.22 seconds | 140 / 0 | 156 / 64 | 41.05 → 34.17 s |

Both runs win within 90 seconds, retaining 50.5% and 29.1% of the new allowance. The fast bot continues dropping beyond the former 140 limit and clears sooner; the old run stopped dropping at 140 and waited for the pile. Both updated runs pass settled-idle checks. Two deterministic cadences demonstrate the acceptance criteria; they cannot prove every possible human tapping strategy.

Publication verified all 23 runtime files against the pinned payload, allowing only the two source changes above. Backup: `uat/backups/before-20261015163000`. Published SHA256: `a6e2bd39afe97a86c398c82be7221dbfe9ac7beaa356313d848c9bac6b68548c`. Evidence: `UAT-12-release-verification.json`; reproducible preparation, bot results and publication scripts in `work/uat12`.

After OneDrive sync, refresh the existing UAT app and accept **20261015163000**; no reinstall. Start/restart Board 1 to test the 220 allowance. Phone receipt and ease of play need Jenny's UAT; desktop simulation does not establish phone FPS, sound or save continuity. No production promotion authorized.
