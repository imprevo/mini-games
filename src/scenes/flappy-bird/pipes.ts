import * as Phaser from 'phaser';
import { WIDTH, HEIGHT, STEP, PIPE_GAP } from './config';

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
  lastPosition = WIDTH - STEP;
  pipes: [Pipe, Pipe][] = [];

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
  }

  createPipes() {
    for (let index = 0; index < 10; index++) {
      this.pipes.push(this.addPipe());
    }
  }

  addPipe() {
    this.lastPosition += STEP;
    const { x, y } = this.getNewCoords(this.lastPosition);
    const top = new Pipe(this.scene, x, y - 100).setOrigin(1, 1);
    const bottom = new Pipe(this.scene, x, y + 100).setOrigin(1, 0);

    const pipe: [Pipe, Pipe] = [top, bottom];
    this.addMultiple(pipe);
    return pipe;
  }

  movePipe() {
    const pipe = this.pipes.shift();

    this.lastPosition += STEP;
    const { x, y } = this.getNewCoords(this.lastPosition);
    pipe[0].setPosition(x, y - PIPE_GAP / 2);
    pipe[1].setPosition(x, y + PIPE_GAP / 2);

    this.pipes.push(pipe);
  }

  getNewCoords(x: number) {
    const y = Phaser.Math.Between(PIPE_GAP, HEIGHT - PIPE_GAP);
    return { x, y };
  }
}
