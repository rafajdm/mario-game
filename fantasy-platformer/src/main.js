import { Game } from './game/Game.js';
import { GAME_CONSTANTS } from './utils/Constants.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.stateManager.setState(GAME_CONSTANTS.GAME_STATE.MENU);
});