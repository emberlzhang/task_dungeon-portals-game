// MAP DIMENSIONS
// This is for 64x64 tiles. Note: 16x9 ratio works for most screens
export const homeWidth = 64 * 12;
export const homeHeight = 64 * 10; // 9 blocks for game, 1 block for point counter
// const dungeonWidth = 64 * 12
// const dungeonHeight = 64 * 14 // 13 blocks for game, 1 block for point counter
export const dungeonWidth = 64 * 12;
export const dungeonHeight = 64 * 20; // 13 blocks for game, 1 block for point counter

// STARTING POSITIONS
// Home
export const homePosition = {
  x: homeWidth / 2,
  y: homeHeight / 2,
};
// Dungeons
export const startPosition = {
  x: dungeonWidth / 2,
  y: 500, // complex 6 level dungeon version
  // y: 300 // simple 4 level dungeon version
};

// DOOR POSITIONS and SIZE
export const door_scale = 2 / 3;
export const door_height = 112 * door_scale;

export const home_x_positions = [64 * 1.5, 64 * 9.5];
export const home_y_positions = [64 * 6 - door_height];

export const dungeon_x_positions = [64 * 1.5, 64 * 5, 64 * 8.5];
export const dungeon_y_positions = [
  64 * 3 - door_height,
  64 * 6 - door_height,
  64 * 9 - door_height,
  64 * 12 - door_height,
  // for 6 stories:
  64 * 15 - door_height,
  64 * 18 - door_height,
];
