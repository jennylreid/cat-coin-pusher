from pathlib import Path
reps={'UAT18':'UAT 18','UAT17':'UAT 17','steady60':'steady 60','per1/60':'per 1/60','of240':'of 240','matching1/120':'matching 1/120','three28-second':'three 28-second','three30-second':'three 30-second','every0.20':'every 0.20','for20':'for 20','then8':'then 8','over0.5':'over 0.5','above2':'above 2','remain1.20':'remain 1.20','and0.35':'and 0.35','checks](CP-25-evidence/two-intervals/functional.json):60':'checks](CP-25-evidence/two-intervals/functional.json): 60','exactly120':'exactly 120','seeds42/1/2':'seeds 42/1/2','×0.20':'× 0.20','current220':'current 220','seconds.20':'seconds. 20','/70 final':'/ 70 final','about17.9':'about 17.9','the16.7':'the 16.7','ms60-FPS':'ms 60-FPS','for15–20':'for 15–20','near60':'near 60','emit62':'emit 62','vs79':'vs 79','numeric202610':'numeric 202610','for20 seconds':'for 20 seconds','15 accepted':'15 accepted','with three catch-up':'with three catch-up','Hz instead of240':'Hz instead of 240'}
for name in ['tickets/CP-25.md','DEVELOPER.md']:
 p=Path(name);s=p.read_text(encoding='utf-8');end=s.index('\n---\n') if name.startswith('tickets/') else s.index('## CP-25 Stage4 — UAT17') if '## CP-25 Stage4 — UAT17' in s else s.index('## CP-25 Stage4 — UAT 17');a,b=s[:end],s[end:]
 for x,y in reps.items():a=a.replace(x,y)
 p.write_text(a+b,encoding='utf-8')
p=Path('uat/README.md');s=p.read_text(encoding='utf-8')
for x,y in reps.items():s=s.replace(x,y)
p.write_text(s,encoding='utf-8')
