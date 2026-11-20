"""CP-100 PLAY goes to the endless board. Build = a published base UAT + build name + the CP-100 edits + cp100-play.js appended.
Usage: python build.py <base work folder> <UAT number>   e.g. python build.py cp116 119
Writes release-version.json, edits.json and release.html here (art/ is copied from the base for the render harness)."""
from pathlib import Path
import json,hashlib,re,shutil,sys
p=Path(__file__).parent;W=p.parent;base=sys.argv[1];N=int(sys.argv[2]);B=W/base
m=json.loads((B/'publication-manifest.json').read_text());s=(B/'release.html').read_bytes();bh=hashlib.sha256(s).hexdigest()
assert bh==m['releaseHTMLSHA256'],'base release.html is not what it published'
bn=m['displayName'];bnum=int(bn.split()[-1]);assert N>bnum,(N,bn)
v={'displayName':'2026.11.19 UAT %d'%N,'version':m['version']+(N-bnum),'apkVersion':7,'base':base,'baseSHA256':bh}
(p/'release-version.json').write_text(json.dumps(v),encoding='utf-8')
if (B/'art').exists():shutil.copytree(B/'art',p/'art',dirs_exist_ok=True)
s=s.decode('utf-8');mm=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(mm.group(0),"const BUILD = '%s';"%v['displayName'])]
# CP-100 edits (UAT only): the endless button becomes All boards; no coin jar (the Shop, pantry overflow and the recipe coin's
# fallback in Catnip); the top bars show the coin push's coins (the endless wallet) instead of the jar
CC="(typeof cp100Coins==='function'?cp100Coins():PG.coins)"
EDITS+=[("ctx.fillText('Endless board',200,b.y+b.h/2+1);","ctx.fillText('Level boards',200,b.y+b.h/2+1); /* CP-100 */"),
 ("pgSfx('tap');endStart();return;}}}catch(e){}return __endMainTap(p);","pgSfx('tap');cp100Open('levels');return;}}}catch(e){}return __endMainTap(p); /* CP-100 */"),
 ("if(over>0){const c=over*pgSell(id);PG.coins+=c;pgFloat('+'+c,x,y,'#ffd23f');pgSfx('clink');}","if(over>0){const c=over*pgSell(id);PG.catnip+=c;pgFloat('+'+c+' Catnip',x,y,'#8dff9a');pgSfx('clink');} /* CP-100 */"),
 ("return Object.keys(m).some(i=>!pgWinnable(i)&&PG.coins>=pgBuy(i));}","return Object.keys(m).some(i=>!pgWinnable(i)&&PG.catnip>=pgBuy(i));} /* CP-100 */"),
 ("off=Sh.tab==='buy'&&(PG.coins<price||pgHave(r.id)>=pgCap());","off=Sh.tab==='buy'&&(PG.catnip<price||pgHave(r.id)>=pgCap()); /* CP-100 */"),
 ("PG.items[r.id]--;PG.coins+=pgSell(r.id);","PG.items[r.id]--;PG.catnip+=pgSell(r.id); /* CP-100 */"),
 ("const p=pgBuy(r.id);if(PG.coins<p||pgHave(r.id)>=pgCap()){pgSfx('lock');return;}PG.coins-=p;","const p=pgBuy(r.id);if(PG.catnip<p||pgHave(r.id)>=pgCap()){pgSfx('lock');return;}PG.catnip-=p; /* CP-100 */"),
 ("else{PG.coins+=25;callout('+25 COINS TO THE JAR',{color:'#ffd23f',dur:1.2});}","else{PG.catnip+=3;callout('+3 CATNIP',{color:'#8dff9a',dur:1.2});} /* CP-100 */"),
 ("pgShopTap=function(r){const c=PG.coins;const out=__pgShopTapR(r);if(PG.coins>c)pgScreenReact('nod');","pgShopTap=function(r){const c=PG.catnip;const out=__pgShopTapR(r);if(PG.catnip>c)pgScreenReact('nod'); /* CP-100 */"),
 ("const c=PG.coins,n=PG.catnip;ctx.fillStyle='#ffd76a';ctx.fillText(c+' coins',16,y);","const c="+CC+",n=PG.catnip;ctx.fillStyle='#ffd76a';ctx.fillText(c+' coins',16,y); /* CP-100 */"),
 ("ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,163,y+1,48);\n const cx=163+Math.min(48,ctx.measureText(String(PG.coins)).width)+15;","ctx.fillStyle='#ffd76a';ctx.fillText("+CC+",163,y+1,48);\n const cx=163+Math.min(48,ctx.measureText(String("+CC+")).width)+15; /* CP-100 */"),
 ("ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,280,cy-7,34);","ctx.fillStyle='#ffd76a';ctx.fillText("+CC+",280,cy-7,34); /* CP-100 */"),
 ("ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,40,y+1,70);\n const cx=40+Math.min(70,ctx.measureText(String(PG.coins)).width)+18;","ctx.fillStyle='#ffd76a';ctx.fillText("+CC+",40,y+1,70);\n const cx=40+Math.min(70,ctx.measureText(String("+CC+")).width)+18; /* CP-100 */")]
# the Shop's jar -> the Catnip balance (the sold prizes' leaves still fly to it)
i=s.index(" // the coin jar: fills with your coins");j=s.index(" const T2=pgShopTabs();",i)
EDITS.append((s[i:j]," // CP-100: no coin jar; the Catnip balance in its place (sold prizes fly to it)\n const jx=200,jy=pgTop()+170;Sh.jarT+=dt;ctx.save();pgCatnipLeaf(jx-46,jy-36,1.6);ctx.fillStyle='#8dff9a';ctx.font='900 34px Impact, system-ui';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(String(PG.catnip),jx-22,jy-30);ctx.font='bold 15px system-ui';ctx.fillStyle='#cfe6f4';ctx.textAlign='center';ctx.fillText('Catnip · sell prizes for it, buy ingredients with it',200,jy+8,360);ctx.restore();\n"))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp100-play.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(B/'release.html'),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',v['displayName'],hashlib.sha256(out).hexdigest())
