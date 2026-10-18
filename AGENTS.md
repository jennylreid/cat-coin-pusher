# CoinPusher session instructions

## Start and locations
- Work in C:/Users/jenny/OneDrive/work/CoinPusher. Read CODEX_BRIEF.md and tickets/<ID>-ticket.md first; open other docs/history only when the ticket needs them.
- Use one engineer conversation per ticket, named "<ID> <title>"; rename when the session supports it. Keep one ticket in progress at a time.
- tickets/: ticket instructions, reports and adjacent evidence. SPEC.md: design. DEVELOPER.md: engineering. Screenshots/: Jenny's phone evidence.
- CODEX_BRIEF.md: short current state; replace stale state rather than prepend logs. Archive history separately. SESSION_HANDOFF.md is a legacy log, not required startup reading.
- Shared process source: ../TEAM_PROCESS.md. The rules below summarize it; consult it for process questions.

## Scope and collaboration
- Jenny is product owner and phone UAT tester; Claude is PM; Codex is engineer. PM sets what/why and acceptance criteria; engineer chooses implementation. PM proposes; Jenny decides.
- Follow the assigned ticket's goal, "Don't touch" and acceptance criteria. Preserve approved art and geometry unless the requested change needs them. Do not rebuild from scratch.
- Test and report only what the ticket changes. Do not re-verify or mention untouched files unless a safety check fails. Balance numbers are needed only for physics or landing changes.
- Tickets and reports stay short and complete. Use standard terms: ticket, scope, acceptance criteria, baseline, regression, UAT, sign-off, promotion, cherry-pick, hotfix, backlog, on-model.
- Write tickets/<ID>.md with changes, relevant validation, limits and any pending decision before saying done. Place useful screenshots/evidence beside it; Claude reviews the report and Jenny tests on her phone.
- Keep technical docs current. Review fixes go first; wait if Jenny's approval or a dependent review is still needed. Do not ask again for actions already authorized.

## Channels and publication
- Keep production and UAT separate: app IDs, APKs, JSON updates, saves, settings, signing identity and update URI.
- Production: com.jenny.catpusher; phone/CatCoinPusher-game.json; CatCoinPusher.apk.
- UAT: com.jenny.catpusher.uat; uat/CatCoinPusher-UAT-game.json; uat/CatCoinPusher-UAT.apk.
- Build game changes to UAT first within ticket authorization; honor explicit preview/approval waits. Production requires Jenny's explicit sign-off of the specific changes and a promotion of only that approved scope.
- Use the current baseline/source guidance in CODEX_BRIEF.md. Do not publish stale source or copy the whole UAT APK/JSON into production.
- Back up before publication; production backups: backups/, UAT backups: uat/backups/. Preserve originals and historical backups; never put signing keystores in the shared project.
- Game-only updates use the appropriate OneDrive JSON; native updater changes require a matching signed APK and increased version. Preserve channel identity and strictly increase game versions.
- No USB debugging or ADB. Builds arrive through OneDrive updates. Phone receipt, sound, save continuity and FPS require device evidence; do not infer them from desktop tests.
