import { BaseWebAudioNode } from "./BaseWebAudioNode";
/**
 * Base class for spatializers that uses WebAudio's PannerNode
 **/
export class BaseWebAudioPanner extends BaseWebAudioNode {
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     */
    constructor(id, source, audioContext, destination) {
        const panner = audioContext.createPanner();
        super(id, source, audioContext, panner);
        this.node.panningModel = "HRTF";
        this.node.distanceModel = "inverse";
        this.node.coneInnerAngle = 360;
        this.node.coneOuterAngle = 0;
        this.node.coneOuterGain = 0;
        this.node.connect(destination);
    }
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
        this.node.refDistance = this.minDistance;
        if (this.algorithm === "logarithmic") {
            algorithm = "inverse";
        }
        this.node.distanceModel = algorithm;
        this.node.rolloffFactor = this.rolloff;
    }
}
//# sourceMappingURL=BaseWebAudioPanner.js.map