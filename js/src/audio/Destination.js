import { BaseAudioElement } from "./BaseAudioElement.js";
import { MockAudioContext } from "./MockAudioContext.js";
import { GoogleResonanceAudioScene } from "./positions/GoogleResonanceAudioScene.js";
import { InterpolatedPosition } from "./positions/InterpolatedPosition.js";
import { WebAudioNewListenerPosition } from "./positions/WebAudioNewListenerPosition.js";
import { WebAudioOldNodePosition } from "./positions/WebAudioOldNodePosition.js";
import { NewPannerSpatializer } from "./spatializers/NewPannerSpatializer.js";
import { GoogleResonanceAudioSpatializer } from "./spatializers/GoogleResonanceAudioSpatializer.js";
import { StereoSpatializer } from "./spatializers/StereoSpatializer.js";
import { VolumeOnlySpatializer } from "./spatializers/VolumeOnlySpatializer.js";
import { OldPannerSpatializer } from "./spatializers/OldPannerSpatializer.js";

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
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return this.audioContext.currentTime;
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
            this.audioContext = new AudioContext();

            if (attemptResonanceAPI) {
                try {
                    this.position = new GoogleResonanceAudioScene(this.audioContext);
                }
                catch (exp) {
                    attemptResonanceAPI = false;
                    console.warn("Resonance Audio API not available!", exp);
                }
            }

            if (!attemptResonanceAPI && isLatestWebAudioAPI) {
                try {
                    this.position = new WebAudioNewListenerPosition(this.audioContext.listener, forceInterpolatedPosition);
                }
                catch (exp) {
                    isLatestWebAudioAPI = false;
                    console.warn("No AudioListener.positionX property!", exp);
                }
            }

            if (!attemptResonanceAPI && !isLatestWebAudioAPI && hasWebAudioAPI) {
                try {
                    this.position = new WebAudioOldNodePosition(this.audioContext.listener);
                }
                catch (exp) {
                    hasWebAudioAPI = false;
                    console.warn("No WebAudio API!", exp);
                }
            }

            if (!attemptResonanceAPI && !isLatestWebAudioAPI && !hasWebAudioAPI) {
                this.audioContext = new MockAudioContext();
                this.position = new InterpolatedPosition();
            }
        }
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
        if (attemptResonanceAPI) {
            try {
                return new GoogleResonanceAudioSpatializer(id, this, audio, bufferSize);
            }
            catch (exp) {
                attemptResonanceAPI = false;
                console.warn("Resonance Audio API not available!", exp);
            }
        }

        if (!attemptResonanceAPI && hasFullSpatializer) {
            if (isLatestWebAudioAPI) {
                try {
                    return new NewPannerSpatializer(id, this, audio, bufferSize, forceInterpolatedPosition);
                }
                catch (exp) {
                    isLatestWebAudioAPI = false;
                    console.warn("No 360 spatializer support", exp);
                }
            }

            if (!isLatestWebAudioAPI) {
                try {
                    return new OldPannerSpatializer(id, this, audio, bufferSize);
                }
                catch (exp) {
                    hasFullSpatializer = false;
                    console.warn("Not even the old 360 spatializer", exp);
                }
            }
        }

        if (!attemptResonanceAPI && !hasFullSpatializer && hasWebAudioAPI) {
            try {
                return new StereoSpatializer(id, this, audio, bufferSize);
            }
            catch (exp) {
                hasWebAudioAPI = false;
                if (this.audioContext) {
                    this.dispatchEvent(contextDestroyingEvt);
                    this.audioContext.close();
                    this.audioContext = null;
                    this.position = null;
                    this.dispatchEvent(contextDestroyedEvt);
                }
                console.warn("No WebAudio API!", exp);
            }
        }

        if (!attemptResonanceAPI && !hasFullSpatializer && !hasWebAudioAPI) {
            return new VolumeOnlySpatializer(id, this, audio);
        }
    }
}