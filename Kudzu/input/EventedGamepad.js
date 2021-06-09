import { TypedEvent, TypedEventBase } from "../events/EventBase";
class GamepadButtonEvent extends TypedEvent {
    button;
    constructor(type, button) {
        super(type);
        this.button = button;
    }
}
export class GamepadButtonUpEvent extends GamepadButtonEvent {
    constructor(button) {
        super("gamepadbuttonup", button);
    }
}
export class GamepadButtonDownEvent extends GamepadButtonEvent {
    constructor(button) {
        super("gamepadbuttondown", button);
    }
}
class GamepadAxisEvent extends TypedEvent {
    axis;
    value;
    constructor(type, axis, value) {
        super(type);
        this.axis = axis;
        this.value = value;
    }
}
export class GamepadAxisMaxedEvent extends GamepadAxisEvent {
    constructor(axis, value) {
        super("gamepadaxismaxed", axis, value);
    }
}
export class EventedGamepad extends TypedEventBase {
    id;
    displayId;
    connected;
    hand;
    pose;
    lastButtons = new Array();
    buttons = new Array();
    axes = new Array();
    hapticActuators = new Array();
    _isStick;
    btnDownEvts = new Array();
    btnUpEvts = new Array();
    btnState = new Array();
    axisThresholdMax = 0.9;
    axisThresholdMin = 0.1;
    axisMaxEvts = new Array();
    axisMaxed = new Array();
    sticks = new Array();
    constructor(pad) {
        super();
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
            this.axisMaxEvts[a] = new GamepadAxisMaxedEvent(a, 0);
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
            const wasMaxed = this.axisMaxed[a], val = pad.axes[a], dir = Math.sign(val), mag = Math.abs(val), maxed = mag >= this.axisThresholdMax, mined = mag <= this.axisThresholdMin, correctedVal = dir * (maxed ? 1 : (mined ? 0 : mag));
            if (maxed && !wasMaxed) {
                this.axisMaxEvts[a].value = correctedVal;
                this.dispatchEvent(this.axisMaxEvts[a]);
            }
            this.axisMaxed[a] = maxed;
            this.axes[a] = correctedVal;
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