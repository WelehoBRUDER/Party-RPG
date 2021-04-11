const maps = {
  dragen_lake_cave: {
    name: "Cave of Lake Dragen",
    tiles: [
      {
        index: 0,
        loc: { x: 0, y: 0 },
        connect: { north: 3, east: 2, west: 1, south: 5 }
      },
      {
        index: 1,
        loc: { x: -3, y: 0 },
        connect: { east: 0 }
      },
      {
        index: 2,
        loc: { x: 3, y: 0 },
        connect: { west: 0 }
      },
      {
        index: 3,
        loc: { x: 2, y: -3 },
        connect: { south: 0, north: 4 }
      },
      {
        index: 4,
        loc: { x: -2, y: -6 },
        connect: { south: 3, east: 6 }
      },
      {
        index: 5,
        loc: { x: 1, y: 2 },
        connect: { north: 0 }
      },
      {
        index: 6,
        loc: { x: 8, y: -6 },
        connect: { east: 7 }
      },
      {
        index: 7,
        loc: { x: 3, y: -9 },
        connect: { east: 4 }
      },
    ],
  },
  lake_dragen: {
    name: "Lake Dragen",
    tiles: [
      {
        index: 0,
        loc: { x: 0, y: 0 },
        connect: { north: 1, west: 1, east: 2, }
      },
      {
        index: 1,
        loc: { x: -2, y: -3 },
        connect: { south: 0, east: 3, }
      },
      {
        index: 2,
        loc: { x: 2, y: -3 },
        connect: { north: 3, south: 0, west: 3, }
      },
      {
        index: 3,
        loc: { x: 0, y: -5 },
        connect: { north: 4, south: 2, west: 4, east: 5, }
      },
      {
        index: 4,
        loc: { x: -2, y: -7 },
        connect: { south: 3, east: 6, }
      },
      {
        index: 5,
        loc: { x: 2, y: -7 },
        connect: { south: 3, west: 6, }
      },
      {
        index: 6,
        loc: { x: 0, y: -9 },
        connect: { west: 4, east: 5, }
      },
    ]
  },
  ilkan_dunkku: {
    name: "ilkan dunkku",
    tiles: [
      {
        index: 0,
        loc: { x: 0, y: 0 },
        connect: { north: 1, west: 1, east: 3, }
      },
      {
        index: 1,
        loc: { x: -3, y: -3 },
        connect: { south: 0, east: 2, }
      },
      {
        index: 2,
        loc: { x: 1, y: -6 },
        connect: { west: 1, east: 3, }
      },
      {
        index: 3,
        loc: { x: 5, y: -2 },
        connect: { west: 2, }
      },
    ]
  },
  super_fun_map: {
    name: "super fun map",
    tiles: [
      {
        index: 0,
        loc: { x: 0, y: 0 },
        connect: { east: 1, }
      },
      {
        index: 1,
        loc: { x: 4, y: -1 },
        connect: { west: 0, east: 2, },
        battle: battles.goblin_enc_1
      },
      {
        index: 2,
        loc: { x: 7, y: 1 },
        connect: { west: 1, east: 3, }
      },
      {
        index: 3,
        loc: { x: 10, y: -1 },
        connect: { west: 2, east: 4, }
      },
      {
        index: 4,
        loc: { x: 14, y: 1 },
        connect: { west: 3, east: 5, },
      },
      {
        index: 5,
        loc: { x: 17, y: -1 },
        connect: { west: 4, east: 6, }
      },
      {
        index: 6,
        loc: { x: 21, y: 1 },
        connect: { west: 5, east: 7, }
      },
      {
        index: 7,
        loc: { x: 23, y: -1 },
        connect: { west: 6, east: 8, }
      },
      {
        index: 8,
        loc: { x: 26, y: 1 },
        connect: { west: 7, east: 9, }
      },
      {
        index: 9,
        loc: { x: 30, y: -1 },
        connect: { west: 8, east: 10, }
      },
      {
        index: 10,
        loc: { x: 33, y: 1 },
        connect: { west: 9, east: 11, }
      },
      {
        index: 11,
        loc: { x: 36, y: -1 },
        connect: { west: 10, east: 12, }
      },
      {
        index: 12,
        loc: { x: 39, y: 1 },
        connect: { west: 11, east: 13, }
      },
      {
        index: 13,
        loc: { x: 43, y: -1 },
        connect: { west: 12, }
      },
    ]
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let zoom = 2;
const zoomLevels = [0.65, 0.85, 1, 1.15];

const _canvas = document.querySelector(".gameCanvas");
const ctx = _canvas.getContext("2d");

async function generateMap(map) {
  const fps = 40;
  for (let i = fps; i >= 0; i--) {
    _canvas.width = _canvas.width;
    const playerTile = map.tiles[playerCharacter.location];
    const oldTile = map.tiles[playerCharacter.oldLocation];

    const tileSize = 120 * zoomLevels[zoom];
    const distance = tileSize;
    const plX = oldTile.loc.x + (playerTile.loc.x - oldTile.loc.x) / fps * (fps - i);
    const plY = oldTile.loc.y + (playerTile.loc.y - oldTile.loc.y) / fps * (fps - i);

    ctx.translate((_canvas.width / 2 - (plX * distance) - tileSize / 2), (_canvas.height / 2 - (plY * distance) - tileSize / 2));
    map.tiles.forEach(tile => {
      Object.entries(tile.connect).forEach(connect => {
        ctx.globalCompositeOperation = 'destination-over';
        const index = connect[1];
        const connection = map.tiles[index];

        ctx.lineWidth = "8";
        ctx.strokeStyle = "rgb(30, 30, 30)";
        ctx.beginPath();
        ctx.moveTo(tile.loc.x * distance + tileSize / 2, tile.loc.y * distance + tileSize / 2);
        ctx.lineTo(connection.loc.x * distance + tileSize / 2, connection.loc.y * distance + tileSize / 2);
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgb(70, 70, 80)";
      ctx.rect(tile.loc.x * distance, tile.loc.y * distance, tileSize, tileSize);
      ctx.fill();
      ctx.lineWidth = "4";
      ctx.fillStyle = "rgb(5, 5, 10)";
      ctx.stroke();
      if(tile.battle) {
        if(game.enemy_respawn_timers[tile.battle.id] == 0 || !game.enemy_respawn_timers[tile.battle.id]) {
          let enImg = document.querySelector(".enemyImg");
          ctx.drawImage(enImg, tile.loc.x * distance, tile.loc.y * distance, tileSize, tileSize);
        }
      }
    });
    let img = document.querySelector(".playerImg");
    ctx.drawImage(img, plX * distance, plY * distance, tileSize, tileSize);
    await sleep(10);
  };
  const thisTile = map.tiles[playerCharacter.location];
  if(thisTile.battle) {
    if(game.enemy_respawn_timers[thisTile.battle.id] == 0 || !game.enemy_respawn_timers[thisTile.battle.id]) {
      combatEncounter(thisTile.battle);
    }
  }
};

function staticGenerate(map) {
  const _canvas = document.querySelector(".gameCanvas");
  const ctx = _canvas.getContext("2d");
  _canvas.width = _canvas.width;
  const playerTile = map.tiles[playerCharacter.location];
  const oldTile = map.tiles[playerCharacter.oldLocation];

  const tileSize = 120 * zoomLevels[zoom];
  const distance = tileSize;
  const plX = playerTile.loc.x
  const plY = playerTile.loc.y

  ctx.translate((_canvas.width / 2 - (plX * distance) - tileSize / 2), (_canvas.height / 2 - (plY * distance) - tileSize / 2));
  map.tiles.forEach(tile => {
    Object.entries(tile.connect).forEach(connect => {
      ctx.globalCompositeOperation = 'destination-over';
      const index = connect[1];
      const connection = map.tiles[index];

      ctx.lineWidth = "8";
      ctx.strokeStyle = "rgb(30, 30, 30)";
      ctx.beginPath();
      ctx.moveTo(tile.loc.x * distance + tileSize / 2, tile.loc.y * distance + tileSize / 2);
      ctx.lineTo(connection.loc.x * distance + tileSize / 2, connection.loc.y * distance + tileSize / 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgb(70, 70, 80)";
    ctx.rect(tile.loc.x * distance, tile.loc.y * distance, tileSize, tileSize);
    ctx.fill();
    ctx.lineWidth = "4";
    ctx.fillStyle = "rgb(5, 5, 10)";
    ctx.stroke();
  });
  let img = document.querySelector(".playerImg");
  ctx.drawImage(img, plX * distance, plY * distance, tileSize, tileSize);
}

//generateMap(maps.dragen_lake_cave);
