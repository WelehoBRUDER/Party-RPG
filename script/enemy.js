class Enemy extends Character {
  constructor(test) {
    super(test);
    this.unique = "TEST 2";
    this.enemy = true;
  }
}

let enemyCharacter = new Enemy({
  id: "enemy",
  name: "dicky",
})

const enemies = {
  gobbo: {
    name: "Gobbo",
    img: "gfx/portraits/goblin.png",
    baseStats: {
      atk: 5,
      def: 3,
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
    }
  }
}