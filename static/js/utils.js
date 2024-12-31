import { CollisionBlock } from "./classes/CollisionBlock.js";

const num_blocks_wide = 12;

Array.prototype.parse2D = function (data) {
  const rows = [];
  for (let i = 0; i < this.length; i += num_blocks_wide) {
    rows.push(this.slice(i, i + num_blocks_wide)); // make rows defined by desired width
  }
  return rows;
};

Array.prototype.createObjectsFrom2D = function () {
  const objects = []; // collision blocks or other objects
  this.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 292) {
        // push new collision into collisionblocks array
        objects.push(
          new CollisionBlock({
            position: {
              x: x * 64, // calculate location based on index in array
              y: y * 64, // calculate location based on index in array
            },
          })
        );
      }
    });
  });
  return objects;
};
