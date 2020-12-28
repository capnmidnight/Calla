import { TypedEventBase } from "../events/EventBase";
class GamepadButtonEvent extends Event {
    constructor(type, button) {
        super("gamepadbutton" + type);
        this.button = button;
    }
}
export class GamepadButtonUpEvent extends GamepadButtonEvent {
    constructor(button) {
        super("up", button);
    }
}
export class GamepadButtonDownEvent extends GamepadButtonEvent {
    constructor(button) {
        super("down", button);
    }
}
class GamepadAxisEvent extends Event {
    constructor(type, axis) {
        super("gamepadaxis" + type);
        this.axis = axis;
    }
}
export class GamepadAxisMaxedEvent extends GamepadAxisEvent {
    constructor(axis) {
        super("maxed", axis);
    }
}
export class EventedGamepad extends TypedEventBase {
    constructor(pad) {
        super();
        this.lastButtons = new Array();
        this.buttons = new Array();
        this.axes = new Array();
        this.hapticActuators = new Array();
        this.btnDownEvts = new Array();
        this.btnUpEvts = new Array();
        this.btnState = new Array();
        this.axisThresholdMax = 0.9;
        this.axisThresholdMin = 0.1;
        this.axisMaxEvts = new Array();
        this.axisMaxed = new Array();
        this.sticks = new Array();
        this.id = pad.id;
        this.displayId = pad.displayId;
        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;
        this._isStick = (a) => a % 2 === 0 && a < pad.axes.length - 1;
        for (let b = 0; b < pad.buttons.length; ++b) {
            this.btnDownEvts[b] = new GamepadButtonDownEvent(b);
            this.btnUpEvts[b] = new GamepadButtonUpEvent(b);
            this.btnState[b] = false;
            this.buttons[b] = pad.buttons[b];
        }
        for (let a = 0; a < pad.axes.length; ++a) {
            this.axisMaxEvts[a] = new GamepadAxisMaxedEvent(a);
            this.axisMaxed[a] = false;
            if (this._isStick(a)) {
                this.sticks[a / 2] = { x: 0, y: 0 };
            }
            this.axes[a] = pad.axes[a];
        }
        if (pad.hapticActuators != null) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
        Object.seal(this);
    }
    update(pad) {
        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;
        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = this.btnState[b], pressed = pad.buttons[b].pressed;
            if (pressed !== wasPressed) {
                this.btnState[b] = pressed;
                this.dispatchEvent((pressed
                    ? this.btnDownEvts
                    : this.btnUpEvts)[b]);
            }
            this.lastButtons[b] = this.buttons[b];
            this.buttons[b] = pad.buttons[b];
        }
        for (let a = 0; a < pad.axes.length; ++a) {
            const wasMaxed = this.axisMaxed[a], val = pad.axes[a], dir = Math.sign(val), mag = Math.abs(val), maxed = mag >= this.axisThresholdMax, mined = mag <= this.axisThresholdMin;
            if (maxed && !wasMaxed) {
                this.dispatchEvent(this.axisMaxEvts[a]);
            }
            this.axes[a] = dir * (maxed ? 1 : (mined ? 0 : mag));
        }
        for (let a = 0; a < this.axes.length - 1; a += 2) {
            const stick = this.sticks[a / 2];
            stick.x = this.axes[a];
            stick.y = this.axes[a + 1];
        }
        if (pad.hapticActuators != null) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}
//# sourceMappingURL=EventedGamepad.js.map