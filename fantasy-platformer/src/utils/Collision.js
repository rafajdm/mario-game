export const Collision = {
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },

    checkPlatformCollision(object, platform, tolerance) {
        const prevY = object.y - object.velocityY;
        const prevBottom = prevY + object.height;
        
        const overlapX = object.x + object.width > platform.x && 
                        object.x < platform.x + platform.width;
        
        const fromBelow = object.velocityY < 0 && 
                         prevY >= platform.y + platform.height &&
                         object.y <= platform.y + platform.height + tolerance &&
                         overlapX;
        
        const fromAbove = object.velocityY >= 0 && 
                         prevBottom <= platform.y &&
                         object.y + object.height >= platform.y - tolerance &&
                         overlapX;
        
        return { overlapX, fromBelow, fromAbove };
    }
};