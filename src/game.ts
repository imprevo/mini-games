import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from './config';
import { StartScene } from './scenes/start';

const root = document.getElementById('game');

export const game = new Phaser.Game({
  parent: root,
  title: 'Mini games',
  type: Phaser.AUTO,
  scale: {
    width: WIDTH,
    height: HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: process.env.NODE_ENV !== 'production',
    },
  },
  backgroundColor: '#000000',
  scene: StartScene,
});
