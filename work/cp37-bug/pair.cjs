// Frames + order data for one flickering pair. node pair.cjs <src> <tag> <warmSec> <uidA> <uidB> <from> <to>
const {game}=require('../cp37/harness.cjs'),fs=require('fs'),path=require('path');
const [,,s0,tag,warm,ua,ub,from,to]=process.argv;const src=path.resolve(s0);const O=path.resolve(__dirname,'out',tag,'pair');fs.mkdirSync(O,{recursive:true});
(async()=>{const g=await game({seed:4,render:true,src}),a=g.c.__game,cv=g.c.document.getElementById('cv');
 a.wildEnter();a.wildStartCountdown();g.ticks(240);g.run('finishBoard=()=>{}');
 const hold=s=>g.run(`S.coins=Math.max(S.coins,50);WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);holding=true;holdPos={x:200+70*Math.sin(${s}*0.9),y:DROP_Y};`);
 for(let s=0;s<+warm;s++){hold(s);g.ticks(60);}
 const {createCanvas}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
 const shots=[];
 for(let f=1;f<=+to;f++){if((f-1)%60===0)hold(+warm+(f-1)/60);g.tick();
  if(f<+from)continue;g.c.draw();
  const info=g.run(`(()=>{const ord=coinPaintOrder(bodies).map(b=>b.uid);const A=bodies.find(b=>b.uid===${ua}),B=bodies.find(b=>b.uid===${ub});const k=${Math.min(ua,ub)}+':'+${Math.max(ua,ub)};const p=__coinPaintPairs.get('${ua}:${ub}')||__coinPaintPairs.get('${ub}:${ua}');const au=globalThis.__coinOrderAudit={};coinPaintOrder(bodies);
   const f=b=>{const t=b.rb.translation(),q=b.rb.rotation();return {z:+(t.z/M).toFixed(2),x:+(t.x/M).toFixed(2),h:+(t.y/M).toFixed(2),sortK:+b.sortK.toFixed(2),q:[q.x,q.y,q.z,q.w].map(v=>+v.toFixed(3))}};
   return {aFirst:ord.indexOf(${ua})<ord.indexOf(${ub}),d:p?+p.d.toFixed(4):null,dist:p&&p.distance!=null?+p.distance.toFixed(4):null,A:f(A),B:f(B),masked:[__coinPaintMasks.has(${ua}),__coinPaintMasks.has(${ub})],ka:A.kind,kb:B.kind,overlap:p?__coinPolysOverlap(p.a.poly,p.b.poly):null,cyc:au.cycleFallbacks||0,recA:!!__coinPaintBodies.get(${ua}),recB:!!__coinPaintBodies.get(${ub}),solidB:contactSolid(B),flightB:__inputInFlight(B),inB:!!B.input,freshB:B.fresh,bbA:(r=>r&&[r.minX,r.minY,r.maxX,r.maxY].map(Math.round))(__coinPaintBodies.get(${ua})),bbB:(r=>r&&[r.minX,r.minY,r.maxX,r.maxY].map(Math.round))(__coinPaintBodies.get(${ub}))};})()`);
  info.f=f;console.log(JSON.stringify(info));
  const r=g.run(`(()=>{const r=__coinPaintBodies.get(${ua});return [r.minX,r.minY,r.maxX,r.maxY]})()`),C=g.run('__camera');
  shots.push({buf:cv.toBuffer('image/png'),cx:C[0]*(r[0]+r[2])/2+C[4],cy:C[3]*(r[1]+r[3])/2+C[5],f});}
 const {loadImage}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
 const cw=200,ch=140,cols=6,rows=Math.ceil(shots.length/cols),sheet=createCanvas(cw*cols,(ch+16)*rows),sx=sheet.getContext('2d');sx.fillStyle='#000';sx.fillRect(0,0,sheet.width,sheet.height);
 const cx=shots[0].cx,cy=shots[0].cy;
 for(let i=0;i<shots.length;i++){const im=await loadImage(shots[i].buf);const X=(i%cols)*cw,Y=Math.floor(i/cols)*(ch+16);sx.drawImage(im,cx-cw/2,cy-ch/2,cw,ch,X,Y+16,cw,ch);sx.fillStyle='#fff';sx.font='12px sans-serif';sx.fillText('frame '+shots[i].f,X+4,Y+12);}
 fs.writeFileSync(path.join(O,`pair-${ua}-${ub}.png`),sheet.toBuffer('image/png'));g.close();})();
