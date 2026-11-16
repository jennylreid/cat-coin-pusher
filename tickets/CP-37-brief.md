# CP-37 Coins vanish under the cat's face; flicker

Name this conversation "CP-37 Coins vanish under the cat". Work in C:\Users\jenny\OneDrive\work\CoinPusher. Follow AGENTS.md. Read CODEX_BRIEF.md and the "Locked layout (CP-21)" section of SPEC.md first. You are the engineer, and Claude PM reviews your report.

**Why:** Jenny, Nov 12, on UAT 37: "The main problem is coins disappearing under the cat's face. It's really bad." Also: "There's still a lot of flickering. When the board is filled with coins, they just flicker and disappear behind other coins." It's most visible on the busy Wild board, but check every board.

## Two phases (another engineer is building at the same time)
The CP-38 engineer (Wild 2 prototype) is building on UAT 37 and editing the same source right now.

**Phase 1, now: investigate only.** Don't publish and don't edit the shared build sources (`work/cp37/`, or `work/cp38/` once it exists).
1. Reproduce both problems on a desktop run of UAT 37: the Wild board and Board 3, full board, hold to drop. Capture frames showing coins vanishing under the cat's face and the flicker.
2. Find the cause of each, with evidence. For example: coins pushed back under the cat or chin art and drawn behind it; coins tunnelling through the back wall or the pusher; or a draw-order sort that swaps coins frame to frame (depth ties, sorting on a value that changes).
3. Prepare the fix as a patch or script in `work/cp37-bug/` that can be applied to whatever source is current, and test it on a copy of UAT 37. After the fix:
   - no coin can end up hidden under the cat or chin art, or else it's visibly handled, for example pushed back out;
   - no coin flickers on a full board;
   - coin physics, board balance, the pusher's travel and the approved art stay unchanged.
4. Write the findings at the top of `tickets/CP-37.md` and message the PM (session `local_c33de928-2fcf-4e87-9b03-fae33ff1496d`). Then wait.

**Phase 2, after the PM says CP-38 has published:** apply the fix on top of the newest UAT so all boards get it, including Wild and Wild 2. Re-test, then publish to UAT: back up first, name it "2026.11.xx UAT n" with the version strictly increasing, and verify a fresh cloud download.

## Done when, with evidence
1. Before-and-after frames on a full board: coins near the cat's face stay visible or are prevented from going there.
2. A scripted hold-to-drop run (60 s, Wild and Board 3) counting coins hidden behind the cat art: before, N; after, 0.
3. Flicker: before and after, using a per-frame draw-order stability check or a short clip.
4. Boards 1–3 coin counts and payout within normal noise of UAT 37 on the same seeds.
5. Desktop frame cost not worse.

## Don't touch
- The locked layout and approved art; the pusher's look (a separate ticket covers that later).
- CP-38's Wild 2 work, the dance break, music and the pickup effect.
- Production: `phone/`, `backups/`, `CatCoinPusher.apk`. UAT only.

## Report
At the top of `tickets/CP-37.md`: the cause, the fix, the evidence, limits and a short "what to try" list. Feedback and files go through the PM. Close-out after Jenny's sign-off: commit and push to C:\Users\jenny\GitHub\cat-coin-pusher naming CP-37. Never commit `Screenshots/ibear-*`, `Screenshots/ref-*`, `ref-other-pusher-*` or anything the .gitignore excludes.
