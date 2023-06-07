class Car {
  constructor(x, y, width, height, type = "DUMMY", maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0; //speed is negative when going down
    this.acceleration = 0.1;
    this.friction = 0.05;
    this.maxSpeed = maxSpeed;
    this.angle = 0;
    this.damaged = false;
    this.useBrain = type == "AI";

    if (type != "DUMMY") {this.sensor = new Sensor(this);
      this.brain = new NeuralNetwrok([this.sensor.rayCount, 6, 4]);
    }

    this.controls = new Controls(type);
  }

  update(borders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.poygon = this.#createPolygon();
      this.damaged = this.#accessDamage(borders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(borders, traffic);
      const offset = this.sensor.readings.map((reading) =>
        reading ? 1 - reading.offset : 0//giving a low value when offset is more,i.e, more distance from collisions, getting high value when car is getting crashed
      );
      const outputs = NeuralNetwrok.feedForward(offset, this.brain);
      if (this.useBrain) {
        // console.log(outputs);
        this.controls.left = outputs[0];
        this.controls.right = outputs[1];
        this.controls.up = outputs[2];
        this.controls.down = outputs[3];
      }
    }
  }

  #accessDamage(borders, traffic) {
    for (
      let i = 0;
      i < borders.length;
      i++ //pass individual border
    )
      if (polyIntersect(this.poygon, borders[i])) return true;
    for (
      let i = 0;
      i < traffic.length;
      i++ //pass individual border
    )
      if (polyIntersect(this.poygon, traffic[i].poygon)) return true;

    return false;
  }

  #createPolygon() {
    const points = [];
    //regular pentagon
    // const rad = Math.hypot(this.width, this.height) / 2;
    // const angleIncrement = (2 * Math.PI) / 5; // Angle increment for each point

    // for (let i = 0; i < 5; i++) {
    //   const angle = this.angle + Math.PI + i * angleIncrement; // Add Math.PI to reverse the direction
    //   const x = this.x + Math.sin(angle) * rad;
    //   const y = this.y + Math.cos(angle) * rad;
    //   points.push({ x, y });
    // }
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x + Math.sin(this.angle - alpha) * rad,
      y: this.y + Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x + Math.sin(this.angle + alpha) * rad,
      y: this.y + Math.cos(this.angle + alpha) * rad,
    });

    return points;
  }

  #move() {
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
    if (this.damaged) ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.poygon[0].x, this.poygon[0].y);
    for (let i = 1; i < this.poygon.length; i++) {
      ctx.lineTo(this.poygon[i].x, this.poygon[i].y);
    }
    ctx.fill();
    if (this.sensor) this.sensor.draw(ctx);
    // ctx.restore();
  }
}
