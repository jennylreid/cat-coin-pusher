from pathlib import Path
import json,subprocess
p=Path(__file__).parent;r=p.parents[2];e=r/'tickets/CP-25-evidence/stage2'
m=json.loads((p/'publication-manifest.json').read_text());cloud=json.loads((e/'cloud-verification.json').read_text())
assert cloud['sha256']==m['stagedJSONSHA256']
loop=json.loads((e/'natural-hold-loop.json').read_text())
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(e/'hold-loop-and-collections-5x.mp4')],text=True).strip())
report=(r/'tickets/CP-25.md').read_text(encoding='utf-8-sig')
report=report.replace('Stage 2 desktop validation and UAT publication in progress.',f"**Stage 2 published: {m['displayName']} / APK4**, numeric **{m['version']}**. Backup, local package and fresh cloud SHA-256 verified; same OneDrive item/link retained.")
used=' / '.join(str(x['used']) for x in loop['rows'])
report=report.replace('- Full hold-to-drop loop/earned-inventory evidence: pending.',f"- [Natural hold loop](CP-25-evidence/stage2/natural-hold-loop.json): Boards 1→2→3→1 without powers, **{used} drops**, Cheese placed/rewarded after Board 1, Water after Board 3. Final inventory after placement: 2 cheese, 2 shrimp, 0 tuna; all three collection slots placed, both rewards paid, purse **110**. [Clip](CP-25-evidence/stage2/hold-loop-and-collections-5x.mp4): {duration:.1f} seconds, 540×1200, gameplay at 5× with readable UI pauses, silent desktop capture. Footer spacing was refined after capture: [current game HUD](CP-25-evidence/stage2/board-current-hud.png), [Empty purse countdown](CP-25-evidence/stage2/empty-purse.png). [Earned Water](CP-25-evidence/stage2/earned-water-complete.png), [earned Cheese](CP-25-evidence/stage2/earned-cheese-complete.png), [inventory after spending](CP-25-evidence/stage2/earned-inventory-after-placement.png).")
report=report.replace('Pending. Stage 2 source:',f"Release **{m['displayName']} / APK4**, numeric **{m['version']}**. Backup: `{m['backup']}`. [Package verification](CP-25-evidence/stage2/package-verification.json), [publication](CP-25-evidence/stage2/publication.json), [cloud verification](CP-25-evidence/stage2/cloud-verification.json). SHA-256 `{m['stagedJSONSHA256']}`. Stage 2 source:")
(r/'tickets/CP-25.md').write_text(report,encoding='utf-8')
(r/'uat/README.md').write_text(f"# CatCoin UAT\n\nCurrent: **{m['displayName']} / APK4** ({m['version']}).\n\nCP-25 Stage 2: persistent purse/refill, looping boards, inventory, manual Water/Cheese collection placement and one-time rewards; 0.20-second taps/hold stream; Developer Empty purse. Stage 1 signed off; Stage 2 phone UAT pending.\n\nSource: work/cp25/stage2/release.html. Report/evidence: tickets/CP-25.md. Backup: {m['backup']}. Fresh cloud hash verified. Existing OneDrive update item/link and APK4 retained; accept the game update in UAT.\n",encoding='utf-8')
print('Stage 2 report and UAT README updated')
