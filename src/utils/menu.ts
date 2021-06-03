import * as Phaser from 'phaser';
import { Scenes } from '../config';

export const subscribeToExit = (scene: Phaser.Scene) => {
  scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      scene.scene.start(Scenes.MAIN);
    }
  });
};
