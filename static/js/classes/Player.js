import { Sprite } from "./Sprite.js";

export class Player extends Sprite {
  constructor(
    position,
    imageSrc,
    scale,
    frameRate,
    frameBuffer,
    animations,
    loop
  ) {
    super(position, imageSrc, scale, frameRate, frameBuffer, animations, loop);
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.gravity = 1;
    this.preventInput = false;
  }

  update(collisionBlocks) {
    this.position.x += this.velocity.x; // update x position based on velocity
    this.checkHorizontalCollisions(collisionBlocks);
    this.applyGravity();
    this.checkVerticalCollisions(collisionBlocks);
  }

  handleInput(keys) {
    // console.log(this.preventInput)
    if (this.preventInput) return; // should not run when entering dungeons or portals

    this.velocity.x = 0; // set to zero by default (if pressed = false)

    // update left / right movement
    if (keys.ArrowLeft.pressed) {
      this.switchSprite("runLeft");
      this.lastDirection = "left";
      this.velocity.x = -5;
    } else if (keys.ArrowRight.pressed) {
      this.switchSprite("runRight");
      this.lastDirection = "right";
      this.velocity.x = 5;
    } else {
      if (this.lastDirection === "left") {
        this.switchSprite("idleLeft");
      } else {
        this.switchSprite("idleRight");
      }
    }
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;
    this.currentAnimation = this.animations[name];
  }

  enterLevel(map, overlay) {
    gsap.to(overlay, {
      opacity: 1,
      onComplete: () => {
        gsap.to(overlay, {
          opacity: 0,
        });
        map.init(); // maps[level]
        this.switchSprite("emergeFromPortal"); // this doesn't show up when prevent input is set to false in this block
        this.lastDirection = "right"; // keep sprite on right idle
        this.preventInput = false; // this happens before the emerging can show
        // console.log(this.preventInput) // this is correctly set to false but switches somehow
      },
    });
  }

  checkHorizontalCollisions(collisionBlocks) {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // if player collision exists
      if (
        this.position.x <= collisionBlock.position.x + collisionBlock.width && // left side of player hits collision block
        this.position.x + this.displayWidth >= collisionBlock.position.x && // right side of player hits collision block
        this.position.y + this.displayHeight >= collisionBlock.position.y && // bottom of player hits collision block
        this.position.y <= collisionBlock.position.y + collisionBlock.height // top of player hits collision block
      ) {
        // player colliding while going to the left
        if (this.velocity.x < 0) {
          // reset player position to avoid collision
          this.position.x =
            collisionBlock.position.x + collisionBlock.width + 0.01;
          break;
        }
        // player colliding while going to the right
        if (this.velocity.x > 0) {
          // reset player position to avoid collision
          this.position.x =
            collisionBlock.position.x - this.displayWidth - 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y = this.velocity.y + this.gravity;
    this.position.y += this.velocity.y; // update y position based on velocity
  }

  checkVerticalCollisions(collisionBlocks) {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // if player collision exists
      if (
        this.position.x <= collisionBlock.position.x + collisionBlock.width && // left side of player hits collision block
        this.position.x + this.displayWidth >= collisionBlock.position.x && // right side of player hits collision block
        this.position.y + this.displayHeight >= collisionBlock.position.y && // bottom of player hits collision block
        this.position.y <= collisionBlock.position.y + collisionBlock.height // top of player hits collision block
      ) {
        // player colliding while going up
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          // reset player position to avoid collision
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01;
          break;
        }
        // player colliding while going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          // reset player position to avoid collision
          this.position.y = collisionBlock.position.y - this.displayHeight - 1;
          break;
        }
      }
    }
  }

  teleport(currentMap, entryIndex, overlay) {
    // this.switchSprite('enterPortal')

    gsap.to(overlay, {
      // manages timing of animations
      opacity: 0,
      onComplete: () => {
        gsap.to(overlay, {
          opacity: 0,
        });
        let destinationIndex = currentMap.portalMap[entryIndex + 1] - 1; // account for indices from 0
        let destinationDoor = currentMap.doors[destinationIndex];
        destinationDoor.play();
        let final_x =
          destinationDoor.position.x + destinationDoor.displayWidth * 0.25; // move to the middle of the destination door
        let final_y =
          destinationDoor.position.y +
          destinationDoor.displayHeight -
          this.displayHeight; // move to the ground of the destination door (still jumpy display)
        // setTimeout(function() { // doesn't know what "this" is when inside setTimeout
        this.position.x = final_x;
        this.position.y = final_y;
        // }, 1000)

        this.switchSprite("idleRight");
        // this.switchSprite('emergeFromPortal') // this gets overwritten
        this.preventInput = false;

        // this.lastDirection = 'right' // keep sprite on right idle
      },
    });
  }
}
