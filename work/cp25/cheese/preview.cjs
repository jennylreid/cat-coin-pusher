// Cheese is approval-only until Jenny approves this single background painting.
const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const out='tickets/CP-25-evidence/cheese/',art='work/cp25/cheese/art/';
(async()=>{const g=await make({sourceFile:path.resolve('work/cp25/water/release.html'),render:true,height:888.889}),a=g.c.__game;
g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();
vm.runInContext(`const previousGeometry=collectionGeometry;collectionGeometry=function(){const g=previousGeometry();if(loopScreen!=='cheese')return g;const scene={x:g.left,y:g.top+126,w:g.right-g.left,h:g.satchel.y-42-(g.top+126)};return {...g,scene,slots:[['cheese',.30,.40,.40,.26],['mouse',.72,.84,.32,.17]].map(([id,u,v,w,h])=>({id,x:scene.x+(u-w/2)*scene.w,y:scene.y+(v-h/2)*scene.h,w:w*scene.w,h:h*scene.h,future:id==='mouse'}))};};`,g.c);
// Contour derived from the approved cheese sprite, without modifying it.
const sprite=native.createCanvas(360,260),c=sprite.getContext('2d');c.translate(180,130);g.c.outlineCtx=c;
vm.runInContext(`{const previous=ctx;ctx=outlineCtx;drawPrize('item','cheese',0,44,1.7);ctx=previous;}`,g.c);
const src=c.getImageData(0,0,360,260).data,outline=native.createCanvas(360,260),oc=outline.getContext('2d'),pixels=oc.createImageData(360,260);
for(let y=3;y<257;y++)for(let x=3;x<357;x++){let lo=255,hi=0;for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3],[0,0]]){const alpha=src[((y+dy)*360+x+dx)*4+3];lo=Math.min(lo,alpha);hi=Math.max(hi,alpha);}if(hi>100&&lo<100)pixels.data.set([255,241,206,245],(y*360+x)*4);}
oc.putImageData(pixels,0,0);g.c.cheeseOutline=outline;vm.runInContext('ART.collectionOutlines.cheese=cheeseOutline;',g.c);fs.writeFileSync(art+'cheese-outline.png',outline.toBuffer('image/png'));
let draw=vm.runInContext('drawWaterInventory.toString()',g.c).replace('drawWaterInventory','drawCheesePreview');
draw=draw.replace('ctx.drawImage(ART.waterScene,sc.x,sc.y,sc.w,sc.h);', "if(globalThis.cheesePainting)ctx.drawImage(cheesePainting,sc.x,sc.y,sc.w,sc.h);else{ctx.fillStyle='#b18a62';ctx.fillRect(sc.x,sc.y,sc.w,sc.h);ctx.fillStyle='#634d36';ctx.fillRect(sc.x,sc.y+sc.h*.49,sc.w,sc.h*.29);ctx.fillStyle='#c7af8c';ctx.fillRect(sc.x,sc.y+sc.h*.78,sc.w,sc.h*.22);}");
vm.runInContext(draw+';drawInventory=drawCheesePreview;',g.c);
a.S.got={cheese:2,shrimp:1,tuna:1};a.openLoopScreen('cheese');const geo=vm.runInContext('collectionGeometry()',g.c);
if(fs.existsSync(art+'cheese-scene-v1.png')){g.c.cheesePainting=await native.loadImage(art+'cheese-scene-v1.png');g.snapshot(out+'cheese-art-phone.png');vm.runInContext('placements.cheese=true;',g.c);g.snapshot(out+'cheese-filled-phone.png');const inline=native.createCanvas(540,1200);inline.getContext('2d').drawImage(await native.loadImage(out+'cheese-art-phone.png'),0,0,540,1200);fs.writeFileSync(out+'cheese-art-inline.png',inline.toBuffer('image/png'));}
else{
fs.writeFileSync(out+'layout-lock.json',JSON.stringify({canvas:[400,888.889],geometry:geo,counterSurface:.49,floorStarts:.78,registration:'Painting fills scene only. Cheese on left counter, toy mouse on lower-right floor. Frame/tabs/satchel unchanged.'},null,2));g.snapshot(out+'cheese-layout-phone.png');
const t=native.createCanvas(1024,1440),tc=t.getContext('2d');tc.fillStyle='#b18a62';tc.fillRect(0,0,1024,1440);tc.fillStyle='#634d36';tc.fillRect(0,1440*.49,1024,1440*.29);tc.fillStyle='#c7af8c';tc.fillRect(0,1440*.78,1024,1440*.22);tc.strokeStyle='#fff2cf';tc.lineWidth=3;tc.setLineDash([12,10]);for(const s of geo.slots)tc.strokeRect((s.x-geo.scene.x)/geo.scene.w*1024,(s.y-geo.scene.y)/geo.scene.h*1440,s.w/geo.scene.w*1024,s.h/geo.scene.h*1440);fs.writeFileSync(art+'layout-template.png',t.toBuffer('image/png'));
}
g.close();console.log('Cheese actual-game layout/approval preview rendered');})().catch(e=>{console.error(e);process.exitCode=1});
