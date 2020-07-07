/* global window, AudioListener, AudioContext, Event, EventTarget */

import { MockAudioContext } from "./MockAudioContext.js";
import { WebAudioOldListenerPosition } from "./positions/WebAudioOldListenerPosition.js";
import { WebAudioNewListenerPosition } from "./positions/WebAudioNewListenerPosition.js";
import { InterpolatedPosition } from "./positions/InterpolatedPosition.js";
import { VolumeOnlySpatializer } from "./spatializers/VolumeOnlySpatializer.js";
import { FullSpatializer } from "./spatializers/FullSpatializer.js";
import { StereoSpatializer } from "./spatializers/StereoSpatializer.js";
import { GoogleResonanceAudioScene } from "./positions/GoogleResonanceAudioScene.js";
import { GoogleResonanceAudioSpatializer } from "./spatializers/GoogleResonanceAudioSpatializer.js";

const forceInterpolatedPosition = false,
    contextDestroyingEvt = new Event("contextDestroying"),
    contextDestroyedEvt = new Event("contextDestroyed");

let hasWebAudioAPI = window.hasOwnProperty("AudioListener"),
    hasFullSpatializer = hasWebAudioAPI && window.hasOwnProperty("PannerNode"),
    isLatestWebAudioAPI = hasWebAudioAPI && AudioListener.prototype.hasOwnProperty("positionX"),
    attemptResonanceAPI = true;

export class Destination extends EventTarget {

    constructor() {
        super();

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        /** @type {AudioContext|MockAudioContext} */
        this.audioContext = null;

        /** @type {BasePosition} */
        this.position = null;
    }

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

    setTarget(evt) {
        this.position.setTarget(evt, this.audioContext.currentTime, this.transitionTime);
        this.update();
    }

    setAudioProperties(evt) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;
    }

    update() {
        this.position.update(this.audioContext.currentTime);
    }

    /**
     * 
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @return {BaseSpatializer}
     */
    createSpatializer(userID, audio, bufferSize) {
        try {
            if (hasWebAudioAPI) {
                try {
                    if (hasFullSpatializer) {
                        try {
                            if (attemptResonanceAPI) {
                                return new GoogleResonanceAudioSpatializer(userID, this, audio, bufferSize);
                            }
                        }
                        catch (exp3) {
                            attemptResonanceAPI = false;
                            console.warn("Resonance Audio API not available!", exp3);
                        }
                        finally {
                            if (!attemptResonanceAPI) {
                                return new FullSpatializer(userID, this, audio, bufferSize, forceInterpolatedPosition);
                            }
                        }
                    }
                }
                catch (exp2) {
                    hasFullSpatializer = false;
                    console.warn("No 360 spatializer support", exp2);
                }
                finally {
                    if (!hasFullSpatializer) {
                        return new StereoSpatializer(userID, this, audio, bufferSize);
                    }
                }
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
        finally {
            if (!hasWebAudioAPI) {
                return new VolumeOnlySpatializer(userID, this, audio);
            }
        }
    }
}