import * as Phaser from 'phaser';
import { GRID_X, GRID_Y, STEP } from './config';
import { Fruit } from './fruit';

export class FruitGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
  }

  addFruit() {
    const { x, y } = this.getNewCoords();

    this.add(new Fruit(this.scene, x, y));
  }

  getNewCoords() {
    const x = Phaser.Math.Between(0, GRID_X) * STEP;
    const y = Phaser.Math.Between(0, GRID_Y) * STEP;

    return { x, y };
  }
}
