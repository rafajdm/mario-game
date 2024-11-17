import { GAME_CONSTANTS } from '../utils/Constants.js';

export class Enemy {
    constructor(x, y, width, height, color, speed, direction, boundaryPlatform) {
        this.x = x;
        this.y = y;
        this.width = width || GAME_CONSTANTS.ENEMY.WIDTH;
        this.height = height || GAME_CONSTANTS.ENEMY.HEIGHT;
        this.color = color;
        this.speed = speed;
        this.direction = direction;
        this.boundaryPlatform = boundaryPlatform;
        this.margin = 2; // Small margin to prevent edge sticking
    }

    update() {
        const nextX = this.x + this.speed * this.direction;
        if (this.isWithinBoundaries(nextX)) {
            this.x = nextX;
        } else {
            this.reverseDirection();
        }
    }

    isWithinBoundaries(nextX) {
        return nextX >= this.boundaryPlatform.x + this.margin && 
               nextX + this.width <= this.boundaryPlatform.x + this.boundaryPlatform.width - this.margin;
    }

    reverseDirection() {
        this.direction *= -1;
        // Adjust position to prevent sticking at edges
        this.x = this.direction === 1 ? 
            this.boundaryPlatform.x + this.margin : 
            this.boundaryPlatform.x + this.boundaryPlatform.width - this.width - this.margin;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
