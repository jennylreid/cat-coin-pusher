// CP-92 rework frame strip: the NEW BOARD sweep (the pusher travels the board), real game. Usage: node strip.cjs [out.png] [WxH]
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const {createCanvas,loadImage}=require(NAPI);
const src=path.resolve(__dirname,process.env.SRC||'release.html'),out=path.resolve(process.argv[2]||path.join(__dirname,'strip.png'));const [w,h]=(process.argv[3]||'412x915').split('x').map(Number);
(async()=>{const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:1,width:w,height:h,storage:{}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);const T=n=>{for(let i=0;i<n;i++)g.tick();};
 g.run("S.muted=true;S.dev=false");T(150);g.pointer('pointerdown',200,700);g.pointer('pointerup',200,700);T(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");T(60);
 g.run("PG.current=PGU.boardCat='tuxedo';endLoad().coins=300;endLoad().cur='L6';endStart()");let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();
 for(let i=0;i<70;i++){g.run(`tryDrop({x:${Math.round(200+90*Math.sin(i))},y:DROP_Y})`);T(18);}T(120);
 g.run("WILD.nextBonus=999;END.w.meter=END.METER");n=0;while(!g.run('endFree()')&&n++<2000)g.tick();
 const before=+g.run('bodies.filter(b=>!b.dead).length'),c0=+g.run('S.coins');g.run('endStartSweep()');
 const times=[0,.7,1.4,2.1,2.6,3.1,3.5,3.9,4.2,4.45];const frames=[];let el=0,info=[];
 for(const tt of times){while(el<tt-1e-6){g.tick();el+=1/60;}g.c.draw();const b=g.c.document.getElementById('cv').toBuffer('image/png');frames.push(await loadImage(b));
  info.push({t:+tt.toFixed(2),left:+g.run('END.stats.sweepLeft|0'),z:Math.round(+g.run('pusherY')),pieces:+g.run('bodies.filter(b=>!b.dead).length'),coins:+g.run('S.coins'),sweep:g.run('!!END.sweep'),key:g.run('endKey()')});}
 T(30);g.c.draw();frames.push(await loadImage(g.c.document.getElementById('cv').toBuffer('image/png')));info.push({t:'+0.5 after',pieces:+g.run('bodies.filter(b=>!b.dead).length'),coins:+g.run('S.coins'),key:g.run('endKey()')});
 const fw=frames[0].width,fh=frames[0].height,k=.42,cols=frames.length,cv=createCanvas(Math.round(fw*k)*cols+(cols-1)*6,Math.round(fh*k)+26),x=cv.getContext('2d');x.fillStyle='#111';x.fillRect(0,0,cv.width,cv.height);
 frames.forEach((f,i)=>{const X=i*(Math.round(fw*k)+6);x.drawImage(f,X,26,Math.round(fw*k),Math.round(fh*k));x.fillStyle='#fff';x.font='bold 14px sans-serif';x.fillText(typeof info[i].t==='number'?info[i].t+' s':'after',X+6,18);});
 fs.writeFileSync(out,cv.toBuffer('image/png'));console.log(JSON.stringify({before,c0,info}));g.close&&g.close();})().catch(e=>{console.error(e);process.exit(1)});
