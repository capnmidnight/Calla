/**
 * Base class providing functionality for spatializers.
 */
export class BaseSpatializer {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.gain = null;
        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.algorithm = "logarithmic";
        this.transitionTime = 0.1;
        this.gain = audioContext.createGain();
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
    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.gain) {
            this.gain.disconnect();
            this.gain = null;
        }
    }
    get volume() {
        return this.gain.gain.value;
    }
    set volume(v) {
        this.gain.gain.value = v;
    }
    play() {
        return Promise.resolve();
    }
    stop() {
    }
}
//# sourceMappingURL=BaseSpatializer.js.map