import { coneInnerAngle, coneOuterAngle, coneOuterGain, connect, distanceModel, Panner, panningModel } from "kudzu/audio";
import { BaseEmitter } from "./BaseEmitter";
/**
 * Base class for spatializers that uses WebAudio's PannerNode
 **/
export class BaseWebAudioPanner extends BaseEmitter {
    panner;
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param audioContext - the output WebAudio context
     */
    constructor(destination) {
        super(destination);
        this.input
            = this.output
                = this.panner
                    = Panner("listener-spatializer", panningModel("HRTF"), distanceModel("inverse"), coneInnerAngle(360), coneOuterAngle(0), coneOuterGain(0));
        connect(this, this.destination);
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