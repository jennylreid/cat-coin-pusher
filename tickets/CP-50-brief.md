# CP-50 Simple first board (approved by Jenny, Nov 16)

Name this conversation "CP-50 Simple first board". Engineer: read AGENTS.md (the frozen pickup and frozen-art rules),
CODEX_BRIEF.md, tickets/CP-47.md (levels table) and tickets/CP-49.md. You are the engineer; Claude PM reviews.
Base: the latest UAT (UAT 65 from CP-49, or its republish if CP-49 added the "Home" rename). One small change only.

**Jenny (Nov 16):** "we're collecting prizes too quickly and I want the first board to be very simple with just two
prizes, the original shrimp and cheese." "We'll have occasional boards that are crammed, but certainly not the first
screen." "Let's move slowly ... start with that first board being more simple."

## Change: Level 1 prizes
- Level 1 ("First push") has exactly **two prizes: the original shrimp and cheese** (the approved treat art, unchanged).
- Goal line: "First push: collect these 2", showing the shrimp and cheese icons. **No bonus prizes** on Level 1.
- Coins, layout (9 rows, no towers), time, Quake and tag stay as now. Place the two prizes where they need a few real
  pushes, not right on the front edge; say where you put them.
- Check: shrimp and cheese collected on Level 1 go where treats go now (inventory; over 9 turn into coins) and don't
  break the Kitchen/recipe chain or the Shop rule. If using treats as a level goal conflicts with something, stop and
  tell the PM.

## Don't touch
Every other level, the coin limit, the Home screen (CP-49), Settings, sounds, the pickup, approved art. Production untouched.

## Test
Desktop: Level 1 start screenshot and Home-screen goal line; win Level 1 and confirm "Level 2 is open"; bot win rate
and average time left for Level 1 before/after. Usual build steps: backup to `uat/backups/before-UAT66-<numeric>`,
version 20261116…, fresh cloud download verified, `python work/checkpoint.py`.

## Report
Top of `tickets/CP-50.md`: change, prize positions, validation, limits; then a short UAT test plan for Jenny ending
with a paste line. Message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start other work.
