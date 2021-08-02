import { gain, Gain } from "kudzu/audio";
import { BaseListener } from "./BaseListener";

/**
 * Base class for spatializers that uses WebAudio's AudioListener
 **/
export abstract class BaseWebAudioListener extends BaseListener {
    listener: AudioListener;

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     */
    constructor() {
        super();
        this.input
            = this.output
            = Gain("listener-volume-correction", gain(0.75));
        this.listener = this.input.context.listener;
    }

    private disposed2 = false;
    dispose(): void {
        if (!this.disposed2) {
            this.listener = null;
            super.dispose();
            this.disposed2 = true;
        }
    }
}