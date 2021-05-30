import * as Phaser from 'phaser';
import { Bullet } from './bullet';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { PlayerController } from './player-controller';
import { Unit } from './unit';
import {
  wavesConfig,
  WaveController,
  WaveTrigger,
  waveDeltaY,
} from './wave-controller';
import { Weapon } from './weapon';
import { WeaponController, WeaponType } from './weapon-controller';

export class ShooterScene extends Phaser.Scene {
  player: Unit;
  playerController: PlayerController;
  isGameOver = false;

  enemiesController: EnemiesController;
  weaponsController: WeaponController;
  waveController: WaveController;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.weaponsController = new WeaponController(this);

    this.player = new Unit(this, WIDTH / 2, (HEIGHT / 4) * 3, 90, 1);
    this.weaponsController.createWeapon(
      WeaponType.PISTOL,
      new Phaser.Math.Vector2(WIDTH / 2, HEIGHT / 2)
    );
    this.playerController = new PlayerController(this, this.player);
    this.enemiesController = new EnemiesController(this, this.player);
    this.waveController = new WaveController(
      this,
      this.weaponsController,
      this.enemiesController
    );
    this.waveController.addWaveTriggers();

    const topY = wavesConfig.length * waveDeltaY;
    this.physics.world.setBounds(0, -topY, WIDTH, topY + HEIGHT);
    this.cameras.main.setBounds(0, -topY, WIDTH, topY + HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, HEIGHT / 3);
  }

  update(time: number, delta: number) {
    if (!this.isGameOver) {
      this.playerController.update(time, delta);
      this.enemiesController.update(time, delta);
    }

    this.physics.collide(this.player, this.enemiesController.enemies);
    this.physics.collide(
      this.enemiesController.enemies,
      this.enemiesController.enemies
    );
    this.physics.collide(
      this.weaponsController.bullets,
      this.enemiesController.enemies,
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
      this.enemiesController.enemies.getChildren().concat(this.player),
      (_weapon: Weapon, _unit: Unit) => {
        _unit.setWeapon(_weapon);
      }
    );

    this.physics.overlap(
      this.waveController.waveTriggers,
      this.player,
      (_waveTrigger: WaveTrigger, _player: Unit) => {
        _waveTrigger.destroy();
        _player.updateLives(_player.lives + 1);
        this.waveController.spawnEnemy();
      }
    );
  }
}
