export class Dashboard {
  constructor(totalRounds) {
    this.points = 0;
    this.x = 0;
    this.y = 0;
    this.change = 0;
    this.round = 1;
    this.totalRounds = totalRounds;
  }
  draw(context, canvas) {
    // Draw point counter
    context.font = "bold 20px Verdana";
    context.fillStyle = "black";
    let pointCounter = "Total Points: " + this.points;
    context.fillText(pointCounter, canvas.width / 2 - 75, canvas.height - 25);

    // Draw round counter
    context.font = "16px Verdana";
    let roundCounter = "Round " + this.round + " out of " + this.totalRounds;
    context.fillText(roundCounter, canvas.width / 2 + 200, canvas.height - 25);
  }

  updatePoints(change) {
    // don't deduct points past zero
    if (change + this.points >= 0) {
      this.change = change;
    }
  }

  refresh() {
    this.points += this.change;
    this.change = 0;
  }
}
