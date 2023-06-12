const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1;
const cars = generate_cars(N); //x,y,width,height
let traffic = [
  new Car(road.get_lane_center(1), 0, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.get_lane_center(0), -200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.get_lane_center(2), -200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.get_lane_center(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.get_lane_center(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.get_lane_center(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.get_lane_center(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

const max_traffic_Cars = 7;

function generate_cars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++)
    cars.push(new Car(road.get_lane_center(1), 100, 30, 50, "AI"));
  return cars;
}
let bestCar = cars[0];
if (localStorage.getItem("Brain")) {
  cars.forEach((car,i)=> {
    car.brain = JSON.parse(localStorage.getItem("Brain"));
    if(i!=0)
    NeuralNetwrok.mutate(car.brain,0.15);
  });
}
//The request animation frame also gives the time as parameter

function save() {
  localStorage.setItem("Brain", JSON.stringify(bestCar.brain));
}
console.log(bestCar.brain);

function discard() {
  localStorage.removeItem("Brain");
}

function animate(time) {
  
  traffic = traffic.filter((traf) => traf.y < bestCar.y+400);
  while (traffic.length < max_traffic_Cars) {
    let i = 200;
    // Generate new traffic car
    const laneIndex = Math.floor(Math.random() * road.laneCount); // Random lane index
    const laneCenter = road.get_lane_center(laneIndex);
    const mainCar = bestCar; // Assuming the main car is at index 0
    const newTrafficCar = new Car(
      laneCenter,
      mainCar.y - carCanvas.height -i, // Start above the main car, adjust the value as needed
      30,
      50,
      "DUMMY",
      2,
      getRandomColor()
    );
    // console.log(newTrafficCar)
    traffic.push(newTrafficCar);
    i+=400;
  }
  traffic.forEach((traf) => {
    traf.update(road.borders, []);
    // console.log(traf.y);
  });

  cars.forEach((car) => car.update(road.borders, traffic));

  const maxHt = cars.reduce((minn, cur) => Math.min(cur.y, minn), Infinity);
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
