from pathlib import Path
import json,hashlib,subprocess
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-69-evidence/uat88'
before=(p/'release.html').read_bytes()
subprocess.run(['python',str(p/'build.py')],check=True)
assert before==(p/'release.html').read_bytes(),'non-reproducible build'
s=before.decode();t=(p/'title-final.html').read_text(encoding='utf-8');anchor='async function image(src) { const im = new Image(); im.src = src; await im.decode(); return im; }'
code='\n // CP-69: approved accessory overlays, preloaded with the existing art.\n'
for id in ['hat','bowtie','monocle','cane']:code+=f" WILD_ART['cp69-{id}']=await image('img/art/cp69-{id}.png');\n"
t=t.replace(anchor,anchor+code);i=t.rindex('</script>');t=t[:i]+(p/'accessories.js').read_text(encoding='utf-8')+'\n'+(p/'developer.js').read_text(encoding='utf-8')+'\n'+t[i:]
assert s==t,'outside scoped additions'
assert s.count('if(CP63X)cp63Monocle();')==1
assert 'cp63Monocle=function()' in s and 'cp63DrawCane=function(t)' in s
assert 'ctx.drawImage' in (p/'accessories.js').read_text(encoding='utf-8')
assert not any(x in (p/'accessories.js').read_text(encoding='utf-8') for x in ['queueTreatAward','removeCoin','sfx.','CP63X=','pgpUse='])
d=json.loads((e/'developer.json').read_text(encoding='utf-8'))
expected=['Developer mode: on','Sound effects: on','Check for updates','Send performance log','Open every level','Pass the next level','Back to Level 1','+1,000 coins','Give 3 of every prize + 300 coins','Give powers (3 each)','Give all cats','Start dance break now','Wild 2: spin the wheel now','Wheel lands on QUAKE COIN','Wheel lands on DANCE AGAIN','Wheel lands on YAWN','Wheel lands on PRIZE YOU NEED','Wheel lands on JACKPOT','Start a Jackpot now','Cat visits now','Reset progression']
assert d['labels']==expected and d['closed'] and d['engineerButtons']>=120
b=json.loads((e/'real-browser-boot.json').read_text(encoding='utf-8'));assert b['title'] and b['play'] and b['art'] and b['cleaned'] and not b['errors']
(e/'scope-audit.json').write_text(json.dumps({'passed':True,'releaseSHA256':hashlib.sha256(before).hexdigest(),'reproducible':True,'scope':'title final recipe + four art preloads + drawing overrides + Developer DOM wrapper only','developerListExact':True,'engineerCollapsed':True,'powerOnlyArt':True},indent=2))
print('Scope, reproducibility, power-only drawing and Developer list: PASS')

