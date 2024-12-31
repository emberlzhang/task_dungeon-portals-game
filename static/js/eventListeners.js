import * as gameModule from "./index.js";

export function bindEventListeners() {
  window.addEventListener("keydown", (e) => handleKeyDown(e));
  window.addEventListener("keyup", (e) => handleKeyUp(e));
}

export function handleKeyDown(event) {
  if (!gameModule.gameActive) {
    if (gameModule.currentScreen === 0) {
      handleParticipantIDInput(event); // Handle input for participantId field
    }
    if (gameModule.instructionsPhase) {
      handleInstructionsKeys(event); // Handle input to progress through instructions screens
    }
  } else {
    handleGameKeyDown(event); // Handle game-related keydown events during the game phase
  }
}

function handleInstructionsKeys(event) {
  if (event.key === "Enter") {
    // Ensure participant ID is handled first on the first instruction screen
    if (gameModule.currentScreen === 0) {
      handleParticipantIdSubmit(); // Submit on Enter key
      return; // Prevent progressing the screen if participant ID isn't entered
    }

    // Increment the current screen
    gameModule.incrementCurrentScreen();

    // Handle pre-practice instruction screens
    if (gameModule.isPrePracticePhase()) {
      if (gameModule.currentScreen <= gameModule.prePracticeTotalScreens - 1) {
        gameModule.displayInstructions(); // Continue displaying pre-practice instructions
      } else {
        // End of pre-practice instructions, start the practice rounds
        gameModule.startPractice();
      }
    }
    // Handle post-practice instruction screens
    else {
      if (gameModule.currentScreen <= gameModule.totalScreens - 1) {
        gameModule.displayInstructions(); // Continue displaying post-practice instructions
      } else {
        // End of all instructions, start the real game
        gameModule.setGameActive(true);
        gameModule.startGame();
      }
    }

    // if (gameModule.currentScreen <= gameModule.totalScreens - 1) {
    //     gameModule.displayInstructions();
    // } else {
    //     gameModule.setGameActive(true);
    //     gameModule.startGame();
    // }
  }
}

// Handle keyboard input for participant ID text field in beginning
function handleParticipantIDInput(event) {
  if (gameModule.currentScreen === 0) {
    if (event.key === "Backspace") {
      gameModule.inputField.value = gameModule.inputField.value.slice(0, -1);
    } else if (event.key.length === 1) {
      // Add only printable characters
      gameModule.inputField.value += event.key;
    }
    gameModule.drawParticipantIDField();
  }
}

// Function to handle submission
function handleParticipantIdSubmit() {
  const participantId = gameModule.inputField.value.trim();
  if (participantId != "") {
    gameModule.gameTracker.participantId = participantId;
    gameModule.incrementCurrentScreen();
    gameModule.displayInstructions();
  } else {
    alert("Please enter your participant ID.");
    gameModule.drawParticipantIDField();
  }
}

// Handle keydown events during the actual game
function handleGameKeyDown(event) {
  if (gameModule.player.preventInput) return;

  switch (event.key) {
    case "ArrowLeft":
      gameModule.keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      gameModule.keys.ArrowRight.pressed = true;
      break;
    case "ArrowUp":
      // if there's an escape door
      if (gameModule.currentMap.exit) {
        if (
          // if player is standing in front of dungeon exit
          gameModule.player.position.x + gameModule.player.displayWidth <=
            gameModule.currentMap.exit.position.x +
              gameModule.currentMap.exit.displayWidth && // right side of player hits right side of collision block
          gameModule.player.position.x + gameModule.player.displayWidth / 2 >=
            gameModule.currentMap.exit.position.x && // left side of player hits left side of collision
          gameModule.player.position.y + gameModule.player.displayHeight >=
            gameModule.currentMap.exit.position.y && // bottom of player hits collision block
          gameModule.player.position.y <=
            gameModule.currentMap.exit.position.y +
              gameModule.currentMap.exit.displayHeight // top of player hits collision block) {
        ) {
          gameModule.player.preventInput = true; // TODO: debug
          gameModule.setLevel(0); // set level back to home
          gameModule.player.enterLevel(
            gameModule.maps[gameModule.level],
            gameModule.overlay
          ); // enter home screen
          gameModule.dashboard.round += 1;
          if (
            gameModule.practiceMode &&
            gameModule.dashboard.round > gameModule.practiceRounds
          ) {
            gameModule.practiceMode = false; // End practice mode
            gameModule.setGameActive(true);
            gameModule.displayInstructions(); // Go to transition screen before real game
          }
          if (
            practiceMode &&
            gameModule.dashboard.round > gameModule.practiceRounds
          ) {
            gameModule.endGame();
          }
          if (gameModule.dashboard.round > gameModule.totalRounds) {
            gameModule.endGame();
          }

          break;
        }
      }

      // if player is standing in front of a dungeon entrance in home screen
      handleDungeonEntrance();

      // if player is standing in front of portal entrance in a dungeon
      handlePortalTravel();
      break;
  }
}

function handleDungeonEntrance() {
  for (let i = 0; i < gameModule.currentMap.entrances.length; i++) {
    const entrance = gameModule.currentMap.entrances[i];
    if (
      // make it easier to enter doors
      gameModule.player.position.x <=
        entrance.position.x + entrance.displayWidth && // right side of player hits right side of collision block
      gameModule.player.position.x + gameModule.player.displayWidth >=
        entrance.position.x && // left side of player hits left side of collision
      gameModule.player.position.y + gameModule.player.displayHeight >=
        entrance.position.y && // bottom of player hits collision block
      gameModule.player.position.y <=
        entrance.position.y + entrance.displayHeight // top of player hits collision block) {
    ) {
      gameModule.player.velocity.x = 0; // this doesn't work
      gameModule.player.velocity.y = 0; // this doesn't work
      gameModule.player.preventInput = true; // this doesn't stay when enterlevel sets to false

      // Track dungeon entry
      gameModule.gameTracker.trackDungeonEntry({
        portalMap: gameModule.maps[i + 1].portalMap,
        pointLoss: i === 0 ? 50 : 100,
      });

      gameModule.setLevel(i + 1); // set index to appropriate dungeon number, e.g. entrance 0 = dungeon 1
      gameModule.player.switchSprite("emergeFromPortal"); // this works
      entrance.play(); // this works but doesn't show when player enters level

      gameModule.player.enterLevel(
        gameModule.maps[gameModule.level],
        gameModule.overlay
      );
      if (i == 0) {
        gameModule.dashboard.updatePoints(50);
      } else {
        gameModule.dashboard.updatePoints(100);
      }
      break;
    }
  }
}

function handlePortalTravel() {
  for (let i = 0; i < gameModule.currentMap.doors.length; i++) {
    const door = gameModule.currentMap.doors[i];
    if (
      // if player is standing in front of a portal door
      gameModule.player.position.x <= door.position.x + door.displayWidth && // right side of player hits right side of collision block
      gameModule.player.position.x + gameModule.player.displayWidth >=
        door.position.x && // left side of player hits left side of collision
      gameModule.player.position.y + gameModule.player.displayHeight >=
        door.position.y && // bottom of player hits collision block
      gameModule.player.position.y <= door.position.y + door.displayHeight // top of player hits collision block
    ) {
      gameModule.player.velocity.x = 0;
      gameModule.player.velocity.y = 0;
      gameModule.player.preventInput = true;
      gameModule.player.switchSprite("emergeFromPortal"); // TODO: fix later

      // Track portal travel
      const exitDoorNumber = gameModule.currentMap.portalMap[i + 1];
      gameModule.gameTracker.trackPortalTravel(
        i + 1,
        exitDoorNumber,
        gameModule.dashboard.points
      );

      // Rest of the portal travel logic...
      door.play();
      gameModule.player.teleport(gameModule.currentMap, i, gameModule.overlay);
      gameModule.dashboard.updatePoints(-gameModule.currentMap.pointLoss); // point loss for portal travel

      break;
    }
  }
}

function handleGameExit(event) {
  if (
    gameModule.player.position.x + gameModule.player.displayWidth <=
      gameModule.currentMap.exit.position.x +
        gameModule.currentMap.exit.displayWidth &&
    gameModule.player.position.x + gameModule.player.displayWidth / 2 >=
      gameModule.currentMap.exit.position.x &&
    gameModule.player.position.y + gameModule.player.displayHeight >=
      gameModule.currentMap.exit.position.y &&
    gameModule.player.position.y <=
      gameModule.currentMap.exit.position.y +
        gameModule.currentMap.exit.displayHeight
  ) {
    // Track level exit
    gameModule.gameTracker.trackEvent("exit_level");

    gameModule.player.preventInput = true;
    gameModule.setLevel(0);
    gameModule.player.enterLevel(
      gameModule.maps[gameModule.level],
      gameModule.overlay
    );
    gameModule.dashboard.round += 1;

    if (
      gameModule.practiceMode &&
      gameModule.dashboard.round > gameModule.practiceRounds
    ) {
      gameModule.practiceMode = false;
      gameModule.setGameActive(true);
      gameModule.displayInstructions();
    }
    if (
      !gameModule.practiceMode &&
      gameModule.dashboard.round > gameModule.totalRounds
    ) {
      gameModule.endGame();
    }
    return true;
  }
  return false;
}

export function handleKeyUp(event) {
  if (!gameModule.gameActive) return;

  switch (event.key) {
    case "ArrowLeft":
      gameModule.keys.ArrowLeft.pressed = false; // stop moving player if key up
      break;
    case "ArrowRight":
      gameModule.keys.ArrowRight.pressed = false; // stop moving player if key up
      break;
  }
}

// Export CSV of user data if user exits browser window
window.addEventListener("beforeunload", (event) => {
  if (!gameModule.gameSaved) {
    gameModule.saveGameData();
  }
});
