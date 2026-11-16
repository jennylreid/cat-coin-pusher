from pathlib import Path
p=Path(__file__).parent/'check.cjs';s=p.read_text(encoding='utf-8')
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a));s=s.replace(a,b)
rep("CP-33-evidence/uat32'","CP-33-evidence/uat33'")
# Prize test: sound calls counted by kind; spin in and out; arrival from the defaults.
rep("run(g,'globalThis.__chimes=0;sfx.itemCollected=()=>{__chimes++;}');const chimes0=()=>run(g,'__chimes');",
    "run(g,\"globalThis.__snd=[];sfx.pickup=(k,v,vol)=>{__snd.push([k,v,vol,+time.toFixed(3)]);}\");const chimes0=()=>run(g,\"__snd.filter(x=>x[0]==='full').length\");")
rep("  assert.equal(moved,0,'held still');\n  const width",
    "  assert.equal(moved,0,'held still');\n"
    "  // Spin in: one full flip while growing, facing front exactly at full size; spin out: one flip into the bag.\n"
    "  let inMin=1,outMin=1;for(let t=0;t<f.tr;t+=.001)inMin=Math.min(inMin,a.pickupPoint(f,t).flip);for(let t=f.tr+f.tm;t<total;t+=.001)outMin=Math.min(outMin,a.pickupPoint(f,t).flip);\n"
    "  const atFull=a.pickupPoint(f,f.tr-1e-9).flip;assert(inMin<-.99&&outMin<-.99&&Math.abs(atFull-1)<1e-6,'spin '+[inMin,outMin,atFull]);\n  const width")
rep("assert.equal(burstMax,0,'sparkles off by default');assert(bdRise>0&&bdRise<1&&bdHeld===1&&bdAfter===0,'backdrop '+[bdRise,bdHeld,bdAfter]);assert.equal(flipMin,1);\n  assert(Math.abs(arrivedAt-1.15)<1/60+1e-6,'arrives at ~1.15 s: '+arrivedAt);",
    "assert.equal(burstMax,0,'sparkles off by default');assert(bdRise>0&&bdRise<1&&bdHeld===1&&bdAfter===0,'backdrop '+[bdRise,bdHeld,bdAfter]);\n"
    "  assert(Math.abs(arrivedAt-1.35)<1/60+1e-6,'arrives at ~1.35 s: '+arrivedAt);const snd=run(g,'__snd');\n"
    "  assert.deepEqual(snd.map(x=>x.slice(0,3)),[['full',1,1],['land',1,1]],'sounds '+JSON.stringify(snd));assert(Math.abs(snd[1][3]-snd[0][3]-(f.tm+f.td))<1/60+1e-6,'land sound at landing');")
rep("heldSec:f.tm,heldMovement:0,flip:false,turnDeg","heldSec:f.tm,heldMovement:0,spin:{turnsIn:f.spinIn,turnsOut:f.turns,deepestFlipIn:+inMin.toFixed(3),deepestFlipOut:+outMin.toFixed(3),facingFrontAtFullSize:true,spinWhileHeld:false},turnDeg")
rep("chimeAtFullSize:true,","sounds:{fullSizeAtSec:centreAt,bagLandingAtSec:arrivedAt,sound:1,volume:1},")
# Five at once: timeline from the defaults (Time held 0.7 s).
rep("  const exp=[[.35,.85,1.15],[1.2,1.7,2],[1.875,2.125,2.425],[2.3,2.55,2.85],[2.725,2.975,3.275]];",
    "  const exp=[];{let lv=0;fl.forEach((f,i)=>{const s=lv+f.tr,l=s+f.tm;exp.push([s,l,l+f.td]);lv=l;});}assert(Math.abs(exp[4][2]-3.975)<1e-9,'timeline sum '+exp[4][2]);")
rep("fullSec:{riseAndGrow:.35,held:.5},shortSec:{riseAndGrow:.175,held:.25}","fullSec:{riseAndGrow:.35,held:.7},shortSec:{riseAndGrow:.175,held:.35}")
# Quake: lands at rise + held + flight (1.85 s); no spin in; still 2 flips out; no prize sound.
rep("run(g,'globalThis.__special=0;sfx.special=()=>{__special++;};globalThis.__chimes=0;sfx.itemCollected=()=>{__chimes++;}');",
    "run(g,'globalThis.__special=0;sfx.special=()=>{__special++;};globalThis.__chimes=0;sfx.pickup=()=>{__chimes++;}');")
rep("assert(Math.abs(landed-1.65)<1/60+1e-6,'lands at 1.65 s '+landed);","let qIn=1;for(let t=0;t<f.tr;t+=.001)qIn=Math.min(qIn,a.pickupPoint(f,t).flip);assert.equal(qIn,1,'quake: no spin in');assert(f.turns===2&&f.spinIn===0);\n  assert(Math.abs(landed-1.85)<1/60+1e-6,'lands at 1.85 s '+landed);")
rep("flipsOnFinalFlight:2,","flipsOnFinalFlight:2,spinIn:false,")
# Dev panel: new dials and Time held 0.7 s; v5 values migrate except held.
rep("/Time held: 0.5 s/,","/Time held: 0.7 s/,/Spin: 1 turn/,/Pickup sound: Sound 1/,/Pickup volume: 100%/,")
rep("a.stepPickupFx('panelPad',1);\n","a.stepPickupFx('panelPad',1);a.stepPickupFx('spin',1);a.stepPickupFx('sound',1);a.stepPickupFx('volume',-1);\n")
rep("quakeSize:.65,panelPad:16};","quakeSize:.65,panelPad:16,spin:1.25,sound:2,volume:.9};")
rep("/Panel padding: 16 px/])assert(re.test(on2),String(re));","/Panel padding: 16 px/,/Spin: 1.25 turns/,/Pickup sound: Sound 2/,/Pickup volume: 90%/])assert(re.test(on2),String(re));")
rep("  // UAT 30/31 tuning under the same key carries over; the new dials start at their defaults.\n  {const g4=await make({sourceFile:SRC,storage:{'catpusher.uat.pickupfx.v5':JSON.stringify({size:.6,fade:.5})}});const q=g4.c.__game.pickupFx;assert(q.size===.6&&q.fade===.5&&q.quakeSize===.7&&q.panelPad===14);g4.close();}",
    "  // UAT 30-32 tuning (v5 key) carries over once into v6, except Time held, which takes the new 0.7 s default.\n"
    "  let migrated;{const st={'catpusher.uat.pickupfx.v5':JSON.stringify({size:.6,fade:.5,held:.5,panelPad:20})};const g4=await make({sourceFile:SRC,storage:st});const q=g4.c.__game.pickupFx;\n"
    "   assert(q.size===.6&&q.fade===.5&&q.panelPad===20&&q.held===.7&&q.spin===1&&q.sound===1&&q.volume===1,JSON.stringify(q));const v6=JSON.parse(st['catpusher.uat.pickupfx.v6']);assert(v6.held===.7&&v6.size===.6);\n"
    "   migrated={from:{size:.6,fade:.5,held:.5,panelPad:20},to:{size:q.size,fade:q.fade,held:q.held,panelPad:q.panelPad}};g4.close();}")
rep("pass('developer tuning: new defaults, Fade and Stripes, old key ignored, persists, in log',{oldKeyIgnored:'catpusher.uat.pickupfx.v4',",
    "pass('developer tuning: Spin, Pickup sound and volume dials, Time held 0.7 s, v5 values migrate, persists, in log',{oldKeyIgnored:'catpusher.uat.pickupfx.v4',migratedFromV5:migrated,")
# New: Spin dial at 0 and 2; the Quake coin ignores it; Pickup sound and volume are passed through; volume 0 is silent.
new = r"""
 // 4e. UAT 33 Spin dial: 0 = no spin in or out (flip stays 1); 2 = two flips each way; the Quake coin keeps its own
 // flight (no spin in, 2 flips out) whatever the dial says. Sound picker and volume reach the sound call.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;const flips=(f,t0,t1)=>{let m=1,n=0,prev=1;for(let t=t0;t<t1;t+=.0005){const x=a.pickupPoint(f,t).flip;m=Math.min(m,x);if(x<0&&prev>=0)n++;prev=x;}return {min:m,crossings:n};};
  a.pickupFx.spin=0;const f0=a.queueTreatAward('tuna',200,null,true);const in0=flips(f0,0,f0.tr),out0=flips(f0,f0.tr+f0.tm,f0.tr+f0.tm+f0.td);a.treatAwards.length=0;
  assert(in0.min===1&&out0.min===1,'spin 0');
  a.pickupFx.spin=2;const f2=a.queueTreatAward('tuna',200,null,true);const in2=flips(f2,0,f2.tr),out2=flips(f2,f2.tr+f2.tm,f2.tr+f2.tm+f2.td);a.treatAwards.length=0;
  assert(in2.crossings===2&&out2.crossings===2,'spin 2 '+JSON.stringify([in2,out2]));
  const q=a.queueTreatAward('quake',200,null,true,'quake');const qi=flips(q,0,q.tr),qo=flips(q,q.tr+q.tm,q.tr+q.tm+q.td);a.treatAwards.length=0;
  assert(qi.min===1&&qo.crossings===2&&q.turns===2,'quake unchanged');a.pickupFx.spin=1;
  run(g,"globalThis.__snd=[];sfx.pickup=(k,v,vol)=>{__snd.push([k,v,vol]);}");a.pickupFx.sound=3;a.pickupFx.volume=.5;const f=a.queueTreatAward('cheese',200,null,true);while(!f.arrived)g.tick();
  assert.deepEqual(run(g,'__snd'),[['full',3,.5],['land',3,.5]]);
  const snd=JSON.parse(fs.readFileSync(path.join(OUT,'sounds.json'),'utf8'));assert(snd.volumeZeroPeak===0&&snd.soundOffVoices===0&&[1,2,3].every(v=>snd['sound'+v].peak150<1));
  pass('Spin dial (0 off, 2 turns) for prizes only; Quake flight unchanged; Pickup sound and volume reach the sound; volume 0 and sound off are silent',{spin0:{in:in0,out:out0},spin2:{flipsIn:in2.crossings,flipsOut:out2.crossings},quakeWithSpin2:{spinIn:false,flipsOut:qo.crossings},soundCall:[['full',3,.5],['land',3,.5]],volumeZeroPeak:0,soundOffNodes:0,peaksAt150Percent:[1,2,3].map(v=>snd['sound'+v].peak150)});g.close();}
 // 5. Tapping during a pickup drops a coin."""
rep("\n // 5. Tapping during a pickup drops a coin.",new)
p.write_text(s,encoding='utf-8');print('ok')
