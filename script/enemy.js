class Enemy extends Character {
  constructor(base) {
    super(base);
    this.enemy = true;
    this.desc = base.desc ?? generic_desc
  }
}

const generic_desc = "This is a generic enemy description. This is a hostile character, be *very* afraid.";

let enemyCharacter = new Enemy({
  id: "enemy",
  name: "dicky",
})

const enemies = {
  gobbo: {
    id: "gobbo",
    name: "Gobbo",
    img: "gfx/portraits/goblin.png",
    race: new race(races.goblin),
    color: "rgb(72, 143, 64)",
    baseStats: {
      atk: 3,
      def: 2,
      speed: 57,
      maxHp: 0,
      hp: 0,
      acc: 5,
      dodge: 10,
      critRate: 8,
      critDamage: 60
    },
    baseResistances: {
      physical: 0,
      fire: 0,
      ice : 0,
      nature: 5,
      shock: 0,
      wind: 0
    },
    desc: "Gobbos are weak but numerous creatures that love nothing more than ruining your perfectly good day. Give em' hell!"
  },
  wolf: {
    id: "wolf",
    name: "Wolf",
    img: "gfx/portraits/wolf.png",
    race: new race(races.wolf),
    color: "rgb(176, 176, 176)",
    baseStats: {
      atk: 5,
      def: 2,
      speed: 60,
      maxHp: 0,
      hp: 0,
      acc: 5,
      dodge: 10,
      critRate: 10,
      critDamage: 55
    },
    baseResistances: {
      physical: 0,
      fire: -5,
      ice : 0,
      nature: 5,
      shock: -5,
      wind: 0
    },
    desc: "Wolves are fast and cunning predators that are very interested in eating you."
  }
}