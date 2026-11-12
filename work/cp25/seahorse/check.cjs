const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),assert=require('assert/strict');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const out='tickets/CP-25-evidence/seahorse/';
function center(r){return {x:r.x+r.w/2,y:r.y+r.h/2};}
function drag(g,a,id,target){const geo=a.collectionGeometry(),p=center(geo.items.find(r=>r.id===id)),q=center(geo.slots.find(r=>r.id===target));g.pointer('pointerdown',p.x,p.y);g.pointer('pointermove',q.x,q.y);g.pointer('pointerup',q.x,q.y);}
(async()=>{const storage={},g=await make({sourceFile:path.resolve('work/cp25/seahorse/draft.html'),storage,render:true,height:888.889}),a=g.c.__game;
g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();a.S.got={cheese:2,shrimp:2,tuna:2};a.S.coins=220;a.openLoopScreen('water');
const geo=a.collectionGeometry();for(const r of geo.slots){assert(r.x>=geo.scene.x&&r.y>=geo.scene.y);assert(r.x+r.w<=geo.scene.x+geo.scene.w&&r.y+r.h<=geo.scene.y+geo.scene.h);}
assert(geo.slots.find(r=>r.id==='seahorse').future);assert(!a.placeItem('seahorse'));assert.equal(geo.slots.length,7);assert(geo.slots.find(r=>r.id==='clam').future);assert(geo.slots.find(r=>r.id==='kelp').future);
g.snapshot(out+'water-phone.png');
const inline=native.createCanvas(540,1200);inline.getContext('2d').drawImage(await native.loadImage(out+'water-phone.png'),0,0,540,1200);fs.writeFileSync(out+'water-inline.png',inline.toBuffer('image/png'));
drag(g,a,'tuna','clam');assert.equal(a.S.got.tuna,2);assert(!a.placeItem('clam'));
drag(g,a,'tuna','tuna');assert.equal(a.S.got.tuna,1);assert(a.placements.tuna);assert.equal(a.S.coins,220);
drag(g,a,'shrimp','shrimp');assert(a.collectionPaid.water);assert.equal(a.S.coins,320);for(let i=0;i<50;i++)g.tick();g.snapshot(out+'water-payoff-phone.png');for(let i=0;i<125;i++)g.tick();g.snapshot(out+'water-filled-phone.png');
drag(g,a,'shrimp','shrimp');assert.equal(a.S.coins,320);assert.equal(a.S.got.shrimp,1);
a.save();g.close();const again=await make({sourceFile:path.resolve('work/cp25/seahorse/draft.html'),storage});assert(again.c.__game.placements.tuna&&again.c.__game.placements.shrimp&&again.c.__game.collectionPaid.water);assert.equal(again.c.__game.S.coins,320);again.close();
fs.writeFileSync(out+'layout-lock.json',JSON.stringify({canvas:[400,888.889],geometry:geo,approvedBackground:'water-scene-v1.png',newFutureOutlines:['seahorse']},null,2));
fs.writeFileSync(out+'checks.json',JSON.stringify({passed:['All natural slots fit inside fixed scene and above satchel','Future outlines reject placement and never block completion','Real drag matches tuna/shrimp and consumes one each; wrong drag preserves inventory','Completion pays 100 once and persists placements/purse/paid state']},null,2));console.log('4 Water checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
