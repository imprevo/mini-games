import { Unit } from './unit';

export class EnemiesController {
  scene: Phaser.Scene;
  enemies: Phaser.GameObjects.Group;
  player: Unit;

  constructor(scene: Phaser.Scene, player: Unit) {
    this.scene = scene;
    this.player = player;
    this.enemies = scene.add.group();
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
        const distance = Phaser.Math.Distance.BetweenPoints(enemy, this.player);
        if (distance < 300) {
          enemy.fire();
        } else {
          this.scene.physics.moveToObject(enemy, this.player, 8 * delta);
        }
      }
    });
  }
}
