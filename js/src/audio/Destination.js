import { MockAudioContext } from "./MockAudioContext.js";
import { WebAudioOldListenerPosition } from "./positions/WebAudioOldListenerPosition.js";
import { WebAudioNewListenerPosition } from "./positions/WebAudioNewListenerPosition.js";
import { InterpolatedPosition } from "./positions/InterpolatedPosition.js";
import { VolumeOnlySpatializer } from "./spatializers/VolumeOnlySpatializer.js";
import { FullSpatializer } from "./spatializers/FullSpatializer.js";
import { StereoSpatializer } from "./spatializers/StereoSpatializer.js";
import { GoogleResonanceAudioScene } from "./positions/GoogleResonanceAudioScene.js";
import { GoogleResonanceAudioSpatializer } from "./spatializers/GoogleResonanceAudioSpatializer.js";
import { BaseAudioElement } from "./BaseAudioElement.js";

const contextDestroyingEvt = new Event("contextDestroying"),
    contextDestroyedEvt = new Event("contextDestroyed");

let hasWebAudioAPI = Object.prototype.hasOwnProperty.call(window, "AudioListener"),
    hasFullSpatializer = hasWebAudioAPI && Object.prototype.hasOwnProperty.call(AudioContext.prototype, "createPanner"),
    isLatestWebAudioAPI = hasWebAudioAPI && Object.prototype.hasOwnProperty.call(AudioListener.prototype, "positionX"),
    forceInterpolatedPosition = true,
    attemptResonanceAPI = hasWebAudioAPI;

/**
 * A manager of the audio context and listener.
 **/
export class Destination extends BaseAudioElement {

    /**
     * Creates a new manager of the audio context and listener
     **/
    constructor() {
        super(null);

        /** @type {AudioContext|MockAudioContext} */
        this.audioContext = null;
    }

    /**
     * If no audio context is currently available, creates one, and initializes the
     * spatialization of its listener.
     * 
     * If WebAudio isn't available, a mock audio context is created that provides
     * ersatz playback timing.
     **/
    createContext() {
        if (!this.audioContext) {
            try {
                if (hasWebAudioAPI) {
                    this.audioContext = new AudioContext();

                    try {
                        if (isLatestWebAudioAPI) {
                            try {
                                if (attemptResonanceAPI) {
                                    this.position = new GoogleResonanceAudioScene(this.audioContext);
                                }
                            }
                            catch (exp3) {
                                attemptResonanceAPI = false;
                                console.warn("Resonance Audio API not available!", exp3);
                            }
                            finally {
                                if (!attemptResonanceAPI) {
                                    this.position = new WebAudioNewListenerPosition(this.audioContext.listener, forceInterpolatedPosition);
                                }
                            }
                        }
                    }
                    catch (exp2) {
                        isLatestWebAudioAPI = false;
                        console.warn("No AudioListener.positionX property!", exp2);
                    }
                    finally {
                        if (!isLatestWebAudioAPI) {
                            this.position = new WebAudioOldListenerPosition(this.audioContext.listener);
                        }
                    }
                }
            }
            catch (exp1) {
                hasWebAudioAPI = false;
                console.warn("No WebAudio API!", exp1);
            }
            finally {
                if (!hasWebAudioAPI) {
                    this.audioContext = new MockAudioContext();
                    this.position = new InterpolatedPosition();
                }
            }
        }
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return this.audioContext.currentTime;
    }


    /**
     * Creates a spatializer for an audio source, and initializes its audio properties.
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @return {BaseSpatializer}
     */
    createSpatializer(userID, audio, bufferSize) {
        const spatializer = this._createSpatializer(userID, audio, bufferSize);
        if (spatializer) {
            spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
        }

        return spatializer;
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id - the user for which the audio source is being created.
     * @param {HTMLAudioElement} audio - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSpatializer}
     */
    _createSpatializer(id, audio, bufferSize) {
        if (hasWebAudioAPI) {
            try {
                if (hasFullSpatializer) {
                    try {
                        if (attemptResonanceAPI) {
                            try {
                                return new GoogleResonanceAudioSpatializer(id, this, audio, bufferSize);
                            }
                            catch (exp3) {
                                attemptResonanceAPI = false;
                                console.warn("Resonance Audio API not available!", exp3);
                            }
                        }

                        if (!attemptResonanceAPI) {
                            return new FullSpatializer(id, this, audio, bufferSize, forceInterpolatedPosition);
                        }
                    }
                    catch (exp2) {
                        hasFullSpatializer = false;
                        console.warn("No 360 spatializer support", exp2);
                    }
                }

                if (!hasFullSpatializer) {
                    return new StereoSpatializer(id, this, audio, bufferSize);
                }
            }
            catch (exp1) {
                hasWebAudioAPI = false;
                if (this.audioContext) {
                    this.dispatchEvent(contextDestroyingEvt);
                    this.audioContext.close();
                    this.audioContext = null;
                    this.position = null;
                    this.dispatchEvent(contextDestroyedEvt);
                }
                console.warn("No WebAudio API!", exp1);
            }
        }

        if (!hasWebAudioAPI) {
            return new VolumeOnlySpatializer(id, this, audio);
        }
    }
}