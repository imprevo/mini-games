import * as Phaser from 'phaser';
import { Bird } from './bird';
import { Cannon } from './cannon';
import { WIDTH, HEIGHT } from './config';
import { Enemy } from './enemy';

export class AngryBirdsScene extends Phaser.Scene {
  birds: Phaser.GameObjects.Group;
  activeBird: Bird;
  enemies: Phaser.GameObjects.Group;
  cannon: Cannon;

  isGameOver = false;
  gameOverLabel: Phaser.GameObjects.Text;
  winLabel: Phaser.GameObjects.Text;

  score: number;
  scoreLabel: Phaser.GameObjects.Text;

  lives: number;
  livesLabel: Phaser.GameObjects.Text;

  constructor() {
    super('AngryBirdsScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, Infinity, HEIGHT);
    this.cameras.main.setBounds(0, 0, Infinity, 0);

    this.birds?.destroy(true);
    this.birds = this.add.group();

    this.cannon?.destroy(true);
    this.cannon = new Cannon(this, 200, HEIGHT - 80);

    this.setNextBird();

    this.enemies?.destroy(true);
    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 400, HEIGHT - 20));
    this.enemies.add(new Enemy(this, 500, HEIGHT - 20));
    this.enemies.add(new Enemy(this, 600, HEIGHT - 20));
    this.enemies.add(new Enemy(this, 700, HEIGHT - 20));

    this.isGameOver = false;
    this.gameOverLabel?.destroy(true);
    this.gameOverLabel = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'YOU LOOSE', { fontSize: 30 })
      .setOrigin(0.5)
      .setDepth(1)
      .setVisible(false)
      .setScrollFactor(0, 0);
    this.winLabel?.destroy(true);
    this.winLabel = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'YOU WIN', { fontSize: 30 })
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

    this.livesLabel?.destroy(true);
    this.livesLabel = this.add
      .text(20, 40, '')
      .setDepth(1)
      .setScrollFactor(0, 0);
    this.updateLives(3);

    this.physics.world.on('worldbounds', () => {
      this.birdOnGround();
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

    this.physics.collide(this.birds, this.enemies, (_bird, _enemy) => {
      _enemy.destroy();
      this.updateScore(this.score + 1);
    });
  }

  gameOver() {
    if (!this.isGameOver) {
      this.isGameOver = true;
      this.gameOverLabel.setVisible(true);
    }
  }

  birdOnGround() {
    this.activeBird.stop();

    if (!this.enemies.getChildren().length) {
      this.winLabel.setVisible(true);
    } else if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.updateLives(this.lives - 1);
      this.setNextBird();
    }
  }

  setNextBird() {
    this.activeBird = new Bird(this, 0, 0).setDepth(1);
    this.birds.add(this.activeBird);
    this.cannon.snapBird(this.activeBird);
    this.cameras.main.startFollow(this.activeBird, true, 0.08, 0.08);
  }

  updateScore(score: number) {
    this.score = score;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  updateLives(lives: number) {
    this.lives = lives;
    this.livesLabel.text = `Lives: ${this.lives}`;
  }
}
