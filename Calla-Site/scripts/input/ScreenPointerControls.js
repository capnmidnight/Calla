import { EventBase } from "../calla";
import { isFirefox } from "../html/flags";

export class ScreenPointerEvent extends Event {
    constructor(type) {
        super(type);

        this.pointerType = null;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.u = 0;
        this.v = 0;
        this.du = 0;
        this.dv = 0;
        this.button = 0;

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
    dragEvt = new ScreenPointerEvent("drag"),
    wheelEvt = Object.assign(new Event("wheel"), {
        dz: 0
    });

export class ScreenPointerControls extends EventBase {
    /**
     * @param {Element} element the element from which to receive pointer events
     */
    constructor(element) {
        super();

        /** @type {Map<Number, Pointer>} */
        this.pointers = new Map();

        /** @type {String} */
        this.currentInputType = null;

        /** @type {Boolean} */
        this.isDragging = false;

        let canClick = true;

        /**
         * @param {ScreenPointerEvent} evt
         * @param {Pointer} pointer
         */
        function setEvt(evt, pointer) {

            evt.pointerType = pointer.type;

            evt.x = pointer.x;
            evt.y = pointer.y;
            evt.dx = pointer.dx;
            evt.dy = pointer.dy;

            evt.u = 2 * evt.x / element.clientWidth - 1;
            evt.v = -2 * evt.y / element.clientHeight + 1;
            evt.du = 2 * evt.dx / element.clientWidth;
            evt.dv = -2 * evt.dy / element.clientHeight;
        }

        /**
         * @param {Pointer} pointer - the newest state of the pointer.
         * @returns {Pointer} - the pointer state that was replaced, if any.
         */
        const replacePointer = (pointer) => {
            const last = this.pointers.get(pointer.id);

            if (last && document.pointerLockElement) {
                pointer.x = last.x + pointer.dx;
                pointer.y = last.y + pointer.dy;
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
                wheelEvt.dz = deltaZ;
                this.dispatchEvent(wheelEvt);
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

            this.isDragging = false;
        });

        element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = this.pinchDistance,
                pointer = new Pointer(evt),
                last = replacePointer(pointer),
                count = this.pressCount,
                newPinchDistance = this.pinchDistance;

            setEvt(moveEvt, pointer);
            this.dispatchEvent(moveEvt);

            if (count === 1
                && pointer.buttons === 1
                && last && last.buttons === pointer.buttons) {
                pointer.dragDistance = last.dragDistance + pointer.moveDistance;
                if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                    canClick = false;
                    this.isDragging = true;
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
            const pointer = new Pointer(evt),
                _ = replacePointer(pointer);

            if (canClick) {
                setEvt(clickEvt, pointer);
                this.dispatchEvent(clickEvt);
            }

            this.isDragging = false;
        });

        element.addEventListener("pointercancel", (evt) => {
            const pointer = new Pointer(evt);
            if (this.pointers.has(pointer.id)) {
                this.pointers.delete(pointer.id);
            }

            this.isDragging = false;
        });
    }

    get primaryPointer() {
        for (let pointer of this.pointers.values()) {
            return pointer;
        }
    }

    get pointerCount() {
        return this.pointers.size;
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
}