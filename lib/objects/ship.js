const Util = require("../util/util");
const Blaster = require ('./blaster');
const MovableObject = require('./movable_object');

const DEFAULTS = {
  DIM: 100,
  RADIUS: 30,
  VELOCITY: [0, 0],
  TERMINAL_VEL: 6,
  PATH: 'assets/sprites/falcon',
  ACCEL_RATE: -.5,
  BLASTER_VEL: [10, 0]
};

class Ship extends MovableObject {
  constructor(options = {}) {
    options.xDim = DEFAULTS.DIM;
    options.yDim = DEFAULTS.DIM;
    options.radius = DEFAULTS.RADIUS;
    options.vel = options.vel || DEFAULTS.VELOCITY;
    const falcNum = Util.calcFalcNum(options.vel[1]);
    options.path = DEFAULTS.PATH + `${falcNum}b.png`;
    super(options);
    this.blaster = new Audio('./assets/sounds/blaster.mp3');
    this.accel = false;
    this.rot = 0;
    this.blasters = 1;
    this.gravityInterval = window.setInterval(this.gravity.bind(this), 50);
    this.accelerateInterval = window.setInterval(this.accelerate.bind(this));
  }

  accelerate() {
    if (this.accel && this.vel[1] > -DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += DEFAULTS.ACCEL_RATE;
      const falcNum = Util.calcFalcNum(this.vel[1]);
      this.path = DEFAULTS.PATH + `${falcNum}b.png`;
    }
  }

  gravity() {
    if (this.vel[1] < DEFAULTS.TERMINAL_VEL) {
      this.vel[1] += 1.5;
      const falcNum = Util.calcFalcNum(this.vel[1]);
      this.path = DEFAULTS.PATH + `${falcNum}b.png`;
    }
  }

  shoot() {
    if (this.blasters > 0) {
      this.blasters--;
      this.blaster.play();
      const blaster = new Blaster({
        pos: this.pos.slice(),
        vel: DEFAULTS.BLASTER_VEL,
        color: 'red',
        game: this.game
      });

      this.game.add(blaster);
      return;
    } else {
      return;
    }
  }
}

module.exports = Ship;