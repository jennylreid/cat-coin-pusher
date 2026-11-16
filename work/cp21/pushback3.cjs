// CP-21: opening board without taps: frames at pusher back/forward, and how far start coins move in 8 s. Usage: node pushback.cjs <html> <outprefix> <board>
const fs=require('fs'),path=require('path'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
native.GlobalFonts.registerFromPath('C:/Windows/Fonts/seguisym.ttf','system-ui');
(async()=>{const [src,out,board='0']=process.argv.slice(2);
 const staged=path.join(payload,'pb-'+path.basename(src));fs.copyFileSync(src,staged);
 const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;
 g.c.__loadImage=s=>native.loadImage(path.join(payload,s));await g.c.loadArt();g.c.__game.selectBoard(+board);
 const pos=()=>JSON.parse(vm.runInContext("JSON.stringify(Object.fromEntries(bodies.map(b=>{const p=b.rb.translation();return [b.rb.handle,[p.x/M,p.z/M]]})))",g.c));
 g.tick();const p0=pos();g.snapshot(out+'-back.png');
 let max=0,moved=new Set(),big=[];
 for(let i=1;i<480;i++){g.tick();if(i==96)g.snapshot(out+"-forward.png");if(i==48)g.snapshot(out+"-mid.png");const p=pos();let m=0;for(const k in p0){if(!p[k]){moved.add(k);continue}{const dd=Math.hypot(p[k][0]-p0[k][0],p[k][1]-p0[k][1]);if(dd>3)moved.add(k);if(dd>60&&!big.includes(k))big.push(k);m=Math.max(m,dd)}}max=Math.max(max,m)}
 console.log(JSON.stringify({src,board,bodies:Object.keys(p0).length,maxMove:+max.toFixed(1),moved:moved.size,big:big.length,pusher:vm.runInContext("[PUSH_MIN,PUSH_MAX,Math.round(pusherY)]",g.c)}));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
