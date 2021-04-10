
let editor = {
  x: 0,
  y: 0,
  move: (dir) => {
    if (dir == "north") editor.y -= 100;
    else if (dir == "south") editor.y += 100;
    else if (dir == "west") editor.x -= 100;
    else if (dir == "east") editor.x += 100;
    editor_generateMap();
  },
  editingTile: maps.lake_dragen[0],
  currentMap: maps.lake_dragen,
  connecting: false,
  addingTile: false
}

function editor_generateMap() {
  updateInfos();
  let map = editor.currentMap;
  _canvas.width = _canvas.width;

  const tileSize = 120;
  const distance = tileSize;

  ctx.translate((_canvas.width / 2 - editor.x - tileSize / 2), (_canvas.height / 2 - editor.y - tileSize / 2));
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
    if(tile == editor.editingTile) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = "8";
    }
    else if(tile.index == editor?.editingTile?.connect?.north || tile.index == editor?.editingTile?.connect?.south || tile.index == editor?.editingTile?.connect?.east || tile.index == editor?.editingTile?.connect?.west) ctx.strokeStyle = "cyan";
    else ctx.strokeStyle = "rgb(30, 30, 30)";
    ctx.stroke();
    ctx.font = "36px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(tile.index, tile.loc.x * distance + 18, tile.loc.y * distance + tileSize/2 + 18);
  });
};

document.querySelector(".editorArea").addEventListener("click", clickCanvas);

editor_generateMap();

window.addEventListener("keydown", pressed => {
  if (pressed.key == "w") {
    // TESTING
    editor.move("north");
  }
  else if (pressed.key == "a") {
    // TESTING
    editor.move("west");
  }
  else if (pressed.key == "s") {
    // TESTING
    editor.move("south");
  }
  else if (pressed.key == "d") {
    // TESTING
    editor.move("east");
  }
});

function clickCanvas(e) {
  const lX = e.layerX - document.querySelector(".editorArea").width / 2;
  const lY = e.layerY - document.querySelector(".editorArea").height / 2;
  //console.log(`LX:  ${lX} LY: ${lY}`);
  const tSize = 120;
  const dist = 120;
  const offset = tSize / 2;
  const x = Math.floor((editor.x + offset + lX) / dist);
  const y = Math.floor((editor.y + offset + lY) / dist);
  const clickedTile = editor.currentMap.tiles.find(tile => tile.loc.x == x && tile.loc.y == y);
  if(!clickedTile && !editor.addingTile) { editor.editingTile = {}; editor_generateMap(); editor.connecting = false; return; };
  if(clickedTile == editor.editingTile && !editor.addingTile) return;
  if(editor.connecting) {
    let dir = prompt("Please specify direction (north, south, west or east)");
    if(!dir) return;
    if(dir.toLowerCase().startsWith("s")) {
      editor.editingTile.connect.south = clickedTile.index;
      clickedTile.connect.north = editor.editingTile.index;
    }
    else if(dir.toLowerCase().startsWith("n")) {
      editor.editingTile.connect.north = clickedTile.index;
      clickedTile.connect.south = editor.editingTile.index;
    }
    else if(dir.toLowerCase().startsWith("e")) {
      editor.editingTile.connect.east = clickedTile.index;
      clickedTile.connect.west = editor.editingTile.index;
    } 
    else if(dir.toLowerCase().startsWith("w")) {
      editor.editingTile.connect.west = clickedTile.index;
      clickedTile.connect.east = editor.editingTile.index;
    } 
    
  }
  else if(editor.addingTile) {
    editor.currentMap.tiles.push({index: editor.currentMap.tiles.length, loc: {x: x, y: y}, connect: {}});
  }
  else editor.editingTile = clickedTile;
  editor_generateMap();
}

function updateInfos() {
  const frame = document.querySelector(".infoText");
  const p = document.createElement("p");
  frame.textContent = "";
  p.textContent = `
    Tile X: ${editor?.editingTile?.loc?.x || 0}
    Tile Y: ${editor?.editingTile?.loc?.y || 0}
    Connections: 
      North Index: ${editor?.editingTile?.connect?.north ?? "None"}
      South Index: ${editor?.editingTile?.connect?.south ?? "None"}
      West Index: ${editor?.editingTile?.connect?.west ?? "None"}
      East Index: ${editor?.editingTile?.connect?.east ?? "None"}
  `;
  
  frame.append(p);
  if(editor.editingTile?.loc && !editor.connecting) {
    const conLink = document.createElement("p");
    conLink.classList = "link addConnection";
    conLink.textContent = "Add New Connection";
    conLink.onclick = connectionMode;
    frame.append(conLink);
  }
  else if(editor.editingTile?.loc && editor.connecting) {
    const conLink = document.createElement("p");
    conLink.classList = "link stopConnection";
    conLink.textContent = "Stop Adding Connections";
    conLink.onclick = connectionModeOff;
    frame.append(conLink);
  }
  else if(!editor.addingTile) {
    const conLink = document.createElement("p");
    conLink.classList = "link addTile";
    conLink.textContent = "Add New Tile";
    conLink.onclick = addTile;
    frame.append(conLink);
  }
  else {
    const conLink = document.createElement("p");
    conLink.classList = "link stopAddTile";
    conLink.textContent = "Stop Adding Tiles";
    conLink.onclick = addTileStop;
    frame.append(conLink);
  }

  const _printMap = document.createElement("p");
  _printMap.classList = "link printMap";
  _printMap.textContent = "Print Map";
  _printMap.onclick = printMap;
  frame.append(_printMap);

  const createNew = document.createElement("p");
  createNew.classList = "link newMap";
  createNew.textContent = "Create New Map";
  createNew.onclick = newMap;
  frame.append(createNew);
}

function connectionMode() {
  editor.connecting = true;
  editor_generateMap();
}

function connectionModeOff() {
  editor.connecting = false;
  editor_generateMap();
}

function addTile() {
  editor.addingTile = true;
  editor_generateMap();
}

function addTileStop() {
  editor.addingTile = false;
  editor_generateMap();
}

function newMap() {
  let map = {};
  let name = prompt("Name of the new map");
  map.name = name;
  map.id = name.toLowerCase().replaceAll(" ", "_");
  map.tiles = [
    {
      index: 0,
      loc: {x: 0, y: 0},
      connect: {}
    }
  ];
  editor.x = 0;
  editor.y = 0;
  editor.currentMap = map;
  editor.connecting = false;
  editor.addingTile = false;
  editor.editingTile = {};
  editor_generateMap();
}

function printMap() {
  let object = `${editor.currentMap.id}: {
    name: "${editor.currentMap.name}",
  `;
  object += `tiles: [
    `;
  editor.currentMap.tiles.forEach(tile=>{
    object += `{
      index: ${tile.index},
      loc: {x: ${tile.loc.x}, y: ${tile.loc.y}},
      connect: {${tile.connect?.north > -1 ? "north: " + tile.connect.north + ", " : ""}${tile.connect?.south > -1 ? "south: " + tile.connect.south + ", " : ""}${tile.connect?.west > -1 ? "west: " + tile.connect.west + ", " : ""}${tile.connect?.east > -1 ? "east: " + tile.connect.east + ", " : ""}}
    },
    `;
  });
  object += ` ]
  }`;
  console.log(object);
}