import * as Phaser from 'phaser';
import { Bird } from './bird';
import { Cannon } from './cannon';
import { WIDTH, HEIGHT } from './config';
import { Enemy } from './enemy';

export class AngryBirdsScene extends Phaser.Scene {
  bird: Bird;
  enemy: Enemy;
  cannon: Cannon;

  isGameOver = false;
  gameOverLabel: Phaser.GameObjects.Text;

  score: number;
  scoreLabel: Phaser.GameObjects.Text;

  constructor() {
    super('AngryBirdsScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, Infinity, HEIGHT);
    this.cameras.main.setBounds(0, 0, Infinity, 0);

    this.bird?.destroy(true);
    this.bird = new Bird(this, 0, 0).setDepth(1);

    // this.add.weapon
    this.cannon?.destroy(true);
    this.cannon = new Cannon(this, 200, HEIGHT - 80, this.bird);

    this.enemy?.destroy(true);
    this.enemy = new Enemy(this, 500, HEIGHT - 20);

    this.cameras.main.startFollow(this.cannon.bird, true, 0.08, 0.08);

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

  update() {
    const activePointer = this.input.activePointer;
    if (activePointer.isDown) {
      if (this.isGameOver) {
        this.create();
      } else {
        this.cannon.fire();
      }
    }
    this.cannon.followCursor();

    this.physics.collide(this.bird, this.enemy, (_bird, _enemy) => {
      _enemy.destroy();
      this.updateScore(this.score + 1);
    });
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
