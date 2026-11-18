// CP-74 key-beat stills: the real game (UAT 91 + prototype, Developer off) on the Ragdoll's board, Level N, at phone
// sizes; the power played through the real button. Usage: node shots.cjs [sizes] [level] -> tickets/CP-74-evidence/
// Also writes today's Hug (current.html) at 1.5 s and the layout-numbers still (hug-numbers-412x915.png).
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const sizes=(process.argv[2]||'412x915,360x640').split(',').map(s=>s.split('x').map(Number)),level=+(process.argv[3]||3);
const OUT=path.resolve(__dirname,'../../tickets/CP-74-evidence');
const BEATS=[['1-coming-in',.3],['2-mitts-in',.62],['3-hug',3.0],['4-letting-go',6.75],['5-after',7.4]];
async function game(page,w,h){const g=await make({sourceFile:path.join(__dirname,'game',page),render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');for(let i=0;i<140;i++)g.tick();g.run(`z74DemoRound(${level})`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<1500)g.tick();
 g.run('z74DemoQuiet()');for(let i=0;i<150;i++)g.tick();g.run('z74DemoQuiet()');g.run('z74DemoPlay()');return g;}
const png=(g,f)=>{g.c.draw();fs.writeFileSync(path.join(OUT,f),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 let g=await game('proto.html',w,h);let tt=0;
 for(const [n,s] of BEATS){while(tt<s-1e-6){g.tick();tt+=1/60;}png(g,`hug-${n}-${sz}.png`);
  if(n==='3-hug'&&w===412){ // the layout numbers, drawn on the same frame
   const L=JSON.parse(g.run(`(()=>{const H0=PGPX.hearts;PGPX.hearts=[];draw();PGPX.hearts=H0;const L=z74Layout(),A=L.sides[-1],B=L.sides[1],p0=A.pts[7],pf=A.pts[A.nSide-1],F=skyScreen(T.L,T.FRONT,0),G=skyScreen(T.L,GUARD_END,0);
    const o={W,H:+H.toFixed(1),lipY:+L.lip.toFixed(1),chinY:+L.chin.toFixed(1),shoulder:{cx:+(200-Z74.SH_DX).toFixed(0),cy:+(L.shY-12).toFixed(1),r:Z74.SH_R,ry:Z74.SH_R*.8},
     arm:{radiusWorld:Z74.ARM_R,thickBack:+(2*p0.r).toFixed(1),thickFront:+(2*pf.r).toFixed(1),innerEdgeBack:{x:+G.x.toFixed(1),y:+G.y.toFixed(1)},innerEdgeFront:{x:+F.x.toFixed(1),y:+F.y.toFixed(1)}},
     mitts:{w:Z74.MITT_W,left:{x:+A.M.x.toFixed(1),y:+A.M.y.toFixed(1)},right:{x:+B.M.x.toFixed(1),y:+B.M.y.toFixed(1)},turn:Z74.MITT_TURN,turnDeg:+(Z74.MITT_TURN*180/Math.PI).toFixed(0),funnel:z74MittEdges()},
     walls:{worldX:[14,30],zFrom:GUARD_END-20,zTo:T.FRONT+20,height:80}};
    ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.font='bold 11px system-ui';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.lineWidth=1.5;
    const lab=(t,x,y,c)=>{ctx.fillStyle='rgba(0,0,0,.75)';const m=ctx.measureText(t).width;ctx.fillRect(x-2,y-10,m+4,14);ctx.fillStyle=c||'#7dff6a';ctx.fillText(t,x,y);};
    ctx.strokeStyle='#7dff6a';ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(0,L.lip);ctx.lineTo(W,L.lip);ctx.stroke();lab('front lip y='+o.lipY,150,L.lip-4);
    ctx.beginPath();ctx.moveTo(0,L.shY-12);ctx.lineTo(W,L.shY-12);ctx.stroke();lab('shoulder centre y='+o.shoulder.cy+' (x '+(200-Z74.SH_DX)+' / '+(200+Z74.SH_DX)+', r '+Z74.SH_R+')',60,L.shY-16,'#ffe08a');
    ctx.strokeStyle='#ff9ad8';ctx.beginPath();ctx.moveTo(p0.x-p0.r,p0.y);ctx.lineTo(p0.x+p0.r,p0.y);ctx.stroke();lab('arm '+o.arm.thickBack+' thick (back)',4,p0.y+16,'#ff9ad8');
    ctx.beginPath();ctx.moveTo(pf.x-pf.r,pf.y-40);ctx.lineTo(pf.x+pf.r,pf.y-40);ctx.stroke();lab('arm '+o.arm.thickFront+' (front; inner edge = table edge)',4,pf.y-46,'#ff9ad8');
    ctx.strokeStyle='#6ad8ff';ctx.setLineDash([]);for(const M of [A.M,B.M]){ctx.beginPath();ctx.arc(M.x,M.y,4,0,7);ctx.stroke();ctx.strokeRect(M.x-91,M.y-91,182,182);}
    const fe=o.mitts.funnel;lab('mitts 182 wide (approved size), centres x '+o.mitts.left.x+' / '+o.mitts.right.x+', y '+o.mitts.left.y+', turned in '+o.mitts.turnDeg+' deg',8,L.lip+16,'#6ad8ff');
    lab('front edge fully open (gap '+fe.gapAtLip+' vs drop edge '+fe.dropWidth.toFixed(0)+'); funnel gap '+fe.gapAt[2][1]+' at lip+60, '+fe.gapAtBottom+' at the bottom',8,L.lip+32,'#6ad8ff');
    ctx.restore();return JSON.stringify(o);})()`));
   png0(g,'hug-numbers-412x915.png');fs.writeFileSync(path.join(OUT,'layout-numbers.json'),JSON.stringify(L,null,1));}}
 info.push({sz,errs:JSON.parse(g.run('JSON.stringify(__errs)')),stats:JSON.parse(g.run('JSON.stringify(Z74.stats)'))});g.close();
 g=await game('current.html',w,h);for(let i=0;i<90;i++)g.tick();png(g,`today-${sz}.png`);g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
function png0(g,f){fs.writeFileSync(path.join(OUT,f),g.c.document.getElementById('cv').toBuffer('image/png'));}
