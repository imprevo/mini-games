import * as Phaser from 'phaser';
import { WIDTH, HEIGHT, STEP, PIPE_GAP } from './config';
import { PipeTrigger, ScoreTrigger } from './triggers';

class Pipe extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 50, HEIGHT, 0x00ff00);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.immovable = true;
  }
}

type PipeGroup = [Pipe, Pipe, ScoreTrigger];

export class Pipes extends Phaser.GameObjects.Container {
  lastPosition = WIDTH - STEP;
  pipes: PipeGroup[] = [];

  obstackles: Phaser.GameObjects.Group;
  scoreTriggers: Phaser.GameObjects.Group;
  pipeTrigger: PipeTrigger;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
    this.obstackles = scene.add.group();
    this.scoreTriggers = scene.add.group();
    this.pipeTrigger = new PipeTrigger(this.scene);
  }

  destroy(fromScene?: boolean) {
    this.obstackles.destroy(fromScene);
    this.scoreTriggers.destroy(fromScene);
    this.pipeTrigger.destroy(fromScene);
    super.destroy(fromScene);
  }

  update() {
    this.pipeTrigger.update();
    this.scene.physics.collide(this.pipeTrigger, this.obstackles, () => {
      this.movePipe();
    });
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
    const trigger = new ScoreTrigger(this.scene, x, y);

    this.obstackles.addMultiple([top, bottom]);
    this.scoreTriggers.add(trigger);
    const pipe: PipeGroup = [top, bottom, trigger];
    return pipe;
  }

  movePipe() {
    const pipe = this.pipes.shift();

    this.lastPosition += STEP;
    const { x, y } = this.getNewCoords(this.lastPosition);
    pipe[0].setPosition(x, y - PIPE_GAP / 2);
    pipe[1].setPosition(x, y + PIPE_GAP / 2);
    pipe[2].setPosition(x, y).setActive(true);

    this.pipes.push(pipe);
  }

  getNewCoords(x: number) {
    const y = Phaser.Math.Between(PIPE_GAP, HEIGHT - PIPE_GAP);
    return { x, y };
  }
}
