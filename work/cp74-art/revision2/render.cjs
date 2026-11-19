const fs=require('fs'),path=require('path'),vm=require('vm');
const N=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const make=require('../../cp33/runtime.cjs');
const OUT=path.resolve(__dirname,'../../../tickets/CP-74-evidence/art/revision2');fs.mkdirSync(OUT,{recursive:true});
async function game(w,h){const g=await make({sourceFile:path.join(__dirname,'preview.html'),render:true,seed:7,pixelRatio:1,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=N.Path2D;g.run=s=>vm.runInContext(s,g.c);
g.run(`globalThis.rimCapture=null;const originalCP78Rim=cp78Rim;cp78Rim=function(){const m=ctx.getTransform(),k=scale*renderPixelRatio,F=__felt,last=F[F.length-1],left=[[last[1]+1,__NF+3]],right=[];for(let i=F.length-1;i>=0;i-=58)left.push([F[i][1]+1,F[i][0]]);left.push([F[0][1]+1,F[0][0]]);right.push([F[0][2]-1,F[0][0]]);for(let i=0;i<F.length;i+=58)right.push([F[i][2]-1,F[i][0]]);right.push([last[2]-1,last[0]],[last[2]-1,__NF+3]);const tr=p=>({x:(m.a*p[0]+m.c*p[1]+m.e)/k,y:(m.b*p[0]+m.d*p[1]+m.f)/k});rimCapture={left:left.map(tr).reverse(),right:right.map(tr),matrix:[m.a,m.b,m.c,m.d,m.e,m.f],k};return originalCP78Rim();};S.dev=false;S.muted=true;`);
for(let i=0;i<140;i++)g.tick();g.run('z74DemoRound(3)');let j=0;while(g.run('WILD.phase')!=='play'&&j++<1500)g.tick();g.run('z74DemoQuiet()');for(let i=0;i<150;i++)g.tick();g.run('z74DemoQuiet();z74DemoPlay()');for(let i=0;i<180;i++)g.tick();g.run('draw()');return g;}
function crop(im,rect,name){const [x,y,w,h]=rect,c=N.createCanvas(w*3,h*3),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,x,y,w,h,0,0,w*3,h*3);fs.writeFileSync(path.join(OUT,name+'.png'),c.toBuffer('image/png'));}
function read(im){const c=N.createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);return {c,g,d:g.getImageData(0,0,c.width,c.height).data};}
function rimX(r,y,side='left'){const pts=r[side];for(let i=1;i<pts.length;i++){let a=pts[i-1],b=pts[i];if(y<=b.y){const t=Math.max(0,Math.min(1,(y-a.y)/(b.y-a.y||1)));return a.x+(b.x-a.x)*t;}}return pts.at(-1).x;}
(async()=>{
 const ref=await game(412,915),L=JSON.parse(ref.run('JSON.stringify(z74Layout())')),R=JSON.parse(ref.run('JSON.stringify(rimCapture)'));ref.close();
 fs.writeFileSync(path.join(__dirname,'layout-reference.json'),JSON.stringify({L,R},null,2));
 if(process.argv.includes('--layout')){console.log(JSON.stringify({chin:L.chin,sh:L.shY,rim:R.left,lip:L.lip}));return;}
 const shoulder=await N.loadImage(path.join(__dirname,'shoulder-painted.png')),arm=await N.loadImage(path.join(__dirname,'arm-painted.png'));
 // Fixed canvases. Register the painted layers to the clean board's actual rim, not the older collider approximation.
 const sh=N.createCanvas(800,640),sg=sh.getContext('2d');sg.drawImage(shoulder,0,0,800,640);
 // Feather only the buried lower overlap, so a rectangular shoulder canvas cannot leave a seam on the arm.
 sg.globalCompositeOperation='destination-in';const fade=sg.createLinearGradient(0,500,0,640);fade.addColorStop(0,'rgba(0,0,0,1)');fade.addColorStop(1,'rgba(0,0,0,0)');sg.fillStyle=fade;sg.fillRect(0,0,800,640);sg.globalCompositeOperation='source-over';fs.writeFileSync(path.join(__dirname,'hug-shoulder-v2-800x640.png'),sh.toBuffer('image/png'));
 const A=read(arm),ac=N.createCanvas(800,2080),ag=ac.getContext('2d');
 const top=310,bottom=830,sideStart=R.left[0].y,sideEnd=L.lip;
 for(let dy=0;dy<2080;dy++){const y=top+dy/4,u=Math.max(0,Math.min(1,(y-360)/(bottom-360))),sy=Math.round((.16+.76*u)*(arm.height-1));
 let l=arm.width,r=-1;for(let x=0;x<arm.width;x++)if(A.d[(sy*arm.width+x)*4+3]>200){l=Math.min(l,x);r=x;}if(r<l)continue;
 // The full painted tube continues behind the shoulder and under the mitt. Its right side is the exact rim seam.
 let inner;if(y<sideStart)inner=rimX(R,sideStart)+12;else if(y<=sideEnd)inner=rimX(R,y)+2;else inner=rimX(R,sideEnd)+2+Math.pow((y-sideEnd)/(bottom-sideEnd),2)*9;
 const sideThick=49.3+10.4*Math.max(0,Math.min(1,(y-512)/(771-512))),blend=Math.max(0,Math.min(1,(512-y)/60));
 const thick=sideThick+Math.max(0,inner+5-sideThick)*blend;
 // Avoid noisy partially transparent source fringe: sample just inside its painted silhouette.
 l+=3;r-=3;ag.drawImage(arm,l,sy,r-l+1,1,(inner-thick+70)*4,dy,thick*4,1.05);
 }
 fs.writeFileSync(path.join(__dirname,'hug-left-arm-v2-800x2080.png'),ac.toBuffer('image/png'));const rc=N.createCanvas(800,2080),rg=rc.getContext('2d');rg.translate(800,0);rg.scale(-1,1);rg.drawImage(ac,0,0);fs.writeFileSync(path.join(__dirname,'hug-right-arm-v2-800x2080.png'),rc.toBuffer('image/png'));
 const checks=[];
 for(const [w,h] of [[412,915],[360,640]]){const g=await game(w,h);g.c.hugShoulder=sh;g.c.hugArm=ac;g.run(`
 globalThis.oldHugBody=z74Body;
 function cleanHugClip(){const r=rimCapture;ctx.beginPath();ctx.rect(-200,-200,800,H+400);r.left.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));for(let i=r.right.length-1;i>=0;i--)ctx.lineTo(r.right[i].x,r.right[i].y);ctx.closePath();ctx.clip('evenodd');}
 z74Body=function(L,e){ctx.save();cleanHugClip();const r=rimCapture,ys=(r.left.at(-1).y-r.left[0].y)/${R.left.at(-1).y-R.left[0].y},ay=r.left[0].y+(310-${R.left[0].y})*ys;
 for(const s of [-1,1]){ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}ctx.drawImage(hugArm,-70,ay,200,520*ys);ctx.restore();}
 // Tuck the broad top behind the existing cheeks, then overlap the arm. Same canvas and shoulder width.
 for(const s of [-1,1]){ctx.save();ctx.translate(s<0?32:368,L.shY-30);if(s>0)ctx.scale(-1,1);ctx.drawImage(hugShoulder,-100,-80,200,160);ctx.restore();}
 ctx.restore();ctx.save();ctx.setTransform(...rimCapture.matrix);originalCP78Rim();ctx.restore();};
 // Keep this held-pose preview word-free. Existing hearts are drawn unchanged.
 pgpDraw=function(){const X=PGPX;if(!(X&&X.z74))return __z74PD();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);for(const h of X.hearts){const u=h.t/h.life,k=u<.12?u/.12:1;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(1-u)*1.6))*.95;pgHeart(h.x,h.y,h.s*(.6+.4*k)*1.15,'rgba(90,20,60,.35)');pgHeart(h.x,h.y,h.s*(.6+.4*k),h.c);ctx.restore();}ctx.restore();};draw();`);
 const cv=g.c.document.getElementById('cv'),screen=N.createCanvas(w,h),screenCtx=screen.getContext('2d'),padX=(w-cv.width)/2;
 function screenPNG(){screenCtx.fillStyle='#000';screenCtx.fillRect(0,0,w,h);screenCtx.drawImage(cv,padX,0);return screen.toBuffer('image/png');}
 fs.writeFileSync(path.join(OUT,`hug-art-v2-${w}x${h}.png`),screenPNG());
 // Detail proof omits only transient hearts so they cannot hide the joins.
 g.run('PGPX.hearts=[];draw()');const detail=await N.loadImage(screenPNG());fs.writeFileSync(path.join(OUT,`hug-art-v2-detail-${w}x${h}.png`),screenPNG());
 const ly=JSON.parse(g.run('JSON.stringify(z74Layout())')),scale=g.run('scale*renderPixelRatio');
 const y=Math.floor((ly.chin-45)*scale);crop(detail,[0,y,Math.round(w*.34),Math.round(180*scale)],`shoulder-left-3x-${w}x${h}`);crop(detail,[Math.round(w*.66),y,w-Math.round(w*.66),Math.round(180*scale)],`shoulder-right-3x-${w}x${h}`);
 const ay=Math.floor((ly.chin+135)*scale),ah=Math.min(h-ay,Math.round((ly.lip-ly.chin-135)*scale));crop(detail,[0,ay,Math.round(80*scale),ah],`arm-left-edge-3x-${w}x${h}`);crop(detail,[w-Math.round(80*scale),ay,Math.round(80*scale),ah],`arm-right-edge-3x-${w}x${h}`);
 const rim=JSON.parse(g.run('JSON.stringify(rimCapture)')),mask=N.createCanvas(cv.width,cv.height),mg=mask.getContext('2d');g.c.proofContext=mg;
 g.run('globalThis.proofOriginalContext=ctx;ctx=proofContext;ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);z74Body(z74Layout(),z74Env(PGPX.t));ctx=proofOriginalContext;');
 const mw=mask.width,md=mg.getImageData(0,0,mw,mask.height).data;let seamGaps=0,playAreaOverlaps=0,samples=0;
 for(let py=Math.ceil((rim.left[0].y+3)*scale);py<Math.min(h,Math.floor((ly.lip-3)*scale));py++){const y=(py+.5)/scale;for(const side of [-1,1]){const sx=rimX(rim,y,side<0?'left':'right');const px=Math.round((sx+side*4)*scale),inside=Math.round((sx-side*5)*scale);if(px>=0&&px<mw){samples++;if(md[(py*mw+px)*4+3]<250)seamGaps++;}if(inside>=0&&inside<mw&&md[(py*mw+inside)*4+3]>0)playAreaOverlaps++;}}
 let shoulderSamples=0,shoulderGaps=0;
 for(let py=Math.ceil((ly.chin-5)*scale);py<Math.floor((ly.chin+110)*scale);py++){const y=(py+.5)/scale;if(py>=mask.height)break;const limit=Math.floor((rimX(rim,y)-4)*scale);for(let px=0;px<limit;px++)for(const xx of [px,mw-1-px]){shoulderSamples++;if(md[(py*mw+xx)*4+3]<250)shoulderGaps++;}}
 checks.push({size:[w,h],layout:ly,rim,edgeCoverageSamples:samples,edgeCoverageGaps:seamGaps,playAreaOverlapSamples:playAreaOverlaps,shoulderCoverageSamples:shoulderSamples,shoulderCoverageGaps:shoulderGaps,error:g.run('Z74.err||null')});g.close();
 }
 fs.writeFileSync(path.join(__dirname,'registration-v2.json'),JSON.stringify({baseline:JSON.parse(fs.readFileSync(path.join(__dirname,'baseline.json'))),shoulderCanvas:[800,640],shoulderDraw:'centres x32/368, y=L.shY-30; draw rect -100,-80,200,160; mirrored right',armCanvas:[800,2080],armDraw:'Tall reference left (-70,310,200,520); mirror at x=200 for right. Adapt Y and height using the affine map between the reference and current projected CP-78 rim top/bottom, as in render.cjs.',clip:'cleanHugClip from actual CP-78 projected rim; redraw original rim on top',checks},null,2));
 const verification={baseline:JSON.parse(fs.readFileSync(path.join(__dirname,'baseline.json'))),checks:checks.map(({layout,rim,...rest})=>rest),passed:checks.every(c=>!c.error&&!c.edgeCoverageGaps&&!c.playAreaOverlapSamples&&!c.shoulderCoverageGaps)};fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(verification,null,2));if(!verification.passed)throw new Error('Art coverage verification failed; inspect verification.json');
 console.log('Saved revised sprites, two combined stills, two unobscured detail stills and eight 3x close-ups.');
})().catch(e=>{console.error(e);process.exit(1)});
