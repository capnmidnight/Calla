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
    clickEvt = new ScreenPointerEvent("click"),
    moveEvt = new ScreenPointerEvent("move"),
    dragEvt = new ScreenPointerEvent("drag");

export class ScreenPointerControls extends EventBase {
    /**
     * @param {Element} element the element from which to receive pointer events
     */
    constructor(element) {
        super();

        this.pointerLockElement = element;

        /** @type {Map<Number, Pointer>} */
        this.pointers = new Map();

        /** @type {String} */
        this.currentInputType = null;

        let canClick = true;

        /**
         * @param {ScreenPointerEvent} evt
         * @param {Pointer} pointer
         */
        const setHorizontal = (evt, pointer) => {

            evt.pointerType = pointer.type;
            evt.pointerID = pointer.id;

            evt.buttons = pointer.buttons;

            evt.dx = pointer.dx;
            evt.dy = pointer.dy;
            evt.dz = 0;

            evt.du = 2 * evt.dx / element.clientWidth;
            evt.dv = 2 * evt.dy / element.clientHeight;

            if (this.isPointerLocked) {
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
        }

        /**
         * @param {Pointer} pointer - the newest state of the pointer.
         * @returns {Pointer} - the pointer state that was replaced, if any.
         */
        const replacePointer = (pointer) => {
            const last = this.pointers.get(pointer.id);

            if (last) {
                pointer.dragDistance = last.dragDistance;

                if (this.isPointerLocked) {
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
                const deltaZ = -evt.deltaY * (isFirefox ? 1 : 0.02);
                moveEvt.pointerType = "mouse";
                moveEvt.buttons = evt.buttons;
                moveEvt.dz = deltaZ;
                this.dispatchEvent(moveEvt);
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

            canClick = oldCount === 0
                && newCount === 1;
        });

        element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = this.pinchDistance,
                pointer = new Pointer(evt),
                last = replacePointer(pointer),
                count = this.pressCount,
                newPinchDistance = this.pinchDistance;

            setHorizontal(moveEvt, pointer);

            if (oldPinchDistance !== null
                && newPinchDistance !== null) {
                canClick = false;
                const ddist = newPinchDistance - oldPinchDistance;
                moveEvt.dz = ddist / 100;
            }

            this.dispatchEvent(moveEvt);

            if (count === 1
                && pointer.buttons === 1
                && last && last.buttons === pointer.buttons) {
                pointer.dragDistance += pointer.moveDistance;
                if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                    canClick = false;
                    setHorizontal(dragEvt, pointer);
                    this.dispatchEvent(dragEvt);
                }
            }
        });

        element.addEventListener("pointerup", (evt) => {
            const pointer = new Pointer(evt),
                _ = replacePointer(pointer);
            if (canClick) {
                setHorizontal(clickEvt, pointer);
                this.dispatchEvent(clickEvt);
            }

            pointer.dragDistance = 0;

            if (pointer.type === "touch") {
                this.pointers.delete(pointer.id);
            }
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
            if (pointer.buttons === 1) {
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

    lockPointer() {
        this.pointerLockElement.requestPointerLock();
    }

    get isPointerLocked() {
        return document.pointerLockElement !== null;
    }
}