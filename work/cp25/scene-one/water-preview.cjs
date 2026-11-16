// Approval-only renderer: scene layout and painting never enter the published UAT6 payload.
const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const out='tickets/CP-25-evidence/scene-one/',art='work/cp25/scene-one/art/';
(async()=>{
 const g=await make({sourceFile:path.resolve('work/cp25/scene-one/release.html'),render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();
 const code=`
 const originalCollectionGeometry=collectionGeometry;
 collectionGeometry=function(){const g=originalCollectionGeometry(),scene={x:g.left,y:g.top+126,w:g.right-g.left,h:g.satchel.y-42-(g.top+126)};
 const anchors=[['tuna',.28,.38,.42,.24],['shrimp',.73,.64,.30,.23],['sardine',.70,.19,.31,.16],['crab',.28,.83,.32,.19]];
 return {...g,scene,slots:anchors.map(([id,u,v,w,h])=>({id,x:scene.x+(u-w/2)*scene.w,y:scene.y+(v-h/2)*scene.h,w:w*scene.w,h:h*scene.h,future:['sardine','crab'].includes(id)}))};};
 `;
 vm.runInContext(code,g.c);a.S.got={cheese:2,shrimp:2,tuna:2};a.openLoopScreen('water');
 let draw=vm.runInContext('drawInventory.toString()',g.c);
 draw=draw.replace("g.slots.forEach(r=>{",`ctx.save();const sc=g.scene;ctx.beginPath();ctx.rect(sc.x,sc.y,sc.w,sc.h);ctx.clip();if(globalThis.waterPainting)ctx.drawImage(waterPainting,sc.x,sc.y,sc.w,sc.h);else{ctx.fillStyle='#146f80';ctx.fillRect(sc.x,sc.y,sc.w,sc.h);ctx.fillStyle='#c0a773';ctx.fillRect(sc.x,sc.y+sc.h*.74,sc.w,sc.h*.26);}ctx.restore();g.slots.forEach(r=>{`);
 draw=draw.replace(/ctx.fillStyle=hover\?'#685174':[\s\S]*?ctx.strokeRect\(r.x\+2,r.y\+2,r.w-4,r.h-4\);/,"if(hover){ctx.strokeStyle='#ffe29a';ctx.lineWidth=2;ctx.strokeRect(r.x,r.y,r.w,r.h);}");
 draw=draw.replace("Math.min(1.4,(r.h-48)/85)","Math.min(1.2,r.w/135,r.h/100)");
 draw=draw.replace("else shadowPrize(r.id,0,0);","else if(globalThis.slotOutlines)ctx.drawImage(slotOutlines[r.id],-90,-65,180,130);else shadowPrize(r.id,0,0);");
 draw=draw.replace("ctx.fillText(PRIZE_NAMES[r.id],x,r.y+r.h-33)","ctx.fillText(PRIZE_NAMES[r.id],x,r.y+r.h+7)");
 draw=draw.replace("ctx.fillText(r.future?'Future prize':placements[r.id]?'Placed':'Drop here',x,r.y+r.h-14)","ctx.fillText(r.future?'Future prize':placements[r.id]?'Placed':'Drop here',x,r.y+r.h+24)");
 draw=draw.replace("ctx.restore();ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';", "ctx.restore();ctx.shadowColor='#102f42';ctx.shadowBlur=4;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';");
 draw=draw.replace("ctx.fillText(r.future?'Future prize':placements[r.id]?'Placed':'Drop here',x,r.y+r.h+24);", "ctx.fillText(r.future?'Future prize':placements[r.id]?'Placed':'Drop here',x,r.y+r.h+24);ctx.shadowBlur=0;");
 vm.runInContext('drawInventory='+draw,g.c);
 // Derive an outline from the frozen sprites without changing the original art.
 g.c.slotOutlines={};
 for(const id of ['tuna','shrimp']){
  const sprite=native.createCanvas(360,260),c=sprite.getContext('2d');c.translate(180,130);g.c.outlineCtx=c;
  vm.runInContext(`{const previous=ctx;ctx=outlineCtx;drawPrize('item','${id}',0,44,1.7);ctx=previous;}`,g.c);
  const im=c.getImageData(0,0,360,260),src=im.data,result=native.createCanvas(360,260),rc=result.getContext('2d'),pixels=rc.createImageData(360,260);
  for(let y=3;y<257;y++)for(let x=3;x<357;x++){let lo=255,hi=0;for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3],[0,0]]){const alpha=src[((y+dy)*360+x+dx)*4+3];lo=Math.min(lo,alpha);hi=Math.max(hi,alpha);}if(hi>100&&lo<100){const i=(y*360+x)*4;pixels.data.set([226,249,243,235],i);}}
  rc.putImageData(pixels,0,0);g.c.slotOutlines[id]=result;
 }
 if(fs.existsSync(art+'water-scene-v1.png'))g.c.waterPainting=await native.loadImage(art+'water-scene-v1.png');
 const geo=vm.runInContext('collectionGeometry()',g.c);
 if(!g.c.waterPainting){
  fs.writeFileSync(out+'water-layout-lock.json',JSON.stringify({canvas:[400,888.889],geometry:geo,registration:'Only scene rectangle is painted; fixed frame, tabs, slot anchors and bottom satchel are runtime UI. Original sprites unchanged.'},null,2));
  g.snapshot(out+'water-layout-phone.png');
  // Extract only the locked scene rectangle, without UI, as the painting template.
  const template=native.createCanvas(1024,1440),tc=template.getContext('2d');tc.fillStyle='#146f80';tc.fillRect(0,0,1024,1440);tc.fillStyle='#c0a773';tc.fillRect(0,1440*.74,1024,1440*.26);
  tc.strokeStyle='#e7fbf7';tc.lineWidth=3;tc.setLineDash([12,10]);
  for(const s of geo.slots){tc.strokeRect((s.x-geo.scene.x)/geo.scene.w*1024,(s.y-geo.scene.y)/geo.scene.h*1440,s.w/geo.scene.w*1024,s.h/geo.scene.h*1440);}
  fs.writeFileSync(art+'water-layout-template.png',template.toBuffer('image/png'));
 }else{
  g.snapshot(out+'water-art-phone.png');
  vm.runInContext('placements.tuna=true;placements.shrimp=true;',g.c);g.snapshot(out+'water-filled-phone.png');
  const inline=native.createCanvas(540,1200),ic=inline.getContext('2d');ic.drawImage(await native.loadImage(out+'water-art-phone.png'),0,0,540,1200);fs.writeFileSync(out+'water-art-inline.png',inline.toBuffer('image/png'));
 }
 g.close();console.log('Water approval-only preview rendered');
})().catch(e=>{console.error(e);process.exitCode=1});



