    // CP-41 Treat toss sounds, built with the same safe helpers as Wild 2 (_mt, _mn always connect to a real node).
    // vol is scaled by the Pickup volume dial; sound off or background = silent. arg: catch streak, flip progress, end count.
    toss(kind,vol=1,arg=0){
      const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
      if(kind==='start'){this._mn(t,.45,.08*v,1500,.7,master,.3);[392,523.25,659.25,783.99].forEach((f,i)=>this._mt(f,t+.12+i*.07,.28,'triangle',.09*v));bell(t+.42,1567.98,.06*v,.9);}
      else if(kind==='flip'){ // a soft upward "fwip" as the cat flips a treat; a touch higher as the toss speeds up
        const p=1+.25*Math.max(0,Math.min(1,arg));this._mn(t,.16,.07*v,1400*p,.9,master,.05);this._mt(380*p,t,.14,'triangle',.035*v,master,760*p);}
      else if(kind==='catch'){ // snap + chomp + a bright pop that climbs with the streak
        const k=Math.max(0,Math.min(12,(arg|0)-1)),f=880*Math.pow(2,k/12);
        this._mn(t,.035,.22*v,3200,1.4);this._mt(190,t+.01,.09,'square',.07*v,master,95);this._mn(t+.03,.06,.12*v,900,1.2);
        this._mt(f,t+.02,.14,'triangle',.1*v);this._mt(f*1.5,t+.06,.12,'sine',.05*v);if(k>=4)bell(t+.06,f*2,.04*v,.5);}
      else if(kind==='whiff'){this._mn(t,.24,.08*v,650,.7,master,.07);this._mt(320,t,.18,'sine',.035*v,master,190);}
      else if(kind==='drop'){this._mt(170,t,.16,'sine',.1*v,master,85);this._mn(t,.07,.05*v,500,1);}
      else if(kind==='end'){const n=Math.max(1,Math.min(8,arg|0));for(let i=0;i<n;i++)this._mt(659.25*Math.pow(2,i/12*2),t+i*.06,.18,'triangle',.07*v);
        [1046.5,1318.5,1567.98].forEach((f,i)=>bell(t+n*.06+i*.08,f,.06*v,.9));}
    },
