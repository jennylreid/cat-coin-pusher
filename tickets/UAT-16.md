# UAT-16 — Board 3 towers: reopened preview

Status: tower rework published to **2026.10.16 UAT 6 / APK4**, numeric **20261016235419**, on Jenny's instruction “sent this to uat”. Phone UAT pending. Earlier release report: [UAT 5](UAT-16-evidence/uat5-report.md).

## Baseline and scope
Published UAT 5 was pinned before editing. Baseline: `work/uat16-rework/baseline.html`; draft: `work/uat16-rework/draft.html`; matching published source: `work/uat16-rework/release.html`. Approved Tuna remains byte-for-byte identical. Budget stays **140 coins**, timer **110 seconds**. Game-only UAT 6 publication retains APK4. Verified pre-publication backup: `uat/backups/before-UAT-16-rework-20261016235419`. Only the preview's build label changed for release; other payload assets were retained. Fresh OneDrive download matched staged SHA-256 `b518a00ffe6b5e202703e03bb0acb86fa82d881663a759709f9be4e8339d05c9` (HTTP 200, original shared item retained). See `UAT-16-evidence/rework/publication.json` and `cloud-verification.json`.

## What changed
- Two real **48- and 36-coin towers** replace the low clusters as the main showpieces. Published Board 3's tallest tower was 14 coins. The towers stand in separated lanes with exposed bases and coin edges; the camera, coin thickness, art and table geometry are unchanged. A low 4/10/4 stepped group supplies contrast.
- The smaller rear stacks retain their original x=92/126/160 row at depth 365. The rear-centre space at x=200 remains available for the later Quake coin; none is implemented.
- Ordinary pushes destabilize the towers earlier. They visibly lean to about **48°** before breaking apart, rather than breaking at 14°. The captured 48- and 36-coin towers lean for about **0.52 and 0.47 seconds** before release.
- Loose coins inherit damped motion from the rotating column, with independent small tilts/spins and sideways scatter so the cascade spreads across the felt. One second after release, the two groups span about **164 and 88 board units horizontally**, with 36 and 30 coins respectively still on the board. These are real Rapier bodies, not a drawn cascade animation.
- Cascades reuse the existing coin-spill clatter. No sound assets were replaced. Boards 1 and 2 retain their original breakup routine.

## Preview evidence
[400 × 889 start screenshot](UAT-16-evidence/rework/board3-start.png) · [8-second topple clip with cascade clatter](UAT-16-evidence/rework/board3-toppling.mp4).

The clip shows normal target-following drops, no powers, at actual speed from game seconds 13–21. Tall towers release at approximately 14.50 and 14.87 seconds. It uses the actual game renderer and physics; existing cascade recordings are mixed at logged in-game playback times. It is a desktop preview, not phone audio/video. See `UAT-16-evidence/rework/capture-events.json` and `toppling.json`.

## Balance after the stack change
Same no-power bot as the earlier release: follow a remaining treat, change target every 12 drops. No allowance or timer rebalance.

| Tap cadence | Board 2 reference | Published Board 3 UAT 5 | Revised Board 3 |
|---|---|---|---|
| 0.4 seconds | 101/160 used; 59 left (36.9%) | 103/140 used; 37 left (26.4%) | **126/140 used; 14 left (10%)** |
| 0.22 seconds | 113/160 used; 47 left (29.4%) | 124/140 used; 16 left (11.4%) | **140/140 used; 0 left** |

Both revised runs win: 50.13 seconds at the slower cadence, 31.32 seconds at the faster cadence. **Rapid tapping now wins on its final coin; the new stacks materially tighten the margin.** These demonstrate viable strategies, not guaranteed wins for every style. Machine results and the runner are beside the draft; copied results are in `UAT-16-evidence/rework/balance.json`.

## Pending phone UAT
Preview publication is approved; phone UAT is pending for tower height/readability, the lean/cascade and clatter, and the tighter margins. Tuna's previous art approval is retained. Device feel and FPS need phone evidence. Production is outside this rework and has not been changed.
