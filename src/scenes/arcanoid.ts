import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from '../config';

const BALL_SPEED = 200;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

type GameObjectWithPhysics = Phaser.GameObjects.Shape & {
  body: Phaser.Physics.Arcade.Body;
};

export class ArcanoidScene extends Phaser.Scene {
  player: GameObjectWithPhysics;
  ball: GameObjectWithPhysics;
  bricks: Phaser.GameObjects.Group;

  isStart = false;

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'ArcanoidGame',
    });
  }

  create() {
    this.player = this.add.rectangle(
      WIDTH / 2,
      HEIGHT - 20,
      100,
      20,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player);
    this.player.body.immovable = true;

    this.ball = this.add.circle(
      -100,
      -100,
      10,
      0xff0000
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.ball);
    this.ball.body.bounce.set(1);

    this.bricks = this.add.group();

    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 5; row++) {
        const brick = this.add.rectangle(
          100 + 150 * col,
          100 + 50 * row,
          100,
          20,
          0xffffff
        ) as GameObjectWithPhysics;
        this.physics.add.existing(brick);
        brick.body.immovable = true;
        this.bricks.add(brick);
      }
    }
  }

  update() {
    const playerBody = this.player.body;
    const ballBody = this.ball.body;
    const playerKeys = this.input.keyboard.createCursorKeys();

    if (playerKeys.left.isDown) {
      playerBody.setVelocityX(-500);
    } else if (playerKeys.right.isDown) {
      playerBody.setVelocityX(500);
    } else {
      playerBody.setVelocityX(0);
    }

    playerBody.x = clamp(playerBody.x, 0, WIDTH - playerBody.width);

    if (this.isStart) {
      if (ballBody.y > HEIGHT) {
        this.isStart = false;
      } else if (ballBody.x > WIDTH - ballBody.width || ballBody.x < 0) {
        ballBody.setVelocityX(ballBody.velocity.x * -1);
      } else if (ballBody.y < 0) {
        ballBody.setVelocityY(ballBody.velocity.y * -1);
      } else {
        this.physics.collide(this.ball, this.player);
        this.physics.collide(this.ball, this.bricks, (_ball, _brick) => {
          _brick.destroy();
        });
      }
    } else if (playerKeys.space.isDown) {
      this.isStart = true;
      ballBody.setVelocity(BALL_SPEED, -BALL_SPEED);
    } else {
      ballBody.x = playerBody.x + (playerBody.width - ballBody.width) / 2;
      ballBody.y = playerBody.y - playerBody.height;
    }
  }
}
