import { InterpolatedPose } from "./positions/InterpolatedPose";


/**
 * @typedef {object} JitsiTrack
 * @property {Function} getParticipantId
 * @property {Function} getType
 * @property {Function} isMuted
 * @property {Function} isLocal
 * @property {Function} addEventListener
 * @property {Function} dispose
 * @property {MediaStream} stream
 **/

export class AudioSource {
    constructor() {
        this.pose = new InterpolatedPose();

        /** @type {Map<string, JitsiTrack>} */
        this.tracks = new Map();

        /** @type {import("./spatializers/BaseSpatializer").BaseSpatializer} */
        this._spatializer = null;
    }

    get spatializer() {
        return this._spatializer;
    }

    set spatializer(v) {
        if (this.spatializer !== v) {
            if (this._spatializer) {
                this._spatializer.dispose();
            }
            this._spatializer = v;
        }
    }

    dispose() {
        this.spatializer = null;
    }

    /**
     * Update the user.
     * @param {number} t - the current update time.
     */
    update(t) {
        this.pose.update(t);
        if (this.spatializer) {
            this.spatializer.update(this.pose.current);
        }
    }
}