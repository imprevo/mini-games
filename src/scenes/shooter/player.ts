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
  playerHead: PlayerHead;
  playerWeapon: Weapon;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);
    this.playerHead = new PlayerHead(scene, x, y);
    this.playerHead.angle = -90;
    this.playerWeapon = new Weapon(scene, x, y);
    this.playerWeapon.setOrigin(-1, 0);
    this.snapWeapon();
  }

  snapWeapon() {
    this.playerWeapon.x = this.playerHead.x;
    this.playerWeapon.y = this.playerHead.y;
    this.playerWeapon.angle = this.playerHead.angle;
  }

  move(distance) {
    const vec = new Phaser.Math.Vector2();
    vec.setToPolar(this.playerHead.rotation, distance);

    this.playerHead.body.x += vec.x;
    this.playerHead.body.y += vec.y;
    this.snapWeapon();
  }

  rotate(angle: number) {
    this.playerHead.angle += angle;
    this.snapWeapon();
  }
}
