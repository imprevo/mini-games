import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { PlayerController } from './player-controller';
import { Unit } from './unit';

export class ShooterScene extends Phaser.Scene {
  player: Unit;
  playerController: PlayerController;
  isGameOver = false;

  enemies: Phaser.GameObjects.Group;
  enemiesController: EnemiesController;

  bullets: Phaser.GameObjects.Group;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.bullets = this.add.group();
    this.player = new Unit(
      this,
      WIDTH / 2,
      (HEIGHT / 4) * 3,
      90,
      400,
      this.bullets
    );
    this.playerController = new PlayerController(this, this.player);

    this.enemies = this.add.group();
    this.enemiesController = new EnemiesController(
      this,
      this.enemies,
      this.player
    );

    this.enemies.add(
      new Unit(this, WIDTH / 5, HEIGHT / 5, 90, 600, this.bullets)
    );
    this.enemies.add(
      new Unit(this, WIDTH / 2, HEIGHT / 5, 90, 800, this.bullets)
    );
    this.enemies.add(
      new Unit(this, (WIDTH / 10) * 8, HEIGHT / 5, 90, 1000, this.bullets)
    );

    // this.cameras.main.setBounds(0, 0, Infinity, 0);
    // this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number, delta: number) {
    if (!this.isGameOver) {
      this.playerController.update(time, delta);
      this.enemiesController.update(time, delta);
    }

    this.physics.collide(this.player, this.enemies);
    this.physics.collide(this.bullets, this.enemies, (_bullet, _enemy) => {
      _bullet.destroy();
      _enemy.destroy();
    });
    this.physics.collide(this.bullets, this.player, (_bullet, _player) => {
      _bullet.destroy();
      _player.destroy();
      this.isGameOver = true;
    });
  }
}
