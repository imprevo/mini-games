import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';

class Pipe extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 50, HEIGHT, 0x00ff00);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.immovable = true;
  }
}

export class Pipes extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
  }

  createPipes() {
    for (let index = 0; index < 5; index++) {
      const { x, y } = this.getNewCoords(index);
      const top = new Pipe(this.scene, x, y - 100).setOrigin(1, 1);
      const bottom = new Pipe(this.scene, x, y + 100).setOrigin(1, 0);

      this.addMultiple([top, bottom]);
    }
  }

  getNewCoords(index: number) {
    const x = WIDTH + index * 200;
    const y = Phaser.Math.Between(200, HEIGHT - 200);

    return { x, y };
  }
}
