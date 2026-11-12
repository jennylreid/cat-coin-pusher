from pathlib import Path
import json
r=Path('.');m=json.loads(Path('work/cp25/perf-rework/publication-manifest.json').read_text());p=Path('tickets/CP-25.md');s=p.read_text(encoding='utf-8')
s=s.replace('# CP-25 Stage 4 investigation — physics regression identified; decision pending','# CP-25 Stage 4 — UAT17 diagnostic published; lag unresolved',1)
s=s.replace('**UAT16 failed on Jenny\'s phone: about 13 FPS holding, no usable slide-follow. Pickup work stopped.**',f"**UAT16 failed on Jenny's phone: about 13 FPS holding, no usable slide-follow. Pickup work stopped.** **2026.10.30 UAT17 / APK4**, numeric **{m['version']}**, now published as a diagnostic/no-feel drawing/input build; backup, package and fresh cloud bytes verified. **It is not a successful lag fix; 60 FPS and hold-follow acceptance remain open.**",1)
needle='CPU sampling (`work/cp25/perf-rework/uat16.cpuprofile`)'
pos=s.index(needle)
s=s[:pos]+'''The frame loop then amplifies overload: after a slow frame it runs up to **three fixed ticks (twelve native solver intervals) before drawing**. The 0.05-second time cap discards elapsed time, slowing both coin travel and the stream in real seconds. [Actual wall-clock holding/readout run](CP-25-evidence/perf-rework/readout-hold.json), six seconds per version: UAT16 throughput14.6 FPS (ending readout6.2), UAT17 throughput7.9 FPS (ending readout7.2), with candidate average **physics107.7 ms/frame**, **drawing24.6 ms/frame** and3 simulation ticks/frame. **Both fail the 60 FPS target.** The gesture script is the same, but emitted drops differ17 vs12 as frame cadence/physics time diverges; this is evidence of overload, not a matched-state speed comparison or proof the drawing change regresses physics. CPU drawing ms measures command submission, not asynchronous GPU/compositor cost. Phone timings are still needed.

'''+s[pos:]
old='**Current publication remains failed UAT16 while final diagnostic validation runs.** Planned UAT17 is explicitly a diagnostic/no-feel drawing/input build, not a claim of fixed lag. Await Jenny\'s approval before reducing solver intervals or changing how resting/moving coins behave. Pickup art/builds remain stopped.'
new=f'''## UAT17 validation, publication and what to try

[Final equivalence](CP-25-evidence/perf-rework/equivalence.json):720 tested steps across Boards1–3 with exact positions, rotations, linear/angular velocities and sleep states against UAT16;12 sampled coin-render PNGs identical;5,115 overlap decisions matched the old routine. [Final candidate fixed-step profile](CP-25-evidence/perf-rework/profile-candidate.json) still exceeds a16.7 ms frame budget. No physics speedup or steady60 claim. The final candidate excludes all experimental native-query caching code. A pinned-source rebuild matches published HTML.

- [ ] Update UAT to **2026.10.30 UAT17**. Settings → Developer mode shows **FPS | physics ms | draw ms | coin count** in the footer. This build exists to identify the phone cost, not to ask for a pass on lag.
- [ ] Hold and slide left/right for15–20 seconds; after three seconds report all four numbers and whether release positions follow. Repeated frames spending more than16.7 ms on physics/drawing cannot meet60 FPS. Report the same figures with the finger lifted so holding cost can be distinguished. Phone follow remains failed until Jenny confirms it under smooth play.

[Developer readout still](CP-25-evidence/perf-rework/developer-readout.png), [package](CP-25-evidence/perf-rework/package-verification.json), [publication](CP-25-evidence/perf-rework/publication.json), [fresh cloud bytes](CP-25-evidence/perf-rework/cloud-verification.json). Source `work/cp25/perf-rework/release.html`; backup `{m['backup']}`; only packaged HTML changed. JSON SHA-256 `{m['stagedJSONSHA256']}`. Same UAT sharing item, APK4 and save schema. Phone receipt/performance pending.

**Decision pending:** asked Jenny whether to trial two collision intervals, then run the CP-22 pass-through/flip/pile-up checks before publication. The updated brief says “ask Jenny before any that do” alter feel, so this behavioral change is not implemented. Four intervals remain in UAT17. Hold stays; PRIZE LOST stays. Pickup work is stopped. Ticket open; sign-off/commit/push close-out remain pending.'''
assert old in s;s=s.replace(old,new,1);p.write_text(s,encoding='utf-8')
p=Path('uat/README.md');p.write_text(f'''# CatCoin UAT

Current: **2026.10.30 UAT17 / APK4** ({m['version']}).

CP-25 Stage4 diagnostic build: Developer mode now shows rolling FPS, total physics ms/frame, drawing CPU ms/frame and physical coin count. Newest raw/coalesced pointer sampling; exact equivalent cheaper overlap drawing. Original four-interval physics retained. **Lag is unresolved**: UAT16 failed at about13 FPS on Jenny's phone; desktop candidate still fails60. Report timings holding/sliding and after release; not a request for lag sign-off. Two-interval trial awaits Jenny's approval. Pickup work stopped.

Source: work/cp25/perf-rework/release.html. Report: tickets/CP-25.md. Backup: {m['backup']}. Package/fresh cloud bytes verified.
''',encoding='utf-8')
p=Path('DEVELOPER.md');text=p.read_text(encoding='utf-8');text='''## CP-25 Stage4 — UAT17 diagnostic, lag unresolved (October 30, 2026)

Current UAT17 source `work/cp25/perf-rework/release.html`, pinned actual UAT16 package under `uat16/`. Rebuild `build.py` with `overlap.js`, `frame.js`, `input.js`, stage `stage.py`. Builder asserts coin contact/step code byte-for-byte identical to UAT16; four native intervals retained. Convex SAT uses inward edge half-planes, with original projection fallback near tangency;720-step physics equivalence,12 identical coin-render samples and5,115 identical overlap decisions. Private native-query/pose caching experiment was rejected for no reliable physics speedup and is NOT loaded by the builder.

Frame diagnostics average raw frame intervals and total physics/drawing CPU time per rendered frame over3 seconds, refreshing every500 ms; physics includes all catch-up ticks. Footer shows FPS, physics ms, drawing ms and coinSolid body count only in Developer mode. Drawing time is submission CPU time, not GPU completion. Visibility resets timing/accumulator. Existing .05-second cap and maximum3 catch-up ticks remain; overload can therefore execute12 native intervals/frame and discard elapsed time. This explains slow real-time travel/streaming without travel-rule tuning. Raw pointer updates/coalesced samples choose newest timestamp; stale/other-pointer samples ignored, pointermove fallback retained, no drops in move handlers. .20-second simulation gate unchanged.

Matched production/CP22/UAT16 comparison identifies the large physics-cost increase in CP22's four intervals and hard pairwise contact repair; CP25 save calls are not the dominant cost. UAT17 is diagnostic, not a passed lag fix. Two-interval trial needs Jenny's approval before implementation, then CP22 pass-through/flip/pile checks. Full report/evidence: tickets/CP-25.md and CP-25-evidence/perf-rework/. Pickup work stopped. PRIZE LOST same-board retry retained per Jenny's October30 decision.

'''+text;p.write_text(text,encoding='utf-8')
print('Top report and current UAT/engineering guidance updated')
