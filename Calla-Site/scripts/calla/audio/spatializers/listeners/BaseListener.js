import { BaseSpatializer } from "../BaseSpatializer";

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
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext) {
        throw new Error("Calla no longer supports manual volume scaling");
    }
}
