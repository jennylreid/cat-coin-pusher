const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs');
(async()=>{
// Mirror the left half about the upper-lip center; no further generation.
const input=__dirname+'/generated-mouth.png';const meta=await sharp(input).metadata();
const half=Math.round(meta.width*853/1717);
const left=await sharp(input).extract({left:0,top:0,width:half,height:meta.height}).png().toBuffer();
const right=await sharp(left).flop().png().toBuffer();
await sharp({create:{width:half*2,height:meta.height,channels:4,background:'white'}}).composite([{input:left,left:0,top:0},{input:right,left:half,top:0}]).png().toFile(__dirname+'/mouth-edit.png');
const {data,info}=await sharp(__dirname+'/mouth-edit.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});let differing=0;
for(let y=0;y<info.height;y++)for(let x=0;x<info.width/2;x++){let p=(y*info.width+x)*4,q=(y*info.width+info.width-1-x)*4;if(!data.subarray(p,p+4).equals(data.subarray(q,q+4)))differing++;}
fs.writeFileSync(__dirname+'/symmetry-validation.json',JSON.stringify({mirroredPixelPairDifferences:differing},null,2));
})();
