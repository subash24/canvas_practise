const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const keyUpCodes = ["a", "d", "space"];
const keyDownCodes = ["a", "d"];
let boxArr = [];
let circle = {};

let isGameOver = false;
let gameWon = false;
let showWinRule = true;

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Refer this if you get confused https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
const isRectCircleColliding = (rect, circle) => {
  let distX = Math.abs(circle.x - rect.x - rect.width / 2);
  let distY = Math.abs(circle.y - rect.y - rect.height / 2);

  // if the distance is greater than half circle + half rectangle they are too far.
  if (distX > rect.width / 2 + circle.radius) return false;
  if (distY > rect.height / 2 + circle.radius) return false;

  // if the distance is less than half rectangle, they are colliding
  if (distX < rect.width / 2) return true;
  if (distY < rect.height / 2) return true;

  let dx = distX - rect.width / 2;
  let dy = distY - rect.height / 2;

  // using pythagoras we can calculate the distance between circle and rect corners (adj^2 + opp^2 = hyp^2)
  return dx * dx + dy * dy <= circle.radius * circle.radius;
};

class Board {
  constructor({ x, y, dx = 0, width, height }) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.speed = 6;
    this.width = width;
    this.height = height;
    this.keys = { a: false, d: false, space: false };
    this.ball = {};
    this.reset();
  }

  reset() {
    this.ball.x = this.x + this.width / 2;
    this.ball.y = this.y;
    this.ball.radius = 20;
    this.ball.isCollided = false;
    this.ball.dy = 0;
    this.ball.dx = 0;
    this.ball.color = "#FDB813";
    this.ball.lastX = 0;
    this.keys.space = false;
  }

  draw() {
    // Drawing the platform mover
    ctx.fillStyle = "#227081";
    ctx.strokeStyle = "	#5c5c5c";
    ctx.lineWidth = 2;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Drawing the ball in the mover
    ctx.beginPath();
    ctx.fillStyle = this.ball.color;
    ctx.strokeStyle = "#ff4d00";
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    // Drawing the target circle
    ctx.beginPath();
    ctx.fillStyle = circle.color;
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y = canvas.height - this.height;
    this.x += this.dx;
    this.ball.y += this.ball.dy;

    if (
      this.ball.y - this.ball.radius > canvas.height ||
      this.ball.y + this.ball.radius < 0
    ) {
      isGameOver = true;
    }

    if (this.keys.space && !this.ball.isCollided) {
      this.ball.dy = -9;
      showWinRule = false;
    } else if (!this.ball.isCollided) {
      this.ball.x = this.lastX ? this.lastX + this.x : this.x + this.width / 2;
      this.ball.y = this.y - this.ball.radius;
    }

    if (this.ball.y + this.ball.radius >= board.y && this.ball.isCollided) {
      if (
        this.ball.x + this.ball.radius >= this.x &&
        this.ball.x - this.ball.radius <= this.x + this.width
      ) {
        this.ball.dy = 0;
        this.ball.isCollided = false;
        this.lastX = this.ball.x - this.x;
      }
    }

    const distance = getDistance(circle.x, circle.y, this.ball.x, this.ball.y);
    if (distance - circle.radius * 2 + this.ball.radius <= 0) {
      circle.color = "#ff4d00";
      circle.dx = 0;
      this.ball.dy = 0;
      gameWon = true;
      ctx.fillStyle = "#ffefd5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#161751";
      ctx.font = "24px Monospace";
      ctx.fillText(
        "You dispelled the darkness and ",
        canvas.width / 2 - 220,
        canvas.height / 2 - 12
      );
      ctx.fillText(
        "brought light into the world.",
        canvas.width / 2 - 220,
        canvas.height / 2 + 18
      );
    }

    board.dx = 0;
    if (board.keys.a && this.x > 0) {
      board.dx = -board.speed;
    } else if (board.keys.d && this.x + this.width < canvas.width) {
      board.dx = board.speed;
    }

    this.draw();
  }
}

const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameWon = false;
  isGameOver = false;
  showWinRule = true;
  boxArr = [];

  const width = canvas.width / 10;
  const height = 40;
  let posX = 0;
  let posY = 100;

  for (let i = 0; i < 20; i++) {
    if (posX >= canvas.width) {
      posX = 0;
      posY += height;
    }
    boxArr.push({ x: posX, y: posY, width, height });
    posX += width;
  }

  circle = {
    x: 50,
    y: 50,
    radius: 40,
    dx: 4,
    color: "#F6F1D5",
    collidedBricks: 0,
  };
};

const board = new Board({ x: 10, y: 400, width: 200, height: 30 });

const drawBricks = () => {
  ctx.fillStyle = "#8a7f8d";
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 2;

  boxArr.forEach((box, i) => {
    if (!box) return;
    if (isRectCircleColliding(box, board.ball) && !board.ball.isCollided) {
      board.ball.dy = -board.ball.dy;
      board.ball.isCollided = true;
      board.keys.space = false;
      boxArr[i] = null;
      circle.collidedBricks++;
    } else {
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    }
  });

  circle.x += circle.dx * Math.min(circle.collidedBricks, 5);

  if (
    circle.x - circle.radius < 0 ||
    circle.x + circle.radius >= canvas.width
  ) {
    circle.dx = -circle.dx;
  }
};

const runLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#161751";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (showWinRule) {
    ctx.fillStyle = "#F6F1D5";
    ctx.font = "24px Monospace";
    ctx.fillText(
      "Hit the Moon and bring sunrise to the world.",
      canvas.width / 2 - 286,
      canvas.height / 2 - 12
    );
  }

  if (gameWon) {
    gameWon = false;
    if (confirm("You won")) {
      isGameOver = true;
    } else {
      isGameOver = true;
    }
  }

  if (isGameOver) {
    isGameOver = false;
    init();
    board.reset();
  } else {
    drawBricks();
    board.update();
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  runLoop();
};

addEventListener("resize", init);

addEventListener("keydown", (e) => {
  const key = e.key === " " ? "space" : e.key;
  if (!keyUpCodes.includes(key)) return;
  board.keys[key] = true;
});

addEventListener("keyup", (e) => {
  const key = e.key === " " ? "space" : e.key;
  if (!keyDownCodes.includes(key)) return;
  board.keys[key] = false;
});

init();

animate();
