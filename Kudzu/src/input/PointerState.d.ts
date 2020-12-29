export declare class PointerState {
    buttons: number;
    moveDistance: number;
    dragDistance: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    u: number;
    v: number;
    du: number;
    dv: number;
    canClick: boolean;
    dragging: boolean;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
    constructor();
    copy(ptr: PointerState): void;
    read(evt: PointerEvent): void;
}
