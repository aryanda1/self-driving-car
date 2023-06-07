class Visualizer {
  static drawNetwrok(ctx, netwrok) {
    const margin = 50;
    const top = margin;
    const left = margin;
    const height = ctx.canvas.height - margin * 2;
    const width = ctx.canvas.width - margin * 2;
    Visualizer.drawLevel(ctx, netwrok.levels[0], left, top, width, height);
  }
  static drawLevel(ctx, level, left, top, width, height) {
    const { inputs, outputs, weights, biases } = level;
    const radius = 18;
    
    for (let i = 0; i < inputs.length; i++)
      for (let j = 0; j < outputs.length; j++) {
        const x1 = this.#getNodeX(inputs.length, i, left, left + width);
        const x2 = this.#getNodeX(outputs.length, j, left, left + width);
        const y1 = top + height;
        const y2 = top;
        Visualizer.drawConnection(ctx, x1, y1, x2, y2, getRGBA(weights[i][j]));
      }


    for (let i = 0; i < inputs.length; i++) {
      const x = this.#getNodeX(inputs.length, i, left, left + width);
      Visualizer.drawNode(ctx, x, top + height, radius,getRGBA(inputs[i]));
    }
    for (let i = 0; i < outputs.length; i++) {
      const x = lerp(left, left + width, i / (outputs.length - 1));
      Visualizer.drawNode(ctx, x, top, radius,"black");
      Visualizer.drawNode(ctx, x, top, radius * 0.6,getRGBA(outputs[i]));

      Visualizer.drawNode(ctx, x, top, radius, getRGBA(biases[i]),true);
    }
  }

  static drawConnection(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(left, right, nodes == 1 ? 0.5 : index / (nodes - 1));
  }

  static drawNode(ctx, x, y, radius, color,dash=null) {
    ctx.beginPath();
    if (dash) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else 
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (dash) ctx.stroke();
    else ctx.fill();
    ctx.closePath();
  }
}
