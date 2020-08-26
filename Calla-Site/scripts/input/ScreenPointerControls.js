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
     * @param {Element} element the element from which to receive pointer events
     * @param {boolean} clampCursor whether or not to clamp the pointer to the edges of the element
     */
    constructor(element, clampCursor = false) {
        super();

        const pointers = new Map();
        let canClick = true;

        Object.defineProperty(this, "primaryPointer", {
            get: () => {
                for (let pointer of pointers.values()) {
                    return pointer;
                }
            }
        });

        function setEvt(evt, pointer) {
            evt.x = pointer.x;
            evt.y = pointer.y;
            evt.dx = pointer.dx;
            evt.dy = pointer.dy;

            evt.u = 2 * evt.x / element.clientWidth - 1;
            evt.v = -2 * evt.y / element.clientHeight + 1;
            evt.du = 2 * evt.dx / element.clientWidth;
            evt.dv = -2 * evt.dy / element.clientHeight;
        }

        function readPointer(evt) {
            return {
                id: evt.pointerId,
                buttons: evt.buttons,
                moveDistance: 0,
                dragDistance: 0,
                x: evt.offsetX,
                y: evt.offsetY,
                dx: evt.movementX,
                dy: evt.movementY
            }
        }

        const replacePointer = (pointer) => {
            const last = pointers.get(pointer.id);

            if (last && document.pointerLockElement) {
                pointer.x = last.x + pointer.dx;
                pointer.y = last.y + pointer.dy;
                if (clampCursor) {
                    pointer.x = Math.max(0, Math.min(element.clientWidth, pointer.x));
                    pointer.y = Math.max(0, Math.min(element.clientHeight, pointer.y));
                }
            }

            pointer.moveDistance = Math.sqrt(
                pointer.dx * pointer.dx
                + pointer.dy * pointer.dy);

            pointers.set(pointer.id, pointer);

            return last;
        };

        const getPressCount = () => {
            let count = 0;
            for (let pointer of pointers.values()) {
                if (pointer.buttons === 1) {
                    ++count;
                }
            }
            return count;
        };

        const getPinchDistance = () => {
            const count = getPressCount();
            if (count !== 2) {
                return null;
            }

            let a, b;
            for (let pointer of pointers.values()) {
                if (pointer.buttons === 1) {
                    if (!a) {
                        a = pointer;
                    }
                    else if (!b) {
                        b = pointer;
                    }
                    else {
                        break;
                    }
                }
            }

            const dx = b.x - a.x,
                dy = b.y - a.y;

            return Math.sqrt(dx * dx + dy * dy);
        };

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

        element.addEventListener("pointerdown", (evt) => {
            const oldCount = getPressCount(),
                pointer = readPointer(evt),
                _ = replacePointer(pointer),
                newCount = getPressCount();

            canClick = oldCount === 0
                && newCount === 1;
        });

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
            const pointer = readPointer(evt);
            if (pointers.has(pointer.id)) {
                pointers.delete(pointer.id);
            }

            return pointer;
        });
    }
}