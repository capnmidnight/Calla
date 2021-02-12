import { BaseEmitter } from "./BaseEmitter";
/**
 * Base class for spatializers that uses WebAudio's PannerNode
 **/
export class BaseWebAudioPanner extends BaseEmitter {
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param audioContext - the output WebAudio context
     */
    constructor(audioContext, destination) {
        const panner = audioContext.createPanner();
        super(audioContext, panner, panner, destination);
        this.panner = panner;
        this.panner.panningModel = "HRTF";
        this.panner.distanceModel = "inverse";
        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 0;
        this.panner.coneOuterGain = 0;
    }
    copyAudioProperties(from) {
        super.copyAudioProperties(from);
        this.panner.panningModel = from.panner.panningModel;
        this.panner.distanceModel = from.panner.distanceModel;
        this.panner.coneInnerAngle = from.panner.coneInnerAngle;
        this.panner.coneOuterAngle = from.panner.coneOuterAngle;
        this.panner.coneOuterGain = from.panner.coneOuterGain;
    }
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
        this.panner.refDistance = this.minDistance;
        if (this.algorithm === "logarithmic") {
            algorithm = "inverse";
        }
        this.panner.distanceModel = algorithm;
        this.panner.rolloffFactor = this.rolloff;
    }
}
//# sourceMappingURL=BaseWebAudioPanner.js.map