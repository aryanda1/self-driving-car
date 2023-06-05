class Sensor{
    constructor(car){
         this.car = car;
         this.length = 100;
         this.rayCount = 6;
         this.rayWidth = Math.PI/4;//spread of total 3 rays
         this.rays = [];
    }
    update(){
        this.rays = [];
        for(let i = 0; i < this.rayCount; i++){
            const rayAngle = lerp(this.rayWidth/2, -this.rayWidth/2,
                            this.rayCount==1?0.5:i/(this.rayCount-1));//modified so that rayCount 1 also works
            const start = {x: this.car.x, y: this.car.y};
            const end = {x: this.car.x - Math.sin(this.car.angle + rayAngle) * this.length, y: this.car.y - Math.cos(this.car.angle + rayAngle) * this.length};
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        ctx.lineWidth = 2;
        ctx.strokeStyle = "yellow";
        for(let i = 0; i < this.rayCount; i++){
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}