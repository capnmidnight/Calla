import { setRightUpFwdPosFromMatrix } from "../calla/math/matrices";
import { Object3D } from "../lib/three.js/src/core/Object3D";
import { Vector3 } from "../lib/three.js/src/math/Vector3";
import { once } from "../calla/events/once";

const R = new Vector3();
const U = new Vector3();
const F = new Vector3();
const P = new Vector3();

export class CallaAudioSource extends Object3D {
    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {import("../calla/audio/AudioManager").AudioManager} audio
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     */
    constructor(audio, name) {
        super();

        this.audio = audio;
        this.name = name;

        /** @type {import("../calla/audio/AudioSource").AudioSource} */
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
     * @param {boolean?} force
     */
    updateMatrixWorld(force = false) {
        const willUpdate = this.matrixWorldNeedsUpdate || force;

        super.updateMatrixWorld(force);

        if (willUpdate) {
            setRightUpFwdPosFromMatrix(this.matrixWorld, R, U, F, P);
            this.audio.setClipPose(
                this.name,
                P.x, P.y, P.z,
                F.x, F.y, F.z,
                U.x, U.y, U.z,
                0);
        }
    }
}