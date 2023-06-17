const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const scoreCanvas = document.getElementById("scoreCanvas");
scoreCanvas.width = 170;
scoreCanvas.height = 200;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const scoreCtx = scoreCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const score = new Counter();

const N = 1;
let cars = [],
  traffic = [],
  bestCar;
const max_traffic_Cars = 7;
let countofUndamaged = N;
let maxScore = 0.0;
function init() {
  cars = generate_cars(N); //x,y,width,height
  traffic = [
    new Car(road.get_lane_center(1), 0, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.get_lane_center(0), -200, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.get_lane_center(2), -200, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.get_lane_center(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.get_lane_center(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.get_lane_center(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.get_lane_center(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  ];

  function generate_cars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++)
      cars.push(new Car(road.get_lane_center(1), 100, 30, 50, "AI"));
    return cars;
  }
  bestCar = cars[0];
  if (localStorage.getItem("Brain")) {
    cars.forEach((car, i) => {
      car.brain = JSON.parse(localStorage.getItem("Brain"));
      if (i != 0) NeuralNetwrok.mutate(car.brain, 0.1);
    });
  }
  if (localStorage.getItem("maxScore")) {
    maxScore = Number(localStorage.getItem("maxScore"));
  }
}

init();
//The request animation frame also gives the time as parameter

function savehighScore() {
  localStorage.setItem("maxScore", maxScore);
}

function save() {
  localStorage.setItem("Brain", JSON.stringify(bestCar.brain));
}
console.log(bestCar.brain);

function discard() {
  localStorage.removeItem("Brain");
}
let flag = 1;
let firstTIme = 1;
let animationId = 1;
const scale = 0.0762 / 250;

function animate(time) {
  traffic = traffic.filter((traf) => traf.y < bestCar.y + 400);
  while (traffic.length < max_traffic_Cars) {
    let i = 200;
    // Generate new traffic car
    const laneIndex = Math.floor(Math.random() * road.laneCount); // Random lane index
    const laneCenter = road.get_lane_center(laneIndex);
    const mainCar = bestCar; // Assuming the main car is at index 0
    const newTrafficCar = new Car(
      laneCenter,
      mainCar.y - carCanvas.height - i, // Start above the main car, adjust the value as needed
      30,
      50,
      "DUMMY",
      2,
      getRandomColor()
    );
    // console.log(newTrafficCar)
    traffic.push(newTrafficCar);
    i += 400;
  }
  traffic.forEach((traf) => {
    traf.update(road.borders, []);
    // console.log(traf.y);
  });

  cars.forEach((car) => car.update(road.borders, traffic));
  countofUndamaged = cars.reduce((cnt, cur) => cnt + !cur.damaged, 0);
  if (countofUndamaged == 0) pauseAnimation("Reset");

  const maxHt = cars.reduce((minn, cur) => Math.min(cur.y, minn), Infinity);
  bestCar = cars.find((car) => car.y == maxHt);

  carCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
  networkCanvas.height = window.innerHeight; //by resetting height each time, the previous drawn rectangle also gets cleared
  scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

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
  const distance = round(scale * (-bestCar.y + 100), 2);
  if (distance > maxScore) {
    savehighScore();
    maxScore = distance;
  }
  score.draw(scoreCtx, distance, maxScore);
  if (flag) return;
  if (firstTIme == 0) animationId = requestAnimationFrame(animate);
}
// setInterval(animate,1000/60);//can use setInterval or requestAnimationFrame to animate

animate();
firstTIme = 0;
function startAnimation() {
  flag = false;
  overlay.style.display = "none";
  animate();
}

function pauseAnimation(type = "") {
  flag = true;
  overlay.style.display = "flex";
  mediaTitle.textContent = type ? "LOST" : "PAUSED";
  mediaMessage.textContent = type
    ? "Press R to restart"
    : "Press Enter to Resume or R for restart";
}

function reset() {
  // flag = 1;
  cancelAnimationFrame(animationId);
  overlay.style.display = "none";
  init();
  flag = false;
  animate();
}

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && countofUndamaged) {
    mediaTitle.textContent = "PAUSED";
    mediaMessage.textContent = "Press Enter to Resume or R for restart";
    if (!flag) pauseAnimation();
    else startAnimation();
  }
  if (e.key == "r" && mediaTitle.textContent != "START") reset();
});
