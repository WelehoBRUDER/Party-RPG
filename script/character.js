function Character(base) {
  this.id = base.id;
  this.name = base.name;
  this.baseStats = new Stats(base.baseStats ?? {});
  this.baseResistances = new Resistances(base.baseResistances ?? {});
  this.statModifiers = base.statModifiers || [];
  this.level = base.level || 1;
  this.img = base.img || "gfx/portraits/missing.png";

  function Stats(stat) {
    this.atk = stat.atk || 10;
    this.def = stat.def || 5;
    this.speed = stat.speed || 50;
    this.maxHp = stat.maxHp || 500;
    this.hp = stat.hp || 500;
    this.acc = stat.acc || 10;
    this.dodge = stat.dodge || 5;
    this.critRate = stat.critRate || 5;
    this.critDamage = stat.critDamage || 50;
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
      const { v: val, m: mod } = getModifiers(this, stat[0]);
      statObj[stat[0]] = Math.round((this.baseStats[stat[0]] + val) * mod);
    });
    return statObj;
  };

  this.hpRemaining = () => {
    return this.baseStats.hp / this.stats().maxHp * 100;
  }

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
  }

  this.threatLevel = () => {
    const {v: val, m: mod} = getModifiers(this, "threat");
    return Math.round((50 + val) * mod);
  };

  this.threatColor = () => {
    let max = 8;
    let min = 212;
    if(this.threatLevel() == this.highestThreat()) return max;
    else {
      return Math.round(min * (this.highestThreat() / this.threatLevel()));
    }
  }
}

