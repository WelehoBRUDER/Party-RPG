function race(base) {
  this.id = base.id;
  this.name = base.name;
  const defaultRace = races[this.id];

  this.maxHp = defaultRace.maxHp || 0;
  this.atk = defaultRace.atk || 0;
  this.def = defaultRace.def || 0;
  this.speed = defaultRace.speed || 0;
}


const races = {
  human: {
    id: "human",
    name: "Human",
    maxHp: 20,
    maxEp: 5,
    atk: 2,
    def: 2,
    speed: 2
  },
  goblin: {
    id: "goblin",
    name: "Goblin",
    maxHp: 18,
    maxEp: 2,
    atk: 3,
    def: 1,
    speed: 3
  },
  wolf: {
    id: "wolf",
    name: "Wolf",
    maxHp: 10,
    maxEp: 1,
    atk: 5,
    def: 3,
    speed: 5
  }
}

function Character(base) {
  this.id = base.id;
  this.name = base.name;
  this.level = base.level || 1;
  this.race = base.race || new race(races.human);
  this.baseStats = new Stats(base.baseStats ?? {}, this);
  this.baseResistances = new Resistances(base.baseResistances ?? {});
  this.statModifiers = base.statModifiers || [];
  this.powers = base.powers || [];
  this.img = base.img || "gfx/portraits/missing.png";
  this.color = base.color ?? "rgb(255, 255, 255)";
  this.weapon = base.weapon ?? new Weapon(eq.wooden_stick);
  this.ai = new ai(base.ai ?? {});
  this.skipTurn = base.skipTurn ?? false;

  function Stats(stat, _base) {
    this.str = stat.str || 5;
    this.mag = stat.mag || 5;
    this.agi = stat.agi || 5;
    this.con = stat.con || 5;
    this.atk = (stat.atk || 0);
    this.def = (stat.def || 0);
    this.speed = (stat.speed || 50);
    this.maxHp = (stat.maxHp || 0);
    this.maxEp = (stat.maxEp || 0);
    this.hp = Math.max((stat.hp || 0), 0);
    this.ep = Math.max((stat.ep || 0), 0);
    this.acc = (stat.acc || 10);
    this.dodge = (stat.dodge || 5);
    this.critRate = (stat.critRate || 5);
    this.critDamage = (stat.critDamage || 50);
  }

  function Resistances(resist) {
    this.physical = resist.physical || 0;
    this.magical = resist.magical || 0;
    this.fire = resist.fire || 0;
    this.ice = resist.ice || 0;
    this.nature = resist.nature || 0;
    this.shock = resist.shock || 0;
    this.wind = resist.wind || 0;
  }

  function ai(ai) {
    this.attack = ai.attack || 10;
    this.defend = ai.defend || 10;
    this.healSelf = ai.healSelf || 10;
    this.healFriend = ai.healFriend || 10;
    this.buffSelf = ai.buffSelf || 10;
    this.buffFriend = ai.buffFriend || 10;
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
      if (this.race[stat[0]]) val += this.race[stat[0]] * this.level;
      if (stat[0] == "maxHp") val += statObj.con * 5;
      else if (stat[0] == "maxEp") val += statObj.mag * 2 + statObj.con;
      else if (stat[0] == "speed") val += statObj.agi;
      else if (stat[0] == "def") val += statObj.agi * 2;
      if (stat[0] == "atk") val += this.weapon.atk;
      statObj[stat[0]] = Math.round((this.baseStats[stat[0]] + val) * mod);
    });
    //statObj.maxHp += 5 * statObj.con;
    return statObj;
  };

  this.hpRemaining = () => {
    return this.baseStats.hp / this.stats().maxHp * 100;
  };

  this.epRemaining = () => {
    return this.baseStats.ep / this.stats().maxEp * 100;
  }

  this.isAlive = () => {
    return this.baseStats.hp > 0;
  }

  this.heal = () => { this.baseStats.hp = this.stats().maxHp };
  this.recover = () => { this.baseStats.ep = this.stats().maxEp };

  this.restore = (amnt) => {
    this.baseStats.hp += amnt;
    if (this.baseStats.hp > this.stats().maxHp) this.baseStats.hp = this.stats().maxHp;
  }

  this.energize = (amnt) => {
    this.baseStats.ep += amnt;
    if (this.baseStats.ep > this.stats().maxEp) this.baseStats.ep = this.stats().maxEp;
  }

  this.resistances = () => {
    let resistObj = {};
    Object.entries(this.baseResistances).forEach(resist => {
      const { v: val, m: mod } = getModifiers(this, resist[0]);
      resistObj[resist[0]] = Math.round((this.baseResistances[resist[0]] + val) * mod) / 100;
    });
    return resistObj;
  };

  this.damageBuffs = () => {
    let dmgObj = {};
    dmgObj.physical = getModifiers(this, "physicalDmg").m + this.stats().str / 100;
    dmgObj.magical = getModifiers(this, "magicalDmg").m + this.stats().mag / 100;
    dmgObj.fire = getModifiers(this, "fireDmg").m;
    dmgObj.ice = getModifiers(this, "iceDmg").m;
    dmgObj.nature = getModifiers(this, "natureDmg").m;
    dmgObj.shock = getModifiers(this, "shockDmg").m;
    dmgObj.wind = getModifiers(this, "windDmg").m;
    dmgObj.heal = getModifiers(this, "healBonus").m;
    return dmgObj;
  };

  this.damage = (dmg) => {
    // ALL DAMAGE IS LOGGED THROUGH HERE
    // SO YOU CAN FOR EXAMPLE INCREASE
    // PERK'S POWER BASED ON DMG OR TIMES HIT
    this.baseStats.hp -= dmg;
    if (this.baseStats.hp < 0) this.baseStats.hp = 0;
    // THIS WON'T UPDATE UNLESS YOU CALL IT.
  };

  this.drain = (amnt) => {
    // DRAIN THE CHARACTER'S ENERGY
    this.baseStats.ep -= amnt;
    if (this.baseStats.ep < 0) this.baseStats.ep = 0;
    // THIS WON'T UPDATE UNLESS YOU CALL IT.
  }

  this.highestThreat = () => {
    if (!this.enemy) {
      let highest = this.threatLevel();
      playerCharacter.party.forEach(char => {
        char.threatLevel() > highest ? highest = char.threatLevel() : "";
      });
      return highest;
    }
    else {
      let highest = this.threatLevel();
      combat.characters.forEach(char => {
        if (!char.enemy) return;
        char.threatLevel() > highest ? highest = char.threatLevel() : "";
      });
      return highest;
    }
  }

  this.threatLevel = () => {
    const { v: val, m: mod } = getModifiers(this, "threat");
    return Math.round((50 + val + this.level) * mod);
  };

  this.threatColor = () => {
    let max = 8;
    let min = 212;
    if (this.threatLevel() == this.highestThreat()) return max;
    else {
      return Math.round(min * (this.highestThreat() / this.threatLevel()));
    }
  };

  this.attack_foe = () => {
    let target = this.targeting();
    _attack(this, target);
  }

  this.lowerCDs = () => {
    this.powers.forEach(pwr => { pwr.onCooldown > 0 ? pwr.onCooldown-- : pwr.onCooldown = 0; });
  }

  this.canUseAbility = (type) => {
    let answer = false;
    this.powers.map(power => {
      if (power.type == type) {
        if (power.energyCost <= this.baseStats.ep && power.onCooldown == 0) answer = true;
      }
    });
    if (type == "attack") {
      answer = true;
    }
    return answer;
  }

  this.canDoAction = (act) => {
    switch (act) {
      case "attack":
        return this.canUseAbility("attack");
      case "defend":
        return this.canUseAbility("defend");
      case "healSelf":
        return this.canUseAbility("heal");
      case "healFriend":
        return this.canUseAbility("heal");
      case "buffSelf":
        return this.canUseAbility("buff");
      case "buffFriend":
        return this.canUseAbility("buff");
    }
  }

  this.filterMove = (move) => {
    if (move == "healFriend") {
      if (teamLowest(this).c !== this && teamLowest(this).l <= 60) {
        return move;
      }
      else if (teamLowest(this).c == this && this.hpRemaining() <= 60) {
        return "healSelf";
      }
    }
    else if (move == "healSelf") {
      if (this.hpRemaining() <= 60) {
        return move;
      }
    }
    else if (move == "defend") {
      // PLACEHOLDER STUFF
    }
    else if (move == "buffFriend") {
    }
    else if (move == "buffSelf") {
    }
    return "attack";
  }

  this.turn = () => {
    if (!this.isAlive()) { nextTurn(); return; }
    if (this.skipTurn == true) { this.skipTurn = false; nextTurn(); return; }
    this.lowerCDs();
    if (this.enemy || this.companion || this.summon) {
      let targetAction = this.decideMove();
      targetAction = this.filterMove(targetAction); // Check if target action should be done

      console.log(targetAction);

      if (targetAction == "healFriend") {
        let target = teamLowest(this).c;
        let abi = this.powers.find(pow =>pow.type == "heal" && pow.onCooldown == 0 && pow.energyCost <= this.baseStats.ep);
        abi.action(this, target);
      }
      else if (targetAction == "healSelf") {
        let abi = this.powers.find(pow =>pow.type == "heal" && pow.onCooldown == 0 && pow.energyCost <= this.baseStats.ep);
        abi.action(this, this);
      }
      else if (targetAction == "defend") {
        let abi = this.powers.find(pow =>pow.type == "defend" && pow.onCooldown == 0 && pow.energyCost <= this.baseStats.ep);
        abi.action(this);
      }
      else if (targetAction == "attack") {
        let target = this.targeting();
        let abi = this.powers.find(pow =>pow.type == "attack" && pow.onCooldown == 0 && pow.energyCost <= this.baseStats.ep);
        console.log(abi);
        if (abi) abi.action(this, target);
        else this.attack_foe();
      }
    }
    else {
      combat.actor = this.id;
      combat.playerAct = true;
    }
  }

  this.targeting = () => {
    if (this.enemy) {
      let targets = [];
      combat.characters.forEach(char => { if (char.isAlive() && !char.enemy) targets.push({ ...char }) });
      let target;
      let max = 0;
      for (let i = 0; i < targets.length; i++) {
        if (targets[i].baseStats.hp <= 0) continue;
        targets[i].threatChance = 0;
        if (targets[i - 1]) targets[i].threatChance = targets[i - 1].threatChance;
        else targets[i].threatChance = 0;
        targets[i].threatChance += targets[i].threatLevel();
        max = targets[i].threatChance;
      }
      let value = Math.floor(random(max));
      for (let targ of targets) { if (targ.threatChance >= value) { target = targ; break; } };
      return target;
    } else {
      let targets = [];
      combat.characters.forEach(enemy => { if (enemy.isAlive() && enemy.enemy) targets.push({ ...enemy }) });
      let target;
      let max = 0;
      for (let i = 0; i < targets.length; i++) {
        if (targets[i].baseStats.hp <= 0) continue;
        targets[i].threatChance = 0;
        if (targets[i - 1]) targets[i].threatChance = targets[i - 1].threatChance;
        else targets[i].threatChance = 0;
        targets[i].threatChance += targets[i].threatLevel();
        max = targets[i].threatChance;
      }
      let value = Math.floor(random(max));
      for (let targ of targets) { if (targ.threatChance >= value) { target = targ; break; } };
      return target;
    }
  };

  this.decideMove = () => {
    let action = [];
    Object.entries(this.ai).forEach(beh => { action.push({ act: beh[0], val: beh[1] }); });
    action.map(act => { if (!this.canDoAction(act.act)) act.val = 0; });
    removeAllFromArray(action, "val", 0);
    let max = 0;
    for (let i = 0; i < action.length; i++) {
      action[i].chance = 0;
      if (action[i - 1]) action[i].chance = action[i - 1].chance;
      else action[i].chance = 0;
      action[i].chance += action[i].val;
      max = action[i].chance;
    }
    let targetAction;
    let targetValue = Math.floor(random(max));
    action.forEach(act => { if (act.chance >= targetValue) { targetAction = act.act; return; } });
    return targetAction;
  }
}

