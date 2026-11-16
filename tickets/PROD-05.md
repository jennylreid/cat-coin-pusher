# PROD-05 — Baseline 1 (UAT 64) promoted to production (November 15, 2026)

**Published 2026.11.15 / APK17**, numeric **20261115224800**: everything in 2026.11.15 UAT 64 (20261115190000), as is:
CP-24, CP-33 to CP-38, CP-40 to CP-48. Jenny's go (Nov 15): "Go: promote UAT 64 to production as is." UAT 63 not used.
**Phone receipt pending Jenny.**

**What changed for production (only these):** source is UAT 64's `work/cp63/release.html` (pinned by hash), built by
`work/prod05/prepare.py` into `work/prod05/release.html` (reproducible; 17 adaptations listed in `work/prod05/adaptations.json`):
release name `2026.11.15` (footer), page title CatCoin, production save keys (`catpusher.uat.*` → `catpusher.*`), Settings
heading "Settings" without the three log-file buttons (the production app has no log bridge), the safe-area and Happy
previews and the faces note only with Developer on, and the local performance log off unless Developer is on. Developer
starts off (UAT's default-on only fires when the release name says UAT). No play, art, balance, pickup or sound change.

**Delivery:** game-only update for the installed production app (APK17; native unchanged, no new APK, so nothing for the PM
to decide). `phone/CatCoinPusher-game.json` (51,971,696 bytes) holds the complete 37-file runtime in `files`, `apk` empty,
channel `catpusher`, com.jenny.catpusher, production update link unchanged. The other 36 runtime files are APK17's own assets
byte for byte (also identical to UAT 64's). No UAT field was carried over. JSON SHA-256
`3b598d444a2fe2d8dad59fbded64215b2dfe392e1a6ec4d555506ed413a4f8dc`; index.html SHA-256
`ff88d79ed5ef861e8c3a89c22be5388174463c734abc3400f464b1eaff78ecf3`.

**Backup:** `backups/before-PROD-05-20261115224800` (production JSON and APK, CODEX_BRIEF.md, DEVELOPER.md), hashes verified
before the in-place write. Production APK and both UAT files byte-identical before and after.

**Cloud verification:** a fresh anonymous download from the production share link (HTTP 200, 22:56) is byte-identical to
what was published (same SHA-256, 51,971,696 bytes, same OneDrive item: ETag `{578FC2C8-…},8`, was `,7`). Its contents pass
the production app's own checks: channel/app ID, apkVersion 17 = installed, version newer → offered as a game update;
index.html and lib/rapier.js present; index.html hash matches the build.

**Developer off (desktop, real runtime):** with Developer off, Settings shows only Close, Sound effects and "Developer mode:
off" (plus Check for updates inside the app); no Test this build panel, previews, dials, log buttons or "UAT". No MODES
button and no readouts on the title, PLAY screen, Kitchen, Porch, Album, Shop, cat picker, a round and the end card
([screens](PROD-05-evidence/devoff-contact.png)). A fresh install stays Developer off; a played round writes no performance
log; only `catpusher.*` keys are saved. With Developer on the test tools are still there. No frame errors.

**Save upgrade:** an Oct 31 save made by the Oct 31 production game itself (201 coins, muted, 14 cheese and 3 shrimp)
opened on the new build: 276 coins (201 + 5 extra cheese × 15), cheese 9 (the CP-45 cap), shrimp 3, Level 1 (none passed),
sound still muted, Developer off; a Level 1 round starts and plays; reopening keeps it with no second migration; no UAT keys
read or written. **Parity:** the same scripted rounds on Levels 1, 4 and 6 end with identical boards in production and
UAT 64. Evidence: [checks](PROD-05-evidence/checks.json) (14/14 pass), [package](PROD-05-evidence/package-verification.json),
[publication](PROD-05-evidence/publication.json), [cloud](PROD-05-evidence/cloud-verification.json).

**GitHub:** COMMIT_RESULT

**Limits:** desktop checks don't prove phone receipt, sound or frame rate. The standalone `CatCoinPusher.apk` is still APK17
with the Oct 31 game bundled; a fresh install from it then offers this game update. UAT untouched.

**Jenny — production phone check (the CatCoin production app, not UAT):**
1. Open it. It offers "Game update available: 2026.11.15 is ready". Tap Update (if it doesn't ask, Settings → Check for updates).
2. You should see the CatCoin title, then the PLAY screen at **Level 1**, footer **2026.11.15**.
3. Your coins are there (more than before if you had over 9 of a treat); sound as you left it.
4. Settings: only Sound effects and "Developer mode: off" (and Check for updates). No MODES, no test panel, no numbers in the corners.
5. Play a Level 1 round; close and reopen the app: coins and level kept.

```
PROD-05 phone check: update offered and applied, Level 1, footer 2026.11.15, coins kept, no test tools, round plays, reopen keeps progress — pass
```

---

