const drawBasicShapes = () => {
  ctx.fillStyle = "pink";
  ctx.fillRect(400, 100, 50, 100);
  ctx.fillStyle = "red";
  ctx.fillRect(600, 100, 100, 100);
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(300, 200);
  ctx.lineTo(250, 150);
  ctx.lineTo(200, 200);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(500, 300, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};

const renderLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasicShapes();
};

function animate() {
  requestAnimationFrame(animate);
  renderLoop();
}

animate();
