import { InputManager } from '../managers/InputManager.js';
import { PlatformManager } from '../managers/PlatformManager.js';
import { EnemyManager } from '../managers/EnemyManager.js';
import { Player } from '../entities/Player.js';
import { GAME_CONSTANTS } from '../utils/Constants.js';
import { MenuManager } from '../managers/MenuManager.js';
import { StateManager } from '../managers/StateManager.js';
import { UIRenderer } from '../renderers/UIRenderer.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.world = {
            width: 2000,
            height: 600
        };
        this.inputManager = new InputManager();
        this.platformManager = new PlatformManager();
        this.enemyManager = new EnemyManager(this.platformManager);
        this.player = new Player(50, 450);
        this.camera = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        };
        this.lastTime = 0;
        this.deltaTime = 0;
        this.isMouseOverButton = false;
        this.menuButton = {
            x: (this.canvas.width - GAME_CONSTANTS.UI.MENU.BUTTON_WIDTH) / 2,
            y: (this.canvas.height - GAME_CONSTANTS.UI.MENU.BUTTON_HEIGHT) / 2,
            width: GAME_CONSTANTS.UI.MENU.BUTTON_WIDTH,
            height: GAME_CONSTANTS.UI.MENU.BUTTON_HEIGHT
        };
        this.menuManager = new MenuManager(this);
        this.stateManager = new StateManager(this);
        this.uiRenderer = new UIRenderer(this);
        
        this.setupEventListeners();
        this.init();
    }

    setupEventListeners() {
        // Bind methods first
        this.handleGlobalKeys = this.handleGlobalKeys.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        
        // Add event listeners
        window.addEventListener('keydown', this.handleGlobalKeys);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('click', this.handleClick);
    }
    
    cleanup() {
        this.inputManager.cleanup();
        this.menuManager.cleanup();
        this.stateManager.cleanup();
        window.removeEventListener('beforeunload', this.cleanup);
        cancelAnimationFrame(this.gameLoop);
    }

    init() {
        window.addEventListener('beforeunload', this.cleanup.bind(this));
        this.gameLoop();
    }

    update() {
        if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.PLAYING) {
            // Handle input first
            this.player.handleMovement(this.inputManager);
            this.player.handleJump(this.inputManager, this.platformManager);
            
            // Apply physics
            this.player.applyGravity();
            this.player.updatePosition();
            
            // Check enemy collisions first
            this.enemyManager.checkCollisions(this.player);
            
            // Then check platform collisions
            this.platformManager.checkCollisions(this.player);
            
            // Update other entities
            this.enemyManager.update();
            
            // Update camera and bounds
            this.updateCamera();
            this.player.x = Math.max(0, Math.min(this.player.x, this.world.width - this.player.width));
            
            // Check for level completion
            if (this.player.x >= GAME_CONSTANTS.WORLD.FINISH_LINE.X) {
                this.stateManager.setState(GAME_CONSTANTS.GAME_STATE.LEVEL_COMPLETE);
            }
        } else if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.GAME_OVER) {
            this.menuManager.update();
        } else if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.MENU) {
            if (this.inputManager.isActionActive('confirm')) {
                this.startNewGame();
            }
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game world
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw platforms first
        this.platformManager.draw(this.ctx);
        
        // Draw finish line
        this.ctx.fillStyle = GAME_CONSTANTS.WORLD.FINISH_LINE.COLOR;
        this.ctx.fillRect(
            GAME_CONSTANTS.WORLD.FINISH_LINE.X,
            0,  // Start from top of screen
            GAME_CONSTANTS.WORLD.FINISH_LINE.WIDTH,
            GAME_CONSTANTS.WORLD.HEIGHT  // Extend to bottom of screen
        );
        
        // Draw other game elements
        this.enemyManager.draw(this.ctx);
        this.player.draw(this.ctx);
        
        this.ctx.restore();
        
        // Draw UI elements on top
        this.uiRenderer.drawUI(this.ctx, this.stateManager.lives);
    }

    updateCamera() {
        this.camera.x = this.player.x - this.canvas.width/2 + this.player.width/2;
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.world.width - this.canvas.width));
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.MENU) {
            this.isMouseOverButton = x >= this.menuButton.x && 
                                    x <= this.menuButton.x + this.menuButton.width &&
                                    y >= this.menuButton.y && 
                                    y <= this.menuButton.y + this.menuButton.height;
        } else if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.GAME_OVER) {
            const buttonWidth = GAME_CONSTANTS.UI.GAME_OVER.BUTTON_WIDTH;
            const buttonHeight = GAME_CONSTANTS.UI.GAME_OVER.BUTTON_HEIGHT;
            const spacing = GAME_CONSTANTS.UI.GAME_OVER.SPACING;
            
            this.menuManager.buttons.forEach((button, index) => {
                const buttonX = (this.canvas.width - buttonWidth) / 2;
                const buttonY = (this.canvas.height/2) + (buttonHeight + spacing) * index;
                
                if (x >= buttonX && x <= buttonX + buttonWidth &&
                    y >= buttonY && y <= buttonY + buttonHeight) {
                    this.menuManager.selectedButton = index;
                }
            });
        }
    }

    handleClick(event) {
        if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.MENU && this.isMouseOverButton) {
            this.startNewGame();
        } else if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.GAME_OVER) {
            this.menuManager.buttons[this.menuManager.selectedButton].action();
        }
    }

    handleGlobalKeys(event) {
        if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.GAME_OVER) {
            this.menuManager.handleKeyDown(event);
            return;
        }
        
        if (event.code === GAME_CONSTANTS.CONTROLS.ENTER && 
            this.stateManager.current === GAME_CONSTANTS.GAME_STATE.MENU) {
            this.startNewGame();
        }
        
        if (event.code === GAME_CONSTANTS.CONTROLS.ESCAPE) {
            if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.PLAYING) {
                this.stateManager.setState(GAME_CONSTANTS.GAME_STATE.PAUSED);
            } else if (this.stateManager.current === GAME_CONSTANTS.GAME_STATE.PAUSED) {
                this.stateManager.setState(GAME_CONSTANTS.GAME_STATE.PLAYING);
            }
        }
    }

    startNewGame() {
        this.stateManager.startNewGame();
    }

    gameLoop = () => {
        const stateHandlers = {
            [GAME_CONSTANTS.GAME_STATE.PLAYING]: () => {
                this.update();
                this.draw();
            },
            [GAME_CONSTANTS.GAME_STATE.MENU]: () => this.drawMenu(),
            [GAME_CONSTANTS.GAME_STATE.GAME_OVER]: () => this.drawGameOver(),
            [GAME_CONSTANTS.GAME_STATE.LEVEL_COMPLETE]: () => {
                this.draw();
                this.uiRenderer.drawLevelComplete(this.ctx);
            }
        };

        const handler = stateHandlers[this.stateManager.current];
        if (handler) handler();
        
        requestAnimationFrame(this.gameLoop);
    }

    drawMenu() {
        this.uiRenderer.drawMenu(this.ctx);
    }

    drawGameOver() {
        this.draw(); // Draw game in background
        this.menuManager.drawGameOver(this.ctx);
    }

    restartGame() {
        this.stateManager.lives = GAME_CONSTANTS.PLAYER.INITIAL_LIVES;
        this.stateManager.score = 0;
        this.resetLevel();
        this.stateManager.current = GAME_CONSTANTS.GAME_STATE.PLAYING;
    }

    returnToMenu() {
        this.stateManager.current = GAME_CONSTANTS.GAME_STATE.MENU;
        this.stateManager.lives = GAME_CONSTANTS.PLAYER.INITIAL_LIVES;
        this.stateManager.score = 0;
        this.resetLevel();
    }

    resetLevel() {
        // Reset player position
        this.player.x = GAME_CONSTANTS.PLAYER.INITIAL_X;
        this.player.y = GAME_CONSTANTS.PLAYER.INITIAL_Y;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Reset enemy positions
        this.enemyManager.reset();
        
        // Reset input states
        this.inputManager.reset();
    }
}