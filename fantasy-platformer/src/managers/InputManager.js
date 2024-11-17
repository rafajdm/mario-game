import { GAME_CONSTANTS } from '../utils/Constants.js';

export class InputManager {
    constructor() {
        this.keyStates = new Map();
        this.actionStates = new Map();
        
        this.keyBindings = {
            'ArrowUp': ['jump', 'menuUp'],
            'ArrowDown': ['menuDown'],
            'ArrowLeft': ['moveLeft'],
            'ArrowRight': ['moveRight'],
            'Space': ['attack'],
            'Escape': ['pause'],
            'Enter': ['confirm']
        };
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (this.keyBindings[event.code]) {
            event.preventDefault();
            this.keyStates.set(event.code, true);
            this.updateActionStates(event.code, true);
        }
    }

    handleKeyUp(event) {
        if (this.keyBindings[event.code]) {
            this.keyStates.set(event.code, false);
            this.updateActionStates(event.code, false);
        }
    }

    updateActionStates(key, isActive) {
        const actions = this.keyBindings[key] || [];
        actions.forEach(action => {
            this.actionStates.set(action, isActive);
        });
    }

    isActionActive(action) {
        return this.actionStates.get(action) || false;
    }

    reset() {
        // Clear all key states
        this.keyStates.clear();
        this.actionStates.clear();
    }

    cleanup() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}