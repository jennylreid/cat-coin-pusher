    // CP-36: the device's audio output delay (s), so the beat can be scheduled early and heard on the beat indicator.
    danceLatency(){return ac?Math.min(.25,Math.max(0,ac.outputLatency||ac.baseLatency||0)):0;},
    // CP-36 Dance break sounds, generated here. delay (s) schedules the sound ahead on the audio clock so the beat stays
    // steady between frames. vol 1 = full level, scaled by the Pickup volume dial. Sound off or background = silent.
    dance(kind,vol=1,delay=0,arg=0){
      const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);
      if(inBackground||document.hidden||!(v>0)||!ready())return;
      const t=ac.currentTime+Math.max(0,delay);
      if(kind==='kick'){tone(150,t,.2,'sine',.55*v,42);noise(t,.02,.2*v,3000,.8);}
      else if(kind==='snare'){noise(t,.16,.26*v,1900,.7);noise(t,.07,.12*v,5200,.9);tone(210,t,.08,'triangle',.12*v,160);}
      else if(kind==='hat'){noise(t,.035,.09*v,8200,1.2);}
      else if(kind==='clap'){for(let i=0;i<3;i++)noise(t+i*.012,.05,.16*v,1500,1.1);noise(t+.036,.18,.12*v,1300,.9);}
      else if(kind==='bass'){tone(arg,t,.24,'triangle',.2*v);tone(arg*2,t,.12,'sawtooth',.035*v,arg*1.98);}
      else if(kind==='lead'){tone(arg,t,.16,'square',.032*v);tone(arg*2,t,.1,'triangle',.03*v);}
      else if(kind==='count'){tone(arg||1200,t,.06,'square',.07*v);tone((arg||1200)*1.5,t,.04,'sine',.05*v);noise(t,.02,.12*v,4000,2);}
      else if(kind==='crash'){noise(t,1.1,.16*v,6500,.5);noise(t,.5,.08*v,3200,.6);}
      else if(kind==='hit'){const k=Math.pow(2,Math.min(arg,12)/12);bell(t,1568*k,.07*v,.5);bell(t+.05,2093*k,.05*v,.45);steelAt(t,.3*v,1.25,false);}
      else if(kind==='hitRain'){[1318.5,1568,2093,2637].forEach((f,i)=>bell(t+i*.04,f,.06*v,.6));noise(t,.3,.05*v,5000,.7);}
      else if(kind==='miss'){tone(150,t,.09,'square',.045*v,95);}
      else if(kind==='stop'){noise(t,1.4,.2*v,6000,.5);[261.63,329.63,392,523.25].forEach(f=>{tone(f,t,1,'sawtooth',.04*v);tone(f,t,1.2,'triangle',.07*v);});tone(65,t,.8,'sine',.4*v,40);}
      else if(kind==='roar'){
        // the cat's roar: the growl, bigger, with a boom under it
        const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),lfo=ac.createOscillator(),depth=ac.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(150,t);o.frequency.linearRampToValueAtTime(70,t+1.3);
        f.type='lowpass';f.frequency.value=900;f.Q.value=3;
        g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.42*v,t+.08);g.gain.linearRampToValueAtTime(.32*v,t+1);g.gain.linearRampToValueAtTime(.0001,t+1.4);
        lfo.frequency.value=24;depth.gain.value=.22*v;lfo.connect(depth);depth.connect(g.gain);
        o.connect(f);f.connect(g);g.connect(master);o.start(t);lfo.start(t);o.stop(t+1.45);lfo.stop(t+1.45);
        noise(t,1.2,.16*v,380,1.3);tone(70,t,1,'sine',.5*v,32);noise(t,.3,.2*v,900,.6);
      }
      else if(kind==='pour'){noise(t,1.6,.11*v,900,.5);noise(t+.1,1.4,.08*v,4200,.7);for(let i=0;i<18;i++)steelAt(t+.05+i*.075+Math.random()*.03,.3*v,.9+Math.random()*.7,false);}
      else if(kind==='notch'){bell(t,1318.5+arg*160,.06*v,.5);tone(660+arg*80,t,.1,'triangle',.06*v);}
      else if(kind==='full'){[523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>{tone(f,t+i*.05,.25,'triangle',.07*v);bell(t+i*.05,f*2,.03*v,.4);});}
    },
