import "../../../lib/resonance-audio.js";
import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";
import { BaseAnalyzedSpatializer } from "./BaseAnalyzedSpatializer.js";

/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export class GoogleResonanceAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     * @param {string} userID
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(userID, destination, stream, bufferSize) {
        const position = new InterpolatedPosition();
        const resNode = destination.position.scene.createSource();

        super(userID, destination, stream, position, bufferSize, resNode.input);

        this.resNode = resNode;
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        this.resNode.setMinDistance(minDistance);
        this.resNode.setMaxDistance(maxDistance);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();
        this.resNode.setPosition(this.position.x, 0, this.position.y);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.resNode = null;
        super.dispose();
    }
}