import * as Phaser from 'phaser';

export class SceneMessage extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, { fontSize: '64px' });
    this.setOrigin(0.5);
    this.setDepth(0);
  }
}
