const carCanvas =  document.getElementById("carCanvas");
carCanvas.width = 200;

const ctx = carCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const car = new Car(road.get_lane_center(1),100,30,50,"AI");//x,y,width,height
const traffic = [
    new Car(road.get_lane_center(1),30,30,50,"DUMMY",2)
];
function animate(){
    traffic.forEach(traf => {
        traf.update(road.borders,[]);
    });
    car.update(road.borders,traffic);
    carCanvas.height = window.innerHeight;//by resetting height each time, the previous drawn rectangle also gets cleared
    ctx.save()
    ctx.translate(0,-car.y+carCanvas.height*0.7);//translate the canvas so that the road moves but not the car, like a drone camera following the car
    road.draw(ctx);
    traffic.forEach(traf => traf.draw(ctx));
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate
 
animate();