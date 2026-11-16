// CP-21: the table filled with straight rows of coins side by side (as many as fit each row), to show its shape.
// Usage: node rows.cjs <html> <out.png>
const fs=require('fs'),path=require('path'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
native.GlobalFonts.registerFromPath('C:/Windows/Fonts/seguisym.ttf','system-ui');
(async()=>{const [src,out]=process.argv.slice(2);
 const staged=path.join(payload,'render-'+path.basename(src));fs.copyFileSync(src,staged);
 const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;
 g.c.__loadImage=s=>native.loadImage(path.join(payload,s));await g.c.loadArt();g.c.__game.selectBoard(0);
 const rows=vm.runInContext(`for(const b of bodies)world.removeRigidBody(b.rb);bodies.length=0;
  const hw=typeof tableHalfAt==='function'?tableHalfAt:()=>(T.R-T.L)/2,d=COIN_R*2+1,rows=[];
  const put=(y,h,max)=>{const n=Math.min(max,Math.floor(2*Math.min(hw(y-COIN_R),hw(Math.min(T.FRONT,y+COIN_R)))/d));for(let i=0;i<n;i++)addCoin('coin',null,200+(i-(n-1)/2)*d,h,y,yawTurn(0));rows.push(n);};
  put(pusherY-COIN_R-2,TONGUE_H+COIN_HALF+.2,99);
  for(let y=pusherY+COIN_R+2;y+COIN_R<=T.FRONT;y+=d)put(y,COIN_HALF+.2,99);rows`,g.c);
 g.snapshot(out);g.close();console.log('rows back to front:',rows.join(' '));
})().catch(e=>{console.error(e);process.exitCode=1});
