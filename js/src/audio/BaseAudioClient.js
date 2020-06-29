export class BaseAudioClient extends EventTarget {

    constructor() {
        super();
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
     * @param {BaseUser} evt
     */
    removeUser(evt) {
        throw new Error("Not implemented in base class");
    }
}