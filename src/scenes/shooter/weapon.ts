import * as Phaser from 'phaser';

export class PlayerWeapon extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 20, 4, 0xcccccc);
    scene.add.existing(this);
  }
}
