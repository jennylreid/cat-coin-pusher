// CP-70: move the existing DOM nodes after all original handlers are bound.
// No IDs, handlers or hidden controls are removed. Native details is closed each opening.
const __cp70Credits=openCredits;
openCredits=function(){const result=__cp70Credits.apply(this,arguments);if(!S.dev||!panel.querySelector||panel.querySelector('#cp70-main'))return result;
 const main=document.createElement('div');main.id='cp70-main';main.className='set';
 const title=document.createElement('h3');title.textContent='Developer';main.appendChild(title);
 const engineer=document.createElement('details');engineer.id='cp70-engineer';
 const summary=document.createElement('summary');summary.textContent='Engineer tools';engineer.appendChild(summary);
 // The old panel's coin button was unreachable; expose the same grant here.
 if(!panel.querySelector('[data-coins="1000"]')){const b=document.createElement('button');b.dataset.coins='1000';b.className='wide';b.textContent='+1,000 coins';b.onclick=()=>{S.coins+=1000;save();b.textContent='✓ '+S.coins.toLocaleString()+' coins';};panel.appendChild(b);}
 const close=panel.querySelector('#close');
 for(const n of Array.from(panel.children)){if(n===close||n.tagName==='H2')continue;engineer.appendChild(n);}
 panel.appendChild(main);
 const groups=[['Basics',['#devmode','#sound-test','#checkupd','#diag-send-file']],['Levels',['#pgl-all','#pgl-pass','#pgt-reset']],['Give',['[data-coins="1000"]','#pg-give','#pgt-powers','#pgt-cats']],['Start now',['#dance-now','#w2-spin','[data-slice]','#cp64-now','#pg-visit']]];
 for(const [label,selectors]of groups){const h=document.createElement('h3');h.textContent=label;main.appendChild(h);for(const sel of selectors){const nodes=Array.from(engineer.querySelectorAll(sel)),seen=new Set();for(const [i,n]of nodes.entries()){if((sel!=='[data-slice]'&&i)||seen.has(n.textContent))continue;seen.add(n.textContent);if(n.id==='pgt-reset')n.textContent='Back to Level 1';main.appendChild(n);}}}
 const reset=engineer.querySelector('#pg-reset');if(reset)main.appendChild(reset);
 panel.appendChild(engineer);return result;
};
