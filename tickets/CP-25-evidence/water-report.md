# CP-25 Playable loop v1

**2026.10.29 UAT 1 / APK4 published**, numeric **20261029064437**. Backup, package and fresh cloud hash verified. Jenny approved Water's painting and requested clam and kelp as future prizes/outlines. Seahorse remains an optional idea pending her choice. **Cheese painting now ready for approval; not integrated.**

## Water published

- Approved sunlit underwater cove replaces the Water grid. Tuna/shrimp use their frozen sprites and matching derived outlines; sardine/crab remain future outlines. Added **clam on the sand and kelp beside the reef**, outline-only. No new board prizes or full prize artwork. All six slots fit above the fixed bottom satchel; dragging tuna/shrimp into their matching outlines fills them in place.
- Water completion still requires only tuna + shrimp and pays 100 coins once. New future slots do not block it. Previously placed items and paid collections remain valid.
- Chosen Scene wakes up payoff runs across the illustration: ripples/bubbles, fanfare, coin-to-purse arc, then the approved cat dance on return. Approved tile and pickup overlay/sound remain from prior UAT.
- [Phone-size Water](water/water-phone.png), [inline Water](water/water-inline.png), [placed items](water/water-filled-phone.png), [payoff](water/water-payoff-phone.png), [updated layout lock](water/layout-lock.json). The approved background was reused without repainting; new outlines fit its existing space.

## Validation and phone UAT

[Water checks](water/checks.json): slot bounds; actual drag placement/consumption; wrong drags and future slots reject; current obtainable items still complete the collection; reward pays once; save/reopen retains placements and balance. [Package verification](water/package-verification.json): HTML plus approved Water image and two derived contours are the only changed files; all other package fields retained; unapproved Cheese painting absent.

On phone, open Water, drag owned tuna/shrimp into their outlines, check completion animation and return reaction. Existing paid collections remain paid and cannot replay their payout. Phone receipt, sound/touch feel, Android lifecycle and device FPS remain Jenny's UAT.

## Cheese — next art piece, approval only

Actual-game layout locked before painting: cheese on the left counter, toy mouse on the lower-right floor; fixed frame/tabs/bottom satchel. [Layout lock](cheese/layout-lock.json), [real-game template](cheese/cheese-layout-phone.png), [painting template](../../work/cp25/cheese/art/layout-template.png).

One new background: warm window light, cream tiles, honey wood, teal cupboards and brass handles. No prize art generated. Original cheese sprite is shown as-is in the placed preview; toy mouse remains an outline. [Phone-size Cheese](cheese/cheese-art-phone.png), [inline still](cheese/cheese-art-inline.png), [placed preview](cheese/cheese-filled-phone.png).

Generated with built-in imagegen; [exact prompt](../../work/cp25/cheese/art/prompt.txt); [saved painting](../../work/cp25/cheese/art/cheese-scene-v1.png). Original generated file preserved. Preview renderer `work/cp25/cheese/preview.cjs` is outside the update payload. Waiting for Cheese OK before integration, as the brief requires: “Show each piece as a phone-size still and wait for Jenny's OK before building it into the game.”

## Publication and close-out

Baseline UAT6 (Oct 28). Source `work/cp25/water/release.html`; builder `build.py`. Backup `uat/backups/before-CP-25-water-20261029064437`. [Publication](water/publication.json), [cloud verification](water/cloud-verification.json). JSON SHA-256 `db710c3e0ea6d71a72311cd46ce570fad04976022beaabdb2f5639dad1a98a3b`; same OneDrive item/link, revision36. Game-only update retains APK4.

[Previous report](scene-one-report.md) covers payoff/tile validation and links the earlier loop/overlay evidence. Commit/push close-out follows Jenny's ticket sign-off. CODEX_BRIEF.md remains reserved while the separate CP-22 promotion report is absent. This report is the current UAT checkpoint. Production is outside scope.
