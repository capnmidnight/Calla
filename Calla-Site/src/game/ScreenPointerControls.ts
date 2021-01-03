import { isFirefox } from "kudzu/html/flags";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { project } from "kudzu/math/project";
import { unproject } from "kudzu/math/unproject";

export class ScreenPointerEvent<T extends string> extends TypedEvent<T> {
    pointerType: string = null;
    pointerID: number = null;
    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    dz = 0;
    u = 0;
    v = 0;
    du = 0;
    dv = 0;
    buttons = 0;
    dragDistance = 0;
    constructor(type: T) {
        super(type);
        Object.seal(this);
    }
}

export class InputTypeChangingEvent extends TypedEvent<"inputTypeChanging"> {
    constructor(public newInputType: string) {
        super("inputTypeChanging");
        Object.freeze(this);
    }
}

export class Pointer {
    type: string;
    id: number;
    buttons: number;
    moveDistance: number;
    dragDistance: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    constructor(evt: PointerEvent | WheelEvent) {
        if (evt.type !== "wheel") {
            const ptrEvt = evt as PointerEvent;
            this.type = ptrEvt.pointerType;
            this.id = ptrEvt.pointerId;
        }
        else {
            this.type = "mouse";
            this.id = 0;
        }
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

interface ScreenPointerEvents {
    pointerdown: ScreenPointerEvent<"pointerdown">;
    pointerup: ScreenPointerEvent<"pointerup">;
    click: ScreenPointerEvent<"click">;
    move: ScreenPointerEvent<"move">;
    drag: ScreenPointerEvent<"drag">;
}

export class ScreenPointerControls extends TypedEventBase<ScreenPointerEvents> {
    pointers = new Map<number, Pointer>();
    currentInputType: string = null;
    constructor(element: HTMLElement) {
        super();

        let canClick = true;

        const dispatch = (evt: ScreenPointerEvent<string>, pointer: Pointer, dz: number) => {

            evt.pointerType = pointer.type;
            evt.pointerID = pointer.id;

            evt.buttons = pointer.buttons;

            evt.x = pointer.x;
            evt.y = pointer.y;

            evt.u = unproject(project(evt.x, 0, element.clientWidth), -1, 1);
            evt.v = unproject(project(evt.y, 0, element.clientHeight), -1, 1);

            evt.dx = pointer.dx;
            evt.dy = pointer.dy;
            evt.dz = dz;

            evt.du = 2 * evt.dx / element.clientWidth;
            evt.dv = 2 * evt.dy / element.clientHeight;

            evt.dragDistance = pointer.dragDistance;
            this.dispatchEvent(evt);
        };

        /**
         * @param pointer - the newest state of the pointer.
         * @returns the pointer state that was replaced, if any.
         */
        const replacePointer = (pointer: Pointer): Pointer => {
            const last = this.pointers.get(pointer.id);

            if (last) {
                pointer.dragDistance = last.dragDistance;

                if (document.pointerLockElement) {
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
                const pointer = new Pointer(evt);
                replacePointer(pointer);
                const deltaZ = -evt.deltaY * (isFirefox ? 1 : 0.02);

                dispatch(moveEvt, pointer, deltaZ);
            }
        }, { passive: false });

        element.addEventListener("pointerdown", (evt) => {
            const oldCount = this.pressCount;
            const pointer = new Pointer(evt);
            replacePointer(pointer);
            const newCount = this.pressCount;

            if (pointer.type !== this.currentInputType) {
                this.dispatchEvent(new InputTypeChangingEvent(pointer.type));
                this.currentInputType = pointer.type;
            }

            dispatch(pointerDownEvt, pointer, 0);

            canClick = oldCount === 0
                && newCount === 1;
        });

        const getPinchZoom = (oldPinchDistance: number, newPinchDistance: number) => {
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

        return null;
    }

    getPointerCount(type: string) {
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