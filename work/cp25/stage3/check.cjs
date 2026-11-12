const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),assert=require('assert/strict'),vm=require('vm');
(async()=>{
 const g=await make({sourceFile:path.resolve(process.argv[2]||'work/cp25/stage3/draft.html')}),a=g.c.__game,passed=[];
 let displays=0;a.sfx.itemCollected=()=>{displays++;};a.queueTreatAward('cheese');a.queueTreatAward('shrimp');assert.equal(displays,1);
 for(let f=0;f<119;f++)g.tick();assert.equal(displays,1);g.tick();g.tick();assert.equal(displays,2);assert.equal(a.treatAwards[0].id,'shrimp');g.tick();g.tick();assert.equal(displays,2);
 const used=a.board.used;g.pointer('pointerdown',200,450);g.pointer('pointerup',200,450);assert.equal(a.treatAwards.length,0);assert.equal(a.board.used,used);assert.equal(displays,2);
 passed.push('Two-second individual queue and tap-away retained; dismissal charges no coin; one pickup sound per visible item, never per frame');
 a.queueTreatAward('cheese');const calls=[];g.c.__awardCtx=new Proxy({globalAlpha:1},{get:(o,k)=>k in o?o[k]:(...args)=>calls.push({method:k,args,alpha:o.globalAlpha,fill:o.fillStyle}),set:(o,k,v)=>(o[k]=v,true)});
 const prize=g.c.drawPrize;g.c.drawPrize=(...args)=>calls.push({method:'item',args,alpha:g.c.__awardCtx.globalAlpha});
 vm.runInContext('{const previous=ctx;ctx=__awardCtx;drawTreatAward();ctx=previous;}',g.c);g.c.drawPrize=prize;
 assert.equal(calls.filter(x=>x.method==='fillText'||x.method==='strokeText'||x.method==='strokeRect').length,0);
 const fills=calls.filter(x=>x.method==='fillRect');assert.equal(fills.length,1);assert.equal(fills[0].fill,'rgba(12,7,20,.28)');assert.equal(calls.find(x=>x.method==='item').alpha,1);
 passed.push('Award draws one translucent backdrop and opaque existing sprite, with no text, frame, opaque card or queue count');g.close();
 // Trace the actual Web Audio method, not a substitute sound function.
 const q=await make({sourceFile:path.resolve(process.argv[2]||'work/cp25/stage3/draft.html')}),b=q.c.__game,notes=[];
 class Param{setValueAtTime(){}exponentialRampToValueAtTime(){}}
 class AC{constructor(){this.currentTime=0;this.sampleRate=44100;this.destination={};this.state='running';}createGain(){return {gain:new Param(),connect(){}};}createBuffer(c,n){return {getChannelData:()=>new Float32Array(n)};}createOscillator(){const note={};notes.push(note);return {frequency:{setValueAtTime(f,t){note.frequency=f;note.at=t;},exponentialRampToValueAtTime(){}},connect(){},start(t){note.start=t;},stop(t){note.stop=t;}};}}
 q.c.AudioContext=AC;b.S.muted=false;b.sfx.itemCollected();assert.equal(notes.length,3);assert.deepEqual(notes.map(n=>n.frequency),[659.25,830.61,1318.51]);assert(notes.at(-1).stop<.42);
 b.S.muted=true;b.sfx.itemCollected();assert.equal(notes.length,3);b.S.muted=false;q.c.document.hidden=true;b.sfx.itemCollected();assert.equal(notes.length,3);
 passed.push('Actual chime schedules three soft sine notes in under 0.42 seconds and respects mute/hidden state');q.close();
 fs.writeFileSync('tickets/CP-25-evidence/stage3/checks.json',JSON.stringify({passed,notes},null,2));console.log(passed.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1});

