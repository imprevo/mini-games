import * as Phaser from 'phaser';
import { STEP } from './config';
import { FruitGroup } from './fruit-group';
import { Snake } from './snake';

export class SnakeScene extends Phaser.Scene {
  snake: Snake;
  fruits: FruitGroup;

  score: number;
  scoreLabel: Phaser.GameObjects.Text;

  constructor() {
    super('SnakeScene');
  }

  create() {
    this.snake = new Snake(this, STEP * 5, STEP * 5);
    this.fruits = new FruitGroup(this);
    this.fruits.addFruit();
    this.scoreLabel = this.add.text(20, 20, '').setDepth(1);
    this.updateScore(0);

    this.input.keyboard.on('keydown_ESC', () => {
      this.scene.start('MainScene');
    });
  }

  update(time: number) {
    this.snake.update(time);

    this.physics.collide(this.fruits, this.snake, (fruit) => {
      fruit.destroy();
      this.snake.eat();
      this.fruits.addFruit();
      this.updateScore(this.score + 1);
    });
  }

  updateScore(score: number) {
    this.score = score;
    this.scoreLabel.text = `Score: ${this.score}`;
  }
}
