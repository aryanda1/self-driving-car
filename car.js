class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0; //speed is negative when going down
    this.acceleration = 0.1;
    this.friction = 0.05;
    this.maxSpeed = 3;
    this.angle = 0;

    this.controls = new Controls();
  }
  update() {
    if (this.controls.up) {
      this.speed += this.acceleration;
    }
    if (this.controls.down) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      //so that the car slows down when no key is pressed
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      //so that the car slows down when no key is pressed
      this.speed += this.friction;
    }
    //Now one problem can arise, that speed can never be 0, so we can add a threshold, as speed will oscillate around 0
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    // Draw circles
    ctx.beginPath();
    ctx.arc(-this.width / 2 + 8, -this.height / 2 - 4, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.width / 2 - 8, -this.height / 2 - 4, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    // Draw rectangle
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }
}
