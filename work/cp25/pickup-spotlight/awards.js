// Transient pickup presentation; inventory credit/save remains in fallOff.
const treatAwards=[];
function startTreatAward(){const a=treatAwards[0];if(a&&!a.sounded){a.sounded=true;sfx.itemCollected();}}
function queueTreatAward(id){treatAwards.push({id,t:0,sounded:false});startTreatAward();}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();startTreatAward();}
function tickTreatAwards(dt){const a=treatAwards[0];if(!a)return;a.t+=dt;if(a.t>=1.2)dismissTreatAward();}
function drawTreatAward(){
 const a=treatAwards[0];if(!a)return;
 const fade=Math.max(0,Math.min(1,a.t/.1,(1.2-a.t)/.2)),x=W/2,y=H/2;
 ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.globalAlpha=fade;
 ctx.fillStyle='rgba(14,16,24,.28)';ctx.fillRect(0,0,W,H);
 const glow=ctx.createRadialGradient(x,y+3,5,x,y+3,140);glow.addColorStop(0,'rgba(255,219,143,.28)');glow.addColorStop(.42,'rgba(255,205,113,.14)');glow.addColorStop(1,'rgba(255,205,113,0)');ctx.fillStyle=glow;ctx.fillRect(x-140,y-137,280,280);
 const t=Math.min(1,a.t/.22),v=t-1,pop=.78+.22*(1+2.2*v*v*v+1.2*v*v);
 ctx.save();ctx.translate(x,y);ctx.scale(pop,pop);drawPrize('item',a.id,0,32,1.95);ctx.restore();
 for(const [i,dx,dy] of [[0,-90,-43],[1,81,-65],[2,74,63]]){
  const k=Math.max(0,Math.min(1,(a.t-.08-i*.055)/.65)),shine=Math.sin(Math.PI*k);if(shine<=0)continue;
  const sx=x+dx*(1+.05*k),sy=y+dy*(1+.05*k),r=2+3*shine;ctx.globalAlpha=fade*shine*.85;ctx.fillStyle='#ffedc4';ctx.beginPath();ctx.moveTo(sx,sy-r);ctx.quadraticCurveTo(sx,sy,sx+r,sy);ctx.quadraticCurveTo(sx,sy,sx,sy+r);ctx.quadraticCurveTo(sx,sy,sx-r,sy);ctx.quadraticCurveTo(sx,sy,sx,sy-r);ctx.fill();
 }
 ctx.restore();
}
