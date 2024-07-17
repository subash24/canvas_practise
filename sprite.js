import { adventurerStates } from "./states.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const getSpriteCoord = (current, max) => {
  const row = Math.floor(current / max);
  const col = Math.floor(current - max * row);
  return { row, col };
};

let spriteHigh;
class Sprite {
  constructor({ x, y, width, height, imageSrc }) {
    this.x = x;
    this.y = y;
    this.imageSrc = imageSrc;
    this.frameWidth = width;
    this.frameHeight = height;
    this.shiftX = 0;
    this.shiftY = 0;
    this.scale = 1;
    this.totalFramesX = 7;
    this.currentFrameX = 0;
    this.totalFramesY = 11;
    this.currentFrameY = 0;
    this.fps = 60;
    this.frameIndex = 0;
    this.maxFrame = { x: 7, y: 11 };
    this.states = {};
    this.currentState = "idle";
  }

  generateState = (name, { startFrame, endFrame }) => {
    if (this.states[name]) return this.getCurrentState();
    this.states[name] = {
      currentFrame: startFrame,
      startFrame,
      endFrame,
      iterator: 0,
    };
  };

  getCurrentState = (name) => {
    return this.states[name] ?? null;
  };

  draw() {
    ctx.drawImage(
      this.imageSrc,
      this.shiftX,
      this.shiftY,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }

  update() {
    if (this.frameIndex === Math.floor(this.fps / this.maxFrame.x)) {
      const state = this.getCurrentState(this.currentState);
      const { row, col } = getSpriteCoord(state.currentFrame, this.maxFrame.x);
      this.shiftX = this.frameWidth * col;
      this.shiftY = this.frameHeight * row;

      if (state.currentFrame >= state.endFrame) {
        state.currentFrame = state.startFrame;
      } else {
        state.currentFrame++;
      }

      this.frameIndex = 0;
    }
    this.frameIndex++;
    this.draw();
  }
}

const updateFrame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spriteHigh.update();
};

const animate = () => {
  updateFrame();
  requestAnimationFrame(animate);
};

const init = () => {
  spriteHigh = new Sprite({
    x: 400,
    y: 400,
    width: 126,
    height: 93.2,
    imageSrc: adventurerHigh,
  });
  const select = document.createElement("select");
  adventurerStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.name;
    option.textContent = state.name;
    select.appendChild(option);
    spriteHigh.generateState(state.name, {
      startFrame: state.startFrame,
      endFrame: state.endFrame,
      activeRow: state.activeRow,
    });
  });
  select.classList.add("sprite-animation-dropdown");
  select.onchange = (e) => {
    spriteHigh.currentState = e.target.value;
  };
  document.body.appendChild(select);
  animate();
};

addEventListener("resize", init);

init();
