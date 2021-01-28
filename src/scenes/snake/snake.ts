import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from '../../config';

const MOVE_DELAY = 500;
const STEP = 50;

enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

class Snake extends Phaser.GameObjects.Group {
  nextMovementTime = 0;
  headDirection = Direction.RIGHT;
  nextHeadDirection = Direction.RIGHT;

  head: Phaser.GameObjects.GameObject;
  headPosition: Phaser.Geom.Point;

  constructor(scene: Phaser.Scene) {
    super(scene);

    scene.add.existing(this);
    this.createBody();
  }

  update(time: number) {
    this.updateDirection();

    if (time > this.nextMovementTime) {
      this.nextMovementTime = time + MOVE_DELAY;
      this.move();
    }
  }

  createBody() {
    const x = STEP * 5.5;
    const y = STEP * 5.5;
    this.headPosition = new Phaser.Geom.Point(x, y);

    for (let index = 0; index < 5; index++) {
      const cell = new Phaser.GameObjects.Rectangle(
        this.scene,
        x - STEP * index,
        y,
        STEP,
        STEP,
        0x0000ff
      );
      this.add(cell, true);
    }
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

    this.shiftPosition(this.headPosition.x, this.headPosition.y, 1);
  }
}

export class SnakeScene extends Phaser.Scene {
  snake: Snake;

  constructor() {
    super('SnakeScene');
  }

  create() {
    this.snake = new Snake(this);
  }

  update(time: number) {
    this.snake.update(time);
  }
}
