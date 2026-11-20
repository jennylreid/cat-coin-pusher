const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..'),W=1536,H=1024;
const source=root+'/work/cp26/art/head-calm.png';
const image=b=>sharp(b,{raw:{width:W,height:H,channels:4}});
const gold=(d,p)=>d[p]>d[p+2]+1&&d[p+1]>d[p+2]+1&&d[p]>=d[p+1]*.8;
const eye=(x,y)=>y>=388&&y<648&&((x>=298&&x<648)||(x>=888&&x<1238));
const mo=(x,y)=>x>=600&&x<936&&y>=745&&y<915;
function over(a,b){const o=Buffer.from(a);for(let p=0;p<o.length;p+=4){let t=b[p+3]/255;if(!t)continue;for(let c=0;c<3;c++)o[p+c]=Math.round(b[p+c]*t+o[p+c]*(1-t));o[p+3]=Math.round((t+o[p+3]/255*(1-t))*255);}return o;}
(async()=>{
const hash=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
const base=await sharp(source).ensureAlpha().raw().toBuffer();
const ref=await sharp(root+'/tickets/CP-55-evidence/squint/CP-55-playful-review.png').ensureAlpha().raw().toBuffer();
const eyes=Buffer.alloc(base.length),mouth=Buffer.alloc(base.length);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
const p=(y*W+x)*4;
if(eye(x,y)&&(gold(base,p)||gold(ref,p))){ref.copy(eyes,p,p,p+3);eyes[p+3]=255;}
if(mo(x,y)){ref.copy(mouth,p,p,p+3);mouth[p+3]=255;}
}
// Replace the complete mouth overlay with the shallower isolated painting.
for(let y=745;y<915;y++)for(let x=600;x<936;x++){
 const p=(y*W+x)*4,t=(x-600)/335,lp=(y*W+590)*4,rp=(y*W+946)*4;
 for(let c=0;c<3;c++)mouth[p+c]=Math.round(base[lp+c]*(1-t)+base[rp+c]*t);
 mouth[p+3]=Math.round(255*Math.max(0,Math.min(1,(x-600)/12,(935-x)/12,(y-745)/12,(914-y)/12)));
}
const crop=await sharp(__dirname+'/mouth-edit.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let p=0;p<crop.data.length;p+=4)if(Math.min(crop.data[p],crop.data[p+1],crop.data[p+2])>215)crop.data[p+3]=0;
const painted=await sharp(crop.data,{raw:crop.info}).trim({background:'#ffffff00'}).resize(290,100,{fit:'fill'}).ensureAlpha().raw().toBuffer();
for(let y=0;y<100;y++)for(let x=0;x<290;x++){
const q=(y*290+x)*4,p=((y+758)*W+x+623)*4,a=painted[q+3]/255;
for(let c=0;c<3;c++)mouth[p+c]=Math.round(painted[q+c]*a+mouth[p+c]*(1-a));
if(a)mouth[p+3]=255;
}
await image(eyes).png().toFile(__dirname+'/eyes.png');
await image(mouth).png().toFile(__dirname+'/mouth.png');
// Optional preview layer with original gameplay pupils clipped to the exact preferred eye openings.
const withPupils=Buffer.from(eyes);
const pupil=await sharp(root+'/work/cp26/art/pupil.webp').extract({left:483,top:107,width:289,height:1041}).resize(75,180,{fit:'fill'}).ensureAlpha().raw().toBuffer();
for(const cx of [500,1060])for(let v=0;v<180;v++)for(let u=0;u<75;u++){
const x=Math.round(cx-37.5)+u,y=451+v,p=(y*W+x)*4,q=(v*75+u)*4;
if(!gold(ref,p)||ref[p]<100)continue;const a=pupil[q+3]/255;for(let c=0;c<3;c++)withPupils[p+c]=Math.round(pupil[q+c]*a+eyes[p+c]*(1-a));
}
await image(withPupils).png().toFile(__dirname+'/eyes-with-pupils.png');
const stats=[];
for(const [name,e] of [['composite',eyes],['composite-with-pupils',withPupils]]){
await image(over(over(base,e),mouth)).png().toFile(__dirname+'/'+name+'.png');
const saved=await sharp(__dirname+'/'+name+'.png').ensureAlpha().raw().toBuffer();let outside=0,spill=0;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){let p=(y*W+x)*4;if(!eye(x,y)&&!mo(x,y)&&!saved.subarray(p,p+4).equals(base.subarray(p,p+4)))outside++;if((!eye(x,y)&&e[p+3])||(!mo(x,y)&&mouth[p+3]))spill++;}
stats.push({file:name+'.png',changedPixelsOutsideEyesAndMouth:outside,overlayPixelsOutsideAllowedRegions:spill});
await sharp(__dirname+'/'+name+'.png').flatten({background:'#e8e6e1'}).resize(1152,768).png().toFile(__dirname+'/'+name+'-preview.png');
}
fs.writeFileSync(__dirname+'/validation.json',JSON.stringify({base:source,baseSHA256:hash,preferredEyes:'squint/CP-55-playful-review.png',canvas:[W,H],previews:stats},null,2));
})();

