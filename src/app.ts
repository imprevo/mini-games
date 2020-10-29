import * as Phaser from 'phaser';

const WIDTH = 800;
const HEIGHT = 600;
const BALL_SPEED = 200;
const BALL_SPEED_RATE = 1.15;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));
const increaseBallSpeed = (speed: number) => Math.abs(speed * BALL_SPEED_RATE);

type GameObjectWithPhysics = Phaser.GameObjects.Shape & {
  body: Phaser.Physics.Arcade.Body;
};

type PlayerKeys = Record<'up' | 'down' | 'start', Phaser.Input.Keyboard.Key>;

export class PongScene extends Phaser.Scene {
  player1: GameObjectWithPhysics;
  player1Keys: PlayerKeys;

  player2: GameObjectWithPhysics;
  player2Keys: PlayerKeys;

  ball: GameObjectWithPhysics;

  isStart = false;
  side = 1;

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Game',
    });
  }

  create() {
    this.player1 = this.add.rectangle(
      20,
      HEIGHT / 2,
      20,
      100,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player1);
    this.player1Keys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      start: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.player2 = this.add.rectangle(
      WIDTH - 20,
      HEIGHT / 2,
      20,
      100,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player2);
    this.player2Keys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      start: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.ball = this.add.circle(
      -100,
      -100,
      10,
      0xff0000
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.ball);
  }

  update() {
    const player1Body = this.player1.body;
    const player2Body = this.player2.body;
    const ballBody = this.ball.body;

    if (this.player1Keys.up.isDown) {
      player1Body.setVelocityY(-500);
    } else if (this.player1Keys.down.isDown) {
      player1Body.setVelocityY(500);
    } else {
      player1Body.setVelocityY(0);
    }

    if (this.player2Keys.up.isDown) {
      player2Body.setVelocityY(-500);
    } else if (this.player2Keys.down.isDown) {
      player2Body.setVelocityY(500);
    } else {
      player2Body.setVelocityY(0);
    }

    player1Body.y = clamp(player1Body.y, 0, HEIGHT - player1Body.height);
    player2Body.y = clamp(player2Body.y, 0, HEIGHT - player2Body.height);

    if (this.isStart) {
      if (ballBody.x < 0) {
        this.isStart = false;
        this.side = 1;
      } else if (ballBody.x > WIDTH - ballBody.width) {
        this.isStart = false;
        this.side = 2;
      } else {
        if (this.physics.overlap(this.ball, this.player1)) {
          ballBody.setVelocityX(increaseBallSpeed(ballBody.velocity.x));
        }
        if (this.physics.overlap(this.ball, this.player2)) {
          ballBody.setVelocityX(-increaseBallSpeed(ballBody.velocity.x));
        }
        if (ballBody.y > HEIGHT - ballBody.height || ballBody.y < 0) {
          ballBody.setVelocityY(ballBody.velocity.y * -1);
        }
      }
    } else if (this.side == 1 && this.player1Keys.start.isDown) {
      this.isStart = true;
      ballBody.setVelocity(BALL_SPEED, BALL_SPEED);
    } else if (this.side == 2 && this.player2Keys.start.isDown) {
      this.isStart = true;
      ballBody.setVelocity(-BALL_SPEED, BALL_SPEED);
    } else {
      if (this.side == 1) {
        ballBody.x = player1Body.x + player1Body.width;
        ballBody.y = player1Body.y + (player1Body.height - ballBody.height) / 2;
      } else {
        ballBody.x = player2Body.x - ballBody.width;
        ballBody.y = player2Body.y + (player2Body.height - ballBody.height) / 2;
      }
    }
  }
}

export const game = new Phaser.Game({
  title: 'Sample',
  type: Phaser.AUTO,
  scale: {
    width: WIDTH,
    height: HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  backgroundColor: '#000000',
  scene: PongScene,
});
