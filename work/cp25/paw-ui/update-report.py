from pathlib import Path
p=Path(__file__).parent;r=p.parents[2]
report='''# CP-25 Playable loop v1

**Local UI layout preview ready; no new publication. UAT10/APK4 remains current** (20261029110950). Jenny agreed with direction **B — teal paw medallion**, then requested a matching Collections tile, bottom Inventory satchel, and power icon/count buttons above the cat.

## Draft changes

- **Pickup popup:** selected B paw-shaped medallion, original collected prize inside. Existing modal pause/disabled background, queue, sound and tap-away retained.
- **Collections:** same paw shape at the existing side tile position/44×44 bounds, with a larger three-stacked-cards/bookmark symbol. Opens Water/Kitchen collections.
- **Inventory:** approved satchel image moved to bottom centre at44×44; opens a dedicated owned-treat inventory. Inventory has a Collections link; collection scenes retain their bottom drag satchel. Old bottom-right Inventory text removed.
- **Powers:** Paw Sweep (paw) and Quake (circle/lightning bolt) above the cat in the existing header, with available-charge badges. Old bottom power bars removed. Board number and target checklist moved into the freed footer space. Header bounds, cat/table/camera geometry and original artwork stay fixed.
- Buttons show/use the existing available charges. Zero charges are inactive; the former free ready-screen Sweep preview is no longer the main power button's action. Existing power functions/earning/physics are retained; Board3's non-Developer Quake icon uses earned Quake charges. No new earning economy.

## Review stills and checks

[Layout and paw pickup comparison](CP-25-evidence/paw-ui/layout-and-popup.png), [full phone board](CP-25-evidence/paw-ui/board-phone.png), [full phone popup](CP-25-evidence/paw-ui/popup-phone.png), [Inventory screen](CP-25-evidence/paw-ui/inventory-phone.png).

Screenshots are actual-game renders,1080×2400 each. Board1 screenshot uses a **layout fixture of1 Sweep /2 Quakes**, not changed starting amounts. Popup is triggered through the real front payout path. No generated artwork.

[Checks](CP-25-evidence/paw-ui/checks.json): header hitboxes above the cat; zero charges do nothing; charged buttons consume exactly one existing power/no coin; Board3 earned Quake count/action; distinct Inventory/Collections navigation without dropping. [Layout lock/preview manifest](CP-25-evidence/paw-ui/layout-lock.json) records the fixed bounds and identical published UAT JSON hashes before/after.

Local source `work/cp25/paw-ui/draft.html`; builder `build.py` + `ui.js`; renderer/checks `check.cjs`. Baseline: current UAT10 `work/cp25/pickup-modal/release.html`. Draft is not packaged or published. Phone feel/safe-area fit and device performance await UAT after approval.

## Pending approval and close-out

Waiting for Jenny's OK on this concrete layout/new Collections tile before publication. Stage3 art process in `tickets/CP-25-brief.md`: “Show each piece as a phone-size still and wait for Jenny's OK before building it into the game.” The prior turn explicitly agreed to compare static directions before further animation/publication; selected B is now implemented in the local draft for review.

[Previous design review](CP-25-evidence/pickup-concepts-report.md) links the three static options and UAT10 publication evidence. UAT10 remains the published striped-popup draft; no new backup/publication was needed for this local preview. Ticket remains open; commit/push close-out follows ticket sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. Production is outside scope.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
f=r/'tickets/CP-25-evidence/pickup-concepts-report.md';f.write_text(f.read_text(encoding='utf-8').replace('(CP-25-evidence/','(').replace('(../work/','(../../work/'),encoding='utf-8')
for name in ['SPEC.md','DEVELOPER.md']:
 f=r/name;t=f.read_text(encoding='utf-8');start=t.index('Design review only:');end=t.index('\n\n',start)
 note='Local UI draft: Jenny chose B (paw medallion), matching paw Collections tile with stacked-card symbol, bottom Inventory satchel, and above-head Paw Sweep/Quake icon/count buttons. Actual-game layout preview/checks are in work/cp25/paw-ui/ and tickets/CP-25-evidence/paw-ui/. No new publication; UAT10 remains current. Zero-charge power buttons are inactive; earning/power physics retained. Layout/tile approval pending. See tickets/CP-25.md.'
 f.write_text(t[:start]+note+t[end:],encoding='utf-8')
print('Selected paw direction and functional layout draft recorded for approval')
