# CatCoin (was Cat Coin Pusher) session instructions

The game is called **CatCoin** from Oct 20, 2026; the folder, app IDs, file names and the GitHub repo keep their current names.

## Start and locations
- Work in C:/Users/jenny/OneDrive/work/CoinPusher. Read CODEX_BRIEF.md and tickets/<ID>-ticket.md first; open other docs/history only when the ticket needs them.
- Use one engineer conversation per ticket, named "<ID> <title>"; rename when the session supports it. Keep one ticket in progress at a time.
- tickets/: ticket instructions, reports and adjacent evidence. SPEC.md: design. DEVELOPER.md: engineering. Screenshots/: Jenny's phone evidence.
- CODEX_BRIEF.md: short current state; replace stale state rather than prepend logs. Archive history separately. SESSION_HANDOFF.md is a legacy log, not required startup reading.
- Shared process source: ../Process/TEAM_PROCESS.md. The rules below summarize it; consult it for process questions.

## Scope and collaboration
- Jenny is product owner and phone UAT tester; Claude is PM; Codex is engineer. PM sets what/why and acceptance criteria; engineer chooses implementation. PM proposes; Jenny decides.
- Follow the assigned ticket's goal, "Don't touch" and acceptance criteria. Preserve approved art and geometry unless the requested change needs them. Do not rebuild from scratch.
- Test and report only what the ticket changes. Do not re-verify or mention untouched files unless a safety check fails. Balance numbers are needed only for physics or landing changes.
- Tickets and reports stay short and complete. Use standard terms: ticket, scope, acceptance criteria, baseline, regression, UAT, sign-off, promotion, cherry-pick, hotfix, backlog, on-model.
- Close-out (Jenny, Oct 20): every ticket ends with a commit and a push to GitHub. Bring the ticket's source changes into C:/Users/jenny/GitHub/cat-coin-pusher, commit with a message naming the ticket, and push. Never commit other games' reference images (Screenshots/ibear-*, Screenshots/ref-*) or anything the repo's .gitignore excludes.
- After publishing a UAT, run `python work/checkpoint.py`. (WIP checkpoint on branch `wip/uat`; main stays sign-off only.)
- Write tickets/<ID>.md with changes, relevant validation, limits and any pending decision before saying done. Place useful screenshots/evidence beside it; Claude reviews the report and Jenny tests on her phone.
- Keep technical docs current. Review fixes go first; wait if Jenny's approval or a dependent review is still needed. Do not ask again for actions already authorized.

## Art and layout (Jenny, Oct 26; from "Cat Coin - Art Process Plan")
- Layout first, art second. Art fills a fixed, locked layout; it never decides the layout.
- Layout changes (camera, table shape and size, cat and paw positions, coin size and count) are made in the real game and shown as real-game screenshots. Never use generated images for layout work.
- Image generation is only for painting new art over a locked layout, one piece at a time (table, cat body, or paws; never several at once), on the same canvas so layers line up.
- Approved art is frozen: the cat's faces and poses (Waiting, Rest, Sweet, Sharp Grin, Happy, Dancing pose, tickle), the big front mitts, the coins and Quake coin (as approved in CP-21), the treats (cheese, shrimp, tuna) and the pusher. Do not redraw, regenerate, resize or restyle them; build around them. Only Jenny reopens an approved asset, and then only that asset.
- Approved behavior is frozen too (Jenny, Nov 14, 2026): the prize and coin pickup that came with the new version (UAT 52 default; full description in DEVELOPER.md "Pickup (frozen)"), especially the busy, noisy feel when many prizes drop at once. Do not change its look, sizes, timing, sounds or multi-drop behavior unless the ticket explicitly says so. If a ticket or request would change it as a side effect, stop and ask the PM first. The PM checks every request from Jenny against it and warns her before relaying anything that would alter it.
- No full redraws to fix a detail. Change only the piece in question.
- The locked layout's numbers and template screenshot live in SPEC.md (from CP-21). Read them before any visual ticket.

## Channels and publication
- Keep production and UAT separate: app IDs, APKs, JSON updates, saves, settings, signing identity and update URI.
- Production: com.jenny.catpusher; phone/CatCoinPusher-game.json; CatCoinPusher.apk.
- UAT: com.jenny.catpusher.uat; uat/CatCoinPusher-UAT-game.json; uat/CatCoinPusher-UAT.apk.
- Build game changes to UAT first within ticket authorization; honor explicit preview/approval waits. Production requires Jenny's explicit sign-off of the specific changes and a promotion of only that approved scope.
- Use the current baseline/source guidance in CODEX_BRIEF.md. Do not publish stale source or copy the whole UAT APK/JSON into production.
- Back up before publication; production backups: backups/, UAT backups: uat/backups/. Preserve originals and historical backups; never put signing keystores in the shared project.
- Game-only updates use the appropriate OneDrive JSON; native updater changes require a matching signed APK and increased version. Preserve channel identity and strictly increase game versions.
- No USB debugging or ADB. Builds arrive through OneDrive updates. Phone receipt, sound, save continuity and FPS require device evidence; do not infer them from desktop tests.
