import { Pose } from "../../positions/Pose.js";
import { BaseSpatializer } from "../BaseSpatializer.js";
import { ManualVolume } from "../sources/ManualVolume.js";
import { ManualStereo } from "../sources/ManualStereo.js";

let hasAudioContext = Object.prototype.hasOwnProperty.call(window, "AudioContext"),
    hasStereoPanner = hasAudioContext && Object.prototype.hasOwnProperty.call(window, "StereoPannerNode");

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
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        if (hasStereoPanner) {
            try {
                return new ManualStereo(id, stream, bufferSize, audioContext, dest);
            }
            catch (exp) {
                hasStereoPanner = false;
                console.warn("Couldn't create a stereo panner. Reason:", exp);
            }
        }

        if (!hasStereoPanner) {
            return new ManualVolume(id, stream, dest);
        }
    }
}
