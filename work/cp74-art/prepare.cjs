const fs=require('fs'),path=require('path'),vm=require('vm');
const N=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const make=require('../cp33/runtime.cjs');
const out=path.resolve(__dirname,'../../tickets/CP-74-evidence/art');
const gen='C:/Users/jenny/.codex/generated_images/01a1ef24-ce0b-7ba0-9c4d-bbd15130ce36/';
async function game(w,h){const g=await make({sourceFile:path.resolve(__dirname,'../cp74-hug/game/proto.html'),render:true,seed:7,pixelRatio:1,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=N.Path2D;g.run=s=>vm.runInContext(s,g.c);g.run('S.dev=false;S.muted=true');for(let i=0;i<140;i++)g.tick();g.run('z74DemoRound(3)');let k=0;while(g.run('WILD.phase')!=='play'&&k++<1500)g.tick();g.run('z74DemoQuiet()');for(let i=0;i<150;i++)g.tick();g.run('z74DemoQuiet();z74DemoPlay()');for(let i=0;i<180;i++)g.tick();return g;}
function bounds(im){const c=N.createCanvas(im.width,im.height),x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let l=c.width,r=0,t=c.height,b=0;for(let y=0;y<c.height;y++)for(let z=0;z<c.width;z++)if(d[(y*c.width+z)*4+3]>100){l=Math.min(l,z);r=Math.max(r,z);t=Math.min(t,y);b=Math.max(b,y);}return {c,d,l,r,t,b};}
(async()=>{
 const sh=await N.loadImage(gen+'exec-efee3bd4-cbbe-4a46-88c5-b9b68fa190f4.png'),ar=await N.loadImage(gen+'exec-b2927355-e407-43be-9804-c4256946f58b.png');
 const sc=N.createCanvas(800,640),sx=sc.getContext('2d'),sb=bounds(sh);sx.drawImage(sh,sb.l,sb.t,sb.r-sb.l+1,sb.b-sb.t+1,80,64,640,512);fs.writeFileSync(path.join(__dirname,'hug-shoulder-800x640.png'),sc.toBuffer('image/png'));
 const ref=await game(412,915),L=JSON.parse(ref.run('JSON.stringify(z74Layout())'));ref.close();
 // Mechanical row registration of painted fur to the approved path. No new painted art.
 const ac=N.createCanvas(560,2080),ax=ac.getContext('2d'),ab=bounds(ar),P=L.sides['-1'].pts,y0=P[0].y-18,y1=P[P.length-1].y+18;
 for(let dy=0;dy<2080;dy++){const y=310+dy/4;if(y<y0||y>y1)continue;const u=(y-y0)/(y1-y0),sy=Math.min(ab.b,Math.round(ab.t+u*(ab.b-ab.t)));let l=ab.c.width,r=-1;for(let x=0;x<ab.c.width;x++)if(ab.d[(sy*ab.c.width+x)*4+3]>100){l=Math.min(l,x);r=x;}if(r<l)continue;
 let a=P[0],b=P[0];for(let i=1;i<P.length;i++){a=P[i-1];b=P[i];if(y<=b.y)break;}const v=Math.max(0,Math.min(1,(y-a.y)/(b.y-a.y||1))),cx=a.x+(b.x-a.x)*v,rad=a.r+(b.r-a.r)*v;
 ax.drawImage(ar,l,sy,r-l+1,1,(cx-rad+70)*4,dy,rad*8,1.1);
 }
 fs.writeFileSync(path.join(__dirname,'hug-left-arm-560x2080.png'),ac.toBuffer('image/png'));const rc=N.createCanvas(560,2080),rx=rc.getContext('2d');rx.translate(560,0);rx.scale(-1,1);rx.drawImage(ac,0,0);fs.writeFileSync(path.join(__dirname,'hug-right-arm-560x2080.png'),rc.toBuffer('image/png'));
 const checks=[];
 for(const [w,h] of [[412,915],[360,640]]){const g=await game(w,h);g.c.hugShoulder=sc;g.c.hugLeft=ac;g.c.hugRight=rc;g.run(`
 globalThis.originalHugBody=z74Body;
 z74Body=function(L,e){ctx.save();z74ClipOutside();
 const shift=L.shY-${L.shY};
 for(const s of [-1,1]){ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}ctx.drawImage(hugLeft,-70,310+shift,140,520);ctx.restore();}
 for(const s of [-1,1]){ctx.save();const S=L.sides[s].S;ctx.translate(S.x,S.y-12);if(s>0)ctx.scale(-1,1);ctx.drawImage(hugShoulder,-100,-80,200,160);ctx.restore();}
 ctx.restore();};
 pgpDraw=function(){const X=PGPX;if(!(X&&X.z74))return __z74PD();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);for(const h of X.hearts){const u=h.t/h.life,k=u<.12?u/.12:1;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(1-u)*1.6))*.95;pgHeart(h.x,h.y,h.s*(.6+.4*k)*1.15,'rgba(90,20,60,.35)');pgHeart(h.x,h.y,h.s*(.6+.4*k),h.c);ctx.restore();}ctx.restore();};
 draw();`);const cv=g.c.document.getElementById('cv');fs.writeFileSync(path.join(out,`hug-art-${w}x${h}.png`),cv.toBuffer('image/png'));checks.push({size:[w,h],layout:JSON.parse(g.run('JSON.stringify(z74Layout())'))});g.close();}
 fs.writeFileSync(path.join(__dirname,'registration.json'),JSON.stringify({shoulder:{canvas:[800,640],drawRectRelativeToCentre:[-100,-80,200,160],mirrorRight:true},arms:{canvas:[560,2080],leftDrawRect:[-70,310,140,520],rightDrawRect:[330,310,140,520],shortScreen:'shift Y by layout.shY - '+L.shY,tableClip:'z74ClipOutside, mandatory',mitts:'Existing approved images and transforms; draw after arms, before coins.'},checks},null,2));
 console.log('Saved three transparent sprites and two real-game art previews.');
})().catch(e=>{console.error(e);process.exit(1)});
