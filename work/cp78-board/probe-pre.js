(()=>{const C=CanvasRenderingContext2D.prototype,pts=[[100,355],[30,320],[30,380],[380,380]],dpr=renderPixelRatio;window.__probe=[];let armed=0;
const px=()=>pts.map(([x,y])=>Array.from(ctx.getImageData(Math.round(x*dpr),Math.round(y*dpr),1,1).data).join(','));
for(const m of ['fill','fillRect','drawImage','stroke','fillText','putImageData']){const o=C[m];C[m]=function(...a){if(this!==ctx||!armed)return o.apply(this,a);const b=px();const r=o.apply(this,a);const c=px();
 c.forEach((v,i)=>{if(v!==b[i])__probe.push({pt:pts[i],m,col:v,stack:new Error().stack.split('\n').slice(2,6).map(s=>s.trim().slice(0,120))});});return r;};}
const f=draw;draw=function(...a){armed=1;__probe.length=0;try{return f.apply(this,a);}finally{armed=0;draw=f;}};})();
