class Sensor {
  constructor(car) {
    this.car = car;
    this.length = 100;
    this.rayCount = 5;
    this.rayWidth = Math.PI / 2; //spread of total 3 rays
    this.rays = [];
    this.readings = [];//stores the point of intersection of rays with border, if one exists else null
  }
  update(roadBorders) {
    this.#castRay();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++)
      this.readings.push(this.#getReadings(this.rays[i], roadBorders));
  }

  #getReadings(ray, roadBorder) {
    let curTouch = null;
    let curOffset = Infinity;
    for (let i = 0; i < roadBorder.length; i++) {
      const touch = intersection(
        ray[0],
        ray[1],
        roadBorder[i][0],
        roadBorder[i][1]
      );
      if (touch) {
        if (curOffset > touch.offset) {
          curTouch = { x: touch.x, y: touch.y };
          curOffset = touch.offset;
        }
      }
    }
    return curTouch;
  }
  #castRay() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.rayWidth / 2,
        -this.rayWidth / 2,
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
      ); //modified so that rayCount 1 also works
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(this.car.angle + rayAngle) * this.length,
        y: this.car.y - Math.cos(this.car.angle + rayAngle) * this.length,
      };
      this.rays.push([start, end]);
    }
  }
  draw(ctx) {
    ctx.lineWidth = 2;
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) end = this.readings[i];
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);

      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);

      ctx.stroke();
    }
  }
}
