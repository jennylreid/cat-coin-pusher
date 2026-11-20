const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs');
(async()=>{
const original=await sharp(__dirname+'/playful-squint-ear-tufts-v2.png').ensureAlpha().raw().toBuffer();
const edited=await sharp('C:/Users/jenny/.codex/generated_images/01a1e5aa-db9d-7781-a367-a9710896d804/exec-7ce10389-1bb5-4c65-8033-2c435a28bd67.png').ensureAlpha().raw().toBuffer();
const out=Buffer.from(original);
for(let y=750;y<895;y++)for(let x=620;x<915;x++){let p=(y*1536+x)*4;edited.copy(out,p,p,p+4);}
await sharp(out,{raw:{width:1536,height:1024,channels:4}}).png().toFile(__dirname+'/playful-squint-mouth-v3.png');
const saved=await sharp(__dirname+'/playful-squint-mouth-v3.png').ensureAlpha().raw().toBuffer();let outside=0;
for(let p=0;p<saved.length;p+=4){const x=(p/4)%1536,y=Math.floor(p/4/1536);if((x<620||x>=915||y<750||y>=895)&&!saved.subarray(p,p+4).equals(original.subarray(p,p+4)))outside++;}
fs.writeFileSync(__dirname+'/mouth-v3-validation.json',JSON.stringify({width:1536,height:1024,changedPixelsOutsideMouth:outside,cornerAlpha:saved[3]},null,2));
})();
