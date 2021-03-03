export class PointerState {
    constructor() {
        this.buttons = 0;
        this.moveDistance = 0;
        this.dragDistance = 0;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        this.u = 0;
        this.v = 0;
        this.du = 0;
        this.dv = 0;
        this.canClick = false;
        this.dragging = false;
        this.ctrl = false;
        this.alt = false;
        this.shift = false;
        this.meta = false;
        Object.seal(this);
    }
    copy(ptr) {
        this.buttons = ptr.buttons;
        this.moveDistance = ptr.moveDistance;
        this.dragDistance = ptr.dragDistance;
        this.x = ptr.x;
        this.y = ptr.y;
        this.dx = ptr.dx;
        this.dy = ptr.dy;
        this.dz = ptr.dz;
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
    read(evt) {
        this.buttons = evt.buttons;
        this.x = evt.offsetX;
        this.y = evt.offsetY;
        this.dx = evt.movementX;
        this.dy = evt.movementY;
        this.dz = 0;
        this.ctrl = evt.ctrlKey;
        this.alt = evt.altKey;
        this.shift = evt.shiftKey;
        this.meta = evt.metaKey;
    }
}
//# sourceMappingURL=PointerState.js.map