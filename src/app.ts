import * as Phaser from 'phaser';

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const WIDTH = 800;
const HEIGHT = 600;

type GameObjectWithPhysics = Phaser.GameObjects.Shape & {
  body: Phaser.Physics.Arcade.Body;
};

export class PongScene extends Phaser.Scene {
  player: GameObjectWithPhysics;
  ball: GameObjectWithPhysics;

  isStart = false;

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Game',
    });
  }

  create() {
    this.player = this.add.rectangle(
      40,
      300,
      20,
      100,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player);

    this.ball = this.add.circle(60, 300, 10, 0xff0000) as GameObjectWithPhysics;
    this.physics.add.existing(this.ball);
  }

  update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
    const playerBody = this.player.body;
    const ballBody = this.ball.body;

    if (cursorKeys.up.isDown) {
      playerBody.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      playerBody.setVelocityY(500);
    } else {
      playerBody.setVelocityY(0);
    }

    playerBody.y = clamp(playerBody.y, 0, HEIGHT - playerBody.height);

    if (this.isStart) {
      if (ballBody.x > WIDTH - ballBody.width || ballBody.x < 0) {
        ballBody.setVelocityX(ballBody.velocity.x * -1);
      }

      if (ballBody.y > HEIGHT - ballBody.height || ballBody.y < 0) {
        ballBody.setVelocityY(ballBody.velocity.y * -1);
      }
    } else if (cursorKeys.space.isDown) {
      this.isStart = true;
      ballBody.setVelocity(200, 200);
    } else {
      ballBody.x = playerBody.x + playerBody.width;
      ballBody.y = playerBody.y + (playerBody.height - ballBody.height) / 2;
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
