import { Object3D } from "three/src/core/Object3D";
import { Vector3 } from "three/src/math/Vector3";
import { setRightUpFwdPosFromMatrix } from "../math/matrices";

const R = new Vector3();
const U = new Vector3();
const F = new Vector3();
const P = new Vector3();

export class BaseThreeJSAudioObject extends Object3D {
    /**
     * @param {import("../audio/AudioManager").AudioManager} audio
     * @param {string} name
     */
    constructor(audio, name) {
        super();

        this.audio = audio;
        this.name = name;

        this.audio.addEventListener("audioready", () => {
            this.audio.createLocalUser(this.name);
        });
    }

    /**
     * @param {Vector3} P
     * @param {Vector3} F
     * @param {Vector3} U
     */
    _setPose(P, F, U) {
        throw new Error("Not implemented in base classe");
    }

    /**
     * @param {boolean?} force
     */
    updateMatrixWorld(force = false) {
        const willUpdate = this.matrixWorldNeedsUpdate || force;

        super.updateMatrixWorld(force);

        if (willUpdate) {
            setRightUpFwdPosFromMatrix(this.matrixWorld, R, U, F, P);
            this._setPose(P, F, U);
        }
    }
}