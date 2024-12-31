export class GameTracker {
  constructor() {
    this.participantId = "";
    this.startTime = new Date("2024-12-31T15:06:00-05:00"); // Use provided time as start
    this.currentLocation = "home"; // Start at home
    this.currentRound = 1; // Default starting round
    this.points = 0;
    this.pointLoss = 0;
    this.dungeonPortalMap = {};
    this.portalEntered = 0;
    this.portalExited = 0;
    this.events = [];

    // Add event listener for when user leaves/closes the page
    window.addEventListener("beforeunload", () => {
      this.exportToCSV();
    });
  }

  trackInstructionScreen(screenNumber) {
    this.trackEvent(`instruction_screen_${screenNumber}`);
  }

  trackRoundStart(round) {
    this.currentLocation = "home";
    this.currentRound = round;
    this.pointLoss = 0;
    this.trackEvent("start_round");
  }

  trackDungeonEntry(dungeon) {
    this.currentLocation = "dungeon";
    this.pointLoss = dungeon.pointLoss;
    this.dungeonPortalMap = dungeon.portalMap;
    this.trackEvent("start_dungeon");
  }

  trackPortalTravel(portalEntered, portalExited, points) {
    this.portalEntered = portalEntered;
    this.portalExited = portalExited;
    this.points = points;
    this.trackEvent("portal_travel");
  }

  trackEvent(eventType) {
    const currentTime = new Date("2024-12-31T15:06:00-05:00"); // Use provided time
    const relativeTimeMs = currentTime - this.startTime; // Time since game start in ms
    const relativeTimeSec = Math.floor(relativeTimeMs / 1000); // Convert to seconds

    const eventData = {
      participantId: this.participantId,
      eventType: eventType,
      absoluteTimestamp: currentTime.toISOString(),
      relativeTimeSec: relativeTimeSec,
      round: this.currentRound,
      location: this.currentLocation,
      dungeonPortalMap: JSON.stringify(this.dungeonPortalMap),
      dungeonPointLoss: this.pointLoss,
      portalEntered: this.portalEntered,
      portalExited: this.portalExited,
      totalPoints: this.points,
    };
    this.events.push(eventData);
  }

  exportToCSV() {
    const headers =
      [
        "participantId",
        "eventType",
        "absoluteTimestamp",
        "relativeTimeSec",
        "round",
        "location",
        "dungeonPortalMap",
        "dungeonPointLoss",
        "portalEntered",
        "portalExited",
        "totalPoints",
      ].join(",") + "\n";

    const rows = this.events
      .map((event) =>
        [
          event.participantId,
          event.eventType,
          event.absoluteTimestamp,
          event.relativeTimeSec,
          event.round,
          event.location,
          event.dungeonPortalMap,
          event.dungeonPointLoss,
          event.portalEntered,
          event.portalExited,
          event.totalPoints,
        ].join(",")
      )
      .join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dungeon_game_data_${new Date().toISOString().split("T")[0]}_${
        this.participantId
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  saveToDatabase() {
    console.log("starting save to database");
  }
}

// class GameTracker {
//     constructor(participantId) {
//         this.participantId = participantId;
//         this.currentRound = null;
//         this.currentDungeon = null;
//         this.startTime = new Date.toISOString();
//         this.startNewRound();
//     }

//     async startNewRound() {
//         const roundNumber = await this.getNewRoundNumber();
//         this.currentRound = {
//             id: await this.createRoundInDatabase(roundNumber),
//             number: roundNumber,
//             startedAt: new Date(),
//         };
//     }

//     async enterDungeon(dungeonName, portalMap) {
//         this.currentDungeon = {
//             id: await this.createDungeonInDatabase(dungeonName, portalMap),
//             name: dungeonName,
//             enteredAt: new Date(),
//         };
//     }

//     async trackRound(round) {
//         // Create a new round in the database and return the round ID
//         // Use your ORM or raw SQL queries here
//     }

//     async trackDungeon(dungeonName, portalMap) {
//         // Create a new dungeon entry in the database and return the dungeon ID
//         // Store portalMap as JSON
//     }

//     async enterPortal(portalName) {
//         await this.createPortalEntryInDatabase(portalName, this.currentDungeon.id);
//     }

//     async trackPortalEntry(portalMap, entryPortal, exitPortal) {
//         // Create a new portal entry in the database
//     }

//     async getNewRoundNumber() {
//         // Logic to get the new round number for the user
//     }

//     async saveToDatabase() {
//         try {
//             const response = await fetch('/save-game', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     user_id: this.userId,
//                     start_time: this.startTime,
//                     actions: this.actions
//                 })
//             });

//             if (response.ok) {
//                 console.log('Game data saved successfully');
//             } else {
//                 console.error('Failed to save game data');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }

//     async exportToCSV() {

//     }

// }

// class GameTracker {
//     constructor(userId) {
//         this.userId = userId;
//         this.actions = [];
//         this.startTime = new Date().toISOString();
//     }

//     trackAction(action) {
//         const timestamp = new Date().toISOString();
//         this.actions.push({ action, timestamp });
//     }

//     async saveSession() {
//         try {
//             const response = await fetch('/save-game', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     user_id: this.userId,
//                     start_time: this.startTime,
//                     actions: this.actions
//                 })
//             });

//             if (response.ok) {
//                 console.log('Game data saved successfully');
//             } else {
//                 console.error('Failed to save game data');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
// }
