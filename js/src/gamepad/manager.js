const gamepadConnectedEvt = Object.assign(new Event("gamepadconnected"), {
    gamepad: null
}),
    gamepadDisconnectedEvt = Object.assign(new Event("gamepaddisconnected"), {
        gamepad: null
    }),

    gamepads = new Map(),
    anyButtonDownEvt = Object.assign(new Event("gamepadbuttondown"), { button: 0 }),
    anyButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), { button: 0 });

class GamepadStateManager extends EventTarget {
    constructor() {
        super();

        const onAnyButtonDown = (evt) => {
            anyButtonDownEvt.button = evt.button;
            this.dispatchEvent(anyButtonDownEvt);
        };

        const onAnyButtonUp = (evt) => {
            anyButtonUpEvt.button = evt.button;
            this.dispatchEvent(anyButtonUpEvt);
        };

        window.addEventListener("gamepadconnected", (evt) => {
            const pad = evt.gamepad,
                gamepad = new EventedGamepad(pad);
            gamepad.addEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.addEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepads.set(pad.id, gamepad);
            gamepadConnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadConnectedEvt);
        });

        window.addEventListener("gamepaddisconnected", (evt) => {
            const gamepad = gamepads.get(pad.id);
            gamepads.delete(pad.id);
            gamepad.removeEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.removeEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepadDisconnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadDisconnectedEvt);
            gamepadStates.delete(gamepad);
        });

        Object.freeze(this);
    }

    get gamepadIDs() {
        return gamepads.keys();
    }

    get gamepads() {
        return gamepads.values();
    }

    get(id) {
        return gamepads.get(id);
    }
}

export const GamepadManager = new GamepadStateManager();


function update() {
    requestAnimationFrame(update);
    const pads = navigator.getGamepads();
    for (let pad of pads) {
        if (pad !== null
            && gamepads.has(pad.id)) {
            const gamepad = gamepads.get(pad.id);
            gamepad.update(pad);
        }
    }
}

requestAnimationFrame(update);

const gamepadStates = new Map();

class EventedGamepad extends EventTarget {
    constructor(pad) {
        super();

        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.id = pad.id;

        const self = {
            btnDownEvts: [],
            btnUpEvts: [],
            btnState: []
        };

        gamepadStates.set(this, self);

        this.buttons = [];
        this.axes = [];
        this.hapticActuators = [];

        for (let b = 0; b < pad.buttons.length; ++b) {
            self.btnDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), {
                button: b
            });
            self.btnUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), {
                button: b
            });
            self.btnState[b] = pad.buttons[b].pressed;

            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            this.axes[a] = pad.axes[a];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }

        Object.freeze(this);
    }

    _update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        const self = gamepadStates.get(this);

        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = self.btnState[b],
                pressed = pad.buttons[b].pressed;

            if (pressed !== wasPressed) {
                self.btnState[b] = pressed;

                this.dispatchEvent((state
                    ? self.btnDownEvts
                    : self.btnUpEvts)[b]);
            }

            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            this.axes[a] = pad.axes[a];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}