import { vec3 } from "gl-matrix";
import { Pose } from "./Pose";
const delta = vec3.create();
const k = 2;
/**
 * A position value that is blended from the current position to
 * a target position over time.
 */
export class InterpolatedPose {
    start = new Pose();
    current = new Pose();
    end = new Pose();
    offset = vec3.create();
    /**
     * Set the target comfort offset for the time `t + dt`.
     */
    setOffset(ox, oy, oz) {
        vec3.set(delta, ox, oy, oz);
        vec3.sub(delta, delta, this.offset);
        vec3.add(this.start.p, this.start.p, delta);
        vec3.add(this.current.p, this.current.p, delta);
        vec3.add(this.end.p, this.end.p, delta);
        vec3.scale(this.start.f, this.start.f, k);
        vec3.add(this.start.f, this.start.f, delta);
        vec3.normalize(this.start.f, this.start.f);
        vec3.scale(this.current.f, this.current.f, k);
        vec3.add(this.current.f, this.current.f, delta);
        vec3.normalize(this.current.f, this.current.f);
        vec3.scale(this.end.f, this.end.f, k);
        vec3.add(this.end.f, this.end.f, delta);
        vec3.normalize(this.end.f, this.end.f);
        vec3.set(this.offset, ox, oy, oz);
    }
    /**
     * Set the target position and orientation for the time `t + dt`.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the position.
     * @param fy - the vertical component of the position.
     * @param fz - the lateral component of the position.
     * @param ux - the horizontal component of the position.
     * @param uy - the vertical component of the position.
     * @param uz - the lateral component of the position.
     * @param t - the time at which to start the transition.
     * @param dt - the amount of time to take making the transition.
     */
    setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, t, dt) {
        const ox = this.offset[0];
        const oy = this.offset[1];
        const oz = this.offset[2];
        this.end.t = t + dt;
        this.end.set(px + ox, py + oy, pz + oz, fx, fy, fz, ux, uy, uz);
        this.start.t = t;
        this.current.t = t;
        if (dt <= 0 || this.current.t === 0) {
            this.start.copy(this.end);
        }
        else {
            this.start.copy(this.current);
        }
    }
    /**
     * Set the target position for the time `t + dt`.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param t - the time at which to start the transition.
     * @param dt - the amount of time to take making the transition.
     */
    setTargetPosition(px, py, pz, t, dt) {
        this.setTarget(px, py, pz, this.end.f[0], this.end.f[1], this.end.f[2], this.end.u[0], this.end.u[1], this.end.u[2], t, dt);
    }
    /**
     * Set the target orientation for the time `t + dt`.
     * @param fx - the horizontal component of the position.
     * @param fy - the vertical component of the position.
     * @param fz - the lateral component of the position.
     * @param ux - the horizontal component of the position.
     * @param uy - the vertical component of the position.
     * @param uz - the lateral component of the position.
     * @param t - the time at which to start the transition.
     * @param dt - the amount of time to take making the transition.
     */
    setTargetOrientation(fx, fy, fz, ux, uy, uz, t, dt) {
        this.setTarget(this.end.p[0], this.end.p[1], this.end.p[2], fx, fy, fz, ux, uy, uz, t, dt);
    }
    /**
     * Calculates the new position for the given time.
     */
    update(t) {
        this.current.interpolate(this.start, this.end, t);
    }
}
//# sourceMappingURL=InterpolatedPose.js.map