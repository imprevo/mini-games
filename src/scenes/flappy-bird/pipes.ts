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

class ScoreTrigger extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 10, STEP, 0xff0000, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

export class Pipes extends Phaser.GameObjects.Container {
  lastPosition = WIDTH - STEP;
  pipes: [Pipe, Pipe, ScoreTrigger][] = [];

  obstackles: Phaser.GameObjects.Group;
  scoreTriggers: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
    this.obstackles = scene.add.group();
    this.scoreTriggers = scene.add.group();
  }

  createPipes() {
    for (let index = 0; index < 10; index++) {
      this.pipes.push(this.addPipe());
    }
  }

  addPipe() {
    this.lastPosition += STEP;
    const { x, y } = this.getNewCoords(this.lastPosition);
    const top = new Pipe(this.scene, x, y - PIPE_GAP / 2).setOrigin(1, 1);
    const bottom = new Pipe(this.scene, x, y + PIPE_GAP / 2).setOrigin(1, 0);
    const trigger = new ScoreTrigger(this.scene, x, y - PIPE_GAP / 2).setOrigin(
      1,
      0
    );

    this.obstackles.addMultiple([top, bottom]);
    this.scoreTriggers.add(trigger);
    const pipe: [Pipe, Pipe, ScoreTrigger] = [top, bottom, trigger];
    return pipe;
  }

  movePipe() {
    const pipe = this.pipes.shift();

    this.lastPosition += STEP;
    const { x, y } = this.getNewCoords(this.lastPosition);
    pipe[0].setPosition(x, y - PIPE_GAP / 2);
    pipe[1].setPosition(x, y + PIPE_GAP / 2);
    pipe[2].setPosition(x, y - PIPE_GAP / 2).setActive(true);

    this.pipes.push(pipe);
  }

  getNewCoords(x: number) {
    const y = Phaser.Math.Between(PIPE_GAP, HEIGHT - PIPE_GAP);
    return { x, y };
  }
}
