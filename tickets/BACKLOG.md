# Coin Pusher backlog

**Board: [CoinPusher Board](https://claude.ai/artifact/87PWboyrFs32sN59xaJMXm)** holds every ticket's status and order
(the board wins over this file). This file keeps the details; Codex's reports stay in `tickets\<ID>.md`.

**Ticket IDs (Jenny, Oct 17):** game changes are **CP-xx**, starting at CP-21 (like FinTracker's FT-xx). Tickets up to
UAT-20 keep their UAT- numbers so reports, briefs and chats still match. Housekeeping stays OPS-xx.
**Production is a state, not a ticket:** a signed-off ticket itself moves Ready for production → Testing in production
→ Done. Never a PROD ticket, even for a batch: batched tickets move together (Jenny, Oct 17). PROD-01..04 are history.

Kept by Claude (PM). One ticket is with Codex at a time. When Codex reports a ticket done and published, Jenny sends
the next ticket from **Ready**, and Claude reviews the finished report (`tickets\<ID>.md`) in parallel. Review fixes
jump the queue.

## In progress

- **UAT-09** (bug fix): **published** to UAT 20261012220659 (Oct 12, 10:06 PM, after Jenny approved the preview).
  - Claude's review: the cause was found (expensive per-coin drawing every frame, plus blurry sparkle gradients);
    desktop draw cost is down about 84%.
  - The front rail is open in the middle, so coins tip over in view. The blurry blobs are gone, and the sparkle
    is crisper but subtler.
  - No physics, balance or art-file changes.
  - **Jenny's Pixel check, Oct 13: "seems better"**: 120 fps again, and coins hang over the open front edge.
    Screenshot: `Screenshots\uat09-phone-120fps.webp`. UAT-09 is done.
- **UAT-08: moved to a fresh Codex conversation** (Oct 13). The old long Codex chat is wrapped up (it updates
  SESSION_HANDOFF.md, then closes); no UAT-08 work had started there. It has two additions: keep UAT-09's fixes, and
  no drop from 120 fps. Review conversation: "UAT-08 Timing-based coin landing". Waiting for Codex's report in
  `tickets\UAT-08.md`.
- **From now on: one Codex conversation per ticket**, started with the standard starter (rename the conversation to "<ID> <Title>"; read SESSION_HANDOFF.md,
  CODEX_BRIEF.md, TEAM_PROCESS.md; keep production and UAT separate; report in tickets\<ID>.md) plus the ticket.
- **PROD-02: published** to production 20261013160516 / APK 14 (Oct 13, 4:05 PM). It is a copy of approved UAT
  20261012220659. Waiting for Jenny's phone check. Claude's review (`tickets\PROD-02.md`):
  - Same files as that UAT build. The only differences are in the HTML, listed in `PROD-02-adaptations.json`:
    production name and save keys, plus the Developer mode gates. No UAT-08 work.
  - Production keeps its own identity, saves and APK 14 (not reinstalled). UAT is unchanged. Backup:
    `backups\before-PROD-02-20261013160516\`.
  - Board tests match UAT-09's: spends 86/113 and 119/127, Quake 15/45 and 12/51.
  - Like before, the powers and the Happy preview stay Developer-only in production; board clear shows Rest.
  - Not checked yet (only Jenny's phone can show these): 120 fps, the update offer, saves kept, and same play and
    looks. The report's screenshots are desktop renders, not phone captures.
  - **Jenny's check:** after OneDrive syncs, open Cat Coin Pusher and accept the update (or use Settings → Check
    for updates). Confirm build 20261013160516, saves and settings kept, and 120 fps on a full board.
- **UAT-08 can go now** in its own Codex chat; PROD-02 is published.
- **UAT-05: done.** Jenny accepted the comet-sparkle revision ("it's fine now", Oct 12). History below. The **art
  freeze** is on: focus on gameplay.
  - First A/B renders: the brass pusher and coins inside the rails look good in both.
  - A (sliding dropper) is clear, but there's a short delay while it slides, and the dropper is small.
  - B (fall with sparkles) was drawn behind the cat's head, so most of the fall was hidden.
  - Claude leaned A. **Jenny picked B, with the coin falling in front of the cat** (the whole fall visible; passing
    over the face briefly is fine). Codex stalled once on a connection drop (resumed).
  - The sparkle wasn't right either (two tiny pale crosses that read as a dotted line). Jenny chose a **glittery
    trail**: a short tail of gold sparkle dust behind the falling coin, fading out, in the background stars' warm gold
    and white. The combined revision prompt was handed over.
  - **Animation at 8:30 PM:** the coin falls in front of the cat; the glitter is faint at small size.
  - **Jenny's revision before publishing:** remove the target circle and dotted line; the sparkle should run through
    the whole fall, like a comet or Tinker Bell (a bright, twinkling gold and white trail that drifts and fades),
    clearly visible at phone size. The timing-based landing became UAT-08.
  - Lesson: UAT-05 was too big (three jobs in one); split tickets like this in future.

### UAT-07: Refine the Happy face (now Done; kept here for reference)

> **UAT-07: Refine the Happy face**
> **Goal:** Happy has the right vibe but needs polish:
> - The paws are plain white circles that look unfinished and cover the whiskers. Use the same mitt art as Rest,
>   with the claws tucked away, and lower the paws so they rest on the board's back edge.
> - Mouth: start from the Rest (Sweet) face's mouth, same shape and same tongue, and just lower the bottom lip so
>   it opens a little more. This replaces the current dark red mouth.
>
> **Don't touch:** The closed golden eyes, the head outline and markings, the other faces and poses, gameplay. Happy
> stays preview-only for now.
>
> **Done when:**
> 1. The paws match Rest's mitts (no claws), sit lower, and leave the whiskers and face clear.
> 2. The mouth is Rest's mouth with only the bottom lip lowered: same tongue, and it reads happy.
> 3. You show me Happy next to Rest at phone size and wait for my OK before publishing. Report filed in
>    `tickets\UAT-07.md`.

## Ready (in order)

### UAT-12: Make Board 1 easy (ready; serve after UAT-11)

Jenny, Oct 13: "We want it easy so new players can just get their feet wet." Since UAT-08, the fast-tap bot wins
Board 1 with 0 of 140 coins to spare.

> **UAT-12: Make Board 1 easy**
> **Goal:** Board 1 is the first board new players meet, so it should be easy: a gentle place to get their feet wet.
> Right now a fast tapper can just barely win with zero coins to spare. Make it comfortably winnable however someone
> taps.
> **Don't touch:** Board 2, the look, powers.
> **Done when:** the test bot wins Board 1 with plenty of coins to spare at both tap speeds. Report the numbers.

### UAT-08 reopened (failed UAT; served Oct 15; ticket in tickets\UAT-08-rework-ticket.md)

Jenny's phone check of UAT-08, Oct 15: coins ALWAYS touch the ledge, and hit the back rail every time. Goal: ledge
retracted = table; extended = ledge; never the back rail. Codex shows motion and waits for OK; report in
tickets\UAT-08-rework.md. (A UAT-14 number was briefly used and dropped: a failed UAT check reopens the same ticket.)

Sizes (TEAM_PROCESS.md): S ≈ an hour, M ≈ a few hours, L ≈ most of a day; bigger than L, split it.

### PROD-04 [M]: Promote UAT-15, OPS-02 (in production as 2026.10.16 / APK16; waiting on Jenny's phone check)

Production app install needed once. The first app (2026.10.15.2 / APK15) wouldn't open (incomplete build); hotfixed as
2026.10.16 / APK16. Report: tickets\PROD-04.md.

### UAT-20 [L]: Secret paw combo, show the toe beans (up next, before UAT-16; Codex; brief in tickets\UAT-20-brief.md)

From Jenny, Oct 16. While the cat rests, tap left, right, left, right: both paws rise and show the pink toe beans. New
pads art by Codex, shown for Jenny's OK first. Single taps still tickle. Starts after UAT-19's session finishes.

### UAT-19 [L]: Tickle the paws (in UAT as 2026.10.16 UAT 2; Claude engineer; brief in tickets\UAT-19-brief.md)

From Jenny / UAT (UAT-17's dance wasn't a tickle). Tickle fight picked: a tap flinches the paw with a squint, "hehe!"
and a chirp; three quick tickles and the other paw swats twice with a mrrp. Also removes the dance's paw trigger and
adds a Developer-mode "Preview Dancing pose" in Settings. Waiting on Jenny's phone check (feel, sounds).

### UAT-17 [L]: Dancing pose (in UAT; renamed from "Tickle the paws" Oct 16; brief in tickets\UAT-17-brief.md)

Sized M, grew to L over 10 revisions with music. A cute dance with Let's Dance drums (glance, head bop, paw pumps,
shimmy, hops). Passed UAT as a paw-tap dance, then Jenny moved it off the paws: kept on file like Happy, previewed in
Settings (Developer mode); done in UAT-19's build. Where to use it: idea card on the board.

### OPS-02 [M]: Readable build names (in production via PROD-04)

Same scheme as FinTracker: production releases named by date (2026.10.15, .2), UAT builds "2026.10.15 UAT n"; the
hidden number the updater compares stays.

### UAT-18 [M]: Quake coin (up next after UAT-16; brief in tickets\UAT-18-brief.md)

Split from UAT-16, Oct 16 (Jenny OK'd). **Goal:** a Quake coin with a lightning bolt on Board 3 that stands out among
the gold; getting it into the tray earns 1 Quake the player can see and use (first power a normal player earns).
**Don't touch:** Board 3's stacks and balance, the CatQuake effect, Developer test tools.
**Done when:** it stands out; collecting shows 1 Quake; using it quakes the board; Board 3 still wins without powers.

### UAT-16 [L]: Board 3, coin stacks and Tuna (up next; brief in tickets\UAT-16-brief.md)

Split Oct 16: the Quake coin moved to UAT-18. The entry below is the original, combined version.

**Goal:** a fun third board: watching coin stacks topple when pushed, and finding a new coin (Jenny, Oct 15). Starts
with intricate stacks; one Quake coin with a lightning bolt that stands out among the gold; getting it into the tray
earns 1 Quake power to use. New treat Tuna clears the board. A bit harder than Board 2.
**Don't touch:** Boards 1 and 2, the cat, layout, existing art and sounds.
**Done when:** stacks topple satisfyingly; the Quake coin stands out; collecting it gives a usable Quake; Board 3 wins
without powers, tighter than Board 2.

### UAT-15 [L]: Automatic game updates (in production via PROD-04; brief in tickets\UAT-15-brief.md)

**Goal:** opening the app offers a newly published build by itself. Today OneDrive on Android serves a stale copy of
the update file until Jenny refreshes it in OneDrive or re-picks it, so nothing is offered (UAT and production alike).
Getting PROD-03 onto production showed many update screens in a row: one build should mean one offer. The ↻ button
moves behind Developer mode; Settings > Check for updates stays.
**Don't touch:** gameplay, art, saves, settings; which file each app reads.
**Done when:** a new UAT build is offered on opening without visiting OneDrive (also after a restart); one offer only;
↻ hidden unless Developer mode; saves survive any reinstall.

### UAT-14 [S]: Keep the screen awake while playing (backlog, Oct 15)

**Goal:** the phone shouldn't fall asleep while the game is open and being played (Jenny, Oct 15: "game should
prevent that").
**Don't touch:** gameplay, art, saves; the phone's normal sleep once the player leaves the game.
**Done when:** the screen stays on through a long board and between boards with the game in front; leaving the game
lets the phone sleep as usual.
**Notes:** may need a new app install rather than a game update; the engineer says which before building. Open: should
the screen sleep after a long idle spell (e.g. 5 minutes with no taps) to save battery?

### UAT-13: Keep messages off the cat's face (ready; full ticket in tickets\UAT-13-ticket.md)

Jenny, Oct 15: "Board Clear!" looks great but covers the cat's face; put it lower, over the table. "Shrimp cleared" and
"Cheese cleared" are good but float up onto the face; stop them short.

### Gameplay planning: Jenny's session tomorrow morning (Oct 14)

Open questions: boards vs. timer, the power meters (which coins and prizes fill Catquake, Paw Sweep and Wild Cat),
the prizes and gutters details.

### Promotion naming (proposal, Oct 13; Jenny's decision pending)

Naming promotions after the newest UAT ticket breaks when cherry-picking (Jenny). Proposal:
- (A) titles list their contents, e.g. "PROD-03: UAT-08, UAT-11, UAT-12";
- (B) a "Live in production" checklist at the top of this backlog.

Note: UAT-08 is NOT in production. PROD-02 carried UAT build 20261012220659 (through UAT-09); UAT-08 was published
after it.

### UAT-11: Back out UAT-10 (served to Codex Oct 13 via a codex:// link; publishes directly, no preview)

Jenny on her phone: UAT-10 "a bit warped". The art and the coins are stretched sideways at the back, and the Rest paws
now sit over the board's top corners (`Screenshots\uat10-board-clear-rest.webp`). UAT goes back to the UAT-08 build
20261013164950. **A proper wider table** (real art, round coins, Rest paws adjusted) is parked for the art pass.

### UAT-10: Wider table at the back (published to UAT 20261013170210, Oct 13; being backed out by UAT-11)

Claude's review:
- The back is about 33% wider; head, paws and physics are unchanged; the coins and ledge stay contained.
- It's a **visual widening only** (the art is warped and coin drawing matches; the physics world is unchanged).
- Desktop drawing cost is about 16% higher; the phone 120 fps check is pending.

**UAT-08 balance flag:** Board 1 at the 0.22 s cadence now spends 140/140 (it was 113) with zero spare; at 0.4 s it's
109/140 (it was 86). Board 2 still has slack. This is Jenny's call: fine if Board 1 should be tight, or a tuning ticket.

Waiting on Jenny's phone check: the wider back, 120 fps, coins sometimes landing on the table (UAT-08).

Jenny, Oct 13: "still want wider table at top of screen." (Her other problem, "every coin hits the ledge", is UAT-08's
goal: check it in UAT-08's review.)

> **UAT-10: Wider table at the back**
> **Goal:** The back of the table (top of the screen) is too narrow; make it noticeably wider, so the board feels
> roomier where coins land.
> **Don't touch:** The cat's head and its full visibility, the paws, the brass ledge's look, the 120 fps.
> **Done when:** the back is clearly wider on my phone, the coins and ledge still fit inside the rails, and both boards
> still win without powers (report test numbers). Show me before/after and wait for my OK before publishing.

### OPS-01: done (Oct 13, 2m 11s)

- CODEX_BRIEF.md went from 241 lines to 24; the original is archived verbatim in CODEX_BRIEF_ARCHIVE-2026-10-13.md.
- New AGENTS.md (26 lines).
- First ticket started by the PM (in a terminal tab, as a test).

**New hand-off from here on:** the PM writes tickets\<ID>-ticket.md and opens a codex://new link that prefills a new
chat in Jenny's Codex app. Jenny presses Enter to sign off. See TEAM_PROCESS.md.

### PROD-02: Promote UAT build 20261012220659 to production (published Oct 13; phone check pending; kept for reference)

> **PROD-02: Promote UAT build 20261012220659 to production**
> **Goal:** Production should match the published UAT build 20261012220659: the new Waiting grin, the Rest and Happy
> poses, the UAT-03 layout, the brass pusher with coins inside the rails, the comet-sparkle coin fall, and the UAT-09
> performance and front-edge fixes. I've signed off on all of these.
>
> **Don't include:** Any UAT-08 work, or anything published to UAT after 20261012220659. UAT-only testing tools stay
> behind Developer mode.
>
> **Done when:**
> 1. Production plays the same as that UAT build on my phone, at 120 fps.
> 2. Production keeps its own name, app identity, saves and signing key, and offers the update itself.
> 3. Board test results match the UAT build's.
> 4. Backup first; report in `tickets\PROD-02.md`.

### UAT-09 (bug fix, jumps the queue): performance, front edge, sparkle blur

Found by Jenny on her Pixel, Oct 12, in published UAT 20261012204534 (UAT-05). Screenshot:
`Screenshots\uat05-published-26fps-front-rail.webp`.
- **26 fps** (earlier builds ran at 120); the sparkle is the likely cause.
- **Coins slide under the front wooden rail** instead of tipping off an open front edge.
- **Blurry white blobs** near the back distort the coins.

Jenny also asked whether the upper table should be wider. Claude's view: maybe, but wait until after UAT-08, since
the crowding at the back comes from the fixed landing line; widening is a perspective/art change. Her decision is
pending. The ticket text was given to Jenny in chat.

### UAT-08: Timing-based coin landing (with Codex since Oct 13)

Jenny's idea, Oct 12, after seeing UAT-05's animation. Comes after UAT-05 is published (UAT-05 now removes the aim
markers).

> **UAT-08: Timing-based coin landing**
> **Goal:** Make dropping coins feel like a real two-tier coin pusher:
> - My tap only chooses left/right. Every coin falls onto the same fixed line across the board, a little behind the
>   ledge's front edge when the ledge is fully extended.
> - If the ledge is extended when the coin lands, the coin lands on top of it and rides along. When the ledge pulls
>   back, coins on it get pushed off its front edge onto the table. If the ledge is pulled back, the coin lands on
>   the table.
> - Good timing should be something a player can learn and use.
>
> **Don't touch:** The cat, faces and poses, the sparkle fall, the brass ledge's look, the layout, and the UAT-09
> performance and front-edge fixes.
>
> **Done when:**
> 1. Each tap still drops a coin immediately, at the tapped left/right position.
> 2. Coins that land on the ledge ride it and fall off onto the table when it pulls back.
> 3. It still runs smoothly (no drop from 120 fps on my phone).
> 4. Both boards can still be won without powers. Report the new test numbers next to the old ones and explain any
>    change.
> 5. Show me the motion at phone size and wait for my OK before publishing. Report in `tickets\UAT-08.md`.

### UAT-05: Brass pusher, coins inside the table, better coin drops (in progress)

> **UAT-05: Brass pusher, coins inside the table, better coin drops**
> **Goal:** The board should look like a real coin pusher:
> - **Coins inside the rails.** The table looks like a pool table with raised rails, but coins can appear on top of
>   the rails. They should stay inside, pushed up against the rails.
> - **A brass pusher on the felt.** The pusher floats in the air and its pink colour looks random. Make it brass/gold
>   metal, sliding flush on the felt out of a slot at the back.
> - **Normal coin drops.** The gold band where coins come out doesn't make sense. Build two versions for me to compare:
>   (A) a small brass dropper that slides along the back to the tapped lane and drops the coin, and (B) the coin
>   simply falls from the top with a sparkle trail.
>
> **Don't touch:** The cat, faces, paws and poses, the layout from UAT-03, gameplay balance (or tell me what changed
> and why).
>
> **Done when:**
> 1. In no frame does a coin sit on top of a rail.
> 2. The pusher is brass and reads as part of the table.
> 3. Aiming is at least as clear as now in both A and B.
> 4. Test results are unchanged from SPEC.md, or you explain the difference.
> 5. You show me phone-sized A vs. B side by side and wait for my pick before publishing to UAT. File the report in
>    `tickets\UAT-05.md`.

## To draft

- **Sidekicks for special drops** (needs new art; after the special coins are decided): when a special coin drops, a
  helper brings it in: a little bird flies down, a mouse nudges it in, or the cat blows it onto the board. The mitts
  are too big for batting. The cat's eyes follow the sidekick (it already tracks every tap).
- **Teeth for Quake and Wild Cat** (art): follow the art style rule below (angular, like the claws); many teeth in big
  moods; uneven teeth only in Wild Cat; no buck teeth. Lessons from UAT-06: start from approved art, describe the look
  rather than exact geometry, and expect the image tool to overshoot words.

## Design in progress

- **Character (Jenny, Oct 12):** cats are sweet and soft, but also serious predators: "fuzzy bunnies with teeth and
  claws." Charm comes with a little wildness: overlapping, wonky teeth, not tidy ones. Like a real fluffy tuxedo cat
  at play, it gets a wild, even menacing look in its eye, then goes right back to sweet. The swing between the two
  (Wild Cat / Quake ↔ Rest) is the charm.
- **Art style rule (Jenny, Oct 12):** teeth and claws share one angular look: straight edges, pointed, faceted, no
  curved fangs.
- **North star (Jenny, Oct 12):** she loves Rest on board clear: "Sweet face with dainty giant mitts... much like a real
  cat." Use it as the reference pose: new moods and poses should feel as charming and cat-like as Rest.
- **Moods:** each mood = a face (eyes and teeth) + the power that triggers it + what it does to the board. Known so far:
  Sweet (Rest), Waiting (four chunky fangs), **Sharp Grin** (the old Waiting face, approved, use to be decided),
  Quake, Shower, Happy, and the new **Wild Cat**. Jenny is still working out which powers bring on which mood, and their
  outcomes.
- **Core gameplay** (Jenny's decisions, Oct 12):
  - **Coins:** mostly pretty gold coins. **No colour-match game.**
  - **The fun:** sounds and the cat's actions, with many payoffs, pleasing looks and pleasant sounds.
  - **Special coins:** extra-thick ones with rainbow, lightning, 10x and similar.
  - **Prizes:** random items (cheese, shrimp, anything) that enter the board, themeable (holiday themes, i.e. seasonal
    events / theme packs).
  - **Gutters like a bowling lane:** prizes can be lost off the sides (risk/reward).
    - Some prizes are board goals, and a replacement drops in if one is lost.
    - Others are bonus-only.
    - This replaces the current SPEC rule that a target can never become uncollectable.
  - **Powers:** **Catquake**, **Paw Sweep** and **Wild Cat**, earned through collection / charge meters (e.g. collect
    3 lightning → a Catquake).
  - **Energy:** prizes can also give energy ("ammo") for future mini-games.
  - **The reward loop:** prizes → meters → powers → more prizes (a feedback loop).
- **Inspiration:** wool/yarn untangle puzzles, colour-match snake shooters, hole games, Pixel Flow, Family Island
  (energy, rubies, gifts, completing boards, keys, tools that open sealed doors).
- **Ideas offered, not decided:**
  - a prize album with themed sets that pay out
  - special coins as triggers for cat moods and powers (lightning → Quake, rainbow → a mood, 10x → jackpot)
  - keys and gifts as rare prizes
  - growth through a board (a wider payout gap, a bigger stroke)
  - a hidden picture on the felt that clearing reveals
  - a map of sealed doors, maybe rooms of the cat's house
- **Open:**
  - Which prize or coin fills which meter?
  - Is the map / cat's house the right long-term goal?
  - Completable boards with a coin budget (Claude's recommendation), a timer, or both?

## Parked

- **Happy**: what it's used for in play is still undecided. The art polish is UAT-07.
- **Arms on paws elsewhere**: Jenny may want them removed in every pose, not just Rest.
- **Art pass notes (after the freeze):**
  - **Wider table at the back, done properly:** real table art drawn wider at the back, coins kept round, and the
    Rest paws repositioned. UAT-10's sideways stretch looked warped and was backed out.
  - **Revisit Happy (UAT-07), Jenny's note, Oct 12:**
    - The mouth looks weird: an extra curved line inside the tongue makes it read like a mouth within a mouth, and
      it never actually opens (Codex lengthened the outline instead). Close-up:
      `Screenshots\happy-mouth-uat07-weird.webp`.
    - The paws are too small compared with Rest's mitts.
    - Without claws, the mitts read like plain white ovals; consider toe lines.
    - Accepted for now; refine in the art pass.
- **Poised-to-pounce pose** (from the cancelled UAT-04): Jenny still likes the idea of the paws telling you a Quake is
  ready, but the attempt (a subtle lift-and-tilt, paws behind the coins, a menacing look) "doesn't look anything like
  what I'd hoped." If revisited, start from a mockup she approves before building.

## Done

- **UAT-07**: Happy face polish (Oct 12): Rest's mitts without claws on the board corners, and a Sweet-based mouth.
  Accepted for now as the last art ticket before the freeze. To revisit: the weird mouth and the small paws (see Art
  pass notes). UAT-06 was approved and published before it.

- **UAT-06**: new Waiting grin (Oct 12, six rounds). The final version is the Sharp Grin with four enlarged chunky
  fangs (the bottom middle two and the top two just outside them), redrawn with normal-weight outlines. Jenny: "good
  enough". The Sharp Grin is kept as its own approved face; the two look similar at phone size.
  - Rejected along the way: tidy rounded or square teeth (dentures), code-fitted rectangles (sugar cubes), curved
    fangs, and needle teeth.
  - Lessons: reuse approved art, describe the look rather than exact geometry, and let Codex choose the method.
  - Jenny found the art loop tedious and wants to get to gameplay.
- **UAT-04: cancelled** (Oct 12, never published). Jenny rejected the poised pose; Codex was asked to restore the
  working source to UAT-03's published build (20261012133717).
- **UAT-03**: Cat fully visible, Waiting paws restored, art cleanup. UAT 20261012133717. Jenny approved it Oct 12 ("I
  think it's good"). Codex shrank the whole scene rather than moving the table lower (smaller board and coins); Jenny
  is OK with it. The art is now 8 MB, lossless WebP.
- **UAT-02**: Rest pose: no arms, paws lower and angled in. UAT 20261012122558. Jenny approved it on the phone Oct 12
  ("paws look better"). The gold band under the chin is OK for now.
- **UAT-01**: Safe-area HUD and UAT app name. UAT 20261012113759 / APK 2.
- **PROD-01**: Safe-area fix cherry-picked to production 20261012120202 / APK 14. Jenny confirmed on her phone and
  signed off, Oct 13.
