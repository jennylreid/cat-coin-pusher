from pathlib import Path
import json
r=Path.cwd();e=r/'tickets/CP-25-evidence/promotion';p=r/'work/cp25/promotion';m=json.loads((p/'manifest.json').read_text())
f=r/'tickets/CP-25.md';s=f.read_text(encoding='utf8');header='''# CP-25 — production promotion prepared (October 31)

Jenny confirmed UAT24 installed on October30 and approved CP-22/CP-25/CP-26 production release. **Publication is held only for the brief’s save-continuity mismatch:** existing production `work/cp21/promotion/release.html` has `load() { resetBoard(); }` and a no-op `save()`. It never persisted current board or old per-board allowance. Sound settings persist. Jenny has been asked whether first open may start Board1 with220 coins; no answer recorded yet. Production files remain unchanged.

**Prepared:** 2026.10.31 / APK17, numeric VERSION. Source/native/staging `work/cp25/promotion`. A new production APK carries `BuildConfig.VERSION_CODE` instead of the exception-to-zero runtime query. Production’s existing update policy is byte-identical to UAT24’s apart from package name; retained. Production application ID, private native preferences, signing certificate and update URI retained. Native OneDrive diagnostic bridge/provider omitted. Automatic local diagnostic entry points and testing controls require Developer mode; normal Settings shows sound, Developer mode and the native update check when available.

**Game parity:** all36 non-HTML runtime assets byte-identical to UAT24; only label/title, production storage keys, Developer gates and diagnostic omission differ in HTML. No gameplay/art/balance tuning. Production loop key is `catpusher.loop.v1`, audio `catpusher.audio.v1`; UAT keys never read. Old per-board allowance is not converted: the new shared purse starts at220; current-board allowance becomes that purse. New loop saves restore board, bodies, purse/inventory/collections thereafter.

**Validation so far:** fresh signed offline build and lint pass; manifest APK17, certificate matches production, all startup/bridge/updater classes present across DEX. Exact APK16 CloudUpdate source reads the staged APK-only envelope and validates complete installer bytes; update policy covers automatic offer, decline, manual retry and no reoffer on APK17. Runtime checks confirm sound setting load, first purse220, UAT isolation, new board-save restoration and hidden testing controls. Board parity checks are running; evidence is adjacent in [promotion](CP-25-evidence/promotion/).

**Delivery shape:** JSON JSONBYTES bytes, complete embedded APK APKBYTES bytes, empty `files`; all37 runtime files bundled once at matching game version. Smaller than current production’s57,646,390-byte envelope and comparable to phone-installed UAT24, avoiding UAT20’s duplicate runtime. No missing-installer path: APK16 selects APK17 with nonempty installer; APK17’s bundled version equals envelope, so no empty-files game offer. This is source/desktop evidence, not proof of phone memory headroom or receipt.

**Pending:** Jenny’s first-open board decision; finish board comparisons; backup, in-place production publication, fresh cloud JSON/embedded-installer verification, baseline docs and GitHub commit/push. No claim of completion or production receipt.

---

'''.replace('VERSION',str(m['version'])).replace('JSONBYTES',str(m['jsonBytes'])).replace('APKBYTES',str(m['apkBytes']))
if s.startswith('# CP-25 — production promotion prepared'):s=s[s.index('---\n\n')+7:]
f.write_text(header+s,encoding='utf8')
