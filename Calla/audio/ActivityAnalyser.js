import { TypedEventBase } from "kudzu/events/EventBase";
import { clamp } from "kudzu/math/clamp";
import { isGoodNumber } from "kudzu/typeChecks";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { connect, disconnect } from "./GraphVisualizer";
const audioActivityEvt = new AudioActivityEvent();
const activityCounterMin = 0;
const activityCounterMax = 60;
const activityCounterThresh = 5;
function frequencyToIndex(frequency, sampleRate, bufferSize) {
    const nyquist = sampleRate / 2;
    const index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize);
}
function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate, start = frequencyToIndex(minHz, sampleRate, bufferSize), end = frequencyToIndex(maxHz, sampleRate, bufferSize), count = end - start;
    let sum = 0;
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}
export class ActivityAnalyser extends TypedEventBase {
    constructor(source, audioContext, bufferSize) {
        super();
        this.source = source;
        this.wasActive = false;
        this.analyser = null;
        if (!isGoodNumber(bufferSize)
            || bufferSize <= 0) {
            throw new Error("Buffer size must be greater than 0");
        }
        this.id = source.id;
        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);
        this.wasActive = false;
        this.activityCounter = 0;
        const checkSource = () => {
            if (source.spatializer
                && source.source) {
                this.analyser = audioContext.createAnalyser();
                this.analyser.fftSize = 2 * this.bufferSize;
                this.analyser.smoothingTimeConstant = 0.2;
                connect(source.source, this.analyser);
            }
            else {
                setTimeout(checkSource, 0);
            }
        };
        checkSource();
    }
    dispose() {
        if (this.analyser) {
            disconnect(this.source.source, this.analyser);
            this.analyser = null;
        }
        this.buffer = null;
    }
    update() {
        if (this.analyser) {
            this.analyser.getFloatFrequencyData(this.buffer);
            const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                this.activityCounter++;
            }
            else if (average < 0.5 && this.activityCounter > activityCounterMin) {
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
//# sourceMappingURL=ActivityAnalyser.js.map