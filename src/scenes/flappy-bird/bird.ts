import * as Phaser from 'phaser';

export class Bird extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 40, 40, 0xffffff);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setGravityY(250);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  jump() {
    this.body.setVelocity(100, -250);
  }

  stop() {
    this.body.setVelocityX(0);
  }
}
