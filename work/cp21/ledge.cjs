// CP-21: a coin dropped on the ledge (pusher) — frames as the pusher carries it back. Usage: node ledge.cjs <html> <outprefix> [x]
const fs=require('fs'),path=require('path'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
(async()=>{const [src,out,x='230']=process.argv.slice(2);
 const staged=path.join(payload,'render-'+path.basename(src));fs.copyFileSync(src,staged);const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;
 g.c.__loadImage=s=>native.loadImage(path.join(payload,s));await g.c.loadArt();g.c.__game.selectBoard(0);
 for(let i=0;i<120;i++)g.tick();
 // wait until the pusher is near its front, then drop one coin on it
 let n=0;while(vm.runInContext('pusherY',g.c)<PUSHMAX(g)-3&&n<400){g.tick();n++;}
 vm.runInContext(`tryDrop({x:${x},y:DROP_Y})`,g.c);
 const log=[];for(let f=0;f<300;f++){g.tick();if(f%30===0){g.snapshot(out+'-'+f+'.png');}
  if(f%10===0)log.push(vm.runInContext(`(()=>{const b=globalThis.__probe||(globalThis.__probe=bodies.reduce((a,c)=>c.uid>a.uid?c:a));if(b.dead)return {f:${f},dead:true};const t=b.rb.translation();return {f:${f},pusherY:+pusherY.toFixed(1),depth:+(t.z/M).toFixed(1),h:+(t.y/M).toFixed(1),x:+(t.x/M).toFixed(1),dead:b.dead}})()`,g.c));}
 console.log(JSON.stringify(log));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
function PUSHMAX(g){return vm.runInContext('PUSH_MAX',g.c);}
