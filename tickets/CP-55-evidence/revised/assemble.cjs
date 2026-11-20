const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const path=require('path');const root=path.resolve(__dirname,'../../..');
(async()=>{
const layers=[];
const pupil=await sharp(root+'/work/cp26/art/pupil.webp').extract({left:483,top:107,width:289,height:1041}).resize(75,180).png().toBuffer();
for(let i=0;i<2;i++){
const src=i?root+'/tickets/UAT-06-approved-sharp-grin.webp':root+'/work/cp26/art/head-sweet.webp';
const head=await sharp(src).composite([{input:pupil,left:463,top:451},{input:pupil,left:1023,top:468}]).resize(420,280).png().toBuffer();
layers.push({input:head,left:7+i*434,top:35});
}
for(let i=0;i<3;i++)layers.push({input:await sharp(__dirname+'/generated-study.png').extract({left:870+i*434,top:165,width:432,height:320}).resize(420,311).toBuffer(),left:875+i*434,top:8});
const labels=['Sweet — original','Sharp Grin — original','A','B','C'];
for(let i=0;i<5;i++)layers.push({input:Buffer.from(`<svg width="434" height="60"><text x="217" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="24">${labels[i]}</text></svg>`),left:i*434,top:330});
await sharp({create:{width:2172,height:405,channels:4,background:'#30333e'}}).composite(layers).png().toFile(__dirname+'/comparison-original-references.png');
})();
