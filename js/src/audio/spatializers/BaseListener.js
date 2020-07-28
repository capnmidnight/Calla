import { BaseSpatializer } from "./BaseSpatializer.js";
import { ManualVolume } from "./ManualVolume.js";

let tryStereo = true;

export class BaseListener extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of position
     * @param {Destination} destination
     */
    constructor(destination) {
        super(destination);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSource}
     */
    createSource(stream, bufferSize) {
        if (tryStereo) {
            try {
                return new ManualStereo(this, stream, bufferSize);
            }
            catch (exp) {
                tryStereo = false;
            }
        }

        if (!tryStereo) {
            return new ManualVolume(this.destination, stream);
        }
    }
}
