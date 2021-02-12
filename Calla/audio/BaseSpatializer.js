/**
 * Base class providing functionality for spatializers.
 */
export class BaseSpatializer {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.algorithm = "logarithmic";
        this.transitionTime = 0.1;
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