// Preview only: decorative pickup frame. No runtime integration.
function drawPickupConcept(style,t=.7){
 const fade=Math.max(0,Math.min(1,t/.35,(2.5-t)/.5));
 ctx.save();ctx.translate(200,H*.54);ctx.globalAlpha=fade;
 const gold=ctx.createLinearGradient(-120,-110,120,110);gold.addColorStop(0,'#fff1bc');gold.addColorStop(.25,'#d7af61');gold.addColorStop(.48,'#fff0bc');gold.addColorStop(.74,'#a77431');gold.addColorStop(1,'#ebca83');
 const outline=(w,h,r)=>{ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,r);};
 ctx.shadowColor='rgba(0,8,15,.55)';ctx.shadowBlur=22;ctx.shadowOffsetY=9;
 outline(250,222,33);ctx.fillStyle='#133e47';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 ctx.strokeStyle=gold;ctx.lineWidth=4;ctx.stroke();
 outline(237,209,28);ctx.strokeStyle='#477c7d';ctx.lineWidth=1;ctx.stroke();
 const inner=ctx.createLinearGradient(0,-95,0,95);inner.addColorStop(0,'#285963');inner.addColorStop(.5,'#173e49');inner.addColorStop(1,'#102f3b');
 outline(224,196,23);ctx.fillStyle=inner;ctx.fill();ctx.strokeStyle=gold;ctx.lineWidth=1.6;ctx.stroke();
 // Fine symmetrical corner scrollwork, contained within the frame.
 for(const sx of [-1,1])for(const sy of [-1,1]){ctx.save();ctx.scale(sx,sy);ctx.translate(111,97);ctx.strokeStyle=gold;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-46,0);ctx.bezierCurveTo(-29,0,-34,-15,-20,-14);ctx.bezierCurveTo(-7,-13,-10,1,-19,-4);ctx.bezierCurveTo(-26,-9,-11,-25,-2,-26);ctx.bezierCurveTo(-10,-20,0,-12,0,-46);ctx.stroke();ctx.beginPath();ctx.moveTo(-18,-17);ctx.bezierCurveTo(-33,-28,-26,-35,-25,-38);ctx.bezierCurveTo(-12,-32,-16,-25,-18,-17);ctx.fillStyle=gold;ctx.fill();ctx.restore();}
 // Small central crest and matching foot detail.
 for(const sy of [-1,1]){ctx.save();ctx.scale(1,sy);ctx.translate(0,-110);ctx.beginPath();ctx.moveTo(-34,1);ctx.bezierCurveTo(-19,1,-15,-7,-8,-7);ctx.quadraticCurveTo(0,-25,8,-7);ctx.bezierCurveTo(15,-7,19,1,34,1);ctx.bezierCurveTo(20,6,9,9,0,5);ctx.bezierCurveTo(-9,9,-20,6,-34,1);ctx.fillStyle='#174650';ctx.fill();ctx.strokeStyle=gold;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(5,-6);ctx.lineTo(0,1);ctx.lineTo(-5,-6);ctx.closePath();ctx.fillStyle=gold;ctx.fill();ctx.restore();}
 const glow=ctx.createRadialGradient(0,0,8,0,0,88);glow.addColorStop(0,'rgba(255,222,157,.18)');glow.addColorStop(1,'rgba(255,222,157,0)');ctx.fillStyle=glow;ctx.fillRect(-90,-90,180,180);
 drawPrize('item','cheese',0,48,1.65);
 ctx.restore();
}
