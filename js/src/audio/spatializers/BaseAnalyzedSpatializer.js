import { BaseSpatializer } from "./BaseSpatializer.js";
import { clamp } from "../../math.js";
import { AudioActivityEvent } from "../AudioActivityEvent.js";

let tryMediaStream = true;

const audioActivityEvt = new AudioActivityEvent(),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

/**
 * 
 * @param {number} frequency
 * @param {number} sampleRate
 * @param {number} bufferSize
 */
function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2
    var index = Math.round(frequency / nyquist * bufferSize)
    return clamp(index, 0, bufferSize)
}

/**
 * 
 * @param {AnalyserNode} analyser
 * @param {Float32Array} frequencies
 * @param {number} minHz
 * @param {number} maxHz
 * @param {number} bufferSize
 */
function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate, bufferSize),
        end = frequencyToIndex(maxHz, sampleRate, bufferSize),
        count = end - start
    let sum = 0
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

export class BaseAnalyzedSpatializer extends BaseSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode) {
        super(userID, destination, audio, position);

        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        /** @type {AnalyserNode} */
        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        /** @type {PannerNode|StereoPannerNode} */
        this.inNode = inNode;

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {MediaStream} */
        this.stream = null;

        /** @type {MediaSource} */
        this.source = null;
    }

    /**
     * @fires BaseAnalyzedSpatializer#audioActivity
     **/
    update() {
        super.update();

        if (!this.source) {
            if (tryMediaStream) {
                try {
                    if (!this.stream) {
                        this.stream = this.audio.mozCaptureStream
                            ? this.audio.mozCaptureStream()
                            : this.audio.captureStream();
                    }

                    if (this.stream.active) {
                        this.source = this.destination.audioContext.createMediaStreamSource(this.stream);
                        this.source.connect(this.analyser);
                        this.source.connect(this.inNode);
                    }
                }
                catch (exp) {
                    tryMediaStream = false;
                    console.warn("Creating the media stream failed. Reason: ", exp);
                }
            }

            if (!tryMediaStream) {
                try {
                    this.source = this.destination.audioContext.createMediaElementSource(this.audio);
                    this.source.connect(this.analyser);
                    this.source.connect(this.inNode);
                }
                catch (exp) {
                    console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
                }
            }
        }

        if (this.source) {
            this.analyser.getFloatFrequencyData(this.buffer);

            const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                this.activityCounter++;
            } else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                this.activityCounter--;
            }

            const isActive = this.activityCounter > activityCounterThresh;
            if (this.wasActive !== isActive) {
                this.wasActive = isActive;
                audioActivityEvt.id = this.id;
                audioActivityEvt.isActive = isActive;
                this.dispatchEvent(audioActivityEvt);
            }
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.inNode);
        }

        this.source = null;
        this.stream = null;
        this.inNode = null;
        this.analyser = null;
        this.buffer = null;

        super.dispose();
    }
}