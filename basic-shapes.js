const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

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
  ctx.beginPath();
  ctx.fillStyle = "cyan";
  ctx.arc(800, 300, 100, 0, 1 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "grey";
  ctx.strokeRect(200, 400, 80, 100);
};

const renderLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasicShapes();

  ctx.save();
  ctx.translate(200, 100);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "lime";
  ctx.fillRect(500, 100, 80, 80);
  ctx.restore();
};

function animate() {
  requestAnimationFrame(animate);
  renderLoop();
}

animate();
