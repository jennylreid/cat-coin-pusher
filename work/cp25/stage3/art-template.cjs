const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const g=await make({sourceFile:path.resolve('work/cp25/stage3/release.html'),render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();g.snapshot('tickets/CP-25-evidence/stage3/art/locked-phone-template.png');
 const canvas=native.createCanvas(512,512),c=canvas.getContext('2d'),tile=a.collectionsTile();
 c.scale(512/44,512/44);c.translate(-tile.x,-tile.y);g.c.__tileCtx=c;
 vm.runInContext('{const previous=ctx;ctx=__tileCtx;drawCollectionsTile();ctx=previous;}',g.c);
 fs.writeFileSync('work/cp25/stage3/art/tile-template.png',canvas.toBuffer('image/png'));
 fs.writeFileSync('tickets/CP-25-evidence/stage3/art/layout-lock.json',JSON.stringify({piece:'Collections tile only',logicalCanvas:[44,44],templateCanvas:[512,512],gameRect:tile,registration:'Keep exact gameRect; no table/camera/paw/head changes. Candidate is approval-only and must not enter the update package.',scenes:'Water/Cheese layouts must be locked as real-game templates before those pieces are painted.'},null,2));g.close();console.log('Tile layout lock and real-game phone template captured');
})().catch(e=>{console.error(e);process.exitCode=1});
