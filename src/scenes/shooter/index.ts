import * as Phaser from 'phaser';
import { WIDTH, HEIGHT } from './config';
import { Player } from './player';
import { PlayerController } from './player-controller';

export class ShooterScene extends Phaser.Scene {
  player: Player;
  playerController: PlayerController;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.player = new Player(this, WIDTH / 2, HEIGHT / 2);
    this.playerController = new PlayerController(this, this.player);

    // this.cameras.main.setBounds(0, 0, Infinity, 0);
    // this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number) {
    this.playerController.update(time);
  }
}
