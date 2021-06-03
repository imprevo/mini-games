import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from '../../config';
import { subscribeToExit } from '../../utils/menu';

const PLAYER_SPEED = 300;
const BULLET_SPEED = 500;
const PLAYER_FIRE_RATE = 500;
const ENEMY_BULLET_SPEED = 400;
const ENEMY_FIRE_RATE = 1000;
const LIVES = 3;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

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
      this.stop();
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

  stop() {
    this.body.setVelocityX(0);
  }
}

class Enemy extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;
  bullets: Phaser.GameObjects.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bullets: Phaser.GameObjects.Group
  ) {
    super(scene, x, y, 20, 20, 0xff0000);
    this.bullets = bullets;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.immovable = true;
  }

  move(x) {
    this.body.setVelocityY(5);
    this.scene.tweens.add({
      targets: this,
      x: { from: x - 150, to: x + 150 },
      ease: 'Linear',
      duration: 3000,
      loop: -1,
      yoyo: true,
    });
  }

  fire() {
    const bullet = new Bullet(this.scene, 0xff00ff);
    bullet.fire(this.body, ENEMY_BULLET_SPEED);
    this.bullets.add(bullet);
  }
}

class EnemyGroup extends Phaser.GameObjects.Group {
  bullets: Phaser.GameObjects.Group;
  nextBulletTime = 0;

  constructor(scene: Phaser.Scene, bullets: Phaser.GameObjects.Group) {
    super(scene);
    this.bullets = bullets;
    scene.add.existing(this);
  }

  create() {
    this.nextBulletTime = 0;
  }

  update(time: number) {
    if (this.nextBulletTime < time) {
      if (this.nextBulletTime) {
        this.enemyFire();
      }
      this.nextBulletTime = time + ENEMY_FIRE_RATE;
    }
  }

  addEnemies() {
    this.clear(true, true);
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 4; row++) {
        const x = 175 + 50 * col;
        const y = 100 + 50 * row;
        const enemy = new Enemy(this.scene, x, y, this.bullets);
        enemy.move(x);
        this.add(enemy);
      }
    }
  }

  enemyFire() {
    const enemies = this.getChildren() as Enemy[];
    const rnd = Phaser.Math.RND.between(0, enemies.length);
    const enemy = enemies[rnd];

    if (enemy) {
      enemy.fire();
    }
  }
}

class Trigger extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, WIDTH, 50, 0x00ff00);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.immovable = true;
  }
}

export class SpaceInvadersScene extends Phaser.Scene {
  player: Player;
  keyboardKeys: Record<'enter', Phaser.Input.Keyboard.Key>;

  playerBullets: Phaser.GameObjects.Group;
  bulletsTrigger: Trigger;

  enemies: EnemyGroup;
  enemyBullets: Phaser.GameObjects.Group;
  enemiesTrigger: Trigger;

  livesLabel: Phaser.GameObjects.Text;
  levelLabel: Phaser.GameObjects.Text;
  gameOverLabel: Phaser.GameObjects.Text;

  isGameOver = false;
  lives = LIVES;
  level = 1;

  create() {
    this.isGameOver = false;

    this.livesLabel = this.add.text(20, 20, '');
    this.updateLives(LIVES);

    this.levelLabel = this.add.text(20, 40, '');
    this.updateLevel(1);

    this.gameOverLabel = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'YOU LOOSE', { fontSize: '30px' })
      .setOrigin(0.5)
      .setDepth(1);
    this.gameOverLabel.setVisible(false);

    this.playerBullets = this.add.group();
    this.enemyBullets = this.add.group();

    this.player = new Player(this, this.playerBullets);

    this.keyboardKeys = {
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.bulletsTrigger = new Trigger(this, WIDTH / 2, -100);
    this.enemiesTrigger = new Trigger(this, WIDTH / 2, HEIGHT + 25);

    this.enemies = new EnemyGroup(this, this.enemyBullets);
    this.enemies.addEnemies();

    subscribeToExit(this);
  }

  update(time: number) {
    if (this.isGameOver) {
      if (this.keyboardKeys.enter.isDown) {
        this.startGame();
      }
      this.player.stop();
    } else {
      this.player.update(time);
      this.enemies.update(time);

      if (this.lives <= 0) {
        this.gameOver();
      }

      this.physics.collide(
        this.playerBullets,
        this.enemies,
        (bullet, enemy) => {
          bullet.destroy();
          enemy.destroy();

          if (this.enemies.countActive() <= 0) {
            this.enemies.addEnemies();
            this.updateLevel(this.level + 1);
          }
        }
      );

      this.physics.collide(
        this.playerBullets,
        this.bulletsTrigger,
        (bullet) => {
          bullet.destroy();
        }
      );

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
        this.playerBullets,
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
    this.enemies.addEnemies();
    this.enemyBullets.clear(true, true);
    this.playerBullets.clear(true, true);
  }

  gameOver() {
    this.isGameOver = true;
    this.gameOverLabel.setVisible(true);
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
