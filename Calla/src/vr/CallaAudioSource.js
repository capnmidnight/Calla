import { BaseThreeJSAudioObject } from "./BaseThreeJSAudioObject";

export class CallaAudioSource extends BaseThreeJSAudioObject {
    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {import("../audio/AudioManager").AudioManager} audio
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     */
    constructor(audio, name) {
        super(audio, name);

        /** @type {import("../audio/AudioSource").AudioSource} */
        this.clip = null;
    }

    async load(loop, autoPlay, spatialize, onProgress, ...paths) {
        await once(this.audio, "audioready");
        this.clip = await this.audio.createClip(
            this.name,
            loop,
            autoPlay,
            spatialize,
            onProgress,
            ...paths);
    }

    get audioElement() {
        return this.clip.spatializer.audio;
    }

    get minDistance() {
        return this.clip.spatializer.minDistance;
    }

    set minDistance(v) {
        this.clip.spatializer.minDistance = v;
    }

    get maxDistance() {
        return this.clip.spatializer.maxDistance;
    }

    set maxDistance(v) {
        this.clip.spatializer.maxDistance = v;
    }

    /**
     * @param {import("three/src/math/Vector3").Vector3} P
     * @param {import("three/src/math/Vector3").Vector3} F
     * @param {import("three/src/math/Vector3").Vector3} U
     */
    _setPose(P, F, U) {
        this.audio.setClipPose(
            this.name,
            P.x, P.y, P.z,
            F.x, F.y, F.z,
            U.x, U.y, U.z,
            0);
    }
}