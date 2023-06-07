const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.get_lane_center(1), 100, 30, 50, "AI"); //x,y,width,height
const traffic = [new Car(road.get_lane_center(1), 0, 30, 50, "DUMMY", 2)];

//The request animation frame also gives the time as parameter
function animate(time) {
  traffic.forEach((traf) => {
    traf.update(road.borders, []);
  });
  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
  networkCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7); //translate the canvas so that the road moves but not the car, like a drone camera following the car
  road.draw(carCtx);
  traffic.forEach((traf) => traf.draw(carCtx));
  car.draw(carCtx);

  carCtx.restore();
  networkCtx.lineDashOffset = -time/50;
  Visualizer.drawNetwrok(networkCtx, car.brain);
  requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate

animate();
