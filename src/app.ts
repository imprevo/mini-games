import * as Phaser from 'phaser';

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const WIDTH = 800;
const HEIGHT = 600;

type GameObjectWithPhysics = Phaser.GameObjects.Shape & {
  body: Phaser.Physics.Arcade.Body;
};

export class PongScene extends Phaser.Scene {
  player1: GameObjectWithPhysics;
  player2: GameObjectWithPhysics;
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
      40,
      HEIGHT / 2,
      20,
      100,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player1);

    this.player2 = this.add.rectangle(
      WIDTH - 40,
      HEIGHT / 2,
      20,
      100,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player2);

    this.ball = this.add.circle(
      -100,
      -100,
      10,
      0xff0000
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.ball);
  }

  update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
    const player1Body = this.player1.body;
    const player2Body = this.player2.body;
    const ballBody = this.ball.body;

    if (cursorKeys.up.isDown) {
      player1Body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      player1Body.setVelocityY(500);
    } else {
      player1Body.setVelocityY(0);
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
        if (
          this.physics.overlap(this.ball, this.player1) ||
          this.physics.overlap(this.ball, this.player2)
        ) {
          ballBody.setVelocityX(ballBody.velocity.x * -1);
        }
        if (ballBody.y > HEIGHT - ballBody.height || ballBody.y < 0) {
          ballBody.setVelocityY(ballBody.velocity.y * -1);
        }
      }
    } else if (cursorKeys.space.isDown) {
      this.isStart = true;
      ballBody.setVelocity(200, 200);
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
