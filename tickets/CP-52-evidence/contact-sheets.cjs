// Presentation and canvas fitting only; all new prize painting is image_gen.
const fs=require('fs'),path=require('path');
const {createCanvas,loadImage}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const dir=__dirname;
function bounds(im,threshold=64){let c=createCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0,transparent=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){let a=d[(y*c.width+x)*4+3];if(!a)transparent++;if(a>threshold){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}return {x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,transparent};}
(async()=>{const validation=[];
for(const id of ['feather','ball','cushion']){
const current=await loadImage(path.join(dir,'current-'+id+'.png')),target=bounds(current);
for(const op of ['a','b','c']){const im=await loadImage(path.join(dir,'masters',id+'-'+op+'.png')),b=bounds(im,1),c=createCanvas(128,128),g=c.getContext('2d');g.drawImage(im,b.x,b.y,b.w,b.h,target.x,target.y,target.w,target.h);fs.writeFileSync(path.join(dir,id+'-'+op+'.png'),c.toBuffer('image/png'));validation.push({id,option:op,canvas:[128,128],target,master:b,output:bounds(c)});}
const cols=[['Today','current-'+id],['A',id+'-a'],['B',id+'-b'],['C',id+'-c'],['Cheese','reference-cheese'],['Shrimp','reference-shrimp'],['Tuna','reference-tuna']];
const c=createCanvas(1140,680),g=c.getContext('2d');g.fillStyle='#13252b';g.fillRect(0,0,c.width,c.height);g.fillStyle='#fff';g.font='bold 25px Arial';g.fillText('CP-52 / '+id.toUpperCase()+' / Phase A options',24,38);g.font='14px Arial';g.fillStyle='#c3d4d5';g.fillText('Art comparison only. Original canvas and opaque footprint retained. References are unchanged.',24,64);
const rows=[{y:110,h:170,bg:'#24494a',label:'Detail / 128 px canvas',size:128},{y:311,h:115,bg:'#257c78',label:'Board / 84 px canvas (400-unit game width)',size:84},{y:457,h:68,bg:'#16242d',label:'Small icon / 32 px / dark',size:32},{y:557,h:68,bg:'#f7eee0',label:'Small icon / 32 px / light card',size:32}];
for(let i=0;i<cols.length;i++){const [label,file]=cols[i],im=await loadImage(path.join(dir,file+'.png')),x=24+i*157;g.fillStyle='#fff';g.font='bold 17px Arial';g.fillText(label,x+45,94);for(const r of rows){g.fillStyle=r.bg;g.fillRect(x,r.y,148,r.h);let w=r.size,h=r.size;if(file==='reference-tuna'){w=r.size*3.8/2.8;h=w*im.height/im.width;}g.drawImage(im,x+74-w/2,r.y+(r.h-h)/2,w,h);}}
g.font='13px Arial';g.fillStyle='#c3d4d5';for(const r of rows)g.fillText(r.label,24,r.y+r.h+19);g.fillText('A/B/C are proposals for Jenny to pick or redo. No game or UAT changes.',24,668);fs.writeFileSync(path.join(dir,id+'-contact-sheet.png'),c.toBuffer('image/png'));
}fs.writeFileSync(path.join(dir,'validation.json'),JSON.stringify(validation,null,2));console.log('9 transparent 128x128 options; 3 contact sheets; validation.json');})();
