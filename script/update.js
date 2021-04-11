function update() {
  // THIS FUNCTION IS CALLED AFTER EVERY ACTION

  // Create player & party portraits
  removeDeadCharacters();
  const partyContainer = document.querySelector(".partyBar .partyContainer");
  const foeContainer = document.querySelector(".infoBar .partyContainer");
  partyContainer.textContent = "";
  foeContainer.textContent = "";
  partyContainer.append(characterPortrait(playerCharacter));
  playerCharacter.party.forEach(comp => { partyContainer.append(characterPortrait(comp)) });
  combat.enemies.forEach(en=>{foeContainer.append(characterPortrait(en))});

  function characterPortrait(char) {
    const portrait = document.createElement("div");
    portrait.classList = "characterPortrait";
    portrait.innerHTML = `
      <p class="name">${char.name}</p>
      <img class="threat" src="gfx/icons/danger.png" style="background: rgb(212, ${char.threatColor()}, 8)"></p>
      <div class="healthPie" style="--value: ${100 - char.hpRemaining()}%">
        <img class="image" src="${char.img}"></img>
        <span class="hpNumber">${char.baseStats.hp}</span>
      </div>
    `;
    hoverable(portrait.querySelector(".threat"), `${char.threatLevel()} Threat`);
    return portrait;
  }
}

function Game(main) {
  this.id = "game";
  this.flags = main.flags ?? {};
  this.enemy_respawn_timers = new _enemy_respawn_timers(main.enemy_respawn_timers);
  this.cantMove = main.cantMove || false;
  this.companion_ai = main.companion_ai || true;

  function _enemy_respawn_timers(timers) {
    Object.entries(timers).forEach(timer => {
      if (timer[1] > battles[timer[0]].respawn_timer) timer[1] = battles[timer[0]].respawn_timer;
    });
  }
}

let game = new Game({
  flags: {},
  enemy_respawn_timers: {},
  cantMove: false
});

const gameFrame = document.querySelector(".gameFrame");
const textBox = document.querySelector(".textBox");

const random = (max, min=0) => (Math.random() * (max - min) + min);

function portraitFrame(char) {
  const porFrame = document.createElement("div");
  porFrame.classList = "portraitFrame";
  porFrame.innerHTML = `
    <p class="porTitle">${char.name}</p>
    <img src="${char.img}" class="porImg">
    <p class="porLvl">Level ${char.level}</p>
  `;
  hoverable(porFrame, char.desc ?? "No desc :)");
  return porFrame;
}

function clearText() {
  gameFrame.textContent = '';
}

function hoverable(element, hover) {
  element.addEventListener("mouseenter", e=>createHover(element, hover));
  element.addEventListener("mouseleave", e=>clearHover());
}

function createHover(start, hover) {
  try {
    textBox.classList.remove("hidden");
  } catch {};
  const frameTop = document.querySelector("div.frame").getBoundingClientRect().top;
  textBox.textContent = "";
  textBox.append(textSyntax(hover));
  const _width = window.innerWidth;
  const _height = window.innerHeight;
  const elem = start.getBoundingClientRect();
  const left = elem.x / _width * 100; //                                  offset pixelejä
  const top = elem.y - frameTop - textBox.getBoundingClientRect().height - 10;
  // console.log(start.getBoundingClientRect());
  // console.log(`left: ${left}% top: ${top}%`);



  console.log(start.getBoundingClientRect().top)
  textBox.style.left = `${Math.min(left - (elem.width / _width * 100) / 2, 95)}%`;
  textBox.style.top = `${Math.max(top, 5)}px`;
  // textBox.style.left = `${(start.getBoundingClientRect().x - start.getBoundingClientRect().width / 2) + textBox.getBoundingClientRect().width / 2 + (start.getBoundingClientRect().width - textBox.getBoundingClientRect().width) / 2}px`;
  // textBox.style.top = `${start.getBoundingClientRect().y - start.getBoundingClientRect().height - 10}px`;
}

function showText() {
  try {
    gameFrame.classList.remove("hidden");
  } catch {};
}

// function outputChoice(text, action) {
//   gameFrame.innerHTML += `
//     <p class="choice" onclick="${action}">
//     ${text}
//     </p>
//   `;
// }

function clearHover() {
  textBox.textContent = "";
  textBox.classList.add("hidden");
}

function hideText() {
  gameFrame.textContent = "";
  gameFrame.classList.add("hidden");
}

function retreat() {
  let old = playerCharacter.location;
  playerCharacter.location = playerCharacter.oldLocation;
  playerCharacter.oldLocation = old;
  game.cantMove = false;
  generateMap(maps[playerCharacter.map]);
  clearText();
}

function removeDeadCharacters() {}

hideText();

update();