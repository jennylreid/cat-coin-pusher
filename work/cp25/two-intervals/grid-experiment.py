from pathlib import Path
p=Path('work/cp25/two-intervals');s=(p/'two-plain.html').read_text(encoding='utf-8')
a=s.index('function solidCoinContacts(');b=s.index('let pushCoinSoundPlayed',a);part=s[a:b]
pos=part.index(' const obstacles=[];');part=part[:pos]+(p/'grid.js').read_text(encoding='utf-8')+part[pos:]
part=part.replace('a.b.rb.setTranslation(a.p,true);a.sleeping=false;', 'a.b.rb.setTranslation(a.p,true);a.sleeping=false;indexMove(a);')
x=part.index('  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){');y=part.index('  if(!changed)break;',x)
block=part[x:y]
block=block.replace('  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){\n   const a=cs[i],b=cs[j];','  for(let i=0;i<cs.length;i++){const a=cs[i];let pending=neighbours(a,i+1),cursor=0;while(cursor<pending.length){\n   const j=pending[cursor++],b=cs[j];')
# Only the pair correction marks changed in this isolated block.
block=block.replace('   changed=true;\n  }','   changed=true;pending=neighbours(a,j+1);cursor=0;\n  }}')
part=part[:x]+block+part[y:];s=s[:a]+part+s[b:];(p/'two-grid.html').write_text(s,encoding='utf-8')
p=Path('work/cp25/two-intervals/compare.cjs');s=p.read_text(encoding='utf-8').replace('i<360','i<720').replace('collect=i>=60','collect=i>=360').replace('i%24===0','i%12===0').replace('(i/24)%14','(i/12)%14').replace('g.c.Path2D=native.Path2D;', 'g.c.Path2D=native.Path2D;g.c.__game.selectBoard(2);');s=s.replace('360 fixed 1/60 steps','720 fixed 1/60 steps on Board3').replace('every24 steps (0.4s)','every12 steps (0.2s)').replace('First60 steps','First360 steps');Path('work/cp25/two-intervals/compare-grid.cjs').write_text(s,encoding='utf-8')
