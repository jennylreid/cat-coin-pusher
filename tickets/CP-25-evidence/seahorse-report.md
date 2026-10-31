# CP-25 Playable loop v1

**2026.10.29 UAT 2 / APK4 published**, numeric **20261029070249**. Backup, package and fresh cloud hash verified. Jenny approved Water's painting and requested clam and kelp as future prizes/outlines. Jenny then selected “Include seahorse now”; its future outline is included. **Cheese painting now ready for approval; not integrated.**

## Water published

- Approved sunlit underwater cove replaces the Water grid. Tuna/shrimp use their frozen sprites and matching derived outlines; sardine/crab remain future outlines. Added **clam on the sand, kelp beside the reef and seahorse in the right open water**, outline-only. No new board prizes or full prize artwork. All seven slots fit above the fixed bottom satchel; dragging tuna/shrimp into their matching outlines fills them in place.
- Water completion still requires only tuna + shrimp and pays 100 coins once. New future slots do not block it. Previously placed items and paid collections remain valid.
- Chosen Scene wakes up payoff runs across the illustration: ripples/bubbles, fanfare, coin-to-purse arc, then the approved cat dance on return. Approved tile and pickup overlay/sound remain from prior UAT.
- [Phone-size Water](seahorse/water-phone.png), [inline Water](seahorse/water-inline.png), [placed items](seahorse/water-filled-phone.png), [payoff](seahorse/water-payoff-phone.png), [updated layout lock](seahorse/layout-lock.json). The approved background was reused without repainting; new outlines fit its existing space.

## Validation and phone UAT

[Water checks](seahorse/checks.json): slot bounds; actual drag placement/consumption; wrong drags and future slots reject; current obtainable items still complete the collection; reward pays once; save/reopen retains placements and balance. [Package verification](seahorse/package-verification.json): Only HTML changed from UAT1 to add the seahorse outline and slot; all other package fields retained; unapproved Cheese painting absent.

On phone, open Water, drag owned tuna/shrimp into their outlines, check completion animation and return reaction. Existing paid collections remain paid and cannot replay their payout. Phone receipt, sound/touch feel, Android lifecycle and device FPS remain Jenny's UAT.

## Cheese — next art piece, approval only

Actual-game layout locked before painting: cheese on the left counter, toy mouse on the lower-right floor; fixed frame/tabs/bottom satchel. [Layout lock](cheese/layout-lock.json), [real-game template](cheese/cheese-layout-phone.png), [painting template](../../work/cp25/cheese/art/layout-template.png).

One new background: warm window light, cream tiles, honey wood, teal cupboards and brass handles. No prize art generated. Original cheese sprite is shown as-is in the placed preview; toy mouse remains an outline. [Phone-size Cheese](cheese/cheese-art-phone.png), [inline still](cheese/cheese-art-inline.png), [placed preview](cheese/cheese-filled-phone.png).

Generated with built-in imagegen; [exact prompt](../../work/cp25/cheese/art/prompt.txt); [saved painting](../../work/cp25/cheese/art/cheese-scene-v1.png). Original generated file preserved. Preview renderer `work/cp25/cheese/preview.cjs` is outside the update payload. Waiting for Cheese OK before integration, as the brief requires: “Show each piece as a phone-size still and wait for Jenny's OK before building it into the game.”

## Publication and close-out

Baseline Oct29 UAT1. Source `work/cp25/seahorse/release.html`; builder `build.py`. Backup `uat/backups/before-CP-25-seahorse-20261029070249`. [Publication](seahorse/publication.json), [cloud verification](seahorse/cloud-verification.json). JSON SHA-256 `9a5ce7ba0ee3e86fdd5bea02fd1ac71060c6a8dbfa683f0f7a9d25536d31d29d`; same OneDrive item/link, revision37. Game-only update retains APK4.

[Water UAT1 report](water-report.md) records the approved background integration. [Earlier report](scene-one-report.md) covers payoff/tile validation and links the earlier loop/overlay evidence. Commit/push close-out follows Jenny's ticket sign-off. CODEX_BRIEF.md remains reserved while the separate CP-22 promotion report is absent. This report is the current UAT checkpoint. Production is outside scope.
