import { GAME_CONSTANTS } from '../utils/Constants.js';

export class UIRenderer {
    constructor(game) {
        this.game = game;
    }

    drawUI(ctx, lives) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        this.drawLives(ctx, lives);
        
        ctx.restore();
    }

    drawLives(ctx, lives) {
        const { RADIUS, PADDING, START_X, START_Y } = GAME_CONSTANTS.UI.LIVES;
        
        ctx.fillStyle = GAME_CONSTANTS.UI.LIVES.COLOR;
        for (let i = 0; i < lives; i++) {
            ctx.beginPath();
            ctx.arc(
                START_X + (RADIUS * 2 + PADDING) * i,
                START_Y,
                RADIUS,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    drawMenu(ctx) {
        this.game.draw();
        
        ctx.save();
        this.drawOverlay(ctx);
        this.drawMenuButton(ctx);
        ctx.restore();
    }

    drawOverlay(ctx) {
        ctx.fillStyle = GAME_CONSTANTS.UI.OVERLAY_COLOR;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    drawMenuButton(ctx) {
        const { BUTTON_WIDTH, BUTTON_HEIGHT } = GAME_CONSTANTS.UI.MENU;
        const buttonX = (this.game.canvas.width - BUTTON_WIDTH) / 2;
        const buttonY = (this.game.canvas.height - BUTTON_HEIGHT) / 2;
        
        let buttonColor = this.game.isMouseOverButton ? 
            GAME_CONSTANTS.UI.MENU.BUTTON_HOVER_COLOR : 
            GAME_CONSTANTS.UI.MENU.BUTTON_COLOR;
            
        if (this.game.stateManager.current === GAME_CONSTANTS.GAME_STATE.MENU) {
            buttonColor = GAME_CONSTANTS.UI.MENU.BUTTON_FOCUS_COLOR;
            this.drawButtonFocus(ctx, buttonX, buttonY, BUTTON_WIDTH, BUTTON_HEIGHT);
        }
        
        this.drawButton(ctx, buttonX, buttonY, BUTTON_WIDTH, BUTTON_HEIGHT, buttonColor);
        this.drawButtonText(ctx, buttonX, buttonY, BUTTON_WIDTH, BUTTON_HEIGHT);
    }

    drawButtonFocus(ctx, x, y, width, height) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    }

    drawButton(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    drawButtonText(ctx, x, y, width, height) {
        ctx.fillStyle = GAME_CONSTANTS.UI.MENU.TEXT_COLOR;
        ctx.font = GAME_CONSTANTS.UI.MENU.FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('New Game', x + width/2, y + height/2);
    }

    drawLevelComplete(ctx) {
        // Draw semi-transparent overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw "Level Complete!" text
        ctx.fillStyle = GAME_CONSTANTS.UI.LEVEL_COMPLETE.TEXT_COLOR;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Level Complete!', ctx.canvas.width/2, ctx.canvas.height/3);
        
        // Draw continue button
        const buttonWidth = GAME_CONSTANTS.UI.LEVEL_COMPLETE.BUTTON_WIDTH;
        const buttonHeight = GAME_CONSTANTS.UI.LEVEL_COMPLETE.BUTTON_HEIGHT;
        const buttonX = (ctx.canvas.width - buttonWidth) / 2;
        const buttonY = ctx.canvas.height/2;
        
        ctx.fillStyle = GAME_CONSTANTS.UI.LEVEL_COMPLETE.BUTTON_COLOR;
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.fillStyle = GAME_CONSTANTS.UI.LEVEL_COMPLETE.TEXT_COLOR;
        ctx.font = GAME_CONSTANTS.UI.LEVEL_COMPLETE.FONT;
        ctx.fillText('Continue', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
        
        ctx.restore();
    }
}