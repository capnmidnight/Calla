import { TypedEvent, TypedEventBase } from "../events/EventBase";
declare class GamepadButtonEvent<T extends string> extends TypedEvent<T> {
    button: number;
    constructor(type: T, button: number);
}
export declare class GamepadButtonUpEvent extends GamepadButtonEvent<"gamepadButtonUp"> {
    constructor(button: number);
}
export declare class GamepadButtonDownEvent extends GamepadButtonEvent<"gamepadButtonDown"> {
    constructor(button: number);
}
declare class GamepadAxisEvent<T extends string> extends TypedEvent<T> {
    axis: number;
    constructor(type: T, axis: number);
}
export declare class GamepadAxisMaxedEvent extends GamepadAxisEvent<"gamepadAxisMaxed"> {
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
