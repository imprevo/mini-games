import * as Phaser from 'phaser';
import { WIDTH } from '../config';

const STYLE_DEFAULT = {
  color: '#fff',
  fontSize: '16px',
};
const STYLE_FOCUS = {
  color: '#f0f',
  fontSize: '20px',
};

class MenuItem extends Phaser.GameObjects.Text {
  action: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    action: () => void
  ) {
    super(scene, x, y, text, STYLE_DEFAULT);
    this.action = action;
    this.setOrigin(0.5);
    scene.add.existing(this);
  }

  setFocus(focus: boolean) {
    this.setStyle(focus ? STYLE_FOCUS : STYLE_DEFAULT);
  }
}

export class MainScene extends Phaser.Scene {
  activeButton = 0;
  buttons: MenuItem[];

  constructor() {
    super('MainScene');
  }

  create() {
    this.add
      .text(WIDTH / 2, 200, 'CHOOSE GAME', { fontSize: '32px' })
      .setOrigin(0.5);

    this.buttons = [
      new MenuItem(this, WIDTH / 2, 300, 'PONG', () => {
        this.scene.start('PongScene');
      }),
      new MenuItem(this, WIDTH / 2, 350, 'ARCANOID', () => {
        this.scene.start('ArcanoidScene');
      }),
      new MenuItem(this, WIDTH / 2, 400, 'SPACE INVADERS', () => {
        this.scene.start('SpaceInvadersScene');
      }),
      new MenuItem(this, WIDTH / 2, 450, 'SNAKE', () => {
        this.scene.start('SnakeScene');
      }),
      new MenuItem(this, WIDTH / 2, 500, 'FLAPPY BIRD', () => {
        this.scene.start('FlappyBirdScene');
      }),
    ];

    this.input.keyboard.on('keydown_UP', () => {
      this.changeActive(-1);
    });

    this.input.keyboard.on('keydown_DOWN', () => {
      this.changeActive(1);
    });

    this.input.keyboard.on('keydown_ENTER', () => {
      const button = this.buttons[this.activeButton];
      if (button) {
        button.action();
      }
    });

    this.updateMenu();
  }

  changeActive(change: number) {
    this.activeButton += change;
    if (this.activeButton < 0) {
      this.activeButton = this.buttons.length - 1;
    }
    if (this.activeButton > this.buttons.length - 1) {
      this.activeButton = 0;
    }

    this.updateMenu();
  }

  updateMenu() {
    this.buttons.forEach((button, index) => {
      button.setFocus(index === this.activeButton);
    });
  }
}
