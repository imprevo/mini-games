import * as Phaser from 'phaser';
import { Bird } from './bird';
import { WIDTH, HEIGHT } from './config';
import { Pipes } from './pipes';

export class FlappyBirdScene extends Phaser.Scene {
  bird: Bird;
  pipes: Pipes;

  isGameOver = false;
  gameOverLabel: Phaser.GameObjects.Text;

  score: number;
  scoreLabel: Phaser.GameObjects.Text;

  constructor() {
    super('FlappyBirdScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, Infinity, HEIGHT);
    this.cameras.main.setBounds(0, 0, Infinity, 0);

    this.bird?.destroy(true);
    this.bird = new Bird(this, 200, HEIGHT / 2);

    this.cameras.main.startFollow(this.bird, true, 0.08, 0.08);

    this.pipes?.destroy(true);
    this.pipes = new Pipes(this);
    this.pipes.createPipes();

    this.isGameOver = false;
    this.gameOverLabel?.destroy(true);
    this.gameOverLabel = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'YOU LOOSE', { fontSize: 30 })
      .setOrigin(0.5)
      .setDepth(1)
      .setVisible(false)
      .setScrollFactor(0, 0);

    this.scoreLabel?.destroy(true);
    this.scoreLabel = this.add
      .text(20, 20, '')
      .setDepth(1)
      .setScrollFactor(0, 0);
    this.updateScore(0);

    this.physics.world.once('worldbounds', () => {
      this.gameOver();
    });

    this.input.keyboard.on('keydown_ESC', () => {
      this.scene.start('MainScene');
    });
  }

  update(time: number) {
    const keys = this.input.keyboard.createCursorKeys();
    if (keys.space.isDown) {
      if (this.isGameOver) {
        this.create();
      } else {
        this.bird.jump();
      }
    }

    this.physics.collide(this.bird, this.pipes.obstackles, () => {
      this.gameOver();
    });
    this.physics.overlap(
      this.bird,
      this.pipes.scoreTriggers,
      (bird, scoreTrigger) => {
        if (scoreTrigger.active) {
          scoreTrigger.setActive(false);
          this.updateScore(this.score + 1);
        }
      }
    );

    this.pipes.update();
  }

  gameOver() {
    if (!this.isGameOver) {
      this.isGameOver = true;
      this.gameOverLabel.setVisible(true);
      this.bird.stop();
    }
  }

  updateScore(score: number) {
    this.score = score;
    this.scoreLabel.text = `Score: ${this.score}`;
  }
}
