import * as Phaser from 'phaser';
import { STEP } from './config';
import { FruitGroup } from './fruit-group';
import { Snake } from './snake';

export class SnakeScene extends Phaser.Scene {
  snake: Snake;
  fruits: FruitGroup;

  constructor() {
    super('SnakeScene');
  }

  create() {
    this.snake = new Snake(this, STEP * 5, STEP * 5);
    this.fruits = new FruitGroup(this);
    this.fruits.addFruit();
  }

  update(time: number) {
    this.snake.update(time);

    this.physics.collide(this.fruits, this.snake, (fruit) => {
      fruit.destroy();
      this.snake.eat();
      this.fruits.addFruit();
    });
  }
}
