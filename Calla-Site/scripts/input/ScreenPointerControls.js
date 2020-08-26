import { EventBase } from "../calla";
import { isFirefox } from "../html/flags";

class ScreenPointerEvent extends Event {
    constructor(type) {
        super(type);

        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.u = 0;
        this.v = 0;
        this.du = 0;
        this.dv = 0;
        this.button = 0;
    }
}

const MAX_DRAG_DISTANCE = 5,
    clickEvt = new ScreenPointerEvent("click"),
    moveEvt = new ScreenPointerEvent("move"),
    dragEvt = new ScreenPointerEvent("drag"),
    wheelEvt = Object.assign(new Event("wheel"), {
        dz: 0
    });

export class ScreenPointerControls extends EventBase {
    /**
     * @param {Element} element
     */
    constructor(element) {
        super();

        const pointers = [];
        let canClick = true;

        Object.defineProperty(this, "primaryPointer", {
            get: () => {
                return pointers[0];
            }
        });

        element.addEventListener("wheel", (evt) => {
            if (!evt.shiftKey
                && !evt.altKey
                && !evt.ctrlKey
                && !evt.metaKey) {
                evt.preventDefault();
                // Chrome and Firefox report scroll values in completely different ranges.
                const deltaZ = -evt.deltaY * (isFirefox ? 1 : 0.02);
                wheelEvt.dz = deltaZ;
                this.dispatchEvent(wheelEvt);
            }
        }, { passive: false });

        function setEvt(evt, pointer) {
            evt.x = pointer.x;
            evt.y = pointer.y;
            evt.dx = pointer.dx;
            evt.dy = pointer.dy;

            evt.u = 2 * evt.x / (window.devicePixelRatio * element.clientWidth) - 1;
            evt.v = -2 * evt.y / (window.devicePixelRatio * element.clientHeight) + 1;
            evt.du = 2 * evt.dx / (window.devicePixelRatio * element.clientWidth);
            evt.dy = -2 * evt.dy / (window.devicePixelRatio * element.clientHeight);
        }

        function readPointer(evt) {
            const x = evt.offsetX * devicePixelRatio,
                y = evt.offsetY * devicePixelRatio,
                dx = evt.movementX,
                dy = evt.movementY;

            return {
                id: evt.pointerId,
                buttons: evt.buttons,
                moveDistance: 0,
                dragDistance: 0,
                x, y,
                dx, dy
            }
        }

        const findPointer = (pointer) => {
            return pointers.findIndex(p => p.id === pointer.id);
        };

        const replacePointer = (pointer) => {
            const idx = findPointer(pointer);
            if (idx > -1) {
                const last = pointers[idx];
                pointers[idx] = pointer;

                if (pointer.x === last.x
                    && pointer.y === last.y
                    && (pointer.dx !== 0
                        || pointer.dy !== 0)) {
                    pointer.x = last.x + pointer.dx;
                    pointer.y = last.y + pointer.dy;
                }
                else {
                    pointer.dx = pointer.x - last.x;
                    pointer.dy = pointer.y - last.y;
                }

                pointer.moveDistance = Math.sqrt(
                    pointer.dx * pointer.dx
                    + pointer.dy * pointer.dy);

                return last;
            }
            else {
                pointers.push(pointer);
                return null;
            }
        };

        const getPressCount = () => {
            let count = 0;
            for (let pointer of pointers) {
                if (pointer.buttons === 1) {
                    ++count;
                }
            }
            return count;
        }

        element.addEventListener("pointerdown", (evt) => {
            const oldCount = getPressCount(),
                pointer = readPointer(evt),
                _ = replacePointer(pointer),
                newCount = getPressCount();

            canClick = oldCount === 0
                && newCount === 1;
        });

        const getPinchDistance = () => {
            const count = getPressCount();
            if (count !== 2) {
                return null;
            }

            const pressed = pointers.filter(p => p.buttons === 1),
                a = pressed[0],
                b = pressed[1],
                dx = b.x - a.x,
                dy = b.y - a.y;

            return Math.sqrt(dx * dx + dy * dy);
        };

        element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = getPinchDistance(),
                pointer = readPointer(evt),
                last = replacePointer(pointer),
                count = getPressCount(),
                newPinchDistance = getPinchDistance();

            setEvt(moveEvt, pointer);
            this.dispatchEvent(moveEvt);

            if (count === 1
                && pointer.buttons === 1
                && last && last.buttons === pointer.buttons) {
                pointer.dragDistance = last.dragDistance + pointer.moveDistance;
                if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                    canClick = false;
                    setEvt(dragEvt, pointer);
                    this.dispatchEvent(dragEvt);
                }
            }

            if (oldPinchDistance !== null
                && newPinchDistance !== null) {
                canClick = false;
                const ddist = newPinchDistance - oldPinchDistance;
                wheelEvt.dz = ddist / 100;
                this.dispatchEvent(wheelEvt);
            }
        });

        element.addEventListener("pointerup", (evt) => {
            const pointer = readPointer(evt),
                _ = replacePointer(pointer);

            if (canClick) {
                setEvt(clickEvt, pointer);
                this.dispatchEvent(clickEvt);
            }
        });

        element.addEventListener("pointercancel", (evt) => {
            const pointer = readPointer(evt),
                idx = findPointer(pointer);

            if (idx >= 0) {
                arrayRemoveAt(pointers, idx);
            }

            return pointer;
        });
    }
}