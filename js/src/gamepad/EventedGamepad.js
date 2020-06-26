const gamepadStates = new Map();

export class EventedGamepad extends EventTarget {
    constructor(pad) {
        super();
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.id = pad.id;
        this.displayId = pad.displayId;

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = {
            btnDownEvts: [],
            btnUpEvts: [],
            btnState: [],
            axisMaxed: [],
            axisMaxEvts: [],
            sticks: []
        };

        this.buttons = [];
        this.axes = [];
        this.hapticActuators = [];
        this.axisThresholdMax = 0.9;
        this.axisThresholdMin = 0.1;

        this._isStick = (a) => a % 2 === 0 && a < pad.axes.length - 1;

        for (let b = 0; b < pad.buttons.length; ++b) {
            self.btnDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), {
                button: b
            });
            self.btnUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), {
                button: b
            });
            self.btnState[b] = false;

            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            self.axisMaxEvts[a] = Object.assign(new Event("gamepadaxismaxed"), {
                axis: a
            });
            self.axisMaxed[a] = false;
            if (this._isStick(a)) {
                self.sticks[a / 2] = { x: 0, y: 0 };
            }

            this.axes[a] = pad.axes[a];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }

        Object.seal(this);
        gamepadStates.set(this, self);
    }

    dispose() {
        gamepadStates.delete(this);
    }

    _update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

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
            const wasMaxed = self.axisMaxed[a],
                maxed = pad.axes[a] >= this.axisThresholdMax,
                mined = pad.axes[a] <= this.axisThresholdMin;
            if (maxed && !wasMaxed) {
                this.dispatchEvent(self.axisMaxEvts[a]);
            }

            this.axes[a] = maxed
                ? 1
                : (mined
                    ? 0
                    : pads.axes[a]);
        }

        for (let a = 0; a < this.axes.length - 1; a += 2) {
            const stick = self.sticks[a / 2];
            stick.x = this.axes[a];
            stick.y = this.axes[a + 1];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}
