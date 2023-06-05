class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x; //centre x of the road
    this.width = width; // width of the road
    this.laneCount = laneCount;

    const infinity = 10000000;//setting a much larger value will makes the dashed lanes diappear
    this.top = -infinity;
    this.bottom = infinity;
    this.left = x - width / 2;
    this.right = x + width / 2;
  }
  draw(ctx) {
    ctx.lineWidth = 5; //width of the road
    ctx.strokeStyle = "white"; //color of the road

    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount); //get x position of current lane
      if (i > 0 && i < this.laneCount)
        ctx.setLineDash([40, 10]); //draw dashed lines for lanes
      else ctx.setLineDash([]); //draw solid lines for edges
      
  
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }

  //get the x position of the center of the particular lane
  get_lane_center(laneIdx){
    laneIdx = Math.max(0,Math.min(this.laneCount-1,laneIdx));
    const laneWidth = this.width / this.laneCount;
    return laneWidth/2 +  lerp(this.left, this.right, laneIdx / this.laneCount);
  }
}