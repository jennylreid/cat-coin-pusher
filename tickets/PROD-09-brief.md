# PROD-09 Production update from UAT 105 (Jenny, Nov 18)

Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md ("Channels and publication") and CODEX_BRIEF.md.
Read tickets/PROD-08-brief.md and tickets/PROD-08.md (the last promotion: same method). You are the engineer; Claude PM reviews.

**Jenny's sign-off (Nov 18), verbatim:** "Let's get this stuff to production before we continue to update UAT." after the
PM listed exactly: CP-71 (Yawn knocks coins, never eats them), CP-72 (Zoomies: title first, small peek-a-boo ending,
Level 7 side-guard fix, no gold streaks, today's Zoomies sound), CP-73 (cane held in Formal inspection), CP-75 (each
cat's own Yawn face), CP-78 (board clean-up: only stars behind the cat, solid rim), CP-80 (Developer-only Siamese wheel
fix), CP-82 (Sonic meow and Tortitude show their name first). Her UAT passes: UAT 92 (CP-71), UAT 93/94 (CP-73 cane),
UAT 95 (CP-75), UAT 97/99 (CP-78), UAT 102 (CP-82), UAT 105 (CP-72).

## What production gets
Production 2026.11.17 (PROD-08, APK17, `phone/CatCoinPusher-game.json`) is replaced by the game of **UAT 105**
(2026.11.18 UAT 105, 20261118000016). **Scope check first:** list every change between production's source and UAT 105
by ticket. Allowed: the tickets above, plus Developer-only tools that stay hidden with Developer off (CP-83 board lab,
Tower fall, the timing strip, the yawn-sound choice from CP-79, the CP-70-style Engineer tools). Anything else that a
player could see with Developer off stops the promotion: report it to the PM before going on. Note: the CP-79 yawn
sound default must be today's sound; the CP-83 switches must default to Today/Off.

## Do
- Build production from UAT 105's source with the established adaptations (`work/prod07/prepare.py` and
  `adaptations.json`, as in PROD-08): production name and BUILD `2026.11.18`, title CatCoin, `catpusher.uat.*` keys
  become `catpusher.*`, Developer off with no default, no MODES or test tools, no log buttons, the performance log a
  no-op. Work in `work/prod09/`. Keep production's title line as in PROD-08.
- Ship every runtime file UAT 105 needs (incl. CP-75 yawn art). Game-only update for APK17; native unchanged;
  apkVersion 17; channel `catpusher`; com.jenny.catpusher; strictly higher version.
- **Checks:** Developer-off screens show none of the lab/Engineer tools; save carry-over from production 2026.11.17
  (levels, stars, coins, Catnip, pantry, Album, cats, sound) with no re-migration; the frozen pickup identical to UAT
  105; the real-browser boot of the full runtime with the production name; Zoomies, Formal inspection, the Yawn on two
  cats and the board clean-up spot-checked in the production build.
- **Publish:** back up to `backups/before-PROD-09-<numeric>`, publish to production only, confirm the UAT JSON and both
  APKs are unchanged, run the cloud check from the production share link, then `python work/checkpoint.py --message
  "..."` and a GitHub commit naming PROD-09 on main (signed off). Never commit Screenshots/ibear-*, Screenshots/ref-*
  or anything .gitignored. Watch long runs with a waking watcher.

## Report
Top of `tickets/PROD-09.md`: the scope check, the checks, the cloud result, and a short phone check for Jenny (update,
version reads 2026.11.18, progress kept, a quick look at Zoomies, the Yawn on a non-Tuxedo cat, Formal inspection's
cane, the clean board). Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`) and stop. Never grep or
print the 49 MB game JSON files.
