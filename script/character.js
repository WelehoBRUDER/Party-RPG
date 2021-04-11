function battleClass(base) {
  this.id = base.id;
  this.name = base.name;
  const defaultClass = classes[this.id];

  this.maxHp = defaultClass.maxHp;
  this.atk = defaultClass.atk;
  this.def = defaultClass.def;
}


const classes = {
  commoner: {
    id: "commoner",
    name: "Commoner",
    maxHp: 40,
    atk: 5,
    def: 5
  },
  fighter: {
    id: "fighter",
    name: "Fighter",
    maxHp: 124,
    atk: 12,
    def: 8
  },
  goblin: {
    id: "goblin",
    name: "Goblin",
    maxHp: 28,
    atk: 3,
    def: 2
  }
}

function Character(base) {
  this.id = base.id;
  this.name = base.name;
  this.level = base.level || 1;
  this.class = base.class || new battleClass(classes.commoner);
  this.baseStats = new Stats(base.baseStats ?? {}, this);
  this.baseResistances = new Resistances(base.baseResistances ?? {});
  this.statModifiers = base.statModifiers || [];
  this.img = base.img || "gfx/portraits/missing.png";
  this.color = base.color ?? "rgb(255, 255, 255)";
  this.weapon = base.weapon ?? new Weapon(eq.wooden_stick);

  function Stats(stat, _base) {
    this.atk = (stat.atk || 40);
    this.def = (stat.def || 10);
    this.speed = (stat.speed || 50);
    this.maxHp = (stat.maxHp || 500);
    this.hp = Math.max((stat.hp || 500), 0);
    this.acc = (stat.acc || 10);
    this.dodge = (stat.dodge || 5);
    this.critRate = (stat.critRate || 5);
    this.critDamage = (stat.critDamage || 50);
  }

  function Resistances(resist) {
    this.physical = resist.physical || 0;
    this.fire = resist.fire || 0;
    this.ice = resist.ice || 0;
    this.nature = resist.nature || 0;
    this.shock = resist.shock || 0;
    this.wind = resist.wind || 0;
  }

  function getModifiers(char, stat) {
    let val = 0;
    let modif = 1;
    char.statModifiers.forEach(mod => {
      Object.entries(mod.effects).forEach(eff => {
        if (eff[0].startsWith(stat)) {
          if (eff[0] == stat + "P") modif += eff[1] / 100;
          else if (eff[0] == stat + "V") val += eff[1];
        }
      })
    });
    return { v: val, m: modif };
  }

  this.stats = () => {
    let statObj = {};
    Object.entries(this.baseStats).forEach(stat => {
      let { v: val, m: mod } = getModifiers(this, stat[0]);
      if(this.class[stat[0]]) val += this.class[stat[0]] * this.level;
      statObj[stat[0]] = Math.round((this.baseStats[stat[0]] + val) * mod);
    });
    return statObj;
  };

  this.hpRemaining = () => {
    return this.baseStats.hp / this.stats().maxHp * 100;
  };

  this.isAlive = () => {
    return this.baseStats.hp > 0;
  }

  this.heal = () => {this.baseStats.hp = this.stats().maxHp};

  this.resistances = () => {
    let resistObj = {};
    Object.entries(this.baseResistances).forEach(resist => {
      const { v: val, m: mod } = getModifiers(this, resist[0]);
      resistObj[resist[0]] = Math.round((this.baseResistances[resist[0]] + val) * mod);
    });
    return resistObj;
  };

  this.damageBuffs = () => {
    let dmgObj = {};
    dmgObj.physical = getModifiers(this, "physicalDmg").m;
    dmgObj.fire = getModifiers(this, "fireDmg").m;
    dmgObj.ice = getModifiers(this, "iceDmg").m;
    dmgObj.nature = getModifiers(this, "natureDmg").m;
    dmgObj.shock = getModifiers(this, "shockDmg").m;
    dmgObj.wind = getModifiers(this, "windDmg").m;
    dmgObj.heal = getModifiers(this, "healBonus").m;
    return dmgObj;
  };

  this.highestThreat = () => {
    if(!this.enemy) {
      let highest = this.threatLevel();
      playerCharacter.party.forEach(char=>{
        char.threatLevel() > highest ? highest = char.threatLevel() : "";
      });
      return highest;
    }
    else {
      let highest = this.threatLevel();
      combat.enemies.forEach(char=>{
        char.threatLevel() > highest ? highest = char.threatLevel() : "";
      });
      return highest;
    }
  }

  this.threatLevel = () => {
    const {v: val, m: mod} = getModifiers(this, "threat");
    return Math.round((50 + val + this.level) * mod);
  };

  this.threatColor = () => {
    let max = 8;
    let min = 212;
    if(this.threatLevel() == this.highestThreat()) return max;
    else {
      return Math.round(min * (this.highestThreat() / this.threatLevel()));
    }
  };

  this.targeting = () => {
    if(this.enemy) {
      let targets = [];
      if(playerCharacter.isAlive()) targets.push({...playerCharacter});
      playerCharacter.party.forEach(comp=>{if(comp.isAlive()) targets.push({...comp})});
      let target;
      let max = 0;
      for(let i = 0; i<targets.length; i++) {
        if(targets[i].baseStats.hp <= 0) continue;
        targets[i].threatChance = 0;
        if(targets[i-1]) targets[i].threatChance = targets[i-1].threatChance;
        else targets[i].threatChance = 0;
        targets[i].threatChance += targets[i].threatLevel();
        max = targets[i].threatChance;
      }
      let value = Math.floor(random(max));
     for(let targ of targets) {if(targ.threatChance >= value) { target = targ; break;}};
      return target;
    } else {
      let targets = [];
      combat.enemies.forEach(enemy=>{if(enemy.isAlive()) targets.push({...enemy})});
      let target;
      let max = 0;
      for(let i = 0; i<targets.length; i++) {
        if(targets[i].baseStats.hp <= 0) continue;
        targets[i].threatChance = 0;
        if(targets[i-1]) targets[i].threatChance = targets[i-1].threatChance;
        else targets[i].threatChance = 0;
        targets[i].threatChance += targets[i].threatLevel();
        max = targets[i].threatChance;
      }
      let value = Math.floor(random(max));
      for(let targ of targets) {if(targ.threatChance >= value) { target = targ; break;}};
      return target;
    }
  };

  this.decideMove = () => {
    // THIS IS THE CHARACTER AI //
    // WIP //
    combat.round.push({actor: this, speed: this.stats().speed, target: this.targeting(), action: _attack}); // just randomly attacks an enemy
  }
}

