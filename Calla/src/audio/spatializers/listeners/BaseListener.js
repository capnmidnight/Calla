import { BaseSpatializer } from "../BaseSpatializer";
import { DirectSource } from "../sources/DirectSource";

export class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     */
    constructor() {
        super();
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {boolean} spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
     * @param {AudioContext} audioContext
     * @return {BaseSource}
     */
    createSource(id, stream, spatialize, audioContext) {
        if (spatialize) {
            throw new Error("Calla no longer supports manual volume scaling");
        }
        else {
            return new DirectSource(id, stream, audioContext);
        }
    }
}
