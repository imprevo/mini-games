import * as Phaser from 'phaser';
import { Bird } from './bird';

export class Cannon extends Phaser.GameObjects.Rectangle {
  bird: Bird | null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 50, 80, 0xffffff);
    scene.add.existing(this);
  }

  destroy(fromScene?: boolean) {
    this.bird?.destroy(fromScene);
    super.destroy(fromScene);
  }

  snapBird(bird: Bird) {
    this.bird = bird;
    this.bird.x = this.x;
    this.bird.y = this.y - 20;
  }

  followCursor() {
    const activePointer = this.scene.input.activePointer;
    const rotation = Phaser.Math.Angle.BetweenPoints(this, activePointer);

    this.rotation = rotation + Math.PI / 2;
  }

  fire() {
    if (!this.bird) {
      return null;
    }

    const activePointer = this.scene.input.activePointer;
    const speed = 2;
    const x = speed * (activePointer.x - this.bird.x);
    const y = speed * (activePointer.y - this.bird.y);

    this.bird.throw(x, y);
    this.bird = null;
  }
}
