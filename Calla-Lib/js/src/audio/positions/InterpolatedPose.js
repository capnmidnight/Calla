import { BaseSpatializer } from "../spatializers/BaseSpatializer.js";
import { Pose } from "./Pose.js";

/**
 * A position value that is blended from the current position to
 * a target position over time.
 */
export class InterpolatedPose {

    /**
     * Creates a new position value that is blended from the current position to
     * a target position over time.
     **/
    constructor() {
        this.start = new Pose();
        this.current = new Pose();
        this.end = new Pose();

        /** @type {BaseSpatializer} */
        this._spatializer = null;

        Object.seal(this);
    }

    get spatializer() {
        return this._spatializer;
    }

    set spatializer(v) {
        if (this.spatializer !== v) {
            if (this._spatializer) {
                this._spatializer.dispose();
            }
            this._spatializer = v;
        }
    }

    dispose() {
        this.spatializer = null;
    }

    /**
     * Set the target position and orientation for the time `t + dt`.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} fx - the horizontal component of the position.
     * @param {number} fy - the vertical component of the position.
     * @param {number} fz - the lateral component of the position.
     * @param {number} ux - the horizontal component of the position.
     * @param {number} uy - the vertical component of the position.
     * @param {number} uz - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, t, dt) {
        this.start.copy(this.current);
        this.start.t = t;
        this.end.set(px, py, pz, fx, fy, fz, ux, uy, uz);
        this.end.t = t + dt;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTargetPosition(px, py, pz, t, dt) {
        this.setTarget(
            px, py, pz,
            this.end.f.x, this.end.f.y, this.end.f.z,
            this.end.u.x, this.end.u.y, this.end.u.z,
            t, dt);
    }

    /**
     * Set the target orientation for the time `t + dt`.
     * @param {number} fx - the horizontal component of the position.
     * @param {number} fy - the vertical component of the position.
     * @param {number} fz - the lateral component of the position.
     * @param {number} ux - the horizontal component of the position.
     * @param {number} uy - the vertical component of the position.
     * @param {number} uz - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTargetOrientation(fx, fy, fz, ux, uy, uz, t, dt) {
        this.setTarget(
            this.end.p.x, this.end.p.y, this.end.p.z,
            fx, fy, fz,
            ux, uy, uz,
            t, dt);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        this.current.interpolate(this.start, this.end, t);
        if (this.spatializer) {
            this.spatializer.update(this.current);
        }
    }
}

