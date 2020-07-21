import { BasePosition } from "./BasePosition.js";
import { InterpolatedPosition } from "./InterpolatedPosition.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioNewNodePosition extends BasePosition {

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {PannerNode|AudioListener} node - the audio node that will receive the position value.
     * @param {boolean} forceInterpolation - when set to true, circumvents WebAudio's time tracking and uses our own.
     */
    constructor(node, forceInterpolation) {
        super();

        /** @type {BasePosition} */
        this._p = forceInterpolation ? new InterpolatedPosition() : null;
        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    /**
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        return this.node.positionX.value;
    }

    /**
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        return this.node.positionZ.value;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} t
     * @param {number} dt
     */
    setTarget(x, y, t, dt) {
        if (this._p) {
            this._p.setTarget(x, y, t, dt);
        }
        else {
            const time = t + dt;
            // our 2D position is in X/Y coords, but our 3D position
            // along the horizontal plane is X/Z coords.
            this.node.positionX.linearRampToValueAtTime(x, time);
            this.node.positionZ.linearRampToValueAtTime(y, time);
        }
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        if (this._p) {
            this._p.update(t);
            this.node.positionX.linearRampToValueAtTime(this._p.x, 0);
            this.node.positionZ.linearRampToValueAtTime(this._p.y, 0);
        }
    }
}

