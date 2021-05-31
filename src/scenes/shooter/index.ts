import * as Phaser from 'phaser';
import { Bullet } from './bullet';
import { WIDTH, HEIGHT } from './config';
import { EnemiesController } from './enemies-controller';
import { HUDMessage, SceneMessage } from './messages';
import { PlayerController } from './player-controller';
import { SceneTrigger } from './scene-trigger';
import { Unit } from './unit';
import { wavesConfig, WaveController, waveDeltaY } from './wave-controller';
import { Weapon } from './weapon';
import { WeaponController, WeaponType } from './weapon-controller';

export class ShooterScene extends Phaser.Scene {
  player: Unit;
  playerController: PlayerController;
  isGameOver: boolean;
  killsCount: number;
  winTrigger: SceneTrigger;

  enemiesController: EnemiesController;
  weaponsController: WeaponController;
  waveController: WaveController;

  constructor() {
    super('ShooterScene');
  }

  create() {
    this.isGameOver = false;
    this.killsCount = 0;

    this.weaponsController = new WeaponController(this);

    this.player = new Unit(this, WIDTH / 2, (HEIGHT / 4) * 3, 90, 1);
    this.weaponsController.createWeapon(
      WeaponType.PISTOL,
      new Phaser.Math.Vector2(WIDTH / 2, HEIGHT / 2)
    );
    this.playerController = new PlayerController(this, this.player);
    this.enemiesController = new EnemiesController(this, this.player);
    this.waveController = new WaveController(
      this,
      this.weaponsController,
      this.enemiesController
    );
    this.waveController.addWaveTriggers();

    const lastWaveY = wavesConfig.length * waveDeltaY;
    const topY = lastWaveY + HEIGHT / 3;

    this.winTrigger = new SceneTrigger(this, WIDTH / 2, -lastWaveY);
    this.add.existing(this.winTrigger);
    this.add.existing(
      new SceneMessage(this, WIDTH / 2, -lastWaveY, 'GLORY TO THE WINNER!')
    );

    this.physics.world.setBounds(0, -topY, WIDTH, topY + HEIGHT);
    this.cameras.main.setBounds(0, -topY, WIDTH, topY + HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, HEIGHT / 3);

    this.input.keyboard.once('keydown_ESC', () => {
      this.scene.start('MainScene');
    });
  }

  update(time: number, delta: number) {
    if (!this.isGameOver) {
      this.playerController.update(time, delta);
      this.enemiesController.update(time, delta);
    } else {
      const keys = this.input.keyboard.createCursorKeys();
      const spaceJustUp = Phaser.Input.Keyboard.JustUp(keys.space);
      if (spaceJustUp) {
        this.scene.restart();
      }
    }

    this.physics.collide(this.player, this.enemiesController.enemies);
    this.physics.collide(
      this.enemiesController.enemies,
      this.enemiesController.enemies
    );
    this.physics.collide(
      this.weaponsController.bullets,
      this.enemiesController.enemies,
      (_bullet: Bullet, _enemy: Unit) => {
        _bullet.destroy();
        _enemy.hit();
        if (_enemy.lives <= 0) {
          this.killsCount += 1;
        }
      }
    );
    this.physics.collide(
      this.weaponsController.bullets,
      this.player,
      (_bullet: Bullet, _player: Unit) => {
        _bullet.destroy();
        _player.hit();

        if (_player.lives <= 0) {
          this.setGameOver(false);
        }
      }
    );

    this.physics.overlap(
      this.weaponsController.weapons,
      this.enemiesController.enemies.getChildren().concat(this.player),
      (_weapon: Weapon, _unit: Unit) => {
        _unit.setWeapon(_weapon);
      }
    );

    this.physics.overlap(
      this.waveController.waveTriggers,
      this.player,
      (_waveTrigger: SceneTrigger, _player: Unit) => {
        _waveTrigger.destroy();
        _player.updateLives(_player.lives + 1);
        this.waveController.spawnEnemy();
      }
    );

    this.physics.overlap(
      this.winTrigger,
      this.player,
      (_winTrigger: SceneTrigger, _player: Unit) => {
        _winTrigger.destroy();
        this.setGameOver(true);
      }
    );
  }

  setGameOver(isWin: boolean) {
    this.isGameOver = true;
    if (isWin) {
      const score = this.getScore();
      this.add.existing(
        new HUDMessage(this, WIDTH / 2, (HEIGHT / 4) * 3, `SCORE - ${score}`, {
          fontSize: '48px',
        })
      );
    } else {
      this.add.existing(
        new HUDMessage(this, WIDTH / 2, HEIGHT / 3, 'GAME OVER')
      );
      this.add.existing(
        new HUDMessage(
          this,
          WIDTH / 2,
          (HEIGHT / 4) * 3,
          'press SPACE to restart',
          { fontSize: '48px' }
        )
      );
    }
  }

  getScore() {
    const lives = this.player.lives * 1000;
    const kills = this.killsCount * 500;
    return lives + kills;
  }
}
