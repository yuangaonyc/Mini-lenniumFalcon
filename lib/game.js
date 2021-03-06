const Asteroid = require('./objects/asteroid');
const Ship = require('./objects/ship');
const Blaster = require('./objects/blaster');
const PowerUp = require('./objects/power_up');
const Background = require('./util/background');
const Util = require('./util/util');
const $jo = require('./../joQuery/lib/main');

class Game {
  constructor(loader) {
    this.explosion = new Audio('./assets/sounds/explosion1.mp3');
    this.hanSounds = [
      new Audio('./assets/sounds/han0.mp3'),
      new Audio('./assets/sounds/han1.mp3'),
      new Audio('./assets/sounds/han2.mp3'),
      new Audio('./assets/sounds/han3.mp3'),
      new Audio('./assets/sounds/han4.mp3'),
      new Audio('./assets/sounds/han5.mp3')
    ];
    this.loader = loader;
    this.backgrounds = [];
    this.asteroids = [];
    this.blasters = [];
    this.powerUps = [];
    this.points = 0;
    this.refreshObjects();
    this.playing = false;
    this.lost = false;
  }

  add(object) {
    if (object instanceof Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Ship) {
      this.ship = object;
    } else if (object instanceof Background) {
      this.backgrounds.push(object);
    } else if (object instanceof Blaster) {
      this.blasters.push(object);
    } else if (object instanceof PowerUp) {
      this.powerUps.push(object);
    } else {
      throw "UFO!";
    }
  }

  refreshObjects() {
    this.add(new Asteroid({ game: this, loader: this.loader }));
    this.asteroidInterval = Util.createAsteroidInterval(this, this.loader);
    this.powerUpInterval = Util.createPowerUpInterval(this, this.loader);
  }

  addShip() {
    const ship = new Ship({
      pos: this.shipStartPosition(),
      game: this,
      loader: this.loader
    });
    this.add(ship);
    return ship;
  }

  addBackground() {
    const background = new Background(this.loader);
    this.add(background);
  }

  wrapBackground() {
     if (this.backgrounds[0].posX < -1000 && this.backgrounds.length < 2) {
       const background = new Background(this.loader);
       background.posX = 898;
       this.add(background);
     }
     if (this.backgrounds[0].posX < -1900) {
       this.backgrounds.shift();
     }
   }

  allObjects() {
    return [].concat(
      this.backgrounds,
      [this.ship],
      this.powerUps,
      this.blasters,
      this.asteroids
    );
  }

  draw(ctx) {
    if (this.playing) {
      if (this.explosions) {
        Util.renderExplosions(ctx, this);
      }
      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
      this.allObjects().forEach((object) => {
        if (object) { object.draw(ctx); }
      });
      this.checkCrash();
    }
  }

  moveObjects() {
    this.allObjects().forEach((object) => {
      if (object) { object.move(); }
    });
  }

  checkCollisions() {
    const asteroids = this.asteroids;
    for (let i = 0; i < asteroids.length; i++) {
      if (Util.isCrash(this.ship, asteroids[i])) {
        return true;
      }
    }
    Util.checkBlasterHit(this);
    Util.checkPowerUp(this);
    return false;
  }

  checkOutOfBounds(object) {
    const xPosition = object.pos[0];
    const yPosition = object.pos[1];
    if (object instanceof Ship) {
      return (yPosition < 0 || yPosition > 400);
    } else if (object instanceof Asteroid || object instanceof PowerUp) {
      return (xPosition < 0);
    } else if (object instanceof Blaster) {
      return (xPosition > 900);
    }
  }

  checkCrash() {
    if (this.checkCollisions() || this.checkOutOfBounds(this.ship)) {
      this.lost = true;
      Asteroid.resetSpeed();
      Ship.resetSpeed();
      window.clearInterval(this.asteroidInterval);
      window.clearInterval(this.powerUpInterval);
      window.clearInterval(this.ship.gravityInterval);
      window.clearInterval(this.ship.accelerateInterval);
      this.renderLost();
    }
  }

  renderLost() {
    $jo('.chewy').removeClass('hidden');
    window.setTimeout(() => {
      $jo('.chewy').addClass('hidden');
    }, 2000);
    this.removeAll();
    const $gameModal = $jo('.game-modal');
    $gameModal.removeClass('hidden');
    $gameModal.text("You crashed! Press 'SPACE' to play again");
    this.playing = false;
  }

  asteroidStartPosition() {
    return [Game.DIM_X, Game.DIM_Y * Math.random()];
  }

  shipStartPosition() {
    return [225, Game.DIM_Y / 3];
  }

  remove(object) {
    if (object instanceof Asteroid) {
      this.asteroids.splice(this.asteroids.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ship = undefined;
    } else if (object instanceof Blaster) {
      this.blasters.splice(this.blasters.indexOf(object), 1);
    } else if (object instanceof PowerUp) {
      this.powerUps.splice(this.powerUps.indexOf(object), 1);
    } else {
      throw "UFO!";
    }
  }

  removeAll() {
    this.asteroids = [];
    this.blasters = [];
    this.powerUps = [];
    this.ship = undefined;
    this.backgrounds = [];
  }

  step(delta) {
    if (this.playing) {
      this.wrapBackground();
      this.moveObjects();
      Asteroid.increaseSpeed(this.points);
      Ship.increaseSpeed(this.points);
    }
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 400;

module.exports = Game;
