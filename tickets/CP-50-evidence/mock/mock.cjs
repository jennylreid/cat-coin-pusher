// CP-50 mockup: goal row moved to the band above the cat's head. Draw-only overlay injected at runtime; no source changes.
// Usage: node mock.cjs [probe]
const make=require('../../../work/cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,'../../../work/cp66/release.html');
async function game(o){const g=await make({sourceFile:src,render:true,seed:5,pixelRatio:2,...o});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};return g;}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const OVERLAY=`(()=>{
 globalThis.__mockOn=true;globalThis.__hudHide=false;
 const fT=ctx.fillText.bind(ctx);ctx.fillText=function(t,...a){if(__hudHide&&typeof t==='string'&&t.startsWith('Collection '))return;return fT(t,...a);};
 const wi=wildIcon;wildIcon=function(...a){if(__hudHide)return;return wi(...a);};
 const dh=drawWildHud;drawWildHud=function(hud){__hudHide=__mockOn;try{return dh(hud);}finally{__hudHide=false;}};
 const d=draw;draw=function(){d();if(!__mockOn||!WILD.on||inventoryOpen||WILD.phase!=='play')return;
  ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
  const hud=hudLayout(),L=pglOn(),n=WILD_GOAL,R=17,gap=6,step=2*R+gap,top=hud.headerBottom+4;
  // level label
  ctx.textAlign='center';ctx.textBaseline='middle';
  wildText('Level '+(WILD.pglLevel||1)+' \u00b7 '+(L?L.name:'Wild'),200,top+9,15,'#ffd23f','#2a0b3e',4);
  const cy=top+22+R;
  WILD_COLLECTION.forEach((id,i)=>{const x=200+(i-(n-1)/2)*step,got=!!WILD.have[id];
   ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=4;ctx.shadowOffsetY=2;uiCircle(x,cy,R,'#fff4dc');ctx.restore();
   uiCircle(x,cy,R,null,got?'#5fd14a':'#e7c98f',got?2.4:1.6);
   ctx.save();drawPrize('item',id,x,cy+2,(R*2.1)/(radius('item')*2.8));ctx.restore();
   if(got){const cx=x+R*.72,cc=cy-R*.68;uiCircle(cx,cc,7.5,'#7dff6a','#1f6a18',1.4);ctx.strokeStyle='#0c3a12';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx-3.6,cc);ctx.lineTo(cx-.8,cc+2.9);ctx.lineTo(cx+4,cc-3.2);ctx.stroke();}});
  globalThis.__mockBox={top,bottom:cy+R+2,left:200-((n-1)/2)*step-R,right:200+((n-1)/2)*step+R};
  ctx.restore();};
})()`;
const sizes=[[360,640],[360,780],[393,852],[412,915]];
(async()=>{
 const OUT=__dirname;const st={'catpusher.uat.devdefault.v1':'1'};
 let g=await game({storage:st});g.run('S.dev=false');g.ticks(150);g.c.draw();g.run('pglLv().passed=1;pglLv().sel=2;pgSave();');
 const prog={};for(const k of Object.keys(st))if(/progress|devdefault/.test(k))prog[k]=st[k];
 const info=[];
 for(const [w,h] of sizes){
  g=await game({storage:{...prog},width:w,height:h});g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);g.c.draw();
  const p=J(g,'PGA.L.play');g.tap(p.x+p.w/2,p.y+p.h/2);
  const ok=g.until("WILD.phase==='play'",900);g.ticks(90);
  // mark two goal prizes collected (feather, ball): take them off the board and tick them
  g.run(`for(const id of ['feather','ball']){WILD.have[id]=true;const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b)removeCoin(b);}WILD.got=2;`);
  g.ticks(30);
  g.run(OVERLAY);
  const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,n),g.c.document.getElementById('cv').toBuffer('image/png'));};
  g.run('__mockOn=false');shot(`current-${w}x${h}.png`);
  g.run('__mockOn=true');shot(`goalrow-mock-${w}x${h}.png`);
  info.push({w,h,ok,...J(g,'{H,scale,cw:cv.width,ch:cv.height,lvl:pglOn()&&pglOn().name,got:WILD.got,box:__mockBox,headerBottom:hudLayout().headerBottom,VIEWy:VIEW.y,chin:w43ChinY()}')});
 }
 console.log(JSON.stringify(info,null,1));
})().catch(e=>{console.error(e);process.exit(1)});
