import * as Phaser from 'phaser';
import { Bullet } from './bullet';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { PlayerController } from './player-controller';
import { Unit } from './unit';
import { Weapon } from './weapon';
import { WeaponController, WeaponType } from './weapon-controller';

// TODO: move logic somewhere
type Wave = {
  weaponType: WeaponType;
  lives: number;
};

const waveConfig: Wave[][] = [
  [{ weaponType: WeaponType.PISTOL, lives: 1 }],
  [
    { weaponType: WeaponType.PISTOL, lives: 1 },
    { weaponType: WeaponType.PISTOL, lives: 1 },
    { weaponType: WeaponType.PISTOL, lives: 1 },
  ],
  [
    { weaponType: WeaponType.PISTOL, lives: 1 },
    { weaponType: WeaponType.RIFLE, lives: 1 },
    { weaponType: WeaponType.PISTOL, lives: 1 },
  ],
  [
    { weaponType: WeaponType.RIFLE, lives: 1 },
    { weaponType: WeaponType.RIFLE, lives: 1 },
    { weaponType: WeaponType.RIFLE, lives: 1 },
  ],
  [
    { weaponType: WeaponType.RIFLE, lives: 1 },
    { weaponType: WeaponType.SHOTGUN, lives: 1 },
    { weaponType: WeaponType.RIFLE, lives: 1 },
  ],
  [
    { weaponType: WeaponType.SHOTGUN, lives: 1 },
    { weaponType: WeaponType.SHOTGUN, lives: 1 },
    { weaponType: WeaponType.SHOTGUN, lives: 1 },
  ],
];

export class ShooterScene extends Phaser.Scene {
  player: Unit;
  playerController: PlayerController;
  isGameOver = false;

  wave = 0;
  enemies: Phaser.GameObjects.Group;
  enemiesController: EnemiesController;

  weaponsController: WeaponController;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.weaponsController = new WeaponController(this);

    this.player = new Unit(this, WIDTH / 2, (HEIGHT / 4) * 3, 90, 3);
    this.player.setWeapon(
      this.weaponsController.createWeapon(WeaponType.PISTOL)
    );
    this.playerController = new PlayerController(this, this.player);

    this.enemies = this.add.group();
    this.enemiesController = new EnemiesController(
      this,
      this.enemies,
      this.player
    );

    // TODO: spawn on triggers
    this.spawnEnemy();

    this.physics.world.setBounds(0, -HEIGHT * 10, WIDTH, HEIGHT * 11);
    this.cameras.main.setBounds(0, -HEIGHT * 10, WIDTH, HEIGHT * 11);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, HEIGHT / 4);
  }

  update(time: number, delta: number) {
    if (!this.isGameOver) {
      this.playerController.update(time, delta);
      this.enemiesController.update(time, delta);
    }

    this.physics.collide(this.player, this.enemies);
    this.physics.collide(this.enemies, this.enemies);
    this.physics.collide(
      this.weaponsController.bullets,
      this.enemies,
      (_bullet: Bullet, _enemy: Unit) => {
        _bullet.destroy();
        _enemy.hit();
      }
    );
    this.physics.collide(
      this.weaponsController.bullets,
      this.player,
      (_bullet: Bullet, _player: Unit) => {
        _bullet.destroy();
        _player.hit();

        if (_player.lives <= 0) {
          this.isGameOver = true;
        }
      }
    );

    this.physics.overlap(
      this.weaponsController.weapons,
      this.enemies.getChildren().concat(this.player),
      (_weapon: Weapon, _unit: Unit) => {
        _unit.setWeapon(_weapon);
      }
    );
  }

  spawnEnemy() {
    const currentWave = waveConfig[this.wave];

    if (!currentWave) {
      return;
    }

    this.wave += 1;

    const deltaX = HEIGHT / (currentWave.length + 1);
    const newY = this.player.y - HEIGHT;

    currentWave.forEach((wave, index) => {
      const enemy = new Unit(this, deltaX * (index + 1), newY, -90, wave.lives);
      enemy.setWeapon(this.weaponsController.createWeapon(wave.weaponType));
      this.enemies.add(enemy);
    });
  }
}
