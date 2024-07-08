const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circleArr = [];

const colors = ["#03A696", "#F2921D", "#D9D0C5", "#A69586", "#F26430"];

const mouse = { x: undefined, y: undefined };

class Circle {
  constructor({ position, velocity, color, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = radius;
    this.minRadius = radius;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  animateCircles = () => {
    if (
      this.position.y + this.radius >= canvas.height ||
      this.position.y - this.radius <= 0
    ) {
      this.velocity.y = -this.velocity.y;
    }
    if (
      this.position.x + this.radius >= canvas.width ||
      this.position.x - this.radius <= 0
    ) {
      this.velocity.x = -this.velocity.x;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // interativity
    if (
      mouse.x - this.position.x < 50 &&
      mouse.x - (this.position.x - this.radius) > -50 &&
      mouse.y - this.position.y < 50 &&
      mouse.y - (this.position.y - this.radius) > -50 &&
      this.radius < 60
    ) {
      if (this.radius < 60) this.radius += 1;
    } else if (this.radius > this.minRadius) {
      this.radius -= 2;
    }
    this.draw();
  };
}

const init = () => {
  circleArr = [];
  for (let i = 0; i < 1200; i++) {
    const radius = Math.random() * 8 + 2;
    const position = {
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: Math.random() * (canvas.height - radius * 2) + radius,
    };
    const velocity = {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
    };

    const color = colors[Math.floor(Math.random() * colors.length)];

    const circle = new Circle({ position, velocity, color, radius });
    circleArr.push(circle);
  }
};

window.addEventListener("resize", init);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

init();

const renderLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 1200; i++) {
    circleArr[i].animateCircles();
  }
};

function animate() {
  requestAnimationFrame(animate);
  renderLoop();
}

animate();
