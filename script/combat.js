function combatEncounter(battle) {
  console.log(battle);
  game.cantMove = true;
  _canvas.width = _canvas.width;
  showText();
  // outputText("<--- COMBAT ENCOUNTER --->", "separator");
  // outputText(battle.text);
  // battle.enemies.forEach(en=>{
  //   outputCharacter(en);
  // });
  //outputChoice("Retreat", 'playerChara');
  // const porContainer = document.createElement("div");
  // porContainer.classList = "por-container";
  // battle.enemies.forEach(en=>{porContainer.append(portraitFrame(en))})
  // gameFrame.append(porContainer);
  combat.battle = battle;
  gameFrame.innerHTML = `
    ${textSyntax("§<css>text-decoration: underline<css><f>1.8vw<f>Impending Battle...").outerHTML}
    ${textSyntax(battle.text).outerHTML}
    <div class="por-container">
    </div>
    ${textSyntax("§<f>1.1vw<f>You can either fight this battle, or avoid it. \n Make your choice.").outerHTML}
    <div class="button-wrapper">
      <button onclick="startBattle()">Battle</button>
      <button onclick="playerCharacter.retreat()">Retreat</button>
    </div>
  `;
  gameFrame.querySelector(".por-container").append(...battle.enemies.map(en=>portraitFrame(en)));
}

let combat = {
  enemies: [],
  battle: {},
  round: [],
  actor: {},
  buttons: document.querySelector(".actionsContainer"),
};

function startBattle() {
  combat.enemies = [];
  combat.battle.enemies.forEach(en=>{
    en.heal();
    combat.enemies.push(en);
  });
  combat.round = [];
  combat.actor = playerCharacter;
  combat.buttons.innerHTML = `
    <button onclick="combatAttack()">Attack</button>
  `;
  clearText();
  update();
};

function calculateDamage(dmg, def, res) {
  return Math.floor(((dmg * dmg / (def + dmg)) * (1 - res)) * random(1.25, 1));
}

function combatAttack() {
  combat.buttons.textContent = "";
  combat.enemies.forEach(enemy=>{
   if(enemy.isAlive()) combat.buttons.innerHTML += `<button onclick="attackFoe('${enemy.name}')">${enemy.name}</button>`
  });
  combat.buttons.innerHTML += "<button onclick='cancelAction()'>Cancel</button>"
}

function attackFoe(name) {
  let target = combat.enemies.find(en=>en.name == name);
  combat.round.push({actor: combat.actor, speed: combat.actor.stats().speed, target: target, action: _attack});
  //if(combat.actor == playerCharacter) combat.actor = playerCharacter.party[0];
  if(game.companion_ai) {
    playerCharacter.party.forEach(comp=>{
      comp.decideMove();
    });
    combat.enemies.forEach(en=>{
      en.decideMove();
    });
    calculateRound();
  }
}

function _attack(actor, target) {
  let atk = actor.stats().atk;
  let def = target.stats().def;
  let res = target.resistances().physical / 100;
  let dmg = calculateDamage(atk, def, res);
  console.log(`${actor.name} attacks ${target.name} for ${dmg} damage!`);
  if(target.enemy) combat.enemies.find(en=>en.name == target.name).baseStats.hp -= dmg;
  else if(target.player) playerCharacter.baseStats.hp -= dmg;
  else playerCharacter.party.find(char=>char.id == target.id).baseStats.hp -= dmg;
  gameFrame.append(textSyntax(`
    ${pre_frame}${actor_combat_text(actor)} attacks ${actor_combat_text(target)} dealing ${dmg}<c>${$dmg}<c> damage.
  `));
  gameFrame.scrollTo(0, gameFrame.scrollHeight);
  update();
}

const actor_combat_text = (actor) => {
  return `<i>${actor.img}[actor_combat]<i> <c>${actor.color}<c>${actor.name}<c>black<c>`
}

const pre_frame = "<bcss>font-size: 1.25vw; margin: 0.5vw; border: 0.1vw solid rgb(60, 60, 60);<bcss>";

function calculateRound() {
  gameFrame.textContent = "";
  combat.round.forEach(r=>{
    r.action(r.actor, r.target);
  });
  combat.round = [];
}