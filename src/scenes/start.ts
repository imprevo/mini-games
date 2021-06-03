import * as Phaser from 'phaser';
import { Scenes } from '../config';
import { ArcanoidScene } from './arcanoid';
import { FlappyBirdScene } from './flappy-bird';
import { MainScene } from './main';
import { PongScene } from './pong';
import { ShooterScene } from './shooter';
import { SnakeScene } from './snake';
import { SpaceInvadersScene } from './space-invaders';

const urlParams = new URLSearchParams(window.location.search);
const defaultScene = urlParams.get('scene') || Scenes.MAIN;

export class StartScene extends Phaser.Scene {
  create() {
    this.scene.add(Scenes.MAIN, MainScene, false);
    this.scene.add(Scenes.PONG, PongScene, false);
    this.scene.add(Scenes.ARCANOID, ArcanoidScene, false);
    this.scene.add(Scenes.SPACE_INVADERS, SpaceInvadersScene, false);
    this.scene.add(Scenes.SNAKE, SnakeScene, false);
    this.scene.add(Scenes.FLAPPY_BIRD, FlappyBirdScene, false);
    this.scene.add(Scenes.SHOOTER, ShooterScene, false);

    this.scene.start(defaultScene);
  }
}
