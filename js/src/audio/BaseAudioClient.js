/**
 * A base class for managers of audio sources, destinations, and their spatialization.
 **/
export class BaseAudioClient extends EventTarget {

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor() {
        super();
    }

    /** Perform the audio system initialization, after a user gesture */
    start() {
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
     * Set the audio device used to play audio to the local user.
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     */
    removeSource(id) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setLocalPosition(x, y) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setUserPosition(id, x, y) {
        throw new Error("Not implemented in base class");
    }
}