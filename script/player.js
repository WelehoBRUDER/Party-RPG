let moveDelay = false;
class Player extends Character {
  constructor(test) {
    super(test);
    this.unique = "TEST";
    this.player = true;
    this.img = test.img ?? "gfx/icons/player_filler.png";
    this.party = test.party ?? [];
    this.location = test.location;
    this.oldLocation = test.oldLocation;
    this.map = test.map;
    this.move = (dir) => {
      if(moveDelay || game.cantMove) return;
      const currentTile = maps[this.map].tiles[this.location];
      if (currentTile.connect[dir] != undefined) {
        this.oldLocation = this.location;
        this.location = currentTile.connect[dir];
        moveDelay = true;
        setTimeout(e=>{moveDelay = false}, 450);
        generateMap(maps[this.map]);
      }
    }
  }
};

class Companion extends Character {
  constructor(test) {
    super(test);
    this.unique = "TEST";
    this.companion = true;
    this.img = test.img ?? "gfx/portraits/missing.png";
  }
}

let companions = {
  doldre: {
    id: "doldre",
    name: "Ser Doldrey",
    statModifiers: [
      {
        effects: {
          threatV: 25,
          maxHpP: 75
        }
      }
    ]
  }
}

let playerCharacter = new Player({
  id: "player",
  name: "Sir Dyck",
  baseResistances: {
    physical: -25
  },
  party: [
    new Companion(companions.doldre)
  ],
  location: 0,
  oldLocation: 0,
  map: "super_fun_map"
});