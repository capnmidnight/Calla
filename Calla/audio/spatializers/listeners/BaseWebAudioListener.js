import { BaseListener } from "./BaseListener";
/**
 * Base class for spatializers that uses WebAudio's AudioListener
 **/
export class BaseWebAudioListener extends BaseListener {
    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     */
    constructor(audioContext, destination) {
        super(audioContext, destination);
        this.node = audioContext.listener;
        this.volume = 0.75;
    }
    dispose() {
        this.node = null;
        super.dispose();
    }
}
//# sourceMappingURL=BaseWebAudioListener.js.map