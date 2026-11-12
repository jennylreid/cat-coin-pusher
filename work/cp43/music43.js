// ---------- UAT 43: Music: Classic (the UAT 38-40 loop) / Kawaii pop, a Developer switch; Classic is the default ----------
// Both play at the same level where a phone speaker plays: Classic at Music volume 100% runs its bus at 1.72x its old
// "100%", about 0.025 RMS above 250 Hz, like Kawaii pop at 100%. Saved with the music volume; the
// performance log shows it in soundTuning.track.
const CLASSIC_GAIN=1.72; // Classic's bus at Music volume 100% (its old 100% x1.72 = Kawaii pop's phone-band level)
const __m43DevHtml=wildDevHtml,__m43Bind=wildDevBind;
wildDevHtml=function(){return __m43DevHtml().replace('<div class="set" id="w2-dev"><h3><span>Wild 2 and sound</span><span>tuning</span></h3>','<div class="set" id="w2-dev"><h3><span>Wild 2 and sound</span><span>tuning</span></h3><button id="w2-track" class="wide">Music: '+(W2.track==='kawaii'?'Kawaii pop':'Classic')+' (tap to switch)</button>');};
wildDevBind=function(panel){__m43Bind(panel);const b=panel.querySelector&&panel.querySelector('#w2-track');if(b)b.onclick=()=>{W2.track=W2.track==='kawaii'?'classic':'kawaii';w2Save();try{diagEvent('w2-tuning','track='+W2.track);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};};
