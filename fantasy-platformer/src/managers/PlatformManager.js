import { GAME_CONSTANTS } from '../utils/Constants.js';
import { Collision } from '../utils/Collision.js';

export class PlatformManager {
    constructor() {
        this.platforms = [
            { x: 0, y: 550, width: 400, height: 50 },
            { x: 600, y: 550, width: 400, height: 50 },
            { x: 1050, y: 550, width: 400, height: 50 },
            { x: 1600, y: 550, width: 400, height: 50 },
            { x: 200, y: 400, width: 100, height: 50 },
            { x: 400, y: 300, width: 300, height: 50 },
            { x: 800, y: 350, width: 200, height: 50 }
        ];
    }

    checkCollisions(player) {
        const prevY = player.y;
        player.isCollidingWithPlatform = false;
        
        for (const platform of this.platforms) {
            const collision = Collision.checkPlatformCollision(
                player, 
                platform, 
                GAME_CONSTANTS.PLATFORM.COLLISION_TOLERANCE
            );
            
            if (collision.fromAbove) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                player.jumpTime = 0;
                player.isCollidingWithPlatform = true;
                return true;
            }
            
            if (collision.fromBelow) {
                player.y = platform.y + platform.height;
                player.velocityY = Math.abs(player.velocityY * 0.5); // Bounce slightly
                player.isJumping = false;
                return true;
            }
        }
        return false;
    }

    isOnGround(player) {
        const tolerance = GAME_CONSTANTS.PLATFORM.COLLISION_TOLERANCE;
        return this.platforms.some(platform => {
            const distanceFromPlatform = (player.y + player.height) - platform.y;
            const horizontalOverlap = player.x + player.width > platform.x && 
                                    player.x < platform.x + platform.width;
            return distanceFromPlatform >= -tolerance && 
                   distanceFromPlatform <= tolerance && 
                   horizontalOverlap;
        });
    }

    getPlatformByIndex(index) {
        return this.platforms[index];
    }

    draw(ctx) {
 
        ctx.fillStyle = 'green';
        this.platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    // Helper method for enemy movement boundaries
    getPlatformBoundaries(platformIndex) {
        const platform = this.platforms[platformIndex];
        return {
            left: platform.x,
            right: platform.x + platform.width,
            top: platform.y
        };
    }
}