import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from './config';
import { ArcanoidScene } from './scenes/arcanoid';
import { PongScene } from './scenes/pong';

export const game = new Phaser.Game({
  title: 'Sample',
  type: Phaser.AUTO,
  scale: {
    width: WIDTH,
    height: HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  backgroundColor: '#000000',
  scene: ArcanoidScene,
});
