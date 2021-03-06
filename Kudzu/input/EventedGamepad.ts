import { TypedEvent, TypedEventBase } from "../events/EventBase";

class GamepadButtonEvent<T extends string> extends TypedEvent<T> {
    constructor(type: T, public button: number) {
        super(type);
    }
}

export class GamepadButtonUpEvent extends GamepadButtonEvent<"gamepadbuttonup"> {
    constructor(button: number) {
        super("gamepadbuttonup", button);
    }
}

export class GamepadButtonDownEvent extends GamepadButtonEvent<"gamepadbuttondown"> {
    constructor(button: number) {
        super("gamepadbuttondown", button);
    }
}

class GamepadAxisEvent<T extends string> extends TypedEvent<T> {
    constructor(type: T, public axis: number, public value: number) {
        super(type);
    }
}

export class GamepadAxisMaxedEvent extends GamepadAxisEvent<"gamepadaxismaxed"> {
    constructor(axis: number, value: number) {
        super("gamepadaxismaxed", axis, value);
    }
}

type Stick = { x: number, y: number; };

interface EventedGamepadEvents {
    gamepadbuttonup: GamepadButtonUpEvent;
    gamepadbuttondown: GamepadButtonDownEvent;
    gamepadaxismaxed: GamepadAxisMaxedEvent;
}

export class EventedGamepad extends TypedEventBase<EventedGamepadEvents> {
    id: string;
    displayId: string;
    connected: boolean;
    hand: string;
    pose: GamepadPose | null;
    lastButtons = new Array<GamepadButton>();
    buttons = new Array<GamepadButton>();
    axes = new Array<number>();
    hapticActuators = new Array<GamepadHapticActuator>();
    private _isStick: (a: any) => boolean;

    private btnDownEvts = new Array<GamepadButtonDownEvent>();
    private btnUpEvts = new Array<GamepadButtonUpEvent>();
    private btnState = new Array<boolean>();
    private axisThresholdMax = 0.9;
    private axisThresholdMin = 0.1;
    private axisMaxEvts = new Array<GamepadAxisMaxedEvent>();
    private axisMaxed = new Array<boolean>();
    private sticks = new Array<Stick>();

    constructor(pad: Gamepad) {
        super();
        this.id = pad.id;
        this.displayId = (pad as any).displayId as string;

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        this._isStick = (a: number) => a % 2 === 0 && a < pad.axes.length - 1;

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

    update(pad: Gamepad) {
        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = this.btnState[b],
                pressed = pad.buttons[b].pressed;
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
            const wasMaxed = this.axisMaxed[a],
                val = pad.axes[a],
                dir = Math.sign(val),
                mag = Math.abs(val),
                maxed = mag >= this.axisThresholdMax,
                mined = mag <= this.axisThresholdMin,
                correctedVal = dir * (maxed ? 1 : (mined ? 0 : mag));
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
