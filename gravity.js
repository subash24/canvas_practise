const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const gravity = 0.7;
const friction = 0.6;
const maxRadius = 100;
let mouseHold = false;
let mousePosition = { x: undefined, y: undefined };

const colors = [
  "#026E81",
  "#00ABBD",
  "#0099DD",
  "#FF9933",
  "#A1C7E0",
  "#D4A1DB",
  "#FBAB86",
  "#FA6658",
  "#C5CFC7",
  "#D081F4",
];

const getColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

class Shape {
  constructor({ position, velocity, radius, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = radius;
  }

  draw() {
    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  update() {
    // Gravity is accelerating acting downward or acceleration in y axis. The position of the shape will be changing with respect to velocity in either direction.
    // But once the object hits the ground it loses some energy and stay onto the ground till some force is excerted in the opposite direction.
    const shouldGrow =
      this.radius <= maxRadius &&
      mousePosition.y === this.position.y &&
      mouseHold;

    if (shouldGrow) {
      this.radius += 2;
      this.draw();
      return;
    }

    if (this.position.y + this.velocity.y + this.radius + 2 >= canvas.height) {
      this.velocity.y = -this.velocity.y * friction;
    } else {
      this.velocity.y += gravity;
    }

    this.position.y += this.velocity.y;

    this.draw();
  }
}

let ballArr = [];

addEventListener("mousedown", () => {
  mouseHold = true;

  ballArr.push(
    new Shape({
      position: {
        x: mousePosition.x,
        y: mousePosition.y,
      },
      velocity: { x: 0, y: 0 },
      radius: 2,
      color: getColor(),
    })
  );
});

addEventListener("mouseup", () => {
  mouseHold = false;
});

addEventListener("mousemove", (e) => {
  mousePosition = { x: e.clientX, y: e.clientY };
});

const renderLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 12px Monospace";
  ctx.fillText(
    "Tap or hold the mouse button, to emulate gravity.",
    mousePosition.x ?? canvas.width / 2,
    mousePosition.y ?? 100
  );
  ballArr.forEach((ball) => {
    ball.update();
  });
};

function animate() {
  requestAnimationFrame(animate);
  renderLoop();
}

animate();
