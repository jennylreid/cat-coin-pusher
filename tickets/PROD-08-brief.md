# PROD-08 Production update (Jenny, Nov 17)

Name this conversation "PROD-08 Production update". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md
("Channels and publication") and CODEX_BRIEF.md. Read tickets/PROD-06-brief.md and tickets/PROD-06.md (the last full
promotion), and tickets/CP-59.md "Production hotfix (PROD-07)". You are the engineer; Claude PM reviews.

**Jenny's sign-off (Nov 17), verbatim:** "CP-62 passes. Production update: go with CP-54, 56, 57, 58, 61, 62, 63, 64, 69."
Her UAT sign-offs: UAT 71-76 (CP-54, CP-56, CP-57), UAT 78 (CP-61), UAT 85 (CP-58), UAT 84 (CP-63), UAT 88 (CP-69,
CP-57 title, CP-70), UAT 89 (CP-64 with the Dance-meter add-on), and CP-62 above.

## What production gets
Production 2026.11.16.2 (PROD-07, APK17, `phone/CatCoinPusher-game.json`) is replaced by the game of **UAT 89**
(2026.11.17 UAT 89, 20261118000000), which holds exactly the signed-off scope on top of the PROD-06 baseline. Check that
claim first: list every change between production's source and UAT 89 by ticket. Anything that isn't in the sign-off
list above (or CP-70's UAT-only Developer tools, which stay hidden with Developer off) stops the promotion. Report it to
the PM before going on.

## Do
- Make the production build from UAT 89's source with the established production adaptations (`work/prod07/prepare.py`
  and `adaptations.json`, the same ones as PROD-05/06/07): production name and BUILD `2026.11.17`, title CatCoin,
  `catpusher.uat.*` keys become `catpusher.*`, Developer off with no Developer default, no MODES or test tools, no log
  buttons (APK17 has no log bridge), and the local performance log a no-op. Work in `work/prod08/`.
- **Title sound:** production's own title clink, one per letter (CP-57 note). UAT 88+ already has it; confirm it matches
  production byte for byte.
- Ship all the runtime files UAT 89 needs, including the new art (CP-56, CP-62, CP-58 yawn face and empty bottle, CP-69
  outfit) and the CP-57 sounds. Game-only update for APK17; native unchanged; apkVersion 17; channel `catpusher`;
  com.jenny.catpusher; strictly higher version.
- **Checks:** Developer-off screens; save carry-over from production 2026.11.16.2 (levels, stars, coins, Catnip, pantry,
  Album, cats, sound) with no re-migration; the Oct 31 upgrade path; the CP-59 cascade fix still in; the pickup identical
  to UAT 89; the real-browser boot of the full runtime folder (`work/cp85/bootcheck.cjs` style) with the production
  name.
- **Publish:** back up to `backups/before-PROD-08-<numeric>`, publish to production only, confirm the UAT JSON and both
  APKs are unchanged, run the cloud check from the production share link, then `python work/checkpoint.py` and a GitHub
  commit naming PROD-08 on main (main is sign-off only; this is signed off). Never commit Screenshots/ibear-*,
  Screenshots/ref-* or anything .gitignored.

## Report
At the top of `tickets/PROD-08.md`: the scope check, the checks, the cloud result, and a short phone check for Jenny:
update, the version reads 2026.11.17, progress kept, and a quick look at the Yawn, Formal inspection and a prize. Then
message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or print the 49 MB game JSON
files. Keep long logs in your scratchpad, not the OneDrive folder.
