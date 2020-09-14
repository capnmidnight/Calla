import { EventBase } from "../calla/events/EventBase";
import { isFirefox } from "../html/flags";
import { project } from "../calla/math/project";
import { unproject } from "../calla/math/unproject";

export class ScreenPointerEvent extends Event {
    constructor(type) {
        super(type);

        this.pointerType = null;
        this.pointerID = null;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        this.u = 0;
        this.v = 0;
        this.du = 0;
        this.dv = 0;
        this.buttons = 0;
        this.dragDistance = 0;

        Object.seal(this);
    }
}

export class InputTypeChangingEvent extends Event {
    /**
     * @param {String} inputType
     */
    constructor(inputType) {
        super("inputtypechanging");
        this.newInputType = inputType;

        Object.freeze(this);
    }
}

export class Pointer {
    /**
     * @param {PointerEvent} evt
     */
    constructor(evt) {
        this.type = evt.pointerType;
        this.id = evt.pointerId;
        this.buttons = evt.buttons;
        this.moveDistance = 0;
        this.dragDistance = 0;
        this.x = evt.offsetX;
        this.y = evt.offsetY;
        this.dx = evt.movementX;
        this.dy = evt.movementY;

        Object.seal(this);
    }
}

const MAX_DRAG_DISTANCE = 5,
    pointerDownEvt = new ScreenPointerEvent("pointerdown"),
    pointerUpEvt = new ScreenPointerEvent("pointerup"),
    clickEvt = new ScreenPointerEvent("click"),
    moveEvt = new ScreenPointerEvent("move"),
    dragEvt = new ScreenPointerEvent("drag");

export class ScreenPointerControls extends EventBase {
    /**
     * @param {Element} element the element from which to receive pointer events
     * @param {import("./CursorControl").CursorControl} cursors
     */
    constructor(element, cursors) {
        super();

        /** @type {Map<Number, Pointer>} */
        this.pointers = new Map();

        /** @type {String} */
        this.currentInputType = null;

        let canClick = true;

        /**
         * @param {ScreenPointerEvent} evt
         * @param {Pointer} pointer
         */
        const dispatch = (evt, pointer, dz) => {

            evt.pointerType = pointer.type;
            evt.pointerID = pointer.id;

            evt.buttons = pointer.buttons;

            evt.dx = pointer.dx;
            evt.dy = pointer.dy;
            evt.dz = dz;

            evt.du = 2 * evt.dx / element.clientWidth;
            evt.dv = 2 * evt.dy / element.clientHeight;

            if (cursors.isPointerLocked) {
                evt.u = 0;
                evt.v = 0;

                evt.x = element.clientWidth / 2;
                evt.y = element.clientHeight / 2;
            }
            else {
                evt.x = pointer.x;
                evt.y = pointer.y;

                evt.u = unproject(project(evt.x, 0, element.clientWidth), -1, 1);
                evt.v = unproject(project(evt.y, 0, element.clientHeight), -1, 1);
            }

            evt.dragDistance = pointer.dragDistance;
            this.dispatchEvent(evt);
        }

        /**
         * @param {Pointer} pointer - the newest state of the pointer.
         * @returns {Pointer} - the pointer state that was replaced, if any.
         */
        const replacePointer = (pointer) => {
            const last = this.pointers.get(pointer.id);

            if (last) {
                pointer.dragDistance = last.dragDistance;

                if (cursors.isPointerLocked) {
                    pointer.x = last.x + pointer.dx;
                    pointer.y = last.y + pointer.dy;
                }
            }

            pointer.moveDistance = Math.sqrt(
                pointer.dx * pointer.dx
                + pointer.dy * pointer.dy);

            this.pointers.set(pointer.id, pointer);

            return last;
        };

        element.addEventListener("wheel", (evt) => {
            if (!evt.shiftKey
                && !evt.altKey
                && !evt.ctrlKey
                && !evt.metaKey) {

                evt.preventDefault();

                // Chrome and Firefox report scroll values in completely different ranges.
                const pointer = new Pointer(evt),
                    _ = replacePointer(pointer),
                    deltaZ = -evt.deltaY * (isFirefox ? 1 : 0.02);

                dispatch(moveEvt, pointer, deltaZ);
            }
        }, { passive: false });

        element.addEventListener("pointerdown", (evt) => {
            const oldCount = this.pressCount,
                pointer = new Pointer(evt),
                _ = replacePointer(pointer),
                newCount = this.pressCount;

            if (pointer.type !== this.currentInputType) {
                this.dispatchEvent(new InputTypeChangingEvent(pointer.type));
                this.currentInputType = pointer.type;
            }

            dispatch(pointerDownEvt, pointer, 0);

            canClick = oldCount === 0
                && newCount === 1;
        });

        /**
         * @param {number} oldPinchDistance
         * @param {number} newPinchDistance
         * @returns {number}
         */
        const getPinchZoom = (oldPinchDistance, newPinchDistance) => {
            if (oldPinchDistance !== null
                && newPinchDistance !== null) {
                canClick = false;
                const ddist = newPinchDistance - oldPinchDistance;
                return ddist / 10;
            }

            return 0;
        };

        element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = this.pinchDistance,
                pointer = new Pointer(evt),
                last = replacePointer(pointer),
                count = this.pressCount,
                dz = getPinchZoom(oldPinchDistance, this.pinchDistance);

            dispatch(moveEvt, pointer, dz);

            if (count === 1
                && pointer.buttons === 1
                && last && last.buttons === pointer.buttons) {
                pointer.dragDistance += pointer.moveDistance;
                if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                    canClick = false;
                    dispatch(dragEvt, pointer, 0);
                }
            }
        });

        element.addEventListener("pointerup", (evt) => {
            const pointer = new Pointer(evt),
                lastPointer = replacePointer(pointer);

            pointer.buttons = lastPointer.buttons;

            dispatch(pointerUpEvt, pointer, 0);

            if (canClick) {
                dispatch(clickEvt, pointer, 0);
            }

            pointer.dragDistance = 0;

            if (pointer.type === "touch") {
                this.pointers.delete(pointer.id);
            }
        });

        element.addEventListener("contextmenu", (evt) => {
            evt.preventDefault();
        });

        element.addEventListener("pointercancel", (evt) => {
            if (this.pointers.has(evt.pointerId)) {
                this.pointers.delete(evt.pointerId);
            }
        });
    }

    get primaryPointer() {
        for (let pointer of this.pointers.values()) {
            return pointer;
        }
    }

    getPointerCount(type) {
        let count = 0;
        for (const pointer of this.pointers.values()) {
            if (pointer.type === type) {
                ++count;
            }
        }
        return count;
    }

    get pressCount() {
        let count = 0;
        for (let pointer of this.pointers.values()) {
            if (pointer.buttons > 0) {
                ++count;
            }
        }
        return count;
    }

    get pinchDistance() {
        const count = this.pressCount;
        if (count !== 2) {
            return null;
        }

        let a, b;
        for (let pointer of this.pointers.values()) {
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
    }
}