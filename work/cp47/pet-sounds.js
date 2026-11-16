    // CP-43 Pet the cat sounds, built with the same safe helpers as Wild 2 (_mt, _mn always connect to a real node).
    // vol is scaled by the Pickup volume dial; sound off or background = silent.
    pet(kind,vol=1,arg=0){
      const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
      if(kind==='start'){[523.25,659.25,783.99].forEach((f,i)=>this._mt(f,t+i*.08,.3,'triangle',.08*v));this._mt(520,t+.3,.16,'triangle',.07*v,master,780);this._mt(700,t+.46,.22,'triangle',.06*v,master,560);bell(t+.25,1567.98,.05*v,.8);}
      else if(kind==='brush'){ // a soft fur swish for each stretch of stroke; brighter as the purr builds
        const k=Math.max(0,Math.min(1,arg));this._mn(t,.2,.055*v,1500+900*k,.55,master,.07);}
      else if(kind==='mrrp'){ // the ear tap: a quick ear flick ("flp") and a little trill
        this._mn(t,.045,.12*v,2600,1.6);const f=480+Math.random()*80;this._mt(f,t+.03,.12,'triangle',.07*v,master,f*1.45);this._mt(f*1.4,t+.13,.16,'triangle',.06*v,master,f*1.1);}
      else if(kind==='huh'){this._mt(330,t,.16,'triangle',.045*v,master,470);this._mn(t,.08,.03*v,900,1);}
      else if(kind==='peak'){[1318.5,1567.98,2093].forEach((f,i)=>bell(t+i*.06,f,.06*v,.9));this._mt(1046.5,t,.4,'sine',.05*v);}
      else if(kind==='grr'){this._mt(120,t,.45,'sawtooth',.045*v,master,92);this._mn(t,.4,.04*v,380,1.2,master,.1);}
      else if(kind==='hiss'){ // a long breathy hiss with a little "pfft" at the start; a cartoon gag, not a fight
        this._mn(t,.06,.16*v,2400,1.2);this._mn(t+.02,.95,.16*v,5200,.45,master,.04);this._mn(t+.02,.8,.07*v,7600,.6,master,.04);}
      else if(kind==='content'){this._mt(760,t,.22,'triangle',.06*v,master,560);this._mt(560,t+.2,.32,'triangle',.05*v,master,500);}
    },
    // The purr: looping noise through a low filter, its loudness pulsed by a 17-28 Hz wobble; a growl mixes in when
    // the cat has had too much. level 0 = off. Uses only setValueAtTime / linearRamp (no setTargetAtTime).
    purr(level,rate,growl=0){
      const live=level>0&&!S.muted&&this._w2ok();const P=this.__purr;
      if(!live){if(P&&P.on){const t=ac.currentTime;for(const g of [P.out,P.gout]){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+.18);}P.on=false;}return;}
      const v=typeof pickupFx==='object'?pickupFx.volume:1;
      if(!P){const s=ac.createBufferSource(),lp=ac.createBiquadFilter(),vca=ac.createGain(),out=ac.createGain(),lfo=ac.createOscillator(),dep=ac.createGain(),
        go=ac.createOscillator(),glp=ac.createBiquadFilter(),gout=ac.createGain();
       s.buffer=noiseBuf;s.loop=true;lp.type='lowpass';lp.frequency.value=230;lp.Q.value=.9;vca.gain.value=.5;dep.gain.value=.5;out.gain.value=0;
       lfo.type='sine';lfo.frequency.value=22;go.type='sawtooth';go.frequency.value=78;glp.type='lowpass';glp.frequency.value=420;gout.gain.value=0;
       s.connect(lp);lp.connect(vca);vca.connect(out);out.connect(master);lfo.connect(dep);dep.connect(vca.gain);go.connect(glp);glp.connect(gout);gout.connect(master);
       s.start();lfo.start();go.start();this.__purr={s,lp,vca,out,lfo,go,gout,on:false};}
      const Q=this.__purr,t=ac.currentTime,r=Math.max(10,Math.min(32,rate));Q.on=true;
      const ramp=(p,x)=>{p.cancelScheduledValues(t);p.setValueAtTime(p.value,t);p.linearRampToValueAtTime(x,t+.08);};
      ramp(Q.out.gain,Math.min(1.2,level)*.55*v);ramp(Q.lfo.frequency,r);ramp(Q.lp.frequency,200+level*160);ramp(Q.gout.gain,Math.max(0,Math.min(1,growl))*.07*v);ramp(Q.go.frequency,78+growl*30);
    },
