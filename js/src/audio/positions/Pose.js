import { Vector } from "./Vector.js";
import { project } from "../../math.js";

/**
 * A position and orientation, at a given time.
 **/
export class Pose {
    /**
     * Creates a new position and orientation, at a given time.
     **/
    constructor() {
        this.t = 0;
        this.p = new Vector();
        this.f = new Vector();
        this.u = new Vector();
    }


    /**
     * Sets the components of the pose.
     * @param {number} px
     * @param {number} py
     * @param {number} pz
     * @param {number} fx
     * @param {number} fy
     * @param {number} fz
     * @param {number} ux
     * @param {number} uy
     * @param {number} uz
     */
    set(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.p.set(px, py, pz);
        this.f.set(fx, fy, fz);
        this.u.set(ux, uy, uz);
    }

    /**
     * Copies the components of another pose into this pose.
     * @param {Pose} other
     */
    copy(other) {
        this.p.copy(other.p);
        this.f.copy(other.f);
        this.u.copy(other.u);
    }

    /**
     * Performs a lerp between two positions and a slerp between to orientations
     * and stores the result in this pose.
     * @param {Pose} a
     * @param {Pose} b
     * @param {number} p
     */
    interpolate(start, end, t) {

        if (end.t < t) {
            this.copy(end);
        }
        else if (t >= start.t) {
            const p = project(t, start.t, end.t);
            this.p.lerp(start.p, end.p, p);
            this.f.slerp(start.f, end.f, p);
            this.u.slerp(start.u, end.u, p);
        }
    }
}
