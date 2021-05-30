import * as Phaser from 'phaser';
import { WIDTH } from './config';

export class SceneTrigger extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, WIDTH, 10, 0xff0000, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5);
  }
}
