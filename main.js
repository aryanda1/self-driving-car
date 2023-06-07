const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generate_cars(N); //x,y,width,height
const traffic = [new Car(road.get_lane_center(1), 0, 30, 50, "DUMMY", 2)];

function generate_cars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++)
    cars.push(new Car(road.get_lane_center(1), 100, 30, 50, "AI"));
  return cars;
}
let bestCar = cars[0];
//The request animation frame also gives the time as parameter
function animate(time) {
  traffic.forEach((traf) => {
    traf.update(road.borders, []);
  });
  cars.forEach((car) => car.update(road.borders, traffic));
  const maxHt = cars.reduce((minn, cur) => Math.min(cur.y, minn), Infinity);
  //   console.log(maxHt);
  bestCar = cars.find((car) => car.y == maxHt);
  carCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
  networkCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); //translate the canvas so that the road moves but not the car, like a drone camera following the car
  road.draw(carCtx);
  traffic.forEach((traf) => traf.draw(carCtx));
  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => car.draw(carCtx, car == bestCar));

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwrok(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate

animate();
