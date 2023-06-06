const canvas =  document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(road.get_lane_center(1),100,30,50,"MASTER");//x,y,width,height
const traffic = [
    new Car(road.get_lane_center(0),150,30,50,"DUMMY",2)
];
function animate(){
    traffic.forEach(traf => {
        traf.update(road.borders,[]);
    });
    car.update(road.borders,traffic);
    canvas.height = window.innerHeight;//by resetting height each time, the previous drawn rectangle also gets cleared
    ctx.save()
    ctx.translate(0,-car.y+canvas.height*0.7);//translate the canvas so that the road moves but not the car, like a drone camera following the car
    road.draw(ctx);
    traffic.forEach(traf => traf.draw(ctx));
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate
 
animate();