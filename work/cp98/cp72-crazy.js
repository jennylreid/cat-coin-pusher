// ---------- CP-72 hang rework (UAT 98; Jenny, Nov 18: "During the hang the ginger kitten moves toward the middle of the
// screen and tilts about 20 degrees, for extra crazy energy." Then: "the idea is to make the cat come at you in a silly way,
// right? It's almost like a joke, because it is so cute. It knows it's cute, so it kind of puts itself right in your face
// for a second." And: "Showing off is a good way to frame it.") ----------
// Showing off: at the top of its final leap the puffed ginger kitten comes right up to the screen - centred, big and close,
// tilted 20 degrees - holds there about a second, then drops back into its leap and lands where it does now. The close-up
// is as big as the screen allows (90% of its width, 70% of its height, tilt included), so it fits at 360x640 too.
// To go back to UAT 96's hang (hangs 1 s at the top of the leap, 1.5x, upright, in place), set style to 'still'.
Object.assign(Z72.leapHang,{style:'crazy', // 'crazy' (showing off) | 'still' (UAT 96)
 faceHang:1.45,faceIn:.2,faceOut:.25, // the hang (s) in the showing-off style: comes at you, holds about 1 s, drops back
 tilt:20*Math.PI/180,faceW:.9,faceH:.7,faceY:.57}); // tilt; close-up size as parts of the screen; its centre (part of the screen's height)
// screen place and size of the close-up, blended from the kitten's place on the board (F 0..1)
// (the kitten tilts about its feet, so its feet are placed to keep its middle, about 46 units above them at this size,
// on the screen's centre line)
function cp72Face(p0,s,F,lean){const L=Z72.leapHang,S=Math.min(L.faceW*W/92,L.faceH*H/118),c=46*S,fx=200-c*Math.sin(lean||0),fy=H*L.faceY+c*Math.cos(lean||0);
 return {x:p0.x+(fx-p0.x)*F,y:p0.y+(fy-p0.y)*F,s:s+(S-s)*F*F};} // it grows mostly once centred, so it stays on the screen on the way
// ---------- end CP-72 hang rework ----------
