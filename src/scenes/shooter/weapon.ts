import * as Phaser from 'phaser';
import { Bullet } from './bullet';

export class Weapon extends Phaser.GameObjects.Rectangle {
  fireRate = 400;
  bulletSpeed = 500;
  lastFireRate = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 20, 4, 0xcccccc);
  }

  fire() {
    if (Date.now() > this.lastFireRate + this.fireRate) {
      this.lastFireRate = Date.now();

      const vec = new Phaser.Math.Vector2();
      vec.setToPolar(this.parentContainer.rotation, 40);

      const bullet = new Bullet(
        this.scene,
        this.parentContainer.x + vec.x,
        this.parentContainer.y + vec.y,
        this.bulletSpeed
      );
      bullet.rotation = this.parentContainer.rotation;
      bullet.fire();
    }
  }
}
