import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';
import { Player } from './player';
import { PlayerController } from './player-controller';

export class ShooterScene extends Phaser.Scene {
  player: Player;
  playerController: PlayerController;
  isGameOver = false;

  enemies: Phaser.GameObjects.Group;
  bullets: Phaser.GameObjects.Group;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.bullets = this.add.group();
    this.player = new Player(
      this,
      WIDTH / 2,
      (HEIGHT / 4) * 3,
      90,
      400,
      this.bullets
    );
    this.playerController = new PlayerController(this, this.player);

    this.enemies = this.add.group();

    this.enemies.add(
      new Player(this, WIDTH / 5, HEIGHT / 5, -45, 600, this.bullets)
    );
    this.enemies.add(
      new Player(this, WIDTH / 2, HEIGHT / 5, -100, 800, this.bullets)
    );
    this.enemies.add(
      new Player(this, (WIDTH / 10) * 8, HEIGHT / 5, -135, 1000, this.bullets)
    );

    // this.cameras.main.setBounds(0, 0, Infinity, 0);
    // this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number) {
    if (!this.isGameOver) {
      this.playerController.update(time);
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

    this.enemies.getChildren().forEach((enemy: Player) => enemy.fire());
  }
}
