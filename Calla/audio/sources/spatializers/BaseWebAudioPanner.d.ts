import { BaseEmitter } from "./BaseEmitter";
/**
 * Base class for spatializers that uses WebAudio's PannerNode
 **/
export declare abstract class BaseWebAudioPanner extends BaseEmitter {
    protected panner: PannerNode;
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param audioContext - the output WebAudio context
     */
    constructor(destination: AudioNode);
    copyAudioProperties(from: BaseWebAudioPanner): void;
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: DistanceModelType, transitionTime: number): void;
}
