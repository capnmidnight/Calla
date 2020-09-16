import { Object3D } from "../../lib/three.js/src/core/Object3D";
import { Vector3 } from "../../lib/three.js/src/math/Vector3";
import { setRightUpFwdPosFromMatrix } from "../math/matrices";

const R = new Vector3();
const U = new Vector3();
const F = new Vector3();
const P = new Vector3();

export class CallaAudioListener extends Object3D {
    /**
     * @param {import("../calla/audio/AudioManager").AudioManager} audio
     * @param {string?} name
     */
    constructor(audio, name = null) {
        super();

        this.audio = audio;
        this.name = name || "local-user";

        this.audio.addEventListener("audioready", () => {
            this.audio.createLocalUser(this.name);
        });
    }

    /**
     * @param {boolean?} force
     */
    updateMatrixWorld(force = false) {
        const willUpdate = this.matrixWorldNeedsUpdate || force;

        super.updateMatrixWorld(force);

        if (willUpdate) {
            setRightUpFwdPosFromMatrix(this.matrixWorld, R, U, F, P);
            this.audio.setUserPose(
                this.name,
                P.x, P.y, P.z,
                F.x, F.y, F.z,
                U.x, U.y, U.z,
                0);
        }
    }
}