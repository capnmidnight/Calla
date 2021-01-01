import { BaseWebAudioNode } from "./BaseWebAudioNode";

/**
 * Base class for spatializers that uses WebAudio's PannerNode
 **/
export abstract class BaseWebAudioPanner extends BaseWebAudioNode<PannerNode> {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode) {
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
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: DistanceModelType, transitionTime: number): void {
        super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
        this.node.refDistance = this.minDistance;
        if (this.algorithm === "logarithmic") {
            algorithm = "inverse";
        }
        this.node.distanceModel = algorithm;
        this.node.rolloffFactor = this.rolloff;
    }
}