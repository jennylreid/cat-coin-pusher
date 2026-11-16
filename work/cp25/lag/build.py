from pathlib import Path
p=Path(__file__).parent
s=(p/'baseline.html').read_text(encoding='utf-8')
s=s.replace("const BUILD = '2026.10.29 UAT 15';","const BUILD = '2026.10.30 UAT 16';")
a=s.index('function solidCoinContacts');b=s.index('let pushCoinSoundPlayed',a)
s=s[:a]+(p/'contacts.js').read_text(encoding='utf-8')+s[b:]
a=s.index('let last = performance.now(), acc = 0;');b=s.index('function uiPaw(',a)
s=s[:a]+(p/'frame.js').read_text(encoding='utf-8')+s[b:]
s=s.replace('const perf = { step: 0, fps: 60 };','const perf = { step: 0, fps: 0, slow: 0 };')
s=s.replace("Math.round(perf.fps)+' fps'","Math.round(perf.fps)+' fps · '+(perf.slow||0)+' slow'")
s=s.replace('devicePixelRatio','renderPixelRatio')
pos=s.index('const BUILD =');s=s[:pos]+'const renderPixelRatio=Math.min(2,window.devicePixelRatio||1);\n'+s[pos:]
(p/'release.html').write_text(s,encoding='utf-8')
