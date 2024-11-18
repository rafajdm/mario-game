import { GAME_CONSTANTS } from '../utils/Constants.js';

export class Player {
    constructor(x, y) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.PLAYER.WIDTH;
        this.height = GAME_CONSTANTS.PLAYER.HEIGHT;
        this.color = 'red';
        this.speed = GAME_CONSTANTS.PLAYER.SPEED;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = GAME_CONSTANTS.PLAYER.GRAVITY;
        this.isJumping = false;
        this.jumpTime = 0;
        this.maxJumpTime = GAME_CONSTANTS.PLAYER.MAX_JUMP_TIME;
        this.isCollidingWithPlatform = false;
        this.platformCollisionCooldown = 0;
        this.lives = GAME_CONSTANTS.PLAYER.INITIAL_LIVES;
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.jumpTime = 0;
        this.isCollidingWithPlatform = false;
        this.platformCollisionCooldown = 0;
    }

    update(inputManager, platformManager) {
        this.handleMovement(inputManager);
        this.handleJump(inputManager, platformManager);
        this.updateCooldowns();
    }
    
    handleJump(inputManager, platformManager) {
        const onGround = platformManager.isOnGround(this);
        
        if (inputManager.isActionActive('jump')) {
            if (!this.isJumping && onGround && this.velocityY >= 0) {
                this.isJumping = true;
                this.velocityY = -GAME_CONSTANTS.PLAYER.MAX_JUMP_STRENGTH;
            }
        }
        
        if (this.isJumping && !inputManager.isActionActive('jump')) {
            if (this.velocityY < 0) {
                this.velocityY *= 0.5;
            }
            this.isJumping = false;
        }
    }

    handleMovement(inputManager) {
        let moveDirection = 0;
        if (inputManager.isActionActive('moveRight')) moveDirection += 1;
        if (inputManager.isActionActive('moveLeft')) moveDirection -= 1;
        
        const targetSpeed = moveDirection * this.speed;
        const acceleration = GAME_CONSTANTS.PLAYER.ACCELERATION;
        
        if (Math.abs(targetSpeed - this.velocityX) > 0.1) {
            this.velocityX += Math.sign(targetSpeed - this.velocityX) * acceleration;
        } else {
            this.velocityX = targetSpeed;
        }
    }

    applyGravity() {
        if (!this.isCollidingWithPlatform) {
            this.velocityY += this.gravity;
            this.velocityY = Math.min(this.velocityY, GAME_CONSTANTS.PLAYER.MAX_VELOCITY_Y);
        }
    }

    updatePosition() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Check if player has fallen below ground level
        if (this.y > GAME_CONSTANTS.WORLD.GROUND_LEVEL) {
            const gameOverEvent = new Event('gameOver');
            window.dispatchEvent(gameOverEvent);
        }
    }

    updateCooldowns() {
        if (this.platformCollisionCooldown > 0) {
            this.platformCollisionCooldown--;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}