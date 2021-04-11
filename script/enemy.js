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
    class: new battleClass(classes.goblin),
    color: "rgb(72, 143, 64)",
    baseStats: {
      atk: 48,
      def: 8,
      speed: 60,
      maxHp: 150,
      hp: 150,
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
  }
}