import { Pistol, Rifle, Shotgun } from './weapon';

export enum WeaponType {
  PISTOL,
  RIFLE,
  SHOTGUN,
}

export class WeaponController {
  scene: Phaser.Scene;
  weapons: Phaser.GameObjects.Group;
  bullets: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bullets = scene.add.group();
    this.weapons = scene.add.group();
  }

  createWeapon(type: WeaponType, point?: Phaser.Math.Vector2) {
    const weapon = this.initWeapon(type, point);
    this.weapons.add(weapon, true);
    return weapon;
  }

  initWeapon(type: WeaponType, point?: Phaser.Math.Vector2) {
    const x = point?.x || 0;
    const y = point?.y || 0;

    switch (type) {
      case WeaponType.PISTOL:
        return new Pistol(this.scene, x, y, this.bullets);
      case WeaponType.RIFLE:
        return new Rifle(this.scene, x, y, this.bullets);
      case WeaponType.SHOTGUN:
        return new Shotgun(this.scene, x, y, this.bullets);
      default:
        throw Error(`Unknown weapon type ${type}`);
    }
  }
}
