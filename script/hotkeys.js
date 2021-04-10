window.addEventListener("keyup", pressed => {
  if(pressed.key == "w") {
    // TESTING
    playerCharacter.move("north");
  }
  else if(pressed.key == "a") {
    // TESTING
    playerCharacter.move("west");
  }
  else if(pressed.key == "s") {
    // TESTING
    playerCharacter.move("south");
  }
  else if(pressed.key == "d") {
    // TESTING
    playerCharacter.move("east");
  }
  else if(pressed.key == "-") {
    if(zoom > 0) zoom--;
    staticGenerate(maps[playerCharacter.map]);
  }
  else if(pressed.key == "+") {
    if(zoom < 3) zoom++;
    staticGenerate(maps[playerCharacter.map]);
  }
});