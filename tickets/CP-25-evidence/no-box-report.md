# CP-25 Playable loop v1

**2026.10.29 UAT 4 / APK4 published**, numeric **20261029074121**. Backup/package/fresh cloud hash verified. Jenny approved the kitchen painting and renamed the collection **Kitchen**. Both scene backgrounds are now integrated; phone UAT/sign-off pending.

## Kitchen and drag feedback published

- Removed the square destination highlight while dragging in both Water and Kitchen, as requested. The item outline, drag ghost and matching hitbox remain.

- Kitchen replaces the former Cheese collection name in tabs and completion feedback. Contains **cheese** (obtainable now, counter slot) and **toy mouse** (future outline, floor slot).
- Approved warm kitchen painting integrated exactly as previewed. Frozen cheese art reused; its outline is derived from the original sprite. No new prize art generated.
- Dragging cheese to the counter pays 50 coins once; future mouse does not block. Existing placed cheese and paid collection flags remain valid. Internal `cheese` collection/save ID is retained for continuity; user-facing name is Kitchen.
- The chosen Scene wakes up payoff now uses the approved kitchen background: warm glow, existing fanfare, coin-to-purse arc and approved cat dance on return.
- Water retains tuna, shrimp and future outlines sardine, crab, clam, kelp and seahorse.

## Future Kitchen ideas — proposals only

- **Milk bottle:** a familiar cat-themed collectible with a strong bottle outline.
- **Sardine tin:** pantry treat, visually distinct from the loose fish in Water.
- **Oven mitt:** clear kitchen silhouette and a playful echo of the cat's mitts.
- **Wooden spoon:** naturally belongs beside the countertop utensils.
- **Fish-shaped biscuit:** a small kitchen treat with a readable outline.

Suggested next three: milk bottle, sardine tin, oven mitt. No proposed item has been added; Jenny chooses.

## Validation and evidence

[Kitchen checks](no-box/checks.json): correct tab/name; approved scene rendering; real cheese drag consumes one and pays 50 once; future mouse stays outline; saved completion and purse persist; return dance starts. [Phone-size Kitchen](no-box/kitchen-phone.png), [inline](no-box/kitchen-inline.png), [payoff](no-box/kitchen-payoff-phone.png). The approved [layout lock](cheese/layout-lock.json), [painting prompt](../../work/cp25/cheese/art/prompt.txt) and built-in imagegen source painting remain preserved.

Try Kitchen on the phone: drag owned cheese to the counter, watch the reward/glow, then return to the cat. Previously paid collections remain paid; they do not replay rewards. Phone receipt, sound/touch feel, Android lifecycle and FPS remain Jenny's UAT.

## Publication and close-out

Baseline Oct29 UAT3. Source `work/cp25/no-box/release.html`; builder `prepare.py`. Backup `uat/backups/before-CP-25-no-box-20261029074121`. [Package verification](no-box/package-verification.json), [publication](no-box/publication.json), [cloud verification](no-box/cloud-verification.json). Only HTML changed to remove the two hover rectangles; approved assets retained. JSON SHA-256 `1a9dacb5016ddb864654adbd737e605edd833f8acacd37ed3e6c4925268464cf`; same OneDrive item/link. Game-only update retains APK4.

[Kitchen integration report](kitchen-report.md) and [previous report](seahorse-report.md) links Water, tile, payoff and earlier loop evidence. Ticket remains open for phone UAT and Jenny's sign-off; commit/push close-out follows sign-off. CODEX_BRIEF.md remains reserved by the separate CP-22 promotion instruction. This report is the current UAT checkpoint. Production is outside scope.
