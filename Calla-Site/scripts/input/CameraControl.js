import { Euler, PerspectiveCamera, Quaternion, Vector2, Vector3, WebGLRenderer } from "three";
import { addEventListeners, EventBase } from "../calla";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { MouseButtons } from "./MouseButton";
import { ScreenPointerControls } from "./ScreenPointerControls";
import { Stage } from "./Stage";


const NEUTRAL_POSITION_RESET_QUAT = new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0));
const FLIP_IMAGE_QUAT = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI));

/// <summary>
/// The mouse is not as sensitive as the motion controllers, so we have to bump up the
/// sensitivity quite a bit.
/// </summary>
/** @type {number} */
const MOUSE_SENSITIVITY_SCALE = 100;

/// <summary>
/// The mouse is not as sensitive as the motion controllers, so we have to bump up the
/// sensitivity quite a bit.
/// </summary>
/** @type {Number} */
const TOUCH_SENSITIVITY_SCALE = 0.5;

const Mode = Object.freeze({
    None: "none",
    Auto: "auto",
    MouseLocked: "mouselocked",
    MouseScreenEdge: "mouseedge",
    Touch: "touchswipe",
    Gamepad: "gamepad",
    MagicWindow: "magicwindow",
    NetworkView: "net",
    WebXR: "xr"
});

const tempQuat = new Quaternion();
const deltaEuler = new Euler();
const deltaQuat = new Quaternion();

class ModeChangeEvent extends Event {
    /**
     * @param {Mode} newMode
     * @param {Mode} oldMode
     */
    constructor(newMode, oldMode) {
        super("modechanged");

        this.newMode = newMode;
        this.oldMode = oldMode;

        Object.freeze(this);
    }
}

export class CameraControl extends EventBase {

    /**
     * @param {PerspectiveCamera} camera
     * @param {Stage} stage
     * @param {ScreenPointerControls} controls
     */
    constructor(camera, stage, controls) {
        super();

        this.camera = camera;
        this.stage = stage;
        this.controls = controls;

        /** @type {Mode} */
        this.controlMode = Mode.Auto;

        /** @type {Mode} */
        this.lastMode = Mode.None;

        /** @type {MouseButtons} */
        this.requiredMouseButton = MouseButtons.None;

        /** @type {Boolean} */
        this.showCustomCursor = false;

        /** @type {Boolean} */
        this.allowPointerLock = false;

        /** @type {Number} */
        this.requiredTouchCount = 1;

        /** @type {Number} */
        this.dragThreshold = 2;

        /** @type {Boolean} */
        this.disableHorizontal = false;

        /** @type {Boolean} */
        this.disableVertical = false;

        /** @type {Boolean} */
        this.invertHorizontal = false;

        /** @type {Boolean} */
        this.invertVertical = true;

        /// <summary>
        /// Minimum vertical value
        /// </summary>
        /** @type {Number} */
        this.minimumX = -85 * Math.PI / 180;

        /// <summary>
        /// Maximum vertical value
        /// </summary>
        /** @type {Number} */
        this.maximumX = 85 * Math.PI / 180;

        /** @type {Quaternion} */
        this.target = new Quaternion(0, 0, 0, 1);

        /** @type {PoseSerializable} */
        this._networkPose = null;

        /** @type {Quaternion} */
        this.lastGyro = new Quaternion(0, 0, 0, 1);

        /** @type {Map<Mode, Boolean>} */
        this.wasGestureSatisfied = new Map();

        /** @type {Map<Mode, Boolean>} */
        this.dragged = new Map();

        /** @type {Map<Mode, number>} */
        this.dragDistance = new Map();


        this.edgeFactor = 1 / 3;
        this.accelerationX = 2;
        this.accelerationY = 2;
        this.speedX = 4;
        this.speedY = 3;


        for (const mode of Object.values(Mode)) {
            this.wasGestureSatisfied.set(mode, false);
            this.dragged.set(mode, false);
            this.dragDistance.set(mode, 0);
        }

        let lastT = performance.now();
        let lastEvt = null;
        const update = (evt) => {

            const t = performance.now();
            const dt = (t - lastT) / 1000;
            lastT = t;
            lastEvt = evt;

            if (evt.pointerType === "mouse") {
                if (this.controls.isPointerLocked) {
                    this.controlMode = Mode.MouseLocked;
                }
                else {
                    this.controlMode = Mode.MouseScreenEdge;
                }
            }
            else if (evt.pointerType === "touch") {
                this.controlMode = Mode.Touch;
            }
            else if (evt.pointerType === "gamepad") {
                this.controlMode = Mode.Gamepad;
            }

            if (this.controlMode != this.lastMode) {
                this.dispatchEvent(new ModeChangeEvent(this.controlMode, this.lastMode));
                this.lastMode = this.controlMode;
            }

            if (this.controlMode != Mode.None) {
                this.checkMode(
                    this.controlMode,
                    this.controlMode === Mode.MagicWindow || this.disableVertical,
                    evt,
                    dt);
            }
        };

        const timer = new RequestAnimationFrameTimer();
        timer.addEventListener("tick", () => {
            if (this.controlMode === Mode.MouseScreenEdge) {
                update(lastEvt);
            }
            else {
                lastT = performance.now();
            }
        });
        timer.start();

        addEventListeners(this.controls, {
            click: (evt) => {

                if (this.controlMode == Mode.MouseScreenEdge
                    && evt.pointerType === "mouse"
                    && !this.controls.isPointerLocked
                    && this.allowPointerLock) {
                    this.controls.lockPointer();
                }

                update(evt);
            },

            move: update
        });
    }

    get networkPose() {
        return this._networkPose;
    }

    set networkPose(value) {
        this._networkPose = value;
        if (this._networkPose) {
            this.target = this._networkPose.Orientation;
        }
    }

    /**
     * @param {Mode} mode
     */
    gestureSatisfied(mode, evt) {
        if (mode == Mode.None) {
            return false;
        }
        else if (mode == Mode.Gamepad || mode == Mode.MagicWindow) {
            return true;
        }
        else if (mode == Mode.Touch) {
            return this.controls.pointerCount === this.requiredTouchCount;
        }
        else if (mode == Mode.NetworkView) {
            return this.networkPose !== null;
        }
        else {
            const pressed = this.requiredMouseButton == MouseButtons.None || evt.buttons === this.requiredMouseButton;
            const down = this.requiredMouseButton != MouseButtons.None && evt.buttons === this.requiredMouseButton;
            return pressed && !down && (mode != Mode.MouseLocked || this.controls.isPointerLocked);
        }
    }

    /**
     * @param {Mode} mode
     */
    pointerMovement(mode, evt) {
        switch (mode) {
            case Mode.MouseLocked:
            case Mode.Gamepad:
                return this.getAxialMovement(evt);

            case Mode.MouseScreenEdge:
                return this.getRadiusMovement(evt);

            case Mode.Touch:
                return this.meanTouchPointMovement;

            default:
                return new Vector3(0, 0, 0);
        }
    }

    getAxialMovement(evt) {
        const viewport = new Vector3(
            MOUSE_SENSITIVITY_SCALE * evt.du,
            MOUSE_SENSITIVITY_SCALE * evt.dv,
            evt.dz);

        return viewport;
    }

    getRadiusMovement(evt) {
        const viewport = new Vector3(evt.u, evt.v, evt.dz);
        const absX = Math.abs(viewport.x);
        const absY = Math.abs(viewport.y);


        viewport.x = Math.sign(viewport.x) * Math.pow(Math.max(0, absX - this.edgeFactor) / (1 - this.edgeFactor), this.accelerationX) * this.speedX;
        viewport.y = Math.sign(viewport.y) * Math.pow(Math.max(0, absY - this.edgeFactor) / (1 - this.edgeFactor), this.accelerationY) * this.speedY;

        return viewport;
    }

    get meanTouchPointMovement() {
        const delta = new Vector2(0, 0);
        let count = 0;
        for (const pointer of this.controls.pointers.values()) {
            if (pointer.type === "touch") {
                delta.x += pointer.x;
                delta.y += pointer.y;
                ++count;
            }
        }

        delta.set(
            TOUCH_SENSITIVITY_SCALE * delta.y / count,
            -TOUCH_SENSITIVITY_SCALE * delta.x / count);
        return delta;
    }

    /**
     * @param {Mode} mode
     * @param {Boolean} disableVertical
     */
    orientationDelta(mode, disableVertical, evt, dt) {
        if (mode == Mode.MagicWindow
            || mode == Mode.NetworkView) {
            const endQuat = this.absoluteOrientation;
            const dRot = this.lastGyro.inverse().multiply(endQuat);
            this.lastGyro = endQuat;
            return dRot;
        }
        else {
            var move = this.pointerMovement(mode, evt);

            if (disableVertical) {
                move.x = 0;
            }
            else if (this.invertVertical) {
                move.x *= -1;
            }

            if (this.disableHorizontal) {
                move.y = 0;
            }
            else if (this.invertHorizontal) {
                move.y *= -1;
            }

            move.multiplyScalar(dt);
            deltaEuler.set(move.y, move.x, move.z, "YXZ");
            deltaQuat.setFromEuler(deltaEuler);

            return deltaQuat;
        }
    }

    get absoluteOrientation() {
        if (this.controlMode == Mode.MagicWindow) {
            return NEUTRAL_POSITION_RESET_QUAT
                .multiply(UnityInput.gyro.attitude)
                .multiply(FLIP_IMAGE_QUAT);
        }
        else if (this.controlMode == Mode.NetworkView) {
            return new Quaternion().fromArray(this.networkPose.Orientation);
        }
        else {
            return new Quaternion(0, 0, 0, 1);
        }
    }

    /**
     * @param {Mode} mode
     */
    dragRequired(mode) {
        return mode != Mode.NetworkView
            && (mode == Mode.Touch
                || (mode == Mode.MouseLocked
                    && this.requiredMouseButton != MouseButtons.None));
    }

    /**
     * @param {Mode} mode
     */
    dragSatisfied(mode) {
        if (!this.dragRequired(mode)) {
            return true;
        }
        else {
            var move = this.pointerMovement(mode);
            if (!this.dragged.get(mode)) {
                const dist = this.dragDistance.get(mode) + move.magnitude / Scree.dpi;
                this.dragDistance.set(mode, dist);
                this.dragged.set(mode, Units.Inches.Millimeters(this.dragDistance.get(mode)) > this.dragThreshold);
            }
            return this.dragged.get(mode);
        }
    }

    /**
     * @param {Mode} mode
     * @param {Boolean} disableVertical
     */
    checkMode(mode, disableVertical, evt, dt) {
        var gest = this.gestureSatisfied(mode, evt);
        var wasGest = this.wasGestureSatisfied.has(mode)
            && this.wasGestureSatisfied.get(mode);
        if (gest) {
            if (!wasGest) {
                this.dragged.set(mode, false);
                this.dragDistance.set(mode, 0);
            }

            if (this.dragSatisfied(mode)) {
                if (mode == Mode.NetworkView) {
                    Quaternion.slerp(this.stage.camera.getWorldQuaternion(), this.target, tempQuat, 0.25);
                    this.stage.setViewRotation(tempQuat);
                }
                else {
                    const dQuat = this.orientationDelta(mode, disableVertical, evt, dt);
                    this.stage.rotateView(
                        dQuat,
                        this.minimumX,
                        this.maximumX);
                }
            }
        }

        this.wasGestureSatisfied.set(mode, gest);
    }
}

CameraControl.Mode = Mode;