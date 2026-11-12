    // CP-40 Paw save: a rising "uh-oh" when a prize starts to tip, the mitt's whoosh, and the swipe that sends it back.
    paw40(kind,vol=1){const v=vol*(typeof pickupFx==='object'&&Number.isFinite(pickupFx.volume)?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
 if(kind==='uhoh'){this._mt(330,t,.16,'triangle',.11*v,master,392);this._mt(440,t+.17,.32,'triangle',.12*v,master,660);this._mt(880,t+.17,.28,'sine',.04*v,master,1320);}
 else if(kind==='whoosh'){this._mn(t,.16,.14*v,900,.8,master,.06);}
 else if(kind==='swipe'){this._mn(t,.12,.2*v,2400,.9,master,.01);this._mt(180,t,.1,'sine',.25*v,master,90);[783.99,1046.5,1318.5].forEach((f,i)=>this._mt(f,t+.05+i*.05,.22,'triangle',.07*v));bell(t+.2,2093,.05*v,.6);}
},
