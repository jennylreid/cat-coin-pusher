// CP-51 probe: a UAT round's top bar at one size; prints the HUD rects.
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]),out=process.argv[3],[w,h]=(process.argv[4]||'393x852').split('x').map(Number);
(async()=>{const g=await make({sourceFile:src,render:true,seed:5,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 const run=s=>vm.runInContext(s,g.c);const ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 const tap=(x,y)=>{const s=run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 run("pglLv().passed=5;pglLv().sel=6;pgSave();if(WILD.phase==='card')wildReset();");ticks(10);g.c.draw();g.c.draw();
 const pl=JSON.parse(run('JSON.stringify(PGA.L.play)'));tap(pl.x+pl.w/2,pl.y+pl.h/2);let k=0;while(run("WILD.phase")!=='play'&&k++<900)g.tick();ticks(60);
 g.c.draw();fs.writeFileSync(out,g.c.document.getElementById('cv').toBuffer('image/png'));
 console.log(run('JSON.stringify({hud:hudLayout(),wb:wildButton(),W,H,scale,VIEW:typeof VIEW!=="undefined"?VIEW:null,pb:typeof powerButtons==="function"?powerButtons():null,pgp:typeof pgpButton==="function"?pgpButton():null})'));})();
