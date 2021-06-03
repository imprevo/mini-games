import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from './config';
import { ArcanoidScene } from './scenes/arcanoid';
import { FlappyBirdScene } from './scenes/flappy-bird';
import { MainScene } from './scenes/main';
import { PongScene } from './scenes/pong';
import { ShooterScene } from './scenes/shooter';
import { SnakeScene } from './scenes/snake';
import { SpaceInvadersScene } from './scenes/space-invaders';

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
  scene: [
    MainScene,
    PongScene,
    ArcanoidScene,
    SpaceInvadersScene,
    SnakeScene,
    FlappyBirdScene,
    ShooterScene,
  ],
});
