import { BaseThreeJSAudioObject } from "./BaseThreeJSAudioObject";

export class CallaAudioListener extends BaseThreeJSAudioObject {
    /**
     * @param {import("../audio/AudioManager").AudioManager} audio
     * @param {string?} name
     */
    constructor(audio, name = null) {
        super(audio, name || "local-user");

        this.audio.addEventListener("audioready", () => {
            this.audio.createLocalUser(this.name);
        });
    }

    /**
     * @param {import("three/src/math/Vector3").Vector3} P
     * @param {import("three/src/math/Vector3").Vector3} F
     * @param {import("three/src/math/Vector3").Vector3} U
     */
    _setPose(P, F, U) {
        this.audio.setUserPose(
            this.name,
            P.x, P.y, P.z,
            F.x, F.y, F.z,
            U.x, U.y, U.z,
            0);
    }
}