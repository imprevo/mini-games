import * as Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;
  speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number) {
    super(scene, x, y, 8, 8, 0xff0000);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCircle(4);
    this.speed = speed;
  }

  fire() {
    const vec = new Phaser.Math.Vector2();
    vec.setToPolar(this.rotation, this.speed);
    this.body.setVelocity(vec.x, vec.y);
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => this.destroy(),
    });
  }
}
