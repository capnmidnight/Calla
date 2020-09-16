import { BaseListener } from "./BaseListener";

/**
 * A spatializer that uses WebAudio's AudioListener
 **/
export class AudioListenerBase extends BaseListener {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super();
        this.node = listener;
    }

    dispose() {
        this.node = null;
        super.dispose();
    }
}