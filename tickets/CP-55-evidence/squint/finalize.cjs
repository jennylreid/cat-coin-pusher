const sharp=require('C:/Users/jenny/AppData/Local/OpenAI/Codex/runtimes/cua_node/db1cc9e06a6c48d6/bin/node_modules/sharp');
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
(async()=>{
const original=await sharp(root+'/work/cp26/art/head-sweet.webp').ensureAlpha().raw().toBuffer();
const candidate=await sharp(__dirname+'/playful-squint-mouth-v5.png').ensureAlpha().raw().toBuffer();
const out=Buffer.from(original);
const gold=(d,p)=>d[p]>d[p+2]+1&&d[p+1]>d[p+2]+1&&d[p]>=d[p+1]*0.8;
for(let y=0;y<1024;y++)for(let x=0;x<1536;x++){
 const p=(y*1536+x)*4;
 const eye=y>=390&&y<645&&((x>=300&&x<645)||(x>=890&&x<1235));
 const mouth=x>=620&&x<915&&y>=750&&y<895;
 const ear=y>=230&&y<325&&((x>=240&&x<365)||(x>=1170&&x<1298));
 const hair=ear&&candidate[p]>160&&candidate[p+1]>150&&candidate[p+2]>140&&Math.abs(candidate[p]-candidate[p+1])<40;
 if((eye&&(gold(original,p)||gold(candidate,p)))||mouth||hair)candidate.copy(out,p,p,p+3);
 // Original alpha preserves the approved angular silhouette and removes generated haze.
 out[p+3]=original[p+3];
}
const final=__dirname+'/CP-55-playful-review.png';
await sharp(out,{raw:{width:1536,height:1024,channels:4}}).png().toFile(final);
await sharp(final).flatten({background:'#e8e6e1'}).resize(1152,768).png().toFile(__dirname+'/CP-55-playful-review-preview.png');
let alphaDiff=0;for(let p=3;p<out.length;p+=4)if(out[p]!==original[p])alphaDiff++;
fs.writeFileSync(__dirname+'/final-review-validation.json',JSON.stringify({width:1536,height:1024,alphaDifferencesFromOriginalSweet:alphaDiff,pupilsBakedIn:false,reviewStatus:'Awaiting Jenny; not integrated'},null,2));
})();

