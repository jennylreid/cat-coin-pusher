// Inventory credit/save remains in fallOff. This is transient presentation only.
const treatAwards=[];
function startTreatAward(){const a=treatAwards[0];if(a&&!a.sounded){a.sounded=true;sfx.itemCollected();}}
function queueTreatAward(id){treatAwards.push({id,t:0,sounded:false});startTreatAward();}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();startTreatAward();}
function tickTreatAwards(dt){const a=treatAwards[0];if(!a)return;a.t+=dt;if(a.t>=1.8)dismissTreatAward();}
function drawTreatAward(){
 const a=treatAwards[0];if(!a)return;
 const fade=Math.max(0,Math.min(1,a.t/.14,(1.8-a.t)/.2));
 ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);
 // Desaturate the already-rendered board with a neutral saturation blend,
 // then add a light grey veil. No canvas readback or filtered full-size copy.
 ctx.globalAlpha=.78*fade;ctx.globalCompositeOperation='saturation';ctx.fillStyle='#808080';ctx.fillRect(0,0,W,H);
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=fade;ctx.fillStyle='rgba(65,70,77,.28)';ctx.fillRect(0,0,W,H);
 const w=Math.min(276,W-48),height=252,x=(W-w)/2,y=(H-height)/2;
 ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=18;ctx.shadowOffsetY=5;
 ctx.beginPath();ctx.roundRect(x,y,w,height,24);ctx.fillStyle='rgba(27,34,40,.18)';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.strokeStyle='rgba(244,230,196,.92)';ctx.lineWidth=1.5;ctx.stroke();
 ctx.beginPath();ctx.roundRect(x+6,y+6,w-12,height-12,19);ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1;ctx.stroke();
 // The original prize stays in full colour inside the quiet frame.
 drawPrize('item',a.id,W/2,H/2+35,2.15);ctx.restore();
}
