import { MouseButtons } from "./MouseButton";

/** @type {WeakMap<CursorControl, HTMLCanvasElement} */
const canvases = new WeakMap();

export class CursorControl {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        canvases.set(this, canvas);

        this.pointerLockElement = canvas;

        this.allowPointerLock = true;

        canvas.addEventListener("click", (evt) => {
            if (this.allowPointerLock
                && evt.pointerType === "mouse"
                && !this.isPointerLocked) {
                this.lockPointer();
            }
        });
    }

    lockPointer() {
        this.pointerLockElement.requestPointerLock();
    }

    get isPointerLocked() {
        return document.pointerLockElement !== null;
    }

    /**
     * 
     * @param {import("three").Intersection} lastHit
     * @param {import("./ScreenPointerControls").ScreenPointerEvent} evt
     */
    setCursor(lastHit, evt) {
        if (evt.pointerType === "mouse") {
            const canvas = canvases.get(this),
                pressing = evt.buttons === MouseButtons.Mouse0,
                dragging = evt.dragDistance > 0;

            canvas.style.cursor = lastHit
                ? lastHit.object.disabled
                    ? "not-allowed"
                    : dragging
                        ? "move"
                        : "pointer"
                : pressing
                    ? "grabbing"
                    : "grab";
        }
    }
}