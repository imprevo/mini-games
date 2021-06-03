import * as Phaser from 'phaser';
import { Scenes } from '../../config';
import { STEP, WIDTH, HEIGHT } from './config';
import { FruitGroup } from './fruit-group';
import { Snake } from './snake';

export class SnakeScene extends Phaser.Scene {
  snake: Snake;
  fruits: FruitGroup;
  isGameOver = false;
  gameOverLabel: Phaser.GameObjects.Text;

  score: number;
  scoreLabel: Phaser.GameObjects.Text;

  create() {
    this.snake?.destroy(true);
    this.snake = new Snake(this, STEP * 5, STEP * 5);
    this.fruits?.destroy(true);
    this.fruits = new FruitGroup(this);
    this.fruits.addFruit();

    this.isGameOver = false;
    this.gameOverLabel?.destroy(true);
    this.gameOverLabel = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'YOU LOOSE', { fontSize: 30 })
      .setOrigin(0.5)
      .setDepth(1)
      .setVisible(false);

    this.scoreLabel?.destroy(true);
    this.scoreLabel = this.add.text(20, 20, '').setDepth(1);
    this.updateScore(0);

    this.input.keyboard.on('keydown_ESC', () => {
      this.scene.start(Scenes.MAIN);
    });
  }

  update(time: number) {
    if (this.isGameOver) {
      const keys = this.input.keyboard.createCursorKeys();
      if (keys.space.isDown) {
        this.create();
      }
    } else {
      this.snake.update(time);

      this.physics.collide(this.fruits, this.snake, (fruit) => {
        fruit.destroy();
        this.snake.eat();
        this.fruits.addFruit();
        this.updateScore(this.score + 1);
      });

      this.physics.collide(this.snake, this.snake, () => {
        this.gameOver();
      });
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.gameOverLabel.setVisible(true);
  }

  updateScore(score: number) {
    this.score = score;
    this.scoreLabel.text = `Score: ${this.score}`;
  }
}
