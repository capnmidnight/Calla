import { EventBase } from "../calla";
import { isFirefox } from "../html/flags";


const MAX_DRAG_DISTANCE = 5,
    clickEvt = Object.assign(new Event("click"), {
        x: 0,
        y: 0,
        button: 0
    }),
    dragEvt = Object.assign(new Event("drag"), {
        dx: 0,
        dy: 0
    }),
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

        function readPointer(evt) {
            return {
                id: evt.pointerId,
                buttons: evt.buttons,
                dragDistance: 0,
                x: evt.offsetX * devicePixelRatio,
                y: evt.offsetY * devicePixelRatio
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

            if (count === 1) {

                if (!!last
                    && pointer.buttons === 1
                    && last.buttons === pointer.buttons) {
                    const dx = pointer.x - last.x,
                        dy = pointer.y - last.y,
                        dist = Math.sqrt(dx * dx + dy * dy);
                    pointer.dragDistance = last.dragDistance + dist;

                    if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                        canClick = false;
                        dragEvt.dx = dx;
                        dragEvt.dy = dy;
                        this.dispatchEvent(dragEvt);
                    }
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
                clickEvt.x = pointer.x;
                clickEvt.y = pointer.y;
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