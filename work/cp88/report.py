from pathlib import Path
p=Path(__file__).parent;r=p.parents[1]
report='''# Phone test — CP-69 / CP-57 / CP-70, UAT 88

Update the **UAT app** through Settings → Check for updates. Confirm **2026.11.17 UAT 88 / APK7**. Game-only update; phone receipt and UAT are pending Jenny.

1. Listen to the opening title: production's original clink is restored. Developer has no Title sound A/B/C/D selector or Replay title button.
2. Settings → Developer → **Give all cats**, **Give powers (3 each)**. Choose Tuxedo, start Level 2 or 3, and tap Formal inspection after GO.
3. During the power, check hat B (wide ivory band), wider black tie A **below the tongue**, gold monocle A, and the thicker black/gold **crook cane**. Its angled handle shows above the right mitt during the sweep. Hat and tie disappear when the power ends; the head and mitts stay the approved art.
4. Check the same inspection, highlight and front sweep as UAT 87, and the usual busy pickup when several prizes fall together. Try Start a Jackpot now to check its cascade and pickup too.
5. Developer has Basics, Levels, Give, Start now, and Reset progression last. Engineer tools is closed on opening; expand it to reach the remaining controls. Try +1,000 coins and Give powers. Close/reopen Settings: Engineer tools is closed again.

Reply: `UAT 88 (phone): title __; art/tongue/cane __; inspection/pickup __; Developer __.`

## Shipped scope and desktop validation

November 17, 2026. UAT 88, numeric **20261117235959**, on the pinned published UAT 87. UAT only, game-only APK7, 70 runtime files: index.html plus four CP-69 PNGs changed/added. Backup: `uat/backups/before-UAT88-20261117235959`.

- CP-69: exact picked paintings, no regeneration. Tie canvas is lowered 26 head-space units; crook cane chosen, tilted about 23° so the handle clears the mitt. Rendering overrides only; CP-63 targets, movement, timing and charge rules remain the baseline's.
- CP-57: ran `work/cp57-title/build-title-final.py`; production title sound restored and the audition switch/Replay title removed.
- CP-70: existing buttons are moved after binding, preserving IDs and handlers; duplicate wheel labels remain in Engineer tools. The old unreachable +1,000 button's same coin grant is exposed in Give. Added optional `--message` to checkpoint.py for the required ticket names in the commit.
- CP-63 behavioral suite, CP-64 Jackpot suite and title restore checks pass. Behavior checks 1–4 passed before a legacy image-loader failure at rendered check 5; those console results are recorded in behavior-console-results.json. Checks 5 onward were resumed with the full staged art and C2PA metadata omitted in test memory only. Their historical whole-build reconstruction checks are replaced with the UAT 88 staged source check; `scope-audit.json` separately verifies the reproducible pinned build and exact additions. Seven simultaneous pickups match the baseline's frame trace and sound calls. Non-rendering harnesses emit their existing optional-art loader warnings; the complete real-browser runtime loads all art, boots, reaches play and reports no errors.
- Real Chrome stills at 412×915 and 360×640 visually checked: tie clear of tongue, gold monocle, hat, cane handle visible. Developer list, retained handlers, +1,000 grant, powers grant and collapsed reopening checked in the real browser. Phone sound, receipt and performance require Jenny's test.

Evidence: [412×915](CP-69-evidence/uat88/power-412x915.png), [360×640](CP-69-evidence/uat88/power-360x640.png), [cane sweep](CP-69-evidence/uat88/sweep-412x915.png), [short browser clip](CP-69-evidence/uat88/inspection.mp4). Scripts/source: `work/cp88/`; validation, package, publication and cloud records: `tickets/CP-69-evidence/uat88/`.

Publication: backup and local UAT bytes verified; fresh anonymous cloud bytes verified. GitHub WIP checkpoint committed and pushed with CP-69, CP-57 and CP-70 in the message. Stopped for phone UAT.

---

'''
f=r/'tickets/CP-69.md';s=f.read_text(encoding='utf-8');assert not s.startswith('# Phone test');f.write_text(report+s,encoding='utf-8')
f=r/'CODEX_BRIEF.md';s=f.read_text(encoding='utf-8');s=s.replace('Updated November 17, 2026 (CP-64 + CP-57: UAT 87).','Updated November 17, 2026 (CP-69 + CP-57 + CP-70: UAT 88).');s=s.replace('## Current releases (recorded in ticket reports)\n','## Current releases (recorded in ticket reports)\n- UAT: **2026.11.17 UAT 88 / APK7**, numeric 20261117235959: published UAT 87 + CP-69 picked Formal inspection art (hat B, lowered black tie A, gold monocle A, thicker crook cane), CP-57 production title sound restore, CP-70 Developer list with collapsed Engineer tools. Game-only, 70 runtime files. Source/build `work/cp88/`; report/phone test at top of `tickets/CP-69.md`; evidence `tickets/CP-69-evidence/uat88/`. Fresh cloud bytes verified; phone UAT pending.\n',1);s=s.replace('- UAT: **2026.11.17 UAT 87','- Previous UAT: **2026.11.17 UAT 87');f.write_text(s,encoding='utf-8')
f=r/'DEVELOPER.md';s=f.read_text(encoding='utf-8');f.write_text('''## CP-69 / CP-57 / CP-70 — UAT 88

Pinned published UAT 87; `work/cp88/build.py` calls the CP-57 title-final builder, preloads four approved CP-69 accessory paintings, then appends drawing overrides and the CP-70 Developer DOM wrapper. Hat and lowered tie draw only from the inspection-only monocle hook; gold monocle retains eye origin/drop/out timing, crook cane retains original sweep span with a visible angled grip. Physics, inspection state machine and frozen pickup unchanged. `developer.js` moves bound nodes, preserves IDs, keeps duplicates and tuning in native closed details; +1,000 grants the old panel's same coin amount. `prepare.py`, `audit.py`, adapted behavioral suites and real-browser `browser.cjs` provide validation. Publication/anonymous cloud verification use the existing UAT item; 70-file game-only APK7 payload. Phone test/report: `tickets/CP-69.md`.

'''+s,encoding='utf-8')
(r/'uat/README.md').write_text('''# CatCoin UAT

Current **2026.11.17 UAT 88 / APK7**, numeric **20261117235959**: CP-69 Formal inspection art, CP-57 production title sound restore, CP-70 Developer cleanup, on published UAT 87. Complete 70-file game-only runtime. Backup `uat/backups/before-UAT88-20261117235959`. Report and phone test: `tickets/CP-69.md`. Source/build/checks: `work/cp88/`. Phone UAT pending.

Accept the in-app game update (or Settings → Check for updates). APK7 unchanged; do not uninstall.
''',encoding='utf-8')
