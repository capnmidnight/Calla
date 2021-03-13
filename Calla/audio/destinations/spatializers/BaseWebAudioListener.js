import { BaseListener } from "./BaseListener";
/**
 * Base class for spatializers that uses WebAudio's AudioListener
 **/
export class BaseWebAudioListener extends BaseListener {
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     */
    constructor(audioContext) {
        super(audioContext);
        this.disposed2 = false;
        const gain = audioContext.createGain();
        gain.gain.value = 0.75;
        this.input = this.output = gain;
        this.listener = audioContext.listener;
    }
    dispose() {
        if (!this.disposed2) {
            this.listener = null;
            super.dispose();
            this.disposed2 = true;
        }
    }
}
//# sourceMappingURL=BaseWebAudioListener.js.map