import { glMatrix, mat4, quat, vec3 } from "gl-matrix";
import { deg2rad } from "../math/deg2rad";
import { Context3D, ResizeEvent } from "../webgl/Context3D";

export class Camera {
    private _proj = mat4.create();
    private _view = mat4.create();

    private _heading: number = 0;
    private _pitch: number = 0;

    private _aspect: number;
    private _fov: number;
    private _near: number;
    private _far: number;

    public gamma: number = 0.75;

    private _rot: quat = quat.create();
    private _pos: vec3 = vec3.create();

    constructor(ctx: Context3D, fov: number = 60, near: number = 0.1, far: number = 100) {
        ctx.addEventListener("resize", (evt: ResizeEvent) => {
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

    get projection(): mat4 {
        return this._proj;
    }

    get fov(): number {
        return this._fov;
    }

    set fov(v: number) {
        if (v !== this.fov) {
            this._fov = v;
            this.refreshProjection();
        }
    }

    get aspect(): number {
        return this._aspect;
    }

    get near(): number {
        return this._near;
    }

    set near(v: number) {
        if (v !== this.near) {
            this._near = v;
            this.refreshProjection;
        }
    }

    get far(): number {
        return this._far;
    }

    set far(v: number) {
        if (v !== this.far) {
            this._far = v;
            this.refreshProjection;
        }
    }

    private refreshProjection() {
        mat4.perspective(
            this._proj,
            glMatrix.toRadian(this._fov),
            this._aspect,
            this._near,
            this._far
        );
    }

    get view(): mat4 {
        return this._view;
    }

    get heading(): number {
        return this._heading;
    }

    get pitch(): number {
        return this._pitch;
    }

    private _rotateBy(dHeading: number, dPitch: number) {
        const heading = this._heading + dHeading;
        const pitch = this._pitch + dPitch;
        this._rotateTo(heading, pitch);
    }

    private _rotateTo(heading: number, pitch: number) {
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

    private _moveBy(dPos: vec3) {
        vec3.add(this._pos, this._pos, dPos);
    }

    private _moveTo(pos: vec3) {
        vec3.copy(this._pos, pos);
    }

    public rotateBy(dHeading: number, dPitch: number) {
        this._rotateBy(dHeading, dPitch);
        this.refreshView();
    }

    public rotateTo(heading: number, pitch: number) {
        this._rotateTo(heading, pitch);
        this.refreshView();
    }

    public moveBy(dPos: vec3) {
        this._moveBy(dPos);
        this.refreshView();
    }

    public moveTo(pos: vec3) {
        this._moveTo(pos);
        this.refreshView();
    }

    public rotateAndMoveBy(dHeading: number, dPitch: number, dPos: vec3) {
        this._rotateBy(dHeading, dPitch);
        this._moveBy(dPos);
        this.refreshView();
    }

    public rotateAndMoveTo(heading: number, pitch: number, pos: vec3) {
        this._rotateTo(heading, pitch);
        this._moveTo(pos);
        this.refreshView();
    }

    private refreshView() {
        mat4.fromRotationTranslation(this.view, this._rot, this._pos);
        mat4.invert(this.view, this.view);
    }
}
