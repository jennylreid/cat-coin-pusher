# OPS-01: Trim the brief, add AGENTS.md
Completed October 13, 2026.

## Changes
- CODEX_BRIEF.md reduced from 241 to 24 lines: current release state, pending phone acceptance, baseline/source traps, current design and pointers for optional reading.
- Added 26-line AGENTS.md with startup locations, team roles, scope/testing/reporting rules, separate channels, sign-off requirements and OneDrive delivery.
- Archived the complete original brief verbatim in CODEX_BRIEF_ARCHIVE-2026-10-13.md. Historical checkpoints and detailed notes remain available only when needed.
- Startup now uses AGENTS.md, the brief and the assigned ticket. Future state updates replace stale brief entries instead of adding checkpoint logs.

## Validation
Read back both startup files and checked their length, current-state summary, process rules and documentation references. Original and archive SHA256 match:
B0F5DA9EFDDF302A269122B9BA00014AB2428A753FDC440B4799B68F67F976C0
All original brief content is preserved. Acceptance criteria met; documentation checks only.

## PM's short prompt from now on
Paste this block, substituting the ticket ID and title:

> Name this conversation "<ID> <title>". In C:\Users\jenny\OneDrive\work\CoinPusher, follow AGENTS.md, read CODEX_BRIEF.md and tickets\<ID>-ticket.md, and do that ticket. Jenny is watching this session.

AGENTS.md supplies channel separation, relevant-only testing and tickets/<ID>.md reporting, so the starter need not repeat them or request the checkpoint log and full team process at every startup.
