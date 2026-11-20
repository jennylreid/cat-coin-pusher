// ---------- CP-86 Sonic meow face (Jenny, Nov 18: "for the Siamese cat, we can use the yawn face with Sonic Meow, don't
// you think?"; go: "the Siamese shows its open-mouth yawn face during the meow") ----------
// During Sonic meow's action (after the CP-82 title), the Siamese shows its own open-mouth yawn face, the CP-75 Siamese
// copy of the approved yawn face (CP75_ART.siamese.face), drawn the way the wheel's Yawn draws it: over the normal face on
// the head's own canvas, fading in over 0.15 s, held while the meows and the sound rings play, and fading out with the
// rings over the last 0.4 s. Then the normal face. Existing art only; the rings, shake, sounds, reach and timing unchanged.
const CP86={fadeIn:.15,fadeOut:.4};
function cp86K(){const X=PGPX;if(!X||X.id!=='sonic'||CP75_CAT!=='siamese')return 0;const A=CP75_ART.siamese;if(!A||!A.face)return 0;
 return Math.max(0,Math.min(1,X.t/CP86.fadeIn,(X.dur-X.t)/CP86.fadeOut));}
const __cp86Pupils=drawTrackingPupils;
drawTrackingPupils=function(){const k=cp86K();if(k<=0)return __cp86Pupils();
 if(k<1)__cp86Pupils();ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);ctx.globalAlpha*=k;ctx.drawImage(CP75_ART.siamese.face,0,0);ctx.restore();};
// ---------- end CP-86 ----------
