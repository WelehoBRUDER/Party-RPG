const battles = {
  goblin_enc_1: {
    id: "goblin_enc_1",
    name: "Lone Gobbo",
    enemies: [
      new Enemy({...enemies.gobbo, level: 1, name: "Gobbo Targ"}),
    ],
    respawn_timer: 1440, // This is in minutes, 24 hours,
    text: `<f>1vw<f>You encounter a lone gobbo, who immediately screeches at you.`,
  }
}