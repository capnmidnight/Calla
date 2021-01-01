import { BaseWebAudioNode } from "./BaseWebAudioNode";
/**
 * Base class for spatializers that uses WebAudio's PannerNode
 **/
export declare abstract class BaseWebAudioPanner extends BaseWebAudioNode<PannerNode> {
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode);
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: DistanceModelType, transitionTime: number): void;
}
