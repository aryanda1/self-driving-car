class Road{
    constructor(x,width,laneCount=3){
        this.x = x; //centre x of the road
        this.width = width; // width of the road
        this.laneCount = laneCount;

        const infinity = 1000000000;
        this.top = -infinity;
        this.bottom = infinity;
        this.left = x-width/2;
        this.right = x+width/2;
    }
    draw(ctx){
        ctx.lineWidth = 5;//width of the road
        ctx.strokeStyle = 'white';//color of the road

        //draw border of road
        ctx.beginPath();
        ctx.moveTo(this.left,this.top);
        ctx.lineTo(this.left,this.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.right,this.top);
        ctx.lineTo(this.right,this.bottom);
        ctx.stroke();
    }
}