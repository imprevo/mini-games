import { Player } from './player';

export class PlayerController {
  scene: Phaser.Scene;
  player: Player;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;
  }

  update(time: number, delta: number) {
    const keys = this.scene.input.keyboard.createCursorKeys();

    if (keys.left.isDown) {
      this.player.rotate(-5);
    } else if (keys.right.isDown) {
      this.player.rotate(5);
    }

    if (keys.up.isDown) {
      this.player.move(200);
    } else if (keys.down.isDown) {
      this.player.move(-150);
    }

    if (keys.space.isDown) {
      this.player.fire();
    }
  }
}
