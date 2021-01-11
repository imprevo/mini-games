import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from '../config';

const BALL_SPEED = 200;
const LIVES = 3;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

type GameObjectWithPhysics = Phaser.GameObjects.Shape & {
  body: Phaser.Physics.Arcade.Body;
};

type PlayerKeys = Record<
  'left' | 'right' | 'start' | 'enter',
  Phaser.Input.Keyboard.Key
>;

export class ArcanoidScene extends Phaser.Scene {
  player: GameObjectWithPhysics;
  playerKeys: PlayerKeys;
  ball: GameObjectWithPhysics;
  bricks: Phaser.GameObjects.Group;

  livesLabel: Phaser.GameObjects.Text;
  levelLabel: Phaser.GameObjects.Text;
  gameOverLabel: Phaser.GameObjects.Text;

  isGameOver = false;
  isStart = false;
  lives = LIVES;
  level = 1;

  constructor() {
    super('ArcanoidScene');
  }

  create() {
    this.livesLabel = this.add.text(20, 20, '');
    this.updateLives(LIVES);

    this.levelLabel = this.add.text(20, 40, '');
    this.updateLevel(this.level);

    this.gameOverLabel = this.add
      .text(WIDTH / 2, (HEIGHT / 3) * 2, 'YOU LOOSE', { fontSize: 30 })
      .setOrigin(0.5);
    // .setVisible(false);
    this.gameOverLabel.setVisible(false);

    this.player = this.add.rectangle(
      WIDTH / 2,
      HEIGHT - 20,
      100,
      20,
      0xffffff
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.player);
    this.player.body.immovable = true;

    this.playerKeys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      start: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.ball = this.add.circle(
      -100,
      -100,
      10,
      0xff0000
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.ball);
    this.ball.body.bounce.set(1);

    this.bricks = this.add.group();
    this.addBricks();

    this.input.keyboard.on('keydown_ESC', () => {
      this.scene.start('MainScene');
    });
  }

  update() {
    const playerBody = this.player.body;
    const ballBody = this.ball.body;

    if (this.playerKeys.left.isDown) {
      playerBody.setVelocityX(-500);
    } else if (this.playerKeys.right.isDown) {
      playerBody.setVelocityX(500);
    } else {
      playerBody.setVelocityX(0);
    }

    playerBody.x = clamp(playerBody.x, 0, WIDTH - playerBody.width);

    if (this.isGameOver) {
      if (this.playerKeys.enter.isDown) {
        this.isGameOver = false;
        this.gameOverLabel.setVisible(false);
        this.updateLives(LIVES);
        this.updateLevel(1);
        this.addBricks();
        this.lipBall();
      }
    } else if (this.isStart) {
      if (ballBody.y > HEIGHT) {
        this.isStart = false;
        this.updateLives(this.lives - 1);
        if (this.lives <= 0) {
          this.isGameOver = true;
          this.gameOverLabel.setVisible(true);
        }
      } else if (ballBody.x > WIDTH - ballBody.width) {
        ballBody.setVelocityX(-Math.abs(ballBody.velocity.x));
      } else if (ballBody.x < 0) {
        ballBody.setVelocityX(Math.abs(ballBody.velocity.x));
      } else if (ballBody.y < 0) {
        ballBody.setVelocityY(Math.abs(ballBody.velocity.y));
      } else {
        this.physics.collide(this.ball, this.player);
        this.physics.collide(this.ball, this.bricks, (_ball, _brick) => {
          _brick.destroy();
          if (this.bricks.countActive() <= 0) {
            this.addBricks();
            this.updateLevel(this.level + 1);
            this.isStart = false;
          }
        });
      }
    } else if (this.playerKeys.start.isDown) {
      this.isStart = true;
      ballBody.setVelocity(BALL_SPEED, -BALL_SPEED);
    } else {
      this.lipBall();
    }
  }

  addBricks() {
    this.bricks.clear(true, true);
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

  lipBall() {
    const playerBody = this.player.body;
    const ballBody = this.ball.body;
    ballBody.x = playerBody.x + (playerBody.width - ballBody.width) / 2;
    ballBody.y = playerBody.y - playerBody.height;
    ballBody.setVelocity(0, 0);
  }

  updateLives(lives: number) {
    this.lives = lives;
    this.livesLabel.text = `Lives: ${this.lives}`;
  }

  updateLevel(level: number) {
    this.level = level;
    this.levelLabel.text = `Level: ${this.level}`;
  }
}
