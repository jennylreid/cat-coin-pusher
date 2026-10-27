# Promotion: 2026.10.27 UAT 8 to production

Name this conversation "CP-21 promotion (UAT 8 batch)". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

**Goal:** promote the current UAT build, 2026.10.27 UAT 8 / APK4 (numeric 20261027113731, source `work/cp21/release.html`), to production. Jenny signed off on it on Oct 27. Production is a state, not a separate ticket: report under CP-21.

**What it contains (all signed off):**
- CP-21: the layout lock, new coins, solid coin physics.
- UAT-16: Board 3 and Tuna. The towers were dropped; Board 3 starts with straight rows.
- UAT-17: the Dancing pose.
- UAT-18: the Quake coin.
- UAT-19: Tickle the paws.

**Don't change:**
- Anything about that build's play or look.
- Production's name, app identity, saves, settings, signing key and update file (`phone/`, never `uat/`).
- UAT itself.
- Testing tools (dance and happy previews, paw outlines) stay behind Developer mode.

**Done when, with evidence:**
1. Production matches UAT 8, apart from the usual production-only differences (list them).
2. Board test results match UAT 8's (`tickets/CP-21-evidence/wins-solid-coins-test.log`).
3. Production carries a date name newer than 2026.10.16 and shows it in the footer and on the update screens.
4. A fresh cloud download of the production file matches what you staged.
5. Say whether this needs a new production APK. If it does, build a signed one with a higher version and tell me exactly what to do on my phone.

**Regression checks** (report only if something fails):
- Sound setting and save carry over from 2026.10.16.
- Automatic update from the production file still works.
- No drawing slowdown.

**Steps:** back up to `backups/` first, then publish to production directly.

**Close-out:** commit CP-21 and the batch's source to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-21, UAT-16, UAT-17, UAT-18 and UAT-19, then push. Do not commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.

**Report:** add a "Production" section at the top of `tickets/CP-21.md`, and update CODEX_BRIEF.md to the new production baseline.
