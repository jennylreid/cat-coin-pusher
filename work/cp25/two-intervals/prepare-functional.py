from pathlib import Path
p=Path('work/cp25/two-intervals');s=Path('work/cp25/perf-rework/functional.cjs').read_text(encoding='utf-8').replace('work/cp25/perf-rework/candidate.html','work/cp25/two-intervals/candidate.html').replace('CP-25-evidence/perf-rework/','CP-25-evidence/two-intervals/')
s=s.replace("g.c.draw=()=>{};const handlers", "g.c.draw=()=>{};let nativeCalls=0;const native=g.c.__game.world.step.bind(g.c.__game.world);g.c.__game.world.step=(...args)=>{nativeCalls++;return native(...args);};for(let i=0;i<60;i++)g.tick();assert.equal(nativeCalls,120);assert.equal(g.c.__game.world.timestep,1/60);const handlers")
s=s.replace("'Raw/coalesced samples choose", "'60 fixed ticks execute exactly120 native steps and restore the1/60 outer timestep','Raw/coalesced samples choose")
(p/'functional.cjs').write_text(s,encoding='utf-8')
