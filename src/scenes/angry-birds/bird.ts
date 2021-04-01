import * as Phaser from 'phaser';

export class Bird extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 40, 40, 0xff0000);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  throw(x: number, y: number) {
    this.body.setGravityY(250);
    this.body.setVelocity(x, y);
  }

  stop() {
    this.body.setVelocityX(0);
    this.body.onWorldBounds = false;
  }
}
