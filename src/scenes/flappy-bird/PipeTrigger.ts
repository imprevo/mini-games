import * as Phaser from 'phaser';
import { STEP } from './config';

export class PipeTrigger extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 20, 20, 0xff0000, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0);
  }

  update() {
    this.setX(this.scene.cameras.main.scrollX - STEP * 2);
  }
}
