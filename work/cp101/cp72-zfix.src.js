// ---------- CP-72 Zoomies sound fix (UAT 101; Jenny on her phone, UAT 99/100: "The Zoomies sound, I can't really hear
// anything. I can hear it when I click today. I don't hear anything when I click P1, P2, P3.") ----------
// Two causes, both fixed here: (1) too quiet: P1/P2 had come out about 10 dB under their target (peak limiting of spiky coin
// rattles) and played at 0.11, about 20 dB under the yawn sounds. The beds are now compressed to the yawn files' level
// (work/cp72-pusher-sound/louder.py) and played at 0.35, as the yawns. (2) a silent first tap: the Engineer tools button
// waited 0.3 s for its 7 s recording to decode and played nothing if it wasn't ready (a phone decodes slower). All three are
// now decoded when Engineer tools opens, and a tap plays its sound as soon as it's decoded (up to 4 s). Same choice, same
// key, same moment in Zoomies; Today unchanged.
Object.assign(CP72Z.B64,{P1:"@P1@",P2:"@P2@",P3:"@P3@"});CP72Z.gain=.35;
const __cp72zfCredits=openCredits;
openCredits=function(){const r=__cp72zfCredits.apply(this,arguments);try{
 const box=panel.querySelector&&panel.querySelector('#cp72-zsound');if(!box)return r;
 for(const k of ['P1','P2','P3'])CP72Z.load(k);
 for(const b of box.querySelectorAll('button')){const k=b.dataset.zs;if(k==='today')continue;
  // replaces the button's old handler (tick, save, 0.3 s wait): tick and save the same way, then play once decoded
  b.onclick=()=>{const t0=Date.now();CP72Z.set(k);
   for(const o of box.querySelectorAll('button'))o.textContent=(o.dataset.zs===k?'✓ ':'')+CP72Z.NAMES[o.dataset.zs],o.style.fontWeight=o.dataset.zs===k?'700':'400';
   const go=()=>{try{if(CP72Z.get()!==k)return;if(CP72Z.bufs[k]){if(CP72Z.play(k,1))setTimeout(()=>CP72Z.stop(.3),2000);return;}
    CP72Z.load(k);if(Date.now()-t0<4000)setTimeout(go,100);}catch(e){}};go();};}}catch(e){}return r;};
// ---------- end CP-72 Zoomies sound fix ----------
