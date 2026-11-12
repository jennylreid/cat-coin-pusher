from pathlib import Path
p=Path(__file__).parent
s=(p/'baseline.html').read_text(encoding='utf-8')
def replace(a,b):
    global s
    assert a in s,a
    s=s.replace(a,b)
replace('world.timestep = STEP;', 'world.timestep = STEP;\n  world.integrationParameters.maxCcdSubsteps=4;')
replace("if(board.status==='won'||board.status==='lost'||sweepTime>0||catquakeTime>0||board.remaining<=0)return false;", "if(board.status==='won'||board.status==='lost'||sweepTime>0||catquakeTime>0||board.remaining<=0)return false;\n if(time-lastDrop<.35-1e-6){if(time-(tryDrop.feedbackAt??-99)>.7){sfx.clink(.12);const p=screenOf(200,T.FRONT-12,10);floats.push({text:'Easy taps',x:p.x,y:p.y,t:0});tryDrop.feedbackAt=time;}return false;}")
replace('time=0;lastDrop=-99;','time=0;lastDrop=-99;tryDrop.feedbackAt=-99;')
replace('const tip={x:Math.sin(exit.tip/2),y:0,z:0,w:Math.cos(exit.tip/2)};', 'const tip=yawTurn(0); // CP-22: no artificial tumble before contact.')
replace('{x:-exit.tip*3.6,y:0,z:0}', '{x:0,y:0,z:0}')
replace('  world.step();\n  if(!pushCoinSoundPlayed', '''  // CP-22: resolve fast delivery and the moving tray at two contact intervals.
  const trayEnd={x:200*M,y:TONGUE_H/2*M,z:(pusherY-TONGUE_LEN/2)*M};
  const trayStart={...tongue.translation()};
  world.timestep=STEP/2;
  for(let sub=1;sub<=2;sub++){
    tongue.setNextKinematicTranslation({x:trayEnd.x,y:trayEnd.y,z:trayStart.z+(trayEnd.z-trayStart.z)*sub/2});
    coinImpactVel=new Map(bodies.map(b=>[b.rb.handle,b.rb.linvel().y]));
    const before=new Map(bodies.filter(coinSolid).map(b=>[b.uid,{...b.rb.translation()}]));
    world.step();
    coinRotationContacts();
    solidCoinContacts(before);
    for(const b of bodies)if(b.input&&b.fresh&&!b.contactLanded){
      const c=b.rb.collider(0);let hit=false;
      world.contactPairsWith(c,other=>world.contactPair(c,other,m=>{if(m.numSolverContacts()>0)hit=true;}));
      if(hit){b.contactLanded=true;b.rb.setGravityScale(1,true);}
    }
  }
  world.timestep=STEP;
  if(!pushCoinSoundPlayed''')
replace('if (b.vy < -0.9 && vy > -0.25) {', 'if ((b.input&&b.fresh&&b.contactLanded)||(b.vy < -0.9 && vy > -0.25)) {')
helper=(p/'contacts.js').read_text()
replace('let pushCoinSoundPlayed=false;',helper+'\nlet pushCoinSoundPlayed=false;')
(p/'draft.html').write_text(s,encoding='utf-8')
