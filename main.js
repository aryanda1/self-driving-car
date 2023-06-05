const canvas =  document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width*0.9);
const car = new Car(road.get_lane_center(3),100,30,50);//x,y,width,height
function animate(){
    car.update();
    canvas.height = window.innerHeight;//by resetting height each time, the previous drawn rectangle also gets cleared
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate
 
animate();