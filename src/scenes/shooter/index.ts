import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';
import { Player } from './player';
import { PlayerController } from './player-controller';

export class ShooterScene extends Phaser.Scene {
  player: Player;
  playerController: PlayerController;

  enemies: Phaser.GameObjects.Group;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.player = new Player(this, WIDTH / 2, (HEIGHT / 3) * 2, 90);
    this.playerController = new PlayerController(this, this.player);

    this.enemies = this.add.group();

    this.enemies.add(new Player(this, WIDTH / 5, HEIGHT / 5, -45));
    this.enemies.add(new Player(this, WIDTH / 2, HEIGHT / 5, -90));
    this.enemies.add(new Player(this, (WIDTH / 10) * 8, HEIGHT / 5, -135));

    // this.cameras.main.setBounds(0, 0, Infinity, 0);
    // this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number) {
    this.playerController.update(time);

    this.enemies.getChildren().forEach((enemy: Player) => enemy.fire());
  }
}
