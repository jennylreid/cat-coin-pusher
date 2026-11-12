from pathlib import Path
p=Path('work/cp25/perf-rework/build.py');s=p.read_text();marker="(p/'candidate.html').write_text"
pos=s.index(marker)
s=s[:pos]+'''s=s.replace("const BUILD = '2026.10.30 UAT 16';","const BUILD = '2026.10.30 UAT 17';")
a=s.index('let last = performance.now(), acc = 0;');b=s.index('function uiPaw(',a)
s=s[:a]+(p/'frame.js').read_text(encoding='utf-8')+'\\n'+s[b:]
s=s.replace('slow: 0 };','slow: 0, physics: 0, draw: 0, coins: 0 };')
s=s.replace("if(S.dev){ctx.font='10px system-ui';ctx.fillText(Math.round(perf.fps)+' fps · '+(perf.slow||0)+' slow',hud.left+185,hud.settingsY);}","if(S.dev){ctx.fillStyle='rgba(18,11,28,.96)';ctx.fillRect(hud.left+2,hud.settingsY-32,W-hud.left-hud.right-4,15);ctx.fillStyle='#fff';ctx.font='10px system-ui';ctx.fillText(Math.round(perf.fps)+' fps | physics '+perf.physics.toFixed(1)+' ms | draw '+perf.draw.toFixed(1)+' ms | '+bodies.length+' coins',hud.left+8,hud.settingsY-24);}")
s=s.replace('let streamPointer=null;','let streamPointer=null,streamSampleTime=-Infinity;')
s=s.replace('streamPointer=e.pointerId;holding = true;', 'streamPointer=e.pointerId;streamSampleTime=-Infinity;holding = true;')
a=s.index("cv.addEventListener('pointermove', e => {if(inventoryOpen)");b=s.index("for(const ev of ['pointerup'",a)
s=s[:a]+(p/'input.js').read_text(encoding='utf-8')+"\\ncv.addEventListener('pointermove',e=>{if(inventoryOpen){collectionPointerMove(e,toGame(e));return;}sampleStreamPointer(e);});\\ncv.addEventListener('pointerrawupdate',sampleStreamPointer);\\n"+s[b:]
'''+s[pos:];p.write_text(s)
