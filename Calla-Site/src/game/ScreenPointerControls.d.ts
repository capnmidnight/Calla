import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
export declare class ScreenPointerEvent<T extends string> extends TypedEvent<T> {
    pointerType: string;
    pointerID: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    dz: number;
    u: number;
    v: number;
    du: number;
    dv: number;
    buttons: number;
    dragDistance: number;
    constructor(type: T);
}
export declare class InputTypeChangingEvent extends TypedEvent<"inputTypeChanging"> {
    newInputType: string;
    constructor(newInputType: string);
}
export declare class Pointer {
    type: string;
    id: number;
    buttons: number;
    moveDistance: number;
    dragDistance: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    constructor(evt: PointerEvent | WheelEvent);
}
interface ScreenPointerEvents {
    pointerdown: ScreenPointerEvent<"pointerdown">;
    pointerup: ScreenPointerEvent<"pointerup">;
    click: ScreenPointerEvent<"click">;
    move: ScreenPointerEvent<"move">;
    drag: ScreenPointerEvent<"drag">;
}
export declare class ScreenPointerControls extends TypedEventBase<ScreenPointerEvents> {
    pointers: Map<number, Pointer>;
    currentInputType: string;
    constructor(element: HTMLElement);
    get primaryPointer(): Pointer;
    getPointerCount(type: string): number;
    get pressCount(): number;
    get pinchDistance(): number;
}
export {};
