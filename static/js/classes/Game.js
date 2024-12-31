class Game {
  constructor(homeWidth, homeHeight) {
    // Setup game canvas
    this.canvas = document.querySelector("canvas");
    this.c = this.canvas.getContext("2d");
    this.canvas.width = homeWidth;
    this.canvas.height = homeHeight;
    this.overlay = { opacity: 0 };

    // Setup maps
    this.maps = [
      new Map(this, "home", "white"),
      new Map(this, "dungeon", "purple", complexPortalMap1),
      new Map(this, "dungeon", "teal", complexPortalMap2),
    ];

    // Starting game settings
    this.totalRounds = 2;
    this.level = 0; // start on home map
    this.currentMap = this.maps[this.level];

    this.player = new Player(this, playerAttributes);
    this.dashboard = new Dashboard(this);
    this.keys = {
      ArrowLeft: { pressed: false },
      ArrowRight: { pressed: false },
      ArrowUp: { pressed: false },
    };
    this.currentScreen = 0; // track instructions screens before real game
    this.screens = 3; // total number of instructions screens
    this.gameStarted = false;
    this.animate = this.animate.bind(this);
    // this.switchingWorlds = false // manage timing of switchingsprites: emerging animation
  }

  init() {
    // Start by displaying instructions
    bindEventListeners(this);
    this.displayInstructions();
  }

  displayInstructions() {
    // Clear the canvas before displaying instructions
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.fillStyle = "midnightblue";
    this.c.textAlign = "center";

    // Title
    // this.c.font = '30px Arial';
    // this.c.fillText('Portal Teleportation Game', this.canvas.width / 2, 100);

    // Instructions text based on the current screen
    if (this.currentScreen === 0) {
      this.c.font = "24px Arial";
      this.c.fillText(
        "Welcome to the Portal Teleportation Game!",
        this.canvas.width / 2,
        200
      );
      this.c.fillText(
        "Navigate through portals to explore different platforms in a room.",
        this.canvas.width / 2,
        240
      );
      this.c.fillText(
        "Find a teleportation path to the exit.",
        this.canvas.width / 2,
        280
      );
      this.c.fillText("Press Enter to continue.", this.canvas.width / 2, 320);
    } else if (this.currentScreen === 1) {
      this.c.font = "24px Arial";
      this.c.fillText(
        "Win (or lose) points from entering and exiting rooms.",
        this.canvas.width / 2,
        200
      );
      this.c.fillText(
        "There are two rooms you can play. Every round, choose which room to play.",
        this.canvas.width / 2,
        230
      );
      this.c.fillText(
        "Each room has a different point bonus (for entering), with portals that MAY OR MAY NOT lose you points.",
        this.canvas.width / 2,
        260
      );
      this.c.fillText(
        "To maximize the points you earn, find the better of the two rooms to play.",
        this.canvas.width / 2,
        290
      );
      this.c.fillText("Press Enter to continue.", this.canvas.width / 2, 320);
      this.c.fillText("", this.canvas.width / 2, 360);

      // Display gameplay image 1
      // const img = nfvfrew Image();
      // img.src = 'path_to_gameplay_image_1.png';
      // img.onload = () => {
      //     this.c.drawImage(img, this.canvas.width / 2 - img.width / 2, 300);
      // };
    } else if (this.currentScreen === 2) {
      this.c.font = "24px Arial";
      this.c.fillText(
        "At the end of the game, you will earn a game bonus based on the total points won.",
        this.canvas.width / 2,
        160
      );
      this.c.fillText(
        "NAVIGATION: Use LEFT and RIGHT arrow keys to move your player. Press UP arrow key to enter a door, enter a portal, or exit.",
        this.canvas.width / 2,
        200
      );
      this.c.fillText(
        "Good luck! Your adventure begins now.",
        this.canvas.width / 2,
        240
      );
      this.c.fillText(
        "Press Enter to start the game.",
        this.canvas.width / 2,
        280
      );

      // Display gameplay image 2
      // const img = new Image();
      // img.src = 'path_to_gameplay_image_2.png';
      // img.onload = () => {
      //     this.c.drawImage(img, this.canvas.width / 2 - img.width / 2, 320);
      // };
    }
  }

  startGame() {
    // Clear the canvas and start game loop
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.maps[this.level].init();
    // if (!this.animationStarted) {
    //     this.animationStarted = true;
    this.animate();
    // }
  }

  animate() {
    // this makes animate a recursive function
    window.requestAnimationFrame(() => this.animate());

    // Draw background
    this.c.fillStyle = "midnightblue";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw walls, doors, and collision blocks
    this.currentMap.draw();

    // Draw dashboard
    this.dashboard.draw();
    this.dashboard.refresh();

    // Update player position & animation
    this.player.handleInput(this.keys);
    this.player.draw();
    this.player.update(this.currentMap.collisionBlocks);

    // Overlay effect for level changes
    this.c.save();
    this.c.globalAlpha = this.overlay.opacity;
    this.c.fillStyle = "black";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.restore();

    // Handle door closing
    this.resetDoors();
  }

  resetDoors() {
    // If a door was open for teleportation, close the door
    for (let i = 0; i < this.currentMap.doors.length; i++) {
      const door = this.currentMap.doors[i];
      if (door.autoplay && door.currentFrame === door.frameRate - 1) {
        door.reset();
        this.player.preventInput = false;
      }
    }
  }

  endGame() {}
}
