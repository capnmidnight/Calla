//import { Destination } from "../Destination.js";
import { InterpolatedPose } from "../positions/InterpolatedPose.js";

/** Base class providing functionality for spatializers. */
export class BaseSpatializer extends EventTarget {

    /**
     * Creates a spatializer that keeps track of position
     * @param {Destination} destination
     */
    constructor(destination) {
        super();
        this.destination = destination;
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.destination = null;
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {InterpolatedPose} pose
     **/
    update(pose) {
    }
}

