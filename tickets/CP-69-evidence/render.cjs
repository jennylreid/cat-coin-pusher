// Phase A only: fit generated overlays and render comparisons. Never writes runtime.
const fs=require('fs'),path=require('path');
const {createCanvas,loadImage}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const D=__dirname,root=path.resolve(D,'../..');
const save=(c,n)=>fs.writeFileSync(path.join(D,n+'.png'),c.toBuffer('image/png'));
function bounds(im){const c=createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let x=im.width,y=im.height,r=0,b=0,zero=0;for(let j=0;j<im.height;j++)for(let i=0;i<im.width;i++){let a=d[(j*im.width+i)*4+3];if(!a)zero++;if(a>32){x=Math.min(x,i);y=Math.min(y,j);r=Math.max(r,i);b=Math.max(b,j);}}return {x,y,w:r-x+1,h:b-y+1,zero};}
async function main(){const validation=[];
for(const id of ['hat','bowtie','monocle','cane'])for(const o of ['a','b','c']){const im=await loadImage(path.join(D,'masters',id+'-'+o+'.png')),b=bounds(im);if(!b.zero)throw Error('No transparency '+id+o);const c=createCanvas(1536,1024),g=c.getContext('2d');let t;
if(id==='hat'){const k=Math.min(826/b.w,355/b.h);t=[768-b.w*k/2,355-b.h*k,b.w*k,b.h*k];}
if(id==='bowtie'){const k=Math.min(420/b.w,180/b.h);t=[768-b.w*k/2,1024-b.h*k,b.w*k,b.h*k];}
if(id==='monocle')t=[205,375,440,400];
if(id==='cane')t=[262,370,922,122];
g.drawImage(im,b.x,b.y,b.w,b.h,...t);save(c,id+'-'+o);const lensCentreAlpha=id==='monocle'?g.getImageData(500,515,1,1).data[3]:null;if(lensCentreAlpha!==null&&lensCentreAlpha>32)throw Error('Lens centre obscured '+o);validation.push({id,option:o,canvas:[1536,1024],source:b,placement:t,output:bounds(c),lensCentreAlpha});}
const refs=await Promise.all(['cheese','shrimp','tuna'].map(x=>loadImage(path.join(root,'tickets/CP-56-evidence/reference-'+x+'.png'))));
for(const id of ['hat','bowtie','monocle','cane']){if(!['a','b','c'].every(o=>fs.existsSync(path.join(D,id+'-'+o+'.png'))))continue;const imgs=await Promise.all(['a','b','c'].map(o=>loadImage(path.join(D,id+'-'+o+'.png'))));const c=createCanvas(1140,680),g=c.getContext('2d');g.fillStyle='#13252b';g.fillRect(0,0,1140,680);g.fillStyle='white';g.font='bold 25px Arial';g.fillText('CP-69 / '+id.toUpperCase()+' / Phase A options',24,38);g.font='14px Arial';g.fillStyle='#c3d4d5';g.fillText('Separate accessory overlays. Approved reference art is unchanged. No game or UAT changes.',24,64);
const labels=['Today','A','B','C','Cheese','Shrimp','Tuna'];
for(let i=0;i<7;i++){const x=24+i*157;g.fillStyle='white';g.font='bold 17px Arial';g.fillText(labels[i],x+40,94);const im=i===0?await loadImage(path.join(D,'current-'+id+'.png')):i<4?imgs[i-1]:refs[i-4];const b=bounds(im);for(const row of [{y:110,h:170,bg:'#24494a',size:128},{y:311,h:115,bg:'#257c78',size:84},{y:457,h:68,bg:'#16242d',size:32},{y:557,h:68,bg:'#f7eee0',size:32}]){g.fillStyle=row.bg;g.fillRect(x,row.y,148,row.h);let k=Math.min(row.size/b.w,row.size/b.h);g.drawImage(im,b.x,b.y,b.w,b.h,x+74-b.w*k/2,row.y+(row.h-b.h*k)/2,b.w*k,b.h*k);}}
g.fillStyle='#c3d4d5';g.font='13px Arial';['Detail / fitted 128 px crop','Scale comparison / fitted 84 px crop on teal','Small icon / 32 px / dark','Small icon / 32 px / light card'].forEach((s,i)=>g.fillText(s,24,[299,445,544,644][i]));g.fillText('A/B/C are independent choices. See 412x915 real-game previews for actual accessory scale.',24,668);save(c,id+'-contact-sheet');}
fs.writeFileSync(path.join(D,'validation.json'),JSON.stringify(validation,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
