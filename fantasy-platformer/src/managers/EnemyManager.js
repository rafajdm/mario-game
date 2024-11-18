import { Enemy } from '../entities/Enemy.js';
import { GAME_CONSTANTS } from '../utils/Constants.js';
import { Collision } from '../utils/Collision.js';

export class EnemyManager {
    constructor(platformManager) {
        this.platformManager = platformManager;
        this.enemies = this.initializeEnemies();
    }

    initializeEnemies() {
        return [
            // Blue ground enemy
            new Enemy(
                640,
                500,
                GAME_CONSTANTS.ENEMY.WIDTH,
                GAME_CONSTANTS.ENEMY.HEIGHT,
                'blue',
                GAME_CONSTANTS.ENEMY.GROUND_SPEED,
                1,
                this.platformManager.platforms[1]
            ),
            // Green platform enemy
            new Enemy(
                200,
                this.platformManager.platforms[2].y - GAME_CONSTANTS.ENEMY.HEIGHT,
                GAME_CONSTANTS.ENEMY.WIDTH,
                GAME_CONSTANTS.ENEMY.HEIGHT,
                'green',
                GAME_CONSTANTS.ENEMY.PLATFORM_SPEED,
                1,
                this.platformManager.platforms[2]
            )
        ];
    }

    update() {
        this.enemies.forEach(enemy => enemy.update());
    }

    checkCollisions(player) {
        for (const enemy of this.enemies) {
            if (Collision.checkRectCollision(player, enemy)) {
                if (this.isPlayerAboveEnemy(player, enemy)) {
                    // Bounce player up when defeating enemy
                    player.velocityY = -GAME_CONSTANTS.PLAYER.MAX_JUMP_STRENGTH * 0.7;
                    this.removeEnemy(enemy);
                } else {
                    this.handlePlayerDeath(player);
                }
                return true;
            }
        }
        return false;
    }

    isPlayerAboveEnemy(player, enemy) {
        const playerBottom = player.y + player.height;
        const enemyMidpoint = enemy.y + enemy.height / 2;
        
        return playerBottom <= enemyMidpoint && player.velocityY > 0;
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    handlePlayerDeath(player) {
        // Only dispatch the game over event
        const gameOverEvent = new CustomEvent('gameOver', {
            detail: { 
                score: 0,
                lives: player.lives - 1
            }
        });
        window.dispatchEvent(gameOverEvent);
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }

    reset() {
        this.enemies = this.initializeEnemies();
    }
}
