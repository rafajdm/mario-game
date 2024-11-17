export const GAME_CONSTANTS = {
    WORLD: {
        WIDTH: 2000,
        HEIGHT: 600
    },
    PLAYER: {
        INITIAL_X: 50,
        INITIAL_Y: 550 - 50,
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 5,
        MAX_JUMP_STRENGTH: 12,
        JUMP_ACCELERATION: 0.6,
        GRAVITY: 0.5,
        MAX_JUMP_TIME: 15,
        PLATFORM_COLLISION_COOLDOWN: 5,
        ACCELERATION: 0.5,
        DECELERATION: 0.3,
        MAX_VELOCITY_X: 5,
        MAX_VELOCITY_Y: 12,
        INITIAL_LIVES: 1
    },
    ENEMY: {
        WIDTH: 50,
        HEIGHT: 50,
        GROUND_SPEED: 2,
        PLATFORM_SPEED: 1
    },
    PLATFORM: {
        COLLISION_TOLERANCE: 5,
        DEFAULT_HEIGHT: 50
    },
    GAME_STATE: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'game_over'
    },
    CONTROLS: {
        UP: 'ArrowUp',
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        SPACE: 'Space',
        ESCAPE: 'Escape',
        ENTER: 'Enter'
    },
    INPUT: {
        KEYS: {
            UP: 'ArrowUp',
            LEFT: 'ArrowLeft',
            RIGHT: 'ArrowRight',
            SPACE: 'Space',
            ESCAPE: 'Escape',
            ENTER: 'Enter'
        },
        ACTIONS: {
            JUMP: 'jump',
            MOVE_LEFT: 'moveLeft',
            MOVE_RIGHT: 'moveRight',
            ATTACK: 'attack',
            PAUSE: 'pause',
            CONFIRM: 'confirm'
        },
        DEADZONE: 0.1
    },
    UI: {
        LIVES: {
            RADIUS: 10,
            PADDING: 5,
            START_X: 20,
            START_Y: 20,
            COLOR: '#ff0000'
        },
        MENU: {
            BUTTON_WIDTH: 200,
            BUTTON_HEIGHT: 50,
            BUTTON_COLOR: '#4CAF50',
            BUTTON_HOVER_COLOR: '#45a049',
            BUTTON_FOCUS_COLOR: '#66BB6A',
            TEXT_COLOR: '#ffffff',
            FONT: '24px Arial'
        },
        GAME_OVER: {
            BUTTON_WIDTH: 200,
            BUTTON_HEIGHT: 50,
            BUTTON_COLOR: '#4CAF50',
            BUTTON_HOVER_COLOR: '#45a049',
            BUTTON_INACTIVE_COLOR: '#2E7D32',
            BUTTON_FOCUS_COLOR: '#66BB6A',
            TEXT_COLOR: '#ffffff',
            FONT: '24px Arial',
            SPACING: 20
        },
        OVERLAY_COLOR: 'rgba(0, 0, 0, 0.5)'
    }
};