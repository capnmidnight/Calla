/**
 * Base class providing functionality for spatializers.
 */
export class BaseSpatializer {
    minDistance = 1;
    maxDistance = 10;
    rolloff = 1;
    algorithm = "logarithmic";
    transitionTime = 0.1;
    constructor() {
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