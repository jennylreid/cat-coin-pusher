from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/stage3'
m=json.loads((p/'publication-manifest.json').read_text());cloud=json.loads((e/'cloud-verification.json').read_text());assert cloud['sha256']==m['stagedJSONSHA256']
report=f'''# CP-25 Playable loop v1

**Stage 3 overlay/sound published: {m['displayName']} / APK4**, numeric **{m['version']}**. Backup, local package and fresh cloud hash verified. Jenny's UAT 4 feedback: the loop works; screens need character. Overlay/sound phone UAT pending. **Tile art and completion payoff await Jenny's choice/OK.**

## Published first, as requested

- Treat overlay now draws **only the existing collected item**, fully opaque, over a translucent 28% dark backdrop. No overlay text, frame, opaque card, queue counter or extra artwork. The board remains visible beneath it.
- New short pickup sound: three soft rising sine notes, about **0.4 seconds**, played once when each item becomes visible. It replaces the former immediate treat sound, so queued items do not all chime at once. Mute/background handling retained. The game synthesizes it; [preview WAV](CP-25-evidence/stage3/item-collected.wav) is a mathematical render of the same notes/envelope/master level, not a separate shipped recording.
- Existing two-second timing, tap-away, one-at-a-time queue and zero-coin dismissal retained. Queued awards still finish before clear feedback/next-board advance. Current collection art, placement rules and payouts remain the UAT 4 version while approval work proceeds.

## Validation and evidence

- [Overlay/sound checks](CP-25-evidence/stage3/checks.json): no text/frame/opaque card draw calls; translucent backdrop and opaque sprite; queue timing; dismissal spends no coin; one sound per displayed item; actual Web Audio schedules three sine notes in under 0.42 seconds; mute/hidden state suppresses sound.
- [Interaction checks](CP-25-evidence/stage3/interaction-checks.json): actual front payouts counted once, running board beneath award, queued winning awards then clear/advance, drag-only placement, cancelled/wrong drags, persistence and once-only rewards.
- Phone-size 1080×2400 stills: [cheese](CP-25-evidence/stage3/overlay-cheese.png), [shrimp](CP-25-evidence/stage3/overlay-shrimp.png), [tuna](CP-25-evidence/stage3/overlay-tuna.png). [Queue clip](CP-25-evidence/stage3/item-only-overlays.mp4), 6.5 seconds, 540×1200, silent desktop capture; existing cheese/shrimp moved through the actual front payout path as a UI timing fixture. The WAV provides a separate audio preview. Visually inspected. Phone loudness/timing/touch feel and receipt remain Jenny's UAT; desktop checks do not establish Android lifecycle behavior or device FPS.

## Completion payoff ideas — choose one, none built yet

All three would use a short fanfare, visible coin-to-purse payout, and an existing approved cat reaction.

1. **Scene wakes up (recommended):** Water ripples or kitchen lights glow, coins arc into the purse, then the cat does its approved dance.
2. **Treat parade:** placed treats bob in sequence, coins shower into the purse, then the cat shows its approved Happy pose.
3. **Golden trail:** a sparkle links the filled slots, sends a coin cascade into the purse, then ends on the cat's Rest smile.

## First art piece — Collections tile, approval only

- Candidate: a caramel-leather satchel, teal lining and a polished brass paw clasp, with transparent surroundings. It replaces only the flat button artwork; **the existing 44×44 footprint and right-side position are fixed**. No cat/coin/table/pusher/treat art is regenerated.
- [Phone-size still](CP-25-evidence/stage3/art/collections-tile-phone-preview.png) and [inline-size still](CP-25-evidence/stage3/art/collections-tile-phone-inline.png). [Candidate asset](../work/cp25/stage3/art/collections-satchel-v1.png). Rendering is an approval-only runtime preview, **not integrated into the game source/update package**. The published UAT retains the old tile until Jenny approves.
- [Layout lock](CP-25-evidence/stage3/art/layout-lock.json), [registration template](CP-25-evidence/stage3/art/locked-phone-template.png), [preview validation](CP-25-evidence/stage3/art/preview-validation.json): **zero changed pixels outside the tile bounds**. Asset canvas is 1254×1254 with alpha; registered into the fixed square game rectangle.
- Generated using the **built-in imagegen tool**, one art piece only. [Exact prompt](../work/cp25/stage3/art/tile-prompt.txt). Original generated file preserved; workspace candidate: `work/cp25/stage3/art/collections-satchel-v1.png`.
- Waiting for tile OK and payoff choice. Water and Cheese have **not been painted**; each scene's actual-game slot/satchel/frame layout must be locked before its illustration. Then show Water and Cheese separately as phone-size stills and wait for OK before integration, per Stage 3's art process.

## Publication and close-out

Baseline: UAT 4. Source: `work/cp25/stage3/release.html`; builder `build.py`. Backup: `{m['backup']}`. [Package check](CP-25-evidence/stage3/package-verification.json), [publication](CP-25-evidence/stage3/publication.json), [cloud verification](CP-25-evidence/stage3/cloud-verification.json). JSON SHA-256: `{m['stagedJSONSHA256']}`. Same OneDrive item/link; game-only update retains APK4. The candidate tile is absent from the update payload.

Commit/push close-out follows Jenny's ticket sign-off. Production is outside this publication scope. CODEX_BRIEF.md remains untouched while the separate CP-22 promotion report is absent from the top of CP-22.md; this report is the current UAT checkpoint. Previous report: [UAT 4](CP-25-evidence/layout-report.md); earlier loop evidence is linked there.
'''
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
(r/'uat/README.md').write_text(f"# CatCoin UAT\n\nCurrent: **{m['displayName']} / APK4** ({m['version']}).\n\nCP-25 Stage 3 item-only translucent award overlay and short pickup chime. Timing, tap-away and queue retained. Art/payoff proposals await approval and are not in this payload.\n\nSource: work/cp25/stage3/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Fresh cloud hash verified; phone UAT pending.\n",encoding='utf-8')
print('Stage 3 publication and approval report updated')
