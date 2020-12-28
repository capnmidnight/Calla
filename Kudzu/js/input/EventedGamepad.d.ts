import { TypedEventBase } from "../events/EventBase";
declare class GamepadButtonEvent extends Event {
    button: number;
    constructor(type: string, button: number);
}
export declare class GamepadButtonUpEvent extends GamepadButtonEvent {
    constructor(button: number);
}
export declare class GamepadButtonDownEvent extends GamepadButtonEvent {
    constructor(button: number);
}
declare class GamepadAxisEvent extends Event {
    axis: number;
    constructor(type: string, axis: number);
}
export declare class GamepadAxisMaxedEvent extends GamepadAxisEvent {
    constructor(axis: number);
}
interface EventedGamepadEvents {
    gamepadbuttonup: GamepadButtonUpEvent;
    gamepadbuttondown: GamepadButtonDownEvent;
    gamepadaxismaxed: GamepadAxisMaxedEvent;
}
export declare class EventedGamepad extends TypedEventBase<EventedGamepadEvents> {
    id: string;
    displayId: string;
    connected: boolean;
    hand: string;
    pose: GamepadPose | null;
    lastButtons: GamepadButton[];
    buttons: GamepadButton[];
    axes: number[];
    hapticActuators: GamepadHapticActuator[];
    private _isStick;
    private btnDownEvts;
    private btnUpEvts;
    private btnState;
    private axisThresholdMax;
    private axisThresholdMin;
    private axisMaxEvts;
    private axisMaxed;
    private sticks;
    constructor(pad: Gamepad);
    update(pad: Gamepad): void;
}
export {};
