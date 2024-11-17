import { GAME_CONSTANTS } from '../utils/Constants.js';

export class MenuManager {
    constructor(game) {
        this.game = game;
        this.selectedButton = 0;
        this.buttons = [
            { 
                text: 'Restart Game', 
                action: () => this.game.stateManager.startNewGame()
            },
            { 
                text: 'Main Menu', 
                action: () => this.game.stateManager.returnToMenu()
            }
        ];
    }

    update() {
        if (this.game.stateManager.current === GAME_CONSTANTS.GAME_STATE.GAME_OVER) {
            if (this.game.inputManager.isActionActive('menuUp')) {
                this.selectedButton = Math.max(0, this.selectedButton - 1);
            }
            if (this.game.inputManager.isActionActive('menuDown')) {
                this.selectedButton = Math.min(this.buttons.length - 1, this.selectedButton + 1);
            }
            if (this.game.inputManager.isActionActive('confirm')) {
                this.buttons[this.selectedButton].action();
            }
        }
    }

    handleKeyDown(event) {
        if (this.game.stateManager.current === GAME_CONSTANTS.GAME_STATE.GAME_OVER) {
            event.preventDefault();
            
            switch(event.code) {
                case 'ArrowUp':
                    this.selectedButton = Math.max(0, this.selectedButton - 1);
                    break;
                case 'ArrowDown':
                    this.selectedButton = Math.min(
                        this.buttons.length - 1, 
                        this.selectedButton + 1
                    );
                    break;
                case 'Enter':
                    this.buttons[this.selectedButton].action();
                    break;
            }
        }
    }

    cleanup() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    drawGameOver(ctx) {
        // Draw semi-transparent overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw "Game Over" text
        ctx.fillStyle = GAME_CONSTANTS.UI.GAME_OVER.TEXT_COLOR;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', this.game.canvas.width/2, this.game.canvas.height/3);
        
        // Draw buttons
        const buttonWidth = GAME_CONSTANTS.UI.GAME_OVER.BUTTON_WIDTH;
        const buttonHeight = GAME_CONSTANTS.UI.GAME_OVER.BUTTON_HEIGHT;
        const spacing = GAME_CONSTANTS.UI.GAME_OVER.SPACING;
        
        this.buttons.forEach((button, index) => {
            const buttonX = (this.game.canvas.width - buttonWidth) / 2;
            const buttonY = (this.game.canvas.height/2) + (buttonHeight + spacing) * index;
            
            let buttonColor = GAME_CONSTANTS.UI.GAME_OVER.BUTTON_INACTIVE_COLOR;
            if (index === this.selectedButton) {
                buttonColor = GAME_CONSTANTS.UI.GAME_OVER.BUTTON_FOCUS_COLOR;
            }
            
            ctx.fillStyle = buttonColor;
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            
            if (index === this.selectedButton) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(buttonX - 2, buttonY - 2, buttonWidth + 4, buttonHeight + 4);
            }
            
            ctx.fillStyle = GAME_CONSTANTS.UI.GAME_OVER.TEXT_COLOR;
            ctx.font = GAME_CONSTANTS.UI.GAME_OVER.FONT;
            ctx.fillText(button.text, buttonX + buttonWidth/2, buttonY + buttonHeight/2);
        });
        
        ctx.restore();
    }
}