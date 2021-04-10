const battles = {
  goblin_enc_1: {
    id: "goblin_enc_1",
    name: "Lone Gobbo",
    enemies: [
      new Enemy(enemies.gobbo),
      new Enemy(enemies.gobbo),
      new Enemy(enemies.gobbo),
      new Enemy(enemies.gobbo),
      new Enemy(enemies.gobbo)
    ],
    respawn_timer: 1440, // This is in minutes, 24 hours,
    text: ()=>{
      return `You encounter a lone gobbo, who immediately screeches at you.`
    }
  }
}