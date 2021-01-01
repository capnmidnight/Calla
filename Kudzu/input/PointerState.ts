export class PointerState {
    buttons = 0;
    moveDistance = 0;
    dragDistance = 0;
    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    u = 0;
    v = 0;
    du = 0;
    dv = 0;
    canClick = false;
    dragging = false;
    ctrl = false;
    alt = false;
    shift = false;
    meta = false;

    constructor() {
        Object.seal(this);
    }

    copy(ptr: PointerState) {
        this.buttons = ptr.buttons;
        this.moveDistance = ptr.moveDistance;
        this.dragDistance = ptr.dragDistance;
        this.x = ptr.x;
        this.y = ptr.y;
        this.dx = ptr.dx;
        this.dy = ptr.dy;
        this.u = ptr.u;
        this.v = ptr.v;
        this.du = ptr.du;
        this.dv = ptr.dv;
        this.canClick = ptr.canClick;
        this.dragging = ptr.dragging;
        this.ctrl = ptr.ctrl;
        this.alt = ptr.alt;
        this.shift = ptr.shift;
        this.meta = ptr.meta;
    }

    read(evt: PointerEvent) {
        this.buttons = evt.buttons;
        this.x = evt.offsetX;
        this.y = evt.offsetY;
        this.dx = evt.movementX;
        this.dy = evt.movementY;
        this.ctrl = evt.ctrlKey;
        this.alt = evt.altKey;
        this.shift = evt.shiftKey;
        this.meta = evt.metaKey;
    }
}
