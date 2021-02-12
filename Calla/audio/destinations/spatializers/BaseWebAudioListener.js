import { BaseListener } from "./BaseListener";
/**
 * Base class for spatializers that uses WebAudio's AudioListener
 **/
export class BaseWebAudioListener extends BaseListener {
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     */
    constructor(audioContext) {
        const gain = audioContext.createGain();
        gain.gain.value = 0.75;
        super(audioContext, gain, gain);
        this.listener = audioContext.listener;
    }
    dispose() {
        this.listener = null;
        super.dispose();
    }
}
//# sourceMappingURL=BaseWebAudioListener.js.map