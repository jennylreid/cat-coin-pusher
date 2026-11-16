const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
(async()=>{
 const source=root+'/tickets/UAT-06-approved-sharp-grin.webp';
 const pupil=await sharp(root+'/work/cp26/art/pupil.webp').extract({left:483,top:107,width:289,height:1041}).resize(75,180,{fit:'fill'}).png().toBuffer();
 const erase=Buffer.from('<svg width="1536" height="1024"><path d="M460 732 L1080 732 L1060 827 Q1010 929 850 945 Q620 955 530 875 Q480 820 460 732Z" fill="#fff"/></svg>');
 const base=await sharp(source).composite([{input:erase}]).png().toBuffer();
 const files=[root+'/work/cp26/art/head-sweet.webp',source];
 for(let i=0;i<3;i++){
  const {data,info}=await sharp(__dirname+'/generated-mouths.png').extract({left:i*724,top:200,width:724,height:280}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let p=0;p<data.length;p+=4){if(Math.min(data[p],data[p+1],data[p+2])>220)data[p+3]=0;}
  const mouth=await sharp(data,{raw:info}).trim({background:'#ffffff00'}).resize({width:i===1?360:430}).png().toBuffer();
  const m=await sharp(mouth).metadata();
  await sharp(base).composite([{input:mouth,left:Math.round(768-m.width/2),top:760}]).png().toFile(__dirname+'/'+['A','B','C'][i]+'.png');
  files.push(__dirname+'/'+['A','B','C'][i]+'.png');
 }
 const originalPixels=await sharp(source).ensureAlpha().raw().toBuffer();
 for(const f of files.slice(2)){const pixels=await sharp(f).ensureAlpha().raw().toBuffer();for(let p=0;p<pixels.length;p+=4){const x=(p/4)%1536,y=Math.floor(p/4/1536);if(x<455||x>1085||y<730||y>950)originalPixels.copy(pixels,p,p,p+4);}await sharp(pixels,{raw:{width:1536,height:1024,channels:4}}).png().toFile(f);}
 const layers=[];
 for(let i=0;i<5;i++){
  const head=await sharp(files[i]).composite([{input:pupil,left:463,top:451},{input:pupil,left:1023,top:468}]).png().toBuffer();
  layers.push({input:await sharp(head).resize(600,400).toBuffer(),left:i*600,top:0});
  layers.push({input:Buffer.from(`<svg width="600" height="60"><text x="300" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="28">${['Sweet (original)','Sharp Grin (original)','A','B','C'][i]}</text></svg>`),left:i*600,top:410});
 }
 await sharp({create:{width:3000,height:480,channels:4,background:'#303946'}}).composite(layers).png().toFile(__dirname+'/comparison.png');
 // Verify every new sprite differs from Sharp Grin only within the mouth region.
 const orig=await sharp(source).ensureAlpha().raw().toBuffer();const report=[];
 for(const f of files.slice(2)){const out=await sharp(f).ensureAlpha().raw().toBuffer();let outside=0;for(let p=0;p<orig.length;p+=4){const x=(p/4)%1536,y=Math.floor(p/4/1536);if((x<455||x>1085||y<730||y>950)&&(orig[p+3]||out[p+3])&&!orig.subarray(p,p+4).equals(out.subarray(p,p+4)))outside++;}report.push({file:path.basename(f),changedPixelsOutsideMouth:outside});}
 fs.writeFileSync(__dirname+'/validation.json',JSON.stringify(report,null,2));
})();


