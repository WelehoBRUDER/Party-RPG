class fireball {
  constructor(base) {
    this.id = "fireball";
    this.name = "Fireball" ?? base.name;
    this.energyCost = 10 ?? base.energyCost;
    this.baseDamage = 3;
    this.baseBurn = 5;
    this.cooldown = 0;
    this.desc = (user) => {
      if (user.baseStats.ep < this.energyCost) return `<c>red<c>Not enough energy to use this power!`;
      if (this.onCooldown > 0) return `<c>red<c>This power is on cooldown for ${this.onCooldown} turns!`;
      return `Hurl a bolt of fire at an enemy. \n Deals (${this.baseDamage} + ATK) x Magical Bonus dmg. 
      Also burns for (10% of ATK x Fire Bonus) + ${this.baseBurn} fire dmg.\n Costs ${this.energyCost} EP`;
    };
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
      console.log(target.resistances());
      if (target.enemy) combat.characters.find(en => en.name == target.name).damage(dmg + burnDmg);
      else if (target.player) playerCharacter.damage(dmg + burnDmg);
      else playerCharacter.party.find(char => char.id == target.id).damage(dmg + burnDmg);
      gameFrame.append(textSyntax(`
        ${pre_frame}${actor_combat_text(user)} shoots a fireball at ${actor_combat_text(target)} dealing ${dmg}<c>${$dmg}<c> magical damage. <c>black<c> ${actor_combat_text(target)} also burns for ${burnDmg} <c>${$dmg}<c>fire damage.
      `));
      gameFrame.scrollTo(0, gameFrame.scrollHeight);
      nextTurn();
      update();
    }
  }
};

class first_aid {
  constructor(base) {
    this.id = "first_aid";
    this.name = "First Aid" ?? base.name;
    this.energyCost = 0 ?? base.energyCost;
    this.baseHeal = 10;
    this.cooldown = 3;
    this.desc = (user) => {
      if (user.baseStats.ep < this.energyCost) return `<c>red<c>Not enough energy to use this power!`;
      if (this.onCooldown > 0) return `<c>red<c>This power is on cooldown for ${this.onCooldown} turns!`;
      return `Perform first aid on self or friend. \n Recovers (${this.baseHeal} + ATK * 0.2) x Healing Bonus HP.`;
    };
    this.spell = false;
    this.targets = "allies";
    this.action = (user, target) => {
      let heal = Math.floor((user.stats().atk * 0.2 + this.baseHeal) * user.damageBuffs().heal);
      this.onCooldown = this.cooldown + 1;
      if (target.enemy) combat.characters.find(en => en.name == target.name).restore(heal);
      else if (target.player) playerCharacter.restore(heal);
      else playerCharacter.party.find(char => char.id == target.id).restore(heal);
      gameFrame.append(textSyntax(`
      ${pre_frame}${actor_combat_text(user)} performs first aid on ${actor_combat_text(target)} <c>${$hpr}<c>recovering <c>black<c> ${heal} health.
    `));
      gameFrame.scrollTo(0, gameFrame.scrollHeight);
      nextTurn();
      update();
    }
  }
}