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
        setTimeout(e=>{moveDelay = false}, 500);
        generateMap(maps[this.map]);
      }
    };

    this.retreat = () => {
      let old = this.location;
      this.location = this.oldLocation;
      this.oldLocation = old;
      setTimeout(e=>game.cantMove = false, 500);
      generateMap(maps[playerCharacter.map]);
      hideText();
    };
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
    race: new race(races.human),
    // statModifiers: [
    //   {
    //     effects: {
    //       threatV: 25,
    //       maxHpP: 75
    //     }
    //   }
    // ],
    baseStats: {
      atk: 5,
      def: 5
    },
    powers: [
      new first_aid(),
      new summon_wolf()
    ],
    color: "rgb(214, 107, 30)",
    level: 1
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
  baseStats: {
    atk: 5,
    def: 5
  },
  powers: [
    new fireball(),
    new summon_wolf(),
    new cleave()
  ],
  location: 0,
  oldLocation: 0,
  map: "super_fun_map",
  color: "rgb(3, 190, 252)",
  level: 1
});

playerCharacter.heal();
playerCharacter.recover();
playerCharacter.party.forEach(chr=>{chr.heal()});
playerCharacter.party.forEach(chr=>{chr.recover()});