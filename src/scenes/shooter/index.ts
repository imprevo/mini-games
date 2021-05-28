import * as Phaser from 'phaser';
import { Bullet } from './bullet';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { PlayerController } from './player-controller';
import { Unit } from './unit';
import { Weapon } from './weapon';
import { WeaponController, WeaponType } from './weapon-controller';

export class ShooterScene extends Phaser.Scene {
  player: Unit;
  playerController: PlayerController;
  isGameOver = false;

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

    this.weaponsController.createWeapon(
      WeaponType.PISTOL,
      new Phaser.Math.Vector2(WIDTH * 0.25, HEIGHT / 3)
    );
    this.weaponsController.createWeapon(
      WeaponType.RIFLE,
      new Phaser.Math.Vector2(WIDTH * 0.5, HEIGHT / 3)
    );
    this.weaponsController.createWeapon(
      WeaponType.SHOTGUN,
      new Phaser.Math.Vector2(WIDTH * 0.75, HEIGHT / 3)
    );

    this.enemies.add(new Unit(this, WIDTH / 5, HEIGHT / 5, 90, 1));
    this.enemies.add(new Unit(this, WIDTH / 2, HEIGHT / 5, 90, 2));
    this.enemies.add(new Unit(this, (WIDTH / 10) * 8, HEIGHT / 5, 90, 3));

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
}
