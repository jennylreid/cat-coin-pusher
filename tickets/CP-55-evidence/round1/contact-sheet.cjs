const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs');
const dir=__dirname;
const root=require('path').resolve(dir,'../../..');
const items=[['Sweet (approved)',root+'/work/cp26/art/head-sweet.webp'],['Sharp Grin (approved)',root+'/tickets/UAT-06-approved-sharp-grin.webp'],['A - Zoomies',dir+'/A-zoomies.png'],['B - Cheeky',dir+'/B-cheeky.png'],['C - Play laugh',dir+'/C-play-laugh.png']];
const svg=(w,h,text,size=48)=>Buffer.from(`<svg width="${w}" height="${h}"><text x="${w/2}" y="${h*.7}" text-anchor="middle" fill="white" font-family="Arial" font-size="${size}">${text}</text></svg>`);
(async()=>{
 const layers=[];const validation=[];
 for(let i=0;i<5;i++){
  let [name,path]=items[i];let head=await sharp(path).png().toBuffer();
  const meta=await sharp(head).metadata(); validation.push({name,width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha});
  // Reference-only pupils simulate the existing gameplay overlay; source art is untouched.
  if(i<2) head=await sharp(head).composite([{input:Buffer.from('<svg width="1536" height="1024"><ellipse cx="500" cy="535" rx="37.5" ry="90" fill="black"/><ellipse cx="1060" cy="552" rx="37.5" ry="90" fill="black"/></svg>')}]).png().toBuffer();
  layers.push({input:svg(1536,90,name),left:i*1536,top:0});
  layers.push({input:head,left:i*1536,top:110});
  const board=await sharp(root+'/tickets/CP-51-evidence/uat68/level1-start-uat68-393x852.png').resize(786,1704).toBuffer();
  // Art comparison composite over an existing real-game capture, never a generated board.
  const phone=await sharp(board).composite([{input:await sharp(head).resize(786,480).toBuffer(),left:0,top:213}]).png().toBuffer();
  layers.push({input:phone,left:i*1536+375,top:1220});
 }
 await sharp({create:{width:7680,height:3000,channels:4,background:'#182430'}}).composite(layers).png().toFile(dir+'/contact-sheet-full.png');
 await sharp(dir+'/contact-sheet-full.png').resize(2304).png().toFile(dir+'/contact-sheet-preview.png');
 fs.writeFileSync(dir+'/validation.json',JSON.stringify(validation,null,2));
})();
