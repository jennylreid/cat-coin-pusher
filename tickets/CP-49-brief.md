# CP-49 Clean Home screen (approved by Jenny, Nov 16)

Name this conversation "CP-49 Clean Home screen". Engineer: read AGENTS.md (the frozen pickup and frozen-art rules),
CODEX_BRIEF.md and tickets/BASE-1.md item 5. You are the engineer; Claude PM reviews. Base: UAT 64 / production
2026.11.15 (source `work/cp63/release.html`, build.py + cp48.js). Small polish ticket: only these two things.

**Jenny's go (Nov 16):** "remove that random pyramid of coins at the bottom of the main screen and make the play
button smaller"

## 1. Remove the coin pyramid
The Home screen (Jenny's name for it from Nov 16; was "main screen" or PLAY screen) has a pyramid of coins at the bottom. Remove it completely; leave that area as clean background.
This replaces BASE-1 item 5 (the soft coin-field idea is dropped for now). Make sure nothing else was positioned
relative to the pyramid and is now floating or misplaced (side buttons, cat, footer, level label).

## 2. Smaller PLAY button
Make the PLAY button about two thirds of its current size, same style, same place (centred where it is now). Its text
stays readable and the tap target stays comfortably tappable on a phone (at least about 48 dp).

## 3. Added (Jenny, Nov 16): rename the button
The in-round "Main screen" button (and any other "Main screen" label the player sees) becomes "Home". Same button,
same behaviour; only the label changes.

## Don't touch
The title screen and its coin pile-up (Jenny: "leave old title coins"), the board and gameplay, the coin limit, sounds,
the pickup, approved art, all other screens. Production untouched.

## Test
Desktop screenshots of the Home screen before/after at phone size (portrait), Developer off. Tap PLAY and every
Home-screen button once to confirm they still work. Usual build steps: backup to `uat/backups/before-UAT65-<numeric>`,
new version 20261116…, fresh cloud download verified, `python work/checkpoint.py`.

## Report
Top of `tickets/CP-49.md`: changes, before/after screenshots beside it, validation, limits. Then a short UAT test plan
for Jenny (what to try, what she should see) ending with a paste line. Message the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Don't start other work.
