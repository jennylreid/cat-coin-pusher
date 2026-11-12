const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),assert=require('assert/strict');
const src=path.resolve(process.argv[2]||'work/cp25/stage3/draft.html'),out='tickets/CP-25-evidence/stage3/';
function point(r){return {x:r.x+r.w/2,y:r.y+r.h/2};}
function pointer(g,type,p,id=1){g.c.document.getElementById('cv').handlers[type]({clientX:p.x,clientY:p.y,pointerId:id});}
function drag(g,a,id,target,{cancel=false,wrongPointer=false}={}){
 const r=a.collectionGeometry(),from=point(r.items.find(x=>x.id===id)),to=point(r.slots.find(x=>x.id===target));
 pointer(g,'pointerdown',from);pointer(g,'pointermove',to,wrongPointer?2:1);pointer(g,cancel?'pointercancel':'pointerup',to);
}
(async()=>{
 const passed=[],storage={};let g=await make({sourceFile:path.resolve('work/cp25/stage2/release.html'),storage}),a=g.c.__game;
 a.selectBoard(2);a.S.got={cheese:2,shrimp:2,tuna:1};a.S.coins=330;a.save();g.close();
 g=await make({sourceFile:src,storage});a=g.c.__game;
 assert.equal(a.boardIndex,2);assert.equal(a.S.coins,330);assert.equal(a.S.got.tuna,1);assert.equal(a.collectionPaid.water,false);
 const tile=a.collectionsTile();pointer(g,'pointerdown',point(tile));assert.equal(a.inventoryOpen,true);assert.equal(a.board.used,0);
 let geo=a.collectionGeometry();assert(geo.satchel.y>geo.slots.at(-1).y+geo.slots.at(-1).h);assert(geo.satchel.y+geo.satchel.h<=geo.bottom);
 const from=point(geo.items.find(x=>x.id==='tuna')),to=point(geo.slots.find(x=>x.id==='tuna'));
 pointer(g,'pointerdown',from);pointer(g,'pointerup',from);pointer(g,'pointerdown',to);pointer(g,'pointerup',to);
 assert.equal(a.placements.tuna,false);assert.equal(a.S.got.tuna,1);passed.push('Side tile opens full collection screen without a drop; satchel sits below all slots; tap-tap cannot place');
 drag(g,a,'tuna','shrimp');assert.equal(a.S.got.tuna,1);assert.equal(a.placements.tuna,false);
 drag(g,a,'tuna','tuna',{cancel:true});assert.equal(a.placements.tuna,false);
 drag(g,a,'tuna','tuna',{wrongPointer:true});assert.equal(a.placements.tuna,false);
 drag(g,a,'tuna','tuna');assert.equal(a.placements.tuna,true);assert.equal(a.S.got.tuna,0);assert.equal(a.S.coins,330);assert.equal(a.board.used,0);
 a.save();g.close();g=await make({sourceFile:src,storage});a=g.c.__game;assert.equal(a.placements.tuna,true);a.openLoopScreen('water');drag(g,a,'shrimp','shrimp');assert.equal(a.collectionPaid.water,true);assert.equal(a.S.coins,430);assert.equal(a.S.got.shrimp,1);
 drag(g,a,'shrimp','shrimp');assert.equal(a.S.coins,430);assert.equal(a.S.got.shrimp,1);
 a.openLoopScreen('cheese');drag(g,a,'cheese','mouse');assert.equal(a.placements.cheese,false);drag(g,a,'cheese','cheese');assert.equal(a.placements.cheese,true);assert.equal(a.S.got.cheese,1);assert.equal(a.S.coins,480);
 a.save();g.close();g=await make({sourceFile:src,storage});a=g.c.__game;assert(a.collectionPaid.water&&a.collectionPaid.cheese);assert.equal(a.S.coins,480);
 passed.push('Only matching drag consumes one item; wrong/cancelled/other-pointer gestures consume nothing; future/filled slots reject; partial/full placement and one-time rewards persist');
 // A front-edge win uses the actual payout path and credits inventory before presentation.
 a.selectBoard(0);a.S.got={cheese:0,shrimp:0,tuna:0};a.tryDrop({x:200});
 const b=a.bodies.find(x=>x.id==='cheese');b.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(b,200);a.fallOff(b,200);
 assert.equal(a.S.got.cheese,1);assert.equal(a.treatAwards.length,1);assert.equal(a.treatAwards[0].id,'cheese');
 const time=g.inspect().time;for(let f=0;f<30;f++)g.tick();assert(g.inspect().time>time);assert.equal(a.treatAwards.length,1);
 const used=a.board.used;pointer(g,'pointerdown',{x:200,y:450});pointer(g,'pointerup',{x:200,y:450});assert.equal(a.board.used,used);assert.equal(a.treatAwards.length,0);
 passed.push('Actual front-edge treat credits once and queues popup; board continues beneath it; dismiss tap and release never drop a coin');
 a.queueTreatAward('shrimp');a.queueTreatAward('tuna');for(let f=0;f<119;f++)g.tick();assert.equal(a.treatAwards.length,2);for(let f=0;f<2;f++)g.tick();assert.equal(a.treatAwards.length,1);assert.equal(a.treatAwards[0].id,'tuna');
 pointer(g,'pointerdown',{x:200,y:450});pointer(g,'pointerup',{x:200,y:450});assert.equal(a.treatAwards.length,0);assert.equal(a.board.used,used);
 const lost=a.bodies.find(x=>x.id==='shrimp');a.gutterOff(lost,390);assert.equal(a.S.got.shrimp,0);assert.equal(a.treatAwards.length,0);
 passed.push('Popups display one at a time for about two seconds each; tap advances only one; side loss gives neither popup nor inventory');
 a.selectBoard(0);for(const id of ['cheese','shrimp']){const b=a.bodies.find(b=>b.id===id);b.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(b,200);}
 assert.equal(a.treatAwards.length,2);for(let f=0;f<239;f++)g.tick();assert.equal(a.boardIndex,0);assert(a.treatAwards.length>0);for(let f=0;f<360;f++)g.tick();assert.equal(a.treatAwards.length,0);assert.equal(a.boardIndex,1);
 passed.push('Two queued winning treats finish their popups before board-clear feedback and automatic next-board advance');
 g.close();fs.writeFileSync(out+'interaction-checks.json',JSON.stringify({passed},null,2));console.log(passed.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1});

