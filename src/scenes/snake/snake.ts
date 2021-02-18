import * as Phaser from 'phaser';
import { HEIGHT, WIDTH, STEP, Direction } from './config';

const MOVE_BASE = 220;
const MOVE_STEP = 10;
const LEVEL_MAX = 20;

class SnakeCell extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, STEP, STEP, 0x0000ff);
  }
}

export class Snake extends Phaser.GameObjects.Group {
  speed: number;
  moveDelay: number;
  nextMovementTime: number;
  headDirection = Direction.RIGHT;
  nextHeadDirection = Direction.RIGHT;

  head: Phaser.GameObjects.GameObject;
  headPosition: Phaser.Geom.Point;
  tailPosition: Phaser.Geom.Point;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);

    scene.add.existing(this);

    this.createBody(x + STEP / 2, y + STEP / 2);
    this.nextMovementTime = 0;
    this.speed = 1;
  }

  update(time: number) {
    this.updateDirection();

    if (time > this.nextMovementTime) {
      this.nextMovementTime = time + this.getUpdateDelta();
      this.move();
    }
  }

  createBody(x: number, y: number) {
    const count = 5;
    for (let index = 0; index < count; index++) {
      this.addCell(x - STEP * index, y);
    }

    this.headPosition = new Phaser.Geom.Point(x, y);
    this.tailPosition = new Phaser.Geom.Point(x - STEP * count, y);
  }

  addCell(x: number, y: number) {
    const cell = new SnakeCell(this.scene, x, y);
    this.add(cell, true);
    this.scene.physics.add.existing(cell);
  }

  eat() {
    this.addCell(this.tailPosition.x, this.tailPosition.y);
    this.speedUp();
  }

  updateDirection() {
    const cursors = this.scene.input.keyboard.createCursorKeys();

    if (
      this.headDirection === Direction.LEFT ||
      this.headDirection === Direction.RIGHT
    ) {
      if (cursors.up.isDown) {
        this.nextHeadDirection = Direction.UP;
      } else if (cursors.down.isDown) {
        this.nextHeadDirection = Direction.DOWN;
      }
    } else if (
      this.headDirection === Direction.UP ||
      this.headDirection === Direction.DOWN
    ) {
      if (cursors.left.isDown) {
        this.nextHeadDirection = Direction.LEFT;
      } else if (cursors.right.isDown) {
        this.nextHeadDirection = Direction.RIGHT;
      }
    }
  }

  move() {
    this.moveHead();
    this.moveTail();
    this.shiftPosition(this.headPosition.x, this.headPosition.y, 1);
  }

  moveHead() {
    switch (this.nextHeadDirection) {
      case Direction.LEFT:
        this.headPosition.x = this.headPosition.x - STEP;
        break;
      case Direction.RIGHT:
        this.headPosition.x = this.headPosition.x + STEP;
        break;
      case Direction.UP:
        this.headPosition.y = this.headPosition.y - STEP;
        break;
      case Direction.DOWN:
        this.headPosition.y = this.headPosition.y + STEP;
        break;
    }

    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x, 0, WIDTH);
    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y, 0, HEIGHT);

    this.headDirection = this.nextHeadDirection;
  }

  moveTail() {
    const children = this.getChildren();
    const last = children[children.length - 1] as SnakeCell;

    this.tailPosition.x = last.x;
    this.tailPosition.y = last.y;
  }

  speedUp() {
    if (this.speed < LEVEL_MAX) {
      this.speed += 1;
    }
  }

  getUpdateDelta() {
    return MOVE_BASE - this.speed * MOVE_STEP;
  }
}
