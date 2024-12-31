export class CollisionBlock {
  constructor({ position }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
  }
  draw(context) {
    context.fillStyle = "rgba(100, 100, 100, 0.5)"; // red but 50% opacity
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
