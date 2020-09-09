import { EventBase } from "../events/EventBase";
import { clamp } from "../math/clamp";
import { isGoodNumber } from "../typeChecks";
import { AudioActivityEvent } from "./AudioActivityEvent";

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
    const nyquist = sampleRate / 2;
    const index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize);
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
        count = end - start;
    let sum = 0;
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

export class ActivityAnalyser extends EventBase {
    /**
     * @param {import("./AudioSource").AudioSource} source
     * @param {AudioContext} audioContext
     * @param {number} bufferSize
     */
    constructor(source, audioContext, bufferSize) {
        super();

        if (!isGoodNumber(bufferSize)
            || bufferSize <= 0) {
            throw new Error("Buffer size must be greater than 0");
        }

        this.id = source.id;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {AnalyserNode} */
        this.analyser = null;

        const checkSource = () => {
            if (source.spatializer.source) {
                this.analyser = audioContext.createAnalyser();
                this.analyser.fftSize = 2 * this.bufferSize;
                this.analyser.smoothingTimeConstant = 0.2;
                source.spatializer.source.connect(this.analyser);
            }
            else {
                setTimeout(checkSource, 0);
            }
        };

        checkSource();
    }

    dispose() {
        this.analyser.disconnect();
        this.analyser = null;
        this.buffer = null;
    }

    update() {
        if (this.analyser) {
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
}