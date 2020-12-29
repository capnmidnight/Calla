import { vec3 } from "gl-matrix";
import { project } from "kudzu";
/**
 * A position and orientation, at a given time.
 **/
export class Pose {
    /**
     * Creates a new position and orientation, at a given time.
     **/
    constructor() {
        this.t = 0;
        this.p = vec3.create();
        this.f = vec3.set(vec3.create(), 0, 0, -1);
        this.u = vec3.set(vec3.create(), 0, 1, 0);
        Object.seal(this);
    }
    /**
     * Sets the components of the pose.
     */
    set(px, py, pz, fx, fy, fz, ux, uy, uz) {
        vec3.set(this.p, px, py, pz);
        vec3.set(this.f, fx, fy, fz);
        vec3.set(this.u, ux, uy, uz);
    }
    /**
     * Copies the components of another pose into this pose.
     */
    copy(other) {
        vec3.copy(this.p, other.p);
        vec3.copy(this.f, other.f);
        vec3.copy(this.u, other.u);
    }
    /**
     * Performs a lerp between two positions and a slerp between to orientations
     * and stores the result in this pose.
     */
    interpolate(start, end, t) {
        if (t <= start.t) {
            this.copy(start);
        }
        else if (end.t <= t) {
            this.copy(end);
        }
        else if (start.t < t) {
            const p = project(t, start.t, end.t);
            this.copy(start);
            vec3.lerp(this.p, this.p, end.p, p);
            vec3.lerp(this.f, this.f, end.f, p);
            vec3.lerp(this.u, this.u, end.u, p);
            vec3.normalize(this.f, this.f);
            vec3.normalize(this.u, this.u);
            this.t = t;
        }
    }
}
//# sourceMappingURL=Pose.js.map