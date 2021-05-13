import * as Phaser from 'phaser';
import { Weapon } from './weapon';

class PlayerHead extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 40, 40, 0xffffff);
  }
}

export class Player extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body;
  head: PlayerHead;
  weapon: Weapon;

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.head = new PlayerHead(scene, 0, 0);
    this.add(this.head);

    this.weapon = new Weapon(scene, 30, 0);
    this.add(this.weapon);

    this.angle = -angle;

    this.body.useDamping = true;
    this.body.setDrag(0.97, 0.97);
    this.body.setCircle(25, -25, -25);
  }

  move(distance) {
    const vec = new Phaser.Math.Vector2();
    vec.setToPolar(this.rotation, distance);

    this.body.setVelocity(vec.x, vec.y);
  }

  rotate(angle: number) {
    this.angle += angle;
  }

  fire() {
    this.weapon.fire();
  }
}
