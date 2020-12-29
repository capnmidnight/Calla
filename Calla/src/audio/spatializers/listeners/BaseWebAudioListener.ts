import { BaseListener } from "./BaseListener";

/**
 * Base class for spatializers that uses WebAudio's AudioListener
 **/
export abstract class BaseWebAudioListener extends BaseListener {
    protected node: AudioListener;

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     */
    constructor(audioContext: AudioContext, destination: AudioDestinationNode | MediaStreamAudioDestinationNode) {
        super(audioContext, destination);
        this.node = audioContext.listener;
        this.volume = 0.75;
    }

    dispose(): void {
        this.node = null;
        super.dispose();
    }
}