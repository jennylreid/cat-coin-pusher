(async()=>{for(const cat of ['tuxedo','orange','ragdoll','siamese','tortie']){const g=await game(base,'level:'+cat);
 console.log(cat,g.run("JSON.stringify({mode:WILD.mode,laser:!!WILD.laser,dance:wildFeature('dance'),pounce:wildFeature('pounce'),towers:wildFeature('towerwall'),side:PGP[PGU.boardCat]&&PGP[PGU.boardCat].id,happy:WILD.happy,noteAt:WILD.noteAt})"));g.close();}})();
