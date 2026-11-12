// Approval-only rendering. This never changes release.html, the JSON package or assets.
const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const g=await make({sourceFile:path.resolve('work/cp25/stage3/release.html'),render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();const out='tickets/CP-25-evidence/stage3/art/';
 const candidate=await native.loadImage('work/cp25/stage3/art/collections-satchel-v1.png');g.c.__candidate=candidate;
 const alpha=native.createCanvas(candidate.width,candidate.height),ac=alpha.getContext('2d');ac.drawImage(candidate,0,0);const pixels=ac.getImageData(0,0,candidate.width,candidate.height).data;
 assert.equal(pixels[3],0);assert.equal(pixels[(candidate.width-1)*4+3],0);
 g.snapshot(out+'registered-before.png');const cv=g.c.document.getElementById('cv'),before=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
 vm.runInContext('drawCollectionsTile=function(){const b=collectionsTile();ctx.save();ctx.drawImage(__candidate,b.x,b.y,b.w,b.h);ctx.restore();};',g.c);
 g.snapshot(out+'collections-tile-phone-preview.png');const after=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data,b=a.collectionsTile(),s=2.7;
 let outside=0,inside=0;for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){const i=(y*cv.width+x)*4;if(before[i]===after[i]&&before[i+1]===after[i+1]&&before[i+2]===after[i+2]&&before[i+3]===after[i+3])continue;if(x>=Math.floor(b.x*s)&&x<Math.ceil((b.x+b.w)*s)&&y>=Math.floor(b.y*s)&&y<Math.ceil((b.y+b.h)*s))inside++;else outside++;}
 assert.equal(outside,0);assert(inside>0);
 fs.writeFileSync(out+'preview-validation.json',JSON.stringify({status:'approval-only; not integrated or published',candidateCanvas:[candidate.width,candidate.height],logicalCanvas:[44,44],gameRect:b,phoneCanvas:[cv.width,cv.height],transparentCornerAlpha:0,changedPixelsInsideTile:inside,changedPixelsOutsideTile:outside,prompt:'work/cp25/stage3/art/tile-prompt.txt',generator:'built-in imagegen'},null,2));g.c.devicePixelRatio=1.35;g.c.resize();g.snapshot(out+'collections-tile-phone-inline.png');g.close();console.log('Phone preview captured; zero changed pixels outside existing tile');
})().catch(e=>{console.error(e);process.exitCode=1});
