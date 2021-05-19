import { Unit } from './unit';

export class PlayerController {
  scene: Phaser.Scene;
  player: Unit;

  constructor(scene: Phaser.Scene, player: Unit) {
    this.scene = scene;
    this.player = player;
  }

  update(time: number, delta: number) {
    const keys = this.scene.input.keyboard.createCursorKeys();

    if (keys.left.isDown) {
      this.player.rotate(-0.3 * delta);
    } else if (keys.right.isDown) {
      this.player.rotate(0.3 * delta);
    }

    if (keys.up.isDown) {
      this.player.move(15 * delta);
    } else if (keys.down.isDown) {
      this.player.move(-10 * delta);
    }

    if (keys.space.isDown) {
      this.player.fire();
    }
  }
}
