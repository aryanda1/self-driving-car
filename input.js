const carHeght = document.getElementById("height");
const carWidth = document.getElementById("width");
const carMaxSpeed = document.getElementById("maxSpeed");

const networkAlpha = document.getElementById("alpha");
const networkIntermediates = document.getElementById("intermediates");

const roadLanes = document.getElementById("lanes");

const sensorLength = document.getElementById("sensorLength");
const sensorRays = document.getElementById("sensorRays");
const sensorSpread = document.getElementById("sensorSpread");

function loadValuesFromJson(file) {
  fetch("best_config.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // Do something with the loaded JSON data
      console.log(document.getElementById("height"));
      document.getElementById("height").value = jsonData.car.height;
      document.getElementById("width").value = jsonData.car.width;
      document.getElementById("maxSpeed").value = jsonData.car.maxSpeed;

      document.getElementById("intermediates").value =
        jsonData.network.intermediate_neurons;

      document.getElementById("lanes").value = jsonData.road.laneCount;

      document.getElementById("sensorLength").value = jsonData.sensor.length;
      document.getElementById("sensorRays").value = jsonData.sensor.rayCount;
      document.getElementById("sensorSpread").value = jsonData.sensor.raySpread;

      document.getElementById("carCanvasWidth").value = 200;

      document.getElementById("networkCanvasWidth").value = 300;
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch
      console.error("Error:", error);
    });
  // Assign values from JSON to form fields
}

function handleBestConfigChange() {
  const bestConfigCheckbox = document.getElementById("bestConfig");
  const form = document.querySelector("form");
  if (bestConfigCheckbox.checked) {
    loadValuesFromJson();
  } else {
    form.reset();
  }
}

function handleBestBrain() {
  const bestBrainCheckbox = document.getElementById("bestBrain");
  const form = document.querySelector("form");
  if (bestBrainCheckbox.checked) {
    loadValuesFromJson();
  } else {
    form.reset();
  }
  networkIntermediates.disabled = bestBrainCheckbox.checked;
  sensorRays.disabled = bestBrainCheckbox.checked;
}
function submitHandler(e) {
  e.preventDefault();
  console.log("submit");
  try {
    localStorage.setItem(
      "carHeight",
      JSON.stringify(Number(document.getElementById("height").value))
    );
    localStorage.setItem(
      "carWidth",
      JSON.stringify(Number(document.getElementById("width").value))
    );
    localStorage.setItem(
      "carMaxSpeed",
      JSON.stringify(Number(document.getElementById("maxSpeed").value))
    );
    localStorage.setItem(
      "carType",
      JSON.stringify(document.getElementById("carType").value)
    );
    localStorage.setItem(
      "alpha",
      JSON.stringify(Number(document.getElementById("alpha").value))
    );
    localStorage.setItem(
      "intermediates",
      JSON.stringify(document.getElementById("intermediates").value)
    );
    localStorage.setItem(
      "lanes",
      JSON.stringify(Number(document.getElementById("lanes").value))
    );
    localStorage.setItem(
      "sensorLength",
      JSON.stringify(Number(document.getElementById("sensorLength").value))
    );
    localStorage.setItem(
      "sensorRays",
      JSON.stringify(Number(document.getElementById("sensorRays").value))
    );
    localStorage.setItem(
      "sensorSpread",
      JSON.stringify(Number(document.getElementById("sensorSpread").value))
    );
    localStorage.setItem(
      "carCanvasWidth",
      JSON.stringify(Number(document.getElementById("carCanvasWidth").value))
    );
    localStorage.setItem(
      "networkCanvasWidth",
      JSON.stringify(
        Number(document.getElementById("networkCanvasWidth").value)
      )
    );
    localStorage.setItem(
      "bestBrain",
      JSON.stringify(document.getElementById("bestBrain").checked)
    );
    localStorage.setItem(
      "numberCars",
      JSON.stringify(Number(document.getElementById("numberCars").value))
    );
    localStorage.setItem(
      "carColor",
      JSON.stringify(document.getElementById("carColor").value)
    );

    switchBackToCanvas(getInputsFromLocal());
  } catch (error) {
    console.error("Error:", error);
  }
}

function getInputsFromLocal() {
  const localStorageVars = [
    "numberCars",
    "alpha",
    "sensorSpread",
    "intermediates",
    "carType",
    "lanes",
    "networkCanvasWidth",
    "sensorLength",
    "sensorRays",
    "carCanvasWidth",
    "bestBrain",
    "carHeight",
    "carWidth",
    "carMaxSpeed",
    "carColor",
  ];

  for (let i = 0; i < localStorageVars.length; i++)
    if (localStorage.getItem(localStorageVars[i]) === null) {
      return -1;
    }

  const obj = localStorageVars.reduce((acc, key) => {
    acc[key] = JSON.parse(localStorage.getItem(key)); // Get value from localStorage
    return acc;
  }, {});

  return obj;
}

//different colors hue value so that they can be excluded for traffic
const colors = {
  red: 0,
  green: 120,
  blue: 240,
  yellow: 60,
  orange: 30,
  purple: 300,
  pink: 330,
  brown: 30,
};
