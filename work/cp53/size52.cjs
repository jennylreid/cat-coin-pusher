const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(path.join(__dirname,'..','cp52','release.html'));
(async()=>{const g=await game({src,seed:3,render:true});
console.log(g.run(`(()=>{const out={};const cv=document.createElement('canvas');cv.width=cv.height=400;const c=cv.getContext('2d');
for(const id of ['cheese','shrimp','tuna','duck','yarn','mouse','bell','bowtie','notes','cushion','biscuit','milk','egg','feather','sardine','rain5','rain10','rain25','note','fish','laser','heart']){c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,400,400);const sv=ctx;ctx=c;try{drawPrize('item',id,200,200,1);}finally{ctx=sv;}
const d=c.getImageData(0,0,400,400).data;let x0=400,x1=-1,y0=400,y1=-1;for(let y=0;y<400;y++)for(let x=0;x<400;x++)if(d[(y*400+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
{const f=queueTreatAward(id,200,null,true);out[id]=[x1-x0+1,y1-y0+1,Math.round(prizeWidth(id,1)),+f.ms.toFixed(3),Math.round((x1-x0+1)*f.ms),Math.round((y1-y0+1)*f.ms),+f.s0.toFixed(3)];treatAwards.length=0;}}return JSON.stringify(out);})()`));g.close();})();
