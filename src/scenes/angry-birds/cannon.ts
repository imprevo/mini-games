import * as Phaser from 'phaser';
import { Bird } from './bird';

export class Cannon extends Phaser.GameObjects.Rectangle {
  bird: Bird;
  isShot = false;

  constructor(scene: Phaser.Scene, x: number, y: number, bird: Bird) {
    super(scene, x, y, 50, 80, 0xffffff);
    scene.add.existing(this);
    this.bird = bird;
    this.snapBird();
  }

  destroy(fromScene?: boolean) {
    this.bird.destroy(fromScene);
    super.destroy(fromScene);
  }

  snapBird() {
    this.bird.x = this.x;
    this.bird.y = this.y - 20;
  }

  followCursor() {
    const activePointer = this.scene.input.activePointer;
    const rotation = Phaser.Math.Angle.BetweenPoints(this, activePointer);

    this.rotation = rotation + Math.PI / 2;
  }

  fire() {
    if (this.isShot) {
      return;
    }
    this.isShot = true;

    const activePointer = this.scene.input.activePointer;
    const speed = 2;
    const x = speed * (activePointer.x - this.bird.x);
    const y = speed * (activePointer.y - this.bird.y);

    this.bird.throw(x, y);
  }
}
