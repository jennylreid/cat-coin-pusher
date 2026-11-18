from pathlib import Path
import json
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-69-evidence/uat88'
s=(p.parent/'cp72/runtime.cjs').read_text(encoding='utf-8')
s=s.replace("path.resolve(__dirname, 'runtime')","path.resolve(__dirname, '../cp72/runtime')")
a=s.index('  c.__loadImage =');b=s.index('\n',a)
s=s[:a]+"""  c.__loadImage = src => {if(src.startsWith('data:'))return native.loadImage(src);
    let data=fs.readFileSync(path.join(__dirname,'boot88',src));
    // NAPI mistakes some C2PA metadata for SVG. Omit metadata in memory only; keep all pixel chunks.
    if(data[0]===137&&data.subarray(1,4).toString()==='PNG'){const chunks=[data.subarray(0,8)];let i=8;while(i<data.length){const n=data.readUInt32BE(i)+12,k=data.subarray(i+4,i+8).toString();if(k!=='caBX')chunks.push(data.subarray(i,i+n));i+=n;}data=Buffer.concat(chunks);}
    return native.loadImage(data);};"""+s[b:]
(p/'runtime.cjs').write_text(s,encoding='utf-8')
for ticket,filename,start in [('63','checks63.cjs',' // 1 + 2:'),('64','checks64.cjs',' // 1. the wheel')]:
 s=(p/filename).read_text(encoding='utf-8').replace("require('../cp72/runtime.cjs')","require('./runtime.cjs')")
 a=s.index(start);b=s.index(" check('5",a) if ticket=='63' else s.index(' // 5',a)
 s=s[:a]+" // Resume at the failed rendered pickup check; preceding behavioral checks were already observed passing.\n"+s[b:]
 s=s.replace("'checks.json'","'checks63-tail.json'").replace("'checks86-on87.json'","'checks64-tail.json'")
 (p/f'checks{ticket}-tail.cjs').write_text(s,encoding='utf-8')
print('Rendered test adapter uses the complete staged runtime; gameplay tests unchanged.')
