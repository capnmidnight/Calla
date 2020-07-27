import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";
import { BaseSpatializer } from "./BaseSpatializer.js";

/**
 * A spatializer that keeps track of a muted user's position.
 **/
export class NoAudioSpatializer extends BaseSpatializer {

    /**
     * Creates a new spatializer that keeps track of a muted user's position.
     * @param {string} userID
     * @param {Destination} destination
     */
    constructor(userID, destination) {
        super(userID, destination, null, new InterpolatedPosition());
        Object.seal(this);
    }
}
