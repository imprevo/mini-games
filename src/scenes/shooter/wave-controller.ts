import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { SceneMessage } from './messages';
import { SceneTrigger } from './scene-trigger';
import { Unit } from './unit';
import { WeaponController, WeaponType } from './weapon-controller';

type EnemyConfig = {
  weaponType: WeaponType;
  lives: number;
};

type WaveConfig = {
  text: string;
  enemies: EnemyConfig[];
};

export const waveDeltaY = HEIGHT * 2;

export const wavesConfig: WaveConfig[] = [
  {
    text: 'COME GET SOME',
    enemies: [{ weaponType: WeaponType.PISTOL, lives: 1 }],
  },
  {
    text: 'KILL THEM ALL!',
    enemies: [
      { weaponType: WeaponType.PISTOL, lives: 1 },
      { weaponType: WeaponType.PISTOL, lives: 1 },
      { weaponType: WeaponType.PISTOL, lives: 1 },
    ],
  },
  {
    text: 'WANT A SURPRISE?',
    enemies: [
      { weaponType: WeaponType.PISTOL, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.PISTOL, lives: 1 },
    ],
  },
  {
    text: 'TRY THIS',
    enemies: [
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
    ],
  },
  {
    text: 'TOUGH GUY HUH?',
    enemies: [
      { weaponType: WeaponType.RIFLE, lives: 1 },
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
      { weaponType: WeaponType.RIFLE, lives: 1 },
    ],
  },
  {
    text: "LET'S ROCK!",
    enemies: [
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
      { weaponType: WeaponType.SHOTGUN, lives: 1 },
    ],
  },
];

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
    const x = WIDTH / 2;
    wavesConfig.forEach((wave, index) => {
      const y = -waveDeltaY * index;
      this.waveTriggers.add(new SceneTrigger(this.scene, x, y));
      this.scene.add.existing(new SceneMessage(this.scene, x, y, wave.text));
    });
  }

  spawnEnemy() {
    const currentWave = wavesConfig[this.wave];

    if (!currentWave) {
      return;
    }

    const deltaX = WIDTH / (currentWave.enemies.length + 1);
    const y = -waveDeltaY * (this.wave + 0.5);

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

    this.wave += 1;
  }
}
