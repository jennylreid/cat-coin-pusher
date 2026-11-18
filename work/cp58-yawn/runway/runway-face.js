
// ---------- CP-58 Runway trial (Nov 16): Runway's full yawn face as the yawn frame ----------
// Loaded after cp58-yawn.js. During the yawn the Runway face (own eyes, jaw and mouth, fitted to the head canvas) fades
// in over the normal face and back out; the code-drawn yawn eyes and mouth are not drawn. While eating, the closed eyes
// are Runway's own squinting eyes (cut from the same image, same place on the head canvas) instead of the code-drawn
// arcs; the chewing mouth is the prototype's. Stretch, side-eye (open eyes, pupils) and grab are the prototype unchanged.
// CP58_RUNWAY_SRC / CP58_RUNWAY_EYES_SRC are set by build_runway.py.
let CP58_RUNWAY=null,CP58_RUNWAY_EYES=null;
function cp58RunwayLoad(src,set){
 (typeof __loadImage==='function'?__loadImage(src) // desktop renderer
  :(()=>{const im=new Image();im.src=src;return im.decode().then(()=>im);})()).then(set).catch(e=>{try{console.error('runway art',src,e);}catch(_){}});}
cp58RunwayLoad(CP58_RUNWAY_SRC,im=>{CP58_RUNWAY=im;});
cp58RunwayLoad(CP58_RUNWAY_EYES_SRC,im=>{CP58_RUNWAY_EYES=im;});
function cp58RunwayK(t){ // fade in 0.05-0.30 s, hold, fade out 1.25-1.47 s (the prototype's own yawn envelope)
 return t>.05&&t<CP58.eyesOpen?cp58Ease((t-.05)/.25)*(1-cp58Ease((t-1.25)/.22)):0;}
const __cp58FaceOrig=cp58Face;
cp58Face=function(){const Y=W2_YAWN,t=Y.t,k=cp58RunwayK(t);
 const eat=t>CP58.eat&&t<CP58.end-.15;
 if(!CP58_RUNWAY||!CP58_RUNWAY_EYES)return __cp58FaceOrig();
 ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);
 if(eat){ // Runway's squinting eyes, then the prototype's chewing mouth (unchanged)
  ctx.drawImage(CP58_RUNWAY_EYES,0,0);
  const o=Y.chewOpen||0;if(o>.05){ctx.fillStyle='#3a0b14';ctx.strokeStyle='#000';ctx.lineWidth=10;ctx.beginPath();ctx.ellipse(766,840,50+40*o,18+50*o,0,0,7);ctx.fill();ctx.stroke();}
  else ctx.drawImage(ART.happyMouth,0,0);}
 else if(k>0){ctx.globalAlpha=k;ctx.drawImage(CP58_RUNWAY,0,0);}
 ctx.restore();};
// The normal face keeps its pupils under the yawn fade (the Runway face covers them at full strength); shut while eating.
drawTrackingPupils=function(){const Y=W2_YAWN;if(!Y||!Y.cp58)return __cp58Pupils();const t=Y.t;
 const eat=t>CP58.eat&&t<CP58.end-.15,k=cp58RunwayK(t);
 if(!eat&&k<1)__cp58Pupils();cp58Face();};
