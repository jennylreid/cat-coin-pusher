const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const path=require('path');const root=path.resolve(__dirname,'../../..');
(async()=>{
 const layers=[];
 const pupil=await sharp(root+'/work/cp26/art/pupil.webp').extract({left:483,top:107,width:289,height:1041}).png().toBuffer();
 const sourcePupil=await sharp(pupil).resize(75,180,{fit:'fill'}).toBuffer();
 for(let i=0;i<2;i++){
 const file=i?'/tickets/UAT-06-approved-sharp-grin.webp':'/work/cp26/art/head-sweet.webp';
 const composed=await sharp(root+file).composite([{input:sourcePupil,left:463,top:451},{input:sourcePupil,left:1023,top:468}]).png().toBuffer();
 const head=await sharp(composed).resize(724,483).png().toBuffer();
 layers.push({input:head,left:i*724,top:40});
 }
 const p=await sharp(pupil).resize(35,84,{fit:'fill'}).toBuffer();
 for(let i=0;i<3;i++){
 const candidate=await sharp(__dirname+'/generated-candidates.png').extract({left:i*724,top:0,width:724,height:550}).composite([{input:p,left:218,top:257},{input:p,left:476,top:257}]).png().toBuffer();
 layers.push({input:candidate,left:(i+2)*724,top:0});
 }
 const labels=['Sweet (original)','Sharp Grin (original)','A','B','C'];
 labels.forEach((s,i)=>layers.push({input:Buffer.from(`<svg width="724" height="65"><text x="362" y="45" text-anchor="middle" fill="white" font-family="Arial" font-size="35">${s}</text></svg>`),left:i*724,top:550}));
 await sharp({create:{width:3620,height:630,channels:4,background:'#3e4651'}}).composite(layers).png().toFile(__dirname+'/comparison.png');
})();

