import { GAME_CONSTANTS } from '../utils/Constants.js';

export class StateManager {
    constructor(game) {
        this.game = game;
        this.current = GAME_CONSTANTS.GAME_STATE.MENU;
        this.score = 0;
        this.lives = GAME_CONSTANTS.PLAYER.INITIAL_LIVES;
        
        // Bind methods
        this.handleGameOver = this.handleGameOver.bind(this);
        
        // Add event listener
        window.addEventListener('gameOver', this.handleGameOver);
    }

    setState(newState) {
        this.current = newState;
    }

    handleGameOver() {
        this.lives--;
        
        if (this.lives >= 0) {
            this.setState(GAME_CONSTANTS.GAME_STATE.PAUSED);
            setTimeout(() => {
                this.game.resetLevel();
                this.setState(GAME_CONSTANTS.GAME_STATE.PLAYING);
            }, GAME_CONSTANTS.UI.GAME_OVER.DELAY);
        } else {
            this.setState(GAME_CONSTANTS.GAME_STATE.GAME_OVER);
            this.game.menuManager.selectedButton = 0;
        }
    }

    startNewGame() {
        this.setState(GAME_CONSTANTS.GAME_STATE.PLAYING);
        this.score = 0;
        this.lives = GAME_CONSTANTS.PLAYER.INITIAL_LIVES;
        this.game.resetLevel();
    }

    returnToMenu() {
        this.setState(GAME_CONSTANTS.GAME_STATE.MENU);
        this.lives = GAME_CONSTANTS.PLAYER.INITIAL_LIVES;
        this.score = 0;
        this.game.resetLevel();
    }

    cleanup() {
        window.removeEventListener('gameOver', this.handleGameOver);
    }
}