import { Map } from "./classes/Map.js";
import { Player } from "./classes/Player.js";
import { Dashboard } from "./classes/Dashboard.js";
import { GameTracker } from "./classes/GameTracker.js";
import { playerAttributes } from "./data/playerConstants.js";
import { homeWidth, homeHeight } from "./data/mapConstants.js";
import {
  bindEventListeners,
  handleKeyDown,
  handleKeyUp,
} from "./eventListeners.js";

// Setup game canvas
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");
canvas.width = homeWidth;
canvas.height = homeHeight;
export const overlay = { opacity: 0 };

// Setup start of game
export const practiceRounds = 2; // Number of practice rounds
export const totalRounds = 10; // Number of experiment rounds

export let instructionsPhase = true;
export let currentPracticeRound = 0; // Track the current practice round
export let practiceMode = true; // Boolean to track if the game is in practice mode

export let level = 0; // start on home map, e.g. maps[0]
export function setLevel(index) {
  level = index;
}
let practiceMaps;
let experimentMaps;
export let maps;
export let currentMap;

let gameInitialized = false;
let animationId;
export let gameEnded = false;

// Setup player, game dashboard
export const player = new Player(playerAttributes);
export const dashboard = new Dashboard(totalRounds);
export let keys = {
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowUp: { pressed: false },
};

// Setup input field for first screen
export const inputField = {
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 - 40,
  width: 200,
  height: 40,
  value: "",
  active: true,
};

// Setup tracking variables
export let currentScreen = 0; // keeps track of instruction screen to display
export let prePracticeTotalScreens = 4;
export let totalScreens = 5; // total number of screens before real experiment
export let isPrePracticePhase = true;

export let gameActive = false; // false during instructions, true once game has started
export let gameSaved = false;

export let gameTracker = new GameTracker(); // GameTracker gets initialized once participant ID is collected
export function setCurrentMap(map) {
  currentMap = map;
}
export function setGameActive(bool) {
  gameActive = bool;
  if (bool) {
    if (practiceMode) {
      gameTracker.trackEvent("start_practice_mode");
    } else {
      gameTracker.trackEvent("start_experiment_mode");
    }
  }
}
export function incrementCurrentScreen() {
  currentScreen++;
}

// Fetch portal maps from Flask server
function fetchPortalMap() {
  return fetch("/config")
    .then((response) => response.json())
    .then((config) => {
      const apiBaseUrl = config.apiBaseUrl;
      return fetch(`${apiBaseUrl}/portal_map`);
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching portal map:", error);
      return null;
    });
}

// Fetch portal maps
const portalMap1Promise = fetchPortalMap();
const portalMap2Promise = fetchPortalMap();
const practicePortalMap1Promise = fetchPortalMap();
const practicePortalMap2Promise = fetchPortalMap();

Promise.all([
  portalMap1Promise,
  portalMap2Promise,
  practicePortalMap1Promise,
  practicePortalMap2Promise,
]).then(([portalMap1, portalMap2, practicePortalMap1, practicePortalMap2]) => {
  if (portalMap1 && portalMap2 && practicePortalMap1 && practicePortalMap2) {
    initializeGame(
      portalMap1,
      portalMap2,
      practicePortalMap1,
      practicePortalMap2
    );
  } else {
    console.error("One or both portal maps failed to load.");
  }
});

function initializeGame(
  portalMap1,
  portalMap2,
  practicePortalMap1,
  practicePortalMap2
) {
  console.log("portal maps are loaded");
  gameInitialized = true;
  // Initialize game with the two portal maps
  let homeDisplay = new Map("home", "white");
  let dungeon1 = new Map("dungeon", "purple", portalMap1, 0);
  let dungeon2 = new Map("dungeon", "teal", portalMap2, 50);

  // Initialize practice maps
  let practiceDungeon1 = new Map(
    "practiceDungeon",
    "lightblue",
    practicePortalMap1,
    50
  );
  let practiceDungeon2 = new Map(
    "practiceDungeon",
    "lightgreen",
    practicePortalMap2,
    0
  );

  practiceMaps = [homeDisplay, practiceDungeon1, practiceDungeon2]; // Add practice dungeons to maps
  experimentMaps = [homeDisplay, dungeon1, dungeon2];

  displayInstructions();
  bindEventListeners();
  gameTracker.trackEvent("start_game");
}

export function displayInstructions() {
  // Clear the canvas before displaying instructions
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "midnightblue";
  c.textAlign = "center";

  // Instructions text based on the current screen
  if (currentScreen === 0) {
    drawParticipantIDField(); // Collect participant ID
  } else if (currentScreen === 1) {
    c.font = "24px Arial";
    c.fillText(
      "Welcome to the Dungeons & Portals Game!",
      canvas.width / 2,
      180
    );
    c.fillText(
      "Teleport through portals to explore different platforms in a dungeon.",
      canvas.width / 2,
      230
    );
    c.fillText("Find a way to escape each dungeon.", canvas.width / 2, 260);
    c.fillText(
      "You will earn $1 for every 100 points earned in this game.",
      canvas.width / 2,
      290
    );
    c.fillText("Press ENTER to continue.", canvas.width / 2, 340);
  } else if (currentScreen === 2) {
    c.font = "24px Arial";
    c.fillText("GAME INSTRUCTIONS", canvas.width / 2, 160);
    c.fillText(
      "Win (or lose) points from entering and exiting dungeons.",
      canvas.width / 2,
      200
    );
    c.fillText(
      "Every round, choose one of 2 dungeons to play.",
      canvas.width / 2,
      230
    );
    c.fillText(
      "The two dungeons may earn you different points.",
      canvas.width / 2,
      260
    );
    c.fillText(
      "To maximize points, figure out the better dungeon to play.",
      canvas.width / 2,
      290
    );
    c.fillText("Press ENTER to continue.", canvas.width / 2, 340);
  } else if (currentScreen === 3) {
    c.font = "24px Arial";
    c.fillText("NAVIGATION", canvas.width / 2, 160);
    c.fillText(
      "Use LEFT and RIGHT arrow keys to move your player.",
      canvas.width / 2,
      200
    );
    c.fillText(
      "Press UP arrow key to enter a door or escape a dungeon.",
      canvas.width / 2,
      230
    );
    c.fillText(
      "You will play a short practice session to learn the game.",
      canvas.width / 2,
      260
    );
    c.fillText(
      "Press ENTER to start the practice session.",
      canvas.width / 2,
      310
    );
  } else if (currentScreen === 4) {
    c.font = "24px Arial";
    c.fillText(
      "Good job! You have now finished the practice.",
      canvas.width / 2,
      160
    );
    c.fillText("Get ready to play the real game!", canvas.width / 2, 200);
    c.fillText(
      "Remember, you'll earn $1 per 100 points earned in this game.",
      canvas.width / 2,
      230
    );
    c.fillText("Good luck! Your adventure begins now.", canvas.width / 2, 260);
    c.fillText("Press ENTER to start the game.", canvas.width / 2, 310);
  }
}

export function drawParticipantIDField() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Draw input field
  c.fillStyle = "white";
  c.fillRect(inputField.x, inputField.y, inputField.width, inputField.height);
  c.strokeRect(inputField.x, inputField.y, inputField.width, inputField.height);
  // Draw input text
  c.fillStyle = "black";
  c.font = "20px Arial";
  c.fillText(
    inputField.value,
    inputField.x + inputField.width / 2,
    inputField.y + 25
  );
  // Draw instructions
  c.fillStyle = "black";
  c.font = "20px Arial";
  c.fillText(
    "Enter Participant ID and press ENTER",
    canvas.width / 2,
    canvas.height / 2 - 60
  );
}

export function startPractice() {
  console.log("Starting practice");
  practiceMode = true;
  gameActive = true;
  maps = practiceMaps;
  currentMap = maps[0];
  currentMap.init();
  animate();
}

// Start the game after displaying instructions
export function startGame() {
  if (gameInitialized && gameActive) {
    console.log("Starting experiment");
    gameActive = true;
    practiceMode = false;
    maps = experimentMaps;
    currentMap = maps[0]; // Start on the home map
    currentMap.init();
    animate();
  } else if (!gameActive) {
    console.log(
      "Game (practice or real) is not currently active. Cannot start."
    );
  } else {
    console.error("Game cannot start before portal maps are loaded.");
  }
}

// Updates and animates the game frame by frame
function animate() {
  if (!gameActive) {
    cancelAnimationFrame(animationId);
    return;
  }
  // this makes animate a recursive function
  animationId = window.requestAnimationFrame(animate);

  // Draw background
  c.fillStyle = "midnightblue";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Draw walls, doors, and collision blocks
  currentMap.draw();

  // Draw dashboard
  dashboard.draw(c, canvas);
  dashboard.refresh();

  // Update player position & animation
  player.handleInput(keys);
  player.draw(c);
  player.update(currentMap.collisionBlocks);

  // Overlay effect for level changes
  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();

  // Handle door closing
  resetDoors();
}

function resetDoors() {
  // If a portal was open for teleportation, close the portal
  for (let i = 0; i < currentMap.doors.length; i++) {
    const door = currentMap.doors[i];
    if (door.autoplay && door.currentFrame === door.frameRate - 1) {
      door.reset();
      player.preventInput = false;
    }
  }
}

export function endGame() {
  gameActive = false;
  gameTracker.trackEvent("end_game");
  gameTracker.exportToCSV();
  gameSaved = true;

  cancelAnimationFrame(animationId);
  // Save game data
  saveGameData();
  // Remove event listeners
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);

  // Display end game text
  c.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = homeWidth;
  canvas.height = homeHeight;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "midnightblue";
  c.textAlign = "center";
  c.font = "32px Arial";
  c.fillText(
    "Thank you for playing the Dungeon Portal Game.",
    canvas.width / 2,
    200
  );
  c.fillText("The game is now complete.", canvas.width / 2, 275);
  c.fillText(
    "You earned a total of " + dashboard.points + " points in this game.",
    canvas.width / 2,
    350
  );
  c.fillText("Thank you for your participation!", canvas.width / 2, 425);
}

export function saveGameData() {
  if (!gameSaved) {
    gameTracker.exportToCSV();
    gameSaved = true;
  }
}
