import * as Phaser from 'phaser';
import { Weapon } from './weapon';

class UnitHead extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 40, 40, 0xffffff);
  }
}

export class Unit extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body;
  head: UnitHead;
  weapon: Weapon | null;
  lives: number;
  livesLabel: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    lives: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.head = new UnitHead(scene, 0, 0);
    this.add(this.head);

    this.livesLabel = new Phaser.GameObjects.Text(scene, 0, 0, '0', {
      fontSize: '32px',
      color: '0x000000',
    }).setOrigin(0.5);
    this.updateLives(lives);
    this.livesLabel.angle = 90;
    this.add(this.livesLabel);

    this.angle = -angle;

    this.body.useDamping = true;
    this.body.setDrag(0.3, 0.3);
    this.body.setCircle(25, -25, -25);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
  }

  move(distance) {
    const vec = new Phaser.Math.Vector2();
    vec.setToPolar(this.rotation, distance);

    this.body.setVelocity(vec.x, vec.y);
  }

  rotate(angle: number) {
    this.angle += angle;

    const vec = new Phaser.Math.Vector2(
      this.body.velocity.x,
      this.body.velocity.y
    );
    vec.setAngle(vec.angle() + Phaser.Math.DegToRad(angle));

    this.body.setVelocity(vec.x, vec.y);
  }

  fire() {
    this.weapon?.attack();
  }

  setWeapon(nextWeapon: Weapon | null) {
    if (this.weapon) {
      // TODO: drop weapon
      this.remove(this.weapon, true);
    }

    if (nextWeapon) {
      nextWeapon.setBusy(true);
      nextWeapon.x = 30;
      nextWeapon.y = 0;
      this.add(nextWeapon);
    }

    this.weapon = nextWeapon;
  }

  dropWeapon() {
    const weapon = this.weapon;
    if (weapon) {
      this.remove(weapon);
      this.scene.add.existing(weapon);
      weapon.x = this.x;
      weapon.y = this.y;
      weapon.setBusy(false);
    }
    return weapon;
  }

  hit() {
    this.lives -= 1;
    this.livesLabel.text = this.lives.toString();
    if (this.lives <= 0) {
      this.dropWeapon();
      this.destroy();
    }
  }

  updateLives(lives: number) {
    this.lives = lives;
    this.livesLabel.text = lives.toString();
  }
}
