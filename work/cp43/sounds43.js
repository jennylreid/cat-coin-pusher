    // UAT 43 sounds: a lost prize (a sad plop and a descending "aww"), a lost star (plus a falling sting), the wheel's
    // slice, jackpot and uh-oh. Pickup volume dial; sound off or background = silent.
    wild43(kind,vol=1){
      const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
      if(kind==='lost'||kind==='lostStar'){
        this._mt(220,t,.18,'sine',.3*v,master,90);noise(t,.06,.15*v,500,1);
        const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(520,t+.12);o.frequency.exponentialRampToValueAtTime(260,t+.9);
        f.type='bandpass';f.frequency.setValueAtTime(1100,t+.12);f.frequency.linearRampToValueAtTime(700,t+.9);f.Q.value=2;
        g.gain.setValueAtTime(.0001,t+.12);g.gain.linearRampToValueAtTime(.09*v,t+.22);g.gain.linearRampToValueAtTime(.0001,t+.95);o.connect(f);f.connect(g);g.connect(master);o.start(t+.12);o.stop(t+1);
        if(kind==='lostStar'){this._mt(110,t,.9,'sawtooth',.06*v,master,55);[392,349.23,311.13,261.63].forEach((fr,i)=>this._mt(fr,t+.25+i*.16,.3,'triangle',.08*v));}
      }
      else if(kind==='slice'){[783.99,987.77,1174.66].forEach((f,i)=>this._mt(f,t+i*.06,.3,'triangle',.09*v));bell(t+.18,1568,.06*v,.8);}
      else if(kind==='jackpot'){[523.25,659.25,783.99,1046.5,1318.5,1567.98,2093].forEach((f,i)=>{this._mt(f,t+i*.06,.45,'square',.04*v);bell(t+i*.06,f*2,.04*v,.6);});noise(t+.4,1.2,.1*v,6000,.5);}
      else if(kind==='bonk'){this._mt(240,t,.14,'sine',.32*v,master,110);this._mn(t,.05,.16*v,420,1.2);this._mt(120,t+.01,.1,'triangle',.12*v,master,80);}
      else if(kind==='uhoh'){this._mt(392,t,.22,'triangle',.1*v,master,370);this._mt(311.13,t+.25,.45,'triangle',.1*v,master,280);}
    },
