import * as Phaser from 'phaser';
import { STEP } from './config';

export class Fruit extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x + STEP / 2, y + STEP / 2, STEP, STEP, 0xff0000);

    scene.add.existing(this);

    scene.physics.add.existing(this);
    this.body.immovable = true;
  }
}
