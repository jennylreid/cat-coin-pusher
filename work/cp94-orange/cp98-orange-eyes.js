
// ---------- CP-98 (Jenny, Nov 19): "The orange cat has black tuxedo cat eyes. And I know we have the art for the closed
// eyes for orange cat, so we need to use it here." (PM, Nov 19: the same for the Ragdoll, Siamese and Tortie) ----------
// The happy face (Treat toss, and the squint of a tickle or petting) drew the Tuxedo's black eye patches and yellow arcs on
// every cat. Each other cat now draws its own approved closed eyes (CP-75 Yawn art, cp75-yawn-eyes-<cat>.png), in the same
// place on the head canvas as its Yawn draws them, with the same mouth. No new art, instant swap. The Tuxedo is unchanged.
const __cp98Happy=drawHappyFeatures;
drawHappyFeatures=function(){const A=CP75_CAT!=='tuxedo'&&CP75_ART[CP75_CAT];if(!A||!A.eyes)return __cp98Happy();
 ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);ctx.drawImage(A.eyes,0,0);ctx.drawImage(ART.happyMouth,0,0);ctx.restore();};
// ---------- end CP-98 ----------
