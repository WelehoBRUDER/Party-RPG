function combatEncounter(battle) {
  console.log(battle);
  game.cantMove = true;
  _canvas.width = _canvas.width;
  outputText("<--- COMBAT ENCOUNTER --->", "separator");
  outputText(battle.text());
  battle.enemies.forEach(en=>{
    outputCharacter(en);
  });
  outputChoice("Retreat", 'e=>retreat()');
  
}