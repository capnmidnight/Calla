export class BaseAudioClient extends EventTarget {

    constructor() {
        super();
    }

    /**
     *
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of the listener.
     * @param {Point} evt
     */
    setLocalPosition(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of an audio source.
     * @param {UserPosition} evt
     */
    setUserPosition(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        throw new Error("Not implemented in base class");
    }

    /**
     * 
     * @param {string} userID
     */
    removeSource(userID) {
        throw new Error("Not implemented in base class");
    }
}