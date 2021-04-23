import * as Phaser from 'phaser';
import { Weapon } from './weapon';

class PlayerHead extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 40, 40, 0xffffff);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

export class Player extends Phaser.GameObjects.Container {
  head: PlayerHead;
  weapon: Weapon;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);
    this.head = new PlayerHead(scene, x, y);
    this.head.angle = -90;
    this.weapon = new Weapon(scene, x, y);
    this.weapon.setOrigin(-1, 0.5);
    this.snapWeapon();
  }

  snapWeapon() {
    this.weapon.x = this.head.x;
    this.weapon.y = this.head.y;
    this.weapon.angle = this.head.angle;
  }

  move(distance) {
    const vec = new Phaser.Math.Vector2();
    vec.setToPolar(this.head.rotation, distance);

    this.head.body.x += vec.x;
    this.head.body.y += vec.y;
    this.snapWeapon();
  }

  rotate(angle: number) {
    this.head.angle += angle;
    this.snapWeapon();
  }

  fire() {
    this.weapon.fire();
  }
}
