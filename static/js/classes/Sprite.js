export class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frameRate = 1,
    frameBuffer,
    loop = true,
    autoplay = true,
    animations,
  }) {
    this.position = position; // not reading position, position is undefined
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true; // ensure image loads before drawing
      this.width = this.image.width / this.frameRate;
      this.height = this.image.height;
      this.displayWidth = this.width * this.scale;
      this.displayHeight = this.height * this.scale;
    };
    this.image.src = imageSrc;
    this.loaded = false;
    this.scale = scale;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.frameBuffer = frameBuffer; // slows down the rate at which images change for realistic animation
    this.loop = loop;
    this.autoplay = autoplay;
    this.animations = animations;
    // this.currentAnimation.onComplete()

    if (this.animations) {
      for (let key in this.animations) {
        const image = new Image();
        image.src = this.animations[key].imageSrc;
        this.animations[key].image = image;
      }
    }
  }
  draw(context) {
    if (!this.loaded) {
      return;
    }

    const cropbox = {
      position: {
        x: this.width * this.currentFrame,
        y: 0,
      },
      width: this.width, // consider whether should be displayWidth
      height: this.height, // consider whether should be displayWidth
    };

    context.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.displayWidth,
      this.displayHeight
    );

    this.updateFrames();
  }

  play() {
    this.autoplay = true;
  }

  reset() {
    // close the doors after play
    this.autoplay = false;
    this.currentFrame = 0;
  }

  updateFrames() {
    if (!this.autoplay) return;

    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      // every time the frame reaches 2...
      if (this.currentFrame < this.frameRate - 1) {
        // change the image for animated effect
        this.currentFrame++;
      } else if (this.loop) {
        this.currentFrame = 0;
      }
    }

    if (this.currentAnimation) {
      if (this.currentAnimation.onComplete) {
        if (
          this.currentFrame === this.frameRate - 1 &&
          !this.currentAnimation.isActive
        ) {
          //
          this.currentAnimation.onComplete();
          this.currentAnimation.isActive = true; // so that it doesn't run again
        }
      }
    }
  }
}
