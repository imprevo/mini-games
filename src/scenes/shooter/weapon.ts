import * as Phaser from 'phaser';
import { Bullet } from './bullet';

const getDeviation = () => Math.random() - 0.5;

export class Weapon extends Phaser.GameObjects.Rectangle {
  fireRate: number;
  bulletSpeed = 500;
  lastFireRate = 0;

  bullets: Phaser.GameObjects.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number,
    fireRate: number,
    bullets: Phaser.GameObjects.Group
  ) {
    super(scene, x, y, 20, 4, color);
    this.fireRate = fireRate;
    this.bullets = bullets;
  }

  createBullet(deltaRotation: number) {
    const vec = new Phaser.Math.Vector2();
    vec.setToPolar(this.parentContainer.rotation, 40);

    const bullet = new Bullet(
      this.scene,
      this.parentContainer.x + vec.x,
      this.parentContainer.y + vec.y,
      this.bulletSpeed
    );
    bullet.rotation = this.parentContainer.rotation + deltaRotation;
    this.bullets.add(bullet);
    bullet.fire();
    return bullet;
  }

  attack() {
    if (Date.now() > this.lastFireRate + this.fireRate) {
      this.lastFireRate = Date.now();
      this.shoot();
    }
  }

  shoot() {
    throw Error('Method "shoot" should be implemented');
  }
}

export class Pistol extends Weapon {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bullets: Phaser.GameObjects.Group
  ) {
    super(scene, x, y, 0x00cc00, 500, bullets);
  }

  shoot() {
    this.createBullet(getDeviation() * 0.1);
  }
}

export class Rifle extends Weapon {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bullets: Phaser.GameObjects.Group
  ) {
    super(scene, x, y, 0x0000cc, 250, bullets);
  }

  shoot() {
    this.createBullet(getDeviation() * 0.2);
  }
}

export class Shotgun extends Weapon {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bullets: Phaser.GameObjects.Group
  ) {
    super(scene, x, y, 0xcc0000, 1000, bullets);
  }

  shoot() {
    this.createBullet(getDeviation() * 0.2);
    this.createBullet(getDeviation() * 0.3 + 0.3);
    this.createBullet(getDeviation() * 0.3 - 0.3);
  }
}
