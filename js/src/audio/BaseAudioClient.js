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
     * Set audio parameters for the listener.
     * @param {any} evt
     */
    setAudioProperties(evt) {
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