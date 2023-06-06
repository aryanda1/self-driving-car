class NeuralNetwrok {
  constructor(neuralCounts) {
    this.levels = new Array(neuralCounts.length - 1);
    for (let i = 1; i < neuralCounts.length; i++)
      this.levels[i - 1] = new Level(neuralCounts[i - 1], neuralCounts[i]);
  }
  static feedForward(givenInputs, network) {
    let output = Level.feedForward(givenInputs, network.levels[0]);
    // console.log("t");
    for (let i = 1; i < network.levels.length; i++) {
      output = Level.feedForward(output, network.levels[i]);
    }
    return output;
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);
    this.weights = new Array(inputCount);
    for (let i = 0; i < inputCount; i++)
      this.weights[i] = new Array(outputCount);
    Level.#randomize(this);
  }
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++)
        level.weights[i][j] = Math.random() * 2 - 1;
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++)
        sum += givenInputs[j] * level.weights[j][i];
      if (sum + level.biases[i] > 0) level.outputs[i] = 1;
      else level.outputs[i] = 0;
    }
    return level.outputs;
  }
}