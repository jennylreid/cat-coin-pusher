# Promotion: 2026.10.28 UAT 1 to production

**Cancelled Oct 28 (never run):** CP-22 will be promoted together with CP-25 in one release after Jenny signs off CP-25.

Name this conversation "CP-22 promotion". Work in C:\Users\jenny\OneDrive\work\CoinPusher; follow AGENTS.md and read CODEX_BRIEF.md.

**Goal:** promote the current UAT build, 2026.10.28 UAT 1 / APK4 (numeric 20261028102427, source `work/cp22/release.html`), to production. Jenny signed off on Oct 28: coin action is clearly better than production; any further coin feel work is a later ticket. Production is a state, not a separate ticket: report under CP-22.

**What it contains:** CP-22 coin action pass (no pass-through, no unearned flips, 0.35 s tap limit, landing and contact damping), on top of production 2026.10.27.

**Don't change:**
- Anything about that build's play or look.
- Production's name, app identity, saves, settings, signing key and update file (`phone/`, never `uat/`).
- UAT itself.
- Testing tools stay behind Developer mode.

**Done when, with evidence:**
1. Production matches 2026.10.28 UAT 1, apart from the usual production-only differences (list them).
2. Board test results match UAT 1's (`tickets/CP-22-evidence/uat13-wins.json`).
3. Production carries a date name newer than 2026.10.27 and shows it in the footer and on the update screens.
4. A fresh cloud download of the production file matches what you staged.
5. Say whether this needs a new production APK. If it does, build a signed one with a higher version and tell me exactly what to do on my phone.

**Regression checks** (report only if something fails):
- Sound setting and save carry over from 2026.10.27.
- Automatic update from the production file still works.
- No drawing slowdown.

**Steps:** back up to `backups/` first, then publish to production directly.

**Close-out:** commit CP-22's source to C:\Users\jenny\GitHub\cat-coin-pusher with a message naming CP-22, then push. Do not commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.

**Report:** add a "Production" section at the top of `tickets/CP-22.md`, and update CODEX_BRIEF.md to the new production baseline.
