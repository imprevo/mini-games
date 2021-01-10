import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from '../config';

const PLAYER_SPEED = 300;
const BULLET_SPEED = 500;
const PLAYER_FIRE_RATE = 500;
const ENEMY_BULLET_SPEED = 400;
const ENEMY_FIRE_RATE = 1000;
const LIVES = 3;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

type GameObjectWithPhysics = Phaser.GameObjects.Shape & {
  body: Phaser.Physics.Arcade.Body;
};

class Bullet extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, fillColor: number) {
    super(scene, -100, -100, 4, 20, fillColor);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire(body: Phaser.Physics.Arcade.Body, velocityY: number) {
    this.body.x = body.x + (body.width - this.width) / 2;
    this.body.y = velocityY < 0 ? body.y - body.height : body.y + body.height;
    this.body.setVelocityY(velocityY);
  }
}

class Player extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;
  keyboardKeys: Record<'left' | 'right' | 'start', Phaser.Input.Keyboard.Key>;
  nextBulletTime = 0;
  bullets: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, bullets: Phaser.GameObjects.Group) {
    super(scene, WIDTH / 2, HEIGHT - 20, 50, 20, 0xffffff);
    this.bullets = bullets;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.immovable = true;
    this.keyboardKeys = {
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      start: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  }

  update(time: number) {
    if (this.keyboardKeys.left.isDown) {
      this.body.setVelocityX(-PLAYER_SPEED);
    } else if (this.keyboardKeys.right.isDown) {
      this.body.setVelocityX(PLAYER_SPEED);
    } else {
      this.body.setVelocityX(0);
    }

    this.body.x = clamp(this.body.x, 0, WIDTH - this.body.width);

    if (this.keyboardKeys.start.isDown && this.nextBulletTime < time) {
      this.nextBulletTime = time + PLAYER_FIRE_RATE;
      this.fire();
    }
  }

  fire() {
    const bullet = new Bullet(this.scene, 0x0000ff);
    bullet.fire(this.body, -BULLET_SPEED);
    this.bullets.add(bullet);
  }
}

export class SpaceInvadersScene extends Phaser.Scene {
  player: Player;
  keyboardKeys: Record<'enter', Phaser.Input.Keyboard.Key>;

  bullets: Phaser.GameObjects.Group;
  bulletsTrigger: GameObjectWithPhysics;

  enemies: Phaser.GameObjects.Group;
  enemyBullets: Phaser.GameObjects.Group;
  enemiesTrigger: GameObjectWithPhysics;
  nextEnemyBulletTime = 0;

  livesLabel: Phaser.GameObjects.Text;
  levelLabel: Phaser.GameObjects.Text;
  gameOverLabel: Phaser.GameObjects.Text;

  isGameOver = false;
  lives = LIVES;
  level = 1;

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'ArcanoidGame',
    });
  }

  create() {
    this.livesLabel = this.add.text(20, 20, '');
    this.updateLives(LIVES);

    this.levelLabel = this.add.text(20, 40, '');
    this.updateLevel(this.level);

    this.gameOverLabel = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'YOU LOOSE', { fontSize: 30 })
      .setOrigin(0.5)
      .setDepth(1);
    this.gameOverLabel.setVisible(false);

    this.bullets = this.add.group();
    this.player = new Player(this, this.bullets);

    this.keyboardKeys = {
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.bulletsTrigger = this.add.rectangle(
      WIDTH / 2,
      -100,
      WIDTH,
      50,
      0x00ff00
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.bulletsTrigger);
    this.bulletsTrigger.body.immovable = true;

    this.enemies = this.add.group();
    this.addEnemies();
    this.enemiesTrigger = this.add.rectangle(
      WIDTH / 2,
      HEIGHT + 25,
      WIDTH,
      50,
      0x00ff00
    ) as GameObjectWithPhysics;
    this.physics.add.existing(this.enemiesTrigger);
    this.enemiesTrigger.body.immovable = true;

    this.enemyBullets = this.add.group();
  }

  update(time: number) {
    if (this.isGameOver) {
      if (this.keyboardKeys.enter.isDown) {
        this.startGame();
      }
    } else {
      this.player.update(time);

      if (this.nextEnemyBulletTime < time) {
        if (this.nextEnemyBulletTime) {
          this.enemyFire();
        }
        this.nextEnemyBulletTime = time + ENEMY_FIRE_RATE;
      }

      if (this.lives <= 0) {
        this.gameOver();
      }

      this.physics.collide(this.bullets, this.enemies, (bullet, enemy) => {
        bullet.destroy();
        enemy.destroy();

        if (this.enemies.countActive() <= 0) {
          this.addEnemies();
          this.updateLevel(this.level + 1);
        }
      });

      this.physics.collide(this.bullets, this.bulletsTrigger, (bullet) => {
        bullet.destroy();
      });

      this.physics.collide(this.enemies, this.enemiesTrigger, () => {
        this.gameOver();
      });

      this.physics.collide(this.enemies, this.player, (enemy) => {
        this.updateLives(this.lives - 1);
        enemy.destroy();
      });

      this.physics.collide(this.enemyBullets, this.player, (enemy) => {
        this.updateLives(this.lives - 1);
        enemy.destroy();
      });

      this.physics.collide(this.enemyBullets, this.enemiesTrigger, (bullet) => {
        bullet.destroy();
      });

      this.physics.collide(
        this.enemyBullets,
        this.bullets,
        (bullet1, bullet2) => {
          bullet1.destroy();
          bullet2.destroy();
        }
      );
    }
  }

  startGame() {
    this.isGameOver = false;
    this.gameOverLabel.setVisible(false);
    this.updateLives(LIVES);
    this.updateLevel(1);
    this.addEnemies();
  }

  gameOver() {
    this.isGameOver = true;
    this.gameOverLabel.setVisible(true);
  }

  addEnemies() {
    this.enemies.clear(true, true);
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 4; row++) {
        const x = 175 + 50 * col;
        const y = 100 + 50 * row;
        const enemy = this.add.rectangle(
          x,
          y,
          20,
          20,
          0xff0000
        ) as GameObjectWithPhysics;
        this.physics.add.existing(enemy);
        enemy.body.immovable = true;
        enemy.body.setVelocityY(5);
        this.tweens.add({
          targets: enemy,
          x: { from: x - 150, to: x + 150 },
          ease: 'Linear',
          duration: 3000,
          loop: -1,
          yoyo: true,
        });
        this.enemies.add(enemy);
      }
    }
  }

  enemyFire() {
    const enemies = this.enemies.getChildren();
    const rnd = Phaser.Math.RND.between(0, enemies.length);
    const enemy = enemies[rnd] as GameObjectWithPhysics;

    if (enemy) {
      const bullet = new Bullet(this, 0xff00ff);
      bullet.fire(enemy.body, ENEMY_BULLET_SPEED);
      this.enemyBullets.add(bullet);
    }
  }

  updateLives(lives: number) {
    this.lives = lives;
    this.livesLabel.text = `Lives: ${this.lives}`;
  }

  updateLevel(level: number) {
    this.level = level;
    this.levelLabel.text = `Level: ${this.level}`;
  }
}
