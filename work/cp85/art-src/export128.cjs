// Fits a 1254 px master into the game's 128 px canvas exactly as CP-62 did for milk B (contact-sheets.cjs: master
// bounds at alpha>64 drawn into the current milk's target box). Usage: node export128.cjs <master.png> <out.png>
const fs=require('fs');
const {createCanvas,loadImage}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const [src,out]=process.argv.slice(2);const im=await loadImage(src);
 const b={x:333,y:96,w:572,h:1093},target={x:36,y:20,w:56,h:86}; // milk B's master bounds and target (CP-62 validation.json)
 const c=createCanvas(128,128),g=c.getContext('2d');g.drawImage(im,b.x,b.y,b.w,b.h,target.x,target.y,target.w,target.h);
 fs.writeFileSync(out,c.toBuffer('image/png'));})();
