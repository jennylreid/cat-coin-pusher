    // CP-38 sounds, generated here. The background music runs through its own bus (Music volume dial) so it can fade in
    // and out cleanly; the pusher slide uses the Pusher sound dial. Sound off or background = silent.
    _w2ok(){return !(inBackground||document.hidden)&&ready();},
    _bus(){if(!this.__bus){this.__bus=ac.createGain();this.__bus.gain.value=0;this.__bus.connect(master);}return this.__bus;},
    _mt(f,t0,dur,type,vol,dest,fEnd){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(fEnd)o.frequency.exponentialRampToValueAtTime(fEnd,t0+dur);
      g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.006);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(dest||master);o.start(t0);o.stop(t0+dur+.03);},
    _mn(t0,dur,vol,freq,q,dest,attack){const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=noiseBuf;s.loop=true;f.type='bandpass';f.frequency.value=freq;f.Q.value=q||1;
      if(attack){g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(vol,t0+attack);g.gain.setValueAtTime(vol,t0+Math.max(attack,dur-.25));g.gain.linearRampToValueAtTime(.0001,t0+dur);}
      else{g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);}
      s.connect(f);f.connect(g);g.connect(dest||master);s.start(t0);s.stop(t0+dur+.02);},
    // fade the music bus to level (0 = silent) over fade seconds
    bgmBus(level,fade=.3){if(!ready())return;const g=this._bus().gain,t=ac.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(Math.max(.0001,g.value),t);g.linearRampToValueAtTime(Math.max(.0001,level),t+fade);},
    // one note of the background track, on the music bus, delay seconds ahead
    bgm(kind,delay,f){
      if(!this._w2ok())return;const t=ac.currentTime+Math.max(0,delay),B=this._bus();
      if(kind==='kick'){this._mt(120,t,.16,'sine',.32,B,48);}
      else if(kind==='rim'){this._mn(t,.05,.1,2600,3,B);this._mt(1800,t,.03,'square',.025,B);}
      else if(kind==='shaker'){this._mn(t,.045,.045,7500,1.2,B);}
      else if(kind==='bass'){this._mt(f,t,.2,'triangle',.2,B);this._mt(f*2,t,.08,'sine',.05,B);}
      else if(kind==='mar'){this._mt(f,t,.32,'sine',.13,B);this._mt(f*4,t,.07,'sine',.035,B);this._mt(f*2,t,.12,'triangle',.03,B);}
      else if(kind==='pad'){for(const x of f)this._mt(x,t,1.0,'triangle',.022,B);}
      else if(kind==='meow'){this._mt(f,t,.28,'triangle',.07,B,f*1.5);this._mt(f*1.5,t+.14,.3,'triangle',.05,B,f*.9);}
    },
    // the pusher: a soft mechanical slide over the stroke, a little clunk where it stops
    slide(vol,dur,back){
      const v=vol;if(!(v>0)||!this._w2ok())return;const t=ac.currentTime,k=back?.55:1;
      this._mn(t,dur,.035*v*k,back?520:700,.8,master,.18);this._mn(t,dur,.015*v*k,1700,1.5,master,.25);
      this._mt(back?70:85,t+dur-.02,.12,'sine',.12*v*k,master,45);this._mn(t+dur-.02,.05,.05*v*k,420,1.2);
    },
    wild2(kind,vol=1,arg=0){
      const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
      if(kind==='perfect'){[523.25,659.25,783.99,1046.5,1318.5,1567.98].forEach((f,i)=>{this._mt(f,t+i*.07,.5,'triangle',.08*v);bell(t+i*.07,f*2,.04*v,.6);});noise(t+.42,.9,.08*v,6000,.5);}
      else if(kind==='total'){this._mt(196,t,.5,'sawtooth',.05*v,392);[783.99,1046.5].forEach((f,i)=>bell(t+.2+i*.08,f,.07*v,.8));}
      else if(kind==='whoosh'){this._mn(t,.7,.09*v,1200,.6,master,.35);}
      else if(kind==='land'){steelAt(t,.32*v,.9+Math.random()*.6,true);}
      else if(kind==='tick'){this._mt(2200,t,.03,'square',.05*v);this._mn(t,.02,.12*v,3500,2);}
      else if(kind==='win'){[659.25,783.99,1046.5].forEach((f,i)=>this._mt(f,t+i*.09,.4,'triangle',.1*v));bell(t+.3,2093,.07*v,1.2);}
      else if(kind==='yawn'){ // a long, sliding, slightly wobbly yawn
        const o=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(420,t);o.frequency.linearRampToValueAtTime(560,t+.35);o.frequency.linearRampToValueAtTime(240,t+1.5);
        fl.type='lowpass';fl.frequency.setValueAtTime(700,t);fl.frequency.linearRampToValueAtTime(1600,t+.4);fl.frequency.linearRampToValueAtTime(500,t+1.5);
        g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.08*v,t+.15);g.gain.linearRampToValueAtTime(.06*v,t+1.2);g.gain.linearRampToValueAtTime(.0001,t+1.6);o.connect(fl);fl.connect(g);g.connect(master);o.start(t);o.stop(t+1.65);}
      else if(kind==='sweep'){this._mn(t,.8,.12*v,900,.6,master,.1);for(let i=0;i<8;i++)steelAt(t+.1+i*.08,.25*v,.9+Math.random()*.4,false);}
      else if(kind==='visitor'){[783.99,987.77,1174.66,1567.98].forEach((f,i)=>bell(t+i*.11,f,.06*v,.9));this._mt(600,t+.5,.25,'triangle',.06*v,900);this._mt(900,t+.68,.3,'triangle',.05*v,520);}
    },
