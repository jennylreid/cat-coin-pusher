from pathlib import Path
import json
p=Path('work/cp25/auto-log');e=Path('tickets/CP-25-evidence/auto-log');m=json.loads((p/'publication-manifest.json').read_text());cloud=json.loads((e/'cloud-verification.json').read_text());assert cloud['sha256']==m['stagedJSONSHA256'];eq=json.loads((e/'equivalence-overhead.json').read_text())
report=f'''# CP-25 — UAT 19 automatic performance log (October 30)

**2026.10.30 UAT 19 / APK4**, numeric **{m['version']}**, published; backup/package/fresh cloud bytes verified. Jenny objected to manually gathering live numbers. This build records the next play session automatically and provides **Settings → Copy performance log** near the top. No Developer toggle or watching numbers is required. **Lag/hold acceptance remains open; this adds evidence collection, not another physics change. Pickup work stays stopped.**

## What Jenny does

1. Update to **UAT 19** and play normally, including the hold/slide that feels wrong.
2. Afterward, open **Settings → Copy performance log** and paste the copied text into this chat. If the browser rejects clipboard copying, the log remains in a selectable text box for tap-and-hold copying. No manual FPS/physics/draw/coin transcription.

The installed APK has no log export/remote-reading bridge, and UAT 18 did not persist performance traces. I cannot pull that earlier phone run directly. This game-only route avoids a native installation; it still needs one after-play transfer from the phone. Phone clipboard behaviour is not yet device-verified.

## Recorded data and cost

Automatic one-second buckets retain raw, uncapped frame timing/FPS, physics and drawing CPU time, worst frame/slow-frame counts, catch-up steps, physical coin count, board and screen state. Held-play totals exclude Settings, Inventory, pickup pauses and non-playing states, so a fast paused screen cannot count as successful held play. Recent input/drop rows include delivered finger position, requested/actual release coordinates and pointer-event delay where the timestamp is compatible.

Bounded local storage key `catpusher.uat.diagnostics.v1`: at most **120 metric buckets (~2 minutes), 80 drops and 40 events** per session; export includes current plus previous useful saved play session, even after reopening. Automatic persistence is deferred while holding, then flushed after release/idle/background; explicit export flushes immediately. Storage errors are caught/throttled and leave in-memory copying available. It records build/browser/viewport context, not the full game save, purse or inventory; there is no automatic network upload.

## Validation

[Checks](CP-25-evidence/auto-log/checks.json): weighted hold-only averages and a250-ms stall; bounded buffers; held recording causes no automatic storage writes; data survives reopening independently of game saves (idle relaunch preserves useful previous play); storage failure causes no per-frame retries; actual Settings handler issues a copy request and failed-copy path leaves selectable text; actual pointer/drop hooks capture moved input and release coordinates. Clipboard tests use DOM stubs, not an Android phone.

[State/overhead comparison](CP-25-evidence/auto-log/equivalence-overhead.json): **600 instrumented frames**,20 state comparisons, identical physics/gameplay/payout results against UAT 18. Builder additionally asserts the full collision/step implementation is byte-identical. Frame-recorder microbenchmark:20,000 calls, mean **{eq['meanRecorderMs']:.4f} ms/call**, zero storage writes during held recording; one write on explicit export. This is a desktop recorder-only micro-cost, not a phone overhead/FPS claim.

## Publication / pending

Baseline actual published **UAT 18**, numeric20261030124245; pinned `work/cp25/auto-log/baseline.html`. Source `work/cp25/auto-log/release.html`; builder `build.py` + `logger.js`. [Package](CP-25-evidence/auto-log/package-verification.json), [publication](CP-25-evidence/auto-log/publication.json), [fresh cloud](CP-25-evidence/auto-log/cloud-verification.json). Only packaged HTML changed; APK4 and UAT identity retained. Backup `{m['backup']}`. JSON SHA-256 `{m['stagedJSONSHA256']}`.

**Pending:** Jenny's copied phone log, then analyse it here. No more manual readout checklist. UAT 18's two-interval trial remains the physics baseline; sustained phone smoothness/follow and landing feel are not signed off. Ticket open; close-out commit/push follows sign-off.

---

'''
for a,b in {'a250-ms':'a 250-ms',':20,000':': 20,000','**,20 state':'**, 20 state','numeric202610':'numeric 202610'}.items():report=report.replace(a,b)
t=Path('tickets/CP-25.md');t.write_text(report+t.read_text(encoding='utf-8'),encoding='utf-8')
Path('uat/README.md').write_text(f'''# CatCoin UAT

Current: **2026.10.30 UAT 19 / APK4** ({m['version']}).

Automatic local performance logging replaces manual live-number gathering. Play normally, then **Settings → Copy performance log** and paste into the CP-25 chat. No Developer toggle required. If clipboard copying is rejected, select/copy the text box. Logs separate held play from pauses and include recent input/release data; current and prior useful session retained. No automatic upload/direct phone access. Phone clipboard and performance acceptance pending. Two-interval physics from UAT 18 retained; pickup work stopped.

Source: work/cp25/auto-log/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Package and fresh cloud bytes verified.
''',encoding='utf-8')
d=Path('DEVELOPER.md');d.write_text('''## CP-25 — UAT 19 automatic diagnostic log (October 30, 2026)

Current source `work/cp25/auto-log/release.html`, pinned UAT 18. Builder `build.py` injects `logger.js`, hooks frame/input/drop/end-hold boundaries and adds Copy performance log immediately below Settings heading. No native bridge added; APK4. Full collision/step implementation asserts byte-identical to UAT 18. Instrumented 600-frame comparison yields identical game/physics/payout states.

UAT-only key `catpusher.uat.diagnostics.v1`; schema1, bounded current session plus prior useful saved play session. Metric buckets cap120, drops80, events40. Arrays carry column names in exported JSON. Raw frame intervals include stalls, exclude background via existing visibility clock reset. Held totals use pre-step holding flag plus active-play/nonmodal state; paused/settings frames are identifiable. Input timestamps are feature-checked for compatible monotonic clock before dispatch-lag values are retained. No RNG calls, no game-save serialization, no network. Automatic diagnostic writes defer while holding; idle/end/background/export flush, failed storage throttles instead of retrying per frame. Explicit export may write immediately.

Copy uses a readonly selectable textarea and synchronous execCommand within the button gesture. Returns Copied only if the browser reports success; failure leaves text available for tap-and-hold. DOM-stub paths tested; Android clipboard still needs device evidence. Current/prior log can be pasted to CP-25 for analysis after play; no manual readout collection requested. UAT 18 physics trial/lag acceptance remains open. Report/evidence: tickets/CP-25.md and CP-25-evidence/auto-log/.

'''+d.read_text(encoding='utf-8'),encoding='utf-8')
print('Automatic-log report prepended; manual collection instructions superseded')
