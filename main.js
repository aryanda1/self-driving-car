const canvas =  document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car(100,100,30,50);//x,y,width,height

function animate(){
    car.update();
    canvas.height = window.innerHeight;//by resetting height each time, the previous drawn rectangle also gets cleared
    car.draw(ctx);
    requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate
 
animate();