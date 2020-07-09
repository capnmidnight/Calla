import { InterpolatedPosition } from "../positions/InterpolatedPosition.js";
import { BaseAnalyzedSpatializer } from "./BaseAnalyzedSpatializer.js";

export class GoogleResonanceAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        const position = new InterpolatedPosition();
        const resNode = destination.position.scene.createSource({
            minDistance: destination.minDistance,
            maxDistance: destination.maxDistance
        });

        super(userID, destination, audio, position, bufferSize, resNode.input);

        this.resNode = resNode;
    }

    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioOutputDevice(minDistance, maxDistance, rolloff, transitionTime);
        this.resNode.setMinDistance(minDistance);
        this.resNode.setMaxDistance(maxDistance);
    }

    update() {
        super.update();
        this.resNode.setPosition(this.position.x, 0, this.position.y);
    }

    dispose() {
        this.resNode = null;
        super.dispose();
    }
}