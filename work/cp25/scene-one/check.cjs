const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),assert=require('assert/strict'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const storage={},g=await make({sourceFile:path.resolve('work/cp25/scene-one/draft.html'),storage,render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();
 a.S.got.cheese=2;a.S.coins=200;a.openLoopScreen('cheese');const count=a.bodies.length;
 a.placeItem('cheese');assert.equal(a.S.coins,250);assert.equal(a.collectionPurseDisplay(),200);assert(a.pendingCollectionDance);
 for(let i=0;i<60;i++)g.tick();g.snapshot('tickets/CP-25-evidence/scene-one/payoff-phone.png');
 for(let i=0;i<70;i++)g.tick();assert.equal(a.collectionPurseDisplay(),250);assert.equal(a.bodies.length,count);
 a.closeInventory();assert(a.collectionDance);assert(!a.pendingCollectionDance);
 assert.equal(vm.runInContext('danceShakesTable',g.c),false);
 g.snapshot('tickets/CP-25-evidence/scene-one/return-dance-phone.png');
 for(let i=0;i<280;i++)g.tick();assert.equal(a.collectionDance,null);assert.equal(vm.runInContext('danceShakesTable',g.c),true);
 a.openLoopScreen('cheese');a.placeItem('cheese');assert.equal(a.S.coins,250);a.save();g.close();
 const reopened=await make({sourceFile:path.resolve('work/cp25/scene-one/draft.html'),storage});assert.equal(reopened.c.__game.S.coins,250);assert(!reopened.c.__game.pendingCollectionDance);reopened.close();
 fs.writeFileSync('tickets/CP-25-evidence/scene-one/checks.json',JSON.stringify({passed:['Atomic reward persists once; cosmetic purse reaches credited total','Flying coins add no physical bodies','Approved return dance lasts 4.4 seconds, disables table shake and restores it','Paid collection and consumed return reaction survive reload']},null,2));console.log('4 payoff checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
