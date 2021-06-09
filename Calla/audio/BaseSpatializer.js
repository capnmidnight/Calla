/**
 * Base class providing functionality for spatializers.
 */
export class BaseSpatializer {
    audioContext;
    minDistance = 1;
    maxDistance = 10;
    rolloff = 1;
    algorithm = "logarithmic";
    transitionTime = 0.1;
    constructor(audioContext) {
        this.audioContext = audioContext;
    }
    dispose() {
        // nothing to do in the base case
    }
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.rolloff = rolloff;
        this.algorithm = algorithm;
        this.transitionTime = transitionTime;
    }
}
//# sourceMappingURL=BaseSpatializer.js.map