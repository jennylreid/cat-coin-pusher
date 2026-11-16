const make=require('../runtime.cjs'),vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const g=await make({sourceFile:'work/cp25/clear-order/release.html'}),c=g.c;
 const run=s=>vm.runInContext(s,c);const states=[];
 run("callouts=[];treatAwards.length=0;itemToasts=[];sweepTime=0;catquakeTime=0;sweetUntil=Infinity;board.status='playing';finishBoard('won');treatAwards.push({id:'cheese'});");
 run('calloutTick(1)');assert.equal(run('callouts[0].started'),false);assert.equal(run('isRestPose()'),false);states.push('Waiting for final pickup: no Rest, message queued');
 run('treatAwards.length=0;calloutTick(.1)');assert.equal(run('callouts[0].started'),true);assert.equal(run('isRestPose()'),false);states.push('BOARD CLEAR starts before Rest');run('happyUntil=time+1');assert.equal(run('powerFace()'),'happy');run('happyUntil=0');
 run('calloutTick(2)');assert.equal(run('isRestPose()'),false);assert.equal(run('callouts.length'),1);
 run('calloutTick(.11)');assert.equal(run('callouts.length'),0);assert.equal(run('isRestPose()'),true);states.push('Message finishes, then Rest');
 const old=run('boardIndex');run('boardTick(1)');assert.equal(run('boardIndex'),old);assert.equal(run('isRestPose()'),true);run('boardTick(1.01)');assert.notEqual(run('boardIndex'),old);assert.equal(run('isRestPose()'),false);states.push('Existing two-second Rest interval, then next board');
 run("board.status='won';save();load();");assert(run("callouts.some(c=>c.word==='BOARD CLEAR!')"));assert.equal(run('isRestPose()'),false);run('calloutTick(2.3)');assert.equal(run('isRestPose()'),true);states.push('Restored won board repeats message before Rest');
 g.close();fs.writeFileSync('tickets/CP-25-evidence/clear-order/checks.json',JSON.stringify({passed:states,scope:'Real game runtime sequence; no phone timing claim'},null,2));console.log(states);
})();

