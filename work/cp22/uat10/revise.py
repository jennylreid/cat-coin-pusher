from pathlib import Path
import hashlib
p=Path(__file__).parent
assert hashlib.sha256((p/'revision1/release.html').read_bytes()).hexdigest()=='684f818c2e814825195c2a21ee7edf9b20b6c1c27258d6bd31a12c2a82ca777c'
s=(p/'revision1/release.html').read_text(encoding='utf-8')
a=s.index('// CP-22: a final hard contact constraint')
b=s.index('let pushCoinSoundPlayed=false;',a)
s=s[:a]+(p/'stable.js').read_text()+ '\n'+(p/'solid.js').read_text()+ '\n'+s[b:]
s=s.replace('world.integrationParameters.numSolverIterations = 6','world.integrationParameters.numSolverIterations = 6')
s=s.replace('world.integrationParameters.numAdditionalFrictionIterations = 1','world.integrationParameters.numAdditionalFrictionIterations = 2')
s=s.replace('world.integrationParameters.maxCcdSubsteps=4;', 'world.integrationParameters.maxCcdSubsteps=4;\n  world.integrationParameters.numInternalPgsIterations=1;\n  world.integrationParameters.normalizedAllowedLinearError=.0001;')
s=s.replace('const rb = world.createRigidBody(desc);\n  const bx',"const rb = world.createRigidBody(desc);\n  if(kind==='coin'||kind==='silver'||kind==='quake')rb.enableCcd(true);\n  const bx")
s=s.replace("if(b.input){b.rb.setGravityScale(1,true);b.rb.enableCcd(false);}","if(b.input){b.rb.setGravityScale(1,true);}")
s=s.replace('for(const b of bodies)b.rb.enableCcd(false);',"for(const b of bodies)b.rb.enableCcd(coinSolid(b));")
s=s.replace('world.timestep=STEP/2;','world.timestep=STEP/4;').replace('sub<=2;','sub<=4;').replace(')*sub/2}',')*sub/4}')
s=s.replace('    world.step();\n    coinRotationContacts();', '    coinRotationContacts();\n    world.step();')
s=s.replace('if(time-lastDrop<.35-1e-6)', 'if(time-lastDrop<.6-1e-6)')
old="try{for(const b of bodies)if(!b.danceDown)drawBody(b);layer.globalCompositeOperation='destination-in';layer.drawImage(__railMatte,0,0,W,H);}"
new="""try{for(const b of bodies)if(!b.danceDown){
  const t=b.rb.translation();
  if(t.z/M-b.r>=LEDGE_BACK-.5)drawBody(b);
  else{layer.save();layer.beginPath();layer.rect(-1000,218,3000,3000);layer.clip();drawBody(b);layer.restore();}
 }}"""
assert old in s
s=s.replace(old,new)
(p/'draft.html').write_text(s,encoding='utf-8')
