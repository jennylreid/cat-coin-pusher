const fs=require('fs'),make=require('./runtime.cjs'),vm=require('vm');
(async()=>{
 const result={};
 // APK16's exact production baseline has no persisted board state.
 const old=fs.readFileSync('work/cp21/promotion/release.html','utf8');result.oldProductionBoardSaveDisabled=/function save\(\)\s*\{[^}]*never writes the production save[^}]*\}/.test(old);result.oldProductionLoadResets=/function load\(\)\s*\{\s*resetBoard\(\);\s*\}/.test(old);
 const storage={'catpusher.audio.v1':JSON.stringify({muted:true}),'catpusher.uat.loop.v1':JSON.stringify({schema:1,coins:999,boardIndex:2})};
 const g=await make({sourceFile:'work/cp25/promotion/release.html',storage});const a=g.c.__game;
 result.firstOpen=vm.runInContext('({muted:S.muted,coins:S.coins,boardIndex,loopKey:LOOP_KEY})',g.c);
 if(result.firstOpen.coins!==220||result.firstOpen.boardIndex!==0||!result.firstOpen.muted||result.firstOpen.loopKey!=='catpusher.loop.v1')throw Error('first migration');
 a.selectBoard(1);a.tryDrop({x:200});vm.runInContext('save()',g.c);const saved=JSON.parse(storage['catpusher.loop.v1']);g.close();
 const h=await make({sourceFile:'work/cp25/promotion/release.html',storage});
 result.reopen=vm.runInContext('({muted:S.muted,coins:S.coins,boardIndex,remaining:board.remaining})',h.c);if(result.reopen.boardIndex!==1||result.reopen.coins!==saved.coins||result.reopen.remaining!==saved.coins)throw Error('new save restore');
 vm.runInContext("diagFlush('test')",h.c);result.normalPlayerDiagnosticWrites=Object.keys(storage).filter(k=>k.includes('diagnostics'));if(result.normalPlayerDiagnosticWrites.length)throw Error('normal diagnostics');
 // Exercise the active Settings DOM with absent hidden controls.
 const buttons={};let markup='';const panel={style:{},querySelector:selector=>buttons[selector]||null};
 Object.defineProperty(panel,'innerHTML',{set(html){markup=html;for(const k of Object.keys(buttons))delete buttons[k];for(const m of html.matchAll(/id="([^"]+)"/g))buttons['#'+m[1]]={style:{}};}});
 h.c.__panel=panel;vm.runInContext('panel.querySelector=__panel.querySelector;Object.defineProperty(panel,"innerHTML",Object.getOwnPropertyDescriptor(__panel,"innerHTML"));openCredits()',h.c);
 result.normalSettings=Object.keys(buttons);if(result.normalSettings.some(x=>/diag|preview|happy|safe-guides|pickup-/.test(x)))throw Error('testing UI visible');
 vm.runInContext('S.dev=true;openCredits()',h.c);result.developerSettings=Object.keys(buttons);if(!buttons['#pickup-preview']||!buttons['#happy-test'])throw Error('developer tools absent');
 h.close();
 fs.writeFileSync('tickets/CP-25-evidence/promotion/save-checks.json',JSON.stringify(result,null,2));console.log(result);
})().catch(e=>{console.error(e);process.exitCode=1;});
