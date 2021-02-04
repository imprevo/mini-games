import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from './config';
import { ArcanoidScene } from './scenes/arcanoid';
import { MainScene } from './scenes/main';
import { PongScene } from './scenes/pong';
import { SnakeScene } from './scenes/snake';
import { SpaceInvadersScene } from './scenes/space-invaders';

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
      debug: process.env.NODE_ENV !== 'production',
    },
  },
  backgroundColor: '#000000',
  scene: [MainScene, PongScene, ArcanoidScene, SpaceInvadersScene, SnakeScene],
});
