// OPS-04 UAT 121 own checks (static, quick). Usage: node checks121.cjs   (DEV=1: release-dev.html, boot121dev)
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const DEV=process.env.DEV==='1',V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8')),N=V.displayName.split(' ').pop();
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),G=path.join(__dirname,'boot'+N+(DEV?'dev':'')),W=path.resolve(__dirname,'..');
const out=path.resolve(__dirname,'../../tickets/OPS-04-evidence/uat'+N+(DEV?'-dev':''));fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');let passed=[],failed=[],notes={};
function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const S=fs.readFileSync(src,'utf8'),Bh=fs.readFileSync(path.join(W,V.base,'release.html'),'utf8'),K=fs.readFileSync(path.join(W,'cp117/cp90-kittens.js'),'utf8')+'\n';
{let B=Bh,ok=sha(Bh)===V.baseSHA256&&B.split(K).length===2;B=B.split(K).join('');const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
 for(const [a,b] of E.edits){if(B.split(a).length!==2)ok=false;B=B.split(a).join(b);}if(DEV)B=B.replace("const BUILD = '"+V.displayName+"';","const BUILD = '"+V.displayName+"-dev';");
 check('1 the build is the published base minus the CP-90 block + build name + FLAC path, nothing else',ok&&S===B);}
check('2 no CP-90 code or "Zoomies kittens" choice left',!/cp90|CP90|Zoomies kittens/.test(S));
check('3 the drums load paw-dance.flac; no paw-dance.wav reference',S.split("new Audio('sounds/effects/paw-dance.flac')").length===2&&!S.includes('paw-dance.wav'));
if(V.base==='cp117'){const s116=fs.readFileSync(path.join(W,'cp116/release.html'),'utf8');
 check('4 on UAT 117: with the build name and the FLAC path set back, the build is UAT 116 byte for byte (Zoomies as in 116)',
  S.replace(/const BUILD = '[^']+';/,"const BUILD = '2026.11.19 UAT 116';").replace("paw-dance.flac'","paw-dance.wav'")===s116);}
const list=d=>{const o=[];(function w(x){for(const f of fs.readdirSync(x)){const q=path.join(x,f);fs.statSync(q).isDirectory()?w(q):o.push(path.relative(d,q).split(path.sep).join('/'));}})(d);return o.sort();};
const g=list(G),gone=['img/art/uat18-soft-paw.png','img/art/head-waiting.webp','img/art/cp90-ginger-run.webp','img/art/cp90-cream-run.webp','img/art/cp90-ginger-peek.webp','sounds/effects/paw-dance.wav'];
check('5 runtime folder: removed files absent, paw-dance.flac, index.html = release.html, rapier present',gone.every(f=>!g.includes(f))&&g.includes('sounds/effects/paw-dance.flac')&&g.includes('lib/rapier.js')&&sha(fs.readFileSync(path.join(G,'index.html')))===sha(Buffer.from(S)),{files:g.length});
{const pub=path.join(W,V.base,'boot'+V.base.replace('cp',''));if(fs.existsSync(pub)){const P=list(pub),diff=[];
 for(const f of g){if(f==='index.html'||f==='sounds/effects/paw-dance.flac')continue;if(!P.includes(f)){diff.push('new '+f);continue;}
  if(sha(fs.readFileSync(path.join(G,f)))!==sha(fs.readFileSync(path.join(pub,f))))diff.push(f);}
 notes.changedVsBase=diff;check('6 every other file is the base\'s byte for byte, except the losslessly re-saved PNGs (all .png over 100 KB)',diff.every(f=>f.endsWith('.png')&&fs.statSync(path.join(pub,f)).size>100000),diff);}}
const refs=[...S.matchAll(/['"`]((?:img|sounds|lib)\/[\w./-]+\.(?:png|webp|wav|mp3|flac|js))['"`]/g)].map(m=>m[1]),miss=[...new Set(refs)].filter(f=>!g.includes(f));
{const pub=path.join(W,V.base,'boot'+V.base.replace('cp','')),Pl=fs.existsSync(pub)?list(pub):[],R0=[...Bh.matchAll(/['"`]((?:img|sounds|lib)\/[\w./-]+\.(?:png|webp|wav|mp3|flac|js))['"`]/g)].map(m=>m[1]),miss0=[...new Set(R0)].filter(f=>!Pl.includes(f));
 notes.literalAssetRefs=refs.length;notes.missingInBaseToo=miss0;check('7 every literal asset path in the build exists in the runtime folder, apart from ones already missing in the base (never loaded)',Pl.length>0&&miss.every(f=>miss0.includes(f)),{miss,miss0});}
fs.writeFileSync(path.join(out,'checks121.json'),JSON.stringify({build:src,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
