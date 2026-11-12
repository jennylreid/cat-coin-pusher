const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const g=await make({sourceFile:path.resolve('work/cp25/scene-one/release.html'),render:true});
 for(const id of ['tuna','shrimp']){const sprite=native.createCanvas(360,260),c=sprite.getContext('2d');c.translate(180,130);g.c.outlineCtx=c;
 vm.runInContext(`{const previous=ctx;ctx=outlineCtx;drawPrize('item','${id}',0,44,1.7);ctx=previous;}`,g.c);
 const src=c.getImageData(0,0,360,260).data,result=native.createCanvas(360,260),rc=result.getContext('2d'),pixels=rc.createImageData(360,260);
 for(let y=3;y<257;y++)for(let x=3;x<357;x++){let lo=255,hi=0;for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3],[0,0]]){const alpha=src[((y+dy)*360+x+dx)*4+3];lo=Math.min(lo,alpha);hi=Math.max(hi,alpha);}if(hi>100&&lo<100)pixels.data.set([226,249,243,235],(y*360+x)*4);}
 rc.putImageData(pixels,0,0);fs.writeFileSync('work/cp25/water/art/'+id+'-outline.png',result.toBuffer('image/png'));}
 g.close();console.log('Derived outlines exported; original sprites untouched');})().catch(e=>{console.error(e);process.exitCode=1});
