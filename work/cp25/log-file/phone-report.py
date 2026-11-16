from pathlib import Path
p=Path('tickets/CP-25.md');s=p.read_text(encoding='utf-8');note='''# CP-25 — phone log analysed; easier file handoff in progress (October 30)

Jenny supplied the UAT 19 phone log and reports that transferring the text from phone to PC was difficult. [Phone evidence](CP-25-evidence/log-file/UAT19-phone.json), [computed analysis](CP-25-evidence/log-file/phone-analysis.json).

**Phone performance still fails:** active held play averaged27.5 FPS, physics29.72 ms/rendered frame and drawing5.68 ms. Late held play (135–147 coins) averaged16.8 FPS with physics51.0 ms/frame versus drawing7.4 ms. Catch-up reaches3 game ticks/frame. The 54 FPS whole-session average includes 100–120 FPS pickup/Settings periods and must not count as a gameplay pass. The primary cost is physics as the pile grows, not ordinary drawing.

**Finger evidence:** requested and actual world release X agree in every logged drop, but the physical drop span clamps at116–284 world units. An input at308.2 canvas units released at261.7:46.5 units short. That fixed edge is distinct from lag. Within the existing span, using a fixed projection depth also creates smaller alignment errors; correct projection at actual release depth is within the existing finger-follow scope. Widening the physical span/layout is not authorized here.

**Next physics option:** trial one native collision interval per1/60-second game tick, then repeat pass-through/flip/pile-up/launch/clearability checks before publishing any physics change. Expected benefit is less repeated work; collisions/stack compression could differ, so Jenny's approval is required before implementation. No change to one interval has been made.

**Handoff work:** replace recurring phone-to-PC clipboard transfer with a native file bridge. A dedicated placeholder already exists at `uat/diagnostics/CatCoin-UAT-performance.json`. Plan: one-time Android file selection, retained read/write grant, then worker-thread writes of the bounded diagnostic payload after play. A read-only file-share fallback covers providers that cannot retain write access. This requires a matching signed UAT APK5; build/validation and publication remain in progress. Actual OneDrive provider write/sync requires phone evidence, not inferred from desktop tests. Logging remains UAT-only; pickup work stopped.

---

''';p.write_text(note+s,encoding='utf-8')
