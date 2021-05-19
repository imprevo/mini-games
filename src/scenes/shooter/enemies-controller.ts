import { Unit } from './unit';

export class EnemiesController {
  scene: Phaser.Scene;
  enemies: Phaser.GameObjects.Group;
  player: Unit;

  constructor(
    scene: Phaser.Scene,
    enemies: Phaser.GameObjects.Group,
    player: Unit
  ) {
    this.scene = scene;
    this.enemies = enemies;
    this.player = player;
  }

  update(time: number, delta: number) {
    this.enemies.getChildren().forEach((enemy: Unit) => {
      const rotationToPlayer = Phaser.Math.Angle.BetweenPoints(
        enemy,
        this.player
      );
      const deltaRotation = Phaser.Math.Angle.RotateTo(
        enemy.rotation,
        rotationToPlayer,
        0.001 * delta
      );

      enemy.rotation = deltaRotation;

      const diff = Phaser.Math.Angle.ShortestBetween(
        Phaser.Math.RadToDeg(enemy.rotation),
        Phaser.Math.RadToDeg(rotationToPlayer)
      );

      if (Math.abs(diff) < 10) {
        enemy.fire();
      }
    });
  }
}
