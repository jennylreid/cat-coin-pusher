const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path');
const SRC=path.resolve(process.argv[2]||'release.html'),OUT=path.resolve(process.argv[3]||'../../tickets/CP-33-evidence');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const g=await make({sourceFile:SRC,render:true,height:888.889});g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(0);S.coins=200;board.status="playing";');
 for(let i=0;i<60;i++)g.tick();
 g.snapshot(path.join(OUT,'probe-board.png'));
 console.log(JSON.stringify({so:run('(()=>{const p=screenOf(200,T.FRONT,0),q=screenOf(60,T.FRONT,0);return [p,200+(p.x-200)*VIEW.z,VIEW.y+p.y*VIEW.zy,q,200+(q.x-200)*VIEW.z,VIEW.y+q.y*VIEW.zy,__camera,scale,renderPixelRatio]})()'),view:a.view,tile:a.inventoryButton(),front:run('(()=>{const p=proj(200,T.FRONT);return {x:200+(p.x-200)*VIEW.z,y:VIEW.y+p.y*VIEW.zy,s:p.s}})()'),H:run('H'),W:run('W'),filter:'filter' in run('ctx')}));
})();
