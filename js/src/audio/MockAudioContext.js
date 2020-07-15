/**
 * A mocking class for providing the playback timing needed to synchronize motion and audio.
 **/
export class MockAudioContext {
    /**
     * Starts the timer at "now".
     **/
    constructor() {
        this._t = performance.now() / 1000;
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return performance.now() / 1000 - this._t;
    }

    /**
     * Returns nothing.
     * @type {AudioDestinationNode} */
    get destination() {
        return null;
    }
}
