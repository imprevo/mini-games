import { Player } from './player';

export class EnemiesController {
  scene: Phaser.Scene;
  enemies: Phaser.GameObjects.Group;
  player: Player;

  constructor(
    scene: Phaser.Scene,
    enemies: Phaser.GameObjects.Group,
    player: Player
  ) {
    this.scene = scene;
    this.enemies = enemies;
    this.player = player;
  }

  update(time: number, delta: number) {
    this.enemies.getChildren().forEach((enemy: Player) => {
      const rotation = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );
      enemy.rotation = rotation + 0.3;

      enemy.fire();
    });
  }
}
