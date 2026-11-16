drawHappyFeatures=function(){
 // Native expression overlay on the fixed sweet master; no generated head replacement.
 ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);
 ctx.fillStyle='#000';for(const c of [480,1056]){ctx.beginPath();ctx.ellipse(c,525,183,148,0,0,7);ctx.fill();}
 ctx.strokeStyle='#ffda35';ctx.lineWidth=30;ctx.lineCap='round';for(const side of [-1,1]){const c=768+side*205;ctx.beginPath();ctx.moveTo(c-100,540);ctx.quadraticCurveTo(c,360,c+100,540);ctx.stroke();}
 ctx.drawImage(__happyMouthLayer,0,0);ctx.restore();};
drawHappyPaws=function(){for(const side of [-1,1]){ctx.save();ctx.translate(200+side*135,235);if(side>0)ctx.scale(-1,1);ctx.rotate(-.12);const saved=ART.paw;try{ART.paw=__happyMitt;drawRestMitt(130);}finally{ART.paw=saved;}ctx.restore();}ctx.fillStyle='#ffe079';for(const side of [-1,1]){const x=200+side*178,y=100+Math.sin(time*4)*3;ctx.beginPath();ctx.moveTo(x,y-10);ctx.lineTo(x+3,y-3);ctx.lineTo(x+10,y);ctx.lineTo(x+3,y+3);ctx.lineTo(x,y+10);ctx.lineTo(x-3,y+3);ctx.lineTo(x-10,y);ctx.lineTo(x-3,y-3);ctx.closePath();ctx.fill();}};