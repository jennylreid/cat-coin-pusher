from pathlib import Path
p=Path(__file__).parent/'check.cjs';s=p.read_text(encoding='utf-8')
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a));s=s.replace(a,b)
rep("CP-33-evidence/uat33'","CP-33-evidence/uat34'")
# Prize test: ledge bell at payout, thump at landing.
rep("run(g,\"globalThis.__snd=[];sfx.pickup=(k,v,vol)=>{__snd.push([k,v,vol,+time.toFixed(3)]);}\");const chimes0=()=>run(g,\"__snd.filter(x=>x[0]==='full').length\");",
    "run(g,\"globalThis.__snd=[];sfx.pickup=(k,vol,d)=>{__snd.push([k,vol,d||0,+time.toFixed(3)]);}\");const chimes0=()=>run(g,\"__snd.filter(x=>x[0]==='bell').length\");const tPay=run(g,'time');")
rep("  assert.deepEqual(snd.map(x=>x.slice(0,3)),[['full',1,1],['land',1,1]],'sounds '+JSON.stringify(snd));assert(Math.abs(snd[1][3]-snd[0][3]-(f.tm+f.td))<1/60+1e-6,'land sound at landing');",
    "  assert.deepEqual(snd.map(x=>x.slice(0,3)),[['bell',1,0],['thump',1,0]],'sounds '+JSON.stringify(snd));assert(Math.abs(snd[0][3]-tPay)<=1/60+1e-6,'bell at the ledge moment');\n"
    "  assert(Math.abs(snd[1][3]-snd[0][3]-(f.tr+f.tm+f.td))<2/60+1e-6,'thump at landing '+JSON.stringify(snd));")
rep("sounds:{fullSizeAtSec:centreAt,bagLandingAtSec:arrivedAt,sound:1,volume:1},","sounds:{ledgeBellAtPayout:true,bellsAtFullSize:0,bagThumpAtSec:arrivedAt,volume:1},")
# The bell played at payout, so by full size it has played once (no extra sound at full size).
# 4e: Spin dial unchanged; sound part now: volume reaches bell and thump; burst spacing and cap; game-time reset.
rep("run(g,\"globalThis.__snd=[];sfx.pickup=(k,v,vol)=>{__snd.push([k,v,vol]);}\");a.pickupFx.sound=3;a.pickupFx.volume=.5;const f=a.queueTreatAward('cheese',200,null,true);while(!f.arrived)g.tick();\n"
    "  assert.deepEqual(JSON.parse(JSON.stringify(run(g,'__snd'))),[['full',3,.5],['land',3,.5]]);\n"
    "  const snd=JSON.parse(fs.readFileSync(path.join(OUT,'sounds.json'),'utf8'));assert(snd.volumeZeroPeak===0&&snd.soundOffVoices===0&&[1,2,3].every(v=>snd['sound'+v].peak150<1));",
    "run(g,\"globalThis.__snd=[];sfx.pickup=(k,vol,d)=>{__snd.push([k,+vol.toFixed(3),d||0]);}\");a.pickupFx.volume=.5;const f=a.queueTreatAward('cheese',200,null,true);while(!f.arrived)g.tick();\n"
    "  assert.deepEqual(JSON.parse(JSON.stringify(run(g,'__snd'))),[['bell',.5,0],['thump',.5,0]]);a.pickupFx.volume=1;while(a.treatAwards.length)g.tick();for(let k=0;k<30;k++)g.tick();\n"
    "  // Five prizes over the ledge in the same frame: bells 0.1 s apart at 100%, 70%, 50%; the 4th and 5th are skipped.\n"
    "  run(g,'__snd=[]');for(const id of ['cheese','shrimp','tuna','cheese','shrimp'])a.queueTreatAward(id,200,null,true);const burst=JSON.parse(JSON.stringify(run(g,'__snd')));\n"
    "  assert.deepEqual(burst.map(x=>[x[0],x[1],+x[2].toFixed(3)]),[['bell',1,0],['bell',.7,.1],['bell',.5,.2]],JSON.stringify(burst));a.treatAwards.length=0;\n"
    "  // Two prizes 0.5 s apart: each gets its own full bell at its own ledge moment.\n"
    "  for(let k=0;k<30;k++)g.tick();run(g,'__snd=[]');a.queueTreatAward('cheese',200,null,true);for(let k=0;k<30;k++)g.tick();a.queueTreatAward('tuna',200,null,true);const apart=JSON.parse(JSON.stringify(run(g,'__snd')));assert.deepEqual(apart,[['bell',1,0],['bell',1,0]]);a.treatAwards.length=0;\n"
    "  // Game time restarting with a board never silences the bell.\n"
    "  run(g,'nextLedgeBell=time*1000+5000;__snd=[]');a.queueTreatAward('cheese',200,null,true);assert.deepEqual(JSON.parse(JSON.stringify(run(g,'__snd'))),[['bell',1,0]]);a.treatAwards.length=0;\n"
    "  const snd=JSON.parse(fs.readFileSync(path.join(OUT,'sounds.json'),'utf8'));assert(snd.volumeZeroPeak===0&&snd.soundOffVoices===0&&snd.at150Peak<1&&snd.threeTogether.peak<1);")
rep("pass('Spin dial (0 off, 2 turns) for prizes only; Quake flight unchanged; Pickup sound and volume reach the sound; volume 0 and sound off are silent',",
    "pass('Spin dial (0 off, 2 turns) for prizes only; Quake flight unchanged; ledge bell and thump at Pickup volume, spaced and capped together; volume 0 and sound off are silent',")
rep("soundCall:[['full',3,.5],['land',3,.5]],volumeZeroPeak:0,soundOffNodes:0,peaksAt150Percent:[1,2,3].map(v=>snd['sound'+v].peak150)}",
    "soundCallAtVolume50:[['bell',.5,0],['thump',.5,0]],fivePrizesSameFrame:{bells:3,delaysSec:[0,.1,.2],levels:[1,.7,.5],skipped:2},twoPrizes0_5sApart:'full bell each',volumeZeroPeak:0,soundOffNodes:0,peakAt150Percent:snd.at150Peak,threeTogetherPeak:snd.threeTogether.peak,threeStackedUnspacedPeak:snd.threeTogether.peakIfStackedUnspaced}")
# Dev panel: picker gone.
rep("/Spin: 1 turn/,/Pickup sound: Sound 1/,/Pickup volume: 100%/,","/Spin: 1 turn/,/Pickup volume: 100%/,")
rep("for(const re of [/Spin speed/,","for(const re of [/Pickup sound/,/Spin speed/,")
rep("a.stepPickupFx('spin',1);a.stepPickupFx('sound',1);a.stepPickupFx('volume',-1);","a.stepPickupFx('spin',1);a.stepPickupFx('volume',-1);")
rep("spin:1.25,sound:2,volume:.9};","spin:1.25,volume:.9};")
rep("/Spin: 1.25 turns/,/Pickup sound: Sound 2/,/Pickup volume: 90%/","/Spin: 1.25 turns/,/Pickup volume: 90%/")
rep("q.held===.7&&q.spin===1&&q.sound===1&&q.volume===1","q.held===.7&&q.spin===1&&q.volume===1&&q.sound===undefined")
rep("pass('developer tuning: Spin, Pickup sound and volume dials,","pass('developer tuning: Spin and Pickup volume dials (no sound picker),")
p.write_text(s,encoding='utf-8');print('ok')
