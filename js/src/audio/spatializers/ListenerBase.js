import { Destination } from "../Destination.js";
import { BaseListener } from "./BaseListener.js";

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
export class ListenerBase extends BaseListener {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {Destination} destination
     */
    constructor(destination) {
        super(destination);
        this.node = destination.audioContext.listener;
    }

    dispose() {
        this.node = null;
        super.dispose();
    }
}