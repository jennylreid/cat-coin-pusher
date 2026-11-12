from pathlib import Path
p=Path(__file__).parent
s=(p/'baseline.html').read_text(encoding='utf-8')
assert s.count("const BUILD = '2026.10.30 UAT 21';")==1
s=s.replace("const BUILD = '2026.10.30 UAT 21';","const BUILD = '2026.10.30 UAT 22';")
old="function powerFace(){return catquakeTime>0?"
assert s.count(old)==1
s=s.replace(old,"function powerFace(){\n // Finish the queued BOARD CLEAR message before entering the idle Rest pose.\n if(board.status==='won'&&sweepTime===0&&catquakeTime===0&&callouts.some(c=>c.word==='BOARD CLEAR!'))return 'normal';\n return catquakeTime>0?")
(p/'release.html').write_text(s,encoding='utf-8')
print('UAT22: clear message completes before idle Rest')
