function update() {
  // THIS FUNCTION IS CALLED AFTER EVERY ACTION

  // Create player & party portraits
  const partyContainer = document.querySelector(".partyContainer")
  partyContainer.textContent = "";
  partyContainer.append(characterPortrait(playerCharacter));
  playerCharacter.party.forEach(comp=>{partyContainer.append(characterPortrait(comp))});

  function characterPortrait(char) {
    const portrait = document.createElement("div");
    portrait.classList = "characterPortrait";
    portrait.innerHTML = `
      <p class="name">${char.name}</p>
      <img class="threat" src="../gfx/icons/danger.png" style="background: rgb(212, ${char.threatColor()}, 8)"></p>
      <div class="healthPie" style="--value: ${100 - char.hpRemaining()}%">
        <img class="image" src="${char.img}"></img>
        <span class="hpNumber">${char.baseStats.hp}</span>
      </div>
    `;
    return portrait;
  } 
}

function Game(main) {
  this.id = "game";
  this.flags = main.flags ?? {};
  this.enemy_respawn_timers = new _enemy_respawn_timers(main.enemy_respawn_timers);
  this.cantMove = main.cantMove || false;

  function _enemy_respawn_timers(timers) {
    Object.entries(timers).forEach(timer=>{
      if(timer[1] > battles[timer[0]].respawn_timer) timer[1] = battles[timer[0]].respawn_timer;
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

function outputCharacter(char) {
  let container;
  if(!gameFrame.querySelector(".por-container")) {
    container = document.createElement("div");
    container.classList = "por-container";
    gameFrame.append(container);
  }
  else container = gameFrame.querySelector(".por-container");
  const porFrame = document.createElement("div");
  porFrame.classList = "portraitFrame";
  hoverable(porFrame, "This is a test iwejfoj oj ifdj iqo hjiq hfiou huiqfh qufg q gfu  ad wdwq qwd qw dw qwdfwqf wf sf qwfqwf qwf32 efsa f weqfsa fq wfq fwe fe fef qwf wq fwq");
  porFrame.innerHTML += `
    <p class="porTitle">${char.name}</p>
    <img src="${char.img}" class="porImg">
    <p class="porLvl">Level ${char.level}</p>
  `;
  container.append(porFrame);
}

function outputText(txt, textClass="regular_text") {
  gameFrame.innerHTML += `
    <p class="${textClass}">
    ${txt}
    </p>
  `;
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
  textBox.textContent = hover;
  const _width = window.innerWidth;
  const _height = window.innerHeight;
  const elem = start.getBoundingClientRect();
  const left = elem.x / _width * 100;
  const top =  elem.y / _height * 53;
  console.log(start.getBoundingClientRect());
  console.log(`left: ${left}% top: ${top}%`);
  textBox.style.left = `${left - (elem.width / _width * 100) / 2}%`;
  textBox.style.top = `${top - (elem.height / _height * 53) / 2}%`;
  // textBox.style.left = `${(start.getBoundingClientRect().x - start.getBoundingClientRect().width / 2) + textBox.getBoundingClientRect().width / 2 + (start.getBoundingClientRect().width - textBox.getBoundingClientRect().width) / 2}px`;
  // textBox.style.top = `${start.getBoundingClientRect().y - start.getBoundingClientRect().height - 10}px`;
}

function clearHover() {
  textBox.textContent = "";
  textBox.classList.add("hidden");
}

update();