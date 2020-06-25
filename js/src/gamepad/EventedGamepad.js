const gamepadStates = new Map();

export class EventedGamepad extends EventTarget {
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

    dispose() {
        gamepadStates.delete(this);
    }

    _update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }
        const self = gamepadStates.get(this);
        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = self.btnState[b], pressed = pad.buttons[b].pressed;
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
