// CP-21: how many tapped coins vanish (removed without going over the front edge). Usage: node lost.cjs <html> [taps] [gap]
const path=require('path'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const make=require(runtime);
(async()=>{const src=path.resolve(process.argv[2]),taps=+(process.argv[3]||80),gap=+(process.argv[4]||.37);
 const g=await make({sourceFile:src,seed:7});const a=g.c.__game;a.selectBoard(+(process.env.B||0));for(let i=0;i<120;i++)g.tick();
 vm.runInContext(`globalThis.__lost=0;globalThis.__fell=0;const __rc=removeCoin;removeCoin=function(b){if(b.input&&!b.__fellOff)__lost++;return __rc(b);};const __fo=fallOff;globalThis.__through=0;fallOff=function(b,x){b.__fellOff=true;__fell++;if(b.rb.translation().z/M<T.FRONT-40)__through++;return __fo(b,x);};`,g.c);
 let next=0;for(let f=0,n=0;n<taps&&f<taps*gap*60+600;f++){if(f/60>=next){vm.runInContext(`tryDrop({x:${110+((n*37)%180)},y:DROP_Y})`,g.c);n++;next+=gap;}g.tick();}
 for(let i=0;i<240;i++)g.tick();
 console.log(path.basename(src),JSON.stringify({taps,lost:vm.runInContext('__lost',g.c),fellOff:vm.runInContext('__fell',g.c),throughTable:vm.runInContext('__through',g.c),status:a.board.status}));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
