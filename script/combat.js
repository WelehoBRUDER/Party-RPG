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
  characters: [],
  battle: {},
  round: [],
  actor: "",
  index: 0,
  playerAct: false,
  buttons: document.querySelector(".actionsContainer"),
};

function sortSpeed(a, b) {
  // Use toUpperCase() to ignore character casing
  const aVal = a.stats().speed;
  const bVal = b.stats().speed;

  let comparison = 0;
  if (aVal < bVal) {
    comparison = 1;
  } else if (aVal > bVal) {
    comparison = -1;
  }
  return comparison;
}

function startBattle() {
  combat.characters = [];
  combat.battle.enemies.forEach(en=>{
    en.heal();
    en.recover();
    combat.characters.push({...en});
  });
  combat.characters.push({...playerCharacter});
  playerCharacter.party.forEach(chr=>combat.characters.push(chr));
  combat.round = [];
  //combat.actor = playerCharacter;
  mainButtons();
  combat.characters.sort(sortSpeed);
  clearText();
  update();
  combat.playerAct = false;
  combat.index = 0;
  combat.characters[combat.index].turn();
};

function mainButtons() {
  combat.buttons.innerHTML = `
    <button onclick="combatAttack()">Attack</button>
    <button onclick="showPowers()">Powers</button>
    <button onclick="showSpells()">Spells</button>
  `;
};

function calculateDamage(dmg, def, res) {
  return Math.floor(((dmg * dmg / (def + dmg)) * (1 - res)) * random(1.25, 1));
}

function combatAttack() {
  if(!combat.playerAct) return;
  combat.buttons.textContent = "";
  combat.characters.forEach(enemy=>{
   if(enemy.isAlive() && enemy.enemy) combat.buttons.innerHTML += `<button onclick="attackFoe('${enemy.name}', '${combat.actor}')">${enemy.name}</button>`
  });
  combat.buttons.innerHTML += "<button onclick='mainButtons()'>Cancel</button>"
}

function showPowers() {
  if(!combat.playerAct) return;
  combat.buttons.textContent = "";
  let actor = combat.characters[combat.index]
  actor.powers.forEach(pwr=>{
   if(!pwr.spell) {
     const _button = document.createElement("button");
     _button.textContent = pwr.name;
     hoverable(_button, pwr.desc(actor));
     combat.buttons.append(_button);
     if(pwr.onCooldown > 0 || pwr.energyCost > actor.baseStats.ep) _button.classList = "greyedOut";
     else  _button.addEventListener("click", e=>showTargets(pwr.id));
   } 
  });
  const button = document.createElement("button");
  button.addEventListener("click", mainButtons);
  button.textContent = "Cancel";
  combat.buttons.append(button);
};

function showSpells() {
  if(!combat.playerAct) return;
  combat.buttons.textContent = "";
  let actor = combat.characters[combat.index]
  actor.powers.forEach(pwr=>{
   if(pwr.spell) {
     const _button = document.createElement("button");
     _button.textContent = pwr.name;
     hoverable(_button, pwr.desc(actor));
     combat.buttons.append(_button);
     if(pwr.onCooldown > 0 || pwr.energyCost > actor.baseStats.ep) _button.classList = "greyedOut";
     else _button.addEventListener("click", e=>showTargets(pwr.id));
   } 
  });
  const button = document.createElement("button");
  button.addEventListener("click", mainButtons);
  button.textContent = "Cancel";
  combat.buttons.append(button);
};

function attackFoe(enemy_name, actor_id) {
  let target = combat.characters.find(en=>en.name == enemy_name);
  let actor = combat.characters.find(ac=>ac.id == actor_id);
  _attack(actor, target);
}

function _attack(actor, target) {
  let atk = actor.stats().atk;
  let def = target.stats().def;
  let res = target.resistances().physical / 100;
  let dmg = calculateDamage(atk, def, res);
  console.log(`${actor.name} attacks ${target.name} for ${dmg} damage!`);
  if(target.enemy) combat.characters.find(en=>en.name == target.name).damage(dmg);
  else if(target.player) playerCharacter.damage(dmg);
  else playerCharacter.party.find(char=>char.id == target.id).damage(dmg);
  gameFrame.append(textSyntax(`
    ${pre_frame}${actor_combat_text(actor)} ${actor.weapon.action} ${actor_combat_text(target)} with <c>${$itm}<c>${actor.weapon.name}<c>black<c> dealing ${dmg}<c>${$dmg}<c> damage.
  `));
  gameFrame.scrollTo(0, gameFrame.scrollHeight);
  nextTurn();
  update();
}

function nextTurn() {
  mainButtons();
  clearHover();
  combat.characters.sort(sortSpeed);
  combat.index++;
  if(combat.index > combat.characters.length-1) {
    combat.index = 0;
    clickNext();
    return;
  };
  if(!combat.characters[combat.index]?.isAlive) nextTurn();
  combat.characters[combat.index].turn();
}

function clickNext() {
  combat.buttons.innerHTML = `
  <button onclick="newTurn()">Next</button>
`;
}

function showTargets(id) {
  combat.buttons.textContent = "";
  clearHover();
  const actor = combat.characters[combat.index];
  const power = actor.powers.find(pwr=>pwr.id == id);
  console.log(power);
  if(power.targets == "enemy") {
    combat.characters.forEach(char=>{
      if(char.enemy && char.isAlive()) {
        const enemyButton = document.createElement("button");
        enemyButton.textContent = char.name;
        enemyButton.addEventListener("click", e=>power.action(actor, char));
        combat.buttons.append(enemyButton);
      }
    });
  }
  else if(power.targets == "allies") {
    combat.characters.forEach(char=>{
      if((!char.enemy || char.player) && (char.isAlive() || power.resurrect)) {
        const enemyButton = document.createElement("button");
        enemyButton.textContent = char.name;
        enemyButton.addEventListener("click", e=>power.action(actor, char));
        combat.buttons.append(enemyButton);
      }
    });
  }
  const button = document.createElement("button");
  button.addEventListener("click", mainButtons);
  button.textContent = "Cancel";
  combat.buttons.append(button);
}

function newTurn() {
  clearText();
  mainButtons();
  combat.characters.sort(sortSpeed);
  combat.index = 0;
  combat.characters[combat.index].turn();
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
};