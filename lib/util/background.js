const DEFAULTS = {
  POS_X: 0,
  POS_Y: 0,
  WIDTH: 1900,
  HEIGHT: 400,
  SPEED: -1.5
};

class Background {
  constructor(loader) {
    this.posX = DEFAULTS.POS_X;
    this.posY = DEFAULTS.POS_Y;
    this.width = DEFAULTS.WIDTH;
    this.height = DEFAULTS.HEIGHT;
    this.speed = DEFAULTS.SPEED;
    this.loader = loader;
  }

  draw(ctx) {
    const image = this.loader.getResult('background');
    ctx.drawImage(image, this.posX, this.posY, this.width, this.height);
    this.move();
  }

  move() {
    this.posX += this.speed;
  }
}

module.exports = Background;
