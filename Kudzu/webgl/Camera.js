import { glMatrix, mat4, quat, vec3 } from "gl-matrix";
import { deg2rad } from "../math/deg2rad";
export class Camera {
    constructor(ctx, fov = 60, near = 0.1, far = 100) {
        this._proj = mat4.create();
        this._view = mat4.create();
        this._heading = 0;
        this._pitch = 0;
        this.gamma = 0.75;
        this._rot = quat.create();
        this._pos = vec3.create();
        ctx.addEventListener("resize", (evt) => {
            this._aspect = evt.width / evt.height;
            this.refreshProjection();
        });
        this._aspect = ctx.width / ctx.height;
        this._fov = fov;
        this._near = near;
        this._far = far;
        this.refreshProjection();
        this.refreshView();
    }
    get projection() {
        return this._proj;
    }
    get fov() {
        return this._fov;
    }
    set fov(v) {
        if (v !== this.fov) {
            this._fov = v;
            this.refreshProjection();
        }
    }
    get aspect() {
        return this._aspect;
    }
    get near() {
        return this._near;
    }
    set near(v) {
        if (v !== this.near) {
            this._near = v;
            this.refreshProjection;
        }
    }
    get far() {
        return this._far;
    }
    set far(v) {
        if (v !== this.far) {
            this._far = v;
            this.refreshProjection;
        }
    }
    refreshProjection() {
        mat4.perspective(this._proj, glMatrix.toRadian(this._fov), this._aspect, this._near, this._far);
    }
    get view() {
        return this._view;
    }
    get heading() {
        return this._heading;
    }
    get pitch() {
        return this._pitch;
    }
    _rotateBy(dHeading, dPitch) {
        const heading = this._heading + dHeading;
        const pitch = this._pitch + dPitch;
        this._rotateTo(heading, pitch);
    }
    _rotateTo(heading, pitch) {
        this._heading = heading;
        this._pitch = pitch;
        while (this.pitch < -90)
            this._pitch = -90;
        while (this.pitch > 90)
            this._pitch = 90;
        quat.identity(this._rot);
        quat.rotateY(this._rot, this._rot, deg2rad(this.heading));
        quat.rotateX(this._rot, this._rot, deg2rad(this.pitch));
    }
    _moveBy(dPos) {
        vec3.add(this._pos, this._pos, dPos);
    }
    _moveTo(pos) {
        vec3.copy(this._pos, pos);
    }
    rotateBy(dHeading, dPitch) {
        this._rotateBy(dHeading, dPitch);
        this.refreshView();
    }
    rotateTo(heading, pitch) {
        this._rotateTo(heading, pitch);
        this.refreshView();
    }
    moveBy(dPos) {
        this._moveBy(dPos);
        this.refreshView();
    }
    moveTo(pos) {
        this._moveTo(pos);
        this.refreshView();
    }
    rotateAndMoveBy(dHeading, dPitch, dPos) {
        this._rotateBy(dHeading, dPitch);
        this._moveBy(dPos);
        this.refreshView();
    }
    rotateAndMoveTo(heading, pitch, pos) {
        this._rotateTo(heading, pitch);
        this._moveTo(pos);
        this.refreshView();
    }
    refreshView() {
        mat4.fromRotationTranslation(this.view, this._rot, this._pos);
        mat4.invert(this.view, this.view);
    }
}
//# sourceMappingURL=Camera.js.map