// Side-by-side: node pair.cjs out.png leftLabel left.png rightLabel right.png
const n=require('@napi-rs/canvas');n.GlobalFonts.registerFromPath('C:/Windows/Fonts/segoeuib.ttf','lbl');
(async()=>{const [out,la,a,lb,b]=process.argv.slice(2);const A=await n.loadImage(a),B=await n.loadImage(b);
const c=n.createCanvas(A.width*2+20,A.height+44),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
x.drawImage(A,0,44);x.drawImage(B,A.width+20,44);x.fillStyle='#111';x.font='24px lbl';x.textAlign='center';
x.fillText(la,A.width/2,31);x.fillText(lb,A.width*1.5+20,31);require('fs').writeFileSync(out,c.toBuffer('image/png'));})();
