    // CP-35 Wild board sounds, generated here with the same helpers as the other sounds. vol is 1 for full level and
    // is scaled by the Pickup volume dial (0 = silent). Sound off or background = silent.
    wild(kind,vol=1){
      const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);
      if(inBackground||document.hidden||!(v>0)||!ready())return;
      const t=ac.currentTime;
      if(kind==='beep'){tone(660,t,.14,'square',.06*v);tone(1320,t,.08,'sine',.05*v);}
      else if(kind==='go'){[523.25,659.25,783.99,1046.5].forEach((f,i)=>{tone(f,t+i*.06,.5,'triangle',.11*v);tone(f*2,t+i*.06,.25,'sine',.03*v);});noise(t,.5,.12*v,2500,.6);bell(t+.24,2093,.08*v,1);}
      else if(kind==='whistle'){tone(2400,t,.85,'sine',.07*v,520);tone(2430,t,.85,'sine',.03*v,530);}
      else if(kind==='thud'){tone(95,t,.3,'sine',.4*v,40);noise(t,.08,.18*v,700,.8);steelAt(t+.02,.5*v,.8,true);}
      else if(kind==='rain'){noise(t,.9,.09*v,900,.5);noise(t+.1,.7,.06*v,4000,.7);[1046.5,1318.5,1568,2093,2637].forEach((f,i)=>bell(t+i*.07,f,.06*v,.7));}
      else if(kind==='drip'){steelAt(t,.28*v,1.05+Math.random()*.7,false);}
      else if(kind==='topple'){tone(80,t,.35,'sine',.3*v,45);noise(t,.25,.12*v,1800,.6);let a=.55;for(let i=0;i<9;i++){steelAt(t+.03+i*.055+Math.random()*.02,a*v,.85+Math.random()*.5,i===8);a*=.86;}}
      else if(kind==='tick'){noise(t,.02,.22*v,3200,2);tone(1800,t,.03,'square',.04*v);}
      else if(kind==='tickHi'){noise(t,.02,.28*v,4200,2);tone(2400,t,.04,'square',.06*v);}
      else if(kind==='tock'){noise(t,.02,.2*v,2000,2);tone(1200,t,.03,'square',.04*v);}
      else if(kind==='turbo'){for(let i=0;i<3;i++){tone(520,t+i*.36,.18,'sawtooth',.05*v,980);tone(980,t+i*.36+.18,.18,'sawtooth',.05*v,520);}tone(60,t,1.1,'sawtooth',.06*v,140);}
      else if(kind==='bonus'){tone(300,t,.18,'sine',.12*v,900);tone(900,t+.12,.15,'triangle',.06*v,1400);}
      else if(kind==='win'){
        const notes=[[523.25,0],[659.25,.12],[783.99,.24],[1046.5,.36],[783.99,.56],[1046.5,.68]];
        for(const [f,d] of notes){tone(f,t+d,.32,'sawtooth',.045*v);tone(f,t+d,.36,'triangle',.08*v);}
        for(const f of [523.25,659.25,783.99,1046.5])tone(f,t+.86,1.4,'triangle',.07*v);
        noise(t+.86,1.2,.07*v,6000,.5);for(let i=0;i<14;i++)steelAt(t+.9+i*.09+Math.random()*.04,.35*v,1+Math.random()*.6,false);
        bell(t+.86,2093,.08*v,1.6);bell(t+1.1,2637,.06*v,1.4);
      }
      else if(kind==='lose'){
        [[392,0],[369.99,.38],[349.23,.76]].forEach(([f,d])=>{tone(f,t+d,.34,'sawtooth',.06*v,f*.97);tone(f/2,t+d,.34,'triangle',.06*v);});
        for(let i=0;i<8;i++)tone(329.63-i*3,t+1.14+i*.11,.12,'sawtooth',.06*v,320-i*4);tone(164.8,t+1.14,1,'triangle',.08*v,150);
      }
    },
