const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),W=1536,H=1024;
const basePath=root+'/work/cp26/art/head-calm.png';
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const image=raw=>sharp(raw,{raw:{width:W,height:H,channels:4}});
const boxes={eyes:[{x:298,y:388,w:350,h:260},{x:888,y:388,w:350,h:260}],mouth:{x:600,y:745,w:336,h:170}};
const inside=(x,y,b)=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h;
function over(base,layer){const out=Buffer.from(base);for(let p=0;p<out.length;p+=4){let a=layer[p+3]/255;if(!a)continue;for(let c=0;c<3;c++)out[p+c]=Math.round(layer[p+c]*a+out[p+c]*(1-a));out[p+3]=Math.round((a+out[p+3]/255*(1-a))*255);}return out;}
(async()=>{
const before=hash(basePath),base=await sharp(basePath).ensureAlpha().raw().toBuffer();
const pupil=await sharp(root+'/work/cp26/art/pupil.webp').extract({left:483,top:107,width:289,height:1041}).resize(75,180,{fit:'fill'}).ensureAlpha().raw().toBuffer();
const studyMeta=await sharp(__dirname+'/mouth-study.png').metadata();
const validation=[];const panels=[];
for(let option=0;option<3;option++){
const letter='ABC'[option],dir=__dirname+'/'+letter;fs.mkdirSync(dir,{recursive:true});
const eyes=Buffer.alloc(base.length);
for(let side=0;side<2;side++){
 const b=boxes.eyes[side],cx=side?1060:500,px=Math.round(cx-37.5),py=451;
 for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){
 const p=(y*W+x)*4;
 const gold=base[p]>base[p+2]+1&&base[p+1]>base[p+2]+1&&base[p]>=base[p+1]*.8;
 if(!gold)continue;
 const t=Math.max(0,Math.min(1,(side?1224-x:x-310)/324));
 const params=[{start:490,curve:20,slope:50},{start:side?510:480,curve:25,slope:side?40:60},{start:505,curve:15,slope:45}][option];
 const lid=params.start+params.curve*Math.sin(Math.PI*t)+params.slope*t;
 const visible=Math.max(0,Math.min(1,y-lid+.5));
 for(let c=0;c<3;c++)eyes[p+c]=Math.round(base[p+c]*visible);
 eyes[p+3]=255;
 const u=x-px,v=y-py;
 if(u>=0&&u<75&&v>=0&&v<180&&visible>0){let q=(v*75+u)*4,a=pupil[q+3]/255*visible;for(let c=0;c<3;c++)eyes[p+c]=Math.round(pupil[q+c]*a+eyes[p+c]*(1-a));}
 }
}
await image(eyes).png().toFile(dir+'/eyes.png');
// White-backed mouth artwork is isolated; the overlay includes a local muzzle-colored
// cover for the normal mouth, just as an expression layer must cover the prior expression.
const cell=Math.floor(studyMeta.width/3);
const {data,info}=await sharp(__dirname+'/mouth-study.png').extract({left:option*cell,top:0,width:cell,height:studyMeta.height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let p=0;p<data.length;p+=4){if(Math.min(data[p],data[p+1],data[p+2])>215)data[p+3]=0;}
const isolated=await sharp(data,{raw:info}).trim({background:'#ffffff00'}).resize({width:[296,290,314][option],height:135,fit:'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const mouth=Buffer.alloc(base.length),m=boxes.mouth;
// Match the local white muzzle with a flat patch confined to this mouth ROI.
for(let y=m.y;y<m.y+m.h;y++)for(let x=m.x;x<m.x+m.w;x++){const p=(y*W+x)*4;const t=(x-m.x)/(m.w-1),lp=(y*W+590)*4,rp=(y*W+946)*4;for(let c=0;c<3;c++)mouth[p+c]=Math.round(base[lp+c]*(1-t)+base[rp+c]*t);mouth[p+3]=Math.round(255*Math.max(0,Math.min(1,(x-m.x)/12,(m.x+m.w-1-x)/12,(y-m.y)/12,(m.y+m.h-1-y)/12)));}
const mx=Math.round(768-isolated.info.width/2),my=763;
for(let y=0;y<isolated.info.height;y++)for(let x=0;x<isolated.info.width;x++){
const q=(y*isolated.info.width+x)*4,p=((y+my)*W+x+mx)*4,a=isolated.data[q+3]/255;
for(let c=0;c<3;c++)mouth[p+c]=Math.round(isolated.data[q+c]*a+mouth[p+c]*(1-a));
}
await image(mouth).png().toFile(dir+'/mouth.png');
let preview=over(over(base,eyes),mouth);
await image(preview).png().toFile(dir+'/composite.png');preview=await sharp(dir+'/composite.png').ensureAlpha().raw().toBuffer();
let outside=0,eyeSpill=0,mouthSpill=0;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
const p=(y*W+x)*4,eye=boxes.eyes.some(b=>inside(x,y,b)),mo=inside(x,y,m);
if(!eye&&!mo&&!preview.subarray(p,p+4).equals(base.subarray(p,p+4)))outside++;
if(!eye&&eyes[p+3])eyeSpill++;if(!mo&&mouth[p+3])mouthSpill++;
}
validation.push({option:letter,changedPixelsOutsideEyeAndMouthAreas:outside,eyeOverlayPixelsOutsideEyeAreas:eyeSpill,mouthOverlayPixelsOutsideMouthArea:mouthSpill,canvas:[W,H]});
panels.push(await image(preview).flatten({background:'#e8e6e1'}).resize(600,400).png().toBuffer());
}
const layers=[];for(let i=0;i<3;i++){
layers.push({input:panels[i],left:i*600,top:60});
layers.push({input:Buffer.from(`<svg width="600" height="60"><text x="300" y="40" text-anchor="middle" fill="#222" font-family="Arial" font-size="28">${['A — relaxed squint','B — uneven squint','C — tighter squint'][i]}</text></svg>`),left:i*600,top:0});
}
await sharp({create:{width:1800,height:470,channels:4,background:'#e8e6e1'}}).composite(layers).png().toFile(__dirname+'/review-three-options.png');
fs.writeFileSync(__dirname+'/validation.json',JSON.stringify({base:'work/cp26/art/head-calm.png',baseSHA256Before:before,baseSHA256After:hash(basePath),regions:boxes,options:validation},null,2));
})();

