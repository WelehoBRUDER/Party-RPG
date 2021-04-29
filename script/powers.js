class fireball {
  constructor(base = {}) {
    this.id = "fireball";
    this.name = "Fireball" ?? base.name;
    this.energyCost = base.energyCost ?? 10;
    this.baseDamage = 3;
    this.baseBurn = 5;
    this.cooldown = 0;
    this.desc = (user) => {
      if (user.baseStats.ep < this.energyCost) return `<c>red<c>Not enough energy to use this power!`;
      if (this.onCooldown > 0) return `<c>red<c>This power is on cooldown for ${this.onCooldown} turns!`;
      return `Hurl a bolt of fire at an enemy. \n Deals (${this.baseDamage} + ATK) x Magical Bonus dmg. 
      Also burns for (10% of ATK x Fire Bonus) + ${this.baseBurn} fire dmg.\n Energy Cost: ${this.energyCost} EP`;
    };
    this.type = "attack";
    this.spell = true;
    this.targets = "enemy";
    this.action = (user, target) => {
      let atk = (user.stats().atk + this.baseDamage) * user.damageBuffs().magical;
      let def = target.stats().def;
      let res = target.resistances().magical;
      let dmg = calculateDamage(atk, def, res);
      let burnDmg = (atk * 0.1 * user.damageBuffs().fire) + this.baseBurn;
      burnDmg = Math.floor(burnDmg * (1 - target.resistances().fire));
      user.drain(this.energyCost);
      combat.characters[target.battleIndex].damage(dmg + burnDmg);
      gameFrame.append(textSyntax(`
        ${pre_frame}${actor_combat_text(user)} shoots a fireball at ${actor_combat_text(target)} dealing ${dmg}<c>${$dmg}<c> magical damage. <c>black<c> ${actor_combat_text(target)} also burns for ${burnDmg} <c>${$dmg}<c>fire damage.
      `));
      gameFrame.scrollTo(0, gameFrame.scrollHeight);
      nextTurn();
      update();
    }
  }
};

class cleave {
  constructor(base = {}) {
    this.id = "cleave";
    this.name = "Cleave" ?? base.name;
    this.energyCost = base.energyCost ?? 3;
    this.basePower = 80;
    this.cooldown = 2;
    this.desc = (user) => {
      if (user.baseStats.ep < this.energyCost) return `<c>red<c>Not enough energy to use this power!`;
      if (this.onCooldown > 0) return `<c>red<c>This power is on cooldown for ${this.onCooldown} turns!`;
      return `Cleave through all enemies, dealing ${this.basePower}% of ATK as physical damage to all opponents hit. \n Energy Cost: ${this.energyCost} EP \nCooldown: ${this.cooldown} turns`;
    };
    this.type = "attack";
    this.spell = false;
    this.targets = "self";
    this.action = (user) => {
      let text = `${pre_frame}${actor_combat_text(user)} cleaves through all enemies with a monstrous swing!`;
      combat.characters.forEach(char=>{
        if((char.enemy && !user.enemy) || (!char.enemy && user.enemy)) {
          let atk = (user.stats().atk * this.basePower / 100) * char.damageBuffs().physical;
          let def = char.stats().def;
          let res = char.resistances().physical;
          let dmg = calculateDamage(atk, def, res);
          combat.characters[char.battleIndex].damage(dmg);
          text += `\n${actor_combat_text(char)} takes ${dmg} <c>${$dmg}<c> damage <c>black<c> from the cleave.`;
        }
      });
      user.drain(this.energyCost);
      this.onCooldown = this.cooldown + 1;
      gameFrame.append(textSyntax(text));
      gameFrame.scrollTo(0, gameFrame.scrollHeight);
      nextTurn();
      update();
    }
  }
}

class first_aid {
  constructor(base = {}) {
    this.id = "first_aid";
    this.name = "First Aid" ?? base.name;
    this.energyCost = base.energyCost ?? 0;
    this.baseHeal = 10;
    this.cooldown = 3;
    this.desc = (user) => {
      if (user.baseStats.ep < this.energyCost) return `<c>red<c>Not enough energy to use this power!`;
      if (this.onCooldown > 0) return `<c>red<c>This power is on cooldown for ${this.onCooldown} turns!`;
      return `Perform first aid on self or friend. \n Recovers (${this.baseHeal} + ATK * 0.2) x Healing Bonus HP. \nCooldown: ${this.cooldown} turns`;
    };
    this.type = "heal";
    this.spell = false;
    this.targets = "allies";
    this.action = (user, target) => {
      let heal = Math.floor((user.stats().atk * 0.2 + this.baseHeal) * user.damageBuffs().heal);
      this.onCooldown = this.cooldown + 1;
      combat.characters[target.battleIndex].restore(heal);
      gameFrame.append(textSyntax(`
      ${pre_frame}${actor_combat_text(user)} performs first aid on ${actor_combat_text(target)} <c>${$hpr}<c>recovering <c>black<c> ${heal} health.
    `));
      gameFrame.scrollTo(0, gameFrame.scrollHeight);
      nextTurn();
      update();
    };
    // this.abilityValue = (user) => {
    //   let val = 10;
    //   console.log(teamLowest(user));
    //   const {l:low, c:char} = teamLowest(user);
    //   console.log(low);
    //   console.log(char);
    //   if(low < 60) val += Math.floor((user.stats().atk * 0.2 + this.baseHeal) * user.damageBuffs().heal) / char.stats().maxHp;
    //   if(char.baseStats.hp + Math.floor((user.stats().atk * 0.2 + this.baseHeal)) > char.stats().maxHp) {
    //     console.log("fix");
    //   }
    //   return val;
    // }
  }
}

class summon_wolf {
  constructor(base = {}) {
    this.id = "summon_wolf";
    this.name = "Summon Wolf";
    this.energyCost = base.energyCost ?? 15;
    this.cooldown = 8;
    this.desc = (user) => {
      if (user.baseStats.ep < this.energyCost) return `<c>red<c>Not enough energy to use this power!`;
      if (this.onCooldown > 0) return `<c>red<c>This power is on cooldown for ${this.onCooldown} turns!`;
      return `Summon a tamed wolf to aid your party in combat. \nCooldown: ${this.cooldown} turns \nEnergy Cost: ${this.energyCost} EP`;
    };
    this.type = "summon";
    this.spell = true;
    this.targets = "self";
    this.action = (user) => {
      let summon = new Summon(summons.wolf);
      summon.heal();
      summon.recover();
      user.skipTurn = true;
      this.onCooldown = this.cooldown + 1;
      user.drain(this.energyCost);
      gameFrame.append(textSyntax(`
      ${pre_frame}${actor_combat_text(user)} casts an interdimensional spell, summoning ${actor_combat_text(summon)} to aid them in battle.
    `));
      if (user.enemy) {
        summon.enemy = true;
      } else summon.enemy = false;
      combat.characters.push(summon);
      nextTurn();
      update();
    }
  }
}