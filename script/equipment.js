function Equipment(base) {
  this.id = base.id;
  const defaultEq = eq[base.id];
  if(!defaultEq) console.error("NEXT TIME GIVE ME THE CORRECT ID!");
  this.name = base.name ?? defaultEq.name;
  this.desc = base.desc ?? defaultEq.desc;
  this.type = defaultEq.type;
  this.weight = defaultEq.weight;

};

class Weapon extends Equipment {
  constructor(base) {
    super(base);
    const defaultEq = eq[base.id];
    this.atk = defaultEq.atk;
    this.level = base.level;
  }
}

const eq = {
  wooden_stick: {
    id: "wooden_stick",
    name: "Wooden Stick",
    type: "weapon",
    atk: 10,
    level: 1
  }
}