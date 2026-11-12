// Three approval-only UI compositions over the actual shipped game renderer.
// No generated art, altered prize sprites, persistent state or published changes.
const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const out='tickets/CP-25-evidence/pickup-concepts/',source=path.resolve('work/cp25/pickup-modal/release.html');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const update='uat/CatCoinPusher-UAT-game.json',before=hash(update),g=await make({sourceFile:source,render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();a.selectBoard(2);
 const prize=a.bodies.find(b=>b.id==='cheese');prize.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(prize,200);for(let i=0;i<17;i++)g.tick();
 vm.runInContext(`
 function conceptRound(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
 function conceptCircle(x,y,r,fill,stroke,lw=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
 function conceptPaw(x,y,k,fill){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(-15,10);ctx.bezierCurveTo(-20,1,-8,-9,0,-9);ctx.bezierCurveTo(8,-9,20,1,15,10);ctx.bezierCurveTo(12,17,5,11,0,12);ctx.bezierCurveTo(-5,11,-12,17,-15,10);ctx.fill();for(const [px,py,r] of [[-16,-12,-.5],[-6,-21,-.15],[7,-21,.15],[17,-11,.5]]){ctx.save();ctx.translate(px,py);ctx.rotate(r);ctx.beginPath();ctx.ellipse(0,0,5.5,8,0,0,7);ctx.fill();ctx.restore();}ctx.restore();}
 function conceptStar(x,y,r,fill){ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.quadraticCurveTo(x,y,x,y+r);ctx.quadraticCurveTo(x,y,x-r,y);ctx.quadraticCurveTo(x,y,x,y-r);ctx.fillStyle=fill;ctx.fill();}
 function conceptRibbon(y,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-142,y-12);ctx.lineTo(142,y-12);ctx.lineTo(142,y+21);ctx.lineTo(122,y+10);ctx.lineTo(109,y+26);ctx.lineTo(-109,y+26);ctx.lineTo(-122,y+10);ctx.lineTo(-142,y+21);ctx.closePath();ctx.fill();}
 function conceptBase(){ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.fillStyle='rgba(9,23,29,.67)';ctx.fillRect(0,0,W,H);ctx.translate(W/2,H/2);}
 function conceptA(){
  ctx.save();conceptBase();ctx.rotate(-.035);
  ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=24;ctx.shadowOffsetY=12;
  conceptRound(-144,-164,288,322,22,'#fbefcd');ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const paper=ctx.createLinearGradient(0,-160,0,160);paper.addColorStop(0,'#fff8e5');paper.addColorStop(1,'#efdaad');conceptRound(-139,-159,278,312,18,paper);
  conceptRound(-131,-151,262,296,14,null,'#c5a25b',1.2);conceptRound(-126,-146,252,286,11,null,'rgba(197,162,91,.3)',.7);
  // Quiet stitched corners; decorative paper, not a transparent system dialog.
  ctx.strokeStyle='#d3ba80';ctx.lineWidth=1;for(const sx of [-1,1])for(const sy of [-1,1]){ctx.beginPath();ctx.moveTo(sx*115,sy*108);ctx.lineTo(sx*115,sy*129);ctx.lineTo(sx*94,sy*129);ctx.stroke();}
  const halo=ctx.createRadialGradient(0,-8,5,0,-8,108);halo.addColorStop(0,'rgba(255,222,127,.55)');halo.addColorStop(1,'rgba(255,222,127,0)');ctx.fillStyle=halo;ctx.fillRect(-110,-118,220,220);
  drawPrize('item','cheese',0,25,1.95);conceptRibbon(118,'#175c62');conceptCircle(0,119,25,'#b98739');conceptCircle(0,116,23,'#f3d48b','#fff0c2',1.5);conceptPaw(0,122,.65,'#95652b');
  conceptStar(-103,-89,6,'#d4a650');conceptStar(108,-104,4,'#d4a650');ctx.restore();
 }
 function conceptB(){
  ctx.save();conceptBase();
  // Plush paw-shaped medallion: four toes and one broad central pad.
  ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=25;ctx.shadowOffsetY=10;
  for(const [x,y,w,h,rot] of [[-110,-100,30,42,-.42],[-40,-145,33,44,-.16],[41,-145,33,44,.16],[110,-100,30,42,.42]]){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();ctx.ellipse(0,0,w,h,0,0,7);ctx.fillStyle='#174c55';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='#e0bc70';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,w-8,h-9,0,0,7);ctx.fillStyle='#4f8b8e';ctx.fill();ctx.restore();}
  ctx.beginPath();ctx.moveTo(-135,44);ctx.bezierCurveTo(-148,-14,-68,-91,0,-91);ctx.bezierCurveTo(68,-91,148,-14,135,44);ctx.bezierCurveTo(119,129,54,99,0,111);ctx.bezierCurveTo(-54,99,-119,129,-135,44);ctx.closePath();const teal=ctx.createLinearGradient(0,-90,0,115);teal.addColorStop(0,'#357f83');teal.addColorStop(1,'#113d49');ctx.fillStyle=teal;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.lineWidth=4;ctx.strokeStyle='#e4c77e';ctx.stroke();
  conceptCircle(0,4,94,'#fcf1d1','#eccb7c',2);conceptCircle(0,4,87,null,'#e1c58d',1);drawPrize('item','cheese',0,29,1.95);
  for(const x of [-109,109]){conceptCircle(x,47,3,'#dabc77');conceptCircle(x*.9,67,2,'#dabc77');}conceptStar(-163,-20,6,'#f5d58d');conceptStar(158,-48,5,'#f5d58d');ctx.restore();
 }
 function conceptC(){
  ctx.save();conceptBase();ctx.rotate(.035);
  // Broad scalloped reward sticker with a strong cream edge and coral ribbon.
  ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=24;ctx.shadowOffsetY=10;
  ctx.beginPath();for(let i=0;i<=240;i++){const ang=i/240*Math.PI*2,r=142+7*Math.cos(ang*12),x=Math.cos(ang)*r,y=Math.sin(ang)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle='#fff1cc';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='#b88b45';ctx.lineWidth=2.5;ctx.stroke();
  conceptCircle(0,0,124,'#e6f0db','#247279',3);conceptCircle(0,0,116,null,'rgba(36,114,121,.24)',1.2);
  for(let i=0;i<24;i++){const t=i*Math.PI/12;conceptCircle(Math.cos(t)*132,Math.sin(t)*132,1.4,'#c4a160');}
  drawPrize('item','cheese',0,27,1.95);conceptRibbon(116,'#ce6b5c');conceptRound(-99,105,198,30,8,'#e68b74');conceptPaw(0,129,.58,'#fff0c9');
  for(const [x,y,r,col] of [[-161,-68,7,'#f0c76e'],[156,-94,5,'#fff0bf'],[158,65,6,'#e98c76'],[-157,76,4,'#9ccdc5']])conceptStar(x,y,r,col);
  ctx.restore();
 }
 `,g.c);
 const names=['A-warm-card','B-paw-medallion','C-scalloped-badge'];
 for(let i=0;i<3;i++){vm.runInContext('drawTreatAward=concept'+['A','B','C'][i]+';',g.c);g.snapshot(out+names[i]+'-phone.png');}
 g.close();
 const sheet=native.createCanvas(1260,1000),c=sheet.getContext('2d');c.fillStyle='#18212a';c.fillRect(0,0,1260,1000);const labels=['A  Warm keepsake card','B  Teal paw medallion','C  Scalloped reward badge'];
 for(let i=0;i<3;i++){c.fillStyle='#f6ead0';c.font='bold 23px Arial';c.textAlign='center';c.fillText(labels[i],i*420+210,37);const im=await native.loadImage(out+names[i]+'-phone.png');c.drawImage(im,i*420+8,60,404,898);}
 fs.writeFileSync(out+'three-directions.png',sheet.toBuffer('image/png'));
 fs.writeFileSync(out+'preview-notes.json',JSON.stringify({source:'work/cp25/pickup-modal/release.html',piece:'Pickup popup UI concepts only',render:'Actual game canvas and original cheese sprite, same scene/sprite scale across all three',canvas:[1080,2400],concepts:names,publishedJSONBefore:before,publishedJSONAfter:hash(update),previewOnly:true,generatedArt:false,decision:'Choose a visual direction before animation or publication'},null,2));
 console.log('Three phone stills and comparison rendered; UAT unchanged');
})().catch(e=>{console.error(e);process.exitCode=1});
