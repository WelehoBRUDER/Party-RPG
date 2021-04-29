class Summon extends Character {
  constructor(base) {
    super(base);
    this.summon = true;
    this.enemy = base.enemy;
  }
}

const summons = {
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
    weapon: new Weapon(eq.claws),
    desc: "Gobbos are weak but numerous creatures that love nothing more than ruining your perfectly good day. Give em' hell!"
  }
}