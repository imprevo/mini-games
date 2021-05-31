import * as Phaser from 'phaser';

export class SceneMessage extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, {
      color: '#fff',
      stroke: '#333',
      strokeThickness: 2,
      fontSize: '64px',
      ...style,
    });
    this.setOrigin(0.5);
    this.setDepth(-1);
  }
}

export class HUDMessage extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, {
      color: '#fff',
      stroke: '#333',
      strokeThickness: 2,
      fontSize: '64px',
      ...style,
    });

    this.setOrigin(0.5);
    this.setDepth(1);
    this.setScrollFactor(0, 0);
  }
}
