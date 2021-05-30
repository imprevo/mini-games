import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { Unit } from './unit';
import { WeaponController, WeaponType } from './weapon-controller';

type EnemyConfig = {
  weaponType: WeaponType;
  lives: number;
};

type WaveConfig = {
  enemies: EnemyConfig[];
};

export const waveDeltaY = HEIGHT * 2;

export const wavesConfig: WaveConfig[] = [
  { enemies: [{ weaponType: WeaponType.PISTOL, lives: 1 }] },
  {
    enemies: [
      { weaponType: WeaponType.PISTOL, lives: 1 },
      { weaponType: WeaponType.PISTOL, lives: 1 },
      { weaponType: WeaponType.PISTOL, lives: 1 },
    ],
  },
  {
    enemies: [
      { weaponType: WeaponType.PISTOL, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.PISTOL, lives: 1 },
    ],
  },
  {
    enemies: [
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
    ],
  },
  {
    enemies: [
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
    ],
  },
  {
    enemies: [
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
    ],
  },
];

export class WaveTrigger extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, WIDTH, 10, 0xff0000, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0, 0.5);
  }
}

export class WaveController {
  scene: Phaser.Scene;
  weaponsController: WeaponController;
  enemiesController: EnemiesController;

  wave: number;
  waveTriggers: Phaser.GameObjects.Group;

  constructor(
    scene: Phaser.Scene,
    weaponsController: WeaponController,
    enemiesController: EnemiesController
  ) {
    this.scene = scene;
    this.weaponsController = weaponsController;
    this.enemiesController = enemiesController;
    this.waveTriggers = scene.add.group();
  }

  addWaveTriggers() {
    this.wave = 0;
    wavesConfig.forEach((wave, index) => {
      this.waveTriggers.add(
        new WaveTrigger(this.scene, 0, -waveDeltaY * index)
      );
    });
  }

  spawnEnemy(y: number) {
    const currentWave = wavesConfig[this.wave];

    if (!currentWave) {
      return;
    }

    this.wave += 1;

    const deltaX = WIDTH / (currentWave.enemies.length + 1);

    currentWave.enemies.forEach((config, index) => {
      const enemy = new Unit(
        this.scene,
        deltaX * (index + 1),
        y,
        -90,
        config.lives
      );
      enemy.setWeapon(this.weaponsController.createWeapon(config.weaponType));
      this.enemiesController.enemies.add(enemy);
    });
  }
}
